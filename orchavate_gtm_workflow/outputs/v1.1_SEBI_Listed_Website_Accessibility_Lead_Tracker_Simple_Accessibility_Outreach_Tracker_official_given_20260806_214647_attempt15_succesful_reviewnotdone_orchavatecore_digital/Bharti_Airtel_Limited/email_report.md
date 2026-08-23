# Accessibility & GTM Outreach Audit Report — Bharti Airtel Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `92 / 100`  
> **Total WCAG Violations:** `2`  
> **Verified Contact Email:** `info@airtel.in`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟢 Excellent (Low Risk)
- **What this Score Means:** The website adheres well to WCAG 2.1 AA accessibility standards. Disabled users and screen reader operators can navigate the platform with minimal friction.
- **Business & Legal Risk:** Low compliance risk. Minor polish needed for complete digital inclusion.
- **Primary Outreach Contact:** `info@airtel.in` (`Unverified - guessed pattern`)

### Executive Overview & Pitch Angle
This company currently scores **92/100** on automated WCAG 2.1 AA accessibility testing with **2 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `92/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `0` | Serious: `2` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 1 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Color Contrast Ratios (1 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Bharti Airtel Limited
- **Resolved URL:** [https://www.airtel.in](https://www.airtel.in)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `info@airtel.in` (`Unverified - guessed pattern`)
- **Overall Discovery Status:** `Unverified - guessed pattern`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email (Guessed Pattern):** `info@airtel.in` | **Status:** `Unverified - guessed pattern`
- **Investor Grievance Email (Guessed Pattern):** `contact@airtel.in` | **Status:** `Unverified - guessed pattern`

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.result-card > .label[data-type="title-para-md"]`
2. **`[other] nested-interactive`** (SERIOUS)
   - **Help:** Interactive controls must not be nested
   - **Selector:** `.wt-header-profiledropdown-c`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Bharti_Airtel_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Bharti_Airtel_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Bharti_Airtel_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
