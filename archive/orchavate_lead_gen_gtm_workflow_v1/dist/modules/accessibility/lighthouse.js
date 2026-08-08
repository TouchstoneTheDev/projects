import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
export const runLighthouseAudit = async (url) => {
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
            report: result.report,
        };
    }
    finally {
        await chrome.kill();
    }
};
//# sourceMappingURL=lighthouse.js.map