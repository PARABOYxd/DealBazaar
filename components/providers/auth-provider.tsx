'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session management utilities
const AUTH_TOKEN_KEY = 'token';
const USER_DATA_KEY = 'user_data';
const TOKEN_EXPIRY_KEY = 'token_expiry';

const isTokenExpired = (expiry: string): boolean => {
  return new Date().getTime() > parseInt(expiry);
};

const saveAuthData = (token: string, user: User, expiresIn: number = 24 * 60 * 60 * 1000) => {
  const expiry = new Date().getTime() + expiresIn;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
};

const clearAuthData = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

const getStoredAuthData = (): { token: string | null; user: User | null; isValid: boolean } => {
  if (typeof window === 'undefined') {
    return { token: null, user: null, isValid: false };
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userData = localStorage.getItem(USER_DATA_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !userData || !expiry) {
    return { token: null, user: null, isValid: false };
  }

  if (isTokenExpired(expiry)) {
    clearAuthData();
    return { token: null, user: null, isValid: false };
  }

  try {
    const user = JSON.parse(userData);
    return { token, user, isValid: true };
  } catch {
    clearAuthData();
    return { token: null, user: null, isValid: false };
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const { token, user: storedUser, isValid } = getStoredAuthData();

      if (isValid && token && storedUser) {
        setIsAuthenticated(true);
        setUser(storedUser);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiry = () => {
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (expiry && isTokenExpired(expiry)) {
        logout();
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (token: string) => {
    try {
      const userResponse = await apiService.getMe(token);
      if (userResponse.success && userResponse.data) {
        loginWithUserData(userResponse.data, token);
      }
    } catch (error) {
      console.error('Failed to login', error);
      logout();
    }
  };

  const loginWithUserData = (userData: User, token: string) => {
    setIsAuthenticated(true);
    setUser(userData);
    saveAuthData(token, userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    clearAuthData();
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const { token } = getStoredAuthData();
      if (!token) return false;

      // In a real app, you would call your API to refresh the token
      // For now, we'll just extend the current token
      const newExpiry = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, newExpiry.toString());
      return true;
    } catch {
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      isLoading,
      login,
      logout,
      updateUser,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = '/signup';
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
}