#!/usr/bin/env node
import { runCli } from './scripts/cli.js';
runCli().catch((error) => {
    console.error('Orachavate CLI failed:', error);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map