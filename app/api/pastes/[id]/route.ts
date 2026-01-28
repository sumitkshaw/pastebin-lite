import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { TimeUtils } from '@/lib/time-utils';
import { GetPasteResponse, ErrorResponse } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get current time (respects TEST_MODE if enabled)
    const now = TimeUtils.getCurrentTime(request);
    const isTestMode = TimeUtils.isTestMode();
    const testTimeHeader = TimeUtils.parseTestTimeHeader(request);
    
    // Log test mode usage for debugging
    if (isTestMode) {
      console.log(`[TEST_MODE] Fetching paste ${id}`);
      console.log(`[TEST_MODE] Using time: ${now.toISOString()}`);
      console.log(`[TEST_MODE] Test header: ${testTimeHeader}`);
      console.log(`[TEST_MODE] System time: ${new Date().toISOString()}`);
    }
    
    // Use getAndIncrementPaste which checks constraints and increments views
    const paste = await storage.getAndIncrementPaste(id, now);
    
    if (!paste) {
      if (isTestMode) {
        console.log(`[TEST_MODE] Paste ${id} not available at test time ${now.toISOString()}`);
      }
      return NextResponse.json<ErrorResponse>(
        { error: 'Paste not found or unavailable' },
        { status: 404 }
      );
    }

    // Calculate remaining views
    const remaining_views = paste.maxViews !== null 
      ? Math.max(0, paste.maxViews - paste.views)
      : null;

    // Format expiration time
    const expires_at = paste.expiresAt 
      ? paste.expiresAt.toISOString()
      : null;

    const response: GetPasteResponse = {
      content: paste.content,
      remaining_views,
      expires_at,
    };

    if (isTestMode) {
      console.log(`[TEST_MODE] Paste ${id} served successfully at test time ${now.toISOString()}`);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error retrieving paste:', error);
    return NextResponse.json<ErrorResponse>(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}