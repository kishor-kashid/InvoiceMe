/**
 * Payment type definitions
 */

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  createdAt: string;
}

export interface CreatePaymentRequest {
  amount: number;
  paymentDate: string;
}

export interface PaymentListResponse {
  payments: Payment[];
  total: number;
}

