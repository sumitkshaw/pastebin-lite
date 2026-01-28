import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { CreatePasteRequest, CreatePasteResponse, ErrorResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: CreatePasteRequest = await request.json();

    // Validate required fields
    if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
      return NextResponse.json<ErrorResponse>(
        { error: 'content is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (body.ttl_seconds !== undefined) {
      if (!Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
        return NextResponse.json<ErrorResponse>(
          { error: 'ttl_seconds must be an integer ≥ 1' },
          { status: 400 }
        );
      }
      // Also validate it's not too large (optional, but good practice)
      if (body.ttl_seconds > 365 * 24 * 60 * 60) { // 1 year max
        return NextResponse.json<ErrorResponse>(
          { error: 'ttl_seconds must be ≤ 1 year' },
          { status: 400 }
        );
      }
    }

    if (body.max_views !== undefined) {
      if (!Number.isInteger(body.max_views) || body.max_views < 1) {
        return NextResponse.json<ErrorResponse>(
          { error: 'max_views must be an integer ≥ 1' },
          { status: 400 }
        );
      }
      // Reasonable max limit
      if (body.max_views > 1000000) {
        return NextResponse.json<ErrorResponse>(
          { error: 'max_views must be ≤ 1,000,000' },
          { status: 400 }
        );
      }
    }

    // Create the paste - ADD AWAIT HERE!
    const paste = await storage.createPaste(
      body.content,
      body.ttl_seconds,
      body.max_views
    );

    // Prepare response
    const response: CreatePasteResponse = {
      id: paste.id,
      url: storage.getPasteUrl(paste.id),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    // Handle JSON parsing errors
    return NextResponse.json<ErrorResponse>(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }
}