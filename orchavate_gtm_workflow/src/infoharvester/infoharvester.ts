#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { runInfoHarvesterSingle, runInfoHarvesterBatch } from './batch_writer.js';

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

async function ensureZyteApiKey(): Promise<string> {
  const existingKey = process.env.ZYTE_API_KEY || process.env.ZYTE_KEY;
  if (existingKey) {
    process.env.ZYTE_API_KEY = existingKey;
    return existingKey;
  }

  if (!process.stdin.isTTY) {
    return '';
  }

  console.log(`\n=====================================================`);
  console.log(`🔑 Zyte API Key Required`);
  console.log(`=====================================================\n`);
  console.log(`InfoHarvester uses Zyte for search and page extraction.`);
  console.log(`Enter your Zyte API Key to proceed (will be saved to .env).\n`);

  const enteredKey = (await promptUser(`Enter Zyte API Key: `)).replace(/^['"]|['"]$/g, '');
  if (!enteredKey) {
    console.warn(`\n⚠️ Warning: No Zyte API Key supplied. InfoHarvester will not be able to query Zyte.\n`);
    return '';
  }

  process.env.ZYTE_API_KEY = enteredKey;
  try {
    const envPath = '.env';
    const existingEnv = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    if (!existingEnv.includes('ZYTE_API_KEY=')) {
      fs.appendFileSync(envPath, `\nZYTE_API_KEY=${enteredKey}\n`, 'utf8');
      console.log(`✓ Saved Zyte API Key securely to .env file.`);
    }
  } catch {
    // Ignore .env persistence failures.
  }

  return enteredKey;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] ? args[0].toLowerCase() : '';

  const zyteKeyIdx = args.indexOf('--zyte-key');
  if (zyteKeyIdx !== -1 && args[zyteKeyIdx + 1]) {
    process.env.ZYTE_API_KEY = args[zyteKeyIdx + 1].trim().replace(/^['"]|['"]$/g, '');
  }

  await ensureZyteApiKey();

  if (command === 'run') {
    let company = '';
    let domain = '';

    const companyIdx = args.indexOf('--company');
    if (companyIdx !== -1 && args[companyIdx + 1]) {
      company = args[companyIdx + 1].trim().replace(/^['"]|['"]$/g, '');
    }

    const domainIdx = args.indexOf('--domain');
    if (domainIdx !== -1 && args[domainIdx + 1]) {
      domain = args[domainIdx + 1].trim().replace(/^['"]|['"]$/g, '');
    }

    if (!company) {
      console.error('❌ Error: --company is required for "infoharvester run"');
      console.log('Usage: infoharvester run --company "20 Microns Limited" --domain "20microns.com"');
      process.exit(1);
    }

    console.log(`\n=====================================================`);
    console.log(`🚀 InfoHarvester Standalone Run`);
    console.log(`🏢 Company: "${company}"`);
    console.log(`🌐 Domain: "${domain || 'N/A'}"`);
    console.log(`=====================================================\n`);

    const result = await runInfoHarvesterSingle(company, domain);

    console.log(`\n=====================================================`);
    console.log(`📊 InfoHarvester Result:`);
    console.log(JSON.stringify(result, null, 2));
    console.log(`=====================================================\n`);
    return;
  }

  if (command === 'batch') {
    let inputPath = '';
    let outputPath = '';

    const inputIdx = args.indexOf('--input');
    if (inputIdx !== -1 && args[inputIdx + 1]) {
      inputPath = args[inputIdx + 1].trim().replace(/^['"]|['"]$/g, '');
    }

    const outputIdx = args.indexOf('--output');
    if (outputIdx !== -1 && args[outputIdx + 1]) {
      outputPath = args[outputIdx + 1].trim().replace(/^['"]|['"]$/g, '');
    }

    if (!inputPath) {
      const possibleInputs = [
        'v1.3_Master_Outreach_Tracker_561_Companies.xlsx',
        'Simple_Accessibility_Outreach_Tracker_v13_SemiFinal.xlsx',
        'tracker.xlsx',
        'tracker.csv'
      ];
      for (const p of possibleInputs) {
        if (fs.existsSync(path.join(process.cwd(), p))) {
          inputPath = path.join(process.cwd(), p);
          break;
        }
      }
    }

    if (!inputPath) {
      console.error('❌ Error: --input file is required for "infoharvester batch"');
      console.log('Usage: infoharvester batch --input tracker.xlsx --output tracker.xlsx');
      process.exit(1);
    }

    if (!outputPath) {
      outputPath = inputPath;
    }

    await runInfoHarvesterBatch(inputPath, outputPath);
    return;
  }

  console.log(`
=====================================================
InfoHarvester CLI — Zyte-Only SEBI POC Harvester
=====================================================

Primary use case:
  Fill the six contact columns for SEBI accessibility outreach tracking:
  Contact Person 1, Designation 1, Email ID 1, Contact Person 2, Designation 2, Email ID 2

Best-fit POCs searched in order:
  Accessibility Nodal Officer, Legal, Compliance, CEO, Founder

Commands:
  run   Run single company POC harvest
        $ infoharvester run --company "20 Microns Limited" --domain "20microns.com"

  batch Run batch enrichment on Master Accessibility Outreach Tracker (writes 6 target columns)
        $ infoharvester batch --input tracker.xlsx --output tracker.xlsx
`);
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('infoharvester.ts') || process.argv[1].endsWith('infoharvester.js')) {
  main().catch(err => {
    console.error('InfoHarvester Execution Error:', err);
    process.exit(1);
  });
}
