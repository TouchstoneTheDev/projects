import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { CompanyInput } from '../types.js';

export function parseInputFile(filePath: string): CompanyInput[] {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.xlsx' || ext === '.xls') {
    const workbook = XLSX.readFile(filePath);

    const nameKeywords = [
      'name of the stock broker', 'name of the broker', 'name of broker',
      'name of the applicant', 'name of fund', 'name of venture capital fund',
      'name of entity', 'intermediary name', 'company name', 'name of company', 'name_of_company', 'name of amc',
      'name of the intermediary', 'applicant name', 'company', 'name', 'fund name', 'entity'
    ];

    const findColIndexInRow = (rowHeaders: string[], keywords: string[]): number => {
      for (const kw of keywords) {
        const idx = rowHeaders.findIndex(h => h === kw || h.includes(kw));
        if (idx !== -1) return idx;
      }
      return -1;
    };

    // Sort sheet names so sheets with lead/data/companies/target/list are tried first if present
    const sortedSheetNames = [...workbook.SheetNames].sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const priorityKeywords = ['lead', 'target', 'company', 'companies', 'data', 'master', 'list'];
      const aPriority = priorityKeywords.some(k => aLower.includes(k)) ? 1 : 0;
      const bPriority = priorityKeywords.some(k => bLower.includes(k)) ? 1 : 0;
      if (aLower.includes('read me') || aLower.includes('readme') || aLower.includes('instructions')) return 1;
      if (bLower.includes('read me') || bLower.includes('readme') || bLower.includes('instructions')) return -1;
      return bPriority - aPriority;
    });

    for (const sheetName of sortedSheetNames) {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) continue;

      const rawRows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      if (!rawRows || rawRows.length === 0) continue;

      let headerRowIdx = -1;
      for (let r = 0; r < Math.min(rawRows.length, 15); r++) {
        const rowCells = rawRows[r].map((cell: any) => String(cell).trim().toLowerCase());
        const nonCount = rowCells.filter(c => c.length > 0).length;
        if (nonCount < 2) continue;

        const candidateNameIdx = findColIndexInRow(rowCells, nameKeywords);
        if (candidateNameIdx !== -1) {
          headerRowIdx = r;
          break;
        }
      }

      if (headerRowIdx === -1) {
        for (let r = 0; r < Math.min(rawRows.length, 15); r++) {
          const rowStr = rawRows[r].map(cell => String(cell).toLowerCase()).join(' ');
          if (
            rowStr.includes('name') ||
            rowStr.includes('broker') ||
            rowStr.includes('company') ||
            rowStr.includes('fund') ||
            rowStr.includes('intermediary') ||
            rowStr.includes('applicant')
          ) {
            headerRowIdx = r;
            break;
          }
        }
      }

      if (headerRowIdx === -1) continue;

      const headers = rawRows[headerRowIdx].map((cell: any) => String(cell).trim().toLowerCase());
      const dataRows = rawRows.slice(headerRowIdx + 1);

      const findColIndex = (keywords: string[]): number => findColIndexInRow(headers, keywords);

      const srIdx = findColIndex(['sr. no.', 'sr.no.', 'sr no', 'srno', 's.no', 'sl.no', 's.n.', 'sl no']);
      const nameIdx = findColIndex(nameKeywords);
      if (nameIdx === -1) continue;

      const websiteIdx = findColIndex(['authentic website', 'readymade website', 'website url', 'company website', 'web address', 'website', 'url', 'domain', 'link', 'site', 'web']);

      const assignedIdx = findColIndex(['assigned to', 'assigned', 'auditor']);
      const contactIdx = findColIndex(['contact person', 'contact', 'contact person name', 'person']);
      const emailIdx = findColIndex(['email id', 'email', 'emailid', 'e-mail', 'contact email', 'email address']);
      const verifiedIdx = findColIndex(['verified by', 'verified']);

      const results: CompanyInput[] = [];

      dataRows.forEach((row, index) => {
        const companyName = nameIdx !== -1 && row[nameIdx] ? String(row[nameIdx]).trim() : '';
        if (
          !companyName ||
          companyName.toLowerCase() === 'name' ||
          companyName.toLowerCase() === 'company name' ||
          companyName.toLowerCase().startsWith('total') ||
          companyName.toLowerCase().startsWith('note') ||
          companyName.toLowerCase().includes('this workbook provides')
        ) {
          return;
        }

        const srVal = srIdx !== -1 && row[srIdx] ? parseInt(String(row[srIdx]), 10) : NaN;

        results.push({
          srNo: !isNaN(srVal) ? srVal : index + 1,
          companyName,
          readymadeWebsite: websiteIdx !== -1 && row[websiteIdx] ? String(row[websiteIdx]).trim() : '',
          assignedTo: assignedIdx !== -1 && row[assignedIdx] ? String(row[assignedIdx]).trim() : 'Unassigned',
          contactPerson: contactIdx !== -1 && row[contactIdx] ? String(row[contactIdx]).trim() : 'N/A',
          emailId: emailIdx !== -1 && row[emailIdx] ? String(row[emailIdx]).trim() : 'N/A',
          verifiedBy: verifiedIdx !== -1 && row[verifiedIdx] ? String(row[verifiedIdx]).trim() : 'Orchavate Automated Tool v1.1',
        });
      });

      if (results.length > 0) {
        return results;
      }
    }

    throw new Error(`Could not extract target companies from Excel file: "${filePath}". Please check sheet data and column headers.`);
  } else if (ext === '.json') {
    const content = fs.readFileSync(filePath, 'utf8');
    const raw = JSON.parse(content);
    return raw.map((item: any, index: number) => ({
      srNo: item.srNo || index + 1,
      companyName: item.companyName || item.name || 'Unknown',
      readymadeWebsite: item.website || item.readymadeWebsite || item.url || '',
      assignedTo: item.assignedTo || 'Unassigned',
      contactPerson: item.contactPerson || 'N/A',
      emailId: item.emailId || item.email || 'N/A',
      verifiedBy: item.verifiedBy || 'Orchavate Automated Tool v1.1',
    }));
  } else if (ext === '.csv') {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);

    if (lines.length === 0) {
      throw new Error(`CSV file is empty: ${filePath}`);
    }

    // Parse CSV rows (handles basic quoting)
    const parseCsvRow = (line: string): string[] => {
      const cells: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (ch === ',' && !inQuotes) {
          cells.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
      cells.push(current.trim());
      return cells;
    };

    const rawRows = lines.map(parseCsvRow);

    const nameKeywords = [
      'name of the stock broker', 'name of the broker', 'name of broker',
      'name of the applicant', 'name of fund', 'name of venture capital fund',
      'name of entity', 'intermediary name', 'company name', 'name of amc',
      'name of the intermediary', 'applicant name', 'company', 'name', 'fund name', 'entity'
    ];

    const findColIndexInRow = (rowHeaders: string[], keywords: string[]): number => {
      for (const kw of keywords) {
        const idx = rowHeaders.findIndex(h => h === kw || h.includes(kw));
        if (idx !== -1) return idx;
      }
      return -1;
    };

    let headerRowIdx = -1;
    for (let r = 0; r < Math.min(rawRows.length, 15); r++) {
      const rowCells = rawRows[r].map(cell => cell.trim().toLowerCase());
      const nonCount = rowCells.filter(c => c.length > 0).length;
      if (nonCount < 2) continue;

      const candidateNameIdx = findColIndexInRow(rowCells, nameKeywords);
      if (candidateNameIdx !== -1) {
        headerRowIdx = r;
        break;
      }
    }

    if (headerRowIdx === -1) headerRowIdx = 0;

    const headers = rawRows[headerRowIdx].map(cell => cell.trim().toLowerCase());
    const dataRows = rawRows.slice(headerRowIdx + 1);

    const findColIndex = (keywords: string[]): number => findColIndexInRow(headers, keywords);

    const srIdx = findColIndex(['sr. no.', 'sr.no.', 'sr no', 'srno', 's.no', 'sl.no', 's.n.', 'sl no']);
    const nameIdx = findColIndex(nameKeywords);
    const websiteIdx = findColIndex(['authentic website', 'readymade website', 'website url', 'company website', 'web address', 'website', 'url', 'domain', 'link', 'site', 'web']);

    const assignedIdx = findColIndex(['assigned to', 'assigned', 'auditor']);
    const contactIdx = findColIndex(['contact person', 'contact', 'contact person name', 'person']);
    const emailIdx = findColIndex(['email id', 'email', 'emailid', 'e-mail', 'contact email', 'email address']);
    const verifiedIdx = findColIndex(['verified by', 'verified']);

    const results: CompanyInput[] = [];

    dataRows.forEach((row, index) => {
      const companyName = nameIdx !== -1 && row[nameIdx] ? row[nameIdx].trim() : '';
      if (
        !companyName ||
        companyName.toLowerCase() === 'name' ||
        companyName.toLowerCase() === 'company name' ||
        companyName.toLowerCase().startsWith('total') ||
        companyName.toLowerCase().startsWith('note')
      ) {
        return;
      }

      const srVal = srIdx !== -1 && row[srIdx] ? parseInt(row[srIdx], 10) : NaN;

      results.push({
        srNo: !isNaN(srVal) ? srVal : index + 1,
        companyName,
        readymadeWebsite: websiteIdx !== -1 && row[websiteIdx] ? row[websiteIdx].trim() : '',
        assignedTo: assignedIdx !== -1 && row[assignedIdx] ? row[assignedIdx].trim() : 'Unassigned',
        contactPerson: contactIdx !== -1 && row[contactIdx] ? row[contactIdx].trim() : 'N/A',
        emailId: emailIdx !== -1 && row[emailIdx] ? row[emailIdx].trim() : 'N/A',
        verifiedBy: verifiedIdx !== -1 && row[verifiedIdx] ? row[verifiedIdx].trim() : 'Orchavate Automated Tool v1.1',
      });
    });

    if (results.length === 0) {
      throw new Error(`Could not extract target companies from CSV file. Please check column headers.`);
    }

    return results;
  }
  throw new Error(`Unsupported file format: ${filePath}`);
}

export function parseReadymadeFile(filePath: string): Record<string, string> {
  const map: Record<string, string> = {};
  try {
    const companies = parseInputFile(filePath);
    for (const c of companies) {
      if (c.companyName && c.readymadeWebsite) {
        map[c.companyName.toLowerCase().trim()] = c.readymadeWebsite.trim();
      }
    }
  } catch (err: any) {
    console.warn(`⚠️ Warning: Could not parse readymade file (${filePath}): ${err?.message}`);
  }
  return map;
}
