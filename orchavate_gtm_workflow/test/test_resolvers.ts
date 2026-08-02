import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { isIgnoredDomain, MockSearchProvider } from '../src/search/search_provider.js';
import { AutomatedWebsiteResolver } from '../src/resolvers/automated_resolver.js';
import { ReadymadeWebsiteResolver } from '../src/resolvers/readymade_resolver.js';
import { HybridWebsiteResolver } from '../src/resolvers/hybrid_resolver.js';
import { CircuitBreaker } from '../src/circuit_breaker/circuit_breaker.js';
import { SearchCache } from '../src/cache/search_cache.js';

async function runTests() {
  console.log('====================================================');
  console.log('Running Accessibility Outreach Tool Unit Test Suite');
  console.log('====================================================\n');

  // Test 1: Domain Blacklist Filtering
  console.log('[Test 1] Domain Blacklist Filtering...');
  assert.strictEqual(isIgnoredDomain('https://en.wikipedia.org/wiki/Company'), true, 'Wikipedia should be ignored');
  assert.strictEqual(isIgnoredDomain('https://www.linkedin.com/company/test'), true, 'LinkedIn should be ignored');
  assert.strictEqual(isIgnoredDomain('https://www.moneycontrol.com/india/stockprice'), true, 'Moneycontrol should be ignored');
  assert.strictEqual(isIgnoredDomain('https://example.com/report.pdf'), true, 'PDF files should be ignored');
  assert.strictEqual(isIgnoredDomain('https://www.sebi.gov.in/notices'), true, 'Regulators should be ignored');
  assert.strictEqual(isIgnoredDomain('https://www.tata.com'), false, 'Official company domain should NOT be ignored');
  console.log('✓ Test 1 Passed.');

  // Test 2: Mock Search & AutomatedWebsiteResolver
  console.log('\n[Test 2] AutomatedWebsiteResolver with Mock Search...');
  const mockProvider = new MockSearchProvider({
    'tata capital': [
      { url: 'https://www.tatacapital.com', title: 'Tata Capital Official Website', snippet: 'Official site' },
      { url: 'https://www.tatacapital.com/about', title: 'Tata Capital About', snippet: 'Official site' }
    ]
  });
  const autoResolver = new AutomatedWebsiteResolver(mockProvider);

  const autoResult = await autoResolver.resolve({ srNo: 1, companyName: 'Tata Capital' });
  assert.strictEqual(autoResult.resolvedUrl, 'https://www.tatacapital.com');
  assert.strictEqual(autoResult.confidence, 'HIGH');
  assert.strictEqual(autoResult.hasConflict, false);
  console.log('✓ Test 2 Passed.');

  // Test 3: ReadymadeWebsiteResolver
  console.log('\n[Test 3] ReadymadeWebsiteResolver...');
  const readyMap = { 'tata capital': 'https://www.tatacapital.com', 'unknown fund': '' };
  const readyResolver = new ReadymadeWebsiteResolver(readyMap);

  const readyResult1 = await readyResolver.resolve({ srNo: 1, companyName: 'Tata Capital' });
  assert.strictEqual(readyResult1.resolvedUrl, 'https://www.tatacapital.com');
  assert.strictEqual(readyResult1.confidence, 'HIGH');

  const readyResult2 = await readyResolver.resolve({ srNo: 2, companyName: 'Unknown Fund' });
  assert.strictEqual(readyResult2.resolvedUrl, '');
  assert.strictEqual(readyResult2.confidence, 'FAILED');
  console.log('✓ Test 3 Passed.');

  // Test 4: HybridWebsiteResolver (Agreement & Conflict)
  console.log('\n[Test 4] HybridWebsiteResolver (Agreement & Conflict)...');
  const hybridAgreed = new HybridWebsiteResolver(autoResolver, readyResolver);
  const hybridAgreedResult = await hybridAgreed.resolve({ srNo: 1, companyName: 'Tata Capital' });
  assert.strictEqual(hybridAgreedResult.source, 'hybrid-agreed');
  assert.strictEqual(hybridAgreedResult.confidence, 'HIGH');

  const conflictingReadyResolver = new ReadymadeWebsiteResolver({ 'tata capital': 'https://www.different-domain.com' });
  const hybridConflict = new HybridWebsiteResolver(autoResolver, conflictingReadyResolver);
  const conflictResult = await hybridConflict.resolve({ srNo: 1, companyName: 'Tata Capital' });
  assert.strictEqual(conflictResult.hasConflict, true);
  assert.strictEqual(conflictResult.confidence, 'LOW');
  console.log('✓ Test 4 Passed.');

  // Test 5: CircuitBreaker Trigger Rules
  console.log('\n[Test 5] CircuitBreaker Trigger Rules...');
  const cb = new CircuitBreaker(0.30, 5); // 30% threshold after 5 processed

  // 4 failures out of 5
  cb.recordResult({ resolvedUrl: '', source: 'automated-search', confidence: 'FAILED', hasConflict: false, candidateDomains: [], searchQueries: [], searchDurationMs: 10, reason: '' });
  cb.recordResult({ resolvedUrl: '', source: 'automated-search', confidence: 'FAILED', hasConflict: false, candidateDomains: [], searchQueries: [], searchDurationMs: 10, reason: '' });
  cb.recordResult({ resolvedUrl: '', source: 'automated-search', confidence: 'FAILED', hasConflict: false, candidateDomains: [], searchQueries: [], searchDurationMs: 10, reason: '' });
  cb.recordResult({ resolvedUrl: 'https://example.com', source: 'automated-search', confidence: 'HIGH', hasConflict: false, candidateDomains: [], searchQueries: [], searchDurationMs: 10, reason: '' });
  const triggered = cb.recordResult({ resolvedUrl: '', source: 'automated-search', confidence: 'FAILED', hasConflict: false, candidateDomains: [], searchQueries: [], searchDurationMs: 10, reason: '' });

  assert.strictEqual(triggered, true, 'CircuitBreaker should trigger when failure rate > 30% after 5 items');
  assert.strictEqual(cb.getStats().failureRatePercent, 80);
  console.log('✓ Test 5 Passed.');

  // Test 6: Search Cache
  console.log('\n[Test 6] SearchCache TTL & Storage...');
  const tmpDir = path.join(process.cwd(), 'orchavate_gtm_workflow', 'outputs', 'test_tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const cache = new SearchCache(tmpDir, 1000, true);
  cache.set('Test Company', 'https://testcompany.com', 'HIGH');

  const hit = cache.get('Test Company');
  assert.notStrictEqual(hit, null);
  assert.strictEqual(hit?.resolvedUrl, 'https://testcompany.com');
  assert.strictEqual(hit?.confidence, 'HIGH');
  console.log('✓ Test 6 Passed.');

  console.log('\n====================================================');
  console.log('✅ ALL UNIT TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================\n');
}

runTests().catch(err => {
  console.error('❌ Test Suite Failed:', err);
  process.exit(1);
});
