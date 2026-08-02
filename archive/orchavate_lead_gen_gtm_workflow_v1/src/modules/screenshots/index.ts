import { Page } from 'playwright';

export const captureScreenshot = async (page: Page, outputPath: string): Promise<string> => {
  await page.screenshot({ path: outputPath, fullPage: true });
  return outputPath;
};
