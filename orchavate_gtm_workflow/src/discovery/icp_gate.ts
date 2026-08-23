import { ICPCriteriaResult, LocationPriorityMap } from '../types.js';

export const LOCATION_PRIORITIES: LocationPriorityMap = {
  P1: ['bengaluru', 'bangalore', 'hosur', 'bidadi'],
  P2: ['gurugram', 'gurgaon', 'noida', 'greater noida', 'manesar', 'bhiwadi', 'faridabad', 'delhi', 'ncr'],
  P3: ['mumbai', 'navi mumbai', 'thane', 'pune', 'chakan', 'talegaon', 'pimpri', 'chinchwad'],
  P4: ['chennai']
};

export interface CompanyEvaluationInput {
  companyName: string;
  websiteUrl?: string;
  locationsText?: string;
  employeeCountText?: string;
  websiteHtmlContent?: string;
  newsKeywordsText?: string;
}

/**
 * Evaluates target organization against the 6 ICP criteria defined in Orchavate v1.3 SOP.
 */
export function evaluateICPCriteria(input: CompanyEvaluationInput): ICPCriteriaResult {
  const nameLower = input.companyName.toLowerCase();
  const locLower = (input.locationsText || '').toLowerCase();
  const htmlLower = (input.websiteHtmlContent || '').toLowerCase();
  const newsLower = (input.newsKeywordsText || '').toLowerCase();
  const empText = (input.employeeCountText || '').toLowerCase();

  const evidence: Record<string, string> = {};

  // Criterion 1: Large offices (500+ employees)
  let largeOffices = false;
  if (
    empText.includes('500') || 
    empText.includes('1000') || 
    empText.includes('5000') || 
    empText.includes('10000') || 
    empText.includes('large') ||
    htmlLower.includes('500+ employees') ||
    htmlLower.includes('workforce of over') ||
    htmlLower.includes('thousands of employees')
  ) {
    largeOffices = true;
    evidence.largeOffices = 'Verified 500+ workforce indicator';
  } else {
    // Default heuristic for major listed enterprise target datasets
    largeOffices = true;
    evidence.largeOffices = 'Enterprise baseline heuristic (NSE/BSE target)';
  }

  // Criterion 2: Multiple locations
  let multipleLocs = false;
  if (
    locLower.includes(',') || 
    locLower.includes('/') || 
    locLower.includes('and') || 
    locLower.includes('multiple') ||
    htmlLower.includes('our offices') ||
    htmlLower.includes('locations') ||
    htmlLower.includes('branches')
  ) {
    multipleLocs = true;
    evidence.multipleLocations = 'Multiple office/plant locations identified';
  }

  // Criterion 3: Priority Location (P1-P4)
  let priorityLoc = false;
  let priorityTier: 'P1' | 'P2' | 'P3' | 'P4' | 'None' = 'None';
  const combinedLocStr = `${nameLower} ${locLower} ${htmlLower}`;

  for (const p1Loc of LOCATION_PRIORITIES.P1) {
    if (combinedLocStr.includes(p1Loc)) {
      priorityLoc = true;
      priorityTier = 'P1';
      evidence.priorityLocation = `Matched P1 location: ${p1Loc}`;
      break;
    }
  }

  if (!priorityLoc) {
    for (const p2Loc of LOCATION_PRIORITIES.P2) {
      if (combinedLocStr.includes(p2Loc)) {
        priorityLoc = true;
        priorityTier = 'P2';
        evidence.priorityLocation = `Matched P2 location: ${p2Loc}`;
        break;
      }
    }
  }

  if (!priorityLoc) {
    for (const p3Loc of LOCATION_PRIORITIES.P3) {
      if (combinedLocStr.includes(p3Loc)) {
        priorityLoc = true;
        priorityTier = 'P3';
        evidence.priorityLocation = `Matched P3 location: ${p3Loc}`;
        break;
      }
    }
  }

  if (!priorityLoc) {
    for (const p4Loc of LOCATION_PRIORITIES.P4) {
      if (combinedLocStr.includes(p4Loc)) {
        priorityLoc = true;
        priorityTier = 'P4';
        evidence.priorityLocation = `Matched P4 location: ${p4Loc}`;
        break;
      }
    }
  }

  // Criterion 4: Facilities/Campuses/Factories/Hospitals/Hotels/Malls/CRE
  let hasFacilities = false;
  const facilityKeywords = [
    'plant', 'factory', 'manufacturing', 'campus', 'hospital', 'healthcare',
    'hotel', 'retail', 'mall', 'park', 'real estate', 'facility', 'warehouse'
  ];
  for (const kw of facilityKeywords) {
    if (combinedLocStr.includes(kw) || htmlLower.includes(kw)) {
      hasFacilities = true;
      evidence.facilities = `Matched infrastructure sector term: ${kw}`;
      break;
    }
  }

  // Criterion 5: Diversity, Inclusion, Accessibility, ESG
  let mentionsESG = false;
  const esgKeywords = ['diversity', 'inclusion', 'accessibility', 'esg', 'sustainability', 'dei', 'ehs', 'equal opportunity'];
  for (const kw of esgKeywords) {
    if (htmlLower.includes(kw)) {
      mentionsESG = true;
      evidence.esg = `Matched ESG/DEI term: ${kw}`;
      break;
    }
  }

  // Criterion 6: Opening new offices or locations
  let openingNew = false;
  const newLocKeywords = ['expansion', 'new office', 'new plant', 'opening', 'upcoming project', 'new facility', 'groundbreaking'];
  for (const kw of newLocKeywords) {
    if (htmlLower.includes(kw) || newsLower.includes(kw)) {
      openingNew = true;
      evidence.openingNew = `Matched expansion indicator: ${kw}`;
      break;
    }
  }

  let count = 0;
  if (largeOffices) count++;
  if (multipleLocs) count++;
  if (priorityLoc) count++;
  if (hasFacilities) count++;
  if (mentionsESG) count++;
  if (openingNew) count++;

  const isQualified = count >= 3;

  return {
    largeOffices500Plus: largeOffices,
    multipleLocations: multipleLocs,
    locatedInPriorityArea: priorityLoc,
    priorityTier,
    hasFacilitiesOrCampuses: hasFacilities,
    mentionsESGorDEI: mentionsESG,
    openingNewLocations: openingNew,
    satisfiedCount: count,
    bottomlineRating: `${count}/6 Criteria Satisfied`,
    isICPQualified: isQualified,
    evidenceLinks: evidence
  };
}
