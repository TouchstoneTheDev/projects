import { Page } from 'playwright';

export interface LighthouseOverlayData {
  url: string;
  a11yScore: number;
  perfScore: number;
  bpScore: number;
  seoScore: number;
  totalAlt: number;
  totalContrast: number;
  totalLabels: number;
  totalErrors: number;
}

export async function injectLighthouseOverlay(page: Page, data: LighthouseOverlayData): Promise<void> {
  await page.evaluate((d) => {
    const oldLh = document.getElementById('lighthouse-report-container-full');
    if (oldLh) oldLh.remove();

    const container = document.createElement('div');
    container.id = 'lighthouse-report-container-full';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.backgroundColor = '#202124';
    container.style.color = '#e8eaed';
    container.style.fontFamily = 'Roboto, system-ui, -apple-system, sans-serif';
    container.style.zIndex = '9999999';
    container.style.overflowY = 'auto';
    container.style.padding = '24px';
    container.style.boxSizing = 'border-box';

    const a11yColor = d.a11yScore >= 90 ? '#0cce6b' : d.a11yScore >= 50 ? '#ffa400' : '#ff4e42';
    const perfColor = d.perfScore >= 90 ? '#0cce6b' : d.perfScore >= 50 ? '#ffa400' : '#ff4e42';
    const bpColor = d.bpScore >= 90 ? '#0cce6b' : d.bpScore >= 50 ? '#ffa400' : '#ff4e42';
    const seoColor = d.seoScore >= 90 ? '#0cce6b' : d.seoScore >= 50 ? '#ffa400' : '#ff4e42';

    container.innerHTML = `
      <div style="max-width: 840px; margin: 0 auto; background: #292a2d; border-radius: 12px; padding: 28px; border: 1px solid #3c4043; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #3c4043; padding-bottom: 20px; margin-bottom: 24px;">
          <div>
            <h2 style="margin:0; font-size: 24px; color: #ffffff; display: flex; align-items: center; gap: 10px;">
              ⚡ Lighthouse Report
            </h2>
            <span style="font-size: 13px; color: #9aa0a6;">${d.url}</span>
          </div>
          <div style="font-size: 12px; color: #9aa0a6; text-align: right;">
            Chrome 127.0.0.0 / Mobile & Desktop
          </div>
        </div>

        <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 36px; padding: 24px 0; background: #202124; border-radius: 8px;">
          <div style="text-align: center;">
            <div style="width: 76px; height: 76px; border-radius: 50%; border: 6px solid ${perfColor}; display: flex; justify-content: center; align-items: center; font-size: 26px; font-weight: bold; color: ${perfColor}; margin: 0 auto 8px auto;">
              ${d.perfScore}
            </div>
            <span style="font-size: 13px; color: #e8eaed;">Performance</span>
          </div>

          <div style="text-align: center;">
            <div style="width: 76px; height: 76px; border-radius: 50%; border: 6px solid ${a11yColor}; display: flex; justify-content: center; align-items: center; font-size: 26px; font-weight: bold; color: ${a11yColor}; margin: 0 auto 8px auto;">
              ${d.a11yScore}
            </div>
            <span style="font-size: 13px; font-weight: bold; color: #ffffff;">Accessibility</span>
          </div>

          <div style="text-align: center;">
            <div style="width: 76px; height: 76px; border-radius: 50%; border: 6px solid ${bpColor}; display: flex; justify-content: center; align-items: center; font-size: 26px; font-weight: bold; color: ${bpColor}; margin: 0 auto 8px auto;">
              ${d.bpScore}
            </div>
            <span style="font-size: 13px; color: #e8eaed;">Best Practices</span>
          </div>

          <div style="text-align: center;">
            <div style="width: 76px; height: 76px; border-radius: 50%; border: 6px solid ${seoColor}; display: flex; justify-content: center; align-items: center; font-size: 26px; font-weight: bold; color: ${seoColor}; margin: 0 auto 8px auto;">
              ${d.seoScore}
            </div>
            <span style="font-size: 13px; color: #e8eaed;">SEO</span>
          </div>
        </div>

        <div style="border-top: 1px solid #3c4043; padding-top: 20px;">
          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #ffffff;">Accessibility Audits Breakdown</h3>
          <div style="background: #202124; border-radius: 8px; padding: 16px; border: 1px solid #3c4043;">
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #292a2d;">
              <span>🔴 Image elements do not have [alt] attributes</span>
              <span style="color: ${d.totalAlt > 0 ? '#ff4e42' : '#0cce6b'}; font-weight: bold;">${d.totalAlt > 0 ? `Failed (${d.totalAlt})` : 'Passed'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #292a2d;">
              <span>🔴 Background and foreground colors do not have a sufficient contrast ratio</span>
              <span style="color: ${d.totalContrast > 0 ? '#ff4e42' : '#0cce6b'}; font-weight: bold;">${d.totalContrast > 0 ? 'Failed' : 'Passed'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #292a2d;">
              <span>🔴 Form elements do not have associated labels</span>
              <span style="color: ${d.totalLabels > 0 ? '#ff4e42' : '#0cce6b'}; font-weight: bold;">${d.totalLabels > 0 ? `Failed (${d.totalLabels})` : 'Passed'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #292a2d;">
              <span>🔴 Touch targets do not have sufficient size or spacing</span>
              <span style="color: ${d.totalErrors > 15 ? '#ff4e42' : '#0cce6b'}; font-weight: bold;">${d.totalErrors > 15 ? 'Failed' : 'Passed'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0;">
              <span>🟢 [aria-*] attributes are valid and well-formed</span>
              <span style="color: #0cce6b; font-weight: bold;">Passed</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
  }, data);
}

export async function removeLighthouseOverlay(page: Page): Promise<void> {
  await page.evaluate(() => {
    const lh = document.getElementById('lighthouse-report-container-full');
    if (lh) lh.remove();
  });
}
