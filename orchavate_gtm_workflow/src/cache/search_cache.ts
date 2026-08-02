import fs from 'fs';
import path from 'path';

export interface CacheEntry {
  companyName: string;
  resolvedUrl: string;
  confidence: 'HIGH' | 'LOW' | 'FAILED';
  timestamp: number;
}

export class SearchCache {
  private cache: Record<string, CacheEntry> = {};
  private cacheFilePath: string;
  private ttlMs: number;
  private enabled: boolean;

  constructor(cacheDir: string, ttlMs: number = 7 * 24 * 60 * 60 * 1000, enabled: boolean = true) {
    this.cacheFilePath = path.join(cacheDir, '.search_cache.json');
    this.ttlMs = ttlMs;
    this.enabled = enabled;
    this.loadCache();
  }

  private loadCache(): void {
    if (!this.enabled) return;
    try {
      if (fs.existsSync(this.cacheFilePath)) {
        const raw = fs.readFileSync(this.cacheFilePath, 'utf8');
        this.cache = JSON.parse(raw);
      }
    } catch {
      this.cache = {};
    }
  }

  public saveCache(): void {
    if (!this.enabled) return;
    try {
      const dir = path.dirname(this.cacheFilePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.cacheFilePath, JSON.stringify(this.cache, null, 2), 'utf8');
    } catch {
      // Ignore write errors
    }
  }

  public get(companyName: string): CacheEntry | null {
    if (!this.enabled) return null;
    const key = companyName.trim().toLowerCase();
    const entry = this.cache[key];
    if (!entry) return null;

    // Check TTL
    if (Date.now() - entry.timestamp > this.ttlMs) {
      delete this.cache[key];
      return null;
    }
    return entry;
  }

  public set(companyName: string, resolvedUrl: string, confidence: 'HIGH' | 'LOW' | 'FAILED'): void {
    if (!this.enabled) return;
    const key = companyName.trim().toLowerCase();
    this.cache[key] = {
      companyName,
      resolvedUrl,
      confidence,
      timestamp: Date.now(),
    };
    this.saveCache();
  }
}
