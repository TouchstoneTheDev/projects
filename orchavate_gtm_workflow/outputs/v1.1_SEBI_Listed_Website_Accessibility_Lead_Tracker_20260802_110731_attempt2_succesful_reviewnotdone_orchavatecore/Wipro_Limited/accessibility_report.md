# Accessibility & GTM Outreach Audit Report — Wipro Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `52 / 100`  
> **Total WCAG Violations:** `12`  
> **Verified Contact Email:** `investor.relations@wipro.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟠 Moderate (Needs Improvement)
- **What this Score Means:** The website is partially accessible but contains noticeable barriers in image descriptions, color contrast, or navigation controls.
- **Business & Legal Risk:** Moderate compliance risk. Potential loss of disabled customers and non-compliance with digital accessibility guidelines.
- **Primary Outreach Contact:** `investor.relations@wipro.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **52/100** on automated WCAG 2.1 AA accessibility testing with **12 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `52/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `4` | Serious: `8` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 8 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Color Contrast Ratios (8 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Wipro Limited
- **Resolved URL:** [https://www.wipro.com](https://www.wipro.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `investor.relations@wipro.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `investor.relations@wipro.com` | **Status:** `Verified` | **Source Page:** https://www.wipro.com/investors/

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] aria-required-attr`** (CRITICAL)
   - **Help:** Required ARIA attributes must be provided
   - **Selector:** `.quicklinksList-title-styles-homepagequicklinks-c-1266782202-356e0d24-0`
2. **`[other] aria-required-attr`** (CRITICAL)
   - **Help:** Required ARIA attributes must be provided
   - **Selector:** `.quicklinksList-title-styles-homepagequicklinks-c-1266782202-356e0d24-1`
3. **`[other] aria-required-attr`** (CRITICAL)
   - **Help:** Required ARIA attributes must be provided
   - **Selector:** `.quicklinksList-title-styles-homepagequicklinks-c-1266782202-356e0d24-2`
4. **`[other] aria-required-parent`** (CRITICAL)
   - **Help:** Certain ARIA roles must be contained by particular parents
   - **Selector:** `.cmp-globalnavigation__geo-button`
5. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.description-clamp-teaser-copy-32048284-188438582-212265fd > p`
6. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.action-links-teaser-copy-32048284-188438582-212265fd > b`
7. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.description-clamp-teaser-copy-32048284-786624055-933ecf43 > p`
8. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.action-links-teaser-copy-32048284-786624055-933ecf43 > b`
9. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.cmp-teaser__description-custom-line-clamp > p`
10. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.action-links-teaser-copy-32048284-1597162085-f608ef6c > b`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Wipro_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Wipro_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Wipro_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
