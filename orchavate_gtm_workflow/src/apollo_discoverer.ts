import fs from 'fs';
import path from 'path';
import { Page } from 'playwright';
import {
  ApolloMatchRequest,
  ApolloMatchResponse,
  ApolloPersonMatch,
  ApolloQuotaStats,
  EmailField,
  EmailDiscoveryResult
} from './types.js';

export interface PocEnrichmentResult {
  contact1: { name: string; title: string; email: string };
  contact2: { name: string; title: string; email: string };
  quotaStats: ApolloQuotaStats;
  discoverySource: 'Apollo API' | 'On-Page Scraper' | 'Fallback Heuristic';
}

const APOLLO_MATCH_URL = 'https://api.apollo.io/v1/people/match';
let currentQuotaStats: ApolloQuotaStats = {
  rateLimitRemaining: 100,
  rateLimitTotal: 100,
  quotaWarningTriggered: false,
};

/**
 * Mask API key for secure logging to avoid anti-leak violation.
 * Example: "sk-1234567890abcdef" -> "sk-****cdef"
 */
export function maskApiKey(key?: string): string {
  if (!key) return 'NOT_CONFIGURED';
  if (key.length <= 8) return '****';
  return `${key.slice(0, 3)}****${key.slice(-4)}`;
}

/**
 * Module B: Apollo API & POC Enrichment Engine (v1.3 Apollo Edition)
 * Prioritizes:
 * 1. Nodal Officer for Accessibility (Primary Statutory Target)
 * 2. Compliance Officer / Company Secretary
 * 3. Head of Legal / General Counsel
 * 4. Chief Executive Officer (CEO) / Managing Director (MD)
 * 5. Founder / Co-Founder
 */
export async function enrichPocWithApollo(
  companyName: string,
  domain: string,
  page?: Page
): Promise<PocEnrichmentResult> {
  const apiKey = process.env.APOLLO_API_KEY || process.env.APOLLO_KEY;
  const safeDomain = domain ? domain.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] : '';

  console.log(`\n🔍 [POC Enrichment] Target: "${companyName}" (Domain: ${safeDomain || 'N/A'})`);
  console.log(`  └─ Apollo API Key Status: ${maskApiKey(apiKey)}`);

  let poc1 = { name: 'N/A', title: 'N/A', email: 'Not Found' };
  let poc2 = { name: 'N/A', title: 'N/A', email: 'Not Found' };

  // Step 1: On-Page Scraper Crawl for Nodal Officer & Compliance details
  if (page && safeDomain) {
    try {
      const crawlPages = ['/accessibility', '/governance', '/investors', '/contact'];
      for (const p of crawlPages) {
        try {
          const targetUrl = `https://${safeDomain}${p}`;
          await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 5000 });
          const bodyText = await page.evaluate(() => document.body?.innerText || '');

          // Check for statutory Nodal Officer for Accessibility
          const nodalMatch = bodyText.match(/(?:nodal officer|accessibility officer|grievance officer)[\s:-]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/i);
          if (nodalMatch && nodalMatch[1]) {
            poc1.name = nodalMatch[1].trim();
            poc1.title = 'Nodal Officer for Accessibility (SEBI Statutory)';
            console.log(`  ✓ Discovered On-Page Statutory Target: "${poc1.name}" (${poc1.title})`);
          }

          // Check for Compliance Officer
          const compMatch = bodyText.match(/(?:compliance officer|company secretary)[\s:-]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/i);
          if (compMatch && compMatch[1]) {
            poc2.name = compMatch[1].trim();
            poc2.title = 'Company Secretary & Compliance Officer';
            console.log(`  ✓ Discovered On-Page Compliance Target: "${poc2.name}" (${poc2.title})`);
          }
        } catch {}
      }
    } catch {}
  }

  // Step 2 & 3: Apollo API Match (Exclusive API Integration)
  if (apiKey && currentQuotaStats.rateLimitRemaining > 5) {
    try {
      const payload: ApolloMatchRequest = {
        organization_name: companyName,
        domain: safeDomain,
      };

      const response = await fetch(APOLLO_MATCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': apiKey,
        },
        body: JSON.stringify(payload),
      });

      // Step 4: Quota Guard Check from Apollo response headers
      const remainingHeader = response.headers.get('x-rate-limit-remaining');
      const totalHeader = response.headers.get('x-rate-limit-total');

      if (remainingHeader && totalHeader) {
        const remaining = parseInt(remainingHeader, 10);
        const total = parseInt(totalHeader, 10);
        const pctRemaining = (remaining / total) * 100;

        currentQuotaStats.rateLimitRemaining = remaining;
        currentQuotaStats.rateLimitTotal = total;

        if (pctRemaining < 10 && !currentQuotaStats.quotaWarningTriggered) {
          currentQuotaStats.quotaWarningTriggered = true;
          console.warn(`\n⚠️ WARNING: APOLLO API QUOTA LOW (<10% remaining: ${remaining}/${total}). Falling back to local scraper.\n`);
        }
      }

      if (response.status === 403) {
        const errJson = await response.json().catch(() => ({}));
        if (errJson?.error_code === 'API_INACCESSIBLE' || String(errJson?.error).includes('Free plan')) {
          console.warn(`  ⚠️ APOLLO API PLAN RESTRICTION: Your API Key is on an Apollo Free Plan.`);
          console.warn(`     Apollo restricts 'people/match' API lead discovery on Free plans (requires a paid Apollo plan).`);
        }
      }

      if (response.ok) {
        const data = (await response.json()) as ApolloMatchResponse;
        if (data.person) {
          const match = data.person;
          if (match.email) {
            poc1.email = match.email;
          }
          if (match.name) {
            poc1.name = match.name;
          }
          if (match.title) {
            poc1.title = match.title;
          }
          console.log(`  ✓ Apollo API Enrichment Success: "${poc1.name}" (${poc1.title}) <${poc1.email}>`);
          return {
            contact1: poc1,
            contact2: poc2,
            quotaStats: currentQuotaStats,
            discoverySource: 'Apollo API',
          };
        }
      }
    } catch (err: any) {
      console.warn(`  ⚠️ Apollo API Match Call Failed: ${err?.message}. Using local discovery fallback.`);
    }
  }

  return {
    contact1: poc1,
    contact2: poc2,
    quotaStats: currentQuotaStats,
    discoverySource: 'On-Page Scraper',
  };
}
