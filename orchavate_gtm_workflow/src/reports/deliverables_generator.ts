import fs from 'fs';
import path from 'path';
import { CompanyAuditReportV11, DeliverablePair } from '../types.js';

export function generateDeliverablePairs(
  report: CompanyAuditReportV11,
  companyDir: string
): CompanyAuditReportV11['deliverables'] {
  if (!fs.existsSync(companyDir)) {
    fs.mkdirSync(companyDir, { recursive: true });
  }

  const safeCompany = report.company.companyName.replace(/[^a-zA-Z0-9]/g, '_');
  const masterReportPath = path.join(companyDir, `Audit_Report.md`);

  const regardingListMd = report.emailDiscovery.regardingAccessibility.length > 0
    ? report.emailDiscovery.regardingAccessibility.map(e => 
        `- **${e.label}:** \`${e.address}\` | **Status:** \`${e.status}\`${e.sourceUrl ? ` | **Source Page:** ${e.sourceUrl}` : ''}`
      ).join('\n')
    : `- None found (Generated Fallback: \`${report.emailDiscovery.primaryEmail.address}\`)`;

  const topViolationsList = report.pages[0]?.axeViolations && report.pages[0].axeViolations.length > 0
    ? report.pages[0].axeViolations.slice(0, 10).map((v, idx) => 
        `${idx + 1}. **\`[${v.category}] ${v.id}\`** (${v.impact.toUpperCase()})\n   - **Help:** ${v.help || v.description}\n   - **Selector:** \`${v.selector}\``
      ).join('\n')
    : `*No WCAG accessibility violations detected.*`;

  // 1. Non-Dev / Executive Summary Logic
  const score = report.lighthouseAvgScore;
  let nonDevRating = '🟢 Excellent (Low Risk)';
  let nonDevMeaning = 'The website adheres well to WCAG 2.1 AA accessibility standards. Disabled users and screen reader operators can navigate the platform with minimal friction.';
  let nonDevBusinessImpact = 'Low compliance risk. Minor polish needed for complete digital inclusion.';

  if (score < 50) {
    nonDevRating = '🔴 Critical (High Legal & Compliance Risk)';
    nonDevMeaning = 'The website has severe accessibility barriers. Screen readers, keyboard-only users, and visually impaired visitors will struggle or fail to use key services.';
    nonDevBusinessImpact = 'High compliance and legal risk under WCAG 2.1 AA standards. Immediate outreach recommended to offer remediation.';
  } else if (score < 90) {
    nonDevRating = '🟠 Moderate (Needs Improvement)';
    nonDevMeaning = 'The website is partially accessible but contains noticeable barriers in image descriptions, color contrast, or navigation controls.';
    nonDevBusinessImpact = 'Moderate compliance risk. Potential loss of disabled customers and non-compliance with digital accessibility guidelines.';
  }

  // 2. Dev / Technical Summary Logic
  const devRemediationSteps: string[] = [];
  if (report.altTextViolations > 0) {
    devRemediationSteps.push(`- **Image Alt Attributes (${report.altTextViolations} issues):** Add meaningful \`alt="..."\` text to all \`<img>\` tags. Use \`alt=""\` for purely decorative images.`);
  }
  if (report.contrastViolations > 0) {
    devRemediationSteps.push(`- **Color Contrast Ratios (${report.contrastViolations} issues):** Ensure text contrast against background meets minimum 4.5:1 ratio for normal text and 3:1 for large text.`);
  }
  if (report.labelViolations > 0) {
    devRemediationSteps.push(`- **Form Labels & ARIA (${report.labelViolations} issues):** Associate all \`<input>\` and \`<select>\` elements with explicit \`<label for="...">\` tags or \`aria-label\` attributes.`);
  }
  if (report.keyboardViolations > 0) {
    devRemediationSteps.push(`- **Keyboard & Focus Management (${report.keyboardViolations} issues):** Ensure all interactive buttons/links are focusable via \`Tab\` key and visual focus outlines are visible.`);
  }

  const devRemediationMd = devRemediationSteps.length > 0
    ? devRemediationSteps.join('\n')
    : `- **Clean Codebase:** No automated DOM accessibility defects found on scanned pages. Keep auditing dynamic components.`;

  const masterMarkdown = `# Accessibility & GTM Outreach Audit Report — ${report.company.companyName}

> **Audit Status:** \`${report.status}\`  
> **Lighthouse Accessibility Score:** \`${report.lighthouseAvgScore} / 100\`  
> **Total WCAG Violations:** \`${report.totalViolations}\`  
> **Verified Contact Email:** \`${report.emailDiscovery.primaryEmail.address}\`  

---

## 👔 Executive Summary (For Non-Technical & Business Stakeholders)

- **Accessibility Rating:** ${nonDevRating}
- **What this Score Means:** ${nonDevMeaning}
- **Business & Legal Risk:** ${nonDevBusinessImpact}
- **Primary Outreach Contact:** \`${report.emailDiscovery.primaryEmail.address}\` (\`${report.emailDiscovery.primaryEmail.status}\`)

### Executive Overview & Pitch Angle
This company currently scores **${score}/100** on automated WCAG 2.1 AA accessibility testing with **${report.totalViolations} identified WCAG violations**. 
Addressing these compliance barriers will improve digital reach, satisfy regulatory requirements, and protect against accessibility lawsuits.

---

## 💻 Developer & Engineering Technical Breakdown

- **Lighthouse A11y Metric:** \`${report.lighthouseAvgScore}/100\`
- **Axe-core Rule Engine Status:** Evaluated across Homepage DOM tree.
- **Impact Breakdown:** Critical: \`${report.pages[0]?.axeViolations.filter(v => v.impact === 'critical').length || 0}\` | Serious: \`${report.pages[0]?.axeViolations.filter(v => v.impact === 'serious').length || 0}\` | Moderate: \`${report.pages[0]?.axeViolations.filter(v => v.impact === 'moderate').length || 0}\`

### Technical Violation Breakdown
- 🖼️ **Missing Alt Text:** ${report.altTextViolations} violations
- 🎨 **Color Contrast Failures:** ${report.contrastViolations} violations
- 📝 **Form & Structural Labels:** ${report.labelViolations} violations
- ⌨️ **Keyboard Navigation & Focus:** ${report.keyboardViolations} violations

### Priority Code Remediation Steps for Developers
${devRemediationMd}

---

## 1. Company & Website Verification
- **Company Name:** ${report.company.companyName}
- **Resolved URL:** ${report.resolution.resolvedUrl ? `[${report.resolution.resolvedUrl}](${report.resolution.resolvedUrl})` : 'N/A'}
- **Resolution Source:** \`${report.resolution.source}\` (${report.resolution.confidence} Confidence)
- **Status:** ${report.resolution.hasConflict ? '⚠️ CONFLICT FLAGGED' : '✓ Verified & Confirmed'}
- **Assigned Auditor:** ${report.company.assignedTo || 'Unassigned'}
- **Verified By:** ${report.company.verifiedBy || 'Orchavate Automated Tool v1.1'}
${report.resolution.conflictDetails ? `- **Resolution Notes:** ${report.resolution.conflictDetails}` : ''}

---

## 2. Email & Contact Discovery
- **Primary Contact Email:** \`${report.emailDiscovery.primaryEmail.address}\` (\`${report.emailDiscovery.primaryEmail.status}\`)
- **Overall Discovery Status:** \`${report.emailDiscovery.overallStatus}\`

### Discovered Accessibility / Compliance Endpoints
${regardingListMd}

---

## 3. Detailed WCAG Violation Log (DOM Selectors)
${topViolationsList}

---

## 4. Evidence & Tool Screenshots
- 🎨 **WAVE WebAIM Overlay:** \`screenshots/${safeCompany}_Homepage_WAVE_Overlay.png\`
- 🛡️ **Axe DevTools Panel:** \`screenshots/${safeCompany}_Homepage_Axe_DevTools.png\`
- ⚡ **Lighthouse Summary:** \`screenshots/${safeCompany}_Homepage_Lighthouse_Summary.png\`

---
*Report generated automatically by Orchavate GTM Accessibility Workflow v1.1*
`;

  fs.writeFileSync(masterReportPath, masterMarkdown, 'utf8');

  // Backwards compatibility output
  fs.writeFileSync(path.join(companyDir, `website_report.md`), masterMarkdown, 'utf8');
  fs.writeFileSync(path.join(companyDir, `email_report.md`), masterMarkdown, 'utf8');
  fs.writeFileSync(path.join(companyDir, `accessibility_report.md`), masterMarkdown, 'utf8');

  const websiteScreenshotPath = report.pages[0]?.screenshots[0] || path.join(companyDir, 'screenshots', `${safeCompany}_Homepage_WAVE_Overlay.png`);
  const emailScreenshotPath = report.emailDiscovery.evidenceScreenshots[0] || path.join(companyDir, 'screenshots', `${safeCompany}_EmailEvidence_NotFound_ContactPage.png`);
  const toolScreenshotPath = report.pages[0]?.screenshots[0] || path.join(companyDir, 'screenshots', `${safeCompany}_Homepage_WAVE_Overlay.png`);

  const websitePair: DeliverablePair = {
    name: 'Official Website',
    reportPath: masterReportPath,
    screenshotPath: websiteScreenshotPath,
    markdownContent: masterMarkdown,
  };

  const emailPair: DeliverablePair = {
    name: 'Email Addresses',
    reportPath: masterReportPath,
    screenshotPath: emailScreenshotPath,
    markdownContent: masterMarkdown,
  };

  const toolsPair: DeliverablePair = {
    name: 'Tool Scans',
    reportPath: masterReportPath,
    screenshotPath: toolScreenshotPath,
    markdownContent: masterMarkdown,
  };

  return { websitePair, emailPair, toolsPair };
}
