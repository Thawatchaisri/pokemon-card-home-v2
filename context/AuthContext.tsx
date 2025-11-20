
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userProfile = await apiService.getUserProfile(token);
          setUser(userProfile);
        } catch (e) {
          console.error("Session expired");
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response: AuthResponse = await apiService.login(email, password);
    localStorage.setItem('token', response.token);
    // Backward compatibility for old Admin routes
    if (response.user.role === 'admin') {
      localStorage.setItem('adminToken', response.token); 
    }
    setUser(response.user);
  };

  const register = async (email: string, password: string) => {
    await apiService.register(email, password);
  };

  const verifyEmail = async (email: string, code: string) => {
    const response: AuthResponse = await apiService.verifyEmail(email, code);
    localStorage.setItem('token', response.token);
    if (response.user.role === 'admin') {
      localStorage.setItem('adminToken', response.token);
    }
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      verifyEmail,
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
