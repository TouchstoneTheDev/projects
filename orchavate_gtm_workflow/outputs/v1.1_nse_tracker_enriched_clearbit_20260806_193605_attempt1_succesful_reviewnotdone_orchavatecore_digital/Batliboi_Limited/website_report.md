# Accessibility & GTM Outreach Audit Report — Batliboi Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `32 / 100`  
> **Total WCAG Violations:** `17`  
> **Verified Contact Email:** `info@batliboi.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `info@batliboi.com` (`Unverified - guessed pattern`)

### Executive Overview & Pitch Angle
This company currently scores **32/100** on automated WCAG 2.1 AA accessibility testing with **17 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `32/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `0` | Serious: `17` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 12 violations
- 🎨 **Color Contrast Failures:** 0 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (12 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.

---

## 1. Company & Website Verification
- **Company Name:** Batliboi Limited
- **Resolved URL:** [https://batliboi.com](https://batliboi.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `info@batliboi.com` (`Unverified - guessed pattern`)
- **Overall Discovery Status:** `Unverified - guessed pattern`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email (Guessed Pattern):** `info@batliboi.com` | **Status:** `Unverified - guessed pattern`
- **Investor Grievance Email (Guessed Pattern):** `contact@batliboi.com` | **Status:** `Unverified - guessed pattern`

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] link-in-text-block`** (SERIOUS)
   - **Help:** Links must be distinguishable without relying on color
   - **Selector:** `a[href$="www.quickmill.com"]`
2. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.swiper-slide-duplicate-active.elementor-repeater-item-205a86b[data-swiper-slide-index="0"]:nth-child(1) > .swiper-slide-inner`
3. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.swiper-slide-visible > .swiper-slide-inner`
4. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.swiper-slide-duplicate-active.elementor-repeater-item-205a86b[data-swiper-slide-index="0"]:nth-child(9) > .swiper-slide-inner`
5. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.elementor-element-2942f5b > .elementor-widget-container > .elementor-image-box-wrapper > figure > a`
6. **`[missing_alt_text] role-img-alt`** (SERIOUS)
   - **Help:** [role="img"] elements must have alternative text
   - **Selector:** `.swiper-slide-duplicate-active.elementor-repeater-item-205a86b[data-swiper-slide-index="0"]:nth-child(1) > .swiper-slide-bg[role="img"]`
7. **`[missing_alt_text] role-img-alt`** (SERIOUS)
   - **Help:** [role="img"] elements must have alternative text
   - **Selector:** `.swiper-slide-duplicate-next.elementor-repeater-item-20d564e[data-swiper-slide-index="1"]:nth-child(2) > .swiper-slide-bg[role="img"]`
8. **`[missing_alt_text] role-img-alt`** (SERIOUS)
   - **Help:** [role="img"] elements must have alternative text
   - **Selector:** `.elementor-repeater-item-dc21ae4[data-swiper-slide-index="2"][aria-label="3 / 4"]:nth-child(3) > .swiper-slide-bg[role="img"]`
9. **`[missing_alt_text] role-img-alt`** (SERIOUS)
   - **Help:** [role="img"] elements must have alternative text
   - **Selector:** `.swiper-slide-prev > .swiper-slide-bg[role="img"]`
10. **`[missing_alt_text] role-img-alt`** (SERIOUS)
   - **Help:** [role="img"] elements must have alternative text
   - **Selector:** `.elementor-ken-burns--active`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Batliboi_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Batliboi_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Batliboi_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
