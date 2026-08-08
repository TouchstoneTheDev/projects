export interface CompanyRecord {
    companyName: string;
    securityCode?: string;
    isin?: string;
    websiteUrl: string;
    sector?: string;
    assignedTo?: string;
    contactPerson?: string;
    emailId?: string;
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
export interface CompanyResultRow {
    'Sr. No.': number;
    'Assigned To'?: string;
    'Company Name': string;
    Website: string;
    'Contact Person'?: string;
    'Email ID'?: string;
    'Website Verified': string;
    'Scan Completed': string;
    'Screenshot Taken': string;
    Status: string;
    'Verified By'?: string;
    Remarks?: string;
}
//# sourceMappingURL=index.d.ts.map