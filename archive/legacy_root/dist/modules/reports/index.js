export const generateReportJson = async (result) => JSON.stringify(result, null, 2);
export const generateReportMarkdown = async (result) => {
    return [
        `# Accessibility Assessment`,
        `- Company: ${result.companyName}`,
        `- Website: ${result.websiteUrl}`,
        `- Status: ${result.status}`,
        `- Accessibility Score: ${result.accessibilityScore ?? 'N/A'}`,
        `- Violations: ${result.violationsCount ?? 'N/A'}`,
        `- Screenshot Files: ${result.screenshotFiles?.join(', ') ?? 'None'}`,
        `- Remarks: ${result.remarks ?? 'None'}`,
    ].join('\n');
};
export const generateReportHtml = async (result) => {
    const screenshotList = result.screenshotFiles?.map((file) => `<li>${file}</li>`).join('') ?? '<li>None</li>';
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Accessibility Assessment - ${result.companyName}</title>
  </head>
  <body>
    <h1>Accessibility Assessment</h1>
    <ul>
      <li><strong>Company:</strong> ${result.companyName}</li>
      <li><strong>Website:</strong> <a href="${result.websiteUrl}">${result.websiteUrl}</a></li>
      <li><strong>Status:</strong> ${result.status}</li>
      <li><strong>Accessibility Score:</strong> ${result.accessibilityScore ?? 'N/A'}</li>
      <li><strong>Violations:</strong> ${result.violationsCount ?? 'N/A'}</li>
      <li><strong>Screenshot Files:</strong><ul>${screenshotList}</ul></li>
      <li><strong>Remarks:</strong> ${result.remarks ?? 'None'}</li>
    </ul>
  </body>
</html>`;
};
//# sourceMappingURL=index.js.map