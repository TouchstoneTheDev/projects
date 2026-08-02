import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';

export interface LighthouseResult {
  score: number;
  url: string;
  report: string;
}

export const runLighthouseAudit = async (url: string): Promise<LighthouseResult> => {
  const chrome = await launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'html',
      onlyCategories: ['accessibility'],
      logLevel: 'info',
    });

    if (!result) {
      throw new Error('Lighthouse did not return a result');
    }

    return {
      score: result.lhr?.categories?.accessibility?.score ?? 0,
      url,
      report: result.report as string,
    };
  } finally {
    await chrome.kill();
  }
};
