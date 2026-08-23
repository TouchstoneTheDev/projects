import fs from 'node:fs/promises';
import path from 'node:path';
import { log } from '../core/logger/index.js';
import { config } from '../core/config/index.js';
import { verifyWebsite } from '../modules/website/index.js';
import { runAccessibilityScan } from '../modules/accessibility/index.js';
import { createSafeFilename } from '../utils/file.js';
import { loadTrackerFile, updateTracker } from '../modules/tracker/index.js';
import { generateReportJson, generateReportMarkdown, generateReportHtml, } from '../modules/reports/index.js';
import summarizeWithClaude from '../modules/ai/claude.js';
import { generateWaveChecklist } from '../modules/wave/index.js';
export const runWorkflow = async (trackerPath) => {
    log.info({ module: 'workflow', trackerPath }, 'Starting scan workflow');
    const companies = await loadTrackerFile(trackerPath);
    for (const company of companies) {
        const safeName = createSafeFilename(company.companyName || company.websiteUrl);
        const verification = await verifyWebsite(company);
        const scan = verification.verified
            ? await runAccessibilityScan(company.companyName, company.websiteUrl)
            : {
                companyName: company.companyName,
                websiteUrl: company.websiteUrl,
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
        // Optionally call Claude/Anthropic if an API key is configured.
        const apiKey = process.env.ANTHROPIC_API_KEY ?? process.env.CLAUDE_API_KEY;
        let executiveSummary;
        if (apiKey) {
            try {
                executiveSummary = await summarizeWithClaude(markdownReport);
            }
            catch (err) {
                log.warn({ module: 'workflow', err }, 'Failed to generate executive summary with Claude');
            }
        }
        else {
            log.debug({ module: 'workflow' }, 'No Claude/Anthropic API key found; skipping summary');
        }
        // Generate WAVE manual checklist (always generated to assist manual checks)
        let waveChecklistPath;
        try {
            waveChecklistPath = await generateWaveChecklist(company.companyName, company.websiteUrl);
        }
        catch (err) {
            log.warn({ module: 'workflow', err }, 'Failed to generate WAVE checklist');
        }
        // Merge executive summary and wave checklist into JSON report object if available
        try {
            const obj = JSON.parse(jsonReport);
            if (executiveSummary)
                obj.executiveSummary = executiveSummary;
            if (waveChecklistPath)
                obj.waveChecklist = waveChecklistPath;
            await fs.writeFile(path.join(reportDir, `${safeName}.json`), JSON.stringify(obj, null, 2), 'utf8');
        }
        catch (err) {
            // fallback: write raw jsonReport
            await fs.writeFile(path.join(reportDir, `${safeName}.json`), jsonReport, 'utf8');
        }
        await fs.writeFile(path.join(reportDir, `${safeName}.md`), markdownReport, 'utf8');
        await fs.writeFile(path.join(htmlDir, `${safeName}.html`), htmlReport, 'utf8');
        // Save executive summary as a plain text file for easy review
        if (executiveSummary) {
            await fs.writeFile(path.join(reportDir, `${safeName}.summary.txt`), executiveSummary, 'utf8');
        }
        await updateTracker(company.companyName, {
            status: scan.status,
            accessibilityScore: scan.accessibilityScore?.toString() ?? '',
            remarks: scan.remarks ?? '',
        });
        log.info({ module: 'workflow', company: company.companyName, status: scan.status }, 'Completed company scan');
    }
    log.info({ module: 'workflow' }, 'Scan workflow finished');
};
//# sourceMappingURL=workflow.js.map