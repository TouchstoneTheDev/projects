# Accessibility & GTM Outreach Audit Report — Piramal Finance Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `96 / 100`  
> **Total WCAG Violations:** `1`  
> **Verified Contact Email:** `investors@piramal.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟢 Excellent (Low Risk)
- **What this Score Means:** The website adheres well to WCAG 2.1 AA accessibility standards. Disabled users and screen reader operators can navigate the platform with minimal friction.
- **Business & Legal Risk:** Low compliance risk. Minor polish needed for complete digital inclusion.
- **Primary Outreach Contact:** `investors@piramal.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **96/100** on automated WCAG 2.1 AA accessibility testing with **1 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `96/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `1` | Serious: `0` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 1 violations
- 🎨 **Color Contrast Failures:** 0 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (1 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.

---

## 1. Company & Website Verification
- **Company Name:** Piramal Finance Limited
- **Resolved URL:** [https://www.piramalfinance.com](https://www.piramalfinance.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `investors@piramal.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **Investor Grievance / Compliance Officer Email:** `investors@piramal.com` | **Status:** `Verified` | **Source Page:** https://www.piramalfinance.com/investors
- **General Contact Email:** `investors@piramal.com` | **Status:** `Verified` | **Source Page:** https://www.piramalfinance.com/investors

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `img[data-icon-name="headset"]`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Piramal_Finance_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Piramal_Finance_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Piramal_Finance_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
