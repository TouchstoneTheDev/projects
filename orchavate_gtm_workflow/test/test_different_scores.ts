import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { captureCompulsoryToolScreenshots } from '../src/screenshots/compulsory_screenshots.js';
import { AuditViolation } from '../src/types.js';

async function runTest() {
  const outDir = path.join(process.cwd(), 'orchavate_gtm_workflow/outputs/screenshots/test_diff');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('https://mutualfund.adityabirlacapital.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Company A: High violations (4 violations)
  const companyAViolations: AuditViolation[] = [
    { id: 'image-alt', impact: 'critical', description: 'Alt text', help: 'Alt text', helpUrl: '', category: 'missing_alt_text', selector: 'img', html: '', pageName: 'Homepage' },
    { id: 'color-contrast', impact: 'serious', description: 'Contrast', help: 'Contrast', helpUrl: '', category: 'color_contrast', selector: 'button', html: '', pageName: 'Homepage' },
    { id: 'label', impact: 'serious', description: 'Label', help: 'Label', helpUrl: '', category: 'form_labels', selector: 'input', html: '', pageName: 'Homepage' },
    { id: 'tabindex', impact: 'moderate', description: 'Keyboard', help: 'Keyboard', helpUrl: '', category: 'keyboard_navigation', selector: 'a', html: '', pageName: 'Homepage' }
  ];

  // Company B: Zero violations (0 violations)
  const companyBViolations: AuditViolation[] = [];

  console.log('Generating screenshots for Company A (4 violations)...');
  await captureCompulsoryToolScreenshots(page, 'Company_A', 'Homepage', companyAViolations, 84, outDir);

  console.log('Generating screenshots for Company B (0 violations)...');
  await captureCompulsoryToolScreenshots(page, 'Company_B', 'Homepage', companyBViolations, 100, outDir);

  await browser.close();
  console.log('Done!');
}

runTest().catch(console.error);
