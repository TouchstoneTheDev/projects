# Accessibility & GTM Outreach Audit Report — Amrutanjan Health Care Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `32 / 100`  
> **Total WCAG Violations:** `17`  
> **Verified Contact Email:** `investors@amrutanjan.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `investors@amrutanjan.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **32/100** on automated WCAG 2.1 AA accessibility testing with **17 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `32/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `8` | Serious: `9` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 8 violations
- 🎨 **Color Contrast Failures:** 6 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (8 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Color Contrast Ratios (6 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Amrutanjan Health Care Limited
- **Resolved URL:** [https://amrutanjan.com](https://amrutanjan.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `investors@amrutanjan.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **Investor Grievance / Compliance Officer Email:** `investors@amrutanjan.com` | **Status:** `Verified` | **Source Page:** https://amrutanjan.com/contact-address.html
- **General Contact Email:** `investors@amrutanjan.com` | **Status:** `Verified` | **Source Page:** https://amrutanjan.com/contact-address.html

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[missing_alt_text] area-alt`** (CRITICAL)
   - **Help:** Active <area> elements must have alternative text
   - **Selector:** `area[shape="circle"]`
2. **`[missing_alt_text] area-alt`** (CRITICAL)
   - **Help:** Active <area> elements must have alternative text
   - **Selector:** `area[coords="12,28,98,81"]`
3. **`[missing_alt_text] area-alt`** (CRITICAL)
   - **Help:** Active <area> elements must have alternative text
   - **Selector:** `area[coords="-55,-3,-34,23"]`
4. **`[missing_alt_text] area-alt`** (CRITICAL)
   - **Help:** Active <area> elements must have alternative text
   - **Selector:** `area[coords="5,5,31,31"]`
5. **`[missing_alt_text] area-alt`** (CRITICAL)
   - **Help:** Active <area> elements must have alternative text
   - **Selector:** `area[coords="-6,-4,161,71"]`
6. **`[missing_alt_text] area-alt`** (CRITICAL)
   - **Help:** Active <area> elements must have alternative text
   - **Selector:** `area[coords="7,-2,96,112"]`
7. **`[missing_alt_text] area-alt`** (CRITICAL)
   - **Help:** Active <area> elements must have alternative text
   - **Selector:** `area[coords="4,1,39,39"]`
8. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `a[href$="identity.html"][target="_blank"] > .pd_1 > .pd_head`
9. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `a[href$="www.amrutanjanapmc.in"][target="_blank"] > .pd_1 > .pd_head`
10. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `a[href$="food-beverage.html"][target="_blank"] > .pd_1 > .pd_head`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Amrutanjan_Health_Care_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Amrutanjan_Health_Care_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Amrutanjan_Health_Care_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
