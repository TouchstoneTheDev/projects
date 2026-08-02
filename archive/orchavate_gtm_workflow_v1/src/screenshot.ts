import fs from 'fs';
import path from 'path';
import { Page } from 'playwright';
import { AuditViolation } from './types';

export function formatFileNameString(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').trim();
}

export async function captureViolationScreenshots(
  page: Page,
  companyName: string,
  pageName: string,
  violations: AuditViolation[],
  outputDir: string
): Promise<string[]> {
  const capturedPaths: string[] = [];
  const sanitizedCompany = formatFileNameString(companyName);
  const sanitizedPage = formatFileNameString(pageName);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fullPageFilename = `${sanitizedCompany}_${sanitizedPage}_Overview.png`;
  const fullPagePath = path.join(outputDir, fullPageFilename);
  try {
    await page.screenshot({ path: fullPagePath, fullPage: false });
    capturedPaths.push(fullPagePath);
  } catch {}

  const categoriesToCapture = Array.from(new Set(violations.map(v => v.category)));

  for (const cat of categoriesToCapture) {
    const categoryViolations = violations.filter(v => v.category === cat);
    if (categoryViolations.length === 0) continue;

    const sampleViolation = categoryViolations[0];
    const filename = `${sanitizedCompany}_${sanitizedPage}_${cat}.png`;
    const filepath = path.join(outputDir, filename);

    try {
      if (sampleViolation.selector) {
        const element = await page.$(sampleViolation.selector);
        if (element) {
          await element.screenshot({ path: filepath });
          sampleViolation.screenshotPath = filepath;
          capturedPaths.push(filepath);
          continue;
        }
      }
    } catch {}

    try {
      await page.screenshot({ path: filepath });
      sampleViolation.screenshotPath = filepath;
      capturedPaths.push(filepath);
    } catch {}
  }

  return capturedPaths;
}
