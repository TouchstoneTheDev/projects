import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../../core/config/index.js';
export const generateWaveChecklist = async (companyName, websiteUrl) => {
    const safeName = companyName.replace(/\s+/g, '_');
    const checklistDir = path.resolve(config.OUTPUT_DIR, 'wave');
    await fs.mkdir(checklistDir, { recursive: true });
    const content = [
        `# WAVE Manual Spot-Check: ${companyName}`,
        `Website: ${websiteUrl}`,
        '',
        'Steps:',
        '1. Install the WAVE browser extension (Chrome/Firefox).',
        `2. Open the site: ${websiteUrl}`,
        '3. Click the WAVE extension icon to run the analysis.',
        '4. Inspect Errors, Contrast Errors, and Structural Elements.',
        '5. Take screenshots of the WAVE output panels and embed them below.',
        '',
        'Checklist:',
        '- [ ] Run WAVE extension',
        '- [ ] Capture Errors section',
        '- [ ] Capture Contrast Errors',
        '- [ ] Capture Structure outline',
        '- [ ] Save screenshots to output/wave/screenshots',
        '',
        'Notes:',
        '- WAVE is manual and should be used for spot checks only.',
    ].join('\n');
    const outPath = path.join(checklistDir, `${safeName}.md`);
    await fs.writeFile(outPath, content, 'utf8');
    return outPath;
};
export default generateWaveChecklist;
//# sourceMappingURL=index.js.map