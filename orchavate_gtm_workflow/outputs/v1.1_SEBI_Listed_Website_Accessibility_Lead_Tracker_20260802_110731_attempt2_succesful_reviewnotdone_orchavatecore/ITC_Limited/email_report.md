# Accessibility & GTM Outreach Audit Report — ITC Limited

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `24`  
> **Verified Contact Email:** `contactus@itc.in`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `contactus@itc.in` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **24 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `15` | Serious: `9` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 5 violations
- 🎨 **Color Contrast Failures:** 0 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (5 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.

---

## 1. Company & Website Verification
- **Company Name:** ITC Limited
- **Resolved URL:** [https://www.itcportal.com](https://www.itcportal.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `contactus@itc.in` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `contactus@itc.in` | **Status:** `Verified` | **Source Page:** https://www.itcportal.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] aria-valid-attr-value`** (CRITICAL)
   - **Help:** ARIA attributes must conform to valid values
   - **Selector:** `#item_1707387764759-tab`
2. **`[other] aria-valid-attr-value`** (CRITICAL)
   - **Help:** ARIA attributes must conform to valid values
   - **Selector:** `#item_1703268035246-tab`
3. **`[other] aria-valid-attr`** (CRITICAL)
   - **Help:** ARIA attributes must conform to valid names
   - **Selector:** `.swiper-slide-active.topHighlights-container-item.swiper-slide > .highlights-card-title-description.link--clicks-link-parent > a > span[aria-highlights-icon="press_release_white"]`
4. **`[other] aria-valid-attr`** (CRITICAL)
   - **Help:** ARIA attributes must conform to valid names
   - **Selector:** `.swiper-slide-next.topHighlights-container-item.swiper-slide > .highlights-card-title-description.link--clicks-link-parent > a > span[aria-highlights-icon="press_release_white"]`
5. **`[other] aria-valid-attr`** (CRITICAL)
   - **Help:** ARIA attributes must conform to valid names
   - **Selector:** `.swiper-backface-hidden.topHighlights-container.swiper-initialized > .swiper-wrapper > .topHighlights-container-item.swiper-slide:nth-child(3) > .highlights-card-title-description.link--clicks-link-parent > a > span[aria-highlights-icon="press_release_white"]`
6. **`[other] aria-valid-attr`** (CRITICAL)
   - **Help:** ARIA attributes must conform to valid names
   - **Selector:** `.swiper-backface-hidden.topHighlights-container.swiper-initialized > .swiper-wrapper > .topHighlights-container-item.swiper-slide:nth-child(4) > .highlights-card-title-description.link--clicks-link-parent > a > span[aria-highlights-icon="press_release_white"]`
7. **`[other] aria-valid-attr`** (CRITICAL)
   - **Help:** ARIA attributes must conform to valid names
   - **Selector:** `.swiper-backface-hidden.topHighlights-container.swiper-initialized > .swiper-wrapper > .topHighlights-container-item.swiper-slide:nth-child(5) > .highlights-card-title-description.link--clicks-link-parent > a > span[aria-highlights-icon="press_release_white"]`
8. **`[other] aria-valid-attr`** (CRITICAL)
   - **Help:** ARIA attributes must conform to valid names
   - **Selector:** `.swiper-backface-hidden.topHighlights-container.swiper-initialized > .swiper-wrapper > .topHighlights-container-item.swiper-slide:nth-child(6) > .highlights-card-title-description.link--clicks-link-parent > a > span[aria-highlights-icon="press_release_white"]`
9. **`[other] aria-valid-attr`** (CRITICAL)
   - **Help:** ARIA attributes must conform to valid names
   - **Selector:** `.swiper-backface-hidden.topHighlights-container.swiper-initialized > .swiper-wrapper > .topHighlights-container-item.swiper-slide:nth-child(7) > .highlights-card-title-description.link--clicks-link-parent > a > span[aria-highlights-icon="press_release_white"]`
10. **`[other] aria-valid-attr`** (CRITICAL)
   - **Help:** ARIA attributes must conform to valid names
   - **Selector:** `.swiper-backface-hidden.topHighlights-container.swiper-initialized > .swiper-wrapper > .topHighlights-container-item.swiper-slide:nth-child(8) > .highlights-card-title-description.link--clicks-link-parent > a > span[aria-highlights-icon="press_release_white"]`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/ITC_Limited_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/ITC_Limited_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/ITC_Limited_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
