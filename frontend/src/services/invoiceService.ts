/**
 * Invoice API Service
 */

import { apiClient } from './api';
import {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceFilters,
  Payment,
  CreatePaymentRequest,
  PageResponse,
  PaginationParams,
} from '@/types';

const INVOICES_ENDPOINT = '/invoices';

export const invoiceService = {
  /**
   * Get all invoices with optional filters (without pagination)
   */
  getAll: async (filters?: InvoiceFilters): Promise<Invoice[]> => {
    const response = await apiClient.get<Invoice[]>(INVOICES_ENDPOINT, filters);
    return response.data;
  },

  /**
   * Get invoices with pagination and optional filters
   */
  getAllPaginated: async (filters?: InvoiceFilters, pagination?: PaginationParams): Promise<PageResponse<Invoice>> => {
    const params = { ...filters, ...pagination };
    const response = await apiClient.get<PageResponse<Invoice>>(INVOICES_ENDPOINT, params);
    return response.data;
  },

  /**
   * Get invoice by ID
   */
  getById: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get<Invoice>(`${INVOICES_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Create new invoice
   */
  create: async (data: CreateInvoiceRequest): Promise<Invoice> => {
    const response = await apiClient.post<Invoice>(INVOICES_ENDPOINT, data);
    return response.data;
  },

  /**
   * Update invoice (only in DRAFT status)
   */
  update: async (id: string, data: UpdateInvoiceRequest): Promise<Invoice> => {
    const response = await apiClient.put<Invoice>(`${INVOICES_ENDPOINT}/${id}`, data);
    return response.data;
  },

  /**
   * Mark invoice as sent
   */
  markAsSent: async (id: string): Promise<Invoice> => {
    const response = await apiClient.post<Invoice>(`${INVOICES_ENDPOINT}/${id}/send`);
    return response.data;
  },

  /**
   * Record payment for invoice
   */
  recordPayment: async (id: string, payment: CreatePaymentRequest): Promise<Payment> => {
    const response = await apiClient.post<Payment>(
      `${INVOICES_ENDPOINT}/${id}/payments`,
      payment
    );
    return response.data;
  },

  /**
   * Get payments for invoice
   */
  getPayments: async (id: string): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`${INVOICES_ENDPOINT}/${id}/payments`);
    return response.data;
  },

  /**
   * Get invoices by customer ID
   */
  getByCustomerId: async (customerId: string): Promise<Invoice[]> => {
    const response = await apiClient.get<Invoice[]>(INVOICES_ENDPOINT, { customerId });
    return response.data;
  },

  /**
   * Get invoices by status
   */
  getByStatus: async (status: string): Promise<Invoice[]> => {
    const response = await apiClient.get<Invoice[]>(INVOICES_ENDPOINT, { status });
    return response.data;
  },

  /**
   * Delete invoice (if allowed)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${INVOICES_ENDPOINT}/${id}`);
  },
};

export default invoiceService;

