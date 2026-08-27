const fs = require('fs');
const path = require('path');

// === EDIT THIS EVERY TIME YOUR KEY RUNS OUT ===
const API_KEY = 'SkRY5nB37301';
// ================================================

const COMPANIES_FILE = path.join(__dirname, 'urls.txt');
const OUTPUT_CSV = path.join(__dirname, 'wave_results.csv');
const FAILED_LOG = path.join(__dirname, 'failed_urls.txt');
const REPORT_TYPE = 1;

function loadCompanies() {
  return fs.readFileSync(COMPANIES_FILE, 'utf-8')
    .split('\n').map(l => l.trim()).filter(Boolean)
    .map(line => {
      const parts = line.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        return { name: parts[0], url: parts[1] };
      } else {
        const u = new URL(parts[0]);
        return { name: u.hostname.replace(/^www\./, ''), url: parts[0] };
      }
    });
}

function loadExistingCompanies() {
  if (!fs.existsSync(OUTPUT_CSV)) return new Set();
  const lines = fs.readFileSync(OUTPUT_CSV, 'utf-8').split('\n').map(l => l.trim()).filter(Boolean);
  const done = new Set();
  for (let i = 1; i < lines.length; i++) {
    const firstCol = lines[i].split(',')[0].replace(/^"|"$/g, '');
    done.add(firstCol.toLowerCase());
  }
  return done;
}

function loadFailedUrls() {
  if (!fs.existsSync(FAILED_LOG)) return new Set();
  return new Set(
    fs.readFileSync(FAILED_LOG, 'utf-8').split('\n').map(l => l.trim()).filter(Boolean)
      .map(l => l.split(' | ')[0].toLowerCase())
  );
}

function ensureCsvHeader() {
  if (!fs.existsSync(OUTPUT_CSV)) {
    fs.writeFileSync(OUTPUT_CSV, 'Company Name,Website,AIM Score,Errors,Contrast Errors,Alerts\n');
  }
}

function appendCsvRow(row) {
  const escape = v => `"${String(v).replace(/"/g, '""')}"`;
  const line = [row.name, row.url, row.aim, row.errors, row.contrast, row.alerts]
    .map(escape).join(',') + '\n';
  fs.appendFileSync(OUTPUT_CSV, line);
}

function logFailedUrl(name, url, reason) {
  fs.appendFileSync(FAILED_LOG, `${name} | ${url} | ${reason}\n`);
}

async function scanUrl(url) {
  const apiUrl = `https://wave.webaim.org/api/request?key=${API_KEY}&url=${encodeURIComponent(url)}&reporttype=${REPORT_TYPE}`;
  const res = await fetch(apiUrl);
  return res.json();
}

function isCreditOrKeyError(errMsg) {
  const msg = (errMsg || '').toLowerCase();
  return msg.includes('credit') || msg.includes('key') || msg.includes('limit') || msg.includes('quota');
}

async function run() {
  const companies = loadCompanies();
  const alreadyDone = loadExistingCompanies();
  const alreadyFailed = loadFailedUrls();
  ensureCsvHeader();

  for (const company of companies) {
    const key = company.name.toLowerCase();

    if (alreadyDone.has(key)) {
      console.log(`Skipping (already done): ${company.name}`);
      continue;
    }
    if (alreadyFailed.has(key)) {
      console.log(`Skipping (previously failed): ${company.name}`);
      continue;
    }

    console.log(`Scanning: ${company.name} (${company.url})`);

    let data;
    try {
      data = await scanUrl(company.url);
    } catch (err) {
      console.error(`  Network error: ${err.message} — logging as failed, moving on.`);
      logFailedUrl(company.name, company.url, err.message);
      continue;
    }

    if (data.status && data.status.success === false) {
      const errMsg = data.status.error || 'unknown';

      if (isCreditOrKeyError(errMsg)) {
        console.error(`  Credit/key error: ${errMsg}`);
        console.error(`  Update API_KEY in the script and re-run. Stopping batch.`);
        break;
      } else {
        console.error(`  Site error: ${errMsg} — logging as failed, moving on.`);
        logFailedUrl(company.name, company.url, errMsg);
        continue;
      }
    }

    const stats = data.statistics || {};
    const cats = data.categories || {};

    appendCsvRow({
      name: company.name,
      url: company.url,
      aim: stats.AIMscore ?? 'N/A',
      errors: cats.error?.count ?? 0,
      contrast: cats.contrast?.count ?? 0,
      alerts: cats.alert?.count ?? 0,
    });

    console.log(`  Saved: AIM ${stats.AIMscore ?? 'N/A'} | Errors ${cats.error?.count ?? 0} | Contrast ${cats.contrast?.count ?? 0} | Alerts ${cats.alert?.count ?? 0} | Credits left: ${stats.creditsremaining ?? '?'}`);
  }

  console.log('\nDone (or stopped). Check wave_results.csv and failed_urls.txt');
}

run();