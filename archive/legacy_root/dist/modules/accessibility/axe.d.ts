import type { Page } from 'playwright';
export interface AxeScanResult {
    violations: Array<unknown>;
    passes: Array<unknown>;
}
export declare const runAxeOnPage: (page: Page) => Promise<AxeScanResult>;
//# sourceMappingURL=axe.d.ts.map