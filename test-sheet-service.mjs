import assert from 'node:assert';
import {
  parseSheetUrlInfo,
  generateDataFingerprint,
  isValidProposalRow,
  normalizeProposalRow,
  stripTimestampFromText,
  formatCleanDate
} from './src/services/sheetService.js';

console.log('🧪 Testing sheetService unit logic...');

// Test 1: URL parser
const url1 = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?gid=12345#gid=12345';
const info1 = parseSheetUrlInfo(url1);
assert.strictEqual(info1.isValid, true);
assert.strictEqual(info1.sheetId, '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
assert.strictEqual(info1.gid, '12345');

// Test 2: Local test URL parser
const infoLocal = parseSheetUrlInfo('/api/live-test-sheet/export?format=csv');
assert.strictEqual(infoLocal.isValid, true);
assert.strictEqual(infoLocal.isLocalTest, true);

// Test 3: Normalization & Deal value
const sampleRow = {
  'Opportunity Name': 'Global Bank Testing 2026-08-01',
  'Client Name': 'Acme Corp GMT+0530',
  'Region': 'North America',
  'QE Scope': 'Automation Testing',
  'Status': 'Closed Won',
  'QE Estimated Deal Value ($)': '$450,000.50',
  'Submission Date': '2026-08-15',
  'Win / Loss Reason': 'Live POC'
};

assert(isValidProposalRow(sampleRow));
const norm = normalizeProposalRow(sampleRow, 0);
assert.strictEqual(norm.opportunityName, 'Global Bank Testing');
assert.strictEqual(norm.clientName, 'Acme Corp');
assert.strictEqual(norm.status, 'Won');
assert.strictEqual(norm.contractValue, 450000.5);
assert.strictEqual(norm.submissionDate, '2026-08-15');

// Test 4: Fingerprint change detection
const proposalsA = [norm];
const fpA = generateDataFingerprint(proposalsA);
const proposalsB = [{ ...norm, contractValue: 900000 }];
const fpB = generateDataFingerprint(proposalsB);
assert.notStrictEqual(fpA, fpB, 'Fingerprints must differ when value changes');

const proposalsA2 = [JSON.parse(JSON.stringify(norm))];
const fpA2 = generateDataFingerprint(proposalsA2);
assert.strictEqual(fpA, fpA2, 'Fingerprints must match when data is identical');

console.log('✅ All sheetService unit tests passed successfully!\n');
