import { CompanyRecord } from '../../types/index.js';
export interface WebsiteVerificationResult {
    companyName: string;
    websiteUrl: string;
    verified: boolean;
    statusCode?: number;
    title?: string;
    reasons?: string[];
}
export declare const verifyWebsite: (record: CompanyRecord) => Promise<WebsiteVerificationResult>;
//# sourceMappingURL=index.d.ts.map