import readline from 'readline';
import fs from 'fs';
import { AppConfig, SearchMode } from '../config/config.ts';
import { CircuitBreakerStats } from '../circuit_breaker/circuit_breaker.ts';

export interface StartupMenuResult {
  mode: SearchMode;
  readymadeFilePath?: string;
  inputFilePath?: string;
}

export type CircuitBreakerAction = 'RESUME' | 'SWITCH_READYMADE' | 'RETRY' | 'ABORT';

function promptUser(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Prompt for the input file path (Excel/JSON with company list).
 * Returns the validated file path or empty string if skipped.
 */
export async function promptForInputFile(): Promise<string> {
  console.log(`\n=====================================================`);
  console.log(`Input File Selection`);
  console.log(`=====================================================\n`);
  console.log(`Please provide the input file containing company names.`);
  console.log(`Supported formats: .xlsx, .xls, .json\n`);

  const filePath = (await promptUser(`Enter file path (or press Enter to skip): `)).replace(/^['"]|['"]$/g, '');

  if (!filePath) {
    console.warn(`\n⚠️ No file path provided. Will use dummy test data.\n`);
    return '';
  }

  if (!fs.existsSync(filePath)) {
    console.warn(`\n⚠️ File not found at "${filePath}". Will use dummy test data.\n`);
    return '';
  }

  console.log(`\n✓ Input file found: "${filePath}"\n`);
  return filePath;
}

export async function renderStartupMenu(config: AppConfig): Promise<StartupMenuResult> {
  // If non-interactive mode or explicitly passed mode via CLI, bypass interactive menu
  if (config.nonInteractive || process.env.NON_INTERACTIVE === 'true') {
    return {
      mode: config.searchMode,
      readymadeFilePath: config.readymadeFilePath,
    };
  }

  console.log(`\n=====================================================`);
  console.log(`Accessibility Outreach Tool — Input Mode Selection`);
  console.log(`=====================================================\n`);
  console.log(`Select Website Input Mode:\n`);
  console.log(`  Press 1 : Automated Website Search (Internet Discovery)`);
  console.log(`  Press 2 : Readymade Website List (Excel / CSV Mapping)\n`);

  const choice = await promptUser(`Enter selection (Press 1 or 2): `);

  if (choice === '2') {
    console.log(`\nPlease provide website mapping file.`);
    console.log(`Supported formats: .xlsx, .csv\n`);

    let filePath = await promptUser(`File path: `);
    filePath = filePath.replace(/^['"]|['"]$/g, ''); // strip surrounding quotes

    if (filePath && fs.existsSync(filePath)) {
      return {
        mode: 'READYMADE',
        readymadeFilePath: filePath,
      };
    } else {
      console.warn(`\n⚠️ File not found at "${filePath}". Defaulting to Automated Website Search.\n`);
      return { mode: 'AUTOMATED_SEARCH' };
    }
  }

  return { mode: 'AUTOMATED_SEARCH' };
}

export async function renderCircuitBreakerMenu(stats: CircuitBreakerStats): Promise<CircuitBreakerAction> {
  console.log(`\n======================================`);
  console.log(`CIRCUIT BREAKER ACTIVATED`);
  console.log(`======================================`);
  console.log(`Processed: ${stats.totalProcessed}`);
  console.log(`Failures: ${stats.failureCount}`);
  console.log(`Failure Rate: ${stats.failureRatePercent}%\n`);
  console.log(`Continue?`);
  console.log(`1 Resume`);
  console.log(`2 Switch to Readymade Mode`);
  console.log(`3 Retry Search`);
  console.log(`4 Abort`);
  console.log(`======================================\n`);

  const choice = await promptUser(`Select option (1/2/3/4) [default 1]: `);

  switch (choice) {
    case '2':
      return 'SWITCH_READYMADE';
    case '3':
      return 'RETRY';
    case '4':
      return 'ABORT';
    case '1':
    default:
      return 'RESUME';
  }
}
