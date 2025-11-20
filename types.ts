
export enum Language {
  EN = 'en',
  TH = 'th',
  JP = 'jp'
}

export enum CardCategory {
  POKEMON = 'Pokemon',
  BASEBALL = 'Baseball',
  FOOTBALL = 'Football',
  ALL = 'All'
}

export interface CardImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface Card {
  id: string;
  name: string;
  language: Language;
  setName: string;
  year: number;
  condition: string;
  imageUrl?: string; 
  images: CardImage[]; 
  manualPrice: number;
  externalCardId?: string;
  category: string;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  user: User;
  token: string;
}
