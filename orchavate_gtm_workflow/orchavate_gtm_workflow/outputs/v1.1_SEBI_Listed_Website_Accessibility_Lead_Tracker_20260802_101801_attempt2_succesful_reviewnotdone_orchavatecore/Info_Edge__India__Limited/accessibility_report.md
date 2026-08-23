# Accessibility & GTM Outreach Audit Report — Info Edge (India) Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `135`  
> **Verified Contact Email:** `investors@naukri.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `investors@naukri.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **135 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `62` | Serious: `73` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 26 violations
- 🎨 **Color Contrast Failures:** 20 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (26 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Color Contrast Ratios (20 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Info Edge (India) Limited
- **Resolved URL:** [https://www.infoedge.in](https://www.infoedge.in)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `investors@naukri.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **Investor Grievance / Compliance Officer Email:** `investors@naukri.com` | **Status:** `Verified` | **Source Page:** https://www.infoedge.in
- **General Contact Email:** `investors@naukri.com` | **Status:** `Verified` | **Source Page:** https://www.infoedge.in

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] aria-allowed-attr`** (CRITICAL)
   - **Help:** Elements must only use supported ARIA attributes
   - **Selector:** `.flex-active-slide > iframe[allow="encrypted-media"][allowfullscreen=""] > .ytmVideoInfoVideoTitle`
2. **`[other] aria-allowed-attr`** (CRITICAL)
   - **Help:** Elements must only use supported ARIA attributes
   - **Selector:** `li:nth-child(2) > iframe[allow="encrypted-media"][allowfullscreen=""] > .ytmVideoInfoVideoTitle`
3. **`[other] aria-allowed-attr`** (CRITICAL)
   - **Help:** Elements must only use supported ARIA attributes
   - **Selector:** `li:nth-child(3) > iframe[allow="encrypted-media"][allowfullscreen=""] > .ytmVideoInfoVideoTitle`
4. **`[other] aria-allowed-attr`** (CRITICAL)
   - **Help:** Elements must only use supported ARIA attributes
   - **Selector:** `li:nth-child(4) > iframe[allow="encrypted-media"][allowfullscreen=""] > .ytmVideoInfoVideoTitle`
5. **`[other] aria-allowed-attr`** (CRITICAL)
   - **Help:** Elements must only use supported ARIA attributes
   - **Selector:** `li:nth-child(5) > iframe[allow="encrypted-media"][allowfullscreen=""] > .ytmVideoInfoVideoTitle`
6. **`[other] aria-allowed-attr`** (CRITICAL)
   - **Help:** Elements must only use supported ARIA attributes
   - **Selector:** `li:nth-child(6) > iframe[allow="encrypted-media"][allowfullscreen=""] > .ytmVideoInfoVideoTitle`
7. **`[other] aria-allowed-attr`** (CRITICAL)
   - **Help:** Elements must only use supported ARIA attributes
   - **Selector:** `li:nth-child(7) > iframe[allow="encrypted-media"][allowfullscreen=""] > .ytmVideoInfoVideoTitle`
8. **`[other] aria-allowed-attr`** (CRITICAL)
   - **Help:** Elements must only use supported ARIA attributes
   - **Selector:** `li:nth-child(8) > iframe[allowfullscreen=""] > .ytmVideoInfoVideoTitle`
9. **`[other] aria-allowed-attr`** (CRITICAL)
   - **Help:** Elements must only use supported ARIA attributes
   - **Selector:** `li:nth-child(9) > iframe[allowfullscreen=""] > .ytmVideoInfoVideoTitle`
10. **`[other] aria-allowed-attr`** (CRITICAL)
   - **Help:** Elements must only use supported ARIA attributes
   - **Selector:** `li:nth-child(10) > iframe[allowfullscreen=""] > .ytmVideoInfoVideoTitle`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Info_Edge__India__Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Info_Edge__India__Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Info_Edge__India__Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
