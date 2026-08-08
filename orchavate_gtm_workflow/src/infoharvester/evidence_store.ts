import fs from 'fs';
import path from 'path';

export interface EvidenceRecord {
  company_name: string;
  website: string;
  contact_1_name: string;
  contact_1_designation: string;
  contact_1_email: string;
  contact_1_source: string;
  contact_1_source_type: string;
  contact_1_confidence: 'HIGH' | 'MEDIUM' | 'LOW';

  contact_2_name: string;
  contact_2_designation: string;
  contact_2_email: string;
  contact_2_source: string;
  contact_2_source_type: string;
  contact_2_confidence: 'HIGH' | 'MEDIUM' | 'LOW';

  accessibility_nodal_officer_found: boolean;
  accessibility_evidence: string;
  last_checked: string;
}

const AUDIT_STORE_PATH = path.join(process.cwd(), '.infoharvester_audit_store.json');

export class EvidenceStore {
  private records: Map<string, EvidenceRecord> = new Map();

  constructor() {
    this.load();
  }

  private load(): void {
    if (fs.existsSync(AUDIT_STORE_PATH)) {
      try {
        const raw = fs.readFileSync(AUDIT_STORE_PATH, 'utf8');
        const list: EvidenceRecord[] = JSON.parse(raw);
        for (const item of list) {
          this.records.set(item.company_name.toLowerCase(), item);
        }
      } catch (err: any) {
        console.warn(`[EvidenceStore] Could not load audit store: ${err?.message}`);
      }
    }
  }

  public saveRecord(record: EvidenceRecord): void {
    this.records.set(record.company_name.toLowerCase(), record);
    try {
      const list = Array.from(this.records.values());
      fs.writeFileSync(AUDIT_STORE_PATH, JSON.stringify(list, null, 2), 'utf8');
    } catch (err: any) {
      console.warn(`[EvidenceStore] Failed to save audit store: ${err?.message}`);
    }
  }

  public getRecord(companyName: string): EvidenceRecord | undefined {
    return this.records.get(companyName.toLowerCase());
  }

  public getAllRecords(): EvidenceRecord[] {
    return Array.from(this.records.values());
  }
}

export const globalEvidenceStore = new EvidenceStore();
