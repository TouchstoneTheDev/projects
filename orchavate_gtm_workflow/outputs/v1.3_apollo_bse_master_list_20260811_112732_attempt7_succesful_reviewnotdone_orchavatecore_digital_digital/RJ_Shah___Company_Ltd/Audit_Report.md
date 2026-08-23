# Accessibility & GTM Outreach Audit Report — RJ Shah & Company Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `40 / 100`  
> **Total WCAG Violations:** `15`  
> **Verified Contact Email:** `micah@micahrich.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `micah@micahrich.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **40/100** on automated WCAG 2.1 AA accessibility testing with **15 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `40/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `4` | Serious: `11` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 8 violations
- 🎨 **Color Contrast Failures:** 0 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (8 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.

---

## 1. Company & Website Verification
- **Company Name:** RJ Shah & Company Ltd
- **Resolved URL:** [https://rjshahidshah.com](https://rjshahidshah.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `micah@micahrich.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `micah@micahrich.com` | **Status:** `Verified` | **Source Page:** https://rjshahidshah.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] aria-command-name`** (SERIOUS)
   - **Help:** ARIA commands must have an accessible name
   - **Selector:** `.c1-3i`
2. **`[other] aria-command-name`** (SERIOUS)
   - **Help:** ARIA commands must have an accessible name
   - **Selector:** `div[data-aid="SLIDE_SELECTION_DOT_1"]`
3. **`[other] aria-command-name`** (SERIOUS)
   - **Help:** ARIA commands must have an accessible name
   - **Selector:** `div[data-aid="SLIDE_SELECTION_DOT_2"]`
4. **`[other] aria-command-name`** (SERIOUS)
   - **Help:** ARIA commands must have an accessible name
   - **Selector:** `div[data-aid="SLIDE_SELECTION_DOT_3"]`
5. **`[other] aria-command-name`** (SERIOUS)
   - **Help:** ARIA commands must have an accessible name
   - **Selector:** `div[data-aid="SLIDE_SELECTION_DOT_4"]`
6. **`[other] aria-command-name`** (SERIOUS)
   - **Help:** ARIA commands must have an accessible name
   - **Selector:** `div[data-aid="SLIDE_SELECTION_DOT_5"]`
7. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `#logo-8105`
8. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `img[data-aid="MENU_SECTION0_ITEM2_IMAGE"]`
9. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `img[data-aid="MENU_SECTION1_ITEM0_IMAGE"]`
10. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `img[data-aid="MENU_SECTION1_ITEM1_IMAGE"]`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/RJ_Shah___Company_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/RJ_Shah___Company_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/RJ_Shah___Company_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
