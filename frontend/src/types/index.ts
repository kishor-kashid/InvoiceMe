/**
 * Central export for all types
 */

export * from './customer';
export * from './invoice';
export * from './payment';
export * from './auth';

/**
 * Common API response types
 */
export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * Pagination types
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

