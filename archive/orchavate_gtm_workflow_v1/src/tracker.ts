import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { CompanyAuditReport, TrackerRow } from './types';

export function createTrackerRow(report: CompanyAuditReport): TrackerRow {
  const websiteVerified = report.websiteVerified ? 'Yes' : 'No';
  const scanCompleted = report.scanCompleted ? 'Yes' : 'No';
  const screenshotTaken = report.screenshotTaken ? 'Yes' : 'No';

  let status = report.status;
  if (!report.websiteVerified) {
    status = 'Inaccessible';
  }

  let remarks = report.remarks;
  if (report.websiteVerified && report.scanCompleted) {
    remarks = `Violations: ${report.totalViolations} (Alt Text: ${report.altTextViolations}, Contrast: ${report.contrastViolations}, Labels: ${report.labelViolations}, Keyboard: ${report.keyboardViolations}). Lighthouse A11y: ${report.lighthouseAvgScore}/100.`;
  }

  return {
    'Sr. No.': report.company.srNo,
    'Assigned To': report.company.assignedTo || 'Unassigned',
    'Company Name': report.company.companyName,
    'Website': report.company.website,
    'Contact Person': report.company.contactPerson || 'N/A',
    'Email ID': report.company.emailId || 'N/A',
    'Website Verified': websiteVerified,
    'Scan Completed': scanCompleted,
    'Screenshot Taken': screenshotTaken,
    'Status': status,
    'Verified By': report.company.verifiedBy || 'Automated Tool',
    'Remarks': remarks,
  };
}

export function exportTrackerFiles(reports: CompanyAuditReport[], outputDir: string): void {
  const rows = reports.map(createTrackerRow);
  const headers = [
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
    'Remarks'
  ];

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Export CSV
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

  // 2. Export Excel (.xlsx)
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Outreach Tracker');
  const excelPath = path.join(outputDir, 'Simple_Accessibility_Outreach_Tracker.xlsx');
  XLSX.writeFile(workbook, excelPath);
}

export function exportTrackerCsv(reports: CompanyAuditReport[], outputPath: string): void {
  exportTrackerFiles(reports, path.dirname(outputPath));
}
