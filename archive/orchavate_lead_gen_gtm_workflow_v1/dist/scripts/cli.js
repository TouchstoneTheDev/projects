import { log } from '../core/logger/index.js';
import { runWorkflow } from './workflow.js';
const printHelp = () => {
    console.log(`Usage:\n  node dist/cli.js --tracker <path-to-tracker.xlsx>\n\nOptions:\n  -t, --tracker <path>   Excel or CSV tracker file\n  -h, --help             Show this help message`);
};
const parseArgs = () => {
    const args = process.argv.slice(2);
    if (args.includes('--help') || args.includes('-h')) {
        printHelp();
        return undefined;
    }
    const trackerArgIndex = args.findIndex((value) => value === '--tracker' || value === '-t');
    if (trackerArgIndex >= 0 && args.length > trackerArgIndex + 1) {
        return args[trackerArgIndex + 1];
    }
    return args[0];
};
export const runCli = async () => {
    const args = process.argv.slice(2);
    if (args.includes('--help') || args.includes('-h')) {
        printHelp();
        return;
    }
    log.info({ module: 'cli' }, 'Starting CLI workflow');
    const trackerPath = parseArgs();
    await runWorkflow(trackerPath);
};
if (process.argv[1].endsWith('/cli.ts') || process.argv[1].endsWith('/cli.js')) {
    runCli().catch((error) => {
        log.error({ module: 'cli', err: error }, 'CLI execution failed');
        process.exit(1);
    });
}
//# sourceMappingURL=cli.js.map