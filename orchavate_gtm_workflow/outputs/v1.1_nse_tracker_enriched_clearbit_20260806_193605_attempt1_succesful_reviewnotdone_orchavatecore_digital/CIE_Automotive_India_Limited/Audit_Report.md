# Accessibility & GTM Outreach Audit Report — CIE Automotive India Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `56 / 100`  
> **Total WCAG Violations:** `11`  
> **Verified Contact Email:** `ir@cieautomotive.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟠 Moderate (Needs Improvement)
- **What this Score Means:** The website is partially accessible but contains noticeable barriers in image descriptions, color contrast, or navigation controls.
- **Business & Legal Risk:** Moderate compliance risk. Potential loss of disabled customers and non-compliance with digital accessibility guidelines.
- **Primary Outreach Contact:** `ir@cieautomotive.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **56/100** on automated WCAG 2.1 AA accessibility testing with **11 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `56/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `2` | Serious: `9` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 3 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 2 violations

### Priority Code Remediation Steps for Developers
- **Color Contrast Ratios (3 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.
- **Keyboard & Focus Management (2 issues):** Ensure all interactive buttons/links are focusable via `Tab` key and visual focus outlines are visible.

---

## 1. Company & Website Verification
- **Company Name:** CIE Automotive India Limited
- **Resolved URL:** [https://cieautomotive.com](https://cieautomotive.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `ir@cieautomotive.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `ir@cieautomotive.com` | **Status:** `Verified` | **Source Page:** https://cieautomotive.com/web/investors-website/informacion-general

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[keyboard_navigation] aria-hidden-focus`** (SERIOUS)
   - **Help:** ARIA hidden element must not be focusable or contain focusable elements
   - **Selector:** `#fragment-3d843181-e62c-9241-db1a-750fdef4f643 > .component-html[data-lfr-editable-id="element-html"][data-lfr-editable-type="html"] > p > iframe[height="670"][allowfullscreen=""][frameborder="0"] > .attributed-text-segment-list__btn-truncation`
2. **`[other] aria-progressbar-name`** (SERIOUS)
   - **Help:** ARIA progressbar nodes must have an accessible name
   - **Selector:** `iframe[height="800"] > .h-\[293px\] > .ssplayer-progress-bar`
3. **`[other] aria-progressbar-name`** (SERIOUS)
   - **Help:** ARIA progressbar nodes must have an accessible name
   - **Selector:** `#fragment-69a72d01-9935-3cc8-e61d-43262e18f136 > .component-html[data-lfr-editable-id="element-html"][data-lfr-editable-type="html"] > p > iframe[height="670"][allowfullscreen=""][frameborder="0"] > .h-\[293px\] > .ssplayer-progress-bar`
4. **`[other] button-name`** (CRITICAL)
   - **Help:** Buttons must have discernible text
   - **Selector:** `#cie-auto-menu-icon-desktop`
5. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#fragment-9892372d-7664-8a49-450e-79825b0b8632 > .component-heading[data-lfr-editable-type="text"]`
6. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#fragment-f8a739e4-7f4a-373e-d307-db680057c89d > .component-heading[data-lfr-editable-type="text"]`
7. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#_com_liferay_cookies_banner_web_portlet_CookiesBannerPortlet_configurationButton`
8. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `a[href$="inicio"]`
9. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `#fragment-axmp-link`
10. **`[keyboard_navigation] scrollable-region-focusable`** (SERIOUS)
   - **Help:** Scrollable region must have keyboard access
   - **Selector:** `.lfr-layout-structure-item-e4f11a06-79e9-4194-20ae-6876a34f2c43`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/CIE_Automotive_India_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/CIE_Automotive_India_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/CIE_Automotive_India_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
