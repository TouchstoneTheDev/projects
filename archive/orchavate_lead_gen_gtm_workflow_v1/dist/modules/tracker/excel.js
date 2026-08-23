import fs from 'node:fs/promises';
import path from 'node:path';
import ExcelJS from 'exceljs';
export const loadTrackerWorkbook = async (filePath) => {
    const workbook = new ExcelJS.Workbook();
    const buffer = await fs.readFile(path.resolve(filePath));
    await workbook.xlsx.load(buffer);
    return workbook;
};
export const workbookToRecords = (workbook) => {
    const worksheet = workbook.worksheets[0];
    const rows = worksheet.getSheetValues();
    const headers = rows[1];
    if (!Array.isArray(headers)) {
        return [];
    }
    return rows
        .slice(2)
        .filter((row) => Array.isArray(row))
        .map((row) => {
        const record = {};
        headers.forEach((header, index) => {
            if (typeof header === 'string') {
                const value = row[index + 1];
                record[header] = value === undefined || value === null ? '' : String(value);
            }
        });
        return {
            companyName: record.companyName ?? record.CompanyName ?? record['Company Name'] ?? '',
            securityCode: record.securityCode ?? record.SecurityCode ?? record['Security Code'] ?? undefined,
            isin: record.isin ?? record.ISIN ?? undefined,
            websiteUrl: record.websiteUrl ?? record.WebsiteUrl ?? record.Website ?? record.URL ?? '',
            sector: record.sector ?? record.Sector ?? undefined,
        };
    })
        .filter((record) => record.companyName.length > 0 && record.websiteUrl.length > 0);
};
export const updateWorkbookRow = async (filePath, companyName, changes) => {
    const workbook = await loadTrackerWorkbook(filePath);
    const worksheet = workbook.worksheets[0];
    const headerRow = worksheet.getRow(1);
    const headers = headerRow.values;
    const normalizedCompanyName = companyName.trim().toLowerCase();
    for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex += 1) {
        const row = worksheet.getRow(rowIndex);
        const rowValues = row.values;
        const rowCompany = (rowValues[headers.indexOf('companyName')] ?? rowValues[headers.indexOf('CompanyName')] ?? rowValues[headers.indexOf('Company Name')] ?? '');
        if (rowCompany?.toString().trim().toLowerCase() === normalizedCompanyName) {
            Object.entries(changes).forEach(([key, value]) => {
                const headerIndex = headers.findIndex((header) => header === key || header === key.replace(/([A-Z])/g, ' $1').trim());
                if (headerIndex >= 0) {
                    row.getCell(headerIndex).value = value;
                }
            });
            row.commit();
        }
    }
    await workbook.xlsx.writeFile(filePath);
};
//# sourceMappingURL=excel.js.map