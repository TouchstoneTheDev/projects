# Digital Accessibility Outreach Platform

This repository is a bootstrap for a Node.js and TypeScript platform that automates accessibility assessment for SEBI-registered companies.

## Goals

- Ingest SEBI company master list
- Verify public-facing websites
- Discover contact information
- Execute deterministic accessibility scans with Axe Core and Lighthouse
- Capture screenshots of findings
- Generate deterministic reports in JSON/Markdown/HTML
- Update the master tracker automatically
- Reserve WAVE for manual spot checks only

## Project structure

- `src/core` - config, logger, errors, constants
- `src/modules` - domain modules for SEBI, website verification, contacts, accessibility, reports, tracker
- `src/services` - shared services
- `src/utils` - utility helpers
- `src/types` - shared type definitions
- `src/scripts` - CLI and workflow entrypoints
- `tests` - unit and integration tests
- `output` - generated reports, screenshots, and artifacts
- `logs` - structured runtime logs

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Run lint:
   ```bash
   npm run lint
   ```

## Notes

- The automated pipeline uses Playwright, Axe Core, and Lighthouse.
- WAVE is intentionally excluded from the automated flow and reserved for ad-hoc manual checks.
- Modules are scaffolded for future implementation.

## Usage

- Run the CLI to scan companies listed in a tracker file:

```
npm run build && node dist/cli.js --tracker path/to/master-tracker.xlsx
```

- Environment variables:
   - `ANTHROPIC_API_KEY` or `CLAUDE_API_KEY` — optional; when set the tool will call Anthropic/Claude to produce an executive summary for each report.

- WAVE manual flow: the tool generates a per-company WAVE manual checklist in `output/wave/<company>.md` to assist manual spot checks.
