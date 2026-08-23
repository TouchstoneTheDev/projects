# Accessibility & GTM Outreach Audit Report — Ion Exchange India Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `60 / 100`  
> **Total WCAG Violations:** `10`  
> **Verified Contact Email:** `ieil@ionexchange.co.in`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟠 Moderate (Needs Improvement)
- **What this Score Means:** The website is partially accessible but contains noticeable barriers in image descriptions, color contrast, or navigation controls.
- **Business & Legal Risk:** Moderate compliance risk. Potential loss of disabled customers and non-compliance with digital accessibility guidelines.
- **Primary Outreach Contact:** `ieil@ionexchange.co.in` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **60/100** on automated WCAG 2.1 AA accessibility testing with **10 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `60/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `1` | Serious: `9` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 1 violations
- 🎨 **Color Contrast Failures:** 6 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (1 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Color Contrast Ratios (6 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Ion Exchange India Ltd
- **Resolved URL:** [https://ionexchangeglobal.com](https://ionexchangeglobal.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `ieil@ionexchange.co.in` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `ieil@ionexchange.co.in` | **Status:** `Verified` | **Source Page:** https://ionexchangeglobal.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.button`
2. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.elementor-element-12241619 > .elementor-widget-container > .elementor-heading-title.elementor-size-default`
3. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.elementor-element-537fc5df > .elementor-widget-container > .elementor-text-editor.elementor-clearfix > p`
4. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.green-a:nth-child(6) > .number`
5. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#pauwt > .number`
6. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.elementor-element-ea38072 > .elementor-widget-container > .elementor-button-wrapper > .elementor-button.elementor-button-link.elementor-size-sm > .elementor-button-content-wrapper > .elementor-button-text`
7. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `img[src$="globe.png"]`
8. **`[other] link-in-text-block`** (SERIOUS)
   - **Help:** Links must be distinguishable without relying on color
   - **Selector:** `a[href$="oxper.in/"]`
9. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.mySlides.fade-s.slides-inner:nth-child(2) > .slides-content > .slide-btn-1.animate__fadeInUp.animate__slow > a[href="#"]`
10. **`[other] list`** (SERIOUS)
   - **Help:** <ul> and <ol> must only directly contain <li>, <script> or <template> elements
   - **Selector:** `ul:nth-child(5)`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Ion_Exchange_India_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Ion_Exchange_India_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Ion_Exchange_India_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
