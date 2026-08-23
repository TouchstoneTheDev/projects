import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { chromium } from 'playwright';
import { CompanyTarget, CompanyAuditReport, PageAuditResult } from './types';
import { verifyAndDiscoverPages } from './discovery';
import { auditPageWithAxe } from './auditor';
import { captureViolationScreenshots } from './screenshot';
import { exportTrackerFiles } from './tracker';

export function parseInputFile(filePath: string): CompanyTarget[] {
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
        assignedTo: getVal('assigned to', 'assigned') || 'Unassigned',
        companyName: getVal('company name', 'company', 'name') || 'Unknown',
        website: getVal('website', 'url', 'company website') || '',
        contactPerson: getVal('contact person', 'contact') || 'N/A',
        emailId: getVal('email id', 'email', 'emailid') || 'N/A',
        verifiedBy: getVal('verified by', 'verified') || 'Orchavate Automated Tool',
      };
    });
  } else if (ext === '.json') {
    const content = fs.readFileSync(filePath, 'utf8');
    const raw = JSON.parse(content);
    return raw.map((item: any, index: number) => ({
      srNo: item.srNo || index + 1,
      assignedTo: item.assignedTo || 'Unassigned',
      companyName: item.companyName || item.name || 'Unknown',
      website: item.website || item.url || '',
      contactPerson: item.contactPerson || 'N/A',
      emailId: item.emailId || item.email || 'N/A',
      verifiedBy: item.verifiedBy || 'Orchavate Automated Tool',
    }));
  } else if (ext === '.csv') {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
    const targets: CompanyTarget[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
      if (cols.length < 2) continue;
      
      const getVal = (name: string) => {
        const idx = headers.indexOf(name);
        return idx !== -1 ? cols[idx] : '';
      };

      targets.push({
        srNo: parseInt(getVal('sr. no.') || getVal('srno') || String(i), 10),
        assignedTo: getVal('assigned to') || 'Unassigned',
        companyName: getVal('company name') || getVal('company') || cols[0] || 'Unknown',
        website: getVal('website') || getVal('url') || cols[1] || '',
        contactPerson: getVal('contact person') || 'N/A',
        emailId: getVal('email id') || getVal('email') || 'N/A',
        verifiedBy: getVal('verified by') || 'Orchavate Automated Tool',
      });
    }
    return targets;
  }
  throw new Error(`Unsupported input file format: ${filePath}. Please provide a .xlsx, .xls, .csv, or .json file.`);
}

export async function runWorkflow(
  inputCompanies: CompanyTarget[],
  baseOutputDir: string
): Promise<CompanyAuditReport[]> {
  const notFoundDir = path.join(baseOutputDir, 'searched_not_found');
  const scansDir = path.join(baseOutputDir, 'scans');
  const screenshotsDir = path.join(baseOutputDir, 'screenshots');
  const trackerDir = path.join(baseOutputDir, 'tracker');

  [notFoundDir, scansDir, screenshotsDir, trackerDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const reports: CompanyAuditReport[] = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  console.log(`Starting Orchavate Accessibility Audit Workflow for ${inputCompanies.length} target websites...`);

  for (const company of inputCompanies) {
    console.log(`\n[Processing Provided Website] Sr. ${company.srNo}: ${company.companyName} (${company.website})`);

    const discovery = await verifyAndDiscoverPages(page, company, notFoundDir);

    if (!discovery.verified) {
      console.log(`  ❌ Provided website is unreachable/inaccessible: ${discovery.errorMessage}`);
      const failedReport: CompanyAuditReport = {
        company,
        websiteVerified: false,
        scanCompleted: false,
        screenshotTaken: false,
        status: 'Inaccessible',
        pages: [],
        totalViolations: 0,
        altTextViolations: 0,
        contrastViolations: 0,
        labelViolations: 0,
        keyboardViolations: 0,
        lighthouseAvgScore: 0,
        remarks: `Unreachable: ${discovery.errorMessage}`,
        timestamp: new Date().toISOString(),
      };
      reports.push(failedReport);
      continue;
    }

    console.log(`  ✓ Website Verified: "${discovery.title}"`);
    if (discovery.extractedEmails.length > 0 && (!company.emailId || company.emailId === 'N/A')) {
      company.emailId = discovery.extractedEmails.join('; ');
      console.log(`  ✓ Gathered Contacts: ${company.emailId}`);
    }

    const pagesToScan: Array<{ name: any; url: string }> = [];
    pagesToScan.push({ name: 'Homepage', url: discovery.pages.homepage });
    if (discovery.pages.about) pagesToScan.push({ name: 'About', url: discovery.pages.about });
    if (discovery.pages.contact) pagesToScan.push({ name: 'Contact', url: discovery.pages.contact });
    if (discovery.pages.investorRelations) pagesToScan.push({ name: 'Investor Relations', url: discovery.pages.investorRelations });

    const pageResults: PageAuditResult[] = [];
    let totalScreenshots = 0;

    for (const p of pagesToScan) {
      console.log(`  -> Scanning target page: ${p.name} (${p.url})`);
      const pageResult = await auditPageWithAxe(page, p.name, p.url);

      const capturedScreenshots = await captureViolationScreenshots(
        page,
        company.companyName,
        p.name,
        pageResult.axeViolations,
        screenshotsDir
      );
      pageResult.screenshots = capturedScreenshots;
      totalScreenshots += capturedScreenshots.length;
      pageResults.push(pageResult);
    }

    const allViolations = pageResults.flatMap(r => r.axeViolations);
    const altTextCount = allViolations.filter(v => v.category === 'missing_alt_text').length;
    const contrastCount = allViolations.filter(v => v.category === 'color_contrast').length;
    const labelCount = allViolations.filter(v => v.category === 'form_labels').length;
    const keyboardCount = allViolations.filter(v => v.category === 'keyboard_navigation').length;

    const avgLighthouse = pageResults.length > 0
      ? Math.round(pageResults.reduce((acc, cur) => acc + cur.lighthouseScore, 0) / pageResults.length)
      : 0;

    const report: CompanyAuditReport = {
      company,
      websiteVerified: true,
      scanCompleted: true,
      screenshotTaken: totalScreenshots > 0,
      status: 'Completed',
      pages: pageResults,
      totalViolations: allViolations.length,
      altTextViolations: altTextCount,
      contrastViolations: contrastCount,
      labelViolations: labelCount,
      keyboardViolations: keyboardCount,
      lighthouseAvgScore: avgLighthouse,
      remarks: `Scanned ${pageResults.length} pages. Violations: ${allViolations.length}. Lighthouse: ${avgLighthouse}/100.`,
      timestamp: new Date().toISOString(),
    };

    const safeName = company.companyName.replace(/[^a-zA-Z0-9]/g, '_');
    fs.writeFileSync(
      path.join(scansDir, `${safeName}_audit.json`),
      JSON.stringify(report, null, 2),
      'utf8'
    );

    reports.push(report);
    console.log(`  ✓ Audit Complete: ${allViolations.length} WCAG violations across ${pageResults.length} pages. Screenshots captured: ${totalScreenshots}`);
  }

  await browser.close();

  exportTrackerFiles(reports, trackerDir);
  console.log(`\n✅ Master Tracker updated in ${trackerDir} (Excel .xlsx & .csv)`);

  return reports;
}

// Main CLI Execution
const args = process.argv.slice(2);
let inputPath = '';
const inputIdx = args.indexOf('--input');

if (inputIdx !== -1 && args[inputIdx + 1]) {
  inputPath = args[inputIdx + 1];
} else {
  const possibleFiles = ['targets.xlsx', 'targets.xls', 'targets.json', 'targets.csv'];
  for (const pf of possibleFiles) {
    const fullP = path.join(process.cwd(), 'orchavate_gtm_workflow', pf);
    if (fs.existsSync(fullP)) {
      inputPath = fullP;
      break;
    }
  }
}

let targetsToAudit: CompanyTarget[] = [];

if (inputPath && fs.existsSync(inputPath)) {
  console.log(`Loading target websites from file: ${inputPath}`);
  targetsToAudit = parseInputFile(inputPath);
} else {
  targetsToAudit = [
    {
      srNo: 1,
      assignedTo: 'Auditor 1',
      companyName: 'SEBI Official',
      website: 'https://www.sebi.gov.in',
      contactPerson: 'Compliance Officer',
      emailId: 'sebi@sebi.gov.in',
      verifiedBy: 'Orchavate Automated Tool',
    }
  ];
}

const outputDir = path.join(process.cwd(), 'orchavate_gtm_workflow', 'outputs');
runWorkflow(targetsToAudit, outputDir)
  .then(() => console.log('Audit workflow finished successfully.'))
  .catch((err) => console.error('Audit workflow error:', err));
