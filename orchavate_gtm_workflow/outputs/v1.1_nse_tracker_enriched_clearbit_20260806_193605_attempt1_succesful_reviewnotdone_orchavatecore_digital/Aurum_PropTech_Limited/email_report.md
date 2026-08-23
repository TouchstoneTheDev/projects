# Accessibility & GTM Outreach Audit Report — Aurum PropTech Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `40`  
> **Verified Contact Email:** `contact@aurumproptech.in`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `contact@aurumproptech.in` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **40 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `0` | Serious: `40` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 28 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 1 violations

### Priority Code Remediation Steps for Developers
- **Color Contrast Ratios (28 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.
- **Keyboard & Focus Management (1 issues):** Ensure all interactive buttons/links are focusable via `Tab` key and visual focus outlines are visible.

---

## 1. Company & Website Verification
- **Company Name:** Aurum PropTech Limited
- **Resolved URL:** [https://aurumproptech.in](https://aurumproptech.in)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `contact@aurumproptech.in` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `contact@aurumproptech.in` | **Status:** `Verified` | **Source Page:** https://aurumproptech.in

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[keyboard_navigation] aria-hidden-focus`** (SERIOUS)
   - **Help:** ARIA hidden element must not be focusable or contain focusable elements
   - **Selector:** `.slick-slide[data-index="2"][aria-hidden="true"]`
2. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.anchor-green > a`
3. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.slick-current[data-index="0"][aria-hidden="false"] > div > .p-4 > .p-6.text-center > .text-\[\#bf9724\].text-4xl.font-normal`
4. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.slick-active[data-index="1"][aria-hidden="false"] > div > .p-4 > .p-6.text-center > .text-\[\#bf9724\].text-4xl.font-normal`
5. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.slick-active[data-index="2"][aria-hidden="false"] > div > .p-4 > .p-6.text-center > .text-\[\#bf9724\].text-4xl.font-normal`
6. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `div[data-index="3"] > div > .p-4 > .p-6.text-center > .text-\[\#bf9724\].text-4xl.font-normal`
7. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.rounded-xl.bg-white.relative:nth-child(1) > .xl\:p-5.lg\:p-2.p-5 > div:nth-child(1) > .mt-2:nth-child(1) > .grid-cols-2.text-xs.md\:text-sm > .gap-2.items-center:nth-child(1)`
8. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.rounded-xl.bg-white.relative:nth-child(1) > .xl\:p-5.lg\:p-2.p-5 > div:nth-child(1) > .mt-2:nth-child(1) > .grid-cols-2.text-xs.md\:text-sm > .gap-2.items-center:nth-child(2)`
9. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.rounded-xl.bg-white.relative:nth-child(1) > .xl\:p-5.lg\:p-2.p-5 > div:nth-child(1) > .mt-2:nth-child(1) > .grid-cols-2.text-xs.md\:text-sm > .gap-2.items-center:nth-child(3)`
10. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.rounded-xl.bg-white.relative:nth-child(1) > .xl\:p-5.lg\:p-2.p-5 > div:nth-child(1) > .mt-2:nth-child(1) > .grid-cols-2.text-xs.md\:text-sm > .gap-2.items-center:nth-child(4)`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Aurum_PropTech_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Aurum_PropTech_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Aurum_PropTech_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
