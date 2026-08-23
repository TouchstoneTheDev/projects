# Accessibility & GTM Outreach Audit Report — Gujarat Containers Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `64 / 100`  
> **Total WCAG Violations:** `9`  
> **Verified Contact Email:** `support@example.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟠 Moderate (Needs Improvement)
- **What this Score Means:** The website is partially accessible but contains noticeable barriers in image descriptions, color contrast, or navigation controls.
- **Business & Legal Risk:** Moderate compliance risk. Potential loss of disabled customers and non-compliance with digital accessibility guidelines.
- **Primary Outreach Contact:** `support@example.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **64/100** on automated WCAG 2.1 AA accessibility testing with **9 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `64/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `3` | Serious: `5` | Moderate: `1`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 0 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Clean Codebase:** No automated DOM accessibility defects found on scanned pages. Keep auditing dynamic components.

---

## 1. Company & Website Verification
- **Company Name:** Gujarat Containers Ltd
- **Resolved URL:** [https://gujaratcontainers.com](https://gujaratcontainers.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `support@example.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **Investor Grievance / Compliance Officer Email:** `support@example.com` | **Status:** `Verified` | **Source Page:** https://gujaratcontainers.com
- **General Contact Email:** `support@example.com` | **Status:** `Verified` | **Source Page:** https://gujaratcontainers.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] button-name`** (CRITICAL)
   - **Help:** Buttons must have discernible text
   - **Selector:** `.menu-item-4832.menu-item-has-children.menu-item-type-custom > .dropdown-toggle`
2. **`[other] button-name`** (CRITICAL)
   - **Help:** Buttons must have discernible text
   - **Selector:** `.menu-item-4834.menu-item-has-children.menu-item-type-custom > .dropdown-toggle`
3. **`[other] button-name`** (CRITICAL)
   - **Help:** Buttons must have discernible text
   - **Selector:** `.menu-item-4835.menu-item-has-children.menu-item-type-custom > .dropdown-toggle`
4. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `a[data-elementor-lightbox-title="SUNPHARMA"]`
5. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `a[data-elementor-lightbox-title="MURUGAPPALOGO"]`
6. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `a[data-elementor-lightbox-title="Atul_logo"]`
7. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `a[data-elementor-lightbox-title="MEHRAJ"]`
8. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.mobile-nav-close`
9. **`[other] meta-viewport`** (MODERATE)
   - **Help:** Zooming and scaling must not be disabled
   - **Selector:** `meta[name="viewport"]`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Gujarat_Containers_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Gujarat_Containers_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Gujarat_Containers_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
