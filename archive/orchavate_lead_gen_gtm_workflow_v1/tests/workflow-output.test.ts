import { describe, expect, it } from 'vitest';
import { buildResultRow, MASTER_RESULT_COLUMNS } from '../src/modules/reports/index.js';

describe('workflow output data', () => {
  it('includes the required result columns for company-level reporting', () => {
    const row = buildResultRow({
      companyName: 'Example Ltd',
      websiteUrl: 'https://example.com',
      contactPerson: 'Jane Doe',
      emailId: 'jane@example.com',
      websiteVerified: 'Yes',
      scanCompleted: 'Yes',
      screenshotTaken: 'Yes',
      status: 'Completed',
      verifiedBy: 'Automation',
      remarks: 'All checks passed',
    });

    expect(MASTER_RESULT_COLUMNS).toContain('Company Name');
    expect(MASTER_RESULT_COLUMNS).toContain('Website');
    expect(MASTER_RESULT_COLUMNS).toContain('Website Verified');
    expect(MASTER_RESULT_COLUMNS).toContain('Status');
    expect(row['Company Name']).toBe('Example Ltd');
    expect(row['Website']).toBe('https://example.com');
  });
});
