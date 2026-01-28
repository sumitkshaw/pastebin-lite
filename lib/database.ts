import { createClient } from '@libsql/client';
import { customAlphabet } from 'nanoid';

// Generate short IDs
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);

// Create database client
const client = createClient({
  url: process.env.TURSO_DB_URL || 'file:local.db',
  authToken: process.env.TURSO_DB_AUTH_TOKEN,
});

// Initialize database
async function initializeDatabase() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS pastes (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      views INTEGER DEFAULT 0,
      max_views INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      CONSTRAINT fk_pastes CHECK (views >= 0)
    )
  `);
  
  await client.execute(`
    CREATE INDEX IF NOT EXISTS idx_expires_at ON pastes(expires_at)
    WHERE expires_at IS NOT NULL
  `);
  
  console.log('Database initialized');
}

// Initialize on import
initializeDatabase().catch(console.error);

// Database storage implementation
export class DatabaseStorage {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async createPaste(content: string, ttlSeconds?: number, maxViews?: number) {
    const id = nanoid();
    const createdAt = new Date();
    const expiresAt = ttlSeconds 
      ? new Date(createdAt.getTime() + ttlSeconds * 1000)
      : null;

    await client.execute({
      sql: `
        INSERT INTO pastes (id, content, max_views, expires_at)
        VALUES (?, ?, ?, ?)
      `,
      args: [id, content, maxViews || null, expiresAt?.toISOString() || null],
    });

    return {
      id,
      content,
      createdAt,
      expiresAt,
      maxViews: maxViews || null,
      views: 0,
    };
  }

  async getAndIncrementPaste(id: string, now: Date = new Date()): Promise<any> {
    try {
      // Get the paste first
      const result = await client.execute({
        sql: `
          SELECT * FROM pastes 
          WHERE id = ? 
          AND (expires_at IS NULL OR expires_at > ?)
          AND (max_views IS NULL OR views < max_views)
        `,
        args: [id, now.toISOString()],
      });

      if (result.rows.length === 0) {
        return null;
      }

      const paste = result.rows[0];
      
      // Increment view count
      await client.execute({
        sql: 'UPDATE pastes SET views = views + 1 WHERE id = ?',
        args: [id],
      });

      // Return the updated paste data
      return {
        id: paste.id as string,
        content: paste.content as string,
        createdAt: new Date(paste.created_at as string),
        expiresAt: paste.expires_at 
          ? new Date(paste.expires_at as string)
          : null,
        maxViews: paste.max_views as number | null,
        views: (paste.views as number) + 1,
      };
    } catch (error) {
      console.error('Error in getAndIncrementPaste:', error);
      return null;
    }
  }

  async getPaste(id: string): Promise<any> {
    try {
      const result = await client.execute({
        sql: 'SELECT * FROM pastes WHERE id = ?',
        args: [id],
      });

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id as string,
        content: row.content as string,
        createdAt: new Date(row.created_at as string),
        expiresAt: row.expires_at ? new Date(row.expires_at as string) : null,
        maxViews: row.max_views as number | null,
        views: row.views as number,
      };
    } catch (error) {
      console.error('Error in getPaste:', error);
      return null;
    }
  }

  async getAllPastes(): Promise<any[]> {
    try {
      const result = await client.execute('SELECT * FROM pastes ORDER BY created_at DESC');
      
      return result.rows.map(row => ({
        id: row.id as string,
        content: row.content as string,
        createdAt: new Date(row.created_at as string),
        expiresAt: row.expires_at ? new Date(row.expires_at as string) : null,
        maxViews: row.max_views as number | null,
        views: row.views as number,
      }));
    } catch (error) {
      console.error('Error in getAllPastes:', error);
      return [];
    }
  }

  getPasteUrl(id: string): string {
    return `${this.baseUrl}/p/${id}`;
  }
}

// Create singleton
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
export const dbStorage = new DatabaseStorage(baseUrl);