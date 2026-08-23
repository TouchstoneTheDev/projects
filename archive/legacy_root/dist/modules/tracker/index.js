import fs from 'node:fs/promises';
import path from 'node:path';
import XLSX from 'xlsx';
import { parse } from 'csv-parse/sync';
import { config } from '../../core/config/index.js';
const quoteCsvValue = (value) => {
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
};
const isExcelFile = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    return ext === '.xls' || ext === '.xlsx';
};
const isCsvFile = (filePath) => path.extname(filePath).toLowerCase() === '.csv';
const isTxtFile = (filePath) => path.extname(filePath).toLowerCase() === '.txt';
const normalizeRowToCompany = (row) => {
    const companyName = String(row.companyName ??
        row.CompanyName ??
        row['Company Name'] ??
        row['Company name'] ??
        row['NAME'] ??
        '').trim();
    const securityCode = String(row.securityCode ?? row.SecurityCode ?? row['Security Code'] ?? row['Security code'] ?? '') || undefined;
    const isin = String(row.isin ?? row.ISIN ?? '').trim() || undefined;
    const websiteUrl = String(row.websiteUrl ?? row.WebsiteUrl ?? row.Website ?? row.URL ?? row['url'] ?? '').trim();
    const sector = String(row.sector ?? row.Sector ?? '').trim() || undefined;
    return {
        companyName,
        securityCode,
        isin,
        websiteUrl,
        sector,
    };
};
const parseCsvTracker = (content) => {
    const rows = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
    return rows
        .map(normalizeRowToCompany)
        .filter((record) => record.companyName.length > 0 && record.websiteUrl.length > 0);
};
const parseExcelTracker = (filePath) => {
    const workbook = XLSX.readFile(filePath, { cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    return rows
        .map(normalizeRowToCompany)
        .filter((record) => record.companyName.length > 0 && record.websiteUrl.length > 0);
};
export const loadTrackerFile = async (trackerPath) => {
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
const writeExcelTracker = async (trackerPath, rows) => {
    const workbook = XLSX.readFile(trackerPath, { cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.json_to_sheet(rows, { skipHeader: false });
    workbook.Sheets[sheetName] = sheet;
    const ext = path.extname(trackerPath).toLowerCase();
    const bookType = ext === '.xls' ? 'biff8' : 'xlsx';
    XLSX.writeFile(workbook, trackerPath, { bookType });
};
const updateCsvTracker = async (trackerPath, companyName, changes) => {
    const content = await fs.readFile(trackerPath, 'utf8');
    const rows = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: false,
    });
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
        .concat(updatedRows.map((row) => headers.map((header) => quoteCsvValue(row[header] ?? '')).join(',')))
        .join('\n');
    await fs.writeFile(trackerPath, output, 'utf8');
};
export const updateTracker = async (companyName, changes, trackerPath) => {
    const pathToUse = trackerPath ? path.resolve(trackerPath) : path.resolve(config.TRACKER_FILE);
    if (isExcelFile(pathToUse)) {
        const workbook = XLSX.readFile(pathToUse, { cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            defval: '',
        });
        const normalizedCompanyName = companyName.trim().toLowerCase();
        const updatedRows = rows.map((row) => {
            const rowCompany = String(row.companyName ??
                row.CompanyName ??
                row['Company Name'] ??
                row['Company name'] ??
                row['NAME'] ??
                '')
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
//# sourceMappingURL=index.js.map