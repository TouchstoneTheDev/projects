import { Page } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { AuditViolation, PageAuditResult, ViolationCategory } from './types';

export function categorizeAxeRule(ruleId: string): ViolationCategory {
  if (['image-alt', 'input-image-alt', 'role-img-alt', 'area-alt', 'svg-img-alt'].includes(ruleId)) {
    return 'missing_alt_text';
  }
  if (['color-contrast'].includes(ruleId)) {
    return 'color_contrast';
  }
  if (['label', 'select-name', 'form-field-multiple-labels', 'label-title-only', 'input-button-name'].includes(ruleId)) {
    return 'form_labels';
  }
  if (['tabindex', 'focus-order-semantics', 'keyboard-trap', 'accesskeys', 'bypass', 'scrollable-region-focusable'].includes(ruleId)) {
    return 'keyboard_navigation';
  }
  return 'other';
}

export async function auditPageWithAxe(
  page: Page,
  pageName: 'Homepage' | 'About' | 'Contact' | 'Investor Relations' | 'Annual Report / PDF',
  url: string
): Promise<PageAuditResult> {
  const result: PageAuditResult = {
    pageName,
    url,
    accessible: true,
    axeViolations: [],
    lighthouseScore: 85,
    screenshots: [],
  };

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    const axeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const violations: AuditViolation[] = [];

    for (const v of axeResults.violations) {
      const category = categorizeAxeRule(v.id);
      for (const node of v.nodes) {
        violations.push({
          id: v.id,
          impact: (v.impact as any) || 'moderate',
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          category,
          selector: node.target.join(' > '),
          html: node.html,
          pageName,
        });
      }
    }

    result.axeViolations = violations;
    result.accessible = violations.length === 0;

    const criticalCount = violations.filter(v => v.impact === 'critical').length;
    const seriousCount = violations.filter(v => v.impact === 'serious').length;
    const moderateCount = violations.filter(v => v.impact === 'moderate').length;

    const penalty = (criticalCount * 15) + (seriousCount * 8) + (moderateCount * 3);
    result.lighthouseScore = Math.max(10, Math.min(100, 100 - penalty));

    return result;
  } catch (err: any) {
    result.accessible = false;
    result.lighthouseScore = 0;
    return result;
  }
}

export function getWaveWebUrl(websiteUrl: string): string {
  return `https://wave.webaim.org/report#/${encodeURIComponent(websiteUrl)}`;
}
