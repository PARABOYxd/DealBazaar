'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { apiService } from '@/lib/api';
import { User, UserState, LoginResponse } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (accessToken: string, userData: Partial<User>, refreshToken?: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setRedirectPath: (path: string) => void;
  getAndClearRedirectPath: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'access_token';
const REDIRECT_PATH_KEY = 'redirect_path';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';
const USER_PROFILE_STATUS_KEY = 'user_profile_status'; // Key for storing the user's profile status

export const clearAuthData = () => {
  console.log('clearAuthData: Clearing authentication data');
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(USER_PROFILE_STATUS_KEY); // Clear the profile status key as well
  destroyCookie(null, REFRESH_TOKEN_KEY, { path: '/' });
  console.log('clearAuthData: Authentication data cleared');
};

const getStoredAuthData = (): { token: string | null; user: User | null; isNewStatus: boolean | null } => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const userData = localStorage.getItem(USER_DATA_KEY);
  const isNewStatus = localStorage.getItem(USER_PROFILE_STATUS_KEY); // Retrieve the profile status key

  return {
    token,
    user: userData ? JSON.parse(userData) : null,
    isNewStatus: isNewStatus ? JSON.parse(isNewStatus) : null,
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('initializeAuth: Starting authentication initialization');
      const { token: storedAccessToken, user: storedUser, isNewStatus: storedIsNewStatus } = getStoredAuthData(); // Get the new key
      const cookies = parseCookies();
      const storedRefreshToken = cookies[REFRESH_TOKEN_KEY];

      if (storedAccessToken && storedUser) {
        console.log('initializeAuth: Access token and user data found. Verifying token...');
        try {
          await apiService.getAuthStatus(); // Attempt to verify token
          setIsAuthenticated(true);
          setUser(storedUser);
          console.log('initializeAuth: Token verified, isAuthenticated set to true.');
        } catch (error) {
          console.error('initializeAuth: Token verification failed:', error);
          clearAuthData();
          setIsAuthenticated(false);
        }
      } else if (storedRefreshToken) {
        console.log('initializeAuth: No access token/user data, but refresh token found. Attempting to refresh token.');
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
            // Try to fetch user data after successful token refresh
            try {
              const authStatusResponse = await apiService.getAuthStatus();
              if (authStatusResponse.status === 200 && authStatusResponse.data) {
                setUser(authStatusResponse.data);
                localStorage.setItem(USER_DATA_KEY, JSON.stringify(authStatusResponse.data));
              }
            } catch (userDataError) {
              console.warn('initializeAuth: Could not fetch user data after token refresh:', userDataError);
              // User is still authenticated, just without user data
            }
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

  const login = async (accessToken: string, userData: Partial<User>, refreshToken?: string) => {
    console.log('login: Attempting to log in');
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    
    // Create new user object from userData, don't merge with potentially null user state
    const newUser = { ...userData } as User;
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));

    // Store the isNew flag separately as requested by the user
     console.log('risga' , newUser);
    if (typeof newUser.status !== 'undefined') {
      console.log('risga' , newUser.status);
      localStorage.setItem(USER_PROFILE_STATUS_KEY, JSON.stringify(newUser.status));
      console.log('login: user profile status stored separately as user_profile_status');
    }

    console.log('login: Access token and user data stored');

    if (refreshToken) {
      setCookie(null, REFRESH_TOKEN_KEY, refreshToken, { path: '/', maxAge: 30 * 24 * 60 * 60 });
      console.log('login: Refresh token stored in cookie');
    }

    setIsAuthenticated(true);
    setUser(newUser);
    console.log('login: isAuthenticated set to true, user data set');
  };

  const logout = () => {
    console.log('logout: Attempting to log out');
    setIsAuthenticated(false);
    setUser(null);
    clearAuthData();
    console.log('logout: User logged out');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...userData };
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
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
        user,
        login,
        logout,
        updateUser,
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
