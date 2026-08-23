# Accessibility & GTM Outreach Audit Report — Libord Finance Ltd

> **Audit Status:** `Completed`  
> **Lighthouse Accessibility Score:** `30 / 100`  
> **Total WCAG Violations:** `95`  
> **Verified Contact Email:** `customergrievances@libord.com`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** 🔴 Critical (High Legal & Compliance Risk)
- **What this Score Means:** The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.
- **Business & Legal Risk:** High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.
- **Primary Outreach Contact:** `customergrievances@libord.com` (`Verified`)

### Executive Overview & Pitch Angle
This company currently scores **30/100** on automated WCAG 2.1 AA accessibility testing with **95 identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** `30/100`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: `35` | Serious: `60` | Moderate: `0`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** 1 violations
- 🎨 **Color Contrast Failures:** 22 violations
- 📝 **Form & Structural Labels:** 0 violations
- ⌨️ **Keyboard Navigation & Focus:** 0 violations

### Priority Code Remediation Steps for Developers
- **Image Alt Attributes (1 issues):** Add meaningful `alt="..."` text to all `<img>` tags. Use `alt=""` for purely decorative images.
- **Color Contrast Ratios (22 issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.

---

## 1. Company & Website Verification
- **Company Name:** Libord Finance Ltd
- **Resolved URL:** [https://libordbroking.com](https://libordbroking.com)
- **Resolution Source:** `readymade-fallback` (HIGH Confidence)
- **Status:** ✓ Verified & Confirmed
- **Assigned Auditor:** Unassigned
- **Verified By:** Orchavate Automated Tool v1.1


---

## 2. Email & Contact Discovery
- **Primary Contact Email:** `customergrievances@libord.com` (`Verified`)
- **Overall Discovery Status:** `Verified`

### Discovered Accessibility / Compliance Endpoints
- **Investor Grievance / Compliance Officer Email:** `customergrievances@libord.com` | **Status:** `Verified` | **Source Page:** https://libordbroking.com
- **General Contact Email:** `customergrievances@libord.com` | **Status:** `Verified` | **Source Page:** https://libordbroking.com

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
1. **`[other] aria-required-parent`** (CRITICAL)
   - **Help:** Certain ARIA roles must be contained by particular parents
   - **Selector:** `.our_serv_tab.bottom_arrow.resp-tabs-list2 > .resp-tab-active2.resp-tab-item2[aria-controls="tab_item-0"]`
2. **`[other] aria-required-parent`** (CRITICAL)
   - **Help:** Certain ARIA roles must be contained by particular parents
   - **Selector:** `.our_serv_tab.bottom_arrow.resp-tabs-list2 > .resp-tab-item2[aria-controls="tab_item-1"][role="tab"]`
3. **`[other] aria-required-parent`** (CRITICAL)
   - **Help:** Certain ARIA roles must be contained by particular parents
   - **Selector:** `.our_serv_tab.bottom_arrow.resp-tabs-list2 > .resp-tab-item2[aria-controls="tab_item-2"][role="tab"]`
4. **`[other] aria-required-parent`** (CRITICAL)
   - **Help:** Certain ARIA roles must be contained by particular parents
   - **Selector:** `.our_serv_tab.top_arrow.resp-tabs-list2 > .resp-tab-item2[aria-controls="tab_item-3"][role="tab"]`
5. **`[other] aria-required-parent`** (CRITICAL)
   - **Help:** Certain ARIA roles must be contained by particular parents
   - **Selector:** `.resp-tab-item2[aria-controls="tab_item-4"][role="tab"]`
6. **`[other] aria-required-parent`** (CRITICAL)
   - **Help:** Certain ARIA roles must be contained by particular parents
   - **Selector:** `#Markets > .commonTab.resp-vtabs2.pb-5 > .container:nth-child(1) > .bottom_arrow.resp-tabs-list2 > .resp-tab-active2.resp-tab-item2[aria-controls="tab_item-0"]`
7. **`[other] aria-required-parent`** (CRITICAL)
   - **Help:** Certain ARIA roles must be contained by particular parents
   - **Selector:** `#Research > .commonTab.resp-vtabs2.com_pattern > .container:nth-child(1) > .bottom_arrow.resp-tabs-list2 > .resp-tab-active2.resp-tab-item2[aria-controls="tab_item-0"]`
8. **`[other] aria-required-parent`** (CRITICAL)
   - **Help:** Certain ARIA roles must be contained by particular parents
   - **Selector:** `#Research > .commonTab.resp-vtabs2.com_pattern > .container:nth-child(1) > .bottom_arrow.resp-tabs-list2 > .resp-tab-item2[aria-controls="tab_item-1"][role="tab"]`
9. **`[other] aria-required-parent`** (CRITICAL)
   - **Help:** Certain ARIA roles must be contained by particular parents
   - **Selector:** `#Research > .commonTab.resp-vtabs2.com_pattern > .container:nth-child(1) > .bottom_arrow.resp-tabs-list2 > .resp-tab-item2[aria-controls="tab_item-2"][role="tab"]`
10. **`[other] aria-required-parent`** (CRITICAL)
   - **Help:** Certain ARIA roles must be contained by particular parents
   - **Selector:** `#Research > .commonTab.resp-vtabs2.com_pattern > .container:nth-child(3) > .top_arrow.resp-tabs-list2 > .resp-tab-item2[aria-controls="tab_item-3"][role="tab"]`

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** `screenshots/Libord_Finance_Ltd_Homepage_WAVE_Overlay.png`
- 🛡️ **Axe DevTools Panel:** `screenshots/Libord_Finance_Ltd_Homepage_Axe_DevTools.png`
- ⚡ **Lighthouse Summary:** `screenshots/Libord_Finance_Ltd_Homepage_Lighthouse_Summary.png`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
