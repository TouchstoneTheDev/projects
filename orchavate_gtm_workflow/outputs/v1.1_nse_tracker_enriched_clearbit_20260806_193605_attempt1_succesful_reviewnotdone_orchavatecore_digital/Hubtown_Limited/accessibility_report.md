# Accessibility & GTM Outreach Audit Report — Hubtown Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `18`  
> **Verified Contact Email:** `contact@hubtown.co.in`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `contact@hubtown.co.in` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **18 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `3` | Serious: `15` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 2 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Color Contrast Ratios (2 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Hubtown Limited
- **Resolved URL:** [https://hubtown.co.in](https://hubtown.co.in)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `contact@hubtown.co.in` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `contact@hubtown.co.in` | **Status:** `Verified` | **Source Page:** https://hubtown.co.in/contact

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#home-section-0 > .sticky.h-\[100vh\].justify-center > .pb-\[7rem\].md\:pb-\[7\.5rem\].px-36 > .h-auto.sm\:items-center.flex-col > .mb-14.sm\:mb-24.text-32`
2. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#home-section-0 > .sticky.h-\[100vh\].justify-center > .pb-\[7rem\].md\:pb-\[7\.5rem\].px-36 > .h-auto.sm\:items-center.flex-col > .mb-0.sm\:mb-32.sm\:max-w-\[72\%\]`
3. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#home-section-1 > .sticky.h-\[100vh\].justify-center > .pb-\[7rem\].md\:pb-\[7\.5rem\].px-36 > .h-auto.sm\:items-center.flex-col > .mb-14.sm\:mb-24.text-32`
4. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#home-section-1 > .sticky.h-\[100vh\].justify-center > .pb-\[7rem\].md\:pb-\[7\.5rem\].px-36 > .h-auto.sm\:items-center.flex-col > .mb-0.sm\:mb-32.sm\:max-w-\[72\%\]`
5. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#home-section-2 > .sticky.h-\[100vh\].justify-center > .pb-\[7rem\].md\:pb-\[7\.5rem\].px-36 > .h-auto.sm\:items-center.flex-col > .mb-14.sm\:mb-24.text-32`
6. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#home-section-2 > .sticky.h-\[100vh\].justify-center > .pb-\[7rem\].md\:pb-\[7\.5rem\].px-36 > .h-auto.sm\:items-center.flex-col > .mb-0.sm\:mb-32.sm\:max-w-\[72\%\]`
7. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#home-section-3 > .sticky.h-\[100vh\].justify-center > .pb-\[7rem\].md\:pb-\[7\.5rem\].px-36 > .h-auto.sm\:items-center.flex-col > .mb-14.sm\:mb-24.text-32`
8. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#home-section-3 > .sticky.h-\[100vh\].justify-center > .pb-\[7rem\].md\:pb-\[7\.5rem\].px-36 > .h-auto.sm\:items-center.flex-col > .mb-0.sm\:mb-32.sm\:max-w-\[72\%\]`
9. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `div[aria-label="Shape  the land  with purpose"]`
10. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#home-section-4 > .sticky.h-\[100vh\].justify-center > .pb-\[7rem\].md\:pb-\[7\.5rem\].px-36 > .h-auto.sm\:items-center.flex-col > .mb-0.sm\:mb-32.sm\:max-w-\[72\%\]`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Hubtown_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Hubtown_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Hubtown_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
