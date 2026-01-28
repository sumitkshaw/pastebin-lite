import { NextRequest, NextResponse } from 'next/server';
import { TimeUtils } from '@/lib/time-utils';

/**
 * Endpoint to test TEST_MODE functionality
 */
export async function GET(request: NextRequest) {
  const systemTime = new Date();
  const testTime = TimeUtils.getCurrentTimeFromRequest(request);
  const testTimeHeader = request.headers.get('x-test-now-ms');
  const parsedTestTime = TimeUtils.parseTestTimeHeader(request);
  
  const isTestMode = TimeUtils.isTestMode();
  
  return NextResponse.json({
    testMode: {
      enabled: isTestMode,
      envVariable: process.env.TEST_MODE,
    },
    time: {
      systemTime: systemTime.toISOString(),
      systemTimeMs: systemTime.getTime(),
      testTime: testTime.toISOString(),
      testTimeMs: testTime.getTime(),
      usingTestTime: testTime.getTime() !== systemTime.getTime(),
    },
    headers: {
      'x-test-now-ms': testTimeHeader,
      parsedTestTime: parsedTestTime?.toISOString() || null,
    },
    instructions: {
      enableTestMode: 'Set TEST_MODE=1 in environment variables',
      useTestTime: 'Send x-test-now-ms header with milliseconds since epoch',
      note: 'Test time only affects expiry logic, not other timestamps',
    },
  });
}