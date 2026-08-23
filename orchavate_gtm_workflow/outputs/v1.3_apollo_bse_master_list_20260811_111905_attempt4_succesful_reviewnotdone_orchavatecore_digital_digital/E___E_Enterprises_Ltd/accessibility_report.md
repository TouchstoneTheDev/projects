# Accessibility & GTM Outreach Audit Report — E & E Enterprises Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `36 / 100`  
> **Total WCAG Violations:** `16`  
> **Verified Contact Email:** `info@eandeproject.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `info@eandeproject.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **36/100** on automated WCAG 2.1 AA accessibility testing with **16 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `36/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `1` | Serious: `15` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 1 violations
- 🎨 **Color Contrast Failures:** 0 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (1 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.

---

## 1. Company & Website Verification
- **Company Name:** E & E Enterprises Ltd
- **Resolved URL:** [https://eandeproject.com](https://eandeproject.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `info@eandeproject.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `info@eandeproject.com` | **Status:** `Verified` | **Source Page:** https://eandeproject.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `img[hidden=""][loading="lazy"]`
2. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.jdgm-carousel-item:nth-child(1) > .jdgm-carousel-item__product.jdgm--shop-review-has-image`
3. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.jdgm-carousel-item:nth-child(2) > .jdgm-carousel-item__product.jdgm--shop-review-has-image`
4. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.jdgm-carousel-item:nth-child(3) > .jdgm-carousel-item__product.jdgm--shop-review-has-image`
5. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.jdgm-carousel-item:nth-child(4) > .jdgm-carousel-item__product.jdgm--shop-review-has-image`
6. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.jdgm-carousel-item:nth-child(5) > .jdgm-carousel-item__product.jdgm--shop-review-has-image`
7. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.jdgm-carousel-item:nth-child(6) > .jdgm-carousel-item__product.jdgm--shop-review-has-image`
8. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.jdgm-carousel-item:nth-child(7) > .jdgm-carousel-item__product.jdgm--shop-review-has-image`
9. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.jdgm-carousel-item:nth-child(8) > .jdgm-carousel-item__product.jdgm--shop-review-has-image`
10. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.jdgm-carousel-item:nth-child(9) > .jdgm-carousel-item__product.jdgm--shop-review-has-image`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/E___E_Enterprises_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/E___E_Enterprises_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/E___E_Enterprises_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
