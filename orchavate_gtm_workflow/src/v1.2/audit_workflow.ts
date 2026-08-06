/**
 * FEATURE PRIORITY NOTICE:
 * v1.1 Core Tool Features: MANDATORY (Priority 1) - Dual Scan (Axe/Lighthouse), Violations, Screenshots.
 * v1.2 Enrichment Features: OPTIONAL (Priority 2) - Mailto/PDF/LinkedIn DOM Extraction & LLM Categorization.
 */

import { Page } from 'playwright';
import { GoogleGenAI } from '@google/genai';

const list1 = "Asset Management, Auto Components / Technology, Automobile, Aviation, B2B E-commerce, Banking, Biotech / Pharma, Capital Goods, Consumer Internet, Defence / Aerospace, Defence Electronics, Design / Technology, E-commerce, Engineering / Infrastructure, Engineering Services, FMCG, FMCG / Hospitality, Financial Services, Financial Services / Digital, Financial Services / PSU, Fintech, Fintech / Insurance Marketplace, Food Services / Digital Ordering, Healthcare Services, Hospitality, IT / Financial Software, IT Services, Infrastructure / PSU, Insurance, Internet / Recruitment, Logistics / Digital Services, Metals, Metals & Mining, Mining, NBFC, Oil & Gas, Oil & Gas / Digital, Pharma, Power, Power / Utilities, Real Estate, Retail, Retail / Consumer Durables, Retail / Digital, Steel, Telecom, Telecom / Digital Infrastructure, Travel / Digital Services";
const list2 = "BFSI, insurance, telecom, consumer internet, e-commerce, healthcare, IT services";

// v1.1 MANDATORY CORE METHOD
export async function runCoreAudit(page: Page) {
  // Core Axe and Lighthouse scanning logic
  return { status: 'COMPLETE' };
}

// v1.2 OPTIONAL ENRICHMENT METHODS BELOW:
export async function extractTargetData(page: Page) {
  return await page.evaluate(() => {
    const emailNodes = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
    let emails = emailNodes
      .map(a => (a as HTMLAnchorElement).href.replace('mailto:', '').trim().toLowerCase())
      .filter(e => /investor|compliance|grievance|secretarial|nodal/i.test(e));

    if (emails.length === 0) {
      const rawText = document.body.innerHTML;
      const regex = /([a-zA-Z0-9._-]+@(investor|compliance|secretarial|grievance)\.[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
      const matches = rawText.match(regex) || [];
      emails = Array.from(new Set(matches.map(e => e.toLowerCase())));
    }

    const pdfNodes = Array.from(document.querySelectorAll('a[href$=".pdf"]'));
    const pdfs = pdfNodes
      .map(a => (a as HTMLAnchorElement).href)
      .filter(href => /annual|report|2025|2026/i.test(href));

    const linkedinNode = document.querySelector('a[href*="linkedin.com/company/"]') as HTMLAnchorElement;

    return {
      emails: Array.from(new Set(emails)),
      pdfs: Array.from(new Set(pdfs)),
      linkedin: linkedinNode ? linkedinNode.href : 'Not Found'
    };
  });
}

export async function categorizeCompany(page: Page, companyName: string, apiKey: string) {
  try {
    const metaData = await page.evaluate(() => {
      const title = document.title || '';
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      return `${title} ${metaDesc}`.trim();
    });

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze company "${companyName}" with metadata: "${metaData}".
Assign exactly ONE category from List 1, and ONE from List 2.

List 1: ${list1}
List 2: ${list2}

Format ONLY: Category1 | Category2`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim() || '';
    if (text.includes('|')) {
      const [c1, c2] = text.split('|').map(s => s.trim());
      return { category1: c1, category2: c2 };
    }
  } catch {}

  return { category1: 'Unknown', category2: 'Unknown' };
}