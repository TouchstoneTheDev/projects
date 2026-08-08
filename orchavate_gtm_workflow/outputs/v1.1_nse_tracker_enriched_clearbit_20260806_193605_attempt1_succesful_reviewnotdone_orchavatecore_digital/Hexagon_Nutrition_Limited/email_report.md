# Accessibility & GTM Outreach Audit Report — Hexagon Nutrition Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `19`  
> **Verified Contact Email:** `cs.hnpl@hexagonnutrition.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `cs.hnpl@hexagonnutrition.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **19 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `0` | Serious: `19` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 1 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Color Contrast Ratios (1 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Hexagon Nutrition Limited
- **Resolved URL:** [https://hexagonnutrition.com](https://hexagonnutrition.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `cs.hnpl@hexagonnutrition.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **Investor Grievance / Compliance Officer Email:** `cs.hnpl@hexagonnutrition.com` | **Status:** `Verified` | **Source Page:** https://hexagonnutrition.com/investors_contact
- **General Contact Email:** `cs.hnpl@hexagonnutrition.com` | **Status:** `Verified` | **Source Page:** https://hexagonnutrition.com/investors_contact

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `p > strong`
2. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.elementor-element-6ede015 > .elementor-widget-container > .ct-team-carousel3.ct-dots-style4.ct-team > .ct-carousel-inner > div[data-dots=""][data-colmd="3"][data-collg="4"] > .slick-list.draggable > .slick-track > .slick-current[data-slick-index="0"][aria-hidden="false"] > .item--inner > .item--meta > .item--social > a:nth-child(1)`
3. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.elementor-element-6ede015 > .elementor-widget-container > .ct-team-carousel3.ct-dots-style4.ct-team > .ct-carousel-inner > div[data-dots=""][data-colmd="3"][data-collg="4"] > .slick-list.draggable > .slick-track > .slick-current[data-slick-index="0"][aria-hidden="false"] > .item--inner > .item--meta > .item--social > a:nth-child(2)`
4. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `div[data-dots=""][data-colmd="3"][data-collg="4"] > .slick-list.draggable > .slick-track > .slick-active[data-slick-index="1"][aria-hidden="false"] > .item--inner > .item--meta > .item--social > a:nth-child(1)`
5. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `div[data-dots=""][data-colmd="3"][data-collg="4"] > .slick-list.draggable > .slick-track > .slick-active[data-slick-index="1"][aria-hidden="false"] > .item--inner > .item--meta > .item--social > a:nth-child(2)`
6. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `div[data-dots=""][data-colmd="3"][data-collg="4"] > .slick-list.draggable > .slick-track > .slick-active[data-slick-index="2"][aria-hidden="false"] > .item--inner > .item--meta > .item--social > a:nth-child(1)`
7. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `div[data-dots=""][data-colmd="3"][data-collg="4"] > .slick-list.draggable > .slick-track > .slick-active[data-slick-index="2"][aria-hidden="false"] > .item--inner > .item--meta > .item--social > a:nth-child(2)`
8. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.slick-current.carousel-item[data-slick-index="0"] > .grid-item-inner > .item--featured.image-effect-white > a`
9. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.carousel-item[data-slick-index="1"][aria-hidden="false"] > .grid-item-inner > .item--featured.image-effect-white > a`
10. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.carousel-item[data-slick-index="2"][aria-hidden="false"] > .grid-item-inner > .item--featured.image-effect-white > a`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Hexagon_Nutrition_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Hexagon_Nutrition_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Hexagon_Nutrition_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
