import { CompanyRecord } from '../../types/index.js';
export interface ContactDiscoveryResult {
    companyName: string;
    websiteUrl: string;
    emails: string[];
    confidence: 'high' | 'medium' | 'low';
    sources: string[];
}
export declare const discoverContacts: (record: CompanyRecord) => Promise<ContactDiscoveryResult>;
//# sourceMappingURL=index.d.ts.map