# Accessibility & GTM Outreach Audit Report — Arfin India Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `48 / 100`  
> **Total WCAG Violations:** `13`  
> **Verified Contact Email:** `info@arfin.co.in`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `info@arfin.co.in` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **48/100** on automated WCAG 2.1 AA accessibility testing with **13 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `48/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `3` | Serious: `9` | Moderate: `1`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 0 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Clean Codebase:** No automated DOM accessibility defects found on scanned pages. Keep auditing dynamic components.

---

## 1. Company & Website Verification
- **Company Name:** Arfin India Limited
- **Resolved URL:** [https://arfin.co.in](https://arfin.co.in)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `info@arfin.co.in` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `info@arfin.co.in` | **Status:** `Verified` | **Source Page:** https://arfin.co.in

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] button-name`** (CRITICAL)
   - **Help:** Buttons must have discernible text
   - **Selector:** `.banner-slider > .owl-nav > .owl-prev.disabled[role="presentation"]`
2. **`[other] button-name`** (CRITICAL)
   - **Help:** Buttons must have discernible text
   - **Selector:** `.banner-slider > .owl-nav > .owl-next[role="presentation"]`
3. **`[other] button-name`** (CRITICAL)
   - **Help:** Buttons must have discernible text
   - **Selector:** `.slider > .owl-nav > .owl-next[role="presentation"]`
4. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.active.owl-item:nth-child(1) > .product-item.item > .card.border-0.rounded-0 > .stretched-link`
5. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.active.owl-item:nth-child(2) > .product-item.item > .card.border-0.rounded-0 > .stretched-link`
6. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.active.owl-item:nth-child(3) > .product-item.item > .card.border-0.rounded-0 > .stretched-link`
7. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.owl-item:nth-child(4) > .product-item.item > .card.border-0.rounded-0 > .stretched-link`
8. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.owl-item:nth-child(5) > .product-item.item > .card.border-0.rounded-0 > .stretched-link`
9. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.owl-item:nth-child(6) > .product-item.item > .card.border-0.rounded-0 > .stretched-link`
10. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.owl-item:nth-child(7) > .product-item.item > .card.border-0.rounded-0 > .stretched-link`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Arfin_India_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Arfin_India_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Arfin_India_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
