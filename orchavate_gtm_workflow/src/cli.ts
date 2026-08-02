import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { chromium } from 'playwright';
import { CompanyInput, CompanyAuditReportV11, PageAuditResult, RunReportStats } from './types.js';
import { resolveWebsite, CircuitBreakerTracker, normalizeDomain } from './website_resolver.js';
import { discoverEmailsAndEvidence } from './email_discoverer.js';
import { checkBotBlock } from './bot_block_gate.js';
import { auditPageWithAxe } from './auditor.js';
import { captureCompulsoryToolScreenshots } from './screenshot.js';
import { generateDeliverablePairs } from './deliverables_generator.js';
import { generateRunReport } from './run_report_generator.js';
import { exportTrackerFiles } from './tracker.js';
import { defaultConfig, parseCliConfig, AppConfig, SearchMode } from './config/config.js';
import { renderStartupMenu, renderCircuitBreakerMenu } from './ui/menu.js';
import { SearchCache } from './cache/search_cache.js';
import { ResolutionLogger } from './logger/logger.js';
import { CircuitBreaker } from './circuit_breaker/circuit_breaker.js';

const DESKTOP_USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0'
];

export function parseInputFile(filePath: string): CompanyInput[] {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.xlsx' || ext === '.xls') {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    if (!rawRows || rawRows.length === 0) {
      throw new Error(`Excel file is empty: ${filePath}`);
    }

    const nameKeywords = [
      'name of the stock broker', 'name of the broker', 'name of broker',
      'name of the applicant', 'name of fund', 'name of venture capital fund',
      'name of entity', 'intermediary name', 'company name', 'name of amc',
      'name of the intermediary', 'applicant name', 'company', 'name', 'fund name', 'entity'
    ];

    const findColIndexInRow = (rowHeaders: string[], keywords: string[]): number => {
      for (const kw of keywords) {
        const idx = rowHeaders.findIndex(h => h === kw || h.includes(kw));
        if (idx !== -1) return idx;
      }
      return -1;
    };

    let headerRowIdx = -1;
    for (let r = 0; r < Math.min(rawRows.length, 15); r++) {
      const rowCells = rawRows[r].map((cell: any) => String(cell).trim().toLowerCase());
      const nonCount = rowCells.filter(c => c.length > 0).length;
      if (nonCount < 2) continue;

      const candidateNameIdx = findColIndexInRow(rowCells, nameKeywords);
      if (candidateNameIdx !== -1) {
        headerRowIdx = r;
        break;
      }
    }

    if (headerRowIdx === -1) {
      for (let r = 0; r < Math.min(rawRows.length, 15); r++) {
        const rowStr = rawRows[r].map(cell => String(cell).toLowerCase()).join(' ');
        if (
          rowStr.includes('name') ||
          rowStr.includes('broker') ||
          rowStr.includes('company') ||
          rowStr.includes('fund') ||
          rowStr.includes('intermediary') ||
          rowStr.includes('applicant')
        ) {
          headerRowIdx = r;
          break;
        }
      }
    }

    if (headerRowIdx === -1) headerRowIdx = 0;

    const headers = rawRows[headerRowIdx].map((cell: any) => String(cell).trim().toLowerCase());
    const dataRows = rawRows.slice(headerRowIdx + 1);

    const findColIndex = (keywords: string[]): number => findColIndexInRow(headers, keywords);

    const srIdx = findColIndex(['sr. no.', 'sr.no.', 'sr no', 'srno', 's.no', 'sl.no', 's.n.', 'sl no']);
    const nameIdx = findColIndex(nameKeywords);
    const websiteIdx = findColIndex(['website', 'url', 'company website', 'web address', 'site', 'web']);
    const assignedIdx = findColIndex(['assigned to', 'assigned', 'auditor']);
    const contactIdx = findColIndex(['contact person', 'contact', 'contact person name', 'person']);
    const emailIdx = findColIndex(['email id', 'email', 'emailid', 'e-mail', 'contact email', 'email address']);
    const verifiedIdx = findColIndex(['verified by', 'verified']);

    const results: CompanyInput[] = [];

    dataRows.forEach((row, index) => {
      const companyName = nameIdx !== -1 && row[nameIdx] ? String(row[nameIdx]).trim() : '';
      if (
        !companyName ||
        companyName.toLowerCase() === 'name' ||
        companyName.toLowerCase() === 'company name' ||
        companyName.toLowerCase().startsWith('total') ||
        companyName.toLowerCase().startsWith('note')
      ) {
        return;
      }

      const srVal = srIdx !== -1 && row[srIdx] ? parseInt(String(row[srIdx]), 10) : NaN;

      results.push({
        srNo: !isNaN(srVal) ? srVal : index + 1,
        companyName,
        readymadeWebsite: websiteIdx !== -1 && row[websiteIdx] ? String(row[websiteIdx]).trim() : '',
        assignedTo: assignedIdx !== -1 && row[assignedIdx] ? String(row[assignedIdx]).trim() : 'Unassigned',
        contactPerson: contactIdx !== -1 && row[contactIdx] ? String(row[contactIdx]).trim() : 'N/A',
        emailId: emailIdx !== -1 && row[emailIdx] ? String(row[emailIdx]).trim() : 'N/A',
        verifiedBy: verifiedIdx !== -1 && row[verifiedIdx] ? String(row[verifiedIdx]).trim() : 'Orchavate Automated Tool v1.1',
      });
    });

    if (results.length === 0) {
      throw new Error(`Could not extract target companies from Excel file. Please check column headers.`);
    }

    return results;
  } else if (ext === '.json') {
    const content = fs.readFileSync(filePath, 'utf8');
    const raw = JSON.parse(content);
    return raw.map((item: any, index: number) => ({
      srNo: item.srNo || index + 1,
      companyName: item.companyName || item.name || 'Unknown',
      readymadeWebsite: item.website || item.readymadeWebsite || item.url || '',
      assignedTo: item.assignedTo || 'Unassigned',
      contactPerson: item.contactPerson || 'N/A',
      emailId: item.emailId || item.email || 'N/A',
      verifiedBy: item.verifiedBy || 'Orchavate Automated Tool v1.1',
    }));
  }
  throw new Error(`Unsupported file format: ${filePath}`);
}

export function parseReadymadeFile(filePath: string): Record<string, string> {
  const map: Record<string, string> = {};
  try {
    const companies = parseInputFile(filePath);
    for (const c of companies) {
      if (c.companyName && c.readymadeWebsite) {
        map[c.companyName.toLowerCase().trim()] = c.readymadeWebsite.trim();
      }
    }
  } catch (err: any) {
    console.warn(`⚠️ Warning: Could not parse readymade file (${filePath}): ${err?.message}`);
  }
  return map;
}

export async function runWorkflowV11(
  inputCompanies: CompanyInput[],
  baseOutputDir: string,
  readymadeList?: Record<string, string>,
  config: AppConfig = defaultConfig
): Promise<CompanyAuditReportV11[]> {
  const startTime = Date.now();

  if (!fs.existsSync(baseOutputDir)) {
    fs.mkdirSync(baseOutputDir, { recursive: true });
  }

  const cache = new SearchCache(baseOutputDir, config.cacheTTLMs, config.cacheEnabled);
  const logger = new ResolutionLogger(baseOutputDir);
  const circuitBreaker = new CircuitBreaker(config.circuitBreakerThreshold, config.circuitBreakerMinProcessed);

  let currentMode: SearchMode = config.searchMode;
  let currentReadymadeMap = readymadeList || {};

  const reports: CompanyAuditReportV11[] = [];
  const circuitBreakerEvents: string[] = [];
  let totalSearchAttempts = 0;
  let totalSearchDurationMs = 0;

  const browser = await chromium.launch({ headless: true });

  console.log(`\n===============================================================`);
  console.log(`Starting Accessibility Audit Tool — v1.1 Final Spec`);
  console.log(`Resolution Mode: ${currentMode}`);
  console.log(`Run Output Directory: ${baseOutputDir}`);
  console.log(`Processing ${inputCompanies.length} target companies...`);
  if (Object.keys(currentReadymadeMap).length > 0) {
    console.log(`✓ Loaded Readymade Fallback Reference File (${Object.keys(currentReadymadeMap).length} entries mapped)`);
  }
  console.log(`===============================================================\n`);

  for (let i = 0; i < inputCompanies.length; i++) {
    const company = inputCompanies[i];
    const safeCompany = company.companyName.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Per-Company Folder & Screenshots Subfolder
    const companyDir = path.join(baseOutputDir, safeCompany);
    const companyScreenshotsDir = path.join(companyDir, 'screenshots');
    if (!fs.existsSync(companyScreenshotsDir)) {
      fs.mkdirSync(companyScreenshotsDir, { recursive: true });
    }

    console.log(`\n[Company ${i + 1}/${inputCompanies.length}] ${company.companyName}`);

    const resStartTime = Date.now();
    const resolution = await resolveWebsite(company, currentReadymadeMap, cache, currentMode);
    const searchDurationMs = Date.now() - resStartTime;

    totalSearchAttempts++;
    totalSearchDurationMs += searchDurationMs;

    logger.logCompanyResolution({
      company: company.companyName,
      searchQueries: [`"${company.companyName}" official website`],
      candidateDomains: resolution.resolvedUrl ? [resolution.resolvedUrl] : [],
      selectedDomain: resolution.resolvedUrl,
      confidence: resolution.confidence,
      reason: resolution.conflictDetails || `Resolved via ${resolution.source}`,
      searchDurationMs,
      errors: [],
      timestamp: new Date().toISOString(),
    });

    console.log(`  -> Resolution Source: ${resolution.source} (${resolution.confidence} Confidence)`);
    console.log(`  -> Resolved URL: ${resolution.resolvedUrl || 'NONE'}`);

    const triggered = circuitBreaker.recordResult({
      resolvedUrl: resolution.resolvedUrl,
      source: 'automated-search',
      confidence: resolution.confidence,
      hasConflict: resolution.hasConflict,
      candidateDomains: [],
      searchQueries: [],
      searchDurationMs,
      reason: resolution.conflictDetails || '',
    });

    if (triggered) {
      const stats = circuitBreaker.getStats();
      const msg = `⚠️ CIRCUIT BREAKER TRIGGERED at company #${company.srNo} (${company.companyName}): Failure rate reached ${stats.failureRatePercent}%.`;
      console.warn(`\n  ${msg}`);
      circuitBreakerEvents.push(msg);

      if (!config.nonInteractive) {
        const action = await renderCircuitBreakerMenu(stats);
        if (action === 'ABORT') {
          console.warn(`\n⛔ Execution paused and aborted by operator.\n`);
          break;
        } else if (action === 'SWITCH_READYMADE') {
          currentMode = 'READYMADE';
          circuitBreaker.resetCount();
          console.log(`\n🔄 Switched to READYMADE mode for remaining batch.\n`);
        } else if (action === 'RETRY') {
          circuitBreaker.resetCount();
          i--;
          continue;
        } else {
          circuitBreaker.resetCount();
        }
      }
    }

    if (resolution.hasConflict) {
      console.warn(`  ⚠️ CONFLICT FLAGGED: Self-search & readymade URL mismatch. Pausing scan for manual review.`);
      const report: CompanyAuditReportV11 = {
        company,
        resolution,
        emailDiscovery: {
          primaryEmail: { address: 'N/A', type: 'primary', label: 'Primary Contact Email', status: 'Not Found' },
          regardingAccessibility: [],
          overallStatus: 'Not Found',
          evidenceScreenshots: [],
        },
        botBlock: { isBlocked: false },
        pages: [],
        status: 'Conflict Flagged',
        totalViolations: 0,
        altTextViolations: 0,
        contrastViolations: 0,
        labelViolations: 0,
        keyboardViolations: 0,
        lighthouseAvgScore: 0,
        deliverables: {} as any,
        remarks: resolution.conflictDetails || 'Conflict flagged - needs manual review',
        timestamp: new Date().toISOString(),
      };
      generateDeliverablePairs(report, companyDir);
      fs.writeFileSync(path.join(companyDir, `${safeCompany}_audit.json`), JSON.stringify(report, null, 2), 'utf8');
      reports.push(report);
      continue;
    }

    if (!resolution.resolvedUrl) {
      console.error(`  ❌ Website Resolution Failed.`);
      const report: CompanyAuditReportV11 = {
        company,
        resolution,
        emailDiscovery: {
          primaryEmail: { address: 'N/A', type: 'primary', label: 'Primary Contact Email', status: 'Not Found' },
          regardingAccessibility: [],
          overallStatus: 'Not Found',
          evidenceScreenshots: [],
        },
        botBlock: { isBlocked: false },
        pages: [],
        status: 'Inaccessible',
        totalViolations: 0,
        altTextViolations: 0,
        contrastViolations: 0,
        labelViolations: 0,
        keyboardViolations: 0,
        lighthouseAvgScore: 0,
        deliverables: {} as any,
        remarks: 'Inaccessible: Could not resolve valid website URL',
        timestamp: new Date().toISOString(),
      };
      generateDeliverablePairs(report, companyDir);
      fs.writeFileSync(path.join(companyDir, `${safeCompany}_audit.json`), JSON.stringify(report, null, 2), 'utf8');
      reports.push(report);
      continue;
    }

    // Rate Limiting: Desktop UA Rotation & 4-12s randomized delay
    const randomUA = DESKTOP_USER_AGENTS[i % DESKTOP_USER_AGENTS.length];
    const context = await browser.newContext({ userAgent: randomUA, viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();

    // Step 2: Bot Block Gate
    let botBlock = { isBlocked: false } as any;
    try {
      await page.goto(resolution.resolvedUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const html = await page.content();
      const title = await page.title();
      botBlock = checkBotBlock(html, title);
    } catch (err: any) {
      console.warn(`  ⚠️ Initial page load issue: ${err?.message}`);
    }

    if (botBlock.isBlocked) {
      console.warn(`  🚫 BOT BLOCK DETECTED: Matched signature "${botBlock.signatureMatched}". Reclassified as Blocked (Bot Protection).`);
      const report: CompanyAuditReportV11 = {
        company,
        resolution,
        emailDiscovery: {
          primaryEmail: { address: 'N/A', type: 'primary', label: 'Primary Contact Email', status: 'Not Found' },
          regardingAccessibility: [],
          overallStatus: 'Not Found',
          evidenceScreenshots: [],
        },
        botBlock,
        pages: [],
        status: 'Blocked (Bot Protection)',
        totalViolations: 0,
        altTextViolations: 0,
        contrastViolations: 0,
        labelViolations: 0,
        keyboardViolations: 0,
        lighthouseAvgScore: 0,
        deliverables: {} as any,
        remarks: `Blocked by Bot Protection (${botBlock.signatureMatched})`,
        timestamp: new Date().toISOString(),
      };
      generateDeliverablePairs(report, companyDir);
      fs.writeFileSync(path.join(companyDir, `${safeCompany}_audit.json`), JSON.stringify(report, null, 2), 'utf8');
      reports.push(report);
      await context.close();
      continue;
    }

    // Step 3: Email Discovery & Evidence Capture into companyScreenshotsDir
    console.log(`  -> Running Email Discovery...`);
    const emailDiscovery = await discoverEmailsAndEvidence(page, company.companyName, resolution.resolvedUrl, companyScreenshotsDir);
    console.log(`  ✓ Primary Email: ${emailDiscovery.primaryEmail.address} (${emailDiscovery.primaryEmail.status})`);

    // Step 4: Accessibility Tool Scans & Compulsory 3 Screenshots (WAVE, Axe DevTools, Lighthouse)
    console.log(`  -> Running Axe-Core & Lighthouse Scans...`);
    const pageResult = await auditPageWithAxe(page, 'Homepage', resolution.resolvedUrl);

    console.log(`  -> Capturing Compulsory 3 Tool Screenshots (WAVE, Axe DevTools, Lighthouse)...`);
    const toolScreenshots = await captureCompulsoryToolScreenshots(
      page,
      company.companyName,
      'Homepage',
      pageResult.axeViolations,
      pageResult.lighthouseScore,
      companyScreenshotsDir
    );
    pageResult.screenshots = toolScreenshots.allCapturedPaths;

    const allViolations = pageResult.axeViolations;
    const altTextCount = allViolations.filter(v => v.category === 'missing_alt_text').length;
    const contrastCount = allViolations.filter(v => v.category === 'color_contrast').length;
    const labelCount = allViolations.filter(v => v.category === 'form_labels').length;
    const keyboardCount = allViolations.filter(v => v.category === 'keyboard_navigation').length;

    const report: CompanyAuditReportV11 = {
      company,
      resolution,
      emailDiscovery,
      botBlock: { isBlocked: false },
      pages: [pageResult],
      status: 'Completed',
      totalViolations: allViolations.length,
      altTextViolations: altTextCount,
      contrastViolations: contrastCount,
      labelViolations: labelCount,
      keyboardViolations: keyboardCount,
      lighthouseAvgScore: pageResult.lighthouseScore,
      deliverables: {} as any,
      remarks: `Scanned 1 page. Violations: ${allViolations.length}. Lighthouse A11y: ${pageResult.lighthouseScore}/100.`,
      timestamp: new Date().toISOString(),
    };

    // Step 5: Deliverables Pair Generation & JSON Audit export into companyDir
    const deliverables = generateDeliverablePairs(report, companyDir);
    report.deliverables = deliverables;

    fs.writeFileSync(path.join(companyDir, `${safeCompany}_audit.json`), JSON.stringify(report, null, 2), 'utf8');

    reports.push(report);
    console.log(`  ✓ Scan Completed: ${allViolations.length} WCAG violations found. Deliverables saved to "${companyDir}".`);

    await context.close();

    // 4-12s randomized rate limiting delay between domain scans
    const delayMs = Math.floor(Math.random() * 4000) + 4000;
    await new Promise(r => setTimeout(r, delayMs));
  }

  await browser.close();

  // Export Master Tracker & Run Report at baseOutputDir
  exportTrackerFiles(reports, baseOutputDir);

  const durationSeconds = Math.round((Date.now() - startTime) / 1000);
  const avgSearchTimeMs = totalSearchAttempts > 0 ? Math.round(totalSearchDurationMs / totalSearchAttempts) : 0;

  const stats: RunReportStats = {
    timestamp: new Date().toISOString(),
    durationSeconds,
    totalCompanies: inputCompanies.length,
    searchMode: currentMode,
    searchProviderName: 'DuckDuckGo HTML',
    searchAttempts: totalSearchAttempts,
    avgSearchTimeMs,
    resolutionStats: {
      selfSearchCount: reports.filter(r => r.resolution.source === 'self-search' || r.resolution.source === 'both-agreed').length,
      fallbackCount: reports.filter(r => r.resolution.source === 'readymade-fallback').length,
      conflictCount: reports.filter(r => r.resolution.hasConflict).length,
    },
    emailStats: {
      verifiedCount: reports.filter(r => r.emailDiscovery.overallStatus === 'Verified').length,
      guessedCount: reports.filter(r => r.emailDiscovery.overallStatus === 'Unverified - guessed pattern').length,
      notFoundCount: reports.filter(r => r.emailDiscovery.overallStatus === 'Not Found').length,
    },
    scanStats: {
      completedCount: reports.filter(r => r.status === 'Completed').length,
      blockedCount: reports.filter(r => r.status === 'Blocked (Bot Protection)').length,
      inaccessibleCount: reports.filter(r => r.status === 'Inaccessible').length,
    },
    circuitBreakerEvents,
    conflictsTable: reports.filter(r => r.resolution.hasConflict).map(r => ({
      company: r.company.companyName,
      selfSearchUrl: r.resolution.selfSearchUrl || 'N/A',
      readymadeUrl: r.resolution.readymadeUrl || 'N/A',
      status: 'Conflict Flagged',
    })),
    blockedDomainsTable: reports.filter(r => r.botBlock.isBlocked).map(r => ({
      company: r.company.companyName,
      domain: r.resolution.resolvedUrl,
      signatureMatched: r.botBlock.signatureMatched || 'Bot Signature',
      attempts: 1,
    })),
    recommendedNextSteps: {
      manualWebsiteResearch: reports.filter(r => r.resolution.hasConflict || !r.resolution.resolvedUrl).map(r => r.company.companyName),
      noEmailFound: reports.filter(r => r.emailDiscovery.overallStatus !== 'Verified').map(r => r.company.companyName),
      unresolvedConflicts: reports.filter(r => r.resolution.hasConflict).map(r => `${r.company.companyName} (${r.resolution.selfSearchUrl} vs ${r.resolution.readymadeUrl})`),
      infraIssues: [],
    },
  };

  const runReportPath = generateRunReport(stats, baseOutputDir);
  console.log(`\n===============================================================`);
  console.log(`✅ Run Completed in ${durationSeconds}s!`);
  console.log(`Master Tracker: ${path.join(baseOutputDir, 'Simple_Accessibility_Outreach_Tracker.xlsx')}`);
  console.log(`Run Report Generated: ${runReportPath}`);
  console.log(`===============================================================\n`);

  return reports;
}

function generateRunFolderName(inputPath: string, outputsBaseDir: string): string {
  const datasetRaw = inputPath ? path.basename(inputPath, path.extname(inputPath)) : 'Dataset';
  const datasetName = datasetRaw
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_Enriched$/i, '');

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');

  const dateStr = `${year}${month}${day}`;
  const timeStr = `${hours}${mins}${secs}`;

  let attemptCount = 1;
  if (fs.existsSync(outputsBaseDir)) {
    try {
      const existing = fs.readdirSync(outputsBaseDir);
      const prefix = `v1.1_${datasetName}_${dateStr}_`;
      const matches = existing.filter(f => f.startsWith(prefix) || (f.includes(datasetName) && f.includes(dateStr)));
      attemptCount = matches.length + 1;
    } catch {}
  }

  return `v1.1_${datasetName}_${dateStr}_${timeStr}_attempt${attemptCount}_succesful_reviewnotdone_orchavatecore`;
}

// CLI Execution Block
async function main() {
  const cliArgs = process.argv.slice(2);
  const cliConfig = parseCliConfig(cliArgs);
  const config: AppConfig = { ...defaultConfig, ...cliConfig };

  let inputPath = '';
  const inputIdx = cliArgs.indexOf('--input');
  if (inputIdx !== -1) {
    const valueTokens: string[] = [];
    for (let k = inputIdx + 1; k < cliArgs.length; k++) {
      if (cliArgs[k].startsWith('--') || cliArgs[k].startsWith('-')) break;
      valueTokens.push(cliArgs[k]);
    }
    inputPath = valueTokens.join(' ').replace(/^['"]|['"]$/g, '');
  }

  if (!inputPath) {
    const possibleFiles = ['Registered_Mutual_Funds_Enriched.xlsx', 'Registered Mutual Funds as on Jul 31 2026.xls', 'targets.json', 'targets.xlsx', 'targets.csv'];
    for (const pf of possibleFiles) {
      const fullP = path.join(process.cwd(), pf);
      if (fs.existsSync(fullP)) {
        inputPath = fullP;
        break;
      }
    }
  }

  // Interactive Startup Menu if no explicit mode passed and non-interactive not set
  if (!cliArgs.includes('--mode') && !config.nonInteractive && process.stdin.isTTY) {
    const menuResult = await renderStartupMenu(config);
    config.searchMode = menuResult.mode;
    if (menuResult.readymadeFilePath) {
      config.readymadeFilePath = menuResult.readymadeFilePath;
    }
  }

  let targetsToAudit: CompanyInput[] = [];
  if (inputPath && fs.existsSync(inputPath)) {
    targetsToAudit = parseInputFile(inputPath);
  } else {
    console.warn('\n⚠️ WARNING: No input file provided or found. Running dummy test data...\n');
    targetsToAudit = [
      {
        srNo: 1,
        companyName: 'SEBI Official',
        readymadeWebsite: 'https://www.sebi.gov.in',
        contactPerson: 'Compliance Officer',
        emailId: 'sebi@sebi.gov.in',
        assignedTo: 'Auditor 1',
      },
      {
        srNo: 2,
        companyName: 'Example Corp',
        readymadeWebsite: 'https://example.com',
        contactPerson: 'Admin',
        emailId: 'info@example.com',
        assignedTo: 'Auditor 1',
      }
    ];
  }

  let readymadeMap: Record<string, string> = {};
  if (config.readymadeFilePath && fs.existsSync(config.readymadeFilePath)) {
    readymadeMap = parseReadymadeFile(config.readymadeFilePath);
    console.log(`\n📁 Loaded ${Object.keys(readymadeMap).length} readymade website fallback URLs from "${config.readymadeFilePath}"`);
  }

  const outputsBaseDir = path.join(process.cwd(), 'orchavate_gtm_workflow', 'outputs');
  const runFolderName = generateRunFolderName(inputPath, outputsBaseDir);
  const runOutputDir = path.join(outputsBaseDir, runFolderName);

  await runWorkflowV11(targetsToAudit, runOutputDir, readymadeMap, config);
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('cli.ts') || process.argv[1].endsWith('cli.js')) {
  main().catch(err => {
    console.error('v1.1 Audit Execution Error:', err);
    process.exit(1);
  });
}