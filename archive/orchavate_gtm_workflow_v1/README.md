# Orchavate Digital Accessibility GTM Workflow Platform

An end-to-end automated **Digital Accessibility Auditing & Outreach Pipeline** for SEBI-registered companies and corporate enterprises.

## Primary Workflow (`orchavate_gtm_workflow/`)

The core active platform resides under `orchavate_gtm_workflow/`. It programmatically evaluates target company websites against **WCAG 2.1 A/AA standards**, extracts email contact details, captures visual screenshot proof of accessibility violations, and exports complete audit data into native Excel (`.xlsx`) and CSV master trackers.

### Features
- **Direct Target Ingestion:** Ingests target company lists from Excel (`.xlsx`, `.xls`), CSV (`.csv`), or JSON (`.json`) files.
- **Target Page Filtering:** Discovers public target pages (**Homepage**, **About**, **Contact**, **Investor Relations**, **Annual Report/PDF**).
- **Dual Audit Engine:** Programmatic execution of `@axe-core/playwright` and `Lighthouse` (0–100 score).
- **Categorized Violations:** Maps findings into 4 key WCAG buckets:
  1. Missing Alt Text
  2. Color Contrast Failures
  3. Form & Structural Labels
  4. Keyboard Navigation
- **Visual Evidence Capture:** Bounding-box element clipping and page overviews (`[CompanyName]_[PageName]_[IssueType].png`).
- **Master Tracker Writeback:** Automatic generation of `Simple_Accessibility_Outreach_Tracker.xlsx` and `.csv`.
- **Inaccessible Domain Logging:** Cleanly captures unreachable websites and network blocks in `outputs/searched_not_found/`.

---

## Quick Start

### Run Audit Pipeline
```bash
# Run with default targets.json or targets.xlsx file
npm start

# Or run with a custom Excel / CSV input file
npx tsx orchavate_gtm_workflow/src/cli.ts --input Registered_Mutual_Funds_Enriched.xlsx
```

---

## Output Architecture

All audit deliverables land cleanly in `orchavate_gtm_workflow/outputs/`:
- **`outputs/tracker/`**: `Simple_Accessibility_Outreach_Tracker.xlsx` & `.csv`
- **`outputs/scans/`**: Detailed JSON audit payloads per company
- **`outputs/screenshots/`**: Cropped visual evidence `.png` files
- **`outputs/searched_not_found/`**: Inaccessible domain logs (`inaccessible_websites.log` & `.json`)

---

## Archive

Legacy code, experimental modules, and historical benchmarks have been shifted to `archive/` to keep the codebase clean and focused.
