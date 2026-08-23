# Accessibility & GTM Outreach Audit Report — DCB Bank Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `80 / 100`  
> **Total WCAG Violations:** `5`  
> **Verified Contact Email:** `customercare@dcb.bank.in`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🟠 Moderate (Needs Improvement)
- **What this Score Means:** The website is partially accessible but contains noticeable barriers in image descriptions, color contrast, or navigation controls.
- **Business & Legal Risk:** Moderate compliance risk. Potential loss of disabled customers and non-compliance with digital accessibility guidelines.
- **Primary Outreach Contact:** `customercare@dcb.bank.in` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **80/100** on automated WCAG 2.1 AA accessibility testing with **5 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `80/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `0` | Serious: `5` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 0 violations
- 🎨 **Color Contrast Failures:** 4 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Color Contrast Ratios (4 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** DCB Bank Limited
- **Resolved URL:** [https://dcbbank.com](https://dcbbank.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `customercare@dcb.bank.in` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `customercare@dcb.bank.in` | **Status:** `Verified` | **Source Page:** https://dcbbank.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.BannerLanding_embla__slide__55ZCT:nth-child(1) > .BannerLanding_hero-section__XTVGR > .align-items-center.row.d-flex > .order-2.order-lg-1.col-md-12 > .BannerLanding_left-hero-content__aducR > .BannerLanding_description__m_UNd`
2. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.PrimaryCta_contact-details__iJNzo > h4`
3. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.PrimaryCta_social-box-wrap__fOM53 > h4`
4. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `.PrimaryCta_app-store-wrap__9HWsL > h4`
5. **`[other] link-in-text-block`** (SERIOUS)
   - **Help:** Links must be distinguishable without relying on color
   - **Selector:** `a[href$="dicgc.org.in/"]`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/DCB_Bank_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/DCB_Bank_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/DCB_Bank_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
