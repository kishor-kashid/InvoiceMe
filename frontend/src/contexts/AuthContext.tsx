/**
 * Authentication Context - Global auth state management
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services';
import { User, LoginRequest } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async (): Promise<void> => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // For initial auth check, just verify we have a stored user
        // Don't validate token on every page load to avoid blocking
        // Token validation will happen when making actual API calls
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response = await authService.login(credentials);
      setUser({
        username: response.username,
        roles: response.roles,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    setUser(null);
    authService.logout();
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

