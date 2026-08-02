import fs from 'fs';
import path from 'path';
import { Page } from 'playwright';
import { EmailDiscoveryResult, EmailField, EmailStatus } from '../types.js';

export async function discoverEmailsAndEvidence(
  page: Page,
  companyName: string,
  targetUrl: string,
  screenshotsDir: string
): Promise<EmailDiscoveryResult> {
  const result: EmailDiscoveryResult = {
    primaryEmail: {
      address: '',
      type: 'primary',
      label: 'Primary Contact Email',
      status: 'Not Found',
    },
    regardingAccessibility: [],
    overallStatus: 'Not Found',
    evidenceScreenshots: [],
  };

  if (!targetUrl || !targetUrl.startsWith('http')) {
    return result;
  }

  let domain = 'company.com';
  try {
    domain = new URL(targetUrl).hostname.replace(/^www\./, '');
  } catch {}

  const pagesToVisit: Array<{ label: string; url: string }> = [
    { label: 'Homepage', url: targetUrl }
  ];

  try {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Discover up to 3 extra contact / grievance pages
    const links = await page.$$eval('a[href]', (anchors) => 
      anchors.map(a => ({ href: a.href, text: a.textContent?.trim().toLowerCase() || '' }))
    );

    const baseUrl = new URL(targetUrl).origin;
    for (const link of links) {
      if (pagesToVisit.length >= 4) break;
      if (!link.href.startsWith(baseUrl) && !link.href.startsWith('/')) continue;
      const hrefLower = link.href.toLowerCase();

      if (
        hrefLower.includes('/contact') || link.text.includes('contact') ||
        hrefLower.includes('grievance') || link.text.includes('grievance') ||
        hrefLower.includes('investor') || link.text.includes('investor relations') ||
        hrefLower.includes('statutory') || link.text.includes('compliance')
      ) {
        if (!pagesToVisit.some(p => p.url === link.href)) {
          pagesToVisit.push({ label: link.text || 'Contact Page', url: link.href });
        }
      }
    }
  } catch {}

  const discoveredEmails: Array<{ email: string; pageUrl: string; pageLabel: string; isGrievance: boolean }> = [];

  for (const p of pagesToVisit) {
    try {
      if (page.url() !== p.url) {
        await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 12000 });
      }

      const content = await page.content();
      
      // Extract mailto: links
      const mailtoMatches = await page.$$eval('a[href^="mailto:"]', anchors => 
        anchors.map(a => a.href.replace(/^mailto:/i, '').trim().split('?')[0])
      );

      // Extract raw regex text matches
      const rawMatches = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      
      const allFound = Array.from(new Set([...mailtoMatches, ...rawMatches]))
        .filter(e => !e.endsWith('.png') && !e.endsWith('.jpg') && !e.endsWith('.svg'));

      for (const email of allFound) {
        const lowerEmail = email.toLowerCase();
        const lowerContent = content.toLowerCase();
        const isGrievance = lowerEmail.includes('grievance') || lowerEmail.includes('compliance') || lowerEmail.includes('nodal') || lowerContent.includes('investor grievance') || lowerContent.includes('compliance officer');

        if (!discoveredEmails.some(e => e.email.toLowerCase() === lowerEmail)) {
          discoveredEmails.push({ email, pageUrl: p.url, pageLabel: p.label, isGrievance });

          // Take evidence screenshot of where email was found
          const sanitizedCompany = companyName.replace(/[^a-zA-Z0-9]/g, '_');
          const screenshotName = `${sanitizedCompany}_EmailEvidence_${p.pageLabel.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
          const screenshotPath = path.join(screenshotsDir, screenshotName);
          try {
            await page.screenshot({ path: screenshotPath });
            result.evidenceScreenshots.push(screenshotPath);
          } catch {}
        }
      }
    } catch {}
  }

  // Categorize Emails
  if (discoveredEmails.length > 0) {
    result.overallStatus = 'Verified';

    const primaryObj = discoveredEmails.find(e => !e.isGrievance) || discoveredEmails[0];
    result.primaryEmail = {
      address: primaryObj.email,
      type: 'primary',
      label: 'Primary Contact Email',
      status: 'Verified',
      sourceUrl: primaryObj.pageUrl,
    };

    const grievanceObj = discoveredEmails.find(e => e.isGrievance);
    const regardingList: EmailField[] = [];

    if (grievanceObj) {
      regardingList.push({
        address: grievanceObj.email,
        type: 'compliance_grievance',
        label: 'Investor Grievance / Compliance Officer Email',
        status: 'Verified',
        sourceUrl: grievanceObj.pageUrl,
      });
    }

    regardingList.push({
      address: primaryObj.email,
      type: 'general',
      label: 'General Contact Email',
      status: 'Verified',
      sourceUrl: primaryObj.pageUrl,
    });

    result.regardingAccessibility = regardingList;

  } else {
    // Guessed Email Fallback
    result.overallStatus = 'Unverified - guessed pattern';
    const guessedPrimary = `info@${domain}`;
    const guessedContact = `contact@${domain}`;

    result.primaryEmail = {
      address: guessedPrimary,
      type: 'primary',
      label: 'Primary Contact Email',
      status: 'Unverified - guessed pattern',
    };

    result.regardingAccessibility = [
      {
        address: guessedPrimary,
        type: 'general',
        label: 'General Contact Email (Guessed Pattern)',
        status: 'Unverified - guessed pattern',
      },
      {
        address: guessedContact,
        type: 'compliance_grievance',
        label: 'Investor Grievance Email (Guessed Pattern)',
        status: 'Unverified - guessed pattern',
      }
    ];

    // Screenshot contact page showing NO visible email for evidence
    const sanitizedCompany = companyName.replace(/[^a-zA-Z0-9]/g, '_');
    const screenshotName = `${sanitizedCompany}_EmailEvidence_NotFound_ContactPage.png`;
    const screenshotPath = path.join(screenshotsDir, screenshotName);
    try {
      await page.screenshot({ path: screenshotPath });
      result.evidenceScreenshots.push(screenshotPath);
    } catch {}
  }

  return result;
}
