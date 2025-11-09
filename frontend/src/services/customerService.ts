/**
 * Customer API Service
 */

import { apiClient } from './api';
import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerListResponse,
} from '@/types';

const CUSTOMERS_ENDPOINT = '/customers';

export const customerService = {
  /**
   * Get all customers
   */
  getAll: async (): Promise<Customer[]> => {
    const response = await apiClient.get<Customer[]>(CUSTOMERS_ENDPOINT);
    return response.data;
  },

  /**
   * Get customer by ID
   */
  getById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<Customer>(`${CUSTOMERS_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Create new customer
   */
  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const response = await apiClient.post<Customer>(CUSTOMERS_ENDPOINT, data);
    return response.data;
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
   */
  search: async (query: string): Promise<Customer[]> => {
    const response = await apiClient.get<Customer[]>(CUSTOMERS_ENDPOINT, { q: query });
    return response.data;
  },
};

export default customerService;

