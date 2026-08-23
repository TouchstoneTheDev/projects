# Accessibility & GTM Outreach Audit Report — Madhav Marbles & Granites Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `72 / 100`  
> **Total WCAG Violations:** `7`  
> **Verified Contact Email:** `madhav@madhavmarbles.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟠 Moderate (Needs Improvement)
- **What this Score Means:** The website is partially accessible but contains noticeable barriers in image descriptions, color contrast, or navigation controls.
- **Business & Legal Risk:** Moderate compliance risk. Potential loss of disabled customers and non-compliance with digital accessibility guidelines.
- **Primary Outreach Contact:** `madhav@madhavmarbles.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **72/100** on automated WCAG 2.1 AA accessibility testing with **7 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `72/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `4` | Serious: `3` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 1 violations
- 🎨 **Color Contrast Failures:** 1 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (1 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Color Contrast Ratios (1 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Madhav Marbles & Granites Ltd
- **Resolved URL:** [https://madhavmarbles.com](https://madhavmarbles.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `madhav@madhavmarbles.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `madhav@madhavmarbles.com` | **Status:** `Verified` | **Source Page:** https://madhavmarbles.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#menu-item-10624 > a[title="Home"][href$="madhavmarbles.com/"]`
2. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `.alignleft`
3. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `p:nth-child(3) > a[href$="madhavmarbles.com/"]`
4. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `#paoc-popup-14155-2 > .paoc-close-popup.paoc-popup-close[href="javascript:void(0);"]`
5. **`[other] select-name`** (CRITICAL)
   - **Help:** Select element must have an accessible name
   - **Selector:** `select[name="Preferred-Method"]`
6. **`[other] select-name`** (CRITICAL)
   - **Help:** Select element must have an accessible name
   - **Selector:** `select[name="Category"]`
7. **`[other] select-name`** (CRITICAL)
   - **Help:** Select element must have an accessible name
   - **Selector:** `select[name="Requirement-Timeline"]`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Madhav_Marbles___Granites_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Madhav_Marbles___Granites_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Madhav_Marbles___Granites_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
