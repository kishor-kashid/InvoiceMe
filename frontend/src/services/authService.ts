/**
 * Authentication API Service
 */

import { apiClient, setToken, removeToken, getToken, setUser, getUser } from './api';
import { LoginRequest, LoginResponse, User } from '@/types';

const AUTH_ENDPOINT = '/auth';

export const authService = {
  /**
   * Login with username and password
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      `${AUTH_ENDPOINT}/login`,
      credentials
    );
    
    const { token, username, roles } = response.data;
    
    // Store token and user data
    setToken(token);
    setUser({ username, roles });
    
    return response.data;
  },

  /**
   * Logout - Clear local storage
   */
  logout: (): void => {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!getToken();
  },

  /**
   * Get current user
   */
  getCurrentUser: (): User | null => {
    const userData = getUser();
    if (!userData) return null;
    return {
      username: userData.username,
      roles: userData.roles,
    };
  },

  /**
   * Get auth token
   */
  getToken: (): string | null => {
    return getToken();
  },

  /**
   * Refresh token (if implemented in backend)
   */
  refreshToken: async (): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(`${AUTH_ENDPOINT}/refresh`);
    const { token, username, roles } = response.data;
    setToken(token);
    setUser({ username, roles });
    return response.data;
  },

  /**
   * Validate current token
   */
  validateToken: async (): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) return false;
      
      // Try to make an authenticated request
      await apiClient.get('/customers');
      return true;
    } catch {
      return false;
    }
  },
};

export default authService;

