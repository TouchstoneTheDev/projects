import { CompanyInput } from '../types.js';
import { WebsiteResolver, ResolutionResult } from './resolver_types.js';
import { AutomatedWebsiteResolver } from './automated_resolver.ts';
import { ReadymadeWebsiteResolver } from './readymade_resolver.ts';
import { normalizeDomain } from '../website_resolver.js';

export class HybridWebsiteResolver implements WebsiteResolver {
  private automatedResolver: AutomatedWebsiteResolver;
  private readymadeResolver: ReadymadeWebsiteResolver;

  constructor(automatedResolver: AutomatedWebsiteResolver, readymadeResolver: ReadymadeWebsiteResolver) {
    this.automatedResolver = automatedResolver;
    this.readymadeResolver = readymadeResolver;
  }

  public async resolve(company: CompanyInput): Promise<ResolutionResult> {
    const startTime = Date.now();
    const autoResult = await this.automatedResolver.resolve(company);
    const readymadeResult = await this.readymadeResolver.resolve(company);

    const autoUrl = autoResult.resolvedUrl;
    const readyUrl = readymadeResult.resolvedUrl;

    if (autoUrl && readyUrl) {
      const autoNorm = normalizeDomain(autoUrl);
      const readyNorm = normalizeDomain(readyUrl);

      if (autoNorm === readyNorm) {
        return {
          resolvedUrl: autoUrl,
          source: 'hybrid-agreed',
          confidence: 'HIGH',
          hasConflict: false,
          selfSearchUrl: autoUrl,
          readymadeUrl: readyUrl,
          candidateDomains: autoResult.candidateDomains,
          searchQueries: autoResult.searchQueries,
          searchDurationMs: Date.now() - startTime,
          reason: `Both automated search and readymade mapping agreed on domain "${autoNorm}"`,
        };
      } else {
        // Flag conflict
        return {
          resolvedUrl: '',
          source: 'automated-search',
          confidence: 'LOW',
          hasConflict: true,
          conflictDetails: `Conflict flagged - Automated search ("${autoUrl}") and Readymade mapping ("${readyUrl}") disagree`,
          selfSearchUrl: autoUrl,
          readymadeUrl: readyUrl,
          candidateDomains: autoResult.candidateDomains,
          searchQueries: autoResult.searchQueries,
          searchDurationMs: Date.now() - startTime,
          reason: `Domain conflict detected between automated search (${autoUrl}) and readymade mapping (${readyUrl})`,
        };
      }
    }

    if (autoUrl && autoResult.confidence !== 'FAILED') {
      return autoResult;
    }

    if (readyUrl && readymadeResult.confidence !== 'FAILED') {
      return {
        resolvedUrl: readyUrl,
        source: 'hybrid-fallback',
        confidence: 'LOW',
        hasConflict: false,
        readymadeUrl: readyUrl,
        candidateDomains: [readyUrl],
        searchQueries: autoResult.searchQueries,
        searchDurationMs: Date.now() - startTime,
        reason: `Fallback to readymade list URL ("${readyUrl}") because automated search failed`,
      };
    }

    return {
      resolvedUrl: '',
      source: 'automated-search',
      confidence: 'FAILED',
      hasConflict: false,
      candidateDomains: autoResult.candidateDomains,
      searchQueries: autoResult.searchQueries,
      searchDurationMs: Date.now() - startTime,
      reason: 'Both automated search and readymade mapping failed to resolve a valid URL',
    };
  }
}
