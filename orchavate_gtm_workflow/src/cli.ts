import fs from 'fs';
import path from 'path';
import { CompanyInput } from './types.js';
import { defaultConfig, parseCliConfig, AppConfig } from './config/config.js';
import { renderStartupMenu, promptForInputFile } from './ui/menu.js';
import { parseInputFile, parseReadymadeFile } from './parsers/input_parser.js';
import { runWorkflowV11, generateRunFolderName } from './workflow/audit_workflow.js';

export { parseInputFile, parseReadymadeFile } from './parsers/input_parser.js';
export { runWorkflowV11 } from './workflow/audit_workflow.js';

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

  // If no input file found yet, prompt the user interactively
  if (!inputPath && !config.nonInteractive && process.stdin.isTTY) {
    const promptedPath = await promptForInputFile();
    if (promptedPath) {
      inputPath = promptedPath;
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