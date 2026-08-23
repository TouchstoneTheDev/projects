# Accessibility & GTM Outreach Audit Report — Elango Industries Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `40 / 100`  
> **Total WCAG Violations:** `15`  
> **Verified Contact Email:** `perkumpulan@elang.or.id`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `perkumpulan@elang.or.id` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **40/100** on automated WCAG 2.1 AA accessibility testing with **15 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `40/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `1` | Serious: `14` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 1 violations
- 🎨 **Color Contrast Failures:** 1 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (1 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Color Contrast Ratios (1 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Elango Industries Ltd
- **Resolved URL:** [https://elang.or.id](https://elang.or.id)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `perkumpulan@elang.or.id` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `perkumpulan@elang.or.id` | **Status:** `Verified` | **Source Page:** https://elang.or.id

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[color_contrast] color-contrast`** (SERIOUS)
   - **Help:** Elements must meet minimum color contrast ratio thresholds
   - **Selector:** `#menu-item-2467 > a[href$="elang.or.id/"] > .menu-text`
2. **`[other] frame-title`** (SERIOUS)
   - **Help:** Frames must have an accessible name
   - **Selector:** `iframe[width="600"]`
3. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `#menu-item-2695 > a[title="Sedagho Siak"] > .zolo-megamenu-icon > img`
4. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.zolo_blog_col.zolo_blog_col2.grid-item:nth-child(1) > .zolo_blog_box > .zolo_blog_horizontal_box > .zolo_blog_thumb > a`
5. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.zolo_blog_col.zolo_blog_col2.grid-item:nth-child(2) > .zolo_blog_box > .zolo_blog_horizontal_box > .zolo_blog_thumb > a`
6. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.zolo_blog_col.zolo_blog_col2.grid-item:nth-child(3) > .zolo_blog_box > .zolo_blog_horizontal_box > .zolo_blog_thumb > a`
7. **`[other] link-name`** (SERIOUS)
   - **Help:** Links must have discernible text
   - **Selector:** `.last.zolo_blog_col.zolo_blog_col2 > .zolo_blog_box > .zolo_blog_horizontal_box > .zolo_blog_thumb > a`
8. **`[other] list`** (SERIOUS)
   - **Help:** <ul> and <ol> must only directly contain <li>, <script> or <template> elements
   - **Selector:** `.zolo_slick_slider_holder`
9. **`[other] listitem`** (SERIOUS)
   - **Help:** <li> elements must be contained in a <ul> or <ol>
   - **Selector:** `.slick-current`
10. **`[other] listitem`** (SERIOUS)
   - **Help:** <li> elements must be contained in a <ul> or <ol>
   - **Selector:** `li[data-slick-index="1"]`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Elango_Industries_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Elango_Industries_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Elango_Industries_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
