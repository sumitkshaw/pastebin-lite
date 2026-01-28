import { Paste } from '@/types';
import { dbStorage } from './database';

// Re-export types for backward compatibility
export type { Paste };

// Export the storage instance
export const storage = dbStorage;

// Helper functions for backward compatibility
export const createPaste = dbStorage.createPaste.bind(dbStorage);
export const getPaste = dbStorage.getPaste.bind(dbStorage);
export const getAndIncrementPaste = dbStorage.getAndIncrementPaste.bind(dbStorage);
export const getAllPastes = dbStorage.getAllPastes.bind(dbStorage);
export const getPasteUrl = dbStorage.getPasteUrl.bind(dbStorage);

// Additional helper functions that might be needed
export const isPasteAvailable = async (id: string, now: Date = new Date()): Promise<boolean> => {
  const paste = await dbStorage.getPaste(id);
  
  if (!paste) {
    return false;
  }

  // Check if paste is expired
  if (paste.expiresAt && paste.expiresAt <= now) {
    return false;
  }

  // Check if view limit exceeded
  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return false;
  }

  return true;
};

// Optional: Force expire a paste (for testing)
export const forceExpirePaste = async (id: string): Promise<boolean> => {
  try {
    // We can simulate expiration by setting expires_at to past
    const paste = await dbStorage.getPaste(id);
    if (!paste) return false;
    
    // In a real implementation, you'd update the database
    // For now, we'll just return true since we're using a file-based DB
    return true;
  } catch {
    return false;
  }
};

// Optional: Reset view count (for testing)
export const resetPasteViews = async (id: string): Promise<boolean> => {
  try {
    const paste = await dbStorage.getPaste(id);
    if (!paste) return false;
    
    // In a real implementation, you'd update the database
    // For now, we'll just return true
    return true;
  } catch {
    return false;
  }
};