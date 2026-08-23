# Accessibility & GTM Outreach Audit Report — Polychem Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `76 / 100`  
> **Total WCAG Violations:** `6`  
> **Verified Contact Email:** `sales@polychemalloy.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟠 Moderate (Needs Improvement)
- **What this Score Means:** The website is partially accessible but contains noticeable barriers in image descriptions, color contrast, or navigation controls.
- **Business & Legal Risk:** Moderate compliance risk. Potential loss of disabled customers and non-compliance with digital accessibility guidelines.
- **Primary Outreach Contact:** `sales@polychemalloy.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **76/100** on automated WCAG 2.1 AA accessibility testing with **6 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `76/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `4` | Serious: `2` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 1 violations
- 📝 **Form & Structural Labels:** 4 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Color Contrast Ratios (1 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.
- **Form Labels & ARIA (4 issues):** Associate all `<input>` and `<select>` elements with explicit `<label for="...">` tags or `aria-label` attributes.

---

## 1. Company & Website Verification
- **Company Name:** Polychem Ltd
- **Resolved URL:** [https://polychemalloy.com](https://polychemalloy.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `sales@polychemalloy.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `sales@polychemalloy.com` | **Status:** `Verified` | **Source Page:** https://polychemalloy.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.active > a[href$="#home"][data-scroll=""]`
2. **`[other] frame-title`** (SERIOUS)
   - **Help:** Frames must have an accessible name
   - **Selector:** `iframe`
3. **`[form_labels] label`** (CRITICAL)
   - **Help:** Form elements must have labels
   - **Selector:** `#name`
4. **`[form_labels] label`** (CRITICAL)
   - **Help:** Form elements must have labels
   - **Selector:** `#email`
5. **`[form_labels] label`** (CRITICAL)
   - **Help:** Form elements must have labels
   - **Selector:** `#subject`
6. **`[form_labels] label`** (CRITICAL)
   - **Help:** Form elements must have labels
   - **Selector:** `#message`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Polychem_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Polychem_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Polychem_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
