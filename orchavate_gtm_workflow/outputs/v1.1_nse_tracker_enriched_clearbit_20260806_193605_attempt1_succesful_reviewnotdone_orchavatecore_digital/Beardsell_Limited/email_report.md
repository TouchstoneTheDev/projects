# Accessibility & GTM Outreach Audit Report — Beardsell Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `91`  
> **Verified Contact Email:** `sales@beardsell.co.in`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `sales@beardsell.co.in` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **91 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `59` | Serious: `32` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 59 violations
- 🎨 **Color Contrast Failures:** 20 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 9 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (59 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Color Contrast Ratios (20 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.
- **Keyboard & Focus Management (9 issues):** Ensure all interactive buttons/links are focusable via `Tab` key and visual focus outlines are visible.

---

## 1. Company & Website Verification
- **Company Name:** Beardsell Limited
- **Resolved URL:** [https://beardsell.co.in](https://beardsell.co.in)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `sales@beardsell.co.in` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `sales@beardsell.co.in` | **Status:** `Verified` | **Source Page:** https://beardsell.co.in

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.ld_button_6a71678f44eae > span > .btn-txt`
2. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.ld_button_6a716791639df > span > .btn-txt`
3. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.liquid-column-6a71679166649 > .vc_column-inner > .wpb_wrapper > .wpb_wrapper-inner > .wpb_text_column.wpb_content_element > .wpb_wrapper > p`
4. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.liquid-column-6a71679166649 > .vc_column-inner > .wpb_wrapper > .wpb_wrapper-inner > .wpb_text_column.wpb_content_element > .wpb_wrapper > p > span:nth-child(1)`
5. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.liquid-column-6a71679166649 > .vc_column-inner > .wpb_wrapper > .wpb_wrapper-inner > .wpb_text_column.wpb_content_element > .wpb_wrapper > p > span:nth-child(4)`
6. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.liquid-column-6a71679166649 > .vc_column-inner > .wpb_wrapper > .wpb_wrapper-inner > .wpb_text_column.wpb_content_element > .wpb_wrapper > p > span:nth-child(4) > a[href="mailto:sales@beardsell.co.in"]`
7. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.liquid-column-6a71679166649 > .vc_column-inner > .wpb_wrapper > .wpb_wrapper-inner > .wpb_text_column.wpb_content_element > .wpb_wrapper > p > span:nth-child(6)`
8. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.liquid-column-6a71679166649 > .vc_column-inner > .wpb_wrapper > .wpb_wrapper-inner > .wpb_text_column.wpb_content_element > .wpb_wrapper > p > span:nth-child(6) > a[href="tel: 044-28293296"]`
9. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.liquid-column-6a71679166649 > .vc_column-inner > .wpb_wrapper > .wpb_wrapper-inner > .wpb_text_column.wpb_content_element > .wpb_wrapper > p > span:nth-child(6) > a[href="tel: 044-28290900"]`
10. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.liquid-column-6a71679166649 > .vc_column-inner > .wpb_wrapper > .wpb_wrapper-inner > .wpb_text_column.wpb_content_element > .wpb_wrapper > p > span:nth-child(6) > a[href="tel: 044-28290901"]`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Beardsell_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Beardsell_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Beardsell_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
