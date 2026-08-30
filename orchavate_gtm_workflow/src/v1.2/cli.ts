/**
 * FEATURE PRIORITY NOTICE:
 * v1.1 Core Tool Features: MANDATORY (Priority 1) - Execute dual scan, manage CLI execution flow.
 * v1.2 Enrichment Features: OPTIONAL (Priority 2) - Skip enrichment flags if disabled, keep v1.1 running.
 */

// OLD:
// async function run() { console.log('Running v1.1 audit'); }

// NEW:
async function run() {
  // v1.1 Mandatory execution logic
  console.log('Running v1.1 core audit engine...');
  
  // v1.2 Optional enrichment execution wrapper
  const enableV12Enrichment = process.env.ENABLE_V12_ENRICHMENT === 'true';
  if (enableV12Enrichment) {
    console.log('v1.2 optional enrichment enabled.');
  }
}