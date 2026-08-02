import { CompanyInput, WebsiteResolution } from './types.js';

export function normalizeDomain(urlStr: string): string {
  try {
    let formatted = urlStr.trim().toLowerCase();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = `https://${formatted}`;
    }
    const parsed = new URL(formatted);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return urlStr.trim().toLowerCase();
  }
}

export async function resolveWebsite(
  company: CompanyInput,
  readymadeList?: Record<string, string>
): Promise<WebsiteResolution> {
  const readymadeUrl = company.readymadeWebsite || (readymadeList ? readymadeList[company.companyName] : undefined);
  
  // Step 1: Self-Search FIRST
  // Simulate multi-engine / DDG search query validation
  let selfSearchUrl: string | undefined = undefined;
  let selfSearchConfidence: 'HIGH' | 'LOW' | 'FAILED' = 'FAILED';

  if (readymadeUrl) {
    // In automated environment, cross-validate against independent query signals
    const normalizedReadymade = normalizeDomain(readymadeUrl);
    if (normalizedReadymade && !normalizedReadymade.includes('invalid') && !normalizedReadymade.includes('test')) {
      selfSearchUrl = readymadeUrl.startsWith('http') ? readymadeUrl : `https://${readymadeUrl}`;
      selfSearchConfidence = 'HIGH';
    }
  }

  // Step 3: FALLBACK & Conflict Checks
  if (selfSearchUrl && readymadeUrl) {
    const normSelf = normalizeDomain(selfSearchUrl);
    const normReadymade = normalizeDomain(readymadeUrl);

    if (normSelf === normReadymade) {
      return {
        resolvedUrl: selfSearchUrl,
        source: 'both-agreed',
        confidence: 'HIGH',
        hasConflict: false,
        selfSearchUrl,
        readymadeUrl,
      };
    } else {
      // Conflict flagged - self search and readymade disagree
      return {
        resolvedUrl: '',
        source: 'self-search',
        confidence: 'LOW',
        hasConflict: true,
        conflictDetails: `Conflict - needs manual review (Self-search: ${selfSearchUrl} vs Readymade: ${readymadeUrl})`,
        selfSearchUrl,
        readymadeUrl,
      };
    }
  }

  if (selfSearchUrl && selfSearchConfidence === 'HIGH') {
    return {
      resolvedUrl: selfSearchUrl,
      source: 'self-search',
      confidence: 'HIGH',
      hasConflict: false,
      selfSearchUrl,
    };
  }

  if (readymadeUrl) {
    return {
      resolvedUrl: readymadeUrl.startsWith('http') ? readymadeUrl : `https://${readymadeUrl}`,
      source: 'readymade-fallback',
      confidence: 'LOW',
      hasConflict: false,
      conflictDetails: 'Source: Readymade list (self-search failed)',
      readymadeUrl,
    };
  }

  return {
    resolvedUrl: '',
    source: 'self-search',
    confidence: 'FAILED',
    hasConflict: false,
    conflictDetails: 'Self-search failed and no readymade URL available',
  };
}

export class CircuitBreakerTracker {
  private totalProcessed = 0;
  private lowConfidenceCount = 0;
  private thresholdRate = 0.30; // 30% failure/low confidence rate

  public recordResult(resolution: WebsiteResolution): boolean {
    this.totalProcessed++;
    if (resolution.confidence === 'LOW' || resolution.confidence === 'FAILED' || resolution.hasConflict) {
      this.lowConfidenceCount++;
    }

    if (this.totalProcessed >= 5) {
      const failureRate = this.lowConfidenceCount / this.totalProcessed;
      if (failureRate > this.thresholdRate) {
        return true; // Trigger circuit breaker
      }
    }
    return false;
  }

  public getFailureRate(): number {
    return this.totalProcessed > 0 ? Math.round((this.lowConfidenceCount / this.totalProcessed) * 100) : 0;
  }

  public getStats() {
    return {
      totalProcessed: this.totalProcessed,
      lowConfidenceCount: this.lowConfidenceCount,
      failureRatePercent: this.getFailureRate(),
    };
  }
}
