import { CompanyRecord } from '../../types/index.js';
import { WebsiteVerificationResult } from './index.js';

const fetchWithRetry = async (url: string): Promise<Response> => {
  const requestOptions = {
    redirect: 'follow' as const,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; AccessibilityBot/1.0; +https://example.com)',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  };

  let lastResponse: Response | undefined;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, requestOptions);
    lastResponse = response;

    if (response.status === 429 || response.status >= 500) {
      if (attempt < 2) {
        continue;
      }
    }

    return response;
  }

  return lastResponse as Response;
};

export const verifyWebsiteUrl = async (
  record: CompanyRecord,
): Promise<WebsiteVerificationResult> => {
  const reasons: string[] = [];
  let statusCode: number | undefined;
  let title: string | undefined;

  try {
    const response = await fetchWithRetry(record.websiteUrl);
    statusCode = response.status;

    const contentType = response.headers.get('content-type') ?? '';
    if (statusCode >= 400) {
      reasons.push(`HTTP status ${statusCode}`);
    }

    const body = await response.text();
    const titleMatch = body.match(/<title>(.*?)<\/title>/i);
    title = titleMatch ? titleMatch[1].trim() : undefined;

    if (!title && contentType.includes('text/html')) {
      reasons.push('Missing title');
    }
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      reasons.push('Non-HTML response');
    }
  } catch (error) {
    reasons.push(`Fetch failed: ${(error as Error).message}`);
  }

  return {
    companyName: record.companyName,
    websiteUrl: record.websiteUrl,
    verified: reasons.length === 0,
    statusCode,
    title,
    reasons: reasons.length > 0 ? reasons : undefined,
  };
};
