export interface CompanyTarget {
  srNo: number;
  assignedTo: string;
  companyName: string;
  website: string;
  contactPerson: string;
  emailId: string;
  verifiedBy: string;
}

export type ViolationCategory = 
  | 'missing_alt_text' 
  | 'color_contrast' 
  | 'form_labels' 
  | 'keyboard_navigation' 
  | 'other';

export interface AuditViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  category: ViolationCategory;
  selector: string;
  html: string;
  pageName: string;
  screenshotPath?: string;
}

export interface PageAuditResult {
  pageName: 'Homepage' | 'About' | 'Contact' | 'Investor Relations' | 'Annual Report / PDF';
  url: string;
  accessible: boolean;
  axeViolations: AuditViolation[];
  lighthouseScore: number;
  screenshots: string[];
}

export interface CompanyAuditReport {
  company: CompanyTarget;
  websiteVerified: boolean;
  scanCompleted: boolean;
  screenshotTaken: boolean;
  status: 'Completed' | 'Inaccessible' | 'Partial' | 'Failed';
  pages: PageAuditResult[];
  totalViolations: number;
  altTextViolations: number;
  contrastViolations: number;
  labelViolations: number;
  keyboardViolations: number;
  lighthouseAvgScore: number;
  remarks: string;
  timestamp: string;
}

export interface TrackerRow {
  'Sr. No.': number;
  'Assigned To': string;
  'Company Name': string;
  'Website': string;
  'Contact Person': string;
  'Email ID': string;
  'Website Verified': string;
  'Scan Completed': string;
  'Screenshot Taken': string;
  'Status': string;
  'Verified By': string;
  'Remarks': string;
}
