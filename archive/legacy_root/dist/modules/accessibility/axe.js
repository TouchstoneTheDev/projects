import AxeBuilder from '@axe-core/playwright';
export const runAxeOnPage = async (page) => {
    const results = await new AxeBuilder({ page }).analyze();
    return {
        violations: results.violations,
        passes: results.passes,
    };
};
//# sourceMappingURL=axe.js.map