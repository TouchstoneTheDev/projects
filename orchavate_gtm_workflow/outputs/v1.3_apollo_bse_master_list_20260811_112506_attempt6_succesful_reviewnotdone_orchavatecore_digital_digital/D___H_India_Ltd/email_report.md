# Accessibility & GTM Outreach Audit Report — D & H India Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `52 / 100`  
> **Total WCAG Violations:** `12`  
> **Verified Contact Email:** `support@discord.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟠 Moderate (Needs Improvement)
- **What this Score Means:** The website is partially accessible but contains noticeable barriers in image descriptions, color contrast, or navigation controls.
- **Business & Legal Risk:** Moderate compliance risk. Potential loss of disabled customers and non-compliance with digital accessibility guidelines.
- **Primary Outreach Contact:** `support@discord.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **52/100** on automated WCAG 2.1 AA accessibility testing with **12 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `52/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `0` | Serious: `12` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 0 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Clean Codebase:** No automated DOM accessibility defects found on scanned pages. Keep auditing dynamic components.

---

## 1. Company & Website Verification
- **Company Name:** D & H India Ltd
- **Resolved URL:** [https://discord.com](https://discord.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `support@discord.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `support@discord.com` | **Status:** `Verified` | **Source Page:** https://discord.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.nav_link_dropdown.w-inline-block[href$="servers"]`
2. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.nav_link_dropdown.w-inline-block[href$="safety"]`
3. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.nav_link_dropdown.w-inline-block[href$="quests"]`
4. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `#w-dropdown-toggle-3 > .nav_link_dropdown.w-inline-block`
5. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.nav_link_dropdown.w-inline-block[href$="blog"]`
6. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.nav_link_dropdown.w-inline-block[href$="developers"]`
7. **`[other] nested-interactive`** (SERIOUS)
   - **Help:** Interactive controls must not be nested
   - **Selector:** `#w-dropdown-toggle-0`
8. **`[other] nested-interactive`** (SERIOUS)
   - **Help:** Interactive controls must not be nested
   - **Selector:** `#w-dropdown-toggle-1`
9. **`[other] nested-interactive`** (SERIOUS)
   - **Help:** Interactive controls must not be nested
   - **Selector:** `#w-dropdown-toggle-2`
10. **`[other] nested-interactive`** (SERIOUS)
   - **Help:** Interactive controls must not be nested
   - **Selector:** `#w-dropdown-toggle-3`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/D___H_India_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/D___H_India_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/D___H_India_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
