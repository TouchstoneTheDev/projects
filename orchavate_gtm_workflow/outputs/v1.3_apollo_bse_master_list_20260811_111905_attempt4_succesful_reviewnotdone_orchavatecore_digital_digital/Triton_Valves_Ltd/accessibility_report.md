# Accessibility & GTM Outreach Audit Report — Triton Valves Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `42`  
> **Verified Contact Email:** `info@tritonvalves.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `info@tritonvalves.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **42 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `13` | Serious: `29` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 9 violations
- 🎨 **Color Contrast Failures:** 2 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (9 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Color Contrast Ratios (2 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Triton Valves Ltd
- **Resolved URL:** [https://tritonvalves.com](https://tritonvalves.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `info@tritonvalves.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **Investor Grievance / Compliance Officer Email:** `investors@tritonvalves.com` | **Status:** `Verified` | **Source Page:** https://tritonvalves.com/investors/
- **General Contact Email:** `info@tritonvalves.com` | **Status:** `Verified` | **Source Page:** https://tritonvalves.com/contact/

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] aria-required-children`** (CRITICAL)
   - **Help:** Certain ARIA roles must contain particular children
   - **Selector:** `#menu-item-67651 > .drop-menu[role="menu"]`
2. **`[other] aria-required-children`** (CRITICAL)
   - **Help:** Certain ARIA roles must contain particular children
   - **Selector:** `#menu-item-65657 > .drop-menu[role="menu"]`
3. **`[other] aria-required-children`** (CRITICAL)
   - **Help:** Certain ARIA roles must contain particular children
   - **Selector:** `#menu-item-65680 > .drop-menu[role="menu"]`
4. **`[other] aria-required-children`** (CRITICAL)
   - **Help:** Certain ARIA roles must contain particular children
   - **Selector:** `#menu-item-68053 > .drop-menu[role="menu"]`
5. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#\39 40560 > .limit-width.row-parent[data-imgready="true"] > .wpb_row.row-inner > .col-lg-3.column_parent.wpb_column > .uncol.style-light > .uncoltable > .no-block-padding.uncell.boomapps_vccolumn > .uncont > .uncode_text_column > p`
6. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#\37 71661 > .limit-width.row-parent[data-imgready="true"] > .wpb_row.row-inner > .col-lg-3.column_parent.wpb_column > .uncol.style-light > .uncoltable > .no-block-padding.uncell.boomapps_vccolumn > .uncont > .uncode_text_column > p`
7. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `:root`
8. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `:root`
9. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `:root`
10. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `:root`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Triton_Valves_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Triton_Valves_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Triton_Valves_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
