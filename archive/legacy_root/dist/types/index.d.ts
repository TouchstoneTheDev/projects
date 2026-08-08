export interface CompanyRecord {
    companyName: string;
    securityCode?: string;
    isin?: string;
    websiteUrl: string;
    sector?: string;
}
export interface ScanResult {
    companyName: string;
    websiteUrl: string;
    status: 'success' | 'failed' | 'skipped';
    accessibilityScore?: number;
    violationsCount?: number;
    lighthouseAuditUrl?: string;
    screenshotFiles?: string[];
    remarks?: string;
}
//# sourceMappingURL=index.d.ts.map