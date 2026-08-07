import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { maskApiKey, enrichPocWithApollo } from './apollo_discoverer.js';
import { parseInputFile } from './parsers/input_parser.js';

export interface ApolloContactRaw {
  id?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  title?: string;
  email?: string;
  organization?: {
    name?: string;
    website_url?: string;
    primary_domain?: string;
  };
  domain?: string;
}

export async function pullAndExportApolloContacts(apiKey: string, outputDir: string = process.cwd(), perPage: number = 100): Promise<string> {
  if (!apiKey) {
    throw new Error('APOLLO_API_KEY is required to pull contacts directly from Apollo API.');
  }

  console.log(`\n=====================================================`);
  console.log(`🚀 Orchavate GTM — Apollo API Contact Importer`);
  console.log(`└─ Apollo API Key Status: ${maskApiKey(apiKey)}`);
  console.log(`=====================================================\n`);

  let url = 'https://api.apollo.io/v1/contacts/search';
  const headers = {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'X-Api-Key': apiKey,
  };

  let payload: any = {
    per_page: perPage,
  };

  let response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (response.status === 404) {
    url = 'https://api.apollo.io/v1/mixed_people/search';
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Apollo API request failed (${response.status}): ${errText}`);
  }

  const resData = (await response.json()) as any;
  const contacts: ApolloContactRaw[] = resData.contacts || resData.people || [];

  console.log(`✓ Successfully pulled ${contacts.length} contact records from Apollo API.`);

  const headersSchema = [
    'Sr. No.',
    'Assigned To',
    'Company Name',
    'Website',
    'Website Verified',
    'Scan Completed',
    'Screenshot Taken',
    'Wave Score',
    'Axe Score',
    'LH Score',
    'Screenshot link',
    'Contact Person 1',
    'Designation 1',
    'Email ID 1',
    'Contact Person 2',
    'Designation 2',
    'Email ID 2'
  ];

  const rows = contacts.map((c, idx) => {
    const org = c.organization || {};
    const compName = org.name || '';
    const website = org.website_url || org.primary_domain || c.domain || '';
    const firstName = c.first_name || '';
    const lastName = c.last_name || '';
    const personName = `${firstName} ${lastName}`.trim() || c.name || 'N/A';
    const title = c.title || 'N/A';
    const email = c.email || 'Not Found';

    return {
      'Sr. No.': idx + 1,
      'Assigned To': 'Unassigned',
      'Company Name': compName,
      'Website': website || 'N/A',
      'Website Verified': website ? 'Yes' : 'No',
      'Scan Completed': 'No',
      'Screenshot Taken': 'No',
      'Wave Score': 0,
      'Axe Score': 0,
      'LH Score': 0,
      'Screenshot link': 'N/A',
      'Contact Person 1': personName,
      'Designation 1': title,
      'Email ID 1': email,
      'Contact Person 2': 'N/A',
      'Designation 2': 'N/A',
      'Email ID 2': 'Not Found'
    };
  });

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Export CSV
  const csvLines: string[] = [headersSchema.join(',')];
  for (const row of rows) {
    const values = headersSchema.map(h => `"${String((row as any)[h] || '').replace(/"/g, '""')}"`);
    csvLines.push(values.join(','));
  }
  const csvPath = path.join(outputDir, 'apollo_audit_leads.csv');
  fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf8');

  // Export Excel
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headersSchema });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Apollo Leads');
  const excelPath = path.join(outputDir, 'apollo_audit_leads.xlsx');
  XLSX.writeFile(workbook, excelPath);

  console.log(`\n=====================================================`);
  console.log(`🎉 Success! Exported 17-Column Apollo Audit Leads:`);
  console.log(`📊 Excel: "${excelPath}"`);
  console.log(`📑 CSV: "${csvPath}"`);
  console.log(`=====================================================\n`);

  return excelPath;
}

/**
 * Take an existing Input Excel file (e.g. nse_tracker_enriched_clearbit.xlsx),
 * run Apollo API enrichment for every row, and output enriched 17-column Excel & CSV files.
 */
export async function enrichExcelDatasetWithApollo(inputExcelPath: string, apiKey: string): Promise<string> {
  const companies = parseInputFile(inputExcelPath);
  console.log(`\n=====================================================`);
  console.log(`🚀 Enriching Input Dataset with Apollo API Contacts`);
  console.log(`📁 Input File: "${path.basename(inputExcelPath)}"`);
  console.log(`📊 Target Rows: ${companies.length}`);
  console.log(`└─ Apollo API Key: ${maskApiKey(apiKey)}`);
  console.log(`=====================================================\n`);

  const headersSchema = [
    'Sr. No.',
    'Assigned To',
    'Company Name',
    'Website',
    'Website Verified',
    'Scan Completed',
    'Screenshot Taken',
    'Wave Score',
    'Axe Score',
    'LH Score',
    'Screenshot link',
    'Contact Person 1',
    'Designation 1',
    'Email ID 1',
    'Contact Person 2',
    'Designation 2',
    'Email ID 2'
  ];

  const rows = [];
  for (let i = 0; i < companies.length; i++) {
    const comp = companies[i];
    console.log(`[${i + 1}/${companies.length}] Enriching: "${comp.companyName}"...`);
    const apolloRes = await enrichPocWithApollo(comp.companyName, comp.readymadeWebsite || '');

    rows.push({
      'Sr. No.': i + 1,
      'Assigned To': comp.assignedTo || 'Unassigned',
      'Company Name': comp.companyName,
      'Website': comp.readymadeWebsite || 'N/A',
      'Website Verified': comp.readymadeWebsite ? 'Yes' : 'No',
      'Scan Completed': 'No',
      'Screenshot Taken': 'No',
      'Wave Score': 0,
      'Axe Score': 0,
      'LH Score': 0,
      'Screenshot link': 'N/A',
      'Contact Person 1': apolloRes.contact1.name,
      'Designation 1': apolloRes.contact1.title,
      'Email ID 1': apolloRes.contact1.email,
      'Contact Person 2': apolloRes.contact2.name,
      'Designation 2': apolloRes.contact2.title,
      'Email ID 2': apolloRes.contact2.email
    });
  }

  const outDir = process.cwd();
  const baseName = path.basename(inputExcelPath, path.extname(inputExcelPath));
  const outExcel = path.join(outDir, `${baseName}_apollo_contacts.xlsx`);
  const outCsv = path.join(outDir, `${baseName}_apollo_contacts.csv`);

  const csvLines = [headersSchema.join(',')];
  for (const row of rows) {
    const values = headersSchema.map(h => `"${String((row as any)[h] || '').replace(/"/g, '""')}"`);
    csvLines.push(values.join(','));
  }
  fs.writeFileSync(outCsv, csvLines.join('\n'), 'utf8');

  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headersSchema });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Apollo Enriched Contacts');
  XLSX.writeFile(workbook, outExcel);

  console.log(`\n=====================================================`);
  console.log(`🎉 Success! Exported Apollo Enriched Dataset (${rows.length} rows):`);
  console.log(`📊 Excel: "${outExcel}"`);
  console.log(`📑 CSV: "${outCsv}"`);
  console.log(`=====================================================\n`);

  return outExcel;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('apollo_exporter.ts') || process.argv[1].endsWith('apollo_exporter.js')) {
  const apiKey = process.env.APOLLO_API_KEY || process.env.APOLLO_KEY || '';
  pullAndExportApolloContacts(apiKey).catch(err => {
    console.error('Apollo Puller Error:', err);
    process.exit(1);
  });
}
