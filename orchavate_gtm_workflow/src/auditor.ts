import { Page } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { AuditViolation, PageAuditResult, ViolationCategory } from './types.js';

export function categorizeViolation(id: string, help: string): ViolationCategory {
  const lowerId = id.toLowerCase();
  const lowerHelp = help.toLowerCase();

  if (lowerId.includes('image-alt') || lowerId.includes('alt') || lowerHelp.includes('alternative text') || lowerHelp.includes('alt text')) {
    return 'missing_alt_text';
  }
  if (lowerId.includes('color-contrast') || lowerId.includes('contrast') || lowerHelp.includes('contrast')) {
    return 'color_contrast';
  }
  if (lowerId.includes('label') || lowerId.includes('form') || lowerHelp.includes('label') || lowerHelp.includes('form element')) {
    return 'form_labels';
  }
  if (lowerId.includes('tabindex') || lowerId.includes('keyboard') || lowerId.includes('focus') || lowerHelp.includes('keyboard')) {
    return 'keyboard_navigation';
  }
  return 'other';
}

export async function auditPageWithAxe(
  page: Page,
  pageName: PageAuditResult['pageName'],
  url: string
): Promise<PageAuditResult> {
  let accessible = true;
  let axeViolations: AuditViolation[] = [];
  let lighthouseScore = 100;

  try {
    if (page.url() !== url) {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    }

    const axeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    for (const v of axeResults.violations) {
      const category = categorizeViolation(v.id, v.help);
      for (const node of v.nodes) {
        axeViolations.push({
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

    if (axeViolations.length > 0) {
      lighthouseScore = Math.max(30, 100 - (axeViolations.length * 4));
    }
  } catch (err: any) {
    console.warn(`  [Auditor Warning] ${pageName} (${url}): ${err?.message}`);
    accessible = false;
  }

  return {
    pageName,
    url,
    accessible,
    axeViolations,
    lighthouseScore,
    screenshots: [],
  };
}
