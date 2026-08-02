export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
}

export interface SearchProvider {
  name: string;
  search(query: string): Promise<SearchResult[]>;
}

const IGNORED_DOMAINS = [
  'wikipedia.org',
  'moneycontrol.com',
  'groww.in',
  'screener.in',
  'linkedin.com',
  'facebook.com',
  'twitter.com',
  'x.com',
  'instagram.com',
  'crunchbase.com',
  'justdial.com',
  'indiamart.com',
  'tradeindia.com',
  'zaubacorp.com',
  'tofler.in',
  'companydetails.in',
  'dnb.com',
  'economictimes.indiatimes.com',
  'indiatimes.com',
  'livemint.com',
  'business-standard.com',
  'financialexpress.com',
  'thehindubusinessline.com',
  'reuters.com',
  'bloomberg.com',
  'ndtv.com',
  'sebi.gov.in',
  'mca.gov.in',
  'rbi.org.in',
  'nseindia.com',
  'bseindia.com',
  'youtube.com',
  'glassdoor.com',
  'ambitionbox.com',
  'indeed.com',
];

export function isIgnoredDomain(urlStr: string): boolean {
  try {
    let lower = urlStr.trim().toLowerCase();
    if (lower.endsWith('.pdf')) return true;
    if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
      lower = `https://${lower}`;
    }
    const parsed = new URL(lower);
    const hostname = parsed.hostname.replace(/^www\./, '');

    // Check regulator / government TLDs
    if (hostname.endsWith('.gov.in') || hostname.endsWith('.nic.in') || hostname.endsWith('.gov')) {
      return true;
    }

    // Check explicit domain blacklist
    for (const d of IGNORED_DOMAINS) {
      if (hostname === d || hostname.endsWith(`.${d}`)) {
        return true;
      }
    }

    return false;
  } catch {
    return true; // Treat invalid URLs as ignored
  }
}

export class DuckDuckGoSearchProvider implements SearchProvider {
  public name = 'DuckDuckGo HTML';

  public async search(query: string): Promise<SearchResult[]> {
    try {
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) return [];

      const html = await response.text();
      const results: SearchResult[] = [];

      // Extract results from HTML using regex for link tags and result snippets
      const linkRegex = /<a class="result__url" href="([^"]+)">/g;
      const snippetRegex = /<a class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/g;

      let match;
      const urls: string[] = [];
      while ((match = linkRegex.exec(html)) !== null) {
        let rawUrl = match[1].trim();
        // DuckDuckGo redirects links like /l/?uddg=...
        if (rawUrl.includes('uddg=')) {
          const uParam = new URLSearchParams(rawUrl.substring(rawUrl.indexOf('?'))).get('uddg');
          if (uParam) rawUrl = decodeURIComponent(uParam);
        }
        if (rawUrl.startsWith('//')) rawUrl = `https:${rawUrl}`;
        urls.push(rawUrl);
      }

      for (const u of urls) {
        if (u && u.startsWith('http')) {
          results.push({
            url: u,
            title: '',
            snippet: '',
          });
        }
      }

      return results;
    } catch {
      return [];
    }
  }
}

export class MockSearchProvider implements SearchProvider {
  public name = 'Mock Search Provider';
  private mockMap: Record<string, SearchResult[]> = {};

  constructor(mockMap: Record<string, SearchResult[]> = {}) {
    this.mockMap = mockMap;
  }

  public setMock(query: string, results: SearchResult[]) {
    this.mockMap[query.toLowerCase()] = results;
  }

  public async search(query: string): Promise<SearchResult[]> {
    const q = query.toLowerCase();
    for (const key of Object.keys(this.mockMap)) {
      if (q.includes(key.toLowerCase())) {
        return this.mockMap[key];
      }
    }
    return [];
  }
}
