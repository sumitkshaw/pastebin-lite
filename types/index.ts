export interface Paste {
  id: string;
  content: string;
  createdAt: Date;
  expiresAt: Date | null;
  maxViews: number | null;
  views: number;
}
// Add this new type
export interface PasteFormData {
  content: string;
  ttl_seconds?: string;
  max_views?: string;
}

export interface CreatePasteRequest {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
}

export interface CreatePasteResponse {
  id: string;
  url: string;
}

export interface GetPasteResponse {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
}

export interface ErrorResponse {
  error: string;
}