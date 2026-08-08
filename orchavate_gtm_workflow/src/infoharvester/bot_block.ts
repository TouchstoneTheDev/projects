export const BOT_BLOCK_SIGNATURES = [
  'anomaly detected',
  'are you human',
  'i am human',
  'hcaptcha',
  'recaptcha',
  'captcha',
  'access denied',
  'checking your browser',
  'cloudflare',
  'attention required',
  'request unblock',
  'bot detection',
  'unusual traffic',
  'verify you are human',
  'cf-challenge',
  'you reached this page when trying to access',
  'incident id',
  'we apologize for the inconvenience',
  'malicious behavior which originated',
];

/**
 * Part 2: Bot-Block Gate
 * Checks if the fetched page text contains bot protection / CAPTCHA signatures.
 * Returns true if blocked; blocked pages are skipped during POC extraction.
 */
export function isBotBlock(pageText: string): boolean {
  if (!pageText) return false;
  const t = pageText.toLowerCase();
  return BOT_BLOCK_SIGNATURES.some(sig => t.includes(sig));
}
