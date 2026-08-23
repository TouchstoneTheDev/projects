import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../../core/config/index.js';
import { CompanyResultRow } from '../../types/index.js';

export const ensureWorkflowFolders = async (): Promise<void> => {
  const folders = [
    'axe',
    'company',
    'contact_not_found',
    'csv',
    'duplicate',
    'emails',
    'failed',
    'html',
    'invalid_domain',
    'json',
    'lighthouse',
    'markdown',
    'redirect',
    'reports',
    'scan_failed',
    'screenshots',
    'skipped',
    'tracker',
    'website_not_found',
  ];

  await Promise.all(
    folders.map((folder) => fs.mkdir(path.resolve(config.OUTPUT_DIR, folder), { recursive: true })),
  );
};

export const writeMasterResultCsv = async (rows: CompanyResultRow[]): Promise<string> => {
  const csvPath = path.resolve(config.OUTPUT_DIR, 'tracker', 'master_result.csv');
  const header = [
    'Sr. No.',
    'Assigned To',
    'Company Name',
    'Website',
    'Contact Person',
    'Email ID',
    'Website Verified',
    'Scan Completed',
    'Screenshot Taken',
    'Status',
    'Verified By',
    'Remarks',
  ].join(',');

  const lines = rows.map((row) =>
    [
      row['Sr. No.'],
      row['Assigned To'] ?? '',
      row['Company Name'],
      row.Website,
      row['Contact Person'] ?? '',
      row['Email ID'] ?? '',
      row['Website Verified'],
      row['Scan Completed'],
      row['Screenshot Taken'],
      row.Status,
      row['Verified By'] ?? '',
      row.Remarks ?? '',
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(','),
  );

  await fs.writeFile(csvPath, [header, ...lines].join('\n'), 'utf8');
  return csvPath;
};
