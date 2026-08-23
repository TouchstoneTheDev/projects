import ExcelJS from 'exceljs';
import { CompanyRecord } from '../../types/index.js';
export declare const loadTrackerWorkbook: (filePath: string) => Promise<ExcelJS.Workbook>;
export declare const workbookToRecords: (workbook: ExcelJS.Workbook) => CompanyRecord[];
export declare const updateWorkbookRow: (filePath: string, companyName: string, changes: Record<string, string>) => Promise<void>;
//# sourceMappingURL=excel.d.ts.map