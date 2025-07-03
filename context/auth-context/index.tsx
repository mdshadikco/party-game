'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { account } from '@/lib/appwrite';
import { Models, OAuthProvider } from 'appwrite';

// Define the shape of the AuthContext
interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  checkAuth: () => Promise<void>;
}

// Create the context with undefined as default and explicitly type it
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider implementation
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await account.get();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      
    await account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/dashboard`,
      `${window.location.origin}/login`
    );
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/shad-node