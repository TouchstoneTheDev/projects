# Accessibility & GTM Outreach Audit Report — Genus Paper & Boards Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `84 / 100`  
> **Total WCAG Violations:** `4`  
> **Verified Contact Email:** `info@genuspaper.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟠 Moderate (Needs Improvement)
- **What this Score Means:** The website is partially accessible but contains noticeable barriers in image descriptions, color contrast, or navigation controls.
- **Business & Legal Risk:** Moderate compliance risk. Potential loss of disabled customers and non-compliance with digital accessibility guidelines.
- **Primary Outreach Contact:** `info@genuspaper.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **84/100** on automated WCAG 2.1 AA accessibility testing with **4 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `84/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `0` | Serious: `4` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 2 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Color Contrast Ratios (2 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Genus Paper & Boards Limited
- **Resolved URL:** [https://genuspaper.com](https://genuspaper.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `info@genuspaper.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `info@genuspaper.com` | **Status:** `Verified` | **Source Page:** https://genuspaper.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.elementor-element-17d81db > .elementor-widget-container > .about-section > .auto-container > .row > .col-sm-12.col-xs-12.col-lg-6:nth-child(2) > .row > .col-lg-6.col-md-12 > .text-block > .textin > h5`
2. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.elementor-element-3f06cf6 > .elementor-widget-container > .about-section > .auto-container > .row > .col-sm-12.col-xs-12.col-lg-6:nth-child(2) > .row > .col-lg-6.col-md-12 > .text-block > .textin > h5`
3. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.elementor-widget-container > a[href$="genuspaper.com/"]`
4. **`[other] marquee`** (SERIOUS)
   - **Help:** <marquee> elements are deprecated and must not be used
   - **Selector:** `marquee`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Genus_Paper___Boards_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Genus_Paper___Boards_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Genus_Paper___Boards_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
