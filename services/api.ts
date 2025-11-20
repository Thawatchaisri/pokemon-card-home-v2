import { Card, PricePoint, NewsItem, ApiResponse, Language, CardCategory, User, AuthResponse } from '../types';

const API_BASE = 'http://localhost:5000/api';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers: any = {
    'Authorization': token ? `Bearer ${token}` : '',
  };
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const apiService = {
  // --- AUTH API ---

  login: async (emailOrUsername: string, password: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrUsername, password })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  register: async (email: string, password: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error(await res.text());
  },

  verifyEmail: async (email: string, code: string): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  resendCode: async (email: string): Promise<void> => {
    await fetch(`${API_BASE}/auth/resend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  },

  getUserProfile: async (token: string): Promise<User> => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Invalid token");
    return res.json();
  },

  // --- PUBLIC API ---

  getCards: async (page: number = 1, limit: number = 10, category?: string, language?: Language): Promise<ApiResponse<Card[]>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (category) params.append('category', category);
    if (language) params.append('language', language);

    const res = await fetch(`${API_BASE}/cards?${params.toString()}`);
    return res.json();
  },

  getCardById: async (id: string): Promise<Card | undefined> => {
    const res = await fetch(`${API_BASE}/cards/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  },

  getPriceHistory: async (cardId: string): Promise<PricePoint[]> => {
    const res = await fetch(`${API_BASE}/cards/${cardId}/history`);
    return res.json();
  },

  getLineQr: async (): Promise<string> => {
    const res = await fetch(`${API_BASE}/system/qr`);
    const data = await res.json();
    return data.url || 'https://via.placeholder.com/200?text=No+QR';
  },

  getNews: async (): Promise<NewsItem[]> => {
    const res = await fetch(`${API_BASE}/news`);
    return res.json();
  },

  // --- ADMIN API ---

  updateLineQr: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/system/qr`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, // standard multipart
      body: formData
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  },

  createCard: async (cardData: Omit<Card, 'id'>): Promise<Card> => {
    const res = await fetch(`${API_BASE}/cards`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cardData)
    });
    if (!res.ok) throw new Error('Create failed');
    return res.json();
  },

  updateCard: async (id: string, cardData: Partial<Card>): Promise<Card> => {
    const res = await fetch(`${API_BASE}/cards/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(cardData)
    });
    if (!res.ok) throw new Error('Update failed');
    return res.json();
  },

  deleteCard: async (id: string): Promise<boolean> => {
    const res = await fetch(`${API_BASE}/cards/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.ok;
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: formData
    });
    
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  }
};