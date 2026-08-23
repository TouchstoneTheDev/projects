# Accessibility & GTM Outreach Audit Report — Zenith Exports Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `84 / 100`  
> **Total WCAG Violations:** `4`  
> **Verified Contact Email:** `info@zenithexportslimited.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟠 Moderate (Needs Improvement)
- **What this Score Means:** The website is partially accessible but contains noticeable barriers in image descriptions, color contrast, or navigation controls.
- **Business & Legal Risk:** Moderate compliance risk. Potential loss of disabled customers and non-compliance with digital accessibility guidelines.
- **Primary Outreach Contact:** `info@zenithexportslimited.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **84/100** on automated WCAG 2.1 AA accessibility testing with **4 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `84/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `0` | Serious: `4` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 3 violations
- 🎨 **Color Contrast Failures:** 0 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (3 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.

---

## 1. Company & Website Verification
- **Company Name:** Zenith Exports Ltd
- **Resolved URL:** [https://zenithexportslimited.com](https://zenithexportslimited.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `info@zenithexportslimited.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `info@zenithexportslimited.com` | **Status:** `Verified` | **Source Page:** https://zenithexportslimited.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] aria-command-name`** (SERIOUS)
   - **Help:** ARIA commands must have an accessible name
   - **Selector:** `.tx4Jvn`
2. **`[missing_alt_text] role-img-alt`** (SERIOUS)
   - **Help:** [role="img"] elements must have alternative text
   - **Selector:** `#comp-kb3its24__item1 > .ScPWgD.sYnD5h[data-testid="link"] > .ugyP6o[role="img"][data-testid="linkImageContainer"]`
3. **`[missing_alt_text] role-img-alt`** (SERIOUS)
   - **Help:** [role="img"] elements must have alternative text
   - **Selector:** `#comp-kb3its24__item-j9ples3e > .ScPWgD.sYnD5h[data-testid="link"] > .ugyP6o[role="img"][data-testid="linkImageContainer"]`
4. **`[missing_alt_text] role-img-alt`** (SERIOUS)
   - **Help:** [role="img"] elements must have alternative text
   - **Selector:** `#comp-kb3its24__item-j9plerjk > .ScPWgD.sYnD5h[data-testid="link"] > .ugyP6o[role="img"][data-testid="linkImageContainer"]`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Zenith_Exports_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Zenith_Exports_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Zenith_Exports_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
