import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import * as xlsx from 'xlsx';
import { describe, it, expect } from 'vitest';
import { loadTrackerFile, updateTracker } from '../src/modules/tracker/index.js';

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

  it('keeps company records that only have a company name and email address', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tracker-test-'));
    const file = path.join(dir, 'tracker-with-email.xlsx');
    const rows = [
      { companyName: '5Paisa Capital Limited', emailId: 'teamcompliance@5paisa.com', websiteUrl: '' },
      { companyName: 'Acme Broker Pvt Ltd', emailId: 'hello@acmebroker.in', websiteUrl: '' },
    ];
    const ws = xlsx.utils.json_to_sheet(rows);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, file);

    const records = await loadTrackerFile(file);
    expect(records).toHaveLength(2);
    expect(records[0].companyName).toBe('5Paisa Capital Limited');
    expect(records[0].emailId).toBe('teamcompliance@5paisa.com');
    expect(records[0].websiteUrl).toBe('');
  });
});
