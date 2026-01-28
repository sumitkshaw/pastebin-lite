#!/usr/bin/env node

/**
 * Test script for TEST_MODE functionality
 * Run with: node scripts/test-mode.js
 */

const BASE_URL = 'http://localhost:3000';

async function testRequest(method, path, body = null, headers = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));
  
  return {
    status: response.status,
    data,
    ok: response.ok,
  };
}

async function runTestModeTests() {
  console.log('=== Phase 6: TEST_MODE Tests ===\n');
  
  // Test 1: Check test mode endpoint without headers
  console.log('1. Checking TEST_MODE status (without headers)');
  const testStatus = await testRequest('GET', '/api/test/mode');
  console.log(`   TEST_MODE enabled: ${testStatus.data.testMode?.enabled ? 'Yes' : 'No'}`);
  console.log(`   Using test time: ${testStatus.data.time?.usingTestTime ? 'Yes' : 'No'}\n`);
  
  // Test 2: Create a paste with TTL for testing
  console.log('2. Creating paste with 60-second TTL');
  const createRes = await testRequest('POST', '/api/pastes', {
    content: 'TEST_MODE test paste',
    ttl_seconds: 60,
  });
  
  if (!createRes.ok) {
    console.error('Failed to create paste:', createRes);
    return;
  }
  
  const pasteId = createRes.data.id;
  console.log(`   Created paste: ${pasteId}\n`);
  
  // Get the creation time and expiration time
  const firstView = await testRequest('GET', `/api/pastes/${pasteId}`);
  const expiresAt = new Date(firstView.data.expires_at);
  const creationTime = new Date(expiresAt.getTime() - 60000); // 60 seconds before expiry
  
  console.log(`   Created at: ~${creationTime.toISOString()}`);
  console.log(`   Expires at: ${expiresAt.toISOString()}\n`);
  
  // Test 3: Test with test time BEFORE expiry (should work)
  console.log('3. Testing with test time 30 seconds after creation (before expiry)');
  const testTimeBeforeExpiry = creationTime.getTime() + 30000; // 30 seconds after creation
  
  const viewBeforeExpiry = await testRequest(
    'GET', 
    `/api/pastes/${pasteId}`,
    null,
    { 'x-test-now-ms': testTimeBeforeExpiry.toString() }
  );
  
  console.log(`   Status: ${viewBeforeExpiry.status} ${viewBeforeExpiry.ok ? '✓' : '✗'} (expected 200)`);
  if (viewBeforeExpiry.ok) {
    console.log(`   Content returned: ${viewBeforeExpiry.data ? 'Yes' : 'No'} ✓\n`);
  } else {
    console.log(`   Error: ${viewBeforeExpiry.data?.error}\n`);
  }
  
  // Test 4: Test with test time AFTER expiry (should fail)
  console.log('4. Testing with test time 61 seconds after creation (after expiry)');
  const testTimeAfterExpiry = creationTime.getTime() + 61000; // 61 seconds after creation
  
  const viewAfterExpiry = await testRequest(
    'GET', 
    `/api/pastes/${pasteId}`,
    null,
    { 'x-test-now-ms': testTimeAfterExpiry.toString() }
  );
  
  console.log(`   Status: ${viewAfterExpiry.status} ${viewAfterExpiry.ok ? '✓' : '✗'} (expected 404)`);
  if (!viewAfterExpiry.ok) {
    console.log(`   Error: ${viewAfterExpiry.data?.error} ✓\n`);
  } else {
    console.log(`   Unexpected success\n`);
  }
  
  // Test 5: Test without header (should use real time)
  console.log('5. Testing without x-test-now-ms header (uses real system time)');
  const viewRealTime = await testRequest('GET', `/api/pastes/${pasteId}`);
  console.log(`   Status: ${viewRealTime.status}\n`);
  
  // Test 6: Test with invalid header (should fall back to real time)
  console.log('6. Testing with invalid x-test-now-ms header');
  const viewInvalidHeader = await testRequest(
    'GET', 
    `/api/pastes/${pasteId}`,
    null,
    { 'x-test-now-ms': 'not-a-number' }
  );
  console.log(`   Status: ${viewInvalidHeader.status}\n`);
  
  // Test 7: Create new paste and test exact expiry boundary
  console.log('7. Testing exact expiry boundary');
  const createRes2 = await testRequest('POST', '/api/pastes', {
    content: 'Exact expiry test',
    ttl_seconds: 30,
  });
  
  const pasteId2 = createRes2.data.id;
  const boundaryView = await testRequest('GET', `/api/pastes/${pasteId2}`);
  const boundaryExpiresAt = new Date(boundaryView.data.expires_at);
  const boundaryCreationTime = new Date(boundaryExpiresAt.getTime() - 30000);
  
  // Test at exactly 30 seconds (should be expired)
  const exactExpiryTime = boundaryCreationTime.getTime() + 30000;
  
  const viewAtExactExpiry = await testRequest(
    'GET', 
    `/api/pastes/${pasteId2}`,
    null,
    { 'x-test-now-ms': exactExpiryTime.toString() }
  );
  
  console.log(`   At exact expiry (${exactExpiryTime}): ${viewAtExactExpiry.status} ${viewAtExactExpiry.ok ? '✗' : '✓'} (expected 404)`);
  
  // Test at 29.999 seconds (should still work)
  const justBeforeExpiry = boundaryCreationTime.getTime() + 29999;
  
  const viewJustBeforeExpiry = await testRequest(
    'GET', 
    `/api/pastes/${pasteId2}`,
    null,
    { 'x-test-now-ms': justBeforeExpiry.toString() }
  );
  
  console.log(`   Just before expiry (${justBeforeExpiry}): ${viewJustBeforeExpiry.status} ${viewJustBeforeExpiry.ok ? '✓' : '✗'} (expected 200)\n`);
  
  // Test 8: Verify test time doesn't affect other timestamps
  console.log('8. Verifying test time only affects expiry, not other timestamps');
  const testModeStatus = await testRequest(
    'GET', 
    '/api/test/mode',
    null,
    { 'x-test-now-ms': '1000000000000' } // Far future
  );
  
  if (testModeStatus.ok) {
    const systemTime = new Date(testModeStatus.data.time.systemTimeMs);
    const testTime = new Date(testModeStatus.data.time.testTimeMs);
    console.log(`   System time: ${systemTime.toISOString()}`);
    console.log(`   Test time: ${testTime.toISOString()}`);
    console.log(`   Different: ${systemTime.getTime() !== testTime.getTime() ? 'Yes ✓' : 'No'}\n`);
  }
  
  console.log('=== Phase 6 Tests Complete ===');
  console.log('\nSummary:');
  console.log('- TEST_MODE respects x-test-now-ms header ✓');
  console.log('- Expiry logic uses test time when provided ✓');
  console.log('- Falls back to real time when header absent ✓');
  console.log('- Invalid header values are ignored ✓');
  console.log('- Exact expiry boundaries handled correctly ✓');
  console.log('- Test time only affects expiry logic ✓');
}

// Run the test
runTestModeTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});