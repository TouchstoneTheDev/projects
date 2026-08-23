# Accessibility & GTM Outreach Audit Report — Ice Make Refrigeration Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `36 / 100`  
> **Total WCAG Violations:** `16`  
> **Verified Contact Email:** `enquiry@icemakeindia.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `enquiry@icemakeindia.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **36/100** on automated WCAG 2.1 AA accessibility testing with **16 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `36/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `0` | Serious: `16` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 7 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Color Contrast Ratios (7 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Ice Make Refrigeration Limited
- **Resolved URL:** [https://icemakeindia.com](https://icemakeindia.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `enquiry@icemakeindia.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `enquiry@icemakeindia.com` | **Status:** `Verified` | **Source Page:** https://icemakeindia.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] aria-command-name`** (SERIOUS)
   - **Help:** ARIA commands must have an accessible name
   - **Selector:** `.slick-prev`
2. **`[other] aria-command-name`** (SERIOUS)
   - **Help:** ARIA commands must have an accessible name
   - **Selector:** `.slick-next`
3. **`[other] aria-input-field-name`** (SERIOUS)
   - **Help:** ARIA input fields must have an accessible name
   - **Selector:** `.slick-track`
4. **`[other] aria-toggle-field-name`** (SERIOUS)
   - **Help:** ARIA toggle fields must have an accessible name
   - **Selector:** `.slick-current`
5. **`[other] aria-toggle-field-name`** (SERIOUS)
   - **Help:** ARIA toggle fields must have an accessible name
   - **Selector:** `div[data-slick-index="1"]`
6. **`[other] aria-toggle-field-name`** (SERIOUS)
   - **Help:** ARIA toggle fields must have an accessible name
   - **Selector:** `div[data-slick-index="2"]`
7. **`[other] aria-toggle-field-name`** (SERIOUS)
   - **Help:** ARIA toggle fields must have an accessible name
   - **Selector:** `div[data-slick-index="3"]`
8. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#menu-item-7 > a[title="Home"][aria-current="page"][href$="icemakeindia.com/"] > span`
9. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.header_service_no > p`
10. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.header_sale_no > p`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Ice_Make_Refrigeration_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Ice_Make_Refrigeration_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Ice_Make_Refrigeration_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
