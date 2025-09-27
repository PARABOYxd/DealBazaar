'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { apiService } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken?: string) => Promise<void>;
  logout: () => void;
  setRedirectPath: (path: string) => void;
  getAndClearRedirectPath: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'access_token';
const REDIRECT_PATH_KEY = 'redirect_path';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const clearAuthData = () => {
  console.log('clearAuthData: Clearing authentication data');
  localStorage.removeItem(AUTH_TOKEN_KEY);
  destroyCookie(null, REFRESH_TOKEN_KEY, { path: '/' });
  console.log('clearAuthData: Authentication data cleared');
};

const getStoredAuthData = (): { token: string | null } => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return { token: null };
  return { token };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('initializeAuth: Starting authentication initialization');
      const { token: storedAccessToken, user: storedUser } = getStoredAuthData();
      const cookies = parseCookies();
      const storedRefreshToken = cookies[REFRESH_TOKEN_KEY];

      if (storedAccessToken) {
        console.log('initializeAuth: Access token found, setting isAuthenticated to true');
        setIsAuthenticated(true);
      } else if (storedRefreshToken) {
        console.log('initializeAuth: No access token, but refresh token found. Attempting to refresh token.');
        try {
          const response = await apiService.refreshToken(storedRefreshToken);
          if (response.status === 200 && response.data?.accessToken) {
            console.log('initializeAuth: Token refreshed successfully.');
            localStorage.setItem(AUTH_TOKEN_KEY, response.data.accessToken);
            setIsAuthenticated(true);
            // If the refresh token also gets updated, store it
            if (response.data.refreshToken) {
              setCookie(null, REFRESH_TOKEN_KEY, response.data.refreshToken, { path: '/', maxAge: 30 * 24 * 60 * 60 });
            }
            // User data is not fetched by this provider, so it remains null or needs separate handling
          } else {
            console.log('initializeAuth: Failed to refresh token, clearing auth data.');
            clearAuthData();
          }
        } catch (error) {
          console.error('initializeAuth: Error refreshing token:', error);
          clearAuthData();
        }
      } else {
        console.log('initializeAuth: No access token or refresh token found.');
        clearAuthData(); // Ensure everything is cleared if no tokens are present
      }
      setIsLoading(false);
      console.log('initializeAuth: Authentication initialization finished');
    };

    initializeAuth();
  }, []);

  const login = async (accessToken: string, refreshToken?: string) => {
    console.log('login: Attempting to log in');
    // Store the accessToken immediately after successful verification
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    console.log('login: Access token stored');

    if (refreshToken) {
      setCookie(null, REFRESH_TOKEN_KEY, refreshToken, { path: '/', maxAge: 30 * 24 * 60 * 60 });
      console.log('login: Refresh token stored in cookie');
    }

    setIsAuthenticated(true);
    console.log('login: isAuthenticated set to true');
  };

  const logout = () => {
    console.log('logout: Attempting to log out');
    setIsAuthenticated(false);
    clearAuthData();
    console.log('logout: User logged out');
  };

  const setRedirectPath = (path: string) => {
    localStorage.setItem(REDIRECT_PATH_KEY, path);
  };

  const getAndClearRedirectPath = (): string | null => {
    const path = localStorage.getItem(REDIRECT_PATH_KEY);
    localStorage.removeItem(REDIRECT_PATH_KEY);
    return path;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        setRedirectPath,
        getAndClearRedirectPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
