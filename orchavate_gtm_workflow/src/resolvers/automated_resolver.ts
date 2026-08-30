import { CompanyInput } from '../types.js';
import { WebsiteResolver, ResolutionResult } from './resolver_types.js';
import { SearchProvider, DuckDuckGoSearchProvider, isIgnoredDomain } from '../search/search_provider.js';
import { SearchCache } from '../cache/search_cache.js';
import { normalizeDomain } from '../website_resolver.js';

export class AutomatedWebsiteResolver implements WebsiteResolver {
  private searchProvider: SearchProvider;
  private cache?: SearchCache;

  constructor(searchProvider?: SearchProvider, cache?: SearchCache) {
    this.searchProvider = searchProvider || new DuckDuckGoSearchProvider();
    this.cache = cache;
  }

  public async resolve(company: CompanyInput): Promise<ResolutionResult> {
    const startTime = Date.now();
    const companyName = company.companyName.trim();
    const searchQueries: string[] = [
      `"${companyName}" official website`,
      `"${companyName}" India`,
      `"${companyName}" SEBI`,
    ];

    // Check Cache first
    if (this.cache) {
      const cached = this.cache.get(companyName);
      if (cached) {
        return {
          resolvedUrl: cached.resolvedUrl,
          source: 'automated-search',
          confidence: cached.confidence,
          hasConflict: false,
          candidateDomains: cached.resolvedUrl ? [cached.resolvedUrl] : [],
          searchQueries: ['CACHE_HIT'],
          searchDurationMs: Date.now() - startTime,
          reason: `Resolved via search cache (Confidence: ${cached.confidence})`,
        };
      }
    }

    const candidateDomains: string[] = [];
    const domainCounts: Record<string, number> = {};
    const errors: string[] = [];

    // Run multi-query search
    for (const query of searchQueries) {
      try {
        const results = await this.searchProvider.search(query);
        for (const res of results) {
          if (!res.url || isIgnoredDomain(res.url)) continue;
          const normDomain = normalizeDomain(res.url);
          if (normDomain && !isIgnoredDomain(normDomain)) {
            const fullUrl = res.url.startsWith('http') ? res.url : `https://${normDomain}`;
            if (!candidateDomains.includes(fullUrl)) {
              candidateDomains.push(fullUrl);
            }
            domainCounts[normDomain] = (domainCounts[normDomain] || 0) + 1;
          }
        }
      } catch (err: any) {
        errors.push(`Query "${query}" error: ${err?.message || String(err)}`);
      }
    }

    // Evaluate candidates
    if (candidateDomains.length === 0) {
      const result: ResolutionResult = {
        resolvedUrl: '',
        source: 'automated-search',
        confidence: 'FAILED',
        hasConflict: false,
        candidateDomains: [],
        searchQueries,
        searchDurationMs: Date.now() - startTime,
        reason: 'Automated search returned no valid candidate domains after filtering ignored sources',
      };
      if (this.cache) this.cache.set(companyName, '', 'FAILED');
      return result;
    }

    // Pick top domain candidate
    let bestDomain = candidateDomains[0];
    let confidence: 'HIGH' | 'LOW' | 'FAILED' = 'LOW';
    const normBest = normalizeDomain(bestDomain);

    // If multiple search queries yielded the exact same domain, confidence is HIGH
    if (domainCounts[normBest] && domainCounts[normBest] >= 2) {
      confidence = 'HIGH';
    }

    // Quick verification: check if domain HTML title contains company keywords
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(bestDomain, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const titleText = titleMatch ? titleMatch[1].toLowerCase() : '';
        const nameTokens = companyName.toLowerCase().split(/\s+/).filter(t => t.length > 3);

        const matchesToken = nameTokens.some(t => titleText.includes(t));
        if (matchesToken && confidence !== 'HIGH') {
          confidence = 'HIGH';
        }
      }
    } catch (e: any) {
      // Fetch failed, keep confidence LOW or downgrade if unusable
    }

    const finalResult: ResolutionResult = {
      resolvedUrl: bestDomain,
      source: 'automated-search',
      confidence,
      hasConflict: false,
      selfSearchUrl: bestDomain,
      candidateDomains,
      searchQueries,
      searchDurationMs: Date.now() - startTime,
      reason: `Automated search selected domain "${bestDomain}" with ${confidence} confidence`,
    };

    if (this.cache) {
      this.cache.set(companyName, bestDomain, confidence);
    }

    return finalResult;
  }
}
