import fs from 'fs';
import path from 'path';
import * as XLSX from '/workspaces/projects/node_modules/xlsx/xlsx.mjs';
import { findPOCsEnhanced } from './poc_harvester.js';
import { sortBySeverityPriority } from './severity.js';

// xlsx.mjs needs Node's fs injected in ESM mode before readFile()/writeFile() work.
XLSX.set_fs(fs as any);

export interface TrackerRow {
  'Sr. No.'?: number | string;
  'Assigned To'?: string;
  'Company Name': string;
  'Website'?: string;
  'Website Verified'?: string;
  'Scan Completed'?: string;
  'Screenshot Taken'?: string;
  'Wave Score'?: number | string;
  'Axe Score'?: number | string;
  'LH Score'?: number | string;
  'Screenshot link'?: string;
  'Contact Person 1'?: string;
  'Designation 1'?: string;
  'Email ID 1'?: string;
  'Contact Person 2'?: string;
  'Designation 2'?: string;
  'Email ID 2'?: string;
}

export const EXACT_17_HEADERS = [
  'Sr. No.',
  'Assigned To',
  'Company Name',
  'Website',
  'Website Verified',
  'Scan Completed',
  'Screenshot Taken',
  'Wave Score',
  'Axe Score',
  'LH Score',
  'Screenshot link',
  'Contact Person 1',
  'Designation 1',
  'Email ID 1',
  'Contact Person 2',
  'Designation 2',
  'Email ID 2'
];

const TARGET_HEADERS = [
  'Contact Person 1',
  'Designation 1',
  'Email ID 1',
  'Contact Person 2',
  'Designation 2',
  'Email ID 2'
];

function normalizeHeader(value: any): string {
  return String(value ?? '').trim();
}

function buildOutputHeaders(originalHeaders: string[]): string[] {
  const seen = new Set<string>();
  const headers: string[] = [];

  for (const header of originalHeaders) {
    const cleanHeader = normalizeHeader(header);
    if (!cleanHeader || seen.has(cleanHeader)) continue;
    seen.add(cleanHeader);
    headers.push(cleanHeader);
  }

  for (const header of TARGET_HEADERS) {
    if (!seen.has(header)) {
      seen.add(header);
      headers.push(header);
    }
  }

  return headers;
}

function readTrackerRows(inputPath: string): { rows: TrackerRow[]; headers: string[] } {
  const ext = path.extname(inputPath).toLowerCase();

  if (ext === '.csv') {
    const csvContent = fs.readFileSync(inputPath, 'utf8');
    const workbook = XLSX.read(csvContent, { type: 'string' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) {
      return { rows: [], headers: [] };
    }

    const headerMatrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as any[][];
    const headers = (headerMatrix[0] || []).map(normalizeHeader);
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as TrackerRow[];

    return { rows, headers };
  }

  const workbook = XLSX.readFile(inputPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) {
    return { rows: [], headers: [] };
  }

  const headerMatrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as any[][];
  const headers = (headerMatrix[0] || []).map(normalizeHeader);
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as TrackerRow[];

  return { rows, headers };
}

function writeTrackerRows(outputPath: string, rows: TrackerRow[], headers: string[]): void {
  const outputHeaders = buildOutputHeaders(headers.length > 0 ? headers : EXACT_17_HEADERS);
  const worksheet = XLSX.utils.json_to_sheet(rows as any[], { header: outputHeaders });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Outreach Tracker');

  if (outputPath.toLowerCase().endsWith('.csv')) {
    const csvLines: string[] = [outputHeaders.join(',')];
    for (const row of rows) {
      const values = outputHeaders.map(h => `"${String((row as any)[h] ?? '').replace(/"/g, '""')}"`);
      csvLines.push(values.join(','));
    }
    fs.writeFileSync(outputPath, csvLines.join('\n'), 'utf8');
    return;
  }

  XLSX.writeFile(workbook, outputPath);
}

export async function runInfoHarvesterSingle(companyName: string, websiteUrl: string = '') {
  const domain = websiteUrl ? websiteUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : '';
  const result = await findPOCsEnhanced(companyName, domain);
  const pocs = result.pocs;

  return {
    'Contact Person 1': pocs[0]?.name ?? 'Not Found',
    'Designation 1': pocs[0]?.designation ?? '',
    'Email ID 1': pocs[0]?.email ?? 'Not publicly disclosed',
    'Contact Person 2': pocs[1]?.name ?? 'Not Found',
    'Designation 2': pocs[1]?.designation ?? '',
    'Email ID 2': pocs[1]?.email ?? 'Not publicly disclosed',
    'EvidenceRecord': result.evidence
  };
}

export async function runInfoHarvesterBatch(inputPath: string, outputPath: string = inputPath): Promise<string> {
  console.log(`\n=====================================================`);
  console.log(`🚀 InfoHarvester — Enhanced 12-Step Batch Lead Enricher`);
  console.log(`📁 Input File: "${inputPath}"`);
  console.log(`📁 Output File: "${outputPath}"`);
  console.log(`=====================================================\n`);

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found at "${inputPath}"`);
  }

  const { rows, headers } = readTrackerRows(inputPath);

  console.log(`✓ Loaded ${rows.length} total rows from input file.`);

  const pendingIndices = rows
    .map((row, index) => ({ row, index }))
    .filter(item => String(item.row['Company Name'] || '').trim().length > 0);

  console.log(`🎯 Found ${pendingIndices.length} rows scheduled for InfoHarvester overwrite.`);

  // Sort queue putting "Critical" accessibility score companies first
  const sortedQueue = sortBySeverityPriority(
    pendingIndices.map(item => ({
      ...item,
      lhScore: Number(item.row['LH Score'] || 0),
      waveScore: Number(item.row['Wave Score'] || 0),
    }))
  );

  const saveProgress = () => {
    writeTrackerRows(outputPath, rows, headers);
  };

  try {
    for (let k = 0; k < sortedQueue.length; k++) {
      const item = sortedQueue[k];
      const row = rows[item.index];
      const companyName = String(row['Company Name'] || '').trim();
      const website = String(row['Website'] || '').trim();

      if (!companyName) continue;

      console.log(`\n[${k + 1}/${sortedQueue.length}] InfoHarvester Harvesting for: "${companyName}"...`);
      const harvestResult = await runInfoHarvesterSingle(companyName, website);

      // Overwrite only the six POC columns, leaving all other workbook data intact.
      row['Contact Person 1'] = harvestResult['Contact Person 1'];
      row['Designation 1'] = harvestResult['Designation 1'];
      row['Email ID 1'] = harvestResult['Email ID 1'];
      row['Contact Person 2'] = harvestResult['Contact Person 2'];
      row['Designation 2'] = harvestResult['Designation 2'];
      row['Email ID 2'] = harvestResult['Email ID 2'];

      // Autosave incrementally to disk
      saveProgress();
    }
  } catch (err: any) {
    console.warn(`\n⚠️ Interrupted or error encountered. Saving progress to disk...`);
    saveProgress();
    throw err;
  }

  saveProgress();
  console.log(`\n=====================================================`);
  console.log(`🎉 Success! InfoHarvester Batch Enrichment Complete.`);
  console.log(`📊 Output Tracker: "${outputPath}"`);
  console.log(`📑 Audit Store: ".infoharvester_audit_store.json"`);
  console.log(`=====================================================\n`);

  return outputPath;
}
