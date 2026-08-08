import { zyteSearch, fetchSmart } from './zyte_client.js';
import { isBotBlock } from './bot_block.js';
import { EvidenceRecord, globalEvidenceStore } from './evidence_store.js';

export interface CandidatePOC {
  name: string;
  designation: string;
  email: string;
  sourceUrl: string;
  sourceType: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  score: number;
  category: 'primary' | 'escalation';
  evidenceText?: string;
}

export const SCORE_TABLE: Record<string, { score: number; category: 'primary' | 'escalation' }> = {
  'Accessibility Nodal Officer': { score: 100, category: 'primary' },
  'Nodal Officer – Accessibility': { score: 100, category: 'primary' },
  'Accessibility Officer': { score: 95, category: 'primary' },
  'Digital Accessibility Officer': { score: 95, category: 'primary' },
  'Disability/Accessibility Compliance Officer': { score: 90, category: 'primary' },
  'Compliance Officer': { score: 85, category: 'primary' },
  'Company Secretary': { score: 80, category: 'primary' },
  'Legal & Compliance Head': { score: 75, category: 'primary' },
  'Regulatory Affairs': { score: 70, category: 'primary' },
  'CEO': { score: 60, category: 'escalation' },
  'Managing Director': { score: 55, category: 'escalation' },
  'Founder': { score: 50, category: 'escalation' },
  'Co-Founder': { score: 50, category: 'escalation' },
};

const DIRECT_PATHS = [
  '/',
  '/contact',
  '/contact-us',
  '/about',
  '/about-us',
  '/investor-relations',
  '/investors',
  '/corporate-governance',
  '/board-of-directors',
  '/management',
  '/leadership',
  '/team',
  '/secretarial',
  '/compliance',
  '/legal',
  '/policies',
  '/annual-report',
  '/annual-reports',
  '/pdfs',
];

function cleanDomain(domain: string): string {
  return domain
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .split('/')[0]
    .trim();
}

function buildDirectUrls(domain: string): string[] {
  const host = cleanDomain(domain);
  if (!host) return [];
  const base = `https://${host}`;
  return DIRECT_PATHS.map(p => `${base}${p}`);
}

function extractInternalLinks(pageText: string, domain: string): string[] {
  const host = cleanDomain(domain);
  if (!host || !pageText) return [];

  const hrefRegex = /href=["']([^"']+)["']/gi;
  const matches = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = hrefRegex.exec(pageText)) !== null) {
    const href = match[1].trim();
    if (!href) continue;
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) continue;

    let resolved = href;
    if (resolved.startsWith('//')) {
      resolved = `https:${resolved}`;
    } else if (resolved.startsWith('/')) {
      resolved = `https://${host}${resolved}`;
    } else if (!/^https?:\/\//i.test(resolved)) {
      resolved = `https://${host}/${resolved.replace(/^\.\//, '')}`;
    }

    if (!resolved.includes(host)) continue;
    if (!/(contact|about|invest|govern|board|management|lead|secretar|compliance|legal|policy|annual)/i.test(resolved)) continue;
    matches.add(resolved.split('#')[0]);
  }

  return Array.from(matches).slice(0, 8);
}

/**
 * 12-Step Progressive Search Terms Generation
 */
export function get12StepSearchQueries(companyName: string, domain: string): { step: number; query: string; expectedRole: string }[] {
  const c = companyName.trim();
  const d = domain ? domain.trim() : '';

  return [
    { step: 1, query: d ? `site:${d}` : `${c} official website`, expectedRole: 'Company Website' },
    { step: 2, query: d ? `site:${d} accessibility` : `${c} accessibility`, expectedRole: 'Accessibility Officer' },
    { step: 3, query: `${c} "nodal officer"`, expectedRole: 'Accessibility Nodal Officer' },
    { step: 4, query: `${c} "accessibility officer"`, expectedRole: 'Accessibility Officer' },
    { step: 5, query: `${c} "compliance officer"`, expectedRole: 'Compliance Officer' },
    { step: 6, query: `${c} "company secretary"`, expectedRole: 'Company Secretary' },
    { step: 7, query: `${c} legal`, expectedRole: 'Legal & Compliance Head' },
    { step: 8, query: `${c} "investor relations" contact`, expectedRole: 'Compliance Officer' },
    { step: 9, query: `${c} "annual report" compliance officer`, expectedRole: 'Company Secretary' },
    { step: 10, query: `${c} BRSR "nodal officer" OR accessibility`, expectedRole: 'Accessibility Nodal Officer' },
    { step: 11, query: `${c} "corporate governance" officer`, expectedRole: 'Compliance Officer' },
    { step: 12, query: `site:nseindia.com OR site:bseindia.com "${c}" compliance officer`, expectedRole: 'Compliance Officer' },
  ];
}

/**
 * Parses page text strictly enforcing ZERO EMAIL FABRICATION.
 * Returns candidate contacts found on the page or in SERP snippet.
 */
export function parseCandidatesFromPage(
  pageText: string,
  sourceUrl: string,
  companyName: string,
  defaultRole: string
): CandidatePOC[] {
  if (!pageText || pageText.length < 30) return [];

  const candidates: CandidatePOC[] = [];
  const textLower = pageText.toLowerCase();

  // Check if page contains bot-block signatures
  if (isBotBlock(pageText)) return [];

  // Extract explicit emails
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const rawEmails = pageText.match(emailRegex) || [];
  
  // Filter generic emails
  const individualEmails = rawEmails.filter(e => {
    const el = e.toLowerCase();
    return !el.endsWith('.png') && !el.endsWith('.jpg') &&
      !el.startsWith('info@') && !el.startsWith('support@') &&
      !el.startsWith('careers@') && !el.startsWith('sales@') &&
      !el.startsWith('media@') && !el.startsWith('help@') &&
      !el.includes('example.com') && !el.includes('sentry.io');
  });

  const genericEmails = rawEmails.filter(e => {
    const el = e.toLowerCase();
    return el.startsWith('info@') || el.startsWith('cs@') || el.startsWith('compliance@') || el.startsWith('secretarial@') || el.startsWith('investor@');
  });

  // Extract Name patterns (Mr., Ms., Dr., Shri, Smt., etc.)
  const nameRegex = /(?:Mr\.|Ms\.|Dr\.|Shri|Smt\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/g;
  let match: RegExpExecArray | null;
  const names: string[] = [];
  while ((match = nameRegex.exec(pageText)) !== null) {
    if (match[1] && !names.includes(match[1])) {
      names.push(match[1]);
    }
  }

  // Also capture name + title pairs without honorifics.
  const titlePairRegex = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s*[-–|,:]\s*(Accessibility Nodal Officer|Accessibility Officer|Digital Accessibility Officer|Compliance Officer|Company Secretary|Legal & Compliance Head|Regulatory Affairs|CEO|Managing Director|Founder|Co-Founder)/gi;
  while ((match = titlePairRegex.exec(pageText)) !== null) {
    if (match[1] && !names.includes(match[1])) {
      names.push(match[1]);
    }
    if (match[2]) {
      const roleKey = match[2];
      if (SCORE_TABLE[roleKey] && SCORE_TABLE[roleKey].score > scoreData.score) {
        matchedRole = roleKey;
        scoreData = SCORE_TABLE[roleKey];
      }
    }
  }

  // Calculate score and role matching
  let matchedRole = defaultRole;
  let scoreData = SCORE_TABLE[defaultRole] || { score: 60, category: 'primary' };

  for (const [roleKey, meta] of Object.entries(SCORE_TABLE)) {
    if (textLower.includes(roleKey.toLowerCase())) {
      if (meta.score > scoreData.score) {
        matchedRole = roleKey;
        scoreData = meta;
      }
    }
  }

  if (names.length > 0) {
    for (const n of names.slice(0, 3)) {
      const email = individualEmails.length > 0 ? individualEmails[0] : (genericEmails.length > 0 ? genericEmails[0] : 'Not publicly disclosed');
      const confidence = individualEmails.length > 0 ? 'HIGH' : (genericEmails.length > 0 ? 'MEDIUM' : 'LOW');

      candidates.push({
        name: n,
        designation: matchedRole,
        email: email,
        sourceUrl: sourceUrl,
        sourceType: sourceUrl.includes('bseindia') || sourceUrl.includes('nseindia') ? 'Exchange Disclosure' : (sourceUrl.includes('pdf') ? 'Annual Report / Filing' : 'Corporate Website'),
        confidence: confidence,
        score: scoreData.score,
        category: scoreData.category,
        evidenceText: pageText.slice(0, 300),
      });
    }
  } else if (individualEmails.length > 0 || genericEmails.length > 0) {
    const email = individualEmails.length > 0 ? individualEmails[0] : genericEmails[0];
    candidates.push({
      name: `Compliance Officer (${companyName})`,
      designation: matchedRole,
      email: email,
      sourceUrl: sourceUrl,
      sourceType: 'Corporate Page / Disclosure',
      confidence: individualEmails.length > 0 ? 'HIGH' : 'MEDIUM',
      score: scoreData.score,
      category: scoreData.category,
      evidenceText: pageText.slice(0, 300),
    });
  }

  return candidates;
}

export async function findPOCsEnhanced(companyName: string, domain: string): Promise<{ pocs: CandidatePOC[]; evidence: EvidenceRecord }> {
  console.log(`\n🔍 [InfoHarvester 12-Step Pipeline] Harvesting: "${companyName}" (${domain || 'N/A'})...`);

  const steps = get12StepSearchQueries(companyName, domain);
  const candidatesMap = new Map<string, CandidatePOC>();
  const visitedUrls = new Set<string>();

  async function harvestUrl(url: string, expectedRole: string): Promise<void> {
    if (!url || visitedUrls.has(url)) return;
    visitedUrls.add(url);

    const pageText = await fetchSmart(url);
    if (!pageText || isBotBlock(pageText)) return;

    const found = parseCandidatesFromPage(pageText, url, companyName, expectedRole);
    for (const cand of found) {
      const key = `${cand.name.toLowerCase()}_${cand.designation.toLowerCase()}`;
      if (!candidatesMap.has(key) || (candidatesMap.get(key)!.score < cand.score)) {
        candidatesMap.set(key, cand);
      }
    }

    for (const linkedUrl of extractInternalLinks(pageText, domain)) {
      if (!visitedUrls.has(linkedUrl)) {
        const linkedText = await fetchSmart(linkedUrl);
        if (!linkedText || isBotBlock(linkedText)) continue;
        const linkedFound = parseCandidatesFromPage(linkedText, linkedUrl, companyName, expectedRole);
        for (const cand of linkedFound) {
          const key = `${cand.name.toLowerCase()}_${cand.designation.toLowerCase()}`;
          if (!candidatesMap.has(key) || (candidatesMap.get(key)!.score < cand.score)) {
            candidatesMap.set(key, cand);
          }
        }
      }
    }
  }

  for (const directUrl of buildDirectUrls(domain)) {
    await harvestUrl(directUrl, 'Company Website');
  }

  for (const s of steps) {
    console.log(`  [Step ${s.step}/12] Executing search: "${s.query}"...`);
    const searchResults = await zyteSearch(s.query);
    if (!searchResults || searchResults.length === 0) continue;

    for (const res of searchResults.slice(0, 4)) {
      await harvestUrl(res.url, s.expectedRole);
    }

    // Early exit if we have found both a High-Score Primary (Score >= 80) and Escalation POC (Score >= 50)
    const all = Array.from(candidatesMap.values());
    const hasPrimary = all.some(c => c.category === 'primary' && c.score >= 80);
    const hasEscalation = all.some(c => c.category === 'escalation');
    if (hasPrimary && hasEscalation) {
      console.log(`  ✓ Early exit: High-confidence Primary and Escalation POCs discovered at Step ${s.step}.`);
      break;
    }
  }

  const allCandidates = Array.from(candidatesMap.values()).sort((a, b) => b.score - a.score);

  // Pick Primary POC (highest ranked relevant primary contact)
  let primaryPOC = allCandidates.find(c => c.category === 'primary');
  if (!primaryPOC && allCandidates.length > 0) {
    primaryPOC = allCandidates[0];
  }

  // Pick Escalation POC (highest ranked independent escalation contact)
  let escalationPOC = allCandidates.find(c => c.category === 'escalation' && c.name.toLowerCase() !== primaryPOC?.name.toLowerCase());
  if (!escalationPOC) {
    escalationPOC = allCandidates.find(c => c.name.toLowerCase() !== primaryPOC?.name.toLowerCase());
  }

  // Default fallbacks if none found
  const p1: CandidatePOC = primaryPOC || {
    name: 'Not Found',
    designation: 'Not Found - needs manual lookup',
    email: 'Not publicly disclosed',
    sourceUrl: 'N/A',
    sourceType: 'N/A',
    confidence: 'LOW',
    score: 0,
    category: 'primary'
  };

  const p2: CandidatePOC = escalationPOC || {
    name: 'Not Found',
    designation: 'Not Found - needs manual lookup',
    email: 'Not publicly disclosed',
    sourceUrl: 'N/A',
    sourceType: 'N/A',
    confidence: 'LOW',
    score: 0,
    category: 'escalation'
  };

  const evidenceRecord: EvidenceRecord = {
    company_name: companyName,
    website: domain || 'N/A',
    contact_1_name: p1.name,
    contact_1_designation: p1.designation,
    contact_1_email: p1.email,
    contact_1_source: p1.sourceUrl,
    contact_1_source_type: p1.sourceType,
    contact_1_confidence: p1.confidence,

    contact_2_name: p2.name,
    contact_2_designation: p2.designation,
    contact_2_email: p2.email,
    contact_2_source: p2.sourceUrl,
    contact_2_source_type: p2.sourceType,
    contact_2_confidence: p2.confidence,

    accessibility_nodal_officer_found: p1.designation.toLowerCase().includes('accessibility') || p2.designation.toLowerCase().includes('accessibility'),
    accessibility_evidence: p1.evidenceText || p2.evidenceText || 'No explicit accessibility officer disclosure found',
    last_checked: new Date().toISOString()
  };

  globalEvidenceStore.saveRecord(evidenceRecord);

  return {
    pocs: [p1, p2],
    evidence: evidenceRecord
  };
}
