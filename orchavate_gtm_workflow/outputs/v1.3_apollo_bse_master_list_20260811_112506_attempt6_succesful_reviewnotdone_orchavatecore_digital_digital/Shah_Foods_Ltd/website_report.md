# Accessibility & GTM Outreach Audit Report — Shah Foods Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `60 / 100`  
> **Total WCAG Violations:** `10`  
> **Verified Contact Email:** `shahfoodsprocessing@yahoo.co.in`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟠 Moderate (Needs Improvement)
- **What this Score Means:** The website is partially accessible but contains noticeable barriers in image descriptions, color contrast, or navigation controls.
- **Business & Legal Risk:** Moderate compliance risk. Potential loss of disabled customers and non-compliance with digital accessibility guidelines.
- **Primary Outreach Contact:** `shahfoodsprocessing@yahoo.co.in` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **60/100** on automated WCAG 2.1 AA accessibility testing with **10 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `60/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `2` | Serious: `8` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 2 violations
- 🎨 **Color Contrast Failures:** 3 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (2 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Color Contrast Ratios (3 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Shah Foods Ltd
- **Resolved URL:** [https://shahfoods.in](https://shahfoods.in)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `shahfoodsprocessing@yahoo.co.in` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `shahfoodsprocessing@yahoo.co.in` | **Status:** `Verified` | **Source Page:** https://shahfoods.in/index.php?id=3

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `p:nth-child(2) > span`
2. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `p:nth-child(3) > span`
3. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `p:nth-child(4) > span`
4. **`[other] html-has-lang`** (SERIOUS)
   - **Help:** <html> element must have a lang attribute
   - **Selector:** `html`
5. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `img[src$="certificates-img.jpg"]`
6. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `img[src$="brand.jpg"]`
7. **`[other] list`** (SERIOUS)
   - **Help:** <ul> and <ol> must only directly contain <li>, <script> or <template> elements
   - **Selector:** `.mid-R-white-link > ul`
8. **`[other] list`** (SERIOUS)
   - **Help:** <ul> and <ol> must only directly contain <li>, <script> or <template> elements
   - **Selector:** `.mid-R-white-link > ul > ul`
9. **`[other] list`** (SERIOUS)
   - **Help:** <ul> and <ol> must only directly contain <li>, <script> or <template> elements
   - **Selector:** `.mid-R-white-link > ul > ul > ul`
10. **`[other] list`** (SERIOUS)
   - **Help:** <ul> and <ol> must only directly contain <li>, <script> or <template> elements
   - **Selector:** `.mid-R-white-link > ul > ul > ul > ul`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Shah_Foods_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Shah_Foods_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Shah_Foods_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
