import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { CompanyInput, CompanyAuditReportV11, RunReportStats } from '../types.js';
import { resolveWebsite } from '../website_resolver.js';
import { discoverEmailsAndEvidence } from '../email_discoverer.js';
import { checkBotBlock } from '../bot_block_gate.js';
import { auditPageWithAxe } from '../auditor.js';
import { captureCompulsoryToolScreenshots } from '../screenshots/compulsory_screenshots.js';
import { generateDeliverablePairs } from '../deliverables_generator.js';
import { generateRunReport } from '../run_report_generator.js';
import { exportTrackerFiles } from '../tracker.js';
import { defaultConfig, AppConfig, SearchMode } from '../config/config.js';
import { renderCircuitBreakerMenu } from '../ui/menu.js';
import { SearchCache } from '../cache/search_cache.js';
import { ResolutionLogger } from '../logger/logger.js';
import { CircuitBreaker } from '../circuit_breaker/circuit_breaker.js';

const DESKTOP_USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0'
];

export function generateRunFolderName(inputPath: string, outputsBaseDir: string): string {
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
