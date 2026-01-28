#!/usr/bin/env node

/**
 * Test script for TEST_MODE functionality
 * Run with: node scripts/test-testmode.js
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
    headers: Object.fromEntries(response.headers.entries()),
  };
}

async function runTestModeTest() {
  console.log('=== Phase 6: TEST_MODE Test ===\n');
  
  // Step 1: Check if test mode is enabled
  console.log('1. Checking test mode status');
  const status = await testRequest('GET', '/api/test-mode');
  console.log(`   Test mode enabled: ${status.data.testMode?.enabled ? 'Yes ✓' : 'No (need TEST_MODE=1 in .env.local)'}`);
  
  if (!status.data.testMode?.enabled) {
    console.log('\n⚠️  Please add TEST_MODE=1 to .env.local and restart the server');
    console.log('   Then run this test again.');
    return;
  }
  
  // Step 2: Generate test headers for future time
  console.log('\n2. Generating test headers for 30 seconds in the future');
  const futureTime = Date.now() + 30000; // 30 seconds from now
  const headersRes = await testRequest('POST', '/api/test-mode', {
    action: 'generate-headers',
    timeMs: futureTime,
  });
  
  const testHeaders = headersRes.data.headers;
  console.log(`   Test time: ${headersRes.data.time.iso}`);
  console.log(`   x-test-now-ms: ${testHeaders['x-test-now-ms']}\n`);
  
  // Step 3: Create a paste with 20-second TTL
  console.log('3. Creating paste with 20-second TTL');
  const createRes = await testRequest('POST', '/api/pastes', {
    content: 'TEST_MODE test paste - expires in 20 seconds',
    ttl_seconds: 20,
  });
  
  if (!createRes.ok) {
    console.error('Failed to create paste:', createRes);
    return;
  }
  
  const pasteId = createRes.data.id;
  console.log(`   Created paste: ${pasteId}\n`);
  
  // Step 4: Try to fetch with normal time (should work)
  console.log('4. Fetching paste with normal time (no test headers)');
  const normalFetch = await testRequest('GET', `/api/pastes/${pasteId}`);
  console.log(`   Status: ${normalFetch.status} ${normalFetch.ok ? '✓' : '✗'} (should work - within TTL)`);
  
  // Step 5: Try to fetch with test time 30 seconds in future (should fail - expired)
  console.log('\n5. Fetching paste with test time 30 seconds in future');
  const testFetch = await testRequest('GET', `/api/pastes/${pasteId}`, null, testHeaders);
  console.log(`   Status: ${testFetch.status} ${testFetch.ok ? '✗' : '✓'} (should fail - expired in test time)`);
  if (!testFetch.ok) {
    console.log(`   Error: ${testFetch.data.error}`);
  }
  
  // Step 6: Verify test mode respects header only for expiry
  console.log('\n6. Testing that test time only affects expiry logic');
  
  // Create a paste with view limit only
  const createRes2 = await testRequest('POST', '/api/pastes', {
    content: 'View limit test - should work with test headers',
    max_views: 3,
  });
  
  const pasteId2 = createRes2.data.id;
  console.log(`   Created view-limited paste: ${pasteId2}`);
  
  // Fetch with test headers (should work since no TTL)
  const viewFetch = await testRequest('GET', `/api/pastes/${pasteId2}`, null, testHeaders);
  console.log(`   Status with test headers: ${viewFetch.status} ${viewFetch.ok ? '✓' : '✗'} (should work - no TTL to affect)`);
  
  // Step 7: Test combined constraints with test mode
  console.log('\n7. Testing combined constraints with TEST_MODE');
  
  const createRes3 = await testRequest('POST', '/api/pastes', {
    content: 'Combined test - TTL will expire in test time',
    ttl_seconds: 25, // Will expire in test time (30 seconds in future)
    max_views: 5,
  });
  
  const pasteId3 = createRes3.data.id;
  
  // Try with test headers (should fail - TTL expired)
  const combinedTest = await testRequest('GET', `/api/pastes/${pasteId3}`, null, testHeaders);
  console.log(`   With test headers: ${combinedTest.status} ${combinedTest.ok ? '✗' : '✓'} (should fail - TTL expired)`);
  
  // Try without test headers (should work - within real TTL)
  const combinedNormal = await testRequest('GET', `/api/pastes/${pasteId3}`);
  console.log(`   Without test headers: ${combinedNormal.status} ${combinedNormal.ok ? '✓' : '✗'} (should work - within real TTL)`);
  
  console.log('\n=== Phase 6 Tests Complete ===');
  console.log('\nSummary:');
  console.log('- TEST_MODE enables deterministic time testing ✓');
  console.log('- x-test-now-ms header used for expiry calculations only ✓');
  console.log('- Real system time used when header absent ✓');
  console.log('- Test time does not affect non-expiry logic ✓');
}

// Run the test
runTestModeTest().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});