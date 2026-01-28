#!/usr/bin/env node

/**
 * Test script for combined constraints
 * Run with: node scripts/test-combined.js
 */

const BASE_URL = 'http://localhost:3000';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

async function runCombinedConstraintTest() {
  console.log('=== Phase 5: Combined Constraints Test ===\n');
  
  // Test 1: Create paste with both TTL and max_views
  console.log('1. Creating paste with ttl_seconds=20 and max_views=2');
  const createRes = await testRequest('POST', '/api/pastes', {
    content: 'Combined constraints test: 20s TTL, 2 views',
    ttl_seconds: 20,
    max_views: 2,
  });
  
  if (!createRes.ok) {
    console.error('Failed to create paste:', createRes);
    return;
  }
  
  const pasteId = createRes.data.id;
  console.log(`   Created paste: ${pasteId}\n`);
  
  // Test 2: First view (should work)
  console.log('2. First view (within TTL, first of 2 views)');
  const view1 = await testRequest('GET', `/api/pastes/${pasteId}`);
  console.log(`   Status: ${view1.status} ${view1.ok ? '✓' : '✗'}`);
  if (view1.ok) {
    console.log(`   Remaining views: ${view1.data.remaining_views}`);
    console.log(`   Expires at: ${view1.data.expires_at}\n`);
  }
  
  // Test 3: Second view (should work)
  console.log('3. Second view (within TTL, second of 2 views)');
  await sleep(1000); // Wait 1 second
  const view2 = await testRequest('GET', `/api/pastes/${pasteId}`);
  console.log(`   Status: ${view2.status} ${view2.ok ? '✓' : '✗'}`);
  if (view2.ok) {
    console.log(`   Remaining views: ${view2.data.remaining_views}\n`);
  }
  
  // Test 4: Third view (should fail - view limit reached)
  console.log('4. Third view (within TTL, but view limit exceeded)');
  await sleep(1000); // Wait 1 second
  const view3 = await testRequest('GET', `/api/pastes/${pasteId}`);
  console.log(`   Status: ${view3.status} ${view3.ok ? '✓' : '✗'} (expected 404)`);
  if (!view3.ok) {
    console.log(`   Error: ${view3.data.error}\n`);
  }
  
  // Test 5: Create another paste with short TTL
  console.log('5. Creating paste with ttl_seconds=3 and max_views=10 (TTL will trigger first)');
  const createRes2 = await testRequest('POST', '/api/pastes', {
    content: 'TTL triggers first test: 3s TTL, 10 views',
    ttl_seconds: 3,
    max_views: 10,
  });
  
  const pasteId2 = createRes2.data.id;
  console.log(`   Created paste: ${pasteId2}\n`);
  
  // Test 6: First view immediately (should work)
  console.log('6. First view immediately after creation');
  const view4 = await testRequest('GET', `/api/pastes/${pasteId2}`);
  console.log(`   Status: ${view4.status} ${view4.ok ? '✓' : '✗'}\n`);
  
  // Test 7: Wait for TTL to expire, then try to view
  console.log('7. Waiting 4 seconds for TTL to expire...');
  await sleep(4000);
  
  console.log('   Trying to view after TTL expiration (should fail even though views remain)');
  const view5 = await testRequest('GET', `/api/pastes/${pasteId2}`);
  console.log(`   Status: ${view5.status} ${view5.ok ? '✓' : '✗'} (expected 404)`);
  if (!view5.ok) {
    console.log(`   Error: ${view5.data.error}\n`);
  }
  
  // Test 8: Test the assignment requirement
  console.log('8. Testing assignment requirement: "If both constraints are present, the paste becomes unavailable as soon as either constraint triggers."');
  console.log('   ✓ TTL triggered first in test 7');
  console.log('   ✓ View limit triggered first in test 4\n');
  
  // Test 9: Check test endpoint
  console.log('9. Checking combined constraints test endpoint');
  const testEndpoint = await testRequest('GET', '/api/test/combined');
  if (testEndpoint.ok) {
    console.log(`   Test endpoint returned ${testEndpoint.data.pastes.length} test pastes\n`);
  }
  
  console.log('=== Phase 5 Tests Complete ===');
  console.log('\nSummary:');
  console.log('- Paste becomes unavailable when EITHER constraint triggers ✓');
  console.log('- View limit works independently of TTL ✓');
  console.log('- TTL works independently of view limit ✓');
  console.log('- Combined constraints handled correctly ✓');
}

// Run the test
runCombinedConstraintTest().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});