# Accessibility & GTM Outreach Audit Report — Bhagyanagar India Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `24`  
> **Verified Contact Email:** `nvrao@surana.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `nvrao@surana.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **24 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `2` | Serious: `22` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 11 violations
- 🎨 **Color Contrast Failures:** 10 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (11 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Color Contrast Ratios (10 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Bhagyanagar India Limited
- **Resolved URL:** [https://bhagyanagarindia.com](https://bhagyanagarindia.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `nvrao@surana.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `nvrao@surana.com` | **Status:** `Verified` | **Source Page:** https://bhagyanagarindia.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.elementor-element-4dd53bd > .elementor-button-link.elementor-size-sm.elementor-button > .elementor-button-content-wrapper > .elementor-button-text`
2. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.elementor-element-b23765a > .elementor-button-link.elementor-size-sm.elementor-button > .elementor-button-content-wrapper > .elementor-button-text`
3. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.elementor-element-a1d25f6 > .elementor-button-link.elementor-size-sm.elementor-button > .elementor-button-content-wrapper > .elementor-button-text`
4. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#content-3cfec486a74ec9a10fc0-tab > .elementskit-tab-title`
5. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#content-3cfec486a74ec9a10fc0 > .animated.fadeIn > .elementor-3185[data-elementor-id="3185"][data-elementor-type="section"] > .elementor-element-3927953.e-parent[data-id="3927953"] > .elementor-element-551e14f.e-con-boxed[data-id="551e14f"] > .e-con-inner > .elementor-element-df838d6.elementor-widget-heading[data-id="df838d6"] > h2`
6. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#content-3cfec486a74ec9a10fc0 > .animated.fadeIn > .elementor-3185[data-elementor-id="3185"][data-elementor-type="section"] > .elementor-element-3927953.e-parent[data-id="3927953"] > .elementor-element-551e14f.e-con-boxed[data-id="551e14f"] > .e-con-inner > .elementor-element-2fbf0d4.elementor-widget-heading[data-id="2fbf0d4"] > h2`
7. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#content-3cfec486a74ec9a10fc0 > .animated.fadeIn > .elementor-3185[data-elementor-id="3185"][data-elementor-type="section"] > .elementor-element-3927953.e-parent[data-id="3927953"] > .elementor-element-551e14f.e-con-boxed[data-id="551e14f"] > .e-con-inner > .elementor-element-ad07fcb.elementor-widget-heading[data-id="ad07fcb"] > h2`
8. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#content-3cfec486a74ec9a10fc0 > .animated.fadeIn > .elementor-3185[data-elementor-id="3185"][data-elementor-type="section"] > .elementor-element-3927953.e-parent[data-id="3927953"] > .elementor-element-551e14f.e-con-boxed[data-id="551e14f"] > .e-con-inner > .elementor-element-9332db9.elementor-widget-button[data-id="9332db9"] > .elementor-button-link.elementor-size-sm.elementor-button > .elementor-button-content-wrapper > .elementor-button-text`
9. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.testimonial.active > p`
10. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.testimonial.active > .stars > .author`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Bhagyanagar_India_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Bhagyanagar_India_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Bhagyanagar_India_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
