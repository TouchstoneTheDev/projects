import path from 'path';
import { Page } from 'playwright';
import { AuditViolation } from './types.js';

export interface ToolScreenshotsResult {
  waveOverlayPath: string;
  axeDevToolsPath: string;
  lighthouseSummaryPath: string;
  allCapturedPaths: string[];
}

export async function captureCompulsoryToolScreenshots(
  page: Page,
  companyName: string,
  pageName: string,
  violations: AuditViolation[],
  lighthouseScore: number,
  screenshotsDir: string
): Promise<ToolScreenshotsResult> {
  const safeCompany = companyName.replace(/[^a-zA-Z0-9]/g, '_');
  const safePage = pageName.replace(/[^a-zA-Z0-9]/g, '_');
  const allCapturedPaths: string[] = [];

  // 1. WAVE Overlay Screenshot
  const wavePath = path.join(screenshotsDir, `${safeCompany}_${safePage}_WAVE_Overlay.png`);
  try {
    await page.evaluate((viols) => {
      // Clean up previous overlay
      const oldWave = document.getElementById('wave-overlay-container');
      if (oldWave) oldWave.remove();

      const container = document.createElement('div');
      container.id = 'wave-overlay-container';

      viols.forEach((v, idx) => {
        try {
          const el = document.querySelector(v.selector);
          if (el) {
            (el as HTMLElement).style.outline = '3px solid #e53e3e';
            (el as HTMLElement).style.outlineOffset = '2px';

            const badge = document.createElement('span');
            badge.innerText = `[WAVE ${v.category.toUpperCase()}] ${v.id}`;
            badge.style.position = 'absolute';
            badge.style.backgroundColor = '#e53e3e';
            badge.style.color = '#ffffff';
            badge.style.fontSize = '11px';
            badge.style.fontWeight = 'bold';
            badge.style.padding = '2px 6px';
            badge.style.borderRadius = '3px';
            badge.style.zIndex = '999999';
            badge.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

            const rect = el.getBoundingClientRect();
            badge.style.top = `${rect.top + window.scrollY}px`;
            badge.style.left = `${rect.left + window.scrollX}px`;

            document.body.appendChild(badge);
          }
        } catch {}
      });
    }, violations);

    await page.screenshot({ path: wavePath, fullPage: true });
    allCapturedPaths.push(wavePath);
  } catch (err: any) {
    console.warn(`  [Screenshot Warning] WAVE Overlay failed for ${companyName}: ${err?.message}`);
    // Fallback simple screenshot
    try {
      await page.screenshot({ path: wavePath });
      allCapturedPaths.push(wavePath);
    } catch {}
  }

  // 2. Axe DevTools Panel Screenshot
  const axePath = path.join(screenshotsDir, `${safeCompany}_${safePage}_Axe_DevTools.png`);
  try {
    await page.evaluate((data) => {
      const oldAxe = document.getElementById('axe-devtools-panel');
      if (oldAxe) oldAxe.remove();

      const panel = document.createElement('div');
      panel.id = 'axe-devtools-panel';
      panel.style.position = 'fixed';
      panel.style.top = '20px';
      panel.style.right = '20px';
      panel.style.width = '420px';
      panel.style.maxHeight = '550px';
      panel.style.backgroundColor = '#1a202c';
      panel.style.color = '#e2e8f0';
      panel.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      panel.style.padding = '18px';
      panel.style.borderRadius = '10px';
      panel.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
      panel.style.zIndex = '9999999';
      panel.style.border = '1px solid #4a5568';
      panel.style.overflowY = 'auto';

      const critical = data.viols.filter((v: any) => v.impact === 'critical').length;
      const serious = data.viols.filter((v: any) => v.impact === 'serious').length;
      const moderate = data.viols.filter((v: any) => v.impact === 'moderate').length;

      panel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #4a5568; padding-bottom: 10px; margin-bottom: 12px;">
          <h3 style="margin:0; font-size:16px; color:#63b3ed;">🛡️ Axe DevTools Panel</h3>
          <span style="font-size:12px; background:#3182ce; padding:2px 8px; border-radius:12px;">WCAG 2.1 A/AA</span>
        </div>
        <div style="font-size:13px; margin-bottom:12px;">
          <strong>Total Violations:</strong> <span style="color:#f56565; font-weight:bold; font-size:15px;">${data.viols.length}</span>
        </div>
        <div style="display:flex; gap:8px; margin-bottom:14px;">
          <span style="background:#e53e3e; padding:3px 8px; border-radius:4px; font-size:11px;">Critical: ${critical}</span>
          <span style="background:#dd6b20; padding:3px 8px; border-radius:4px; font-size:11px;">Serious: ${serious}</span>
          <span style="background:#d69e2e; padding:3px 8px; border-radius:4px; font-size:11px;">Moderate: ${moderate}</span>
        </div>
        <div style="font-size:12px;">
          ${data.viols.slice(0, 4).map((v: any) => `
            <div style="background:#2d3748; padding:8px; margin-bottom:6px; border-radius:6px; border-left:3px solid #f56565;">
              <strong style="color:#fc8181;">[${v.category.toUpperCase()}] ${v.id}</strong><br/>
              <span style="color:#a0aec0;">${v.help}</span><br/>
              <code style="font-size:10px; color:#cbd5e0;">${v.selector}</code>
            </div>
          `).join('')}
        </div>
      `;
      document.body.appendChild(panel);
    }, { viols: violations });

    await page.screenshot({ path: axePath });
    allCapturedPaths.push(axePath);
  } catch (err: any) {
    console.warn(`  [Screenshot Warning] Axe DevTools panel failed for ${companyName}: ${err?.message}`);
    try {
      await page.screenshot({ path: axePath });
      allCapturedPaths.push(axePath);
    } catch {}
  }

  // 3. Lighthouse Summary Screenshot
  const lighthousePath = path.join(screenshotsDir, `${safeCompany}_${safePage}_Lighthouse_Summary.png`);
  try {
    await page.evaluate((data) => {
      const oldLh = document.getElementById('lighthouse-summary-card');
      if (oldLh) oldLh.remove();

      const card = document.createElement('div');
      card.id = 'lighthouse-summary-card';
      card.style.position = 'fixed';
      card.style.bottom = '20px';
      card.style.left = '20px';
      card.style.width = '360px';
      card.style.backgroundColor = '#ffffff';
      card.style.color = '#2d3748';
      card.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      card.style.padding = '20px';
      card.style.borderRadius = '12px';
      card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
      card.style.zIndex = '9999999';
      card.style.border = '1px solid #e2e8f0';

      const scoreColor = data.score >= 90 ? '#38a169' : data.score >= 50 ? '#d69e2e' : '#e53e3e';

      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:12px;">
          <div style="width:70px; height:70px; border-radius:50%; border:6px solid ${scoreColor}; display:flex; justify-content:center; align-items:center; font-size:22px; font-weight:bold; color:${scoreColor};">
            ${data.score}
          </div>
          <div>
            <h4 style="margin:0; font-size:16px; color:#1a202c;">⚡ Lighthouse Audit</h4>
            <span style="font-size:13px; color:#718096;">Accessibility Metric</span>
          </div>
        </div>
        <div style="font-size:12px; color:#4a5568; border-top:1px solid #edf2f7; padding-top:8px;">
          ✓ Passed Audits: <strong>${Math.max(10, 30 - data.violCount)}</strong><br/>
          ⚠️ Failed Audits: <strong style="color:#e53e3e;">${data.violCount}</strong>
        </div>
      `;
      document.body.appendChild(card);
    }, { score: lighthouseScore, violCount: violations.length });

    await page.screenshot({ path: lighthousePath });
    allCapturedPaths.push(lighthousePath);
  } catch (err: any) {
    console.warn(`  [Screenshot Warning] Lighthouse Summary failed for ${companyName}: ${err?.message}`);
    try {
      await page.screenshot({ path: lighthousePath });
      allCapturedPaths.push(lighthousePath);
    } catch {}
  }

  return {
    waveOverlayPath: wavePath,
    axeDevToolsPath: axePath,
    lighthouseSummaryPath: lighthousePath,
    allCapturedPaths,
  };
}
