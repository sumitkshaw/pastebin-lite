// import { NextRequest, NextResponse } from 'next/server';
// import { TimeUtils } from '@/lib/time-utils';

// /**
//  * Test mode endpoint to help with testing
//  */
// export async function GET(request: NextRequest) {
//   const isTestMode = TimeUtils.isTestMode();
//   const testTimeHeader = TimeUtils.parseTestTimeHeader(request);
//   const currentTime = TimeUtils.getCurrentTime(request);
  
//   return NextResponse.json({
//     testMode: {
//       enabled: isTestMode,
//       environmentVariable: process.env.TEST_MODE,
//     },
//     request: {
//       headers: {
//         'x-test-now-ms': request.headers.get('x-test-now-ms'),
//       },
//       parsedTestTime: testTimeHeader,
//     },
//     time: {
//       system: new Date().toISOString(),
//       current: currentTime.toISOString(),
//       isUsingTestTime: isTestMode && testTimeHeader !== null,
//     },
//     instructions: {
//       curlExample: 'curl -H "x-test-now-ms: 1738044800000" http://localhost:3000/api/pastes/your-paste-id',
//       enableTestMode: 'Add TEST_MODE=1 to .env.local file',
//       testTimeFormat: 'x-test-now-ms should be milliseconds since epoch',
//     },
//   });
// }

// export async function POST(request: NextRequest) {
//   const body = await request.json().catch(() => ({}));
//   const { action, timeMs, offsetSeconds } = body;
  
//   if (action === 'generate-headers') {
//     let targetTimeMs: number;
    
//     if (timeMs) {
//       targetTimeMs = parseInt(timeMs, 10);
//     } else if (offsetSeconds) {
//       const offset = parseInt(offsetSeconds, 10) * 1000;
//       targetTimeMs = Date.now() + offset;
//     } else {
//       targetTimeMs = Date.now() + 60000; // Default: 60 seconds from now
//     }
    
//     return NextResponse.json({
//       headers: {
//         'x-test-now-ms': targetTimeMs.toString(),
//       },
//       time: {
//         ms: targetTimeMs,
//         iso: new Date(targetTimeMs).toISOString(),
//         locale: new Date(targetTimeMs).toLocaleString(),
//       },
//       curlExample: `curl -H "x-test-now-ms: ${targetTimeMs}" http://localhost:3000/api/pastes/YOUR_PASTE_ID`,
//     });
//   }
  
//   return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
// }