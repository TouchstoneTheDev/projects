#!/usr/bin/env python3
"""InfoHarvester: Zyte-backed SEBI POC scraper.

Reads a CSV of SEBI-listed companies, crawls each company's website and a
small set of relevant sub-pages, extracts up to two contacts, and writes an
updated CSV with the original columns preserved.
"""

from __future__ import annotations

import argparse
import base64
import dataclasses
import logging
import os
import re
import sys
import time
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from typing import Iterable, List, Optional
from urllib.parse import urljoin, urlparse
from pathlib import Path

import pandas as pd
import requests
from bs4 import BeautifulSoup


LOGGER = logging.getLogger("infoharvester")

TARGET_HEADERS = [
    "Contact Person 1",
    "Designation 1",
    "Email ID 1",
    "Contact Person 2",
    "Designation 2",
    "Email ID 2",
]

PRIMARY_ROLE_PATTERNS = [
    (r"accessibility\s+(?:nodal\s+)?officer", 100, "Nodal Officer for Accessibility"),
    (r"nodal\s+officer", 98, "Nodal Officer for Accessibility"),
    (r"accessibility\s+officer", 95, "Nodal Officer for Accessibility"),
    (r"digital\s+accessibility\s+officer", 95, "Nodal Officer for Accessibility"),
    (r"compliance\s+officer", 85, "Compliance Officer / Head of Compliance"),
    (r"head\s+of\s+compliance", 85, "Compliance Officer / Head of Compliance"),
    (r"company\s+secretary", 82, "Compliance Officer / Head of Compliance"),
    (r"legal\s+head", 80, "Legal Head / General Counsel"),
    (r"general\s+counsel", 80, "Legal Head / General Counsel"),
    (r"chief\s+executive\s+officer|\bceo\b", 60, "CEO / Chief Executive Officer"),
    (r"founder", 50, "Founder"),
]

TARGET_PAGE_KEYWORDS = [
    "contact",
    "contact-us",
    "about",
    "about-us",
    "investor",
    "investors",
    "investor-relations",
    "corporate-governance",
    "governance",
    "leadership",
    "management",
    "team",
    "board",
    "director",
    "secretarial",
    "compliance",
    "legal",
    "policy",
    "annual-report",
    "annual-reports",
]

SKIP_HREF_PREFIXES = ("mailto:", "tel:", "javascript:", "#")

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
TITLE_PAIR_RE = re.compile(
    r"(?P<name>[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){1,3})\s*[-–|,:]\s*"
    r"(?P<title>Accessibility\s+(?:Nodal\s+)?Officer|Digital\s+Accessibility\s+Officer|"
    r"Compliance\s+Officer|Head\s+of\s+Compliance|Company\s+Secretary|Legal\s+Head|"
    r"General\s+Counsel|Chief\s+Executive\s+Officer|CEO|Founder)",
    re.IGNORECASE,
)
HONORIFIC_NAME_RE = re.compile(
    r"(?:Mr\.|Ms\.|Mrs\.|Dr\.|Shri|Smt\.)\s+(?P<name>[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){1,3})",
    re.IGNORECASE,
)


@dataclass
class POCCandidate:
    name: str
    designation: str
    email: str
    source_url: str
    score: int


class ZyteClient:
    """Minimal Zyte API client using the standard extract endpoint.

    The implementation uses direct HTTP requests so it works in any Python
    environment. It still relies on Zyte for anti-bot handling and rendering.
    """

    def __init__(self, api_key: str, timeout: int = 40):
        self.api_key = api_key.strip()
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Basic {base64.b64encode(f'{self.api_key}:'.encode()).decode()}",
            "Content-Type": "application/json",
            "User-Agent": "infoharvester/1.0",
        })

    @classmethod
    def from_env(cls) -> "ZyteClient":
        api_key = os.getenv("ZYTE_API_KEY") or os.getenv("ZYTE_KEY") or ""
        if not api_key and os.path.exists(".env"):
            try:
                with open(".env", "r", encoding="utf-8") as handle:
                    for line in handle:
                        if line.startswith("ZYTE_API_KEY=") or line.startswith("ZYTE_KEY="):
                            api_key = line.split("=", 1)[1].strip().strip("'\"")
                            break
            except OSError:
                pass
        return cls(api_key=api_key)

    def _extract(self, payload: dict) -> dict:
        response = self.session.post(
            "https://api.zyte.com/v1/extract",
            json=payload,
            timeout=self.timeout,
        )
        if response.status_code == 401:
            raise RuntimeError("Zyte authentication failed. Check ZYTE_API_KEY.")
        response.raise_for_status()
        return response.json()

    def fetch_html(self, url: str) -> str:
        if not url:
            return ""
        try:
            data = self._extract({"url": url, "httpResponseBody": True})
            body = data.get("httpResponseBody")
            if body:
                return base64.b64decode(body).decode("utf-8", errors="ignore")
            return ""
        except Exception as exc:
            LOGGER.debug("httpResponseBody fetch failed for %s: %s", url, exc)
            try:
                data = self._extract({"url": url, "browserHtml": True})
                return data.get("browserHtml", "") or ""
            except Exception as exc2:
                LOGGER.debug("browserHtml fetch failed for %s: %s", url, exc2)
                return ""

    def search(self, query: str) -> list[dict]:
        if not query:
            return []
        try:
            data = self._extract(
                {
                    "url": f"https://www.google.com/search?q={requests.utils.quote(query)}",
                    "serp": True,
                    "serpOptions": {"extractFrom": "httpResponseBody"},
                }
            )
            organic = data.get("serp", {}).get("organicResults", []) or []
            results = []
            for item in organic:
                url = item.get("url") or item.get("link") or ""
                if url.startswith("http"):
                    results.append({"url": url, "title": item.get("name") or item.get("title") or ""})
            return results
        except Exception as exc:
            LOGGER.debug("Zyte search failed for %r: %s", query, exc)
            return []


def load_input_csv(path: str) -> pd.DataFrame:
    df = pd.read_csv(path, dtype=str, keep_default_na=False)
    for header in TARGET_HEADERS:
        if header not in df.columns:
            df[header] = ""
    return df


def normalize_url(raw: str) -> str:
    value = (raw or "").strip()
    if not value or value.lower() in {"n/a", "not found"}:
        return ""
    if not value.startswith(("http://", "https://")):
        value = f"https://{value}"
    parsed = urlparse(value)
    scheme = parsed.scheme or "https"
    netloc = parsed.netloc or parsed.path
    path = parsed.path if parsed.netloc else ""
    return f"{scheme}://{netloc}{path}".rstrip("/")


def canonical_host(url: str) -> str:
    parsed = urlparse(url)
    host = parsed.netloc.lower().strip()
    if host.startswith("www."):
        host = host[4:]
    return host


def score_title(title: str) -> tuple[int, str]:
    title_l = (title or "").lower()
    best_score = 0
    best_label = title.strip()
    for pattern, score, label in PRIMARY_ROLE_PATTERNS:
        if re.search(pattern, title_l, flags=re.IGNORECASE):
            if score > best_score:
                best_score = score
                best_label = label
    return best_score, best_label


def extract_emails(text: str) -> list[str]:
    if not text:
        return []
    emails = []
    for email in EMAIL_RE.findall(text):
        lower = email.lower()
        if any(lower.startswith(prefix) for prefix in ("noreply@", "no-reply@")):
            continue
        if lower.endswith((".png", ".jpg", ".jpeg", ".gif", ".webp")):
            continue
        emails.append(email)
    return sorted(set(emails))


def extract_names_and_titles(text: str) -> list[tuple[str, str, int]]:
    if not text:
        return []

    candidates: list[tuple[str, str, int]] = []
    for match in TITLE_PAIR_RE.finditer(text):
        name = re.sub(r"\s+", " ", match.group("name")).strip()
        title = re.sub(r"\s+", " ", match.group("title")).strip()
        score, label = score_title(title)
        if name and score:
            candidates.append((name, label, score))

    for match in HONORIFIC_NAME_RE.finditer(text):
        name = re.sub(r"\s+", " ", match.group("name")).strip()
        if name:
            candidates.append((name, "", 10))

    return candidates


def page_to_candidates(text: str, source_url: str, default_label: str) -> list[POCCandidate]:
    if not text:
        return []

    text = re.sub(r"\s+", " ", text)
    emails = extract_emails(text)
    email_cycle = emails or [""]

    raw_candidates = extract_names_and_titles(text)
    results: list[POCCandidate] = []

    if raw_candidates:
        for idx, (name, title, score) in enumerate(raw_candidates[:3]):
            results.append(
                POCCandidate(
                    name=name,
                    designation=title or default_label,
                    email=email_cycle[min(idx, len(email_cycle) - 1)] or "Not publicly disclosed",
                    source_url=source_url,
                    score=score,
                )
            )
    elif emails:
        for idx, email in enumerate(emails[:2]):
            results.append(
                POCCandidate(
                    name=f"Compliance Contact {idx + 1}",
                    designation=default_label,
                    email=email,
                    source_url=source_url,
                    score=35,
                )
            )

    return results


def discover_internal_links(html: str, base_url: str) -> list[str]:
    if not html or not base_url:
        return []

    soup = BeautifulSoup(html, "html.parser")
    base_host = canonical_host(base_url)
    discovered: list[str] = []

    for anchor in soup.find_all("a", href=True):
        href = anchor["href"].strip()
        if not href or href.startswith(SKIP_HREF_PREFIXES):
            continue

        absolute = urljoin(base_url, href)
        parsed = urlparse(absolute)
        host = canonical_host(absolute)
        if not host or host != base_host:
            continue

        url_text = absolute.lower()
        anchor_text = anchor.get_text(" ", strip=True).lower()
        if any(keyword in url_text or keyword in anchor_text for keyword in TARGET_PAGE_KEYWORDS):
            discovered.append(absolute.split("#", 1)[0].rstrip("/"))

    # Keep the crawl tight and focused.
    unique = []
    seen = set()
    for url in discovered:
        if url not in seen:
            seen.add(url)
            unique.append(url)
    return unique[:10]


def candidate_key(candidate: POCCandidate) -> tuple[str, str]:
    return (candidate.name.lower().strip(), candidate.designation.lower().strip())


def merge_candidate(store: dict[tuple[str, str], POCCandidate], candidate: POCCandidate) -> None:
    key = candidate_key(candidate)
    existing = store.get(key)
    if existing is None or candidate.score > existing.score:
        store[key] = candidate


def crawl_company(client: ZyteClient, company_name: str, website: str) -> list[POCCandidate]:
    website = normalize_url(website)
    host = canonical_host(website)
    if not website or not host:
        return []

    search_queries = [
        f'site:{host}',
        f'site:{host} contact',
        f'site:{host} investor relations',
        f'site:{host} corporate governance',
        f'site:{host} compliance officer',
        f'{company_name} nodal officer accessibility',
        f'{company_name} compliance officer',
        f'{company_name} company secretary',
        f'{company_name} legal head',
        f'{company_name} CEO',
    ]

    candidate_map: dict[tuple[str, str], POCCandidate] = {}
    visited: set[str] = set()

    def fetch_and_parse(url: str, label: str) -> None:
        if not url or url in visited:
            return
        visited.add(url)
        html = client.fetch_html(url)
        if not html:
            return
        for candidate in page_to_candidates(html, url, label):
            merge_candidate(candidate_map, candidate)

        for link in discover_internal_links(html, url):
            if link not in visited:
                linked_html = client.fetch_html(link)
                if not linked_html:
                    continue
                for candidate in page_to_candidates(linked_html, link, label):
                    merge_candidate(candidate_map, candidate)

    # Base pages first.
    for path in ["", "/contact", "/contact-us", "/investor-relations", "/corporate-governance", "/about-us", "/about", "/management", "/leadership"]:
        fetch_and_parse(urljoin(website + "/", path.lstrip("/")), "Nodal Officer for Accessibility")

    # Zyte search results next.
    for query in search_queries:
        for result in client.search(query)[:4]:
            fetch_and_parse(result["url"], "Nodal Officer for Accessibility")

        # Short-circuit once we have at least two decent contacts.
        if len(candidate_map) >= 2:
            break

    ranked = sorted(candidate_map.values(), key=lambda item: item.score, reverse=True)
    return ranked[:2]


def write_results(df: pd.DataFrame, output_path: str) -> str:
    output_path = str(Path(output_path).expanduser().resolve())
    df.to_csv(output_path, index=False)
    return output_path


def ensure_output_columns(df: pd.DataFrame) -> pd.DataFrame:
    for header in TARGET_HEADERS:
        if header not in df.columns:
            df[header] = ""
    return df


def process_row(client: ZyteClient, row: pd.Series) -> dict:
    company_name = str(row.get("Company Name", "")).strip()
    website = str(row.get("Website", "")).strip()
    result = {
        "Contact Person 1": "",
        "Designation 1": "",
        "Email ID 1": "",
        "Contact Person 2": "",
        "Designation 2": "",
        "Email ID 2": "",
    }

    try:
        pocs = crawl_company(client, company_name, website)
        if pocs:
            result["Contact Person 1"] = pocs[0].name
            result["Designation 1"] = pocs[0].designation
            result["Email ID 1"] = pocs[0].email
        if len(pocs) > 1:
            result["Contact Person 2"] = pocs[1].name
            result["Designation 2"] = pocs[1].designation
            result["Email ID 2"] = pocs[1].email
    except Exception as exc:
        LOGGER.warning("Failed to process %s: %s", company_name, exc)

    return result


def parse_args(argv: Optional[Iterable[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="InfoHarvester - SEBI-listed company POC scraper")
    parser.add_argument("input_csv", help="Path to the input CSV")
    parser.add_argument(
        "--output",
        default="infoharvester_results.csv",
        help="Path to the output CSV (default: infoharvester_results.csv)",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=1,
        help="Number of worker threads to use (default: 1 for safer crawling)",
    )
    parser.add_argument(
        "--save-every",
        type=int,
        default=1,
        help="Persist results after every N rows (default: 1)",
    )
    parser.add_argument(
        "--log-level",
        default="INFO",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        help="Logging verbosity",
    )
    return parser.parse_args(argv)


def main(argv: Optional[Iterable[str]] = None) -> int:
    args = parse_args(argv)
    logging.basicConfig(
        level=getattr(logging, args.log_level),
        format="%(asctime)s | %(levelname)s | %(message)s",
    )

    if not os.path.exists(args.input_csv):
        LOGGER.error("Input file does not exist: %s", args.input_csv)
        return 1

    client = ZyteClient.from_env()
    if not client.api_key:
        LOGGER.error("ZYTE_API_KEY is missing. Set it in the environment or .env.")
        return 1

    df = ensure_output_columns(load_input_csv(args.input_csv))
    total = len(df)
    LOGGER.info("Loaded %s rows from %s", total, args.input_csv)

    saved_paths: list[str] = []

    if args.workers < 1:
        args.workers = 1

    processed = 0

    if args.workers == 1:
        for idx, row in df.iterrows():
            result = process_row(client, row)
            for key, value in result.items():
                df.at[idx, key] = value
            processed += 1
            if processed % max(args.save_every, 1) == 0:
                saved_path = write_results(df, args.output)
                if saved_path not in saved_paths:
                    saved_paths.append(saved_path)
                LOGGER.info("Saved progress to %s (%s/%s rows)", saved_path, processed, total)
    else:
        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            future_map = {executor.submit(process_row, client, row): idx for idx, row in df.iterrows()}
            for future in as_completed(future_map):
                idx = future_map[future]
                result = future.result()
                for key, value in result.items():
                    df.at[idx, key] = value
                processed += 1
                if processed % max(args.save_every, 1) == 0:
                    saved_path = write_results(df, args.output)
                    if saved_path not in saved_paths:
                        saved_paths.append(saved_path)
                    LOGGER.info("Saved progress to %s (%s/%s rows)", saved_path, processed, total)

    final_path = write_results(df, args.output)
    if final_path not in saved_paths:
        saved_paths.append(final_path)

    LOGGER.info("Done. Wrote %s rows to %s", len(df), final_path)
    print("\nSaved files:")
    for path in saved_paths:
        print(f"- {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())