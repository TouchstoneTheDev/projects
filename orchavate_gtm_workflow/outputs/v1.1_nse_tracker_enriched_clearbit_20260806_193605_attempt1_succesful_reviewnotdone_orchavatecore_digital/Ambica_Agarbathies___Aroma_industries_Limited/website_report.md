# Accessibility & GTM Outreach Audit Report — Ambica Agarbathies & Aroma industries Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `39`  
> **Verified Contact Email:** `info@ambicaagarbathies.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `info@ambicaagarbathies.com` (`Unverified - guessed pattern`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **39 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `2` | Serious: `37` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 1 violations
- 🎨 **Color Contrast Failures:** 22 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 8 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (1 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Color Contrast Ratios (22 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.
- **Keyboard & Focus Management (8 issues):** Ensure all interactive buttons/links are focusable via `Tab` key and visual focus outlines are visible.

---

## 1. Company & Website Verification
- **Company Name:** Ambica Agarbathies & Aroma industries Limited
- **Resolved URL:** [https://ambicaagarbathies.com](https://ambicaagarbathies.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `info@ambicaagarbathies.com` (`Unverified - guessed pattern`)
- **Overall Discovery Status:** `Unverified - guessed pattern`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email (Guessed Pattern):** `info@ambicaagarbathies.com` | **Status:** `Unverified - guessed pattern`
- **Investor Grievance Email (Guessed Pattern):** `contact@ambicaagarbathies.com` | **Status:** `Unverified - guessed pattern`

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#product-card-AL3l4aGZNQkNEc2RSQ__static-product-card > .product-card__content.product-grid__card.gap-style > .group-block--height-fit.group-block--width-fill.group-block > .group-block-content.mobile-column.layout-panel-flex > .rating-wrapper.justify-left.rating-color--primary > .rating`
2. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#product-card-AL3l4aGZNQkNEc2RSQ__static-product-card-1 > .product-card__content.product-grid__card.gap-style > .group-block--height-fit.group-block--width-fill.group-block > .group-block-content.mobile-column.layout-panel-flex > .rating-wrapper.justify-left.rating-color--primary > .rating`
3. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#product-card-AL3l4aGZNQkNEc2RSQ__static-product-card-2 > .product-card__content.product-grid__card.gap-style > .group-block--height-fit.group-block--width-fill.group-block > .group-block-content.mobile-column.layout-panel-flex > .rating-wrapper.justify-left.rating-color--primary > .rating`
4. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#product-card-AL3l4aGZNQkNEc2RSQ__static-product-card-4 > .product-card__content.product-grid__card.gap-style > .group-block--height-fit.group-block--width-fill.group-block > .group-block-content.mobile-column.layout-panel-flex > .rating-wrapper.justify-left.rating-color--primary > .rating`
5. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#product-card-AL3l4aGZNQkNEc2RSQ__static-product-card-5 > .product-card__content.product-grid__card.gap-style > .group-block--height-fit.group-block--width-fill.group-block > .group-block-content.mobile-column.layout-panel-flex > .rating-wrapper.justify-left.rating-color--primary > .rating`
6. **`[other] aria-required-parent`** (CRITICAL)
   - **Help:** Certain ARIA roles must be contained by particular parents
   - **Selector:** `button[role="menuitem"]`
7. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#BuyButtons-ProductSubmitButton-AbG9JdzhqOUFMN2dqK__add-to-cart > .add-to-cart-text > .add-to-cart-text__content`
8. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#BuyButtons-ProductSubmitButton-AbG9JdzhqOUFMN2dqK__add-to-cart-1 > .add-to-cart-text > .add-to-cart-text__content`
9. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#BuyButtons-ProductSubmitButton-AbG9JdzhqOUFMN2dqK__add-to-cart-2 > .add-to-cart-text > .add-to-cart-text__content`
10. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#BuyButtons-ProductSubmitButton-AbG9JdzhqOUFMN2dqK__add-to-cart-3 > .add-to-cart-text > .add-to-cart-text__content`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Ambica_Agarbathies___Aroma_industries_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Ambica_Agarbathies___Aroma_industries_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Ambica_Agarbathies___Aroma_industries_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
