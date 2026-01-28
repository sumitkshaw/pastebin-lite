import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

export async function GET() {
  try {
    // Test database connection
    const testClient = createClient({
      url: process.env.TURSO_DB_URL || 'file:local.db',
      authToken: process.env.TURSO_DB_AUTH_TOKEN,
    });
    
    await testClient.execute('SELECT 1 as test');
    
    return NextResponse.json(
      { 
        ok: true,
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      { 
        ok: false,
        database: 'disconnected',
        error: 'Cannot connect to database',
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}