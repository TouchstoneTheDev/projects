import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import * as xlsx from 'xlsx';
import { describe, it, expect, vi } from 'vitest';
import { loadTrackerFile, updateTracker } from '../src/modules/tracker/index.js';
import { verifyWebsiteUrl } from '../src/modules/website/verify.js';

describe('tracker loader and updater', () => {
  it('loads CSV tracker and updates status', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tracker-test-'));
    const file = path.join(dir, 'tracker.csv');
    const csv = ['companyName,websiteUrl,status', 'Acme Corp,https://acme.example.com,', 'Beta Inc,https://beta.example.com,'].join('\n');
    await fs.writeFile(file, csv, 'utf8');

    const records = await loadTrackerFile(file);
    expect(records.length).toBe(2);
    expect(records[0].companyName).toBe('Acme Corp');

    await updateTracker('Acme Corp', { status: 'scanned' }, file);

    const updated = (await fs.readFile(file, 'utf8')).toString();
    expect(updated).toContain('scanned');
  });

  it('loads XLSX tracker and updates status', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tracker-test-'));
    const file = path.join(dir, 'tracker.xlsx');
    const rows = [
      { companyName: 'Gamma LLC', websiteUrl: 'https://gamma.example.com', status: '' },
      { companyName: 'Delta Co', websiteUrl: 'https://delta.example.com', status: '' },
    ];
    const ws = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, file);

    const records = await loadTrackerFile(file);
    expect(records.length).toBe(2);
    expect(records[0].companyName).toBe('Gamma LLC');

    await updateTracker('Gamma LLC', { status: 'scanned' }, file);

    const wb2 = xlsx.readFile(file);
    const ws2 = wb2.Sheets[wb2.SheetNames[0]];
    const out = xlsx.utils.sheet_to_json(ws2, { defval: '' }) as Array<Record<string, unknown>>;
    const gamma = out.find((r) => String(r.companyName ?? r.CompanyName ?? '').includes('Gamma'));
    expect(String(gamma?.status ?? '')).toBe('scanned');
  });

  it('retries after rate limiting and verifies a valid HTML page', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        status: 429,
        ok: false,
        headers: { get: () => 'text/html; charset=utf-8' },
        text: async () => '<html><head><title>Rate limited</title></head></html>',
      })
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        headers: { get: () => 'text/html; charset=utf-8' },
        text: async () => '<html><head><title>Acme Corp</title></head><body>ok</body></html>',
      });

    vi.stubGlobal('fetch', fetchMock);

    const result = await verifyWebsiteUrl({
      companyName: 'Acme Corp',
      websiteUrl: 'https://acme.example.com',
    });

    expect(result.verified).toBe(true);
    expect(result.title).toBe('Acme Corp');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      headers: expect.objectContaining({
        Accept: expect.stringContaining('text/html'),
        'User-Agent': expect.stringContaining('Mozilla/5.0'),
      }),
    });

    vi.unstubAllGlobals();
  });
});
