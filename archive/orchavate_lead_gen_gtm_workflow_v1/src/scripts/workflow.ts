import fs from 'node:fs/promises';
import path from 'node:path';
import { log } from '../core/logger/index.js';
import { config } from '../core/config/index.js';
import { verifyWebsite } from '../modules/website/index.js';
import { runAccessibilityScan } from '../modules/accessibility/index.js';
import { createSafeFilename } from '../utils/file.js';
import { loadTrackerFile, updateTracker } from '../modules/tracker/index.js';
import {
  generateReportJson,
  generateReportMarkdown,
  generateReportHtml,
} from '../modules/reports/index.js';
import { CompanyRecord, ScanResult } from '../types/index.js';
import summarizeWithClaude from '../modules/ai/claude.js';
import { generateWaveChecklist } from '../modules/wave/index.js';
import { ensureWorkflowFolders, writeMasterResultCsv } from '../modules/output/index.js';
import { buildResultRow } from '../modules/reports/index.js';

const isLikelyWebsiteCandidate = (value: string): boolean => {
  if (!value) return false;
  const candidate = value.trim();
  return /^https?:\/\//i.test(candidate) && !/\.(pdf|jpg|jpeg|png|gif|zip|mp4|avi)$/i.test(candidate);
};

const probeWebsiteUrl = async (candidate: string): Promise<boolean> => {
  try {
    const response = await fetch(candidate, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    const contentType = response.headers.get('content-type') ?? '';
    if (response.ok && (contentType.includes('text/html') || contentType.includes('application/xhtml+xml'))) {
      return true;
    }

    if (response.ok && response.url) {
      const body = await response.text();
      return /<html|<title|<body/i.test(body);
    }

    return false;
  } catch {
    return false;
  }
};

const inferWebsiteFromEmail = async (emailId?: string): Promise<string | undefined> => {
  if (!emailId) return undefined;

  const domainMatch = emailId.match(/@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/i);
  if (!domainMatch) return undefined;

  const domain = domainMatch[1].trim().toLowerCase().replace(/^\.+|\.+$/g, '');
  if (!domain || !domain.includes('.')) return undefined;

  const candidates = [
    `https://www.${domain}`,
    `https://${domain}`,
    `http://www.${domain}`,
    `http://${domain}`,
  ];

  for (const candidate of candidates) {
    if (await probeWebsiteUrl(candidate)) {
      return candidate;
    }
  }

  return undefined;
};

const searchWebsiteForCompany = async (companyName: string, emailId?: string): Promise<string | undefined> => {
  const query = encodeURIComponent(`${companyName} official website${emailId ? ` site:${emailId.split('@')[1]}` : ''}`);
  const url = `https://duckduckgo.com/html/?q=${query}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'text/html',
      },
    });

    if (!response.ok) return undefined;

    const html = await response.text();
    const match = html.match(/https?:\/\/[^"'\s>]+/gi) ?? [];
    const candidate = match
      .map((item) => item.replace(/&amp;/g, '&').replace(/\/$/, ''))
      .find((item) => isLikelyWebsiteCandidate(item) && !/duckduckgo|google|bing|yahoo/i.test(item));

    return candidate;
  } catch (error) {
    log.warn({ module: 'workflow', companyName, err: error }, 'Website search lookup failed');
    return undefined;
  }
};

const hydrateCompanyRecord = async (company: CompanyRecord): Promise<CompanyRecord> => {
  if (company.websiteUrl && company.websiteUrl.startsWith('http')) {
    return company;
  }

  const fromEmail = await inferWebsiteFromEmail(company.emailId);
  if (fromEmail) {
    return {
      ...company,
      websiteUrl: fromEmail,
    };
  }

  const found = await searchWebsiteForCompany(company.companyName, company.emailId);
  return {
    ...company,
    websiteUrl: found ?? '',
  };
};

export const runWorkflow = async (trackerPath?: string): Promise<void> => {
  log.info({ module: 'workflow', trackerPath }, 'Starting scan workflow');
  await ensureWorkflowFolders();

  const companies = await loadTrackerFile(trackerPath);
  const resultRows = [] as ReturnType<typeof buildResultRow>[];

  for (const company of companies) {
    const hydratedCompany = await hydrateCompanyRecord(company);
    const safeName = createSafeFilename(hydratedCompany.companyName || hydratedCompany.websiteUrl || 'company');

    if (!hydratedCompany.websiteUrl) {
      const filePath = path.resolve(config.OUTPUT_DIR, 'website_not_found', `${safeName}.txt`);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, `Company: ${hydratedCompany.companyName}\nReason: no website discovered\n`, 'utf8');
      resultRows.push(
        buildResultRow({
          companyName: hydratedCompany.companyName,
          websiteUrl: '',
          websiteVerified: 'No',
          scanCompleted: 'No',
          screenshotTaken: 'No',
          status: 'website_not_found',
          remarks: 'No website discovered from public lookup',
        }),
      );
      continue;
    }

    const verification = await verifyWebsite(hydratedCompany);

    const scan: ScanResult = verification.verified
      ? await runAccessibilityScan(hydratedCompany.companyName, hydratedCompany.websiteUrl)
      : {
          companyName: hydratedCompany.companyName,
          websiteUrl: hydratedCompany.websiteUrl,
          status: 'skipped',
          remarks: verification.reasons?.join('; ') ?? 'Website verification failed',
        };

    const reportDir = path.resolve(config.OUTPUT_DIR, 'reports');
    const htmlDir = path.resolve(config.OUTPUT_DIR, 'html');
    await fs.mkdir(reportDir, { recursive: true });
    await fs.mkdir(htmlDir, { recursive: true });

    const jsonReport = await generateReportJson(scan);
    const markdownReport = await generateReportMarkdown(scan);
    const htmlReport = await generateReportHtml(scan);

    const apiKey = process.env.ANTHROPIC_API_KEY ?? process.env.CLAUDE_API_KEY;
    let executiveSummary: string | undefined;
    if (apiKey) {
      try {
        executiveSummary = await summarizeWithClaude(markdownReport);
      } catch (err) {
        log.warn({ module: 'workflow', err }, 'Failed to generate executive summary with Claude');
      }
    } else {
      log.debug({ module: 'workflow' }, 'No Claude/Anthropic API key found; skipping summary');
    }

    let waveChecklistPath: string | undefined;
    try {
      waveChecklistPath = await generateWaveChecklist(hydratedCompany.companyName, hydratedCompany.websiteUrl);
    } catch (err) {
      log.warn({ module: 'workflow', err }, 'Failed to generate WAVE checklist');
    }

    try {
      const obj = JSON.parse(jsonReport);
      if (executiveSummary) obj.executiveSummary = executiveSummary;
      if (waveChecklistPath) obj.waveChecklist = waveChecklistPath;
      await fs.writeFile(
        path.join(reportDir, `${safeName}.json`),
        JSON.stringify(obj, null, 2),
        'utf8',
      );
    } catch (err) {
      await fs.writeFile(path.join(reportDir, `${safeName}.json`), jsonReport, 'utf8');
    }

    await fs.writeFile(path.join(reportDir, `${safeName}.md`), markdownReport, 'utf8');
    await fs.writeFile(path.join(htmlDir, `${safeName}.html`), htmlReport, 'utf8');

    if (executiveSummary) {
      await fs.writeFile(path.join(reportDir, `${safeName}.summary.txt`), executiveSummary, 'utf8');
    }

    await updateTracker(
      hydratedCompany.companyName,
      {
        status: scan.status,
        accessibilityScore: scan.accessibilityScore?.toString() ?? '',
        remarks: scan.remarks ?? '',
      },
      trackerPath,
    );

    resultRows.push(
      buildResultRow({
        companyName: hydratedCompany.companyName,
        websiteUrl: hydratedCompany.websiteUrl,
        contactPerson: hydratedCompany.companyName,
        emailId: hydratedCompany.emailId ?? '',
        websiteVerified: verification.verified ? 'Yes' : 'No',
        scanCompleted: scan.status === 'success' ? 'Yes' : 'No',
        screenshotTaken: scan.screenshotFiles?.length ? 'Yes' : 'No',
        status: scan.status === 'success' ? 'Completed' : scan.status === 'failed' ? 'scan_failed' : 'skipped',
        verifiedBy: 'Automation',
        remarks: scan.remarks ?? verification.reasons?.join('; ') ?? '',
      }),
    );

    log.info(
      { module: 'workflow', company: hydratedCompany.companyName, status: scan.status },
      'Completed company scan',
    );
  }

  await writeMasterResultCsv(resultRows);
  log.info({ module: 'workflow' }, 'Scan workflow finished');
};
