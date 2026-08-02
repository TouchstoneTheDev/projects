import fs from 'fs';
import path from 'path';
import { Page } from 'playwright';
import { CompanyTarget } from './types';

export interface DiscoveredTargetPages {
  homepage: string;
  about?: string;
  contact?: string;
  investorRelations?: string;
  annualReportPdf?: string;
}

export interface TargetDiscoveryResult {
  verified: boolean;
  title?: string;
  pages: DiscoveredTargetPages;
  extractedEmails: string[];
  errorMessage?: string;
}

export async function verifyAndDiscoverPages(
  page: Page,
  target: CompanyTarget,
  notFoundOutputDir: string
): Promise<TargetDiscoveryResult> {
  const result: TargetDiscoveryResult = {
    verified: false,
    pages: { homepage: target.website },
    extractedEmails: [],
  };

  let formattedUrl = target.website.trim();
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = `https://${formattedUrl}`;
  }

  try {
    const response = await page.goto(formattedUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    if (!response || response.status() >= 400) {
      throw new Error(`HTTP Error Status ${response?.status() || 'No Response'}`);
    }

    result.title = await page.title();
    result.verified = true;

    // Discover internal links for About, Contact, Investor Relations, and PDF
    const links = await page.$$eval('a[href]', (anchors) => 
      anchors.map(a => ({ href: a.href, text: a.textContent?.trim().toLowerCase() || '' }))
    );

    const baseUrl = new URL(formattedUrl).origin;

    for (const link of links) {
      if (!link.href.startsWith(baseUrl) && !link.href.startsWith('/')) continue;
      const hrefLower = link.href.toLowerCase();

      if (!result.pages.about && (hrefLower.includes('/about') || link.text.includes('about us') || link.text.includes('about'))) {
        result.pages.about = link.href;
      } else if (!result.pages.contact && (hrefLower.includes('/contact') || link.text.includes('contact us') || link.text.includes('contact'))) {
        result.pages.contact = link.href;
      } else if (!result.pages.investorRelations && (hrefLower.includes('investor') || link.text.includes('investor relations') || link.text.includes('investors'))) {
        result.pages.investorRelations = link.href;
      } else if (!result.pages.annualReportPdf && (hrefLower.endsWith('.pdf') || link.text.includes('annual report'))) {
        result.pages.annualReportPdf = link.href;
      }
    }

    // Extract email contacts from page HTML
    const content = await page.content();
    const emailMatches = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    const cleanEmails = Array.from(new Set(emailMatches.filter(e => !e.endsWith('.png') && !e.endsWith('.jpg'))));
    result.extractedEmails = cleanEmails;

    return result;
  } catch (err: any) {
    const errorMsg = err?.message || 'Unknown network error';
    result.errorMessage = errorMsg;

    // Log unreachable website to outputs/searched_not_found/
    const logPath = path.join(notFoundOutputDir, 'inaccessible_websites.log');
    const logEntry = `[${new Date().toISOString()}] SR: ${target.srNo} | Company: ${target.companyName} | URL: ${target.website} | Error: ${errorMsg}\n`;
    fs.appendFileSync(logPath, logEntry);

    const jsonPath = path.join(notFoundOutputDir, 'searched_not_found.json');
    let notFoundList: any[] = [];
    if (fs.existsSync(jsonPath)) {
      try { notFoundList = JSON.parse(fs.readFileSync(jsonPath, 'utf8')); } catch {}
    }
    notFoundList.push({
      srNo: target.srNo,
      companyName: target.companyName,
      website: target.website,
      error: errorMsg,
      timestamp: new Date().toISOString()
    });
    fs.writeFileSync(jsonPath, JSON.stringify(notFoundList, null, 2));

    return result;
  }
}
