/**
 * Invoice type definitions
 */

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
}

export interface Money {
  amount: number;
  currency: string;
}

export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: Money;
  total: Money;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName?: string;
  notes?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  lineItems: LineItem[];
  totalAmount: Money;
  paidAmount: Money;
  balance: Money;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
}

export interface CreateInvoiceRequest {
  customerId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number; // Backend expects number, not Money object
  }[];
  notes?: string;
}

export interface UpdateInvoiceRequest {
  issueDate: string;
  dueDate: string;
  notes?: string;
  // Note: Backend does not support updating line items
}

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  customerId?: string;
  page?: number;
  size?: number;
}

