# Accessibility & GTM Outreach Audit Report — Everest Kanto Cylinder Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `60 / 100`  
> **Total WCAG Violations:** `10`  
> **Verified Contact Email:** `customer@ekc.in`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟠 Moderate (Needs Improvement)
- **What this Score Means:** The website is partially accessible but contains noticeable barriers in image descriptions, color contrast, or navigation controls.
- **Business & Legal Risk:** Moderate compliance risk. Potential loss of disabled customers and non-compliance with digital accessibility guidelines.
- **Primary Outreach Contact:** `customer@ekc.in` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **60/100** on automated WCAG 2.1 AA accessibility testing with **10 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `60/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `0` | Serious: `10` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 2 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Color Contrast Ratios (2 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Everest Kanto Cylinder Limited
- **Resolved URL:** [https://everestkanto.com](https://everestkanto.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `customer@ekc.in` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `customer@ekc.in` | **Status:** `Verified` | **Source Page:** https://everestkanto.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.gdlr-core-text-box-item-content > p`
2. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.gdlr-core-content`
3. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.realfactory-header-container-inner > .realfactory-logo.realfactory-item-pdlr > .realfactory-logo-inner > a[href$="everestkanto.com/"]`
4. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.gdlr-core-gallery-list.gdlr-core-item-mglr:nth-child(1) > .gdlr-core-media-image > .gdlr-core-ilightbox[data-ilightbox-group="gdlr-core-img-group-2"][data-type="image"]`
5. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.gdlr-core-gallery-list.gdlr-core-item-mglr:nth-child(2) > .gdlr-core-media-image > .gdlr-core-ilightbox[data-ilightbox-group="gdlr-core-img-group-2"][data-type="image"]`
6. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.gdlr-core-gallery-list.gdlr-core-item-mglr:nth-child(3) > .gdlr-core-media-image > .gdlr-core-ilightbox[data-ilightbox-group="gdlr-core-img-group-2"][data-type="image"]`
7. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.gdlr-core-pbf-element:nth-child(2) > .gdlr-core-image-item.gdlr-core-item-pdb.gdlr-core-item-pdlr > .gdlr-core-image-item-wrap.gdlr-core-image-item-style-rectangle.gdlr-core-media-image > .gdlr-core-ilightbox.gdlr-core-js[data-type="image"]`
8. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.gdlr-core-column-30.gdlr-core-column-first.gdlr-core-pbf-column > .gdlr-core-pbf-column-content-margin.gdlr-core-js > .gdlr-core-pbf-column-content.clearfix.gdlr-core-js > .gdlr-core-pbf-element:nth-child(1) > .gdlr-core-image-item.gdlr-core-item-pdb.gdlr-core-item-pdlr > .gdlr-core-image-item-wrap.gdlr-core-image-item-style-rectangle.gdlr-core-media-image > .gdlr-core-ilightbox.gdlr-core-js[data-type="image"]`
9. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.gdlr-core-column-30.gdlr-core-pbf-column:nth-child(2) > .gdlr-core-pbf-column-content-margin.gdlr-core-js > .gdlr-core-pbf-column-content.clearfix.gdlr-core-js > .gdlr-core-pbf-element:nth-child(1) > .gdlr-core-image-item.gdlr-core-item-pdb.gdlr-core-item-pdlr > .gdlr-core-image-item-wrap.gdlr-core-image-item-style-rectangle.gdlr-core-media-image > .gdlr-core-ilightbox.gdlr-core-js[data-type="image"]`
10. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `#realfactory-footer-back-to-top-button`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Everest_Kanto_Cylinder_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Everest_Kanto_Cylinder_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Everest_Kanto_Cylinder_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
