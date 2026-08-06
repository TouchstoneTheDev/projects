# Accessibility & GTM Outreach Audit Report — LTIMindtree Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `92 / 100`  
> **Total WCAG Violations:** `2`  
> **Verified Contact Email:** `info@ltimindtree.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟢 Excellent (Low Risk)
- **What this Score Means:** The website adheres well to WCAG 2.1 AA accessibility standards. Disabled users and screen reader operators can navigate the platform with minimal friction.
- **Business & Legal Risk:** Low compliance risk. Minor polish needed for complete digital inclusion.
- **Primary Outreach Contact:** `info@ltimindtree.com` (`Unverified - guessed pattern`)

### Executive Overview & Pitch Angle
This company currently scores **92/100** on automated WCAG 2.1 AA accessibility testing with **2 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `92/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `1` | Serious: `1` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 1 violations
- 🎨 **Color Contrast Failures:** 0 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 1 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (1 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Keyboard & Focus Management (1 issues):** Ensure all interactive buttons/links are focusable via `Tab` key and visual focus outlines are visible.

---

## 1. Company & Website Verification
- **Company Name:** LTIMindtree Limited
- **Resolved URL:** [https://www.ltimindtree.com](https://www.ltimindtree.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `info@ltimindtree.com` (`Unverified - guessed pattern`)
- **Overall Discovery Status:** `Unverified - guessed pattern`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email (Guessed Pattern):** `info@ltimindtree.com` | **Status:** `Unverified - guessed pattern`
- **Investor Grievance Email (Guessed Pattern):** `contact@ltimindtree.com` | **Status:** `Unverified - guessed pattern`

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[keyboard_navigation] aria-hidden-focus`** (SERIOUS)
   - **Help:** ARIA hidden element must not be focusable or contain focusable elements
   - **Selector:** `.slick-current`
2. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `.ltm-overview__image`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/LTIMindtree_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/LTIMindtree_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/LTIMindtree_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
