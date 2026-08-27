const { chromium } = require('playwright');
const readline = require('readline/promises');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const EXTENSION_PATH = path.join(__dirname, 'wave-extension');
const USER_DATA_DIR = path.join(__dirname, 'tmp-chrome-profile');
const URLS_FILE = path.join(__dirname, 'urls.txt');
const OUTPUTS_DIR = path.join(__dirname, '..', 'outputs');
const GITHUB_OUTPUTS_URL = 'https://github.com/VEER-TANMAY-SACHIN/projects/blob/main/orchavate_gtm_workflow/outputs';
const RUN_VERSION = 0;

async function askSourceFilePath() {
  const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await prompt.question(`Source filepath [${URLS_FILE}]: `);
    const enteredPath = answer.trim().replace(/^(["'])(.*)\1$/, '$2');
    return enteredPath ? path.resolve(enteredPath) : URLS_FILE;
  } finally {
    prompt.close();
  }
}

async function askRunName() {
  const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await prompt.question('Run name [wave-run]: ');
    return cleanName(answer) || 'wave-run';
  } finally {
    prompt.close();
  }
}

function cleanName(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function nameMatchesUrl(name, parsedUrl) {
  const nameWords = cleanName(name).toLowerCase().split('_').filter(Boolean);
  const domainWords = parsedUrl.hostname.replace(/^www\./, '').split(/[.-]/).filter(Boolean);
  return nameWords.some(word => word.length > 2 && domainWords.some(domainWord => domainWord.includes(word) || word.includes(domainWord)));
}

function loadSources(sourceFilePath) {
  if (!fs.existsSync(sourceFilePath)) {
    throw new Error(`URL list not found at ${sourceFilePath}`);
  }

  if (/\.xlsx?$/i.test(sourceFilePath)) {
    const workbook = XLSX.readFile(sourceFilePath);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(firstSheet, { defval: '' })
      .map(row => ({
        name: String(row['Company Name'] || '').trim(),
        url: String(row.Website || '').trim(),
      }))
      .filter(source => source.url);
  }

  return fs.readFileSync(sourceFilePath, 'utf8')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

function normalizeSources(sourceRows) {
  return sourceRows.map(source => {
    const url = typeof source === 'string' ? source : source.url;
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      return {
        name: cleanName(typeof source === 'string' ? source : source.name) || 'Unknown Company',
        url,
        error: `Invalid URL: ${url}`,
      };
    }
    const sourceName = typeof source === 'string' ? parsedUrl.hostname.replace(/^www\./, '') : source.name;
    return {
      name: cleanName(nameMatchesUrl(sourceName, parsedUrl) ? sourceName : parsedUrl.hostname.replace(/^www\./, '')) || parsedUrl.hostname,
      url,
      error: '',
    };
  });
}

function createRunFolder(runName, sourceFilePath) {
  const sourceName = cleanName(path.basename(sourceFilePath, path.extname(sourceFilePath)));
  const now = new Date();
  const pad = value => String(value).padStart(2, '0');
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const runFolder = path.join(OUTPUTS_DIR, `v${RUN_VERSION}_${cleanName(runName)}_${sourceName}_${timestamp}`);
  fs.mkdirSync(runFolder, { recursive: true });
  return runFolder;
}

function writeTracker(runFolder, rows) {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(rows, {
    header: ['Company Name', 'Website', 'AIM Score', 'Screenshot Path', 'Local Screenshot Path', 'Status', 'Error'],
  });
  XLSX.utils.book_append_sheet(workbook, sheet, 'WAVE Results');
  XLSX.writeFile(workbook, path.join(runFolder, 'wave_tracker.xlsx'));
}

function clearStaleProfileLocks() {
  const lockFiles = ['SingletonLock', 'SingletonCookie', 'SingletonSocket'];
  for (const f of lockFiles) {
    const p = path.join(USER_DATA_DIR, f);
    if (fs.existsSync(p)) {
      try { fs.unlinkSync(p); } catch (_) { /* ignore */ }
    }
  }
}

async function launchContext() {
  clearStaleProfileLocks();
  return chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    viewport: null,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--start-maximized',
      '--window-size=1920,1080'
    ],
  });
}

function isContextAlive(context) {
  try {
    // browser() is null for persistent context in some versions; use pages() as liveness check
    context.pages();
    return true;
  } catch (_) {
    return false;
  }
}

async function readAimScore(page) {
  for (const frame of page.frames()) {
    try {
      const value = await frame.locator('#aim-score-value').textContent({ timeout: 1000 });
      const score = Number.parseFloat(value);
      if (Number.isFinite(score)) return score;
    } catch (_) {
      // The WAVE sidebar may not be loaded in every frame yet.
    }
  }
  return null;
}

async function captureWaveScreenshot(context, targetUrl, outputFileName) {
  const page = await context.newPage();
  try {
    console.log(`🌐 Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);

    let [sw] = context.serviceWorkers();
    if (!sw) sw = await context.waitForEvent('serviceworker', { timeout: 10000 }).catch(() => null);

    if (sw) {
      console.log('⚡ Triggering WAVE overlay...');
      await sw.evaluate(async (url) => {
        const tabs = await chrome.tabs.query({});
        const target = new URL(url);
        const tab = tabs.find(candidate => {
          try {
            return new URL(candidate.url).hostname === target.hostname;
          } catch (_) {
            return false;
          }
        });
        if (tab?.id && typeof serviceworker !== 'undefined' && serviceworker.func) {
          await serviceworker.func.runWave(tab.id, url);
        }
      }, targetUrl);
    } else {
      await page.keyboard.press('Control+Shift+U');
    }

    await page.waitForSelector('#wave-sidebar, iframe[src*="sidebar.html"], #wavescript', { timeout: 15000 }).catch(() => { });
    await page.waitForTimeout(5000);

    const rawPath = path.join(__dirname, `temp_raw_${Date.now()}.png`);
    const aimScore = await readAimScore(page);
    await page.screenshot({ path: rawPath, fullPage: false });
    await addChromeHeaderFrame(rawPath, targetUrl, outputFileName);
    return { aimScore, screenshotPath: outputFileName };
  } finally {
    await page.close().catch(() => { });
  }
}

async function addChromeHeaderFrame(rawImagePath, targetUrlStr, outputPath) {
  const parsedUrl = new URL(targetUrlStr);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1160 } });

  const imageBase64 = fs.readFileSync(rawImagePath).toString('base64');
  if (fs.existsSync(rawImagePath)) fs.unlinkSync(rawImagePath);

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
      body { background: #1e1e1e; width: 1920px; height: 1160px; display: flex; flex-direction: column; }
      .chrome-titlebar { height: 42px; background: #202124; display: flex; align-items: flex-end; padding: 0 10px; }
      .chrome-tab { background: #323639; color: #f1f3f4; height: 34px; border-radius: 8px 8px 0 0; padding: 0 16px; display: flex; align-items: center; gap: 8px; font-size: 12px; width: 240px; }
      .chrome-tab-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; font-weight: 500; }
      .chrome-window-controls { margin-left: auto; display: flex; gap: 16px; color: #9aa0a6; font-size: 14px; padding-right: 8px; }
      .chrome-toolbar { height: 44px; background: #292a2d; display: flex; align-items: center; padding: 0 12px; gap: 10px; border-bottom: 1px solid #3c4043; }
      .nav-btn { color: #9aa0a6; font-size: 16px; }
      .chrome-omnibox { flex: 1; height: 28px; background: #202124; border-radius: 14px; display: flex; align-items: center; padding: 0 14px; color: #e8eaed; font-size: 13px; gap: 8px; border: 1px solid #3c4043; }
      .url-domain { color: #ffffff; font-weight: 600; }
      .page-content { flex: 1; width: 100%; background: #ffffff; }
      .page-content img { width: 100%; height: 100%; object-fit: contain; }
    </style>
  </head>
  <body>
    <div class="chrome-titlebar">
      <div class="chrome-tab">
        <div style="width:16px;height:16px;border-radius:50%;background:#4a5056;color:#fff;text-align:center;font-size:10px;line-height:16px;">W</div>
        <div class="chrome-tab-title">${parsedUrl.hostname}</div>
      </div>
      <div class="chrome-window-controls"><span>&#8212;</span><span>&#9633;</span><span>&#10005;</span></div>
    </div>
    <div class="chrome-toolbar">
      <span class="nav-btn">&#8592;</span><span class="nav-btn">&#8594;</span><span class="nav-btn">&#8635;</span>
      <div class="chrome-omnibox">
        <span style="color:#9aa0a6;">&#128274;</span>
        <span>${parsedUrl.protocol}//</span><span class="url-domain">${parsedUrl.hostname}</span><span>${parsedUrl.pathname}</span>
      </div>
    </div>
    <div class="page-content"><img src="data:image/png;base64,${imageBase64}" /></div>
  </body>
  </html>
  `;

  await page.setContent(html);
  await page.screenshot({ path: outputPath });
  await browser.close();

  console.log(`✅ Saved screenshot to: ${outputPath}`);
}

// ====================== BATCH RUNNER WITH CRASH RECOVERY ======================
(async () => {
  const sourceFilePath = await askSourceFilePath();
  const runName = await askRunName();
  const sources = normalizeSources(loadSources(sourceFilePath));
  if (sources.length === 0) {
    console.log(`No URLs found in ${sourceFilePath}`);
    return;
  }

  const runFolder = createRunFolder(runName, sourceFilePath);
  const trackerRows = [];
  const trackerPath = path.join(runFolder, 'wave_tracker.xlsx');
  writeTracker(runFolder, trackerRows);
  console.log(`📄 Tracker started: ${trackerPath}`);
  console.log('🚀 Launching browser...');
  let context = await launchContext();

  try {
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      const { name, url } = source;
      const companyFolder = path.join(runFolder, name);
      const screenshotFolder = path.join(companyFolder, 'screenshots');
      const screenshotFileName = `${name}_Homepage_WAVE_Overlay.png`;
      const outputFile = path.join(screenshotFolder, screenshotFileName);
      const githubPath = `${GITHUB_OUTPUTS_URL}/${path.basename(runFolder)}/${name}/screenshots/${screenshotFileName}`;
      fs.mkdirSync(screenshotFolder, { recursive: true });

      console.log(`\n[${i + 1}/${sources.length}] Processing: ${url}`);

      if (source.error) {
        console.error(`❌ Failed for ${url}: ${source.error}`);
        trackerRows.push({ 'Company Name': name, Website: url, 'AIM Score': '', 'Screenshot Path': '', 'Local Screenshot Path': '', Status: 'Failed', Error: source.error });
        writeTracker(runFolder, trackerRows);
        continue;
      }

      if (fs.existsSync(outputFile)) {
        console.log(`⏭️  Already exists, skipping: ${outputFile}`);
        trackerRows.push({ 'Company Name': name, Website: url, 'AIM Score': '', 'Screenshot Path': githubPath, 'Local Screenshot Path': outputFile, Status: 'Skipped', Error: '' });
        writeTracker(runFolder, trackerRows);
        continue;
      }

      // check context alive before each attempt; relaunch if dead
      if (!isContextAlive(context)) {
        console.log('♻️  Context dead, relaunching...');
        await context.close().catch(() => { });
        context = await launchContext();
      }

      try {
        const { aimScore } = await captureWaveScreenshot(context, url, outputFile);
        console.log(`📊 AIM Score: ${aimScore ?? 'unavailable'}/10`);
        trackerRows.push({ 'Company Name': name, Website: url, 'AIM Score': aimScore ?? '', 'Screenshot Path': githubPath, 'Local Screenshot Path': outputFile, Status: 'Completed', Error: '' });
        writeTracker(runFolder, trackerRows);
      } catch (err) {
        console.error(`❌ Failed for ${url}:`, err.message);
        trackerRows.push({ 'Company Name': name, Website: url, 'AIM Score': '', 'Screenshot Path': '', 'Local Screenshot Path': '', Status: 'Failed', Error: err.message });
        writeTracker(runFolder, trackerRows);

        // crash-specific recovery: relaunch immediately, retry once
        if (!isContextAlive(context)) {
          console.log('♻️  Browser crashed, relaunching and retrying...');
          await context.close().catch(() => { });
          context = await launchContext();
          try {
            const { aimScore } = await captureWaveScreenshot(context, url, outputFile);
            console.log(`📊 AIM Score: ${aimScore ?? 'unavailable'}/10`);
            trackerRows[trackerRows.length - 1] = { 'Company Name': name, Website: url, 'AIM Score': aimScore ?? '', 'Screenshot Path': githubPath, 'Local Screenshot Path': outputFile, Status: 'Completed', Error: '' };
            writeTracker(runFolder, trackerRows);
          } catch (err2) {
            console.error(`❌ Retry also failed for ${url}:`, err2.message);
          }
        }
      }
    }
  } finally {
    await context.close().catch(() => { });
    writeTracker(runFolder, trackerRows);
    console.log(`📄 Tracker saved to: ${trackerPath}`);
  }

  console.log('\n🎉 All done!');
})();