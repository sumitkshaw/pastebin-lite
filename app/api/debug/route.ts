import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
  const allPastes = await storage.getAllPastes(); // ADD AWAIT
  
  return NextResponse.json({
    count: allPastes.length,
    pastes: allPastes.map(paste => ({
      id: paste.id,
      content: paste.content,
      views: paste.views,
      maxViews: paste.maxViews,
      expiresAt: paste.expiresAt,
      createdAt: paste.createdAt,
    }))
  });
}