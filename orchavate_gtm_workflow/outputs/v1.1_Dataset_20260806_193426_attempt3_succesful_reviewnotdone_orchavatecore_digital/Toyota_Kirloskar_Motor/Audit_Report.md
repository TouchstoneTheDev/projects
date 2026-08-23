# Accessibility & GTM Outreach Audit Report — Toyota Kirloskar Motor

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `23`  
> **Verified Contact Email:** `info@careers.toyotabharat.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `info@careers.toyotabharat.com` (`Unverified - guessed pattern`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **23 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `1` | Serious: `22` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 6 violations
- 🎨 **Color Contrast Failures:** 0 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (6 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.

---

## 1. Company & Website Verification
- **Company Name:** Toyota Kirloskar Motor
- **Resolved URL:** [https://careers.toyotabharat.com/](https://careers.toyotabharat.com/)
- **Resolution Source:** `self-search` (LOW Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Auditor 1
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `info@careers.toyotabharat.com` (`Unverified - guessed pattern`)
- **Overall Discovery Status:** `Unverified - guessed pattern`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email (Guessed Pattern):** `info@careers.toyotabharat.com` | **Status:** `Unverified - guessed pattern`
- **Investor Grievance Email (Guessed Pattern):** `contact@careers.toyotabharat.com` | **Status:** `Unverified - guessed pattern`

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `#sizing-addon1`
2. **`[other] aria-prohibited-attr`** (SERIOUS)
   - **Help:** Elements must only use permitted ARIA attributes
   - **Selector:** `.glyphicon-map-marker`
3. **`[other] document-title`** (SERIOUS)
   - **Help:** Documents must have <title> element to aid in navigation
   - **Selector:** `html`
4. **`[other] frame-title`** (SERIOUS)
   - **Help:** Frames must have an accessible name
   - **Selector:** `iframe`
5. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `.col-xs-3 > .custom-header-logo.customheaderlinkhovercolor24cae45e.backgroundcolor1e0b0d898c282c10 > .limitwidth > .inner > a > img`
6. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.col-xs-3 > .custom-header-logo.customheaderlinkhovercolor24cae45e.backgroundcolor1e0b0d898c282c10 > .limitwidth > .inner > a`
7. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.slick-current[data-slick-index="0"][aria-label="slide 1"] > div > .backgroundcolor1e0b0d898c282c10[aria-roledescription="slide"] > .imagelink > .backgroundimagec3c07ece-765b-4a61-a629-8.top.scaled > .hero-image[target="_blank"]`
8. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.slick-active[data-slick-index="1"][aria-label="slide 2"] > div > .backgroundcolor1e0b0d898c282c10[aria-roledescription="slide"] > .imagelink > .backgroundimage69c0f3d4-47dc-4f44-a526-4.top.scaled > .hero-image[target="_blank"]`
9. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.slick-active[data-slick-index="2"][aria-label="slide 3"] > div > .backgroundcolor1e0b0d898c282c10[aria-roledescription="slide"] > .imagelink > .backgroundimageda952853-097e-4ae6-95fe-2.top.scaled > .hero-image[target="_blank"]`
10. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.slick-active[data-slick-index="3"][aria-label="slide 4"] > div > .backgroundcolor1e0b0d898c282c10[aria-roledescription="slide"] > .imagelink > .backgroundimage6be3c0c3-989d-4ce2-a210-4.top.scaled > .hero-image[target="_blank"]`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Toyota_Kirloskar_Motor_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Toyota_Kirloskar_Motor_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Toyota_Kirloskar_Motor_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
