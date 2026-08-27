const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'screenshots');
const URLS_FILE = path.join(__dirname, 'urls.txt');
const EXTENSION_PATH = path.join(__dirname, 'wave-extension');
const USER_DATA_DIR = path.join(__dirname, 'chrome-profile');
const WAVE_SHORTCUT = 'Alt+Shift+W'; // must match chrome://extensions/shortcuts exactly
const WAIT_AFTER_WAVE_MS = 5000;

function makeFilename(url) {
  const u = new URL(url);
  let domain = u.hostname.replace(/^www\./, '').split('.')[0];
  domain = domain.split(/[-_]/).map(w => w[0].toUpperCase() + w.slice(1)).join('_');
  let pageName = 'Homepage';
  if (u.pathname && u.pathname !== '/') {
    pageName = u.pathname.replace(/^\/|\/$/g, '').split('/').pop()
      .split(/[-_]/).map(w => w[0].toUpperCase() + w.slice(1)).join('_');
  }
  return `${domain}_${pageName}_WAVE_Overlay`;
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  if (!fs.existsSync(EXTENSION_PATH)) {
    console.error(`ERROR: wave-extension folder not found at ${EXTENSION_PATH}`);
    console.error('Copy the WAVE extension files there first (see setup steps).');
    return;
  }

  const urls = fs.readFileSync(URLS_FILE, 'utf-8').split('\n').map(l => l.trim()).filter(Boolean);

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    channel: 'chrome',
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
    viewport: { width: 1440, height: 900 },
  });

  let successCount = 0;
  let failCount = 0;

  for (const url of urls) {
    console.log(`\nProcessing: ${url}`);
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);

      await page.keyboard.press(WAVE_SHORTCUT);
      await page.waitForTimeout(WAIT_AFTER_WAVE_MS);

      const filename = makeFilename(url);
      const outPath = path.join(OUTPUT_DIR, `${filename}.png`);
      await page.screenshot({ path: outPath, fullPage: false });

      console.log(`  Saved: ${filename}.png`);
      successCount++;
    } catch (err) {
      console.error(`  Failed on ${url}: ${err.message}`);
      failCount++;
    } finally {
      await page.close();
    }
  }

  await context.close();
  console.log(`\nDone. Success: ${successCount}, Failed: ${failCount}`);
  console.log(`Screenshots in: ${OUTPUT_DIR}`);
  console.log(`\nIf the WAVE overlay did NOT appear in the screenshots, the keyboard shortcut`);
  console.log(`approach isn't working for this extension — fall back to the manual-click version.`);
}

run();