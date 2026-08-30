import fs from 'node:fs/promises';
import path from 'node:path';
import playwright from 'playwright';
import { config } from '../../core/config/index.js';
import { ScanResult } from '../../types/index.js';
import { runAxeOnPage } from './axe.js';
import { runLighthouseAudit } from './lighthouse.js';
import { captureScreenshot } from '../screenshots/index.js';
import { createSafeFilename } from '../../utils/file.js';

export const runAccessibilityScan = async (
  companyName: string,
  websiteUrl: string,
): Promise<ScanResult> => {
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(websiteUrl, { waitUntil: 'networkidle' });
    const axeResult = await runAxeOnPage(page);
    const lighthouseResult = await runLighthouseAudit(websiteUrl);

    const screenshotsDir = path.resolve(config.OUTPUT_DIR, 'screenshots');
    await fs.mkdir(screenshotsDir, { recursive: true });
    const screenshotPath = path.join(screenshotsDir, `${createSafeFilename(companyName)}.png`);
    await captureScreenshot(page, screenshotPath);

    return {
      companyName,
      websiteUrl,
      status: 'success',
      accessibilityScore: Math.round((lighthouseResult.score ?? 0) * 100),
      violationsCount: axeResult.violations.length,
      remarks: `Axe violations: ${axeResult.violations.length}`,
      screenshotFiles: [screenshotPath],
    };
  } catch (error) {
    return {
      companyName,
      websiteUrl,
      status: 'failed',
      remarks: (error as Error).message,
    };
  } finally {
    await browser.close();
  }
};
