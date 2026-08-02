import type { Page } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

export interface AxeScanResult {
  violations: Array<unknown>;
  passes: Array<unknown>;
}

export const runAxeOnPage = async (page: Page): Promise<AxeScanResult> => {
  const results = await new AxeBuilder({ page }).analyze();
  return {
    violations: results.violations,
    passes: results.passes,
  };
};
