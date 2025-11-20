
import { Card, PricePoint, NewsItem, ApiResponse, Language, CardCategory, User, AuthResponse } from '../types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- MOCK DATA STORE ---
let mockCards: Card[] = Array.from({ length: 50 }).map((_, i) => {
  const langs = [Language.EN, Language.TH, Language.JP];
  const cats = ['Pokemon', 'Baseball', 'Football'];
  const cat = cats[i % 3];
  const basePrice = Math.floor(Math.random() * 500) + 10;
  
  return {
    id: `card-${i}`,
    name: `${cat} Star Player ${i + 1}`,
    language: langs[i % 3],
    setName: `Set Gen ${i % 5}`,
    year: 2020 + (i % 5),
    condition: 'Mint 9',
    imageUrl: `https://picsum.photos/400/560?random=${i}`,
    images: [
      { id: `img-${i}-1`, url: `https://picsum.photos/400/560?random=${i}`, sortOrder: 0 },
      { id: `img-${i}-2`, url: `https://picsum.photos/400/560?random=${100+i}`, sortOrder: 1 }
    ],
    manualPrice: basePrice,
    category: cat
  };
});

// Mock Users Store
interface MockUser extends User {
  password: string;
  verificationCode?: string;
  isVerified: boolean;
}

const mockUsers: MockUser[] = [
  { 
    id: 'admin-1', 
    username: 'admin', 
    email: 'admin@cardcollector.pro', 
    password: 'password', 
    role: 'admin', 
    isVerified: true 
  }
];

// Mock QR Store
let mockQrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://line.me/ti/p/@cardcollector";

export const apiService = {
  // --- AUTH API ---

  login: async (emailOrUsername: string, password: string): Promise<AuthResponse> => {
    await delay(800);
    const user = mockUsers.find(u => 
      (u.email === emailOrUsername || u.username === emailOrUsername) && 
      u.password === password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (!user.isVerified) {
      throw new Error("Email not verified. Please verify your email first.");
    }

    return {
      user: { id: user.id, email: user.email, username: user.username, role: user.role },
      token: `jwt-token-${user.id}-${Date.now()}`
    };
  },

  register: async (email: string, password: string): Promise<void> => {
    await delay(800);
    
    if (mockUsers.find(u => u.email === email)) {
      throw new Error("Email already exists");
    }

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real app, this would trigger an email service
    console.log(`%c[EMAIL SIMULATION] Verification Code for ${email}: ${code}`, "color: #2563eb; font-weight: bold; font-size: 14px;");

    mockUsers.push({
      id: `user-${Date.now()}`,
      username: email.split('@')[0],
      email,
      password,
      role: 'user', // Default role
      isVerified: false,
      verificationCode: code
    });
  },

  verifyEmail: async (email: string, code: string): Promise<AuthResponse> => {
    await delay(800);
    const user = mockUsers.find(u => u.email === email);

    if (!user) throw new Error("User not found");
    if (user.isVerified) throw new Error("User already verified");
    
    if (user.verificationCode !== code) {
      throw new Error("Invalid verification code");
    }

    user.isVerified = true;
    delete user.verificationCode;

    return {
      user: { id: user.id, email: user.email, username: user.username, role: user.role },
      token: `jwt-token-${user.id}-${Date.now()}`
    };
  },

  resendCode: async (email: string): Promise<void> => {
    await delay(500);
    const user = mockUsers.find(u => u.email === email);
    if (user && !user.isVerified) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationCode = code;
      console.log(`%c[EMAIL SIMULATION] Resent Verification Code for ${email}: ${code}`, "color: #2563eb; font-weight: bold; font-size: 14px;");
    }
  },

  getUserProfile: async (token: string): Promise<User> => {
    await delay(300);
    // Simulate getting user from token
    const user = mockUsers.find(u => token.includes(u.id));
    if (!user) throw new Error("Invalid token");
    return { id: user.id, email: user.email, username: user.username, role: user.role };
  },

  // --- PUBLIC API ---

  getCards: async (page: number = 1, limit: number = 10, category?: string, language?: Language): Promise<ApiResponse<Card[]>> => {
    await delay(500);
    
    let filtered = [...mockCards];
    
    // 1. Filter
    if (category && category !== CardCategory.ALL) {
      filtered = filtered.filter(c => c.category === category);
    }
    if (language) {
      filtered = filtered.filter(c => c.language === language);
    }

    // 2. Sort by Highest Price (Manual Price priority)
    filtered.sort((a, b) => {
      const priceA = a.manualPrice || 0;
      const priceB = b.manualPrice || 0;
      return priceB - priceA; // Descending
    });

    // 3. Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit
    };
  },

  getCardById: async (id: string): Promise<Card | undefined> => {
    await delay(300);
    return mockCards.find(c => c.id === id);
  },

  getPriceHistory: async (cardId: string): Promise<PricePoint[]> => {
    await delay(600);
    const points: PricePoint[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      points.push({
        date: d.toLocaleDateString(),
        price: 100 + Math.random() * 50
      });
    }
    return points;
  },

  getLineQr: async (): Promise<string> => {
    await delay(400);
    return mockQrUrl;
  },

  getNews: async (): Promise<NewsItem[]> => {
    await delay(300);
    return [
      { id: '1', title: 'New Shipment Arrived!', content: 'We just received a huge batch of vintage cards.', date: '2023-10-01' },
      { id: '2', title: 'Holiday Sale', content: 'All Pokemon cards are 10% off this week.', date: '2023-10-05' }
    ];
  },

  // --- ADMIN API ---

  updateLineQr: async (file: File): Promise<string> => {
    await delay(1000);
    // In a real app, upload to server/s3 and return URL
    // For mock, create a local object URL that persists for the session
    const newUrl = URL.createObjectURL(file);
    mockQrUrl = newUrl;
    return newUrl;
  },

  createCard: async (cardData: Omit<Card, 'id'>): Promise<Card> => {
    await delay(800);
    const newCard: Card = {
      ...cardData,
      id: `card-${Date.now()}`,
    };
    mockCards.unshift(newCard);
    return newCard;
  },

  updateCard: async (id: string, cardData: Partial<Card>): Promise<Card> => {
    await delay(800);
    const index = mockCards.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Card not found");
    
    mockCards[index] = { ...mockCards[index], ...cardData };
    return mockCards[index];
  },

  deleteCard: async (id: string): Promise<boolean> => {
    await delay(600);
    mockCards = mockCards.filter(c => c.id !== id);
    return true;
  },

  uploadImage: async (file: File): Promise<string> => {
    await delay(1000);
    return URL.createObjectURL(file);
  }
};
