import { zyteSearch, fetchSmart } from './zyte_client.js';
import { isBotBlock } from './bot_block.js';

export interface VerificationResult {
  linkedinUrl: string | null;
  independentlyConfirmed: boolean;
  confirmedTitle: string | null;
  confirmedEmail: string | null;
}

/**
 * Part 4: LinkedIn lookup + independent re-confirmation via Zyte
 * No Apollo/Hunter/Snov — verification is a second, independently-worded Zyte search to see if another source agrees on the same person/title.
 */
export async function enrichAndVerifyPOC(
  personName: string,
  companyName: string
): Promise<VerificationResult> {
  if (!personName || personName === 'Not Found') {
    return {
      linkedinUrl: null,
      independentlyConfirmed: false,
      confirmedTitle: null,
      confirmedEmail: null,
    };
  }

  console.log(`  └─ Re-confirming POC: "${personName}" at "${companyName}" via Zyte...`);

  // Step 1: LinkedIn URL Lookup
  const liResults = await zyteSearch(`${personName} ${companyName} LinkedIn`);
  const linkedinUrl = liResults.find(r => r.url && r.url.includes('linkedin.com/in/'))?.url ?? null;
  if (linkedinUrl) {
    console.log(`     ✓ Found LinkedIn Profile: ${linkedinUrl}`);
  }

  // Step 2: Independent Re-confirmation Search
  const confirmQuery = `"${personName}" "${companyName}" email OR contact OR designation`;
  const confirmResults = await zyteSearch(confirmQuery);

  let confirmPage: string | null = null;
  if (confirmResults.length > 0) {
    confirmPage = await fetchSmart(confirmResults[0].url);
  }

  let independentlyConfirmed = false;
  let confirmedTitle: string | null = null;
  let confirmedEmail: string | null = null;

  if (confirmPage && !isBotBlock(confirmPage)) {
    const lowerPage = confirmPage.toLowerCase();
    const lowerName = personName.toLowerCase();
    const lowerCompany = companyName.toLowerCase().replace(/ (limited|ltd|inc|corp)\.?$/i, '');

    if (lowerPage.includes(lowerName) && lowerPage.includes(lowerCompany)) {
      independentlyConfirmed = true;
      console.log(`     ✓ Independently re-confirmed "${personName}" at "${companyName}"`);

      // Extract email if present
      const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
      const emails = confirmPage.match(emailRegex) || [];
      const cleanEmail = emails.find(e => !e.endsWith('.png') && !e.endsWith('.jpg') && !e.includes('example.com')) || null;
      if (cleanEmail) confirmedEmail = cleanEmail;
    }
  }

  return {
    linkedinUrl,
    independentlyConfirmed,
    confirmedTitle,
    confirmedEmail,
  };
}
