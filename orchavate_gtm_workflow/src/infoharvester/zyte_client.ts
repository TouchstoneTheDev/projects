import { Buffer } from 'node:buffer';

export function getZyteAuthHeader(): string {
  const ZYTE_API_KEY = process.env.ZYTE_API_KEY || process.env.ZYTE_KEY || '';
  if (!ZYTE_API_KEY) {
    console.warn(`⚠️ Warning: ZYTE_API_KEY is not set in process.env or .env file.`);
  }
  return 'Basic ' + Buffer.from(`${ZYTE_API_KEY}:`).toString('base64');
}

export async function zyteFetch(url: string): Promise<string> {
  const ZYTE_API_KEY = process.env.ZYTE_API_KEY || process.env.ZYTE_KEY || '';
  if (!ZYTE_API_KEY) return '';

  const authHeader = 'Basic ' + Buffer.from(`${ZYTE_API_KEY}:`).toString('base64');
  try {
    const res = await fetch('https://api.zyte.com/v1/extract', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, httpResponseBody: true }),
    });

    if (res.status === 401) {
      if (!(zyteFetch as any)._warned401) {
        console.error(`\n❌ ZYTE API AUTHENTICATION ERROR (401 Unauthorized): Invalid ZYTE_API_KEY ("${ZYTE_API_KEY.slice(0, 4)}...").`);
        console.error(`   Please check your Zyte API key in .env or pass --zyte-key YOUR_KEY.\n`);
        (zyteFetch as any)._warned401 = true;
      }
      return '';
    }

    if (!res.ok) {
      console.warn(`[Zyte API] httpResponseBody request failed (${res.status}) for ${url}`);
      return '';
    }

    const json = (await res.json()) as any;
    if (json.httpResponseBody) {
      return Buffer.from(json.httpResponseBody, 'base64').toString('utf-8');
    }
    return '';
  } catch (err: any) {
    console.warn(`[Zyte API] httpResponseBody error for ${url}: ${err?.message}`);
    return '';
  }
}

export async function zyteFetchRendered(url: string): Promise<string> {
  const ZYTE_API_KEY = process.env.ZYTE_API_KEY || process.env.ZYTE_KEY || '';
  if (!ZYTE_API_KEY) return '';

  const authHeader = 'Basic ' + Buffer.from(`${ZYTE_API_KEY}:`).toString('base64');
  try {
    const res = await fetch('https://api.zyte.com/v1/extract', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, browserHtml: true }),
    });

    if (!res.ok) {
      console.warn(`[Zyte API] browserHtml request failed (${res.status}) for ${url}`);
      return '';
    }

    const json = (await res.json()) as any;
    return json.browserHtml || '';
  } catch (err: any) {
    console.warn(`[Zyte API] browserHtml error for ${url}: ${err?.message}`);
    return '';
  }
}

export async function zyteSearch(query: string): Promise<{ url: string; title: string }[]> {
  const ZYTE_API_KEY = process.env.ZYTE_API_KEY || process.env.ZYTE_KEY || '';
  if (!ZYTE_API_KEY) return [];

  const authHeader = 'Basic ' + Buffer.from(`${ZYTE_API_KEY}:`).toString('base64');
  try {
    const res = await fetch('https://api.zyte.com/v1/extract', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        serp: true,
        serpOptions: { extractFrom: 'httpResponseBody' },
      }),
    });

    if (res.status === 401) {
      if (!(zyteSearch as any)._warned401) {
        console.error(`\n❌ ZYTE API AUTHENTICATION ERROR (401 Unauthorized): Invalid ZYTE_API_KEY ("${ZYTE_API_KEY.slice(0, 4)}...").`);
        console.error(`   Please check your Zyte API key in .env or pass --zyte-key YOUR_KEY.\n`);
        (zyteSearch as any)._warned401 = true;
      }
      return [];
    }

    if (!res.ok) {
      console.warn(`[Zyte Search] SERP request failed (${res.status}) for query: "${query}"`);
      return [];
    }

    const json = (await res.json()) as any;
    const organic = json.serp?.organicResults ?? [];
    return organic.map((r: any) => ({
      url: r.url || r.link || '',
      title: r.name || r.title || ''
    })).filter((item: any) => item.url && item.url.startsWith('http'));
  } catch (err: any) {
    console.warn(`[Zyte Search] error for query "${query}": ${err?.message}`);
    return [];
  }
}

/**
 * Fallback chain used everywhere InfoHarvester needs page content:
 * Tries cheap httpResponseBody first; escalates to browserHtml if page content is < 200 chars.
 */
export async function fetchSmart(url: string): Promise<string> {
  if (!url) return '';
  let text = await zyteFetch(url);
  if (text.trim().length < 200) {
    console.log(`  └─ Page content short (${text.trim().length} chars). Escalating to browserHtml JS rendering...`);
    text = await zyteFetchRendered(url);
  }
  return text;
}
