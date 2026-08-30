/**
 * PUNE MECHANICAL DESIGN ENGINEER JOB BOT — Node.js
 * Scrapes jobs from Remotive, Arbeitnow, Jobicy, HackerNews, Indeed RSS, LinkedIn
 * Targets: Mechanical Design Engineer, CAD Engineer, Engineering Automation,
 *          Design Automation, Product Design, GD&T / Drafting roles
 * Locations: Pune | Remote / WFH
 * Auto-applies with resume via Gmail SMTP (nodemailer)
 * Run:  node mechanical_design_job_bot.js
 * Test: node mechanical_design_job_bot.js --dry-run
 */

const nodemailer = require("nodemailer");
const axios      = require("axios");
const fs         = require("fs");
const path       = require("path");
const xml2js     = require("xml2js");
const puppeteer  = require("puppeteer");
const { parseStringPromise } = xml2js;

// =====================================================
//  CONFIG — UPDATE THESE
// =====================================================
const CONFIG = {
  email      : "darshan278782@gmail.com",
  appPassword: "zhnfksdqicfktzvz",
  name       : "Darshan Basale",
  phone      : "9822848813",
  skills     : "Siemens NX, AutoCAD, SolidWorks, Parametric Modeling, Assembly Build-up, Design Validation, Engineering Drawing Release, Siemens RuleStream RS 2412 (Rule Authoring, Configuration Modelling, CTO/ETO Automation), KBE Engineering Logic, CAD-RuleStream Integration, VB.NET (Customization, Validation Frameworks), C# Basics, GD&T, BOM Preparation, Engineering Change Management (ECR), Drawing Release, CAD Drafting Standards, Drawing Checking & Validation",
  linkedin   : "https://www.linkedin.com/in/darshan-basale-7a0b6519a",
  yearsExp   : "4",
  resumePath : path.join(__dirname, "Resume", "Darshan_Basale.pdf"),

  // ── LinkedIn login (for Puppeteer scraping) ──
  linkedinEmail   : "darshan278782@gmail.com",
  linkedinPassword: "Da@27878212",
};

const APPLIED_FILE = "applied_jobs.json";
const LOG_FILE     = `job_bot_${today()}.log`;
const DRY_RUN      = process.argv.includes("--dry-run");

// =====================================================
//  LOGGER
// =====================================================
function today() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}

function log(level, msg) {
  const line = `${new Date().toISOString()}  ${level.padEnd(5)}  ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + "\n");
}
const info  = (m) => log("INFO",  m);
const warn  = (m) => log("WARN",  m);
const error = (m) => log("ERROR", m);

function resolveResumePath(resumePath) {
  if (fs.existsSync(resumePath)) return resumePath;
  const resumeDir = path.join(__dirname, "Resume");
  if (fs.existsSync(resumeDir)) {
    const pdfFiles = fs.readdirSync(resumeDir)
      .filter(f => f.toLowerCase().endsWith(".pdf"));
    if (pdfFiles.length > 0) {
      const fallback = path.join(resumeDir, pdfFiles[0]);
      info(`Resume not found at configured path; using backup resume: ${fallback}`);
      return fallback;
    }
  }
  warn(`Configured resume path missing: ${resumePath}`);
  return resumePath;
}

function getChromeExecutablePath() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    path.join(process.env.HOME || "", ".cache/puppeteer/chrome/linux-152.0.7971.0/chrome-linux64/chrome"),
    path.join(process.env.HOME || "", ".cache/puppeteer/chrome/linux-121.0.6167.85/chrome-linux64/chrome"),
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

CONFIG.resumePath = resolveResumePath(CONFIG.resumePath);

// =====================================================
//  APPLIED JOBS CACHE — 24 hour memory
// =====================================================
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function loadCache() {
  try {
    const raw = JSON.parse(fs.readFileSync(APPLIED_FILE, "utf8"));
    const now = Date.now();

    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "string") {
      info("Cache: migrating old format → all old entries cleared (fresh start)");
      return {};
    }

    const active  = {};
    let   expired = 0;
    for (const [key, appliedAt] of Object.entries(raw)) {
      if (now - appliedAt < CACHE_TTL_MS) {
        active[key] = appliedAt;
      } else {
        expired++;
      }
    }
    if (expired > 0) info(`Cache: removed ${expired} expired entries (>24hrs old)`);
    return active;

  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(APPLIED_FILE, JSON.stringify(cache, null, 2));
}

function markApplied(job) {
  const cache = loadCache();
  const key   = `${job.link}::${job.email || ""}`;
  cache[key]  = Date.now();
  saveCache(cache);
}

function wasAppliedRecently(job) {
  const cache     = loadCache();
  const key       = `${job.link}::${job.email || ""}`;
  const appliedAt = cache[key];
  if (!appliedAt) return false;
  const ageHrs = ((Date.now() - appliedAt) / (1000 * 60 * 60)).toFixed(1);
  if (Date.now() - appliedAt < CACHE_TTL_MS) {
    info(`Cache: skipping ${job.company} — applied ${ageHrs}hrs ago`);
    return true;
  }
  return false;
}

function wasCompanyAppliedRecently(company) {
  if (!company || company === "See LinkedIn" || company === "Recruiter (LinkedIn Post)") return false;
  const cache      = loadCache();
  const now        = Date.now();
  const companyKey = company.toLowerCase().trim();
  for (const [key, appliedAt] of Object.entries(cache)) {
    if (key.toLowerCase().includes(companyKey) && (now - appliedAt < CACHE_TTL_MS)) {
      const ageHrs = ((now - appliedAt) / (1000 * 60 * 60)).toFixed(1);
      info(`Cache: skipping ${company} — already applied ${ageHrs}hrs ago`);
      return true;
    }
  }
  return false;
}

function printCacheSummary() {
  const cache = loadCache();
  const keys  = Object.keys(cache);
  if (keys.length === 0) {
    info("Cache: empty — no applications recorded yet");
    return new Set();
  }
  info(`Cache: ${keys.length} applications in last 24hrs`);
  keys.forEach(k => {
    const [link, email] = k.split("::");
    const ageHrs = ((Date.now() - cache[k]) / (1000 * 60 * 60)).toFixed(1);
    info(`  → ${email || "no-email"} | ${link.slice(0, 60)} | ${ageHrs}hrs ago`);
  });
  return new Set(keys);
}

// =====================================================
//  FILTERS — Mechanical Design Engineer / CAD & Engineering Automation
// =====================================================

// ── Target cities + areas ──
const TARGET_AREAS = [
  // Pune & suburbs
  "pune", "pimpri", "chinchwad", "hinjewadi", "wakad", "baner",
  "kharadi", "viman nagar", "magarpatta", "hadapsar", "shivajinagar",
  "koregaon park", "kalyani nagar", "aundh", "bavdhan", "chakan", "talegaon",
  "ranjangaon",
];
const REMOTE_KW = [
  "remote", "work from home", "wfh", "fully remote",
  "india (remote)", "india remote", "worldwide", "anywhere",
];
// Cities we do NOT want (anything not Pune)
const OTHER_CITIES = [
  "bangalore", "bengaluru", "hyderabad", "chennai",
  "delhi", "noida", "gurgaon", "gurugram", "kolkata", "ahmedabad",
  "jaipur", "surat", "lucknow", "indore", "bhopal", "nagpur", "nashik",
  "coimbatore", "kochi", "chandigarh", "vizag", "visakhapatnam",
  "mumbai", "andheri", "bandra", "powai", "malad", "borivali",
  "goregaon", "kandivali", "lower parel", "worli", "bkc",
  "kurla", "ghatkopar", "vikhroli", "thane",
  "navi mumbai", "new mumbai", "vashi", "nerul", "belapur",
  "airoli", "ghansoli", "kharghar", "panvel", "sanpada",
  "seawoods", "cbd belapur",
];

function isPuneJob(location = "", desc = "") {
  const t = (location + " " + desc).toLowerCase();

  if (!location.trim() && !desc.trim()) return true;

  const hasTarget    = TARGET_AREAS.some(k => t.includes(k));
  const hasRemote    = REMOTE_KW.some(k => t.includes(k));
  const hasHybrid    = t.includes("hybrid") && hasTarget;
  const hasOtherCity = OTHER_CITIES.some(c => t.includes(c));

  if (!location.trim()) {
    if (hasOtherCity && !hasTarget && !hasRemote) return false;
    return true;
  }

  if (!hasTarget && !hasRemote && !hasHybrid) return false;
  if (hasOtherCity && !hasTarget && !hasRemote) return false;

  return true;
}

// ── Mechanical Design / CAD & Engineering Automation specific keywords ──
// At least one MUST appear in title or description
const MUST_HAVE = [
  // Core role titles
  "mechanical design engineer", "mechanical designer", "design engineer",
  "cad engineer", "cad designer", "product design engineer",
  "machine design engineer", "engineering automation", "design automation",
  "cad automation", "knowledge based engineering", "kbe engineer",
  "configurator engineer", "rulestream", "mechanical engineer",
  "product development engineer", "detailer", "drafter", "draughtsman",
  "cad drafter", "solidworks designer", "sheet metal designer",
  "tooling design engineer", "fixture design engineer",
  // CAD tools (used as role signal too)
  "solidworks", "autocad", "catia", "creo", "pro-e", "pro/engineer",
  "nx cad", "unigraphics", "siemens nx", "inventor",
];

// Signals that confirm it's a real Mechanical Design / CAD role
const DATA_SIGNALS = [
  "gd&t", "solidworks", "autocad", "catia", "creo", "sheet metal",
  "bom", "tolerance stack", "dfm", "dfa", "2d drafting", "3d modeling",
  "parametric design", "plm", "teamcenter", "assembly design",
  "machine design", "fea", "product lifecycle management",
  "engineering drawings", "rulestream", "vb.net", "knowledge based engineering",
];

// Roles to skip
const EXCLUDE = [
  // Software / IT roles unrelated to mechanical CAD
  "frontend developer", "front-end developer", "front end developer",
  "react developer", "java developer", "python developer", "android developer",
  "ios developer", "flutter developer", "devops engineer", "cloud engineer",
  "software engineer", "software developer", "full stack developer",
  "backend developer", "embedded", "firmware", "data scientist",
  "data engineer", "data analyst", "ml engineer", "ai researcher",
  // Non-mechanical engineering disciplines
  "civil engineer", "electrical engineer", "electronics engineer",
  "instrumentation engineer", "chemical engineer", "structural engineer",
  "site engineer", "civil site engineer", "network engineer",
  // Non-design mechanical functions (adjust if these are also wanted)
  "production engineer", "maintenance engineer", "quality engineer",
  "process engineer", "sales engineer", "service engineer",
  // Other functions
  "salesforce developer", "sap developer",
  "qa engineer", "test engineer", "sdet",
  "scrum master", "product manager", "project manager",
];

function isMechDesignJob(title = "", desc = "") {
  const all = (title + " " + desc).toLowerCase();
  const tl  = title.toLowerCase();

  // Must contain at least one Mechanical Design / CAD keyword
  if (!MUST_HAVE.some(k => all.includes(k))) return false;

  // If matched only by a generic/tool-only keyword — confirm with a data signal in desc
  const onlyByGeneric = !["mechanical design engineer", "mechanical designer",
    "design engineer", "cad engineer", "cad designer", "engineering automation",
    "design automation", "cad automation", "machine design engineer"]
    .some(k => all.includes(k));
  if (onlyByGeneric && !DATA_SIGNALS.some(k => all.includes(k))) return false;

  // Must NOT be an excluded role
  if (EXCLUDE.some(k => tl.includes(k))) return false;

  return true;
}

// Accept 0–5 years experience; skip 6+ years required
function matchesExp(desc = "") {
  if (!desc) return true;
  const d = desc.toLowerCase();

  // Skip if explicitly needs 6+ years
  if (/[6-9]\+?\s*year/.test(d))  return false;
  if (/1[0-9]\+?\s*year/.test(d)) return false;

  // Skip if explicitly senior / lead (often implies 5+ years)
  if (/\b(lead\s+engineer|staff\s+engineer|principal\s+engineer|architect)\b/.test(d)) return false;

  return true;
}

function extractEmails(text) {
  const matches = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || [];

  const skipDomains = [
    "gmail.com", "googlemail.com",
    "yahoo.com", "yahoo.in", "yahoo.co.in", "yahoo.co.uk",
    "hotmail.com", "hotmail.in", "outlook.com", "live.com", "msn.com",
    "icloud.com", "me.com", "mac.com",
    "rediffmail.com", "indiatimes.com",
    "aol.com", "protonmail.com", "proton.me",
    "zoho.com", "yandex.com", "yandex.ru",
    "tutanota.com", "fastmail.com",
    "example.com", "test.com", "domain.com", "email.com",
    "linkedin.com", "sentry.io", "naukri.com", "indeed.com",
  ];

  return matches.filter(e => {
    const lower  = e.toLowerCase();
    const domain = lower.split("@")[1] || "";
    if (skipDomains.some(s => domain === s)) return false;
    return true;
  });
}

// =====================================================
//  AXIOS HELPER
// =====================================================
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Dest": "empty",
  "Connection": "keep-alive",
};

async function get(url, opts = {}) {
  return axios.get(url, {
    headers: { ...HEADERS, ...(opts.headers || {}) },
    timeout: 15000,
    ...opts,
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// =====================================================
//  SOURCE 1 — Remotive
// =====================================================
async function scrapeRemotive() {
  const jobs = [];
  try {
    // Remotive doesn't have a dedicated "mechanical" category — "all-others"
    // and "product" tend to carry mechanical/CAD/design roles when present.
    const categories = ["all-others", "product"];
    for (const cat of categories) {
      const { data } = await get(`https://remotive.com/api/remote-jobs?category=${cat}&limit=100`);
      const all = data.jobs || [];
      let mechFail = 0, locFail = 0, expFail = 0;
      for (const job of all) {
        const title    = job.title || "";
        const desc     = job.description || "";
        const location = job.candidate_required_location || "";
        if (!isMechDesignJob(title, desc)) { mechFail++; continue; }
        if (!isPuneJob(location, desc))    { locFail++;  continue; }
        if (!matchesExp(desc))             { expFail++;  continue; }
        jobs.push({
          title,
          company : job.company_name || "Company",
          location,
          link    : job.url || "",
          email   : null,
          source  : "Remotive",
        });
      }
      info(`Remotive [${cat}]: ${all.length} fetched → ${mechFail} not-MechDesign, ${locFail} wrong-location, ${expFail} wrong-exp, ${jobs.length} kept`);
      await sleep(1000);
    }
  } catch(e) { error(`Remotive: ${e.message}`); }
  info(`Remotive → ${jobs.length} jobs total`);
  return jobs;
}

// =====================================================
//  SOURCE 2 — Arbeitnow
// =====================================================
async function scrapeArbeitnow() {
  const jobs = [];
  const queries = [
    "mechanical+design+engineer+pune",
    "cad+engineer+pune",
    "design+engineer+pune",
    "product+design+engineer+pune",
    "solidworks+designer+pune",
    "machine+design+engineer+pune",
    "engineering+automation+pune",
    "cad+automation+pune",
    "sheet+metal+design+pune",
  ];
  try {
    for (const q of queries) {
      const { data } = await get(`https://www.arbeitnow.com/api/job-board-api?search=${q}`);
      const all = (data.data || []).slice(0, 30);
      let mechFail = 0, locFail = 0;
      for (const job of all) {
        const title    = job.title || "";
        const desc     = job.description || "";
        const location = job.location || "";
        if (!isMechDesignJob(title, desc)) { mechFail++; continue; }
        if (!isPuneJob(location, desc))    { locFail++;  continue; }
        if (!matchesExp(desc))             continue;
        jobs.push({
          title,
          company : job.company_name || "Company",
          location,
          link    : job.url || "",
          email   : null,
          source  : "Arbeitnow",
        });
      }
      if (all.length) info(`Arbeitnow [${q}]: ${all.length} fetched → ${mechFail} not-MechDesign, ${locFail} wrong-location`);
      await sleep(1000);
    }
  } catch(e) { error(`Arbeitnow: ${e.message}`); }
  info(`Arbeitnow → ${jobs.length} jobs total`);
  return jobs;
}

// =====================================================
//  SOURCE 3 — Jobicy
// =====================================================
async function scrapeJobicy() {
  const jobs = [];
  // Jobicy tags — mechanical/CAD-specific tags are limited, so we lean on
  // engineering-adjacent tags and filter hard with isMechDesignJob().
  const tags = ["engineering", "product", "all-others"];
  try {
    for (const tag of tags) {
      const { data } = await get(`https://jobicy.com/api/v2/remote-jobs?count=50&tag=${tag}`);
      const all = data.jobs || [];
      let mechFail = 0, locFail = 0;
      for (const job of all) {
        const title    = job.jobTitle || "";
        const desc     = job.jobDescription || "";
        const location = job.jobGeo || "";
        if (!isMechDesignJob(title, desc)) { mechFail++; continue; }
        if (!isPuneJob(location, desc))    { locFail++;  continue; }
        if (!matchesExp(desc))             continue;
        jobs.push({
          title,
          company : job.companyName || "Company",
          location,
          link    : job.url || "",
          email   : null,
          source  : "Jobicy",
        });
      }
      if (all.length) info(`Jobicy [${tag}]: ${all.length} fetched → ${mechFail} not-MechDesign, ${locFail} wrong-location`);
      await sleep(1000);
    }
  } catch(e) { error(`Jobicy: ${e.message}`); }
  info(`Jobicy → ${jobs.length} jobs total`);
  return jobs;
}

// =====================================================
//  SOURCE 4 — HackerNews Hiring
// =====================================================
async function scrapeHNHiring() {
  const jobs = [];
  try {
    const { data: search } = await get("https://hn.algolia.com/api/v1/search?query=who+is+hiring&tags=story&hitsPerPage=5");
    const thread = (search.hits || []).find(h => h.title?.toLowerCase().includes("who is hiring"));
    if (!thread) return jobs;
    info(`HN thread: ${thread.title}`);

    const { data: comments } = await get(
      `https://hn.algolia.com/api/v1/search?tags=comment,story_${thread.objectID}&hitsPerPage=200`
    );
    info(`HN scanning ${comments.hits?.length || 0} comments...`);

    for (const comment of comments.hits || []) {
      const raw   = comment.comment_text || "";
      const clean = raw.replace(/<[^>]+>/g, " ");
      if (!isMechDesignJob("", clean) || !isPuneJob("", clean) || !matchesExp(clean)) continue;

      const emails = extractEmails(clean);
      const lines  = clean.split("\n").map(l => l.trim()).filter(Boolean);
      const parts  = (lines[0] || "").slice(0, 100).split("|");
      jobs.push({
        title   : (parts[1] || "Mechanical Design Engineer").trim(),
        company : (parts[0] || "See HN").trim(),
        location: (parts[2] || "Pune / Remote").trim(),
        link    : `https://news.ycombinator.com/item?id=${comment.objectID || ""}`,
        email   : emails[0] || null,
        source  : "HN Hiring",
      });
    }
    info(`HN → ${jobs.length} jobs (${jobs.filter(j => j.email).length} with HR email)`);
  } catch(e) { error(`HN: ${e.message}`); }
  return jobs;
}

// =====================================================
//  SOURCE 5 — Indeed RSS
// =====================================================
async function scrapeIndeedRSS() {
  const jobs = [];
  const LOCATION_PARAMS = [
    { param: "Pune%2C+Maharashtra",       label: "Pune, Maharashtra"       },
  ];

  const QUERY_TERMS = [
    "mechanical+design+engineer",
    "cad+engineer",
    "design+engineer",
    "product+design+engineer",
    "solidworks+designer",
    "machine+design+engineer",
    "engineering+automation",
    "cad+automation",
  ];

  const urls = [];
  for (const loc of LOCATION_PARAMS) {
    for (const q of QUERY_TERMS) {
      urls.push({
        url  : `https://in.indeed.com/rss?q=${q}&l=${loc.param}&sort=date`,
        label: loc.label,
      });
    }
  }
  try {
    for (const entry of urls) {
      const { data: xml } = await get(entry.url, { headers: { ...HEADERS, Accept: "text/xml" } });
      const parsed = await parseStringPromise(xml, { explicitArray: false });
      const items  = parsed?.rss?.channel?.item || [];
      for (const item of Array.isArray(items) ? items : [items]) {
        const title = item.title || "";
        const desc  = item.description || "";
        const link  = item.link || "";
        if (isMechDesignJob(title, desc) && matchesExp(desc)) {
          jobs.push({
            title,
            company : item["indeed:publisher"] || "See Indeed",
            location: entry.label,
            link,
            email   : null,
            source  : "Indeed",
          });
        }
      }
      await sleep(2000);
    }
  } catch(e) { error(`Indeed: ${e.message}`); }
  info(`Indeed → ${jobs.length} jobs`);
  return jobs;
}

// =====================================================
//  SCROLL HELPER
// =====================================================
async function scrollToBottom(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let lastHeight = 0;
      let unchanged  = 0;
      const timer = setInterval(() => {
        window.scrollBy(0, 800);
        const newHeight = document.body.scrollHeight;
        if (newHeight === lastHeight) {
          unchanged++;
          if (unchanged >= 4) { clearInterval(timer); resolve(); }
        } else {
          unchanged  = 0;
          lastHeight = newHeight;
        }
      }, 500);
    });
  });
}

// =====================================================
//  GOTO WITH RETRY
// =====================================================
async function gotoWithRetry(page, url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await sleep(3000);
      return true;
    } catch(e) {
      warn(`LinkedIn → load attempt ${attempt}/${retries} failed (${e.message.slice(0, 60)})`);
      if (attempt < retries) await sleep(5000);
    }
  }
  warn(`LinkedIn → giving up on: ${url.slice(0, 80)}`);
  return false;
}

// =====================================================
//  SOURCE 6 — LinkedIn (Puppeteer)
// =====================================================
async function scrapeLinkedIn() {
  const jobs = [];

  if (!CONFIG.linkedinEmail || !CONFIG.linkedinPassword) {
    warn("LinkedIn skipped — add linkedinEmail + linkedinPassword to CONFIG");
    return jobs;
  }

  let browser;
  try {
    info("LinkedIn → launching browser...");
    const chromePath = getChromeExecutablePath();
    if (chromePath) info(`LinkedIn → using browser executable: ${chromePath}`);
    else warn("LinkedIn → no browser executable found in known locations; Puppeteer will use its default revision");

    browser = await puppeteer.launch({
      executablePath: chromePath || undefined,
      headless: true,
      slowMo  : 40,
      args    : [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--single-process",
        "--disable-extensions",
      ],
      defaultViewport: { width: 1280, height: 800 },
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
    );

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    });

    // ── STEP 1: Login ──────────────────────────────
    info("LinkedIn → navigating to login page...");

    try {
      await page.goto("https://www.linkedin.com/login", { waitUntil: "networkidle2", timeout: 60000 });
    } catch(_) {
      warn("LinkedIn → networkidle2 timed out on login page, continuing anyway...");
    }
    await sleep(3000);

    info(`LinkedIn → current URL after goto: ${page.url()}`);

    if (page.url().includes("/feed") || page.url().includes("/home")) {
      info("LinkedIn → already logged in via session cookies ✓");
    } else {
      await sleep(3000);

      const allInputs = await page.evaluate(() =>
        [...document.querySelectorAll("input")].map(el => ({
          id: el.id, name: el.name, type: el.type,
          placeholder: el.placeholder, autocomplete: el.autocomplete,
          visible: el.offsetParent !== null,
        }))
      );
      info(`LinkedIn → found ${allInputs.length} input fields: ${JSON.stringify(allInputs)}`);

      const emailInput = await page.evaluateHandle(() =>
        [...document.querySelectorAll("input")].find(el =>
          el.offsetParent !== null &&
          (el.type === "email" || el.type === "text" || el.name === "session_key" ||
           el.id === "username" || el.placeholder?.toLowerCase().includes("email") ||
           el.placeholder?.toLowerCase().includes("phone"))
        )
      );

      const emailEl = emailInput.asElement();
      if (!emailEl) {
        error("LinkedIn → cannot find email field. Check linkedin_debug.png");
        await page.screenshot({ path: "linkedin_debug.png" });
        await browser.close();
        return jobs;
      }

      info("LinkedIn → typing email...");
      await emailEl.click({ clickCount: 3 });
      await sleep(500);
      await emailEl.type(CONFIG.linkedinEmail, { delay: 100 });
      await sleep(500);

      await page.keyboard.press("Tab");
      await sleep(500);

      info("LinkedIn → typing password...");
      await page.keyboard.type(CONFIG.linkedinPassword, { delay: 100 });
      await sleep(500);

      info("LinkedIn → submitting...");
      await Promise.all([
        page.keyboard.press("Enter"),
        page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 20000 }).catch(() => {}),
      ]);
      await sleep(4000);

      info(`LinkedIn → post-login URL: ${page.url()}`);

      if (page.url().includes("checkpoint") || page.url().includes("challenge")) {
        warn("LinkedIn → 2FA required. Complete it in the browser (waiting 90s)...");
        try {
          await page.waitForFunction(
            () => window.location.href.includes("/feed") || window.location.href.includes("/home"),
            { timeout: 90000 }
          );
        } catch(_) {
          warn("LinkedIn → 90s elapsed, continuing anyway...");
        }
        await sleep(3000);
        info(`LinkedIn → after checkpoint URL: ${page.url()}`);
      }

      if (page.url().includes("/login") || page.url().includes("/authwall")) {
        error("LinkedIn → Login FAILED. Reasons:");
        error("  1. Wrong email or password in CONFIG");
        error("  2. LinkedIn blocked the login (bot detection)");
        error("  3. Your account needs phone/email verification");
        error("  → Check linkedin_debug.png for what the browser looks like");
        try { await page.screenshot({ path: "linkedin_debug.png", fullPage: false }); } catch(_) {}
        await browser.close();
        return jobs;
      }

      info("LinkedIn → logged in successfully ✓");
    }

    await sleep(2000);

    const rawLinks       = [];
    const alreadyApplied = new Set(Object.keys(loadCache()));

    // ── STEP 2A: Search JOB LISTINGS (last 24hrs) ─────
    // Focused on Mechanical Design / CAD Engineering Automation roles — Pune only
    const jobSearches = [
      `Mechanical Design Engineer AND ("hiring" OR "requirement")`,
      `CAD Engineer AND ("hiring" OR "requirement")`,
      `Design Engineer AND ("hiring" OR "requirement")`,
      `Product Design Engineer AND ("hiring" OR "requirement")`,
      `SolidWorks Designer AND ("hiring" OR "requirement")`,
      `Machine Design Engineer AND ("hiring" OR "requirement")`,
      `Engineering Automation AND ("hiring" OR "requirement")`,
    ];

    const LI_LOCATIONS = [
      { label: "Pune", encoded: "Pune%2C%20Maharashtra%2C%20India" },
    ];

    info("LinkedIn → [JOBS] searching job listings (with pagination)...");
    for (const loc of LI_LOCATIONS) {
      info(`LinkedIn → [JOBS] location: ${loc.label}`);
      for (const keyword of jobSearches) {
        try {
          info(`LinkedIn → [JOB] [${loc.label}] "${keyword}"`);
          let pageNum = 0;
          let hasMore = true;

          while (hasMore && pageNum < 5) {
            const start = pageNum * 25;
            const searchUrl =
              `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}` +
              `&location=${loc.encoded}` +
              `&f_TPR=r86400&sortBy=DD&start=${start}`;

            const ok = await gotoWithRetry(page, searchUrl);
            if (!ok) { hasMore = false; break; }

            await scrollToBottom(page);
            await sleep(2000);

            const links = await page.evaluate(() =>
              [...document.querySelectorAll("a.base-card__full-link, a.job-card-container__link")]
                .map(a => a.href.split("?")[0])
                .filter(Boolean)
            );

            if (links.length === 0) {
              hasMore = false;
            } else {
              const fresh = links.filter(l => !alreadyApplied.has(l));
              info(`LinkedIn → [JOB] [${loc.label}] page ${pageNum + 1}: ${links.length} cards, ${fresh.length} new`);
              rawLinks.push(...fresh);
              pageNum++;
              if (links.length < 25) hasMore = false;
            }

            await sleep(2000);
          }
        } catch(e) { error(`LinkedIn job search [${loc.label}] "${keyword}": ${e.message}`); }
      }
    }

    // ── STEP 2B: Search POSTS by recruiters ───────────
    const postSearches = [
      `Mechanical Design Engineer AND ("hiring" OR "we are hiring") AND Pune`,
      `CAD Engineer AND ("hiring" OR "we are hiring") AND Pune`,
      `Design Engineer AND ("hiring" OR "we are hiring") AND Pune`,
      `"looking for" Mechanical Design Engineer Pune`,
      `"looking for" CAD Engineer Pune`,
      `SolidWorks Designer AND Pune AND hiring`,
      `Product Design Engineer AND Pune AND hiring`,
      `Engineering Automation AND Pune AND hiring`,
    ];

    info("LinkedIn → [POSTS] searching recruiter posts (with deep scroll)...");
    for (const keyword of postSearches) {
      try {
        info(`LinkedIn → [POST] "${keyword}"`);

        const postUrl =
          `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(keyword)}` +
          `&datePosted=past-24h&sortBy=date_posted`;

        const ok = await gotoWithRetry(page, postUrl);
        if (!ok) continue;

        for (let round = 0; round < 5; round++) {
          const before = await page.evaluate(() =>
            document.querySelectorAll("li.reusable-search__result-container, .search-results__list li").length
          );
          await scrollToBottom(page);
          await sleep(2000);
          try {
            const loadMore = await page.$("button.scaffold-finite-scroll__load-button, button[aria-label='Load more results']");
            if (loadMore) { await loadMore.click(); await sleep(2500); }
          } catch(_) {}
          const after = await page.evaluate(() =>
            document.querySelectorAll("li.reusable-search__result-container, .search-results__list li").length
          );
          info(`LinkedIn → [POST] scroll ${round + 1}: ${after} posts`);
          if (after <= before) break;
        }

        info(`LinkedIn → [POST] expanding all post cards...`);
        let expanded = 0;
        try {
          const allSeeMoreBtns = await page.$$(
            "button.feed-shared-inline-show-more-text__see-more-less-toggle, " +
            "button[aria-label='see more'], button[aria-label='See more'], " +
            ".update-components-text__see-more-toggle, " +
            "button.inline-show-more-text__button--truncate, .feed-shared-text__see-more"
          );
          for (const btn of allSeeMoreBtns) {
            try { await btn.scrollIntoView(); await btn.click(); await sleep(400); expanded++; }
            catch(_) {}
          }
        } catch(_) {}
        info(`LinkedIn → [POST] expanded ${expanded} post cards`);
        await sleep(1500);

        // Strategy 1: mailto: links
        const mailtoEmails = await page.evaluate(() => {
          const results = [];
          document.querySelectorAll("a[href^='mailto:']").forEach(a => {
            const email     = a.href.replace("mailto:", "").split("?")[0].trim();
            const container = a.closest("li, article, .search-results__list > li");
            const postLink  = container?.querySelector("a[href*='/posts/'], a[href*='/feed/update/']")?.href?.split("?")[0] || "";
            const postText  = container?.innerText || "";
            if (email) results.push({ email, postLink, postText });
          });
          return results;
        });

        if (mailtoEmails.length > 0) {
          info(`LinkedIn → [POST] 🎯 Found ${mailtoEmails.length} mailto: email links!`);
          for (const m of mailtoEmails) {
            if (extractEmails(m.email).length === 0) {
              warn(`LinkedIn → [POST] Skipping personal/free email: ${m.email}`);
              continue;
            }
            info(`LinkedIn → [POST] 📧 ${m.email}`);
            jobs.push({
              title   : "Mechanical Design Engineer",
              company : "Recruiter (LinkedIn Post)",
              location: "Pune / Remote",
              link    : m.postLink || postUrl,
              email   : m.email,
              source  : "LinkedIn Post",
            });
          }
        }

        // Strategy 2: text-based email extraction
        const postData = await page.evaluate(() => {
          const results = [];
          const seen    = new Set();

          const containerSelectors = [
            "li.reusable-search__result-container",
            ".search-results__list > li",
            ".update-components-update",
            ".feed-shared-update-v2",
            "div[data-urn]",
          ];

          for (const sel of containerSelectors) {
            const cards = document.querySelectorAll(sel);
            if (cards.length === 0) continue;
            cards.forEach(card => {
              const text = (card.innerText || card.textContent || "").trim();
              if (text.length > 20 && !seen.has(text.slice(0, 100))) {
                seen.add(text.slice(0, 100));
                const postLink = card.querySelector("a[href*='/posts/'], a[href*='/feed/update/']")?.href?.split("?")[0] || "";
                results.push({ text, postLink });
              }
            });
            if (results.length > 0) break;
          }

          if (results.length === 0) results.push({ text: document.body.innerText, postLink: "" });
          return results;
        });

        info(`LinkedIn → [POST] scanning ${postData.length} post cards for emails...`);
        for (const p of postData) {
          const emails = extractEmails(p.text);
          for (const email of emails) {
            if (jobs.some(j => j.email === email)) continue;
            info(`LinkedIn → [POST] 📧 Found in text: ${email}`);
            jobs.push({
              title   : "Mechanical Design Engineer",
              company : "Recruiter (LinkedIn Post)",
              location: "Pune / Remote",
              link    : p.postLink || postUrl,
              email,
              source  : "LinkedIn Post",
            });
          }
        }

        const postLinks = await page.evaluate(() =>
          [...document.querySelectorAll("a[href*='/posts/'], a[href*='/feed/update/']")]
            .map(a => a.href.split("?")[0]).filter(Boolean)
        );
        const freshPostLinks = [...new Set(postLinks)].filter(l => !alreadyApplied.has(l));
        info(`LinkedIn → [POST] ${freshPostLinks.length} post links queued for Step 3 deep scan`);
        rawLinks.push(...freshPostLinks);

        await sleep(2500);
      } catch(e) { error(`LinkedIn post search "${keyword}": ${e.message}`); }
    }

    // ── STEP 3: Open each link, extract HR email ───────
    const uniqueLinks = [...new Set(rawLinks)];
    info(`LinkedIn → opening ${uniqueLinks.length} links to scan for HR emails...`);

    for (let i = 0; i < uniqueLinks.length; i++) {
      const link   = uniqueLinks[i];
      const isPost = link.includes("/posts/") || link.includes("/feed/update/");
      try {
        const loaded = await gotoWithRetry(page, link);
        if (!loaded) { error(`LinkedIn [${i + 1}] skipping — could not load`); continue; }

        const expandSelectors = [
          ".show-more-less-html__button--more",
          "button.jobs-description__footer-button",
          "button.feed-shared-inline-show-more-text__see-more-less-toggle",
          "button[aria-label='see more']", "button[aria-label='See more']",
          "button.see-more", ".feed-shared-text__see-more",
          "span.see-more", ".update-components-text__see-more-toggle",
          "button.inline-show-more-text__button",
        ];

        for (const sel of expandSelectors) {
          try {
            const btns = await page.$$(sel);
            for (const btn of btns) { try { await btn.click(); await sleep(600); } catch(_) {} }
          } catch(_) {}
        }

        await page.evaluate(async () => {
          await new Promise(resolve => {
            let d = 0;
            const t = setInterval(() => {
              window.scrollBy(0, 300); d += 300;
              if (d >= 3000) { clearInterval(t); resolve(); }
            }, 300);
          });
        });
        await sleep(800);

        for (const sel of expandSelectors) {
          try {
            const btns = await page.$$(sel);
            for (const btn of btns) { try { await btn.click(); await sleep(400); } catch(_) {} }
          } catch(_) {}
        }
        await sleep(800);

        const pageData = await page.evaluate((isPost) => {
          let title = "", company = "", text = "";
          if (isPost) {
            title   = document.querySelector(".update-components-actor__name, .feed-shared-actor__name, .actor-name")?.innerText?.trim() || "Recruiter Post";
            company = document.querySelector(".update-components-actor__description, .feed-shared-actor__description")?.innerText?.trim() || "LinkedIn Recruiter";
            text    =
              document.querySelector(".update-components-text")?.innerText ||
              document.querySelector(".feed-shared-text")?.innerText ||
              document.querySelector(".feed-shared-update-v2__description")?.innerText ||
              document.querySelector(".feed-shared-inline-show-more-text")?.innerText ||
              document.body.innerText;
          } else {
            title   = document.querySelector("h1.top-card-layout__title, h1.job-details-jobs-unified-top-card__job-title, h1")?.innerText?.trim() || "";
            company = document.querySelector("a.topcard__org-name-link, .job-details-jobs-unified-top-card__company-name, .topcard__flavor")?.innerText?.trim() || "See LinkedIn";
            text    =
              document.querySelector(".show-more-less-html__markup")?.innerText ||
              document.querySelector(".jobs-description__content")?.innerText ||
              document.querySelector("#job-details")?.innerText ||
              document.body.innerText;
          }
          return { title, company, text };
        }, isPost);

        let emails = extractEmails(pageData.text || "");

        if (emails.length === 0 && pageData.company && pageData.company !== "See LinkedIn") {
          info(`LinkedIn [${i + 1}] No email in post → searching Google for ${pageData.company} HR email...`);
          try {
            const companyClean = pageData.company.replace(/[^a-zA-Z0-9 ]/g, "").trim();
            const googleQueries = [
              `"${companyClean}" HR email careers site:linkedin.com OR site:naukri.com`,
              `"${companyClean}" recruiter email hiring Mechanical Design Engineer Pune`,
              `"${companyClean}" "careers@" OR "hr@" OR "jobs@" email`,
            ];
            for (const q of googleQueries) {
              try {
                const res = await axios.get(
                  `https://www.google.com/search?q=${encodeURIComponent(q)}&num=5`,
                  { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }, timeout: 8000 }
                );
                const found = extractEmails(res.data);
                if (found.length > 0) {
                  emails = found;
                  info(`LinkedIn [${i + 1}] 🌐 Google found email: ${emails[0]} for ${companyClean}`);
                  break;
                }
              } catch(_) {}
              await sleep(1000);
            }
          } catch(e) { error(`Google search fallback error: ${e.message}`); }
        }

        const tag  = emails.length > 0 ? `📧 ${emails[0]}` : "❌ no email";
        const type = isPost ? "POST" : "JOB ";
        info(
          `LinkedIn [${String(i + 1).padStart(2)}/${uniqueLinks.length}] ` +
          `[${type}] ${(pageData.title || "").slice(0, 30).padEnd(30)} | ` +
          `${(pageData.company || "").slice(0, 20).padEnd(20)} | ${tag}`
        );

        const titleForFilter = isPost ? "mechanical design engineer" : (pageData.title || "");
        if (isMechDesignJob(titleForFilter)) {
          jobs.push({
            title   : pageData.title || (isPost ? "Mechanical Design Engineer" : "See LinkedIn"),
            company : pageData.company,
            location: "Pune / Remote",
            link,
            email   : emails[0] || null,
            source  : isPost ? "LinkedIn Post" : "LinkedIn Job",
          });
        }
      } catch(e) { error(`LinkedIn [${i + 1}] could not open: ${link.slice(0, 55)}`); }

      await sleep(2500);
    }

    await browser.close();
    const withEmail = jobs.filter(j => j.email).length;
    info(`LinkedIn → ${jobs.length} jobs total (${withEmail} with HR email, ${jobs.length - withEmail} for digest)`);

  } catch(e) {
    error(`LinkedIn Puppeteer: ${e.message}`);
    if (browser) await browser.close();
  }

  return jobs;
}

// =====================================================
//  EMAIL — nodemailer transporter
// =====================================================
function createTransporter() {
  return nodemailer.createTransport({
    host  : "smtp.gmail.com",
    port  : 587,
    secure: false,
    auth  : { user: CONFIG.email, pass: CONFIG.appPassword },
  });
}

// ── Application email template — tailored for Mechanical Design / CAD & Engineering Automation ──
const APPLICATION_TEMPLATE = (job) => `Dear Hiring Team,

I am writing to express my keen interest in the ${job.title} position at ${job.company}.

I have close to ${CONFIG.yearsExp} years of hands-on experience in mechanical design, CAD, and engineering automation, with core expertise in:

- CAD Platforms: SolidWorks, AutoCAD, CATIA V5, Creo/Pro-E — 2D drafting, 3D parametric modeling, sheet metal & assembly design
- Design Standards: GD&T, DFM/DFA, Tolerance Stack-up, IS/SP46:2003 drafting standards
- Engineering Automation: RuleStream Knowledge-Based Engineering (KBE) configurator development, VB.NET rule authoring, CAD/design automation, BOM-driven configuration logic
- Documentation & Data: BOM management, engineering change management, PLM/Siemens Teamcenter, technical drawing preparation
- Programming: Python for automation and reporting, scripting for CAD workflow tooling

I am passionate about streamlining mechanical design workflows through automation, and take pride in accurate, standards-compliant engineering documentation and close collaboration with design and manufacturing teams.

I am based in Pune and actively exploring Mechanical Design Engineer and CAD & Engineering Automation opportunities in Pune (also open to Remote).

Please find my resume attached. I would love the opportunity to discuss how my experience aligns with your team's needs.

Job Reference: ${job.link}

Best regards,
${CONFIG.name}
Phone   : ${CONFIG.phone}
Email   : ${CONFIG.email}
LinkedIn: ${CONFIG.linkedin}
`;

// =====================================================
//  SEND APPLICATION
// =====================================================
async function sendApplication(job, transporter) {
  if (!job.email) return false;

  if (DRY_RUN) {
    info(`[DRY RUN] Would apply → ${job.company} (${job.email}) ← cache NOT updated`);
    return true;
  }

  if (wasAppliedRecently(job))               return false;
  if (wasCompanyAppliedRecently(job.company)) return false;

  const attachments = [];
  if (fs.existsSync(CONFIG.resumePath)) {
    attachments.push({ filename: path.basename(CONFIG.resumePath), path: CONFIG.resumePath });
  } else {
    warn(`Resume not found at ${CONFIG.resumePath} — sending WITHOUT attachment`);
  }

  const mail = {
    from   : `"${CONFIG.name}" <${CONFIG.email}>`,
    to     : job.email,
    subject: `Application for ${job.title} — ${CONFIG.name} (~${CONFIG.yearsExp} yrs Mechanical Design / CAD, Pune)`,
    text   : APPLICATION_TEMPLATE(job),
    attachments,
  };

  try {
    await transporter.sendMail(mail);
    info(`✓ Applied → ${job.company} (${job.email}) ${attachments.length ? "with resume" : "NO resume"}`);
    markApplied(job);
    return true;
  } catch(e) {
    error(`✗ Failed ${job.company}: ${e.message}`);
    return false;
  }
}

// =====================================================
//  SEND DIGEST
// =====================================================
async function sendDigest(jobs, transporter) {
  if (!jobs.length) return;
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const jobList = jobs.map((j, i) =>
    `\n${"─".repeat(45)}\n#${i + 1} [${j.source}]\nTitle   : ${j.title}\nCompany : ${j.company}\nLocation: ${j.location}\nLink    : ${j.link}`
  ).join("\n");

  const body =
    `Hi ${CONFIG.name},\n\n` +
    `${jobs.length} Pune Mechanical Design / CAD & Engineering Automation jobs found on ${dateStr}.\n` +
    `No direct HR email — apply manually via links below:\n` +
    jobList +
    `\n\n${"─".repeat(45)}\n` +
    `Filters: Pune / Remote | Mechanical Design Engineer / CAD Engineer / Engineering Automation | ~${CONFIG.yearsExp} years exp\n\nJob Bot`;

  const mail = {
    from   : `"Job Bot" <${CONFIG.email}>`,
    to     : CONFIG.email,
    subject: `Pune Mechanical Design / CAD Jobs — ${dateStr} (${jobs.length} to apply manually)`,
    text   : body,
  };

  if (DRY_RUN) {
    info(`[DRY RUN] Would send digest with ${jobs.length} jobs`);
    return;
  }

  try {
    await transporter.sendMail(mail);
    info(`Digest sent → ${CONFIG.email}`);
  } catch(e) {
    error(`Digest error: ${e.message}`);
  }
}

// =====================================================
//  MAIN
// =====================================================
(async () => {
  console.log("=".repeat(58));
  console.log("  PUNE MECHANICAL DESIGN / CAD & ENGINEERING AUTOMATION JOB BOT");
  if (DRY_RUN) console.log("  *** DRY RUN — no emails will be sent ***");
  console.log("=".repeat(58));
  console.log(`  Filters : Pune | Remote | Mechanical Design / CAD / Engineering Automation | ~${CONFIG.yearsExp} yrs exp`);
  console.log(`  Log file: ${LOG_FILE}`);
  console.log("=".repeat(58) + "\n");

  if (!fs.existsSync(CONFIG.resumePath)) warn(`Resume not found: ${CONFIG.resumePath}`);

  if (DRY_RUN) {
    info("Cache: DRY RUN mode — cache will NOT be updated, all jobs will show as eligible");
  }
  const appliedCache   = DRY_RUN ? {} : loadCache();
  const alreadyApplied = new Set(Object.keys(appliedCache));
  if (!DRY_RUN) printCacheSummary();

  const scrapers = [
    ["Remotive",   scrapeRemotive],
    ["Arbeitnow",  scrapeArbeitnow],
    ["Jobicy",     scrapeJobicy],
    ["HackerNews", scrapeHNHiring],
    ["Indeed RSS", scrapeIndeedRSS],
    ["LinkedIn",   scrapeLinkedIn],
  ];

  let allJobs = [];
  for (const [name, fn] of scrapers) {
    info(`Scraping ${name}...`);
    try { allJobs = allJobs.concat(await fn()); }
    catch(e) { error(`${name} crashed: ${e.message}`); }
  }

  // Deduplicate — prefer jobs WITH email
  const linkMap = new Map();
  for (const job of allJobs) {
    if (!job.link) continue;
    const key = job.email ? `${job.link}::${job.email}` : job.link;
    if (!linkMap.has(key)) {
      linkMap.set(key, job);
    } else {
      const existing = linkMap.get(key);
      if (!existing.email && job.email) linkMap.set(key, job);
    }
  }
  const unique = [...linkMap.values()];

  const newJobs    = unique.filter(j => {
    const key = `${j.link}::${j.email || ""}`;
    return !alreadyApplied.has(key);
  });
  const autoJobs   = newJobs.filter(j => j.email);
  const manualJobs = newJobs.filter(j => !j.email);

  console.log(`\n${"=".repeat(58)}`);
  console.log(`  Total found       : ${unique.length}`);
  console.log(`  Already applied   : ${unique.length - newJobs.length}  (skipped)`);
  console.log(`  New jobs          : ${newJobs.length}`);
  console.log(`  Auto-apply (email): ${autoJobs.length}`);
  console.log(`  Manual apply      : ${manualJobs.length}`);
  console.log(`${"=".repeat(58)}\n`);

  newJobs.forEach((j, i) => {
    const emailStr = j.email ? ` → ${j.email}` : "";
    console.log(
      `  ${String(i + 1).padStart(2)}. [${j.source.padEnd(10)}] ` +
      `${j.title.slice(0, 40).padEnd(40)} | ${j.company.slice(0, 25)}${emailStr}`
    );
  });
  console.log();

  if (newJobs.length === 0) {
    info("No new Mechanical Design / CAD jobs found today in Pune. Try again tomorrow.");
    return;
  }

  if (DRY_RUN) {
    info("DRY RUN complete — re-run without --dry-run to send emails.");
    return;
  }

  if (!CONFIG.appPassword) {
    error("appPassword is empty! Set it in the CONFIG section at the top of the file.");
    process.exit(1);
  }

  const transporter = createTransporter();

  if (autoJobs.length) {
    info(`--- AUTO-APPLYING to ${autoJobs.length} jobs ---`);
    autoJobs.forEach((j, i) => {
      info(`  ${i + 1}. ${j.title.slice(0, 35)} | ${j.company.slice(0, 25)} | 📧 ${j.email}`);
    });
    console.log();
    let applied = 0;
    for (const job of autoJobs) {
      if (await sendApplication(job, transporter)) applied++;
      await sleep(5000);
    }
    info(`Auto-applied: ${applied}/${autoJobs.length}`);
  } else {
    info("No direct HR emails found — all jobs go to digest.");
  }

  if (manualJobs.length) {
    info(`--- Sending digest (${manualJobs.length} manual jobs) ---`);
    await sendDigest(manualJobs, transporter);
  }

  info("Done! Check your inbox and the log file.");
})();