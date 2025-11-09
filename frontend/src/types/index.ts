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
  sortBy?: string;
  direction?: 'asc' | 'desc';
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Default pagination values
 */
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 0;
export const DEFAULT_SORT_DIRECTION = 'desc' as const;

