const fs = require('fs');
const path = require('path');

const API_KEY = 'nU1s3j7C7299';
const URLS_FILE = path.join(__dirname, 'urls.txt');
const OUTPUT_DIR = path.join(__dirname, 'reports');

function makeFilename(url) {
  const u = new URL(url);
  let domain = u.hostname.replace(/^www\./, '').split('.')[0];
  domain = domain.split(/[-_]/).map(w => w[0].toUpperCase() + w.slice(1)).join('_');
  let pageName = 'Homepage';
  if (u.pathname && u.pathname !== '/') {
    pageName = u.pathname.replace(/^\/|\/$/g, '').split('/').pop()
      .split(/[-_]/).map(w => w[0].toUpperCase() + w.slice(1)).join('_');
  }
  return `${domain}_${pageName}_WAVE_Report`;
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
  const urls = fs.readFileSync(URLS_FILE, 'utf-8').split('\n').map(l => l.trim()).filter(Boolean);

  for (const url of urls) {
    console.log(`Scanning: ${url}`);
    try {
      const apiUrl = `https://wave.webaim.org/api/request?key=${API_KEY}&url=${encodeURIComponent(url)}&reporttype=2`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.status && data.status.success === false) {
        console.error(`  API error: ${data.status.error || 'unknown'}`);
        continue;
      }

      const filename = makeFilename(url);
      fs.writeFileSync(path.join(OUTPUT_DIR, `${filename}.json`), JSON.stringify(data, null, 2));

      const cats = data.categories || {};
      console.log(`  Errors: ${cats.error?.count ?? 'N/A'}, Contrast: ${cats.contrast?.count ?? 'N/A'}, Alerts: ${cats.alert?.count ?? 'N/A'}`);
      console.log(`  Saved: ${filename}.json`);
    } catch (err) {
      console.error(`  Failed on ${url}: ${err.message}`);
    }
  }

  console.log('\nDone. Reports in ./reports');
}

run();