/**
 * Customer API Service
 */

import { apiClient } from './api';
import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  PageResponse,
  PaginationParams,
} from '@/types';

const CUSTOMERS_ENDPOINT = '/customers';

// Helper function to get customer by ID (used internally)
const getCustomerById = async (id: string): Promise<Customer> => {
  const response = await apiClient.get<Customer>(`${CUSTOMERS_ENDPOINT}/${id}`);
  return response.data;
};

export const customerService = {
  /**
   * Get all customers (without pagination)
   */
  getAll: async (): Promise<Customer[]> => {
    const response = await apiClient.get<Customer[]>(CUSTOMERS_ENDPOINT);
    return response.data;
  },

  /**
   * Get customers with pagination
   */
  getAllPaginated: async (params?: PaginationParams): Promise<PageResponse<Customer>> => {
    const response = await apiClient.get<PageResponse<Customer>>(CUSTOMERS_ENDPOINT, params);
    return response.data;
  },

  /**
   * Get customer by ID
   */
  getById: getCustomerById,

  /**
   * Create new customer
   * Backend returns { id: string, message: string }, so we fetch the created customer
   */
  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const response = await apiClient.post<{ id: string; message: string }>(CUSTOMERS_ENDPOINT, data);
    // Fetch the created customer by ID
    return await getCustomerById(response.data.id);
  },

  /**
   * Update customer
   */
  update: async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
    const response = await apiClient.put<Customer>(`${CUSTOMERS_ENDPOINT}/${id}`, data);
    return response.data;
  },

  /**
   * Delete customer
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${CUSTOMERS_ENDPOINT}/${id}`);
  },

  /**
   * Search customers by name or email
   * Note: Currently returns all customers - filtering is done client-side
   */
  search: async (_query: string): Promise<Customer[]> => {
    const response = await apiClient.get<Customer[]>(CUSTOMERS_ENDPOINT);
    return response.data;
  },
};

export default customerService;

