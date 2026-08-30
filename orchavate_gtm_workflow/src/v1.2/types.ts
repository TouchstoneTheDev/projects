/**
 * FEATURE PRIORITY NOTICE:
 * v1.1 Core Tool Features: MANDATORY (Priority 1) - Scanner, Screenshots, Deliverables, Tracker Writeback.
 * v1.2 Enrichment Features: OPTIONAL (Priority 2) - Domain Auth Gate, Contact/PDF Extraction, 2-Column Categorization.
 */

// OLD:
// export interface CompanyRecord {
//   srNo: number;
//   companyName: string;
//   readymadeWebsite?: string;
//   contactPerson?: string;
//   emailId?: string;
//   assignedTo?: string;
// }

// NEW:
export interface CompanyRecord {
  // v1.1 Mandatory Core Fields
  srNo: number;
  companyName: string;
  readymadeWebsite?: string;
  contactPerson?: string;
  emailId?: string;
  assignedTo?: string;

  // v1.2 Optional Enrichment Fields
  authenticWebsite?: string;
  targetEmails?: string[];
  linkedInUrl?: string;
  pdfLinks?: string[];
  authStatus?: 'VERIFIED' | 'FAILED_AUTHENTICATION' | 'ERROR';
  category1?: string;
  category2?: string;
}