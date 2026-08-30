import { CompanyRecord } from '../../types/index.js';

export interface ContactDiscoveryResult {
  companyName: string;
  websiteUrl: string;
  emails: string[];
  confidence: 'high' | 'medium' | 'low';
  sources: string[];
}

export const discoverContacts = async (record: CompanyRecord): Promise<ContactDiscoveryResult> => ({
  companyName: record.companyName,
  websiteUrl: record.websiteUrl,
  emails: [],
  confidence: 'low',
  sources: [],
});
