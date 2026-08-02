import fs from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import XLSX from 'xlsx';
import { config } from '../../core/config/index.js';
import type { CompanyRecord } from '../../types/index.js';

const normalizeRowToCompany = (row: Record<string, unknown>): CompanyRecord => {
  const get = (keys: string[]): string => {
    for (const k of keys) {
      const v = row[k] as string | undefined;
      if (v && v.toString().trim().length > 0) return v.toString();
    }
    return '';
  };

  return {
    companyName: get(['companyName', 'CompanyName', 'Company Name']),
    securityCode: get(['securityCode', 'SecurityCode', 'Security Code']) || undefined,
    isin: get(['isin', 'ISIN']) || undefined,
    websiteUrl: get(['websiteUrl', 'Website', 'WebsiteUrl', 'URL']) || '',
    sector: get(['sector', 'Sector']) || undefined,
  };
};

export const loadTrackerRecords = async (trackerPath?: string): Promise<CompanyRecord[]> => {
  const inputPath = trackerPath ? path.resolve(trackerPath) : path.resolve(config.TRACKER_FILE);
  const ext = path.extname(inputPath).toLowerCase();
  const content = await fs.readFile(inputPath);

  let rows: Array<Record<string, unknown>> = [];

  if (ext === '.csv' || ext === '.txt') {
    const text = content.toString('utf8');
    rows = parse(text, { columns: true, skip_empty_lines: true, trim: true }) as Array<
      Record<string, unknown>
    >;
  } else if (ext === '.xlsx' || ext === '.xls') {
    const workbook = XLSX.read(content, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    rows = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as Array<Record<string, unknown>>;
  } else {
    // fallback try parsing as CSV text
    const text = content.toString('utf8');
    rows = parse(text, { columns: true, skip_empty_lines: true, trim: true }) as Array<
      Record<string, unknown>
    >;
  }

  const companies = rows.map(normalizeRowToCompany).filter((c) => c.companyName && c.websiteUrl);

  // dedupe by website
  const map = new Map<string, CompanyRecord>();
  for (const c of companies) {
    const key = c.websiteUrl.trim().toLowerCase();
    if (!map.has(key)) map.set(key, c);
  }

  return Array.from(map.values());
};

export default loadTrackerRecords;
