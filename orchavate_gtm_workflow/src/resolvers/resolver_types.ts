import { CompanyInput } from '../types.js';

export type ResolutionConfidence = 'HIGH' | 'LOW' | 'FAILED';

export type ResolutionSource = 
  | 'automated-search'
  | 'readymade-mapping'
  | 'hybrid-agreed'
  | 'hybrid-fallback';

export interface ResolutionResult {
  resolvedUrl: string;
  source: ResolutionSource;
  confidence: ResolutionConfidence;
  hasConflict: boolean;
  conflictDetails?: string;
  selfSearchUrl?: string;
  readymadeUrl?: string;
  candidateDomains: string[];
  searchQueries: string[];
  searchDurationMs: number;
  reason: string;
}

export interface WebsiteResolver {
  resolve(company: CompanyInput): Promise<ResolutionResult>;
}
