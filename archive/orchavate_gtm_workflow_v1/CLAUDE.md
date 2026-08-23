# Orchavate Digital Accessibility GTM Workflow

This repository module implements an automated **Digital Accessibility Auditing & Outreach Pipeline** for SEBI-registered companies and corporate enterprises.

## Core Capabilities
- **SEBI & Target Ingestion:** Parses company list / CSV / Excel file or downloads SEBI registry data.
- **Target Page Discovery:** Identifies public pages (Homepage, About, Contact, Investor Relations, Annual Report/PDF) with auth guardrails.
- **Dual-Engine Audit Execution:** Runs @axe-core/playwright (WCAG 2.1 A/AA) and Lighthouse (0–100 score), plus WAVE API check integrations.
- **Visual Screenshot Evidence:** Captures element-level bounding box clippings saved as [CompanyName]_[PageName]_[IssueType].png.
- **Master Tracker Update:** Writes back scan metrics, email contacts, and screenshot links to Simple_Accessibility_Outreach_Tracker.xlsx.
- **Categorized Folder Outputs:**
  - outputs/searched_not_found/: Logs inaccessible or unreachable websites.
  - outputs/scans/: Stores raw JSON audit payloads & Lighthouse scores.
  - outputs/screenshots/: Stores cropped .png visual evidence.
  - outputs/tracker/: Stores updated Excel/CSV trackers.

## Usage
Run the pipeline via CLI:
\\\ash
npx ts-node orchavate_gtm_workflow/src/cli.ts --input SEBI_Listed_Companies.csv
\\\
