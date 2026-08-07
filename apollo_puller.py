#!/usr/bin/env python3
import os
import sys
import argparse
import requests
import pandas as pd

def get_apollo_api_key():
    """Extract Apollo API key from env, .env file, or interactive prompt."""
    api_key = os.getenv("APOLLO_API_KEY") or os.getenv("APOLLO_KEY")
    if not api_key and os.path.exists(".env"):
        with open(".env", "r", encoding="utf-8") as f:
            for line in f:
                if line.startswith("APOLLO_API_KEY=") or line.startswith("APOLLO_KEY="):
                    api_key = line.split("=", 1)[1].strip().strip("'\"")
                    break

    if not api_key and sys.stdin.isatty():
        print("\n=====================================================")
        print("🔑 Apollo API Key Required")
        print("=====================================================\n")
        api_key = input("Enter your Apollo API Key: ").strip().strip("'\"")
        if api_key:
            os.environ["APOLLO_API_KEY"] = api_key
            try:
                with open(".env", "a", encoding="utf-8") as f:
                    f.write(f"\nAPOLLO_API_KEY={api_key}\n")
                print("✓ Saved Apollo API key securely to .env file.")
            except Exception:
                pass

    return api_key

def mask_key(key):
    if not key:
        return "NOT_CONFIGURED"
    if len(key) <= 8:
        return "****"
    return f"{key[:3]}****{key[-4:]}"

def match_apollo_person(api_key, company_name, domain=""):
    """Query Apollo people/match API for a specific company."""
    url = "https://api.apollo.io/v1/people/match"
    headers = {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "X-Api-Key": api_key
    }
    
    clean_domain = domain.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0] if domain else ""
    payload = {
        "organization_name": company_name,
        "domain": clean_domain
    }
    
    try:
        res = requests.post(url, headers=headers, json=payload, timeout=10)
        if res.status_code == 403 and "Free plan" in res.text:
            if not getattr(match_apollo_person, "_warned", False):
                print(f"\n⚠️ APOLLO API PLAN RESTRICTION: The provided API Key is on an Apollo Free Plan.")
                print(f"   Apollo blocks 'people/match' API endpoint on Free plans (requires a paid Apollo plan).")
                print(f"   Apollo Response: {res.json().get('error')}\n")
                match_apollo_person._warned = True
        elif res.ok:
            person = res.json().get("person", {})
            if person:
                first = person.get("first_name", "")
                last = person.get("last_name", "")
                name = f"{first} {last}".strip() or person.get("name", "N/A")
                title = person.get("title", "N/A")
                email = person.get("email", "Not Found")
                return {"name": name, "title": title, "email": email}
    except Exception:
        pass
    
    return {"name": "N/A", "title": "N/A", "email": "Not Found"}

def enrich_input_excel(api_key, input_path):
    """Read any input Excel file, enrich every company row with Apollo contacts, and save incrementally."""
    print(f"\n=====================================================")
    print(f"🚀 Enriching Dataset with Apollo API: '{input_path}'")
    print(f"└─ Apollo API Key: {mask_key(api_key)}")
    print(f"=====================================================\n")

    if input_path.endswith(".csv"):
        df_in = pd.read_csv(input_path)
    else:
        df_in = pd.read_excel(input_path)

    # Locate Company Name and Website columns
    comp_col = next((col for col in df_in.columns if "company" in col.lower() or "name" in col.lower()), df_in.columns[0])
    web_col = next((col for col in df_in.columns if "website" in col.lower() or "domain" in col.lower() or "url" in col.lower()), None)

    base_name = os.path.splitext(os.path.basename(input_path))[0]
    out_excel = os.path.abspath(f"{base_name}_apollo_enriched.xlsx")
    out_csv = os.path.abspath(f"{base_name}_apollo_enriched.csv")

    rows = []
    total = len(df_in)
    
    def save_progress():
        if rows:
            df_out = pd.DataFrame(rows)
            df_out.to_csv(out_csv, index=False)
            df_out.to_excel(out_excel, index=False)

    try:
        for idx, row in df_in.iterrows():
            comp_name = str(row[comp_col]).strip()
            website = str(row[web_col]).strip() if web_col and pd.notna(row[web_col]) else "N/A"
            
            print(f"[{idx + 1}/{total}] Matching Apollo POC for: '{comp_name}'...")
            poc = match_apollo_person(api_key, comp_name, website)
            
            rows.append({
                "Sr. No.": idx + 1,
                "Assigned To": str(row.get("Assigned To", "Unassigned")),
                "Company Name": comp_name,
                "Website": website,
                "Website Verified": "Yes" if website != "N/A" else "No",
                "Scan Completed": "No",
                "Screenshot Taken": "No",
                "Wave Score": 0,
                "Axe Score": 0,
                "LH Score": 0,
                "Screenshot link": "N/A",
                "Contact Person 1": poc["name"],
                "Designation 1": poc["title"],
                "Email ID 1": poc["email"],
                "Contact Person 2": "N/A",
                "Designation 2": "N/A",
                "Email ID 2": "Not Found"
            })

            # Incremental Autosave every row
            save_progress()

    except KeyboardInterrupt:
        print(f"\n\n⚠️ Interrupted by user! Saving {len(rows)} processed records before exiting...")
        save_progress()
        print(f"\n=====================================================")
        print(f"💾 SAVED PROGRESS ({len(rows)} rows):")
        print(f"📊 Excel: {out_excel}")
        print(f"📑 CSV: {out_csv}")
        print(f"=====================================================\n")
        sys.exit(0)

    save_progress()
    print(f"\n=====================================================")
    print(f"🎉 Success! Fully Enriched {len(rows)} company rows from Apollo.")
    print(f"📊 Exported Excel: {out_excel}")
    print(f"📑 Exported CSV: {out_csv}")
    print(f"=====================================================\n")

def pull_apollo_contacts(api_key, per_page=100):
    """Fetch contacts from Apollo API search and map directly to 17-column Master Tracker schema."""
    url = "https://api.apollo.io/v1/contacts/search"
    headers = {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "X-Api-Key": api_key
    }
    payload = {"per_page": per_page}

    print(f"\n🔍 [Apollo Puller] Querying Apollo Contacts API...")
    print(f"  └─ Apollo API Key: {mask_key(api_key)}")

    response = requests.post(url, headers=headers, json=payload, timeout=30)
    if response.status_code == 404:
        url = "https://api.apollo.io/v1/mixed_people/search"
        payload = {"per_page": per_page}
        response = requests.post(url, headers=headers, json=payload, timeout=30)

    response.raise_for_status()
    res_data = response.json()
    contacts = res_data.get("contacts", []) or res_data.get("people", [])
    print(f"✓ Successfully fetched {len(contacts)} contacts from Apollo API.")

    rows = []
    for idx, c in enumerate(contacts, start=1):
        org = c.get("organization", {}) or c.get("account", {}) or {}
        comp_name = org.get("name") or c.get("organization_name") or ""
        website = org.get("website_url") or org.get("primary_domain") or c.get("domain") or ""
        first_name = c.get("first_name", "") or ""
        last_name = c.get("last_name", "") or ""
        person_name = f"{first_name} {last_name}".strip() or c.get("name", "N/A")
        title = c.get("title") or "N/A"
        email = c.get("email") or "Not Found"

        rows.append({
            "Sr. No.": idx,
            "Assigned To": "Unassigned",
            "Company Name": comp_name,
            "Website": website if website else "N/A",
            "Website Verified": "Yes" if website else "No",
            "Scan Completed": "No",
            "Screenshot Taken": "No",
            "Wave Score": 0,
            "Axe Score": 0,
            "LH Score": 0,
            "Screenshot link": "N/A",
            "Contact Person 1": person_name,
            "Designation 1": title,
            "Email ID 1": email,
            "Contact Person 2": "N/A",
            "Designation 2": "N/A",
            "Email ID 2": "Not Found"
        })

    return rows

def main():
    parser = argparse.ArgumentParser(description="Apollo API Excel Contact Enricher")
    parser.add_argument("--input", help="Path to input Excel or CSV file containing companies to enrich")
    parser.add_argument("--key", help="Apollo API Key")
    args = parser.parse_args()

    api_key = args.key or get_apollo_api_key()
    if not api_key:
        print("❌ Error: Apollo API Key is required. Set APOLLO_API_KEY in .env or pass --key.")
        sys.exit(1)

    try:
        if args.input and os.path.exists(args.input):
            enrich_input_excel(api_key, args.input)
        else:
            rows = pull_apollo_contacts(api_key, per_page=100)
            df = pd.DataFrame(rows)
            df.to_excel("apollo_audit_leads.xlsx", index=False)
            df.to_csv("apollo_audit_leads.csv", index=False)
            print("✓ Saved Apollo contacts to apollo_audit_leads.xlsx & apollo_audit_leads.csv")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
