import { parse } from 'csv-parse/sync';
export const parseCompanyList = async (csvContent) => {
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
    const normalized = records
        .map((row) => normalizeCompanyRecord({
        companyName: row.companyName ?? row.CompanyName ?? row['Company Name'] ?? '',
        securityCode: row.securityCode ?? row.SecurityCode ?? row['Security Code'] ?? undefined,
        isin: row.isin ?? row.ISIN ?? row['ISIN'] ?? undefined,
        websiteUrl: row.websiteUrl ?? row.WebsiteUrl ?? row.Website ?? row.URL ?? '',
        sector: row.sector ?? row.Sector ?? undefined,
    }))
        .filter((item) => item.companyName.length > 0 && item.websiteUrl.length > 0);
    const uniqueMap = new Map();
    for (const item of normalized) {
        const key = item.websiteUrl.toLowerCase();
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
        }
    }
    return Array.from(uniqueMap.values());
};
export const normalizeCompanyRecord = (record) => ({
    ...record,
    companyName: record.companyName.trim(),
    websiteUrl: record.websiteUrl.trim(),
});
//# sourceMappingURL=index.js.map