import { CompanyRecord } from '../../types/index.js';
import { verifyWebsiteUrl } from './verify.js';

export interface WebsiteVerificationResult {
  companyName: string;
  websiteUrl: string;
  verified: boolean;
  statusCode?: number;
  title?: string;
  reasons?: string[];
}

export const verifyWebsite = async (record: CompanyRecord): Promise<WebsiteVerificationResult> => {
  return verifyWebsiteUrl(record);
};
