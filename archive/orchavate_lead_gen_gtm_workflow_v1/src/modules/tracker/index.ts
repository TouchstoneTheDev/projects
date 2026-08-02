import fs from 'node:fs/promises';
import path from 'node:path';
import XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';
import { config } from '../../core/config/index.js';
import { CompanyRecord } from '../../types/index.js';

const quoteCsvValue = (value: string): string => {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
};

const isExcelFile = (filePath: string): boolean => {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.xls' || ext === '.xlsx';
};

const isCsvFile = (filePath: string): boolean => path.extname(filePath).toLowerCase() === '.csv';
const isTxtFile = (filePath: string): boolean => path.extname(filePath).toLowerCase() === '.txt';

const getRowString = (row: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim().length > 0) return value.trim();
    if (typeof value === 'number' && !Number.isNaN(value)) return String(value);
  }
  return '';
};

const getEmailFromRow = (row: Record<string, unknown>): string | undefined => {
  const text = Object.values(row)
    .filter((value): value is string => typeof value === 'string')
    .join(' ');
  const match = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  return match ? match[0] : undefined;
};

const getCompanyNameFromRow = (row: Record<string, unknown>): string => {
  const genericHeaderPattern =
    /^(name|registration no\.?|contact person|email[- ]?id|telephone|fax|city|state|pincode|from|to|country|exchange name|trade name|address|correspondence address|validity)$/i;

  const direct = getRowString(row, ['companyName', 'CompanyName', 'Company Name', 'Name', 'name']);
  if (direct && !genericHeaderPattern.test(direct)) {
    return direct;
  }

  const entries = Object.entries(row)
    .map(([key, value]) => ({ key, value: typeof value === 'string' ? value.trim() : String(value ?? '').trim() }))
    .filter(({ value, key }) => {
      if (!value) return false;
      if (genericHeaderPattern.test(key) || genericHeaderPattern.test(value)) return false;
      if (/^(contact person|address|email[- ]?id|telephone|fax|city|state|pincode|from|to|country|exchange name|trade name|validity)$/i.test(value)) {
        return false;
      }
      return value.length > 2 && !/^\d+$/.test(value);
    });

  for (const entry of entries) {
    if (entry.value.length > 2 && !/^\d+$/.test(entry.value)) {
      return entry.value;
    }
  }

  return '';
};

const normalizeRowToCompany = (row: Record<string, unknown>): CompanyRecord => {
  const companyName = getCompanyNameFromRow(row);

  const securityCode =
    getRowString(row, ['securityCode', 'SecurityCode', 'Security Code', 'Registration No.', 'registrationNo']) || undefined;

  const isin = getRowString(row, ['isin', 'ISIN']) || undefined;

  const websiteUrl =
    getRowString(row, ['websiteUrl', 'WebsiteUrl', 'Website', 'URL', 'url', 'website']) ||
    (Object.values(row)
      .filter((value): value is string => typeof value === 'string')
      .find((value) => /^https?:\/\//i.test(value.trim())) || '')
      .trim();

  const sector = getRowString(row, ['sector', 'Sector']) || undefined;
  const emailId = getEmailFromRow(row);

  return {
    companyName,
    securityCode,
    isin,
    websiteUrl,
    sector,
    emailId,
  };
};

const parseCsvTracker = (content: string): CompanyRecord[] => {
  const rows = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Array<Record<string, string>>;

  return rows.map(normalizeRowToCompany).filter((record) => record.companyName.length > 0);
};

const parseExcelTracker = (filePath: string): CompanyRecord[] => {
  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });
  return rows.map(normalizeRowToCompany).filter((record) => record.companyName.length > 0);
};

export const loadTrackerFile = async (trackerPath?: string): Promise<CompanyRecord[]> => {
  const pathToUse = trackerPath ? path.resolve(trackerPath) : path.resolve(config.TRACKER_FILE);

  if (isExcelFile(pathToUse)) {
    return parseExcelTracker(pathToUse);
  }

  if (isCsvFile(pathToUse) || isTxtFile(pathToUse)) {
    const content = await fs.readFile(pathToUse, 'utf8');
    return parseCsvTracker(content);
  }

  throw new Error(`Unsupported tracker file type for ${pathToUse}`);
};

const writeExcelTracker = async (
  trackerPath: string,
  rows: Array<Record<string, unknown>>,
): Promise<void> => {
  const workbook = XLSX.readFile(trackerPath, { cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = XLSX.utils.json_to_sheet(rows, { skipHeader: false });
  workbook.Sheets[sheetName] = sheet;

  const ext = path.extname(trackerPath).toLowerCase();
  const bookType = ext === '.xls' ? 'biff8' : 'xlsx';
  XLSX.writeFile(workbook, trackerPath, { bookType });
};

const updateCsvTracker = async (
  trackerPath: string,
  companyName: string,
  changes: Record<string, string>,
): Promise<void> => {
  const content = await fs.readFile(trackerPath, 'utf8');
  const rows = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: false,
  }) as Array<Record<string, string>>;

  if (rows.length === 0) {
    throw new Error('Tracker CSV contains no rows');
  }

  const headers = Object.keys(rows[0]);
  const normalizedCompanyName = companyName.trim().toLowerCase();

  const updatedRows = rows.map((row) => {
    const rowCompany = (row.companyName ?? row.CompanyName ?? row['Company Name'] ?? '')
      .trim()
      .toLowerCase();
    if (rowCompany === normalizedCompanyName) {
      return {
        ...row,
        ...changes,
      };
    }

    return row;
  });

  const output = [headers.join(',')]
    .concat(
      updatedRows.map((row) => headers.map((header) => quoteCsvValue(row[header] ?? '')).join(',')),
    )
    .join('\n');

  await fs.writeFile(trackerPath, output, 'utf8');
};

export const updateTracker = async (
  companyName: string,
  changes: Record<string, string>,
  trackerPath?: string,
): Promise<void> => {
  const pathToUse = trackerPath ? path.resolve(trackerPath) : path.resolve(config.TRACKER_FILE);

  if (isExcelFile(pathToUse)) {
    const workbook = XLSX.readFile(pathToUse, { cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], {
      defval: '',
    });
    const normalizedCompanyName = companyName.trim().toLowerCase();
    const updatedRows = rows.map((row) => {
      const rowCompany = String(
        row.companyName ??
          row.CompanyName ??
          row['Company Name'] ??
          row['Company name'] ??
          row['NAME'] ??
          '',
      )
        .trim()
        .toLowerCase();
      if (rowCompany === normalizedCompanyName) {
        return {
          ...row,
          ...changes,
        };
      }
      return row;
    });

    await writeExcelTracker(pathToUse, updatedRows);
    return;
  }

  if (isCsvFile(pathToUse)) {
    await updateCsvTracker(pathToUse, companyName, changes);
    return;
  }

  throw new Error(`Unsupported tracker file type for ${pathToUse}`);
};
