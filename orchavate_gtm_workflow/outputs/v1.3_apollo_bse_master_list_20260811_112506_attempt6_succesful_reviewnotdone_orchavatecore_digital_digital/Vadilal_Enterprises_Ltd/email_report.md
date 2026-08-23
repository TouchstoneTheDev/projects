# Accessibility & GTM Outreach Audit Report — Vadilal Enterprises Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `33`  
> **Verified Contact Email:** `info@vadilalgroup.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `info@vadilalgroup.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **33 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `27` | Serious: `6` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 24 violations
- 🎨 **Color Contrast Failures:** 0 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (24 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.

---

## 1. Company & Website Verification
- **Company Name:** Vadilal Enterprises Ltd
- **Resolved URL:** [https://vadilalicecreams.com](https://vadilalicecreams.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `info@vadilalgroup.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **General Contact Email:** `info@vadilalgroup.com` | **Status:** `Verified` | **Source Page:** https://vadilalicecreams.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] html-has-lang`** (SERIOUS)
   - **Help:** <html> element must have a lang attribute
   - **Selector:** `html`
2. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `.HomeAbout_features_item__WcnNN.animateDefault[data-scroll="out"]:nth-child(1) > .HomeAbout_feature_icon__ma827`
3. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `.HomeAbout_features_item__WcnNN.animateDefault[data-scroll="out"]:nth-child(2) > .HomeAbout_feature_icon__ma827`
4. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `.HomeAbout_features_item__WcnNN.animateDefault[data-scroll="out"]:nth-child(3) > .HomeAbout_feature_icon__ma827`
5. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `.HomeAbout_features_item__WcnNN.animateDefault[data-scroll="out"]:nth-child(4) > .HomeAbout_feature_icon__ma827`
6. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `.HomeFullOfIndulgence_mainSlider__9JVRB.undefined:nth-child(1) > .HomeFullOfIndulgence_slider__z4Yef > .marquee-container > .marquee:nth-child(2) > .HomeFullOfIndulgence_content__hMT4H:nth-child(1) > .HomeFullOfIndulgence_content_img___aGz6 > img`
7. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `.HomeFullOfIndulgence_mainSlider__9JVRB.undefined:nth-child(1) > .HomeFullOfIndulgence_slider__z4Yef > .marquee-container > .marquee:nth-child(2) > .HomeFullOfIndulgence_content__hMT4H:nth-child(2) > .HomeFullOfIndulgence_content_img___aGz6 > img`
8. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `.HomeFullOfIndulgence_mainSlider__9JVRB.undefined:nth-child(1) > .HomeFullOfIndulgence_slider__z4Yef > .marquee-container > .marquee:nth-child(2) > .HomeFullOfIndulgence_content__hMT4H:nth-child(3) > .HomeFullOfIndulgence_content_img___aGz6 > img`
9. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `.HomeFullOfIndulgence_mainSlider__9JVRB.undefined:nth-child(1) > .HomeFullOfIndulgence_slider__z4Yef > .marquee-container > .marquee:nth-child(2) > .HomeFullOfIndulgence_content__hMT4H:nth-child(4) > .HomeFullOfIndulgence_content_img___aGz6 > img`
10. **`[missing_alt_text] image-alt`** (CRITICAL)
   - **Help:** Images must have alternative text
   - **Selector:** `.HomeFullOfIndulgence_mainSlider__9JVRB.undefined:nth-child(1) > .HomeFullOfIndulgence_slider__z4Yef > .marquee-container > .marquee:nth-child(2) > .HomeFullOfIndulgence_content__hMT4H:nth-child(5) > .HomeFullOfIndulgence_content_img___aGz6 > img`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Vadilal_Enterprises_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Vadilal_Enterprises_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Vadilal_Enterprises_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
