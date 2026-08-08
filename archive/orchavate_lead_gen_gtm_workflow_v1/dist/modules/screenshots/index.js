export const captureScreenshot = async (page, outputPath) => {
    await page.screenshot({ path: outputPath, fullPage: true });
    return outputPath;
};
//# sourceMappingURL=index.js.map