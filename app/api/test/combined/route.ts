import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { TimeUtils } from '@/lib/time-utils';

/**
 * Test endpoint for combined constraints functionality
 */
export async function GET(request: NextRequest) {
  const now = TimeUtils.getCurrentTime(request);
  
  // Create test pastes with different constraint combinations
  const testPastes = [
    {
      name: 'TTL only (30s)',
      content: 'TTL only test',
      ttl_seconds: 30,
      max_views: undefined,
    },
    {
      name: 'Views only (2 views)',
      content: 'Views only test',
      ttl_seconds: undefined,
      max_views: 2,
    },
    {
      name: 'Both constraints (15s, 3 views)',
      content: 'Both constraints test',
      ttl_seconds: 15,
      max_views: 3,
    },
    {
      name: 'No constraints',
      content: 'No constraints test',
      ttl_seconds: undefined,
      max_views: undefined,
    },
  ];

  const results = [];
  
  for (const test of testPastes) {
    const paste = await storage.createPaste(  // AWAIT HERE
      test.content,
      test.ttl_seconds,
      test.max_views
    );
    
    // Check initial availability
    const isAvailable = await storage.isPasteAvailable(paste.id, now);  // AWAIT HERE
    
    results.push({
      name: test.name,
      id: paste.id,
      ttl_seconds: test.ttl_seconds,
      max_views: test.max_views,
      expiresAt: paste.expiresAt?.toISOString() || null,
      initialViews: paste.views,
      isAvailable,
      url: storage.getPasteUrl(paste.id),
    });
  }

  return NextResponse.json({
    testTime: now.toISOString(),
    pastes: results,
    note: 'These test pastes are created fresh on each request',
  });
}