/**
 * Base API configuration with axios
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '@/types';

// API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Token storage keys
const TOKEN_KEY = 'invoiceme_token';
const USER_KEY = 'invoiceme_user';

/**
 * Get stored JWT token
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store JWT token
 */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove JWT token
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Get stored user data
 */
export function getUser(): { username: string; roles: string[] } | null {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

/**
 * Store user data
 */
export function setUser(user: { username: string; roles: string[] }): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Create axios instance with default config
 */
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data as ApiError;

        // Handle 401 Unauthorized - Token expired or invalid
        if (status === 401) {
          removeToken();
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }

        // Return formatted error
        const apiError: ApiError = {
          message: data?.message || 'An error occurred',
          status,
          timestamp: data?.timestamp || new Date().toISOString(),
          path: data?.path,
          errors: data?.errors,
        };

        return Promise.reject(apiError);
      }

      // Network error
      if (error.request) {
        const networkError: ApiError = {
          message: 'Network error. Please check your connection.',
          status: 0,
          timestamp: new Date().toISOString(),
        };
        return Promise.reject(networkError);
      }

      // Unknown error
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 500,
        timestamp: new Date().toISOString(),
      } as ApiError);
    }
  );

  return instance;
};

// Export singleton instance
export const api = createApiInstance();

/**
 * Generic API request handlers
 */
export const apiClient = {
  get: <T>(url: string, params?: unknown) => api.get<T>(url, { params }),
  post: <T>(url: string, data?: unknown) => api.post<T>(url, data),
  put: <T>(url: string, data?: unknown) => api.put<T>(url, data),
  patch: <T>(url: string, data?: unknown) => api.patch<T>(url, data),
  delete: <T>(url: string) => api.delete<T>(url),
};

export default api;

