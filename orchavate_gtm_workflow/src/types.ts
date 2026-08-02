export interface CompanyInput {
  srNo: number;
  companyName: string;
  readymadeWebsite?: string;
  assignedTo?: string;
  contactPerson?: string;
  emailId?: string;
  verifiedBy?: string;
}

export type ResolutionSource = 
  | 'self-search' 
  | 'readymade-fallback' 
  | 'both-agreed';

export type ResolutionConfidence = 'HIGH' | 'LOW' | 'FAILED';

export interface WebsiteResolution {
  resolvedUrl: string;
  source: ResolutionSource;
  confidence: ResolutionConfidence;
  hasConflict: boolean;
  conflictDetails?: string;
  selfSearchUrl?: string;
  readymadeUrl?: string;
}

export type EmailStatus = 'Verified' | 'Unverified - guessed pattern' | 'Not Found';

export interface EmailField {
  address: string;
  type: 'primary' | 'compliance_grievance' | 'general';
  label: string;
  status: EmailStatus;
  sourceUrl?: string;
  screenshotPath?: string;
}

export interface EmailDiscoveryResult {
  primaryEmail: EmailField;
  regardingAccessibility: EmailField[];
  overallStatus: EmailStatus;
  evidenceScreenshots: string[];
}

export interface BotBlockResult {
  isBlocked: boolean;
  signatureMatched?: string;
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
  pageName: 'Homepage' | 'About' | 'Contact' | 'Investor Relations' | 'Statutory Details';
  url: string;
  accessible: boolean;
  axeViolations: AuditViolation[];
  lighthouseScore: number;
  screenshots: string[];
}

export interface DeliverablePair {
  name: string;
  reportPath: string;
  screenshotPath: string;
  markdownContent: string;
}

export type CompanyScanStatus = 
  | 'Completed' 
  | 'Blocked (Bot Protection)' 
  | 'Inaccessible' 
  | 'Conflict Flagged';

export interface CompanyAuditReportV11 {
  company: CompanyInput;
  resolution: WebsiteResolution;
  emailDiscovery: EmailDiscoveryResult;
  botBlock: BotBlockResult;
  pages: PageAuditResult[];
  status: CompanyScanStatus;
  totalViolations: number;
  altTextViolations: number;
  contrastViolations: number;
  labelViolations: number;
  keyboardViolations: number;
  lighthouseAvgScore: number;
  deliverables: {
    websitePair: DeliverablePair;
    emailPair: DeliverablePair;
    toolsPair: DeliverablePair;
  };
  remarks: string;
  timestamp: string;
}

export interface RunReportStats {
  timestamp: string;
  durationSeconds: number;
  totalCompanies: number;
  resolutionStats: {
    selfSearchCount: number;
    fallbackCount: number;
    conflictCount: number;
  };
  emailStats: {
    verifiedCount: number;
    guessedCount: number;
    notFoundCount: number;
  };
  scanStats: {
    completedCount: number;
    blockedCount: number;
    inaccessibleCount: number;
  };
  circuitBreakerEvents: string[];
  conflictsTable: Array<{ company: string; selfSearchUrl: string; readymadeUrl: string; status: string }>;
  blockedDomainsTable: Array<{ company: string; domain: string; signatureMatched: string; attempts: number }>;
  recommendedNextSteps: {
    manualWebsiteResearch: string[];
    noEmailFound: string[];
    unresolvedConflicts: string[];
    infraIssues: string[];
  };
}
