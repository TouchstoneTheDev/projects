import fs from 'fs';
import path from 'path';

export interface CompanyLogRecord {
  company: string;
  searchQueries: string[];
  candidateDomains: string[];
  selectedDomain: string;
  confidence: string;
  reason: string;
  searchDurationMs: number;
  errors: string[];
  timestamp: string;
}

export class ResolutionLogger {
  private logFilePath: string;
  private records: CompanyLogRecord[] = [];

  constructor(outputDir: string) {
    this.logFilePath = path.join(outputDir, 'resolution_audit.log');
  }

  public logCompanyResolution(record: CompanyLogRecord): void {
    this.records.push(record);
    const line = `[${record.timestamp}] COMPANY: "${record.company}" | QUERIES: [${record.searchQueries.join('; ')}] | CANDIDATES: [${record.candidateDomains.join(', ')}] | SELECTED: "${record.selectedDomain}" | CONFIDENCE: ${record.confidence} | TIME: ${record.searchDurationMs}ms | REASON: ${record.reason}${record.errors.length > 0 ? ` | ERRORS: [${record.errors.join('; ')}]` : ''}\n`;

    try {
      const dir = path.dirname(this.logFilePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(this.logFilePath, line, 'utf8');
    } catch {
      // Ignore log write errors
    }
  }

  public getRecords(): CompanyLogRecord[] {
    return this.records;
  }
}
