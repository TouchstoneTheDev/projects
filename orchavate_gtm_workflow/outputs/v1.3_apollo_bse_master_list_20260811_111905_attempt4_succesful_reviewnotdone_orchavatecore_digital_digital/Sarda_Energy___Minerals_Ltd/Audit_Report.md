# Accessibility & GTM Outreach Audit Report — Sarda Energy & Minerals Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `55`  
> **Verified Contact Email:** `bbalachandran at seml.co.in`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `bbalachandran at seml.co.in` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **55 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `31` | Serious: `24` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 31 violations
- 🎨 **Color Contrast Failures:** 11 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (31 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Color Contrast Ratios (11 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Sarda Energy & Minerals Ltd
- **Resolved URL:** [https://seml.co.in](https://seml.co.in)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `bbalachandran at seml.co.in` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **Investor Grievance / Compliance Officer Email:** `investor@bigshareonline.com` | **Status:** `Verified` | **Source Page:** https://seml.co.in/contactdetails.php
- **General Contact Email:** `bbalachandran at seml.co.in` | **Status:** `Verified` | **Source Page:** https://seml.co.in/contact.php

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[missing_alt_text] area-alt`** (CRITICAL)
   - **Help:** Active <area> elements must have alternative text
   - **Selector:** `area[coords="4,-2,64,27"]`
2. **`[missing_alt_text] area-alt`** (CRITICAL)
   - **Help:** Active <area> elements must have alternative text
   - **Selector:** `area[coords="78,5,106,41"]`
3. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.content-link`
4. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `tr:nth-child(1) > td[width="30%"][valign="top"] > .content-link-bold1[target="_blank"]`
5. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `tr:nth-child(3) > td[width="30%"][valign="top"] > .content-link-bold1[target="_blank"]`
6. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `tr:nth-child(5) > td[width="30%"][valign="top"] > .content-link-bold1[target="_blank"]`
7. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `tr:nth-child(7) > td[width="30%"][valign="top"] > .content-link-bold1[target="_blank"]`
8. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `tr:nth-child(9) > td[width="30%"][valign="top"] > .content-link-bold1[target="_blank"]`
9. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.footer`
10. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `a[href$="sitemap.php"]`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Sarda_Energy___Minerals_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Sarda_Energy___Minerals_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Sarda_Energy___Minerals_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
