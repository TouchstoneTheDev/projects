import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { CompanyInput, IncrementalCompanyInput } from './types.js';
import { parseInputFile } from './parsers/input_parser.js';

export interface IncrementalParseResult {
  allCompanies: IncrementalCompanyInput[];
  pendingQueue: IncrementalCompanyInput[];
  skippedCount: number;
}

/**
 * Module A: Incremental Delta Reader & Parser
 * Inspects existing 17-column cells per row and enqueues ONLY missing cells/rows for processing.
 * Preserves pre-populated data and manual auditor edits.
 */
export function parseIncrementalInputFile(filePath: string): IncrementalParseResult {
  const allCompaniesRaw = parseInputFile(filePath);
  const ext = path.extname(filePath).toLowerCase();

  const allCompanies: IncrementalCompanyInput[] = [];
  const pendingQueue: IncrementalCompanyInput[] = [];
  let skippedCount = 0;

  if (ext === '.xlsx' || ext === '.xls') {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (sheet) {
      const rowsData: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      for (let i = 0; i < allCompaniesRaw.length; i++) {
        const rawComp = allCompaniesRaw[i];
        const row = rowsData[i] || {};

        const website = String(row['Website'] || rawComp.readymadeWebsite || '').trim();
        const email1 = String(row['Email ID 1'] || row['Primary Email'] || rawComp.emailId || '').trim();
        const scanCompleted = String(row['Scan Completed'] || '').trim().toLowerCase();

        const isFullyPopulated = Boolean(
          website &&
          website !== 'N/A' &&
          email1 &&
          email1 !== 'N/A' &&
          (scanCompleted === 'yes' || scanCompleted === 'completed')
        );

        const incComp: IncrementalCompanyInput = {
          ...rawComp,
          readymadeWebsite: website || rawComp.readymadeWebsite,
          emailId: email1 || rawComp.emailId,
          isFullyPopulated,
          missingFields: [],
        };

        if (!website || website === 'N/A') incComp.missingFields!.push('Website');
        if (!email1 || email1 === 'N/A') incComp.missingFields!.push('Email ID 1');
        if (scanCompleted !== 'yes' && scanCompleted !== 'completed') incComp.missingFields!.push('Scan Completed');

        allCompanies.push(incComp);

        if (isFullyPopulated) {
          skippedCount++;
        } else {
          pendingQueue.push(incComp);
        }
      }

      return { allCompanies, pendingQueue, skippedCount };
    }
  }

  // Fallback for CSV / JSON or standard input
  for (const rawComp of allCompaniesRaw) {
    const isPopulated = Boolean(rawComp.readymadeWebsite && rawComp.emailId && rawComp.emailId !== 'N/A');
    const incComp: IncrementalCompanyInput = {
      ...rawComp,
      isFullyPopulated: isPopulated,
      missingFields: isPopulated ? [] : ['Website', 'Email ID 1'],
    };

    allCompanies.push(incComp);
    if (isPopulated) {
      skippedCount++;
    } else {
      pendingQueue.push(incComp);
    }
  }

  return { allCompanies, pendingQueue, skippedCount };
}
