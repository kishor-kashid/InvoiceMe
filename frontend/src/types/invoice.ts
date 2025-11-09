/**
 * Invoice type definitions
 */

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
}

export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  lineItems: LineItem[];
  totalAmount: number;
  balanceAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceRequest {
  customerId: string;
  issueDate: string;
  dueDate: string;
  lineItems: Omit<LineItem, 'id' | 'amount'>[];
}

export interface UpdateInvoiceRequest {
  issueDate: string;
  dueDate: string;
  lineItems: Omit<LineItem, 'id' | 'amount'>[];
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

