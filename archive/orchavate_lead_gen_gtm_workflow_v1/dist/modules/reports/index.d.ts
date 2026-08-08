import { CompanyResultRow, ScanResult } from '../../types/index.js';
export declare const MASTER_RESULT_COLUMNS: readonly ["Sr. No.", "Assigned To", "Company Name", "Website", "Contact Person", "Email ID", "Website Verified", "Scan Completed", "Screenshot Taken", "Status", "Verified By", "Remarks"];
export declare const buildResultRow: (input: {
    companyName: string;
    websiteUrl: string;
    contactPerson?: string;
    emailId?: string;
    websiteVerified?: string;
    scanCompleted?: string;
    screenshotTaken?: string;
    status?: string;
    assignedTo?: string;
    verifiedBy?: string;
    remarks?: string;
    srNo?: number;
}) => CompanyResultRow;
export declare const generateReportJson: (result: ScanResult) => Promise<string>;
export declare const generateReportMarkdown: (result: ScanResult) => Promise<string>;
export declare const generateReportHtml: (result: ScanResult) => Promise<string>;
//# sourceMappingURL=index.d.ts.map