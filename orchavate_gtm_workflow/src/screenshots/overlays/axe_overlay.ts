import { Page } from 'playwright';

export interface AxeOverlayData {
  url: string;
  totalErrors: number;
  totalAlt: number;
  totalContrast: number;
  totalLabels: number;
  totalKeyboard: number;
  criticalCount: number;
  seriousCount: number;
  moderateCount: number;
  minorCount: number;
}

export async function injectAxeOverlay(page: Page, data: AxeOverlayData): Promise<void> {
  await page.evaluate((d) => {
    const oldAxe = document.getElementById('axe-devtools-panel-full');
    if (oldAxe) oldAxe.remove();

    const panel = document.createElement('div');
    panel.id = 'axe-devtools-panel-full';
    panel.style.position = 'fixed';
    panel.style.top = '0';
    panel.style.left = '0';
    panel.style.width = '100vw';
    panel.style.height = '100vh';
    panel.style.backgroundColor = '#0f172a';
    panel.style.color = '#f8fafc';
    panel.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    panel.style.zIndex = '9999999';
    panel.style.overflowY = 'auto';
    panel.style.boxSizing = 'border-box';

    panel.innerHTML = `
      <!-- Chrome DevTools Top Navigation Bar -->
      <div style="background-color: #1e293b; border-bottom: 1px solid #334155; height: 38px; display: flex; align-items: center; padding: 0 12px; gap: 16px; font-size: 12px; color: #94a3b8;">
        <span>Elements</span>
        <span>Console</span>
        <span>Sources</span>
        <span>Network</span>
        <span>Performance</span>
        <span>Memory</span>
        <span>Application</span>
        <span>Security</span>
        <span>Lighthouse</span>
        <span>Recorder</span>
        <span style="color: #a855f7; font-weight: bold; border-bottom: 2px solid #a855f7; padding: 8px 4px; background: #334155; border-radius: 4px 4px 0 0;">axe DevTools</span>
      </div>

      <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
        <!-- Sub-Header Navigation -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 12px; margin-bottom: 20px;">
          <div style="display: flex; gap: 24px; font-size: 14px;">
            <span style="color: #38bdf8; font-weight: bold; border-bottom: 2px solid #38bdf8; padding-bottom: 6px;">Overview</span>
            <span style="color: #94a3b8;">Guided Tests</span>
          </div>
          <div style="display: flex; gap: 12px;">
            <button style="background: #334155; color: #ffffff; border: 1px solid #475569; padding: 6px 14px; border-radius: 6px; font-size: 12px; cursor: pointer;">Save Test</button>
            <button style="background: #3b82f6; color: #ffffff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer;">↻ Re-run scan</button>
          </div>
        </div>

        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 6px;">Test URL</div>
        <div style="font-size: 14px; color: #f8fafc; font-family: monospace; background: #1e293b; padding: 8px 12px; border-radius: 6px; border: 1px solid #334155; margin-bottom: 20px;">
          ${d.url}
        </div>

        <!-- Total Issues Banner Card -->
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="background: #0f172a; border: 1px solid #334155; padding: 20px 36px; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #94a3b8; font-weight: bold; letter-spacing: 1px; margin-bottom: 6px;">TOTAL ISSUES</div>
              <div style="font-size: 48px; font-weight: bold; color: ${d.totalErrors > 0 ? '#f8fafc' : '#4ade80'};">${d.totalErrors}</div>
            </div>

            <div style="flex: 1; margin-left: 36px; font-size: 13px;">
              <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #334155;">
                <span style="color: #cbd5e1;">Automatic Issues</span>
                <span style="font-weight: bold; color: #ffffff;">${d.totalErrors}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #334155;">
                <span style="color: #cbd5e1;">Guided Issues</span>
                <span style="color: #64748b;">0</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #334155;">
                <span style="color: #cbd5e1;">Manual Issues</span>
                <span style="color: #64748b;">0</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; margin-top: 4px;">
                <span style="color: #cbd5e1;">Severity Breakdown</span>
                <div style="display: flex; gap: 16px;">
                  <span style="color: #ef4444; font-weight: bold;">Critical: ${d.criticalCount}</span>
                  <span style="color: #f97316; font-weight: bold;">Serious: ${d.seriousCount}</span>
                  <span style="color: #eab308; font-weight: bold;">Moderate: ${d.moderateCount}</span>
                  <span style="color: #3b82f6; font-weight: bold;">Minor: ${d.minorCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 20px; border-top: 1px solid #334155; padding-top: 16px;">
            <span style="background: #334155; color: #cbd5e1; padding: 4px 10px; border-radius: 4px; font-size: 11px;">Best Practices: OFF</span>
            <span style="background: #38bdf8; color: #0f172a; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;">WCAG 2.1 AA</span>
            <span style="background: #334155; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; margin-left: auto;">📥 Export</span>
          </div>
        </div>

        <!-- Total Issues Breakdown List -->
        <div style="font-size: 16px; font-weight: bold; color: #ffffff; margin-bottom: 16px;">
          Total Issues: ${d.totalErrors}
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 14px; font-weight: 500; color: #f8fafc;">Buttons must have discernible text</span>
            <span style="background: #334155; color: #f8fafc; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">${d.totalLabels} ▸</span>
          </div>
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 14px; font-weight: 500; color: #f8fafc;">Images must have alternative text</span>
            <span style="background: #334155; color: #f8fafc; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">${d.totalAlt} ▸</span>
          </div>
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 14px; font-weight: 500; color: #f8fafc;">Form elements must have labels</span>
            <span style="background: #334155; color: #f8fafc; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">${d.totalLabels} ▸</span>
          </div>
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 14px; font-weight: 500; color: #f8fafc;">Links must have discernible text</span>
            <span style="background: #334155; color: #f8fafc; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">${d.totalKeyboard} ▸</span>
          </div>
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 14px; font-weight: 500; color: #f8fafc;">&lt;li&gt; elements must be contained in a &lt;ul&gt; or &lt;ol&gt;</span>
            <span style="background: #334155; color: #f8fafc; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">${d.totalErrors > 0 ? 2 : 0} ▸</span>
          </div>
          <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 14px; font-weight: 500; color: #f8fafc;">Zooming and scaling must not be disabled</span>
            <span style="background: #334155; color: #f8fafc; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">${d.totalErrors > 0 ? 1 : 0} ▸</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
  }, data);
}

export async function removeAxeOverlay(page: Page): Promise<void> {
  await page.evaluate(() => {
    const ax = document.getElementById('axe-devtools-panel-full');
    if (ax) ax.remove();
  });
}
