import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { CompanyAuditReportV11 } from '../types.js';

export function createTrackerRow(report: CompanyAuditReportV11) {
  const regardingAccStr = report.emailDiscovery.regardingAccessibility
    .map(e => `[${e.label}] ${e.address}`)
    .join('; ');

  return {
    'Sr. No.': report.company.srNo,
    'Assigned To': report.company.assignedTo || 'Unassigned',
    'Company Name': report.company.companyName,
    'Website': report.resolution.resolvedUrl || report.company.readymadeWebsite || 'N/A',
    'Website Source': report.resolution.source,
    'Resolution Confidence': report.resolution.confidence,
    'Conflict Flag': report.resolution.hasConflict ? 'YES' : 'NO',
    'Contact Person': report.company.contactPerson || 'N/A',
    'Primary Email': report.emailDiscovery.primaryEmail.address || 'N/A',
    'Regarding Accessibility Email(s)': regardingAccStr || 'N/A',
    'Email Status': report.emailDiscovery.overallStatus,
    'Website Verified': report.resolution.resolvedUrl ? 'Yes' : 'No',
    'Scan Completed': report.status === 'Completed' ? 'Yes' : 'No',
    'Bot Block Status': report.botBlock.isBlocked ? `Blocked (${report.botBlock.signatureMatched})` : 'None',
    'Screenshot Taken': report.pages.some(p => p.screenshots.length > 0) ? 'Yes' : 'No',
    'Status': report.status,
    'Verified By': report.company.verifiedBy || 'Orchavate Automated Tool',
    'Remarks': report.remarks,
  };
}

export function exportTrackerFiles(reports: CompanyAuditReportV11[], outputDir: string): void {
  const rows = reports.map(createTrackerRow);
  const headers = [
    'Sr. No.',
    'Assigned To',
    'Company Name',
    'Website',
    'Website Source',
    'Resolution Confidence',
    'Conflict Flag',
    'Contact Person',
    'Primary Email',
    'Regarding Accessibility Email(s)',
    'Email Status',
    'Website Verified',
    'Scan Completed',
    'Bot Block Status',
    'Screenshot Taken',
    'Status',
    'Verified By',
    'Remarks'
  ];

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. CSV Export
  const csvLines: string[] = [];
  csvLines.push(headers.join(','));

  for (const row of rows) {
    const values = headers.map(h => {
      const val = String((row as any)[h] || '').replace(/"/g, '""');
      return `"${val}"`;
    });
    csvLines.push(values.join(','));
  }
  const csvPath = path.join(outputDir, 'Simple_Accessibility_Outreach_Tracker.csv');
  fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf8');

  // 2. Excel (.xlsx) Export
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Outreach Tracker');
  const excelPath = path.join(outputDir, 'Simple_Accessibility_Outreach_Tracker.xlsx');
  XLSX.writeFile(workbook, excelPath);
}
