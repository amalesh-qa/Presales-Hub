// Verification test script for Live Google Spreadsheet Integration
import assert from 'node:assert';

const BASE_URL = 'http://localhost:5173';

async function runTests() {
  console.log('🧪 Starting Live Google Spreadsheet Integration Verification...\n');

  // Test 1: Fetch Live Test Sheet CSV
  console.log('Test 1: Verify Live Test Sheet CSV endpoint...');
  const res1 = await fetch(`${BASE_URL}/api/live-test-sheet/export?format=csv`);
  assert.strictEqual(res1.status, 200, 'Expected status 200 from live test sheet');
  const csvText1 = await res1.text();
  assert(csvText1.includes('Opportunity Name'), 'CSV should contain Opportunity Name header');
  assert(csvText1.includes('Fintech Core Banking QE Automation'), 'CSV should contain initial proposal');
  console.log('✅ Test 1 passed: Live sheet CSV returned valid proposal data.\n');

  // Test 2: Edit a Cell (Mutation)
  console.log('Test 2: Edit a cell in the live spreadsheet...');
  const editRes = await fetch(`${BASE_URL}/api/live-test-sheet/edit-cell`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'prop-101',
      field: 'contractValue',
      value: 995000
    })
  });
  assert.strictEqual(editRes.status, 200, 'Expected status 200 from edit-cell');
  const editData = await editRes.json();
  assert.strictEqual(editData.success, true, 'Mutation should succeed');
  assert.strictEqual(editData.updated.contractValue, 995000, 'Value should be updated to 995000');

  // Confirm CSV export reflects the edit
  const res2 = await fetch(`${BASE_URL}/api/live-test-sheet/export?format=csv`);
  const csvText2 = await res2.text();
  assert(csvText2.includes('995000'), 'Exported CSV must reflect modified contractValue 995000');
  console.log('✅ Test 2 passed: Cell edit immediately reflected in sheet export.\n');

  // Test 3: Add a New Row (Live Expansion)
  console.log('Test 3: Add a new row to the live spreadsheet...');
  const addRes = await fetch(`${BASE_URL}/api/live-test-sheet/add-row`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      opportunityName: 'Autonomous AI Agent QE Pipeline',
      clientName: 'DeepMind Partners',
      region: 'North America',
      qeScope: 'AI / ML Testing',
      status: 'Won',
      contractValue: 1500000,
      submissionDate: '2026-10-21',
      winLossReason: 'Demonstrated revolutionary generative testing POC.'
    })
  });
  assert.strictEqual(addRes.status, 201, 'Expected status 201 from add-row');
  const addData = await addRes.json();
  assert.strictEqual(addData.success, true, 'Row addition should succeed');

  // Confirm CSV contains the new row
  const res3 = await fetch(`${BASE_URL}/api/live-test-sheet/export?format=csv`);
  const csvText3 = await res3.text();
  assert(csvText3.includes('Autonomous AI Agent QE Pipeline'), 'Exported CSV must contain newly added row');
  assert(csvText3.includes('1500000'), 'Exported CSV must contain contract value 1500000');
  console.log('✅ Test 3 passed: New row added and reflected in sheet export.\n');

  // Test 4: Delete a Row
  console.log('Test 4: Delete a row from the live spreadsheet...');
  const delRes = await fetch(`${BASE_URL}/api/live-test-sheet/delete-row`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.strictEqual(delRes.status, 200, 'Expected status 200 from delete-row');
  const delData = await delRes.json();
  assert.strictEqual(delData.success, true, 'Row deletion should succeed');
  console.log('✅ Test 4 passed: Row successfully deleted.\n');

  // Test 5: Reset Sheet
  console.log('Test 5: Reset sheet to initial state...');
  const resetRes = await fetch(`${BASE_URL}/api/live-test-sheet/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  assert.strictEqual(resetRes.status, 200, 'Expected status 200 from reset');
  const resetData = await resetRes.json();
  assert.strictEqual(resetData.total, 12, 'Reset should restore 12 default proposals');
  console.log('✅ Test 5 passed: Sheet successfully restored to initial state.\n');

  // Test 6: Verify CORS Proxy endpoint
  console.log('Test 6: Verify dev server CORS proxy endpoint...');
  const proxyUrl = `${BASE_URL}/api/sheet-proxy?url=${encodeURIComponent('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/gviz/tq?tqx=out:csv')}`;
  const proxyRes = await fetch(proxyUrl);
  assert.strictEqual(proxyRes.status, 200, 'Expected status 200 from proxy');
  const proxyText = await proxyRes.text();
  assert(proxyText.includes('Student Name'), 'Proxy should return remote spreadsheet content');
  console.log('✅ Test 6 passed: Dev server proxy bypassed CORS and retrieved remote sheet.\n');

  console.log('🎉 ALL 6 LIVE SPREADSHEET TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
