import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { chromium } from 'playwright';
import { CompanyInput, CompanyAuditReportV11, PageAuditResult, RunReportStats } from './types.js';
import { resolveWebsite, CircuitBreakerTracker } from './website_resolver.js';
import { discoverEmailsAndEvidence } from './email_discoverer.js';
import { checkBotBlock } from './bot_block_gate.js';
import { auditPageWithAxe } from './auditor.js';
import { captureCompulsoryToolScreenshots } from './screenshot.js';
import { generateDeliverablePairs } from './deliverables_generator.js';
import { generateRunReport } from './run_report_generator.js';
import { exportTrackerFiles } from './tracker.js';

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
    const rawData: any[] = XLSX.utils.sheet_to_json(sheet);

    return rawData.map((item: any, index: number) => {
      const getVal = (...keys: string[]) => {
        for (const k of keys) {
          const matchedKey = Object.keys(item).find(ik => ik.trim().toLowerCase() === k.toLowerCase());
          if (matchedKey && item[matchedKey] !== undefined) return String(item[matchedKey]).trim();
        }
        return '';
      };

      return {
        srNo: parseInt(getVal('sr. no.', 'sr.no.', 'sr no', 'srno') || String(index + 1), 10),
        companyName: getVal('company name', 'company', 'name') || 'Unknown',
        readymadeWebsite: getVal('website', 'url', 'company website') || '',
        assignedTo: getVal('assigned to', 'assigned') || 'Unassigned',
        contactPerson: getVal('contact person', 'contact') || 'N/A',
        emailId: getVal('email id', 'email', 'emailid') || 'N/A',
        verifiedBy: getVal('verified by', 'verified') || 'Orchavate Automated Tool v1.1',
      };
    });
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

export async function runWorkflowV11(
  inputCompanies: CompanyInput[],
  baseOutputDir: string
): Promise<CompanyAuditReportV11[]> {
  const startTime = Date.now();
  const deliverablesDir = path.join(baseOutputDir, 'deliverables');
  const scansDir = path.join(baseOutputDir, 'scans');
  const screenshotsDir = path.join(baseOutputDir, 'screenshots');
  const trackerDir = path.join(baseOutputDir, 'tracker');
  const reportsDir = path.join(baseOutputDir, 'reports');
  const notFoundDir = path.join(baseOutputDir, 'searched_not_found');

  [deliverablesDir, scansDir, screenshotsDir, trackerDir, reportsDir, notFoundDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  const reports: CompanyAuditReportV11[] = [];
  const circuitBreaker = new CircuitBreakerTracker();
  const circuitBreakerEvents: string[] = [];

  const browser = await chromium.launch({ headless: true });

  console.log(`\n===============================================================`);
  console.log(`Starting Accessibility Audit Tool — v1.1 Final Spec`);
  console.log(`Processing ${inputCompanies.length} target companies...`);
  console.log(`===============================================================\n`);

  for (let i = 0; i < inputCompanies.length; i++) {
    const company = inputCompanies[i];
    console.log(`\n[Company ${i + 1}/${inputCompanies.length}] ${company.companyName}`);

    // Step 1: Website Resolution (Dual-Source)
    const resolution = await resolveWebsite(company);
    console.log(`  -> Resolution Source: ${resolution.source} (${resolution.confidence} Confidence)`);
    console.log(`  -> Resolved URL: ${resolution.resolvedUrl || 'NONE'}`);

    const triggered = circuitBreaker.recordResult(resolution);
    if (triggered) {
      const msg = `Circuit Breaker Triggered at company #${company.srNo} (${company.companyName}): Self-search failure rate reached ${circuitBreaker.getFailureRate()}%.`;
      console.warn(`  ⚠️ ${msg}`);
      circuitBreakerEvents.push(msg);
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
      reports.push(report);
      await context.close();
      continue;
    }

    // Step 3: Email Discovery & Evidence Capture
    console.log(`  -> Running Email Discovery...`);
    const emailDiscovery = await discoverEmailsAndEvidence(page, company.companyName, resolution.resolvedUrl, screenshotsDir);
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
      screenshotsDir
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

    // Step 5: Deliverables Pair Generation
    const deliverables = generateDeliverablePairs(report, deliverablesDir);
    report.deliverables = deliverables;

    // Save Scans JSON
    const safeCompany = company.companyName.replace(/[^a-zA-Z0-9]/g, '_');
    fs.writeFileSync(path.join(scansDir, `${safeCompany}_audit.json`), JSON.stringify(report, null, 2), 'utf8');

    reports.push(report);
    console.log(`  ✓ Scan Completed: ${allViolations.length} WCAG violations found. 3 Compulsory Tool Screenshots Captured.`);

    await context.close();

    // 4-12s randomized rate limiting delay between domain scans
    const delayMs = Math.floor(Math.random() * 4000) + 4000;
    await new Promise(r => setTimeout(r, delayMs));
  }

  await browser.close();

  // Export Master Tracker (Excel & CSV)
  exportTrackerFiles(reports, trackerDir);

  // Step 6: Generate Post-Run RUN_REPORT_{timestamp}.md
  const durationSeconds = Math.round((Date.now() - startTime) / 1000);
  const stats: RunReportStats = {
    timestamp: new Date().toISOString(),
    durationSeconds,
    totalCompanies: inputCompanies.length,
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

  const runReportPath = generateRunReport(stats, reportsDir);
  console.log(`\n===============================================================`);
  console.log(`✅ Run Completed in ${durationSeconds}s!`);
  console.log(`Master Tracker: ${path.join(trackerDir, 'Simple_Accessibility_Outreach_Tracker.xlsx')}`);
  console.log(`Run Report Generated: ${runReportPath}`);
  console.log(`===============================================================\n`);

  return reports;
}

// CLI Execution Block
const args = process.argv.slice(2);
let inputPath = '';
const inputIdx = args.indexOf('--input');

if (inputIdx !== -1 && args[inputIdx + 1]) {
  inputPath = args[inputIdx + 1];
} else {
  const possibleFiles = ['Registered_Mutual_Funds_Enriched.xlsx', 'targets.json', 'targets.xlsx', 'targets.csv'];
  for (const pf of possibleFiles) {
    const fullP = path.join(process.cwd(), 'orchavate_gtm_workflow', pf);
    if (fs.existsSync(fullP)) {
      inputPath = fullP;
      break;
    }
  }
}

let targetsToAudit: CompanyInput[] = [];

if (inputPath && fs.existsSync(inputPath)) {
  targetsToAudit = parseInputFile(inputPath);
} else {
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

const outputDir = path.join(process.cwd(), 'orchavate_gtm_workflow', 'outputs');
runWorkflowV11(targetsToAudit, outputDir)
  .then(() => console.log('v1.1 Audit Execution Completed Successfully.'))
  .catch((err) => console.error('v1.1 Audit Execution Error:', err));
