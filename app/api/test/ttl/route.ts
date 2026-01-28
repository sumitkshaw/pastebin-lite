import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { TimeUtils } from '@/lib/time-utils';

/**
 * Test endpoint for TTL functionality
 * This helps verify that TTL is working correctly
 */
export async function GET(request: NextRequest) {
  const now = new Date();
  const testTime = TimeUtils.getCurrentTime(request);
  
  const allPastes = await storage.getAllPastes(); // Need await
  const expiredPastes = allPastes.filter(p => 
    p.expiresAt && p.expiresAt <= testTime
  );
  const activePastes = allPastes.filter(p => 
    !p.expiresAt || p.expiresAt > testTime
  );

  return NextResponse.json({
    systemTime: now.toISOString(),
    testTime: testTime.toISOString(),
    isTestMode: process.env.TEST_MODE === '1',
    testTimeHeader: request.headers.get('x-test-now-ms'),
    stats: {
      total: allPastes.length,
      expired: expiredPastes.length,
      active: activePastes.length,
    },
    pastes: allPastes.map(p => ({
      id: p.id,
      contentPreview: p.content.substring(0, 50) + (p.content.length > 50 ? '...' : ''),
      expiresAt: p.expiresAt?.toISOString() || 'Never',
      isExpired: p.expiresAt ? p.expiresAt <= testTime : false,
      timeRemaining: p.expiresAt ? 
        Math.max(0, Math.floor((p.expiresAt.getTime() - testTime.getTime()) / 1000)) + 's' :
        '∞',
      views: `${p.views}${p.maxViews !== null ? `/${p.maxViews}` : '/∞'}`,
      createdAt: p.createdAt.toISOString(),
    }))
  });
}