# Accessibility & GTM Outreach Audit Report — Cupid Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `48 / 100`  
> **Total WCAG Violations:** `13`  
> **Verified Contact Email:** `info@cupidlimited.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `info@cupidlimited.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **48/100** on automated WCAG 2.1 AA accessibility testing with **13 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `48/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `1` | Serious: `12` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 7 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Color Contrast Ratios (7 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Cupid Limited
- **Resolved URL:** [https://cupidlimited.com](https://cupidlimited.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `info@cupidlimited.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `info@cupidlimited.com` | **Status:** `Verified` | **Source Page:** https://cupidlimited.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] aria-required-children`** (CRITICAL)
   - **Help:** Certain ARIA roles must contain particular children
   - **Selector:** `.elementor-loop-container`
2. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#menu-1-b8dbea7 > .contact-btn.menu-item-1335.menu-item-type-post_type > .elementor-item`
3. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.elementor-button.elementor-button-link[target="_blank"] > .elementor-button-content-wrapper > .elementor-button-text`
4. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.elementor-button.elementor-button-link[href="#"] > .elementor-button-content-wrapper > .elementor-button-text`
5. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.e-loop-item-1 > .elementor-element-b290a59.blog-item[data-id="b290a59"] > .elementor-element-f7dab0e[data-id="f7dab0e"][data-settings="{\"position\":\"absolute\"}"] > .elementor-element-efb3252.blog-more[data-id="efb3252"] > .elementor-button.elementor-button-link.elementor-size-sm > .elementor-button-content-wrapper > .elementor-button-text`
6. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.e-loop-item-391 > .elementor-element-b290a59.blog-item[data-id="b290a59"] > .elementor-element-f7dab0e[data-id="f7dab0e"][data-settings="{\"position\":\"absolute\"}"] > .elementor-element-efb3252.blog-more[data-id="efb3252"] > .elementor-button.elementor-button-link.elementor-size-sm > .elementor-button-content-wrapper > .elementor-button-text`
7. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.e-loop-item-394 > .elementor-element-b290a59.blog-item[data-id="b290a59"] > .elementor-element-f7dab0e[data-id="f7dab0e"][data-settings="{\"position\":\"absolute\"}"] > .elementor-element-efb3252.blog-more[data-id="efb3252"] > .elementor-button.elementor-button-link.elementor-size-sm > .elementor-button-content-wrapper > .elementor-button-text`
8. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.e-loop-item-399 > .elementor-element-b290a59.blog-item[data-id="b290a59"] > .elementor-element-f7dab0e[data-id="f7dab0e"][data-settings="{\"position\":\"absolute\"}"] > .elementor-element-efb3252.blog-more[data-id="efb3252"] > .elementor-button.elementor-button-link.elementor-size-sm > .elementor-button-content-wrapper > .elementor-button-text`
9. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.swiper-slide-active[aria-label="1 / 4"][data-slide="1"] > .elementor-element-38f41dc.e-con-boxed[data-id="38f41dc"] > .e-con-inner > .elementor-element-f3fdd53.e-con-full[data-id="f3fdd53"] > .elementor-element-f4c3052.e-con-full[data-id="f4c3052"] > .elementor-element-324ecd6.elementor-view-framed[data-id="324ecd6"] > .elementor-icon-wrapper > .elementor-icon`
10. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.swiper-slide-next[aria-label="2 / 4"][data-slide="2"] > .elementor-element-b1fc5ed.e-con-boxed[data-id="b1fc5ed"] > .e-con-inner > .elementor-element-b3bf55c.e-con-full[data-id="b3bf55c"] > .elementor-element-996e391.e-con-full[data-id="996e391"] > .elementor-element-7116621.elementor-view-framed[data-id="7116621"] > .elementor-icon-wrapper > .elementor-icon`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Cupid_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Cupid_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Cupid_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
