import path from 'path';
import { Page } from 'playwright';
import { AuditViolation } from './types.js';

export async function captureViolationScreenshots(
  page: Page,
  companyName: string,
  pageName: string,
  violations: AuditViolation[],
  screenshotsDir: string
): Promise<string[]> {
  const capturedPaths: string[] = [];
  const safeCompany = companyName.replace(/[^a-zA-Z0-9]/g, '_');
  const safePage = pageName.replace(/[^a-zA-Z0-9]/g, '_');

  // 1. Capture Full Page Overview Screenshot
  const overviewFilename = `${safeCompany}_${safePage}_Overview.png`;
  const overviewPath = path.join(screenshotsDir, overviewFilename);

  try {
    await page.screenshot({ path: overviewPath, fullPage: true });
    capturedPaths.push(overviewPath);
  } catch (err: any) {
    console.warn(`  [Screenshot Warning] Overview failed for ${companyName}: ${err?.message}`);
  }

  // 2. Capture Category Screenshots
  const categoriesSeen = new Set<string>();
  for (const v of violations) {
    if (categoriesSeen.has(v.category)) continue;
    categoriesSeen.add(v.category);

    const categoryFilename = `${safeCompany}_${safePage}_${v.category}.png`;
    const categoryPath = path.join(screenshotsDir, categoryFilename);

    try {
      const element = await page.$(v.selector);
      if (element) {
        await element.screenshot({ path: categoryPath });
        capturedPaths.push(categoryPath);
        v.screenshotPath = categoryPath;
      }
    } catch {
      // Fall back to full page if element clipping fails
      try {
        await page.screenshot({ path: categoryPath });
        capturedPaths.push(categoryPath);
        v.screenshotPath = categoryPath;
      } catch {}
    }
  }

  return capturedPaths;
}
