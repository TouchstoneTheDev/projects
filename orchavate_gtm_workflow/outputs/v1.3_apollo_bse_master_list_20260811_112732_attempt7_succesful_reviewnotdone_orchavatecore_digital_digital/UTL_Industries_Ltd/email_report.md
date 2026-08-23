# Accessibility & GTM Outreach Audit Report — UTL Industries Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `33`  
> **Verified Contact Email:** `difusion@utleon.edu.mx`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `difusion@utleon.edu.mx` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **33 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `3` | Serious: `28` | Moderate: `2`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 1 violations
- 🎨 **Color Contrast Failures:** 11 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (1 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Color Contrast Ratios (11 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** UTL Industries Ltd
- **Resolved URL:** [https://utleon.edu.mx](https://utleon.edu.mx)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `difusion@utleon.edu.mx` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `difusion@utleon.edu.mx` | **Status:** `Verified` | **Source Page:** https://utleon.edu.mx

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] aria-allowed-attr`** (CRITICAL)
   - **Help:** Elements must only use supported ARIA attributes
   - **Selector:** `div[aria-haspopup="true"]`
2. **`[other] aria-progressbar-name`** (SERIOUS)
   - **Help:** ARIA progressbar nodes must have an accessible name
   - **Selector:** `.v-progress-circular--visible.v-progress-circular.v-progress-circular--indeterminate`
3. **`[other] aria-progressbar-name`** (SERIOUS)
   - **Help:** ARIA progressbar nodes must have an accessible name
   - **Selector:** `.v-progress-circular--visible.v-progress-circular.v-progress-circular--indeterminate`
4. **`[other] aria-progressbar-name`** (SERIOUS)
   - **Help:** ARIA progressbar nodes must have an accessible name
   - **Selector:** `.v-progress-circular--visible.v-progress-circular.v-progress-circular--indeterminate`
5. **`[other] aria-progressbar-name`** (SERIOUS)
   - **Help:** ARIA progressbar nodes must have an accessible name
   - **Selector:** `.col-8.col:nth-child(3) > .rounded-lg.v-image.v-responsive > .v-image__placeholder > .ma-0.loader-imagen.align-center > .v-progress-circular.v-progress-circular--indeterminate.grey--text`
6. **`[other] aria-progressbar-name`** (SERIOUS)
   - **Help:** ARIA progressbar nodes must have an accessible name
   - **Selector:** `.col-md-6.col-12:nth-child(2) > .row--dense.row > .col-4.align-center.col > .row--dense.row:nth-child(1) > .col-12.col > .rounded-lg.v-image.v-responsive > .v-image__placeholder > .ma-0.loader-imagen.align-center > .v-progress-circular.v-progress-circular--indeterminate.grey--text`
7. **`[other] aria-progressbar-name`** (SERIOUS)
   - **Help:** ARIA progressbar nodes must have an accessible name
   - **Selector:** `.col-md-6.col-12:nth-child(2) > .row--dense.row > .col-4.align-center.col > .row--dense.row:nth-child(2) > .col-12.col > .rounded-lg.v-image.v-responsive > .v-image__placeholder > .ma-0.loader-imagen.align-center > .v-progress-circular.v-progress-circular--indeterminate.grey--text`
8. **`[other] aria-progressbar-name`** (SERIOUS)
   - **Help:** ARIA progressbar nodes must have an accessible name
   - **Selector:** `.col-md-2.col-12 > .rounded-lg.v-image.v-responsive > .v-image__placeholder > .ma-0.loader-imagen.align-center > .v-progress-circular.v-progress-circular--indeterminate.grey--text`
9. **`[other] aria-progressbar-name`** (SERIOUS)
   - **Help:** ARIA progressbar nodes must have an accessible name
   - **Selector:** `.col-md-5.col-12:nth-child(2) > .rounded-lg.v-image[__max-height="100%"] > .v-image__placeholder > .ma-0.loader-imagen.align-center > .v-progress-circular.v-progress-circular--indeterminate.grey--text`
10. **`[other] aria-progressbar-name`** (SERIOUS)
   - **Help:** ARIA progressbar nodes must have an accessible name
   - **Selector:** `.col-md-5.col-12:nth-child(3) > .rounded-lg.v-image[__max-height="100%"] > .v-image__placeholder > .ma-0.loader-imagen.align-center > .v-progress-circular.v-progress-circular--indeterminate.grey--text`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/UTL_Industries_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/UTL_Industries_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/UTL_Industries_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
