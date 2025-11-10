/**
 * Invoice ViewModel - MVVM pattern for invoice management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { invoiceService, customerService } from '@/services';
import { Invoice, InvoiceStatus, CreateInvoiceRequest, UpdateInvoiceRequest, InvoiceFilters, Payment, CreatePaymentRequest, ApiError, Customer } from '@/types';
import { useToast } from '@/components/ui';

export interface InvoiceFormData {
  customerId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes?: string;
}

export interface FormErrors {
  customerId?: string;
  invoiceNumber?: string;
  issueDate?: string;
  dueDate?: string;
  lineItems?: string;
  currency?: string;
  notes?: string;
  general?: string;
}

export const useInvoiceViewModel = () => {
  const router = useRouter();
  const toast = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Load all invoices
  const loadInvoices = useCallback(async (filters?: InvoiceFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await invoiceService.getAll(filters);
      setInvoices(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load invoices');
      console.error('Load invoices error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load invoice by ID
  const loadInvoice = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const invoice = await invoiceService.getById(id);
      setSelectedInvoice(invoice);
      
      // Load payments for this invoice
      const invoicePayments = await invoiceService.getPayments(id);
      setPayments(invoicePayments);
      
      return invoice;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load invoice');
      console.error('Load invoice error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load all customers (for dropdowns)
  const loadCustomers = useCallback(async () => {
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      console.error('Load customers error:', err);
    }
  }, []);

  // Create invoice
  const createInvoice = async (formData: InvoiceFormData): Promise<boolean> => {
    setFormErrors({});
    setIsSubmitting(true);

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setIsSubmitting(false);
      return false;
    }

    try {
      const request: CreateInvoiceRequest = {
        customerId: formData.customerId.trim(),
        invoiceNumber: formData.invoiceNumber.trim(),
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        currency: formData.currency,
        lineItems: formData.lineItems.map(item => ({
          description: item.description.trim(),
          quantity: item.quantity,
          unitPrice: item.unitPrice, // Send as number, not Money object
        })),
        notes: formData.notes?.trim() || undefined,
      };

      const newInvoice = await invoiceService.create(request);
      
      // Refresh invoice list
      await loadInvoices();
      
      toast.success('Invoice created successfully');
      
      // Navigate to invoice detail page
      router.push(`/invoices/${newInvoice.id}`);
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      
      // Handle validation errors from backend
      if (apiError.errors && apiError.errors.length > 0) {
        const backendErrors: FormErrors = {};
        apiError.errors.forEach((error) => {
          const field = error.field.toLowerCase();
          if (field.includes('customer')) backendErrors.customerId = error.message;
          else if (field.includes('invoice')) backendErrors.invoiceNumber = error.message;
          else if (field.includes('issue')) backendErrors.issueDate = error.message;
          else if (field.includes('due')) backendErrors.dueDate = error.message;
          else if (field.includes('line')) backendErrors.lineItems = error.message;
          else if (field.includes('currency')) backendErrors.currency = error.message;
        });
        setFormErrors(backendErrors);
      } else {
        const errorMessage = apiError.message || 'Failed to create invoice';
        setFormErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
      
      console.error('Create invoice error:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update invoice
  const updateInvoice = async (id: string, formData: InvoiceFormData): Promise<boolean> => {
    setFormErrors({});
    setIsSubmitting(true);

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setIsSubmitting(false);
      return false;
    }

    try {
      const request: UpdateInvoiceRequest = {
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        notes: formData.notes?.trim() || undefined,
      };

      const updatedInvoice = await invoiceService.update(id, request);
      setSelectedInvoice(updatedInvoice);
      
      // Refresh invoice list
      await loadInvoices();
      
      toast.success('Invoice updated successfully');
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      
      // Handle validation errors from backend
      if (apiError.errors && apiError.errors.length > 0) {
        const backendErrors: FormErrors = {};
        apiError.errors.forEach((error) => {
          const field = error.field.toLowerCase();
          if (field.includes('issue')) backendErrors.issueDate = error.message;
          else if (field.includes('due')) backendErrors.dueDate = error.message;
          else if (field.includes('line')) backendErrors.lineItems = error.message;
          else if (field.includes('note')) backendErrors.notes = error.message;
        });
        setFormErrors(backendErrors);
      } else {
        setFormErrors({ general: apiError.message || 'Failed to update invoice' });
      }
      
      console.error('Update invoice error:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mark invoice as sent
  const markAsSent = async (id: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const updatedInvoice = await invoiceService.markAsSent(id);
      setSelectedInvoice(updatedInvoice);
      
      // Refresh invoice list
      await loadInvoices();
      
      toast.success('Invoice marked as sent successfully');
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to mark invoice as sent';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Mark as sent error:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Record payment
  const recordPayment = async (id: string, payment: CreatePaymentRequest): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const newPayment = await invoiceService.recordPayment(id, payment);
      
      // Add to payments list
      setPayments([...payments, newPayment]);
      
      // Reload invoice to get updated balance
      await loadInvoice(id);
      
      // Refresh invoice list
      await loadInvoices();
      
      toast.success('Payment recorded successfully');
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to record payment';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Record payment error:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete invoice
  const deleteInvoice = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await invoiceService.delete(id);
      
      // Remove from local state
      setInvoices(invoices.filter(inv => inv.id !== id));
      
      // Clear selected if deleted
      if (selectedInvoice?.id === id) {
        setSelectedInvoice(null);
      }
      
      toast.success('Invoice deleted successfully');
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to delete invoice';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Delete invoice error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Form validation
  const validateForm = (formData: InvoiceFormData): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.customerId.trim()) {
      errors.customerId = 'Customer is required';
    }

    if (!formData.invoiceNumber.trim()) {
      errors.invoiceNumber = 'Invoice number is required';
    }

    if (!formData.issueDate) {
      errors.issueDate = 'Issue date is required';
    }

    if (!formData.dueDate) {
      errors.dueDate = 'Due date is required';
    }

    if (formData.issueDate && formData.dueDate) {
      const issueDate = new Date(formData.issueDate);
      const dueDate = new Date(formData.dueDate);
      if (dueDate < issueDate) {
        errors.dueDate = 'Due date must be on or after issue date';
      }
    }

    if (!formData.lineItems || formData.lineItems.length === 0) {
      errors.lineItems = 'At least one line item is required';
    } else {
      formData.lineItems.forEach((item, index) => {
        if (!item.description.trim()) {
          errors.lineItems = `Line item ${index + 1}: Description is required`;
        }
        if (item.quantity <= 0) {
          errors.lineItems = `Line item ${index + 1}: Quantity must be greater than 0`;
        }
        if (item.unitPrice <= 0) {
          errors.lineItems = `Line item ${index + 1}: Unit price must be greater than 0`;
        }
      });
    }

    if (!formData.currency.trim()) {
      errors.currency = 'Currency is required';
    }

    if (formData.notes && formData.notes.length > 1000) {
      errors.notes = 'Notes cannot exceed 1000 characters';
    }

    return errors;
  };

  // Filtered invoices based on status
  const filteredInvoices = invoices.filter((invoice) => {
    if (statusFilter === 'ALL') return true;
    return invoice.status === statusFilter;
  });

  // Clear errors
  const clearErrors = (): void => {
    setFormErrors({});
    setError(null);
  };

  // Initialize - load invoices and customers on mount
  useEffect(() => {
    loadInvoices();
    loadCustomers();
  }, [loadInvoices, loadCustomers]);

  return {
    // State
    invoices: filteredInvoices,
    selectedInvoice,
    payments,
    customers,
    isLoading,
    isSubmitting,
    error,
    statusFilter,
    formErrors,
    
    // Actions
    loadInvoices,
    loadInvoice,
    loadCustomers,
    createInvoice,
    updateInvoice,
    markAsSent,
    recordPayment,
    deleteInvoice,
    setStatusFilter,
    setSelectedInvoice,
    clearErrors,
  };
};

export default useInvoiceViewModel;

