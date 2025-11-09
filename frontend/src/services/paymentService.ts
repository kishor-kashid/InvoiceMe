/**
 * Payment API Service
 */

import { apiClient } from './api';
import { Payment } from '@/types';

const PAYMENTS_ENDPOINT = '/payments';

export const paymentService = {
  /**
   * Get payment by ID
   */
  getById: async (id: string): Promise<Payment> => {
    const response = await apiClient.get<Payment>(`${PAYMENTS_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Get all payments (if endpoint exists)
   */
  getAll: async (): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(PAYMENTS_ENDPOINT);
    return response.data;
  },

  /**
   * Get payments by invoice ID
   * Note: This is typically called via invoiceService.getPayments()
   */
  getByInvoiceId: async (invoiceId: string): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/invoices/${invoiceId}/payments`);
    return response.data;
  },
};

export default paymentService;

