/**
 * Payment ViewModel - MVVM pattern for payment management
 */

'use client';

import { useState, useCallback } from 'react';
import { paymentService, invoiceService } from '@/services';
import { Payment, CreatePaymentRequest, ApiError, Invoice } from '@/types';

export interface PaymentFormData {
  amount: number;
  paymentDate: string;
}

export interface PaymentFormErrors {
  amount?: string;
  paymentDate?: string;
  general?: string;
}

export const usePaymentViewModel = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<PaymentFormErrors>({});

  // Load all payments
  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await paymentService.getAll();
      setPayments(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load payments');
      console.error('Load payments error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load payment by ID
  const loadPayment = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const payment = await paymentService.getById(id);
      setSelectedPayment(payment);
      return payment;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load payment');
      console.error('Load payment error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load payments by invoice ID
  const loadPaymentsByInvoice = useCallback(async (invoiceId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await paymentService.getByInvoiceId(invoiceId);
      setPayments(data);
      return data;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load payments');
      console.error('Load payments by invoice error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Record payment for an invoice
  const recordPayment = async (
    invoiceId: string, 
    formData: PaymentFormData,
    invoice?: Invoice
  ): Promise<Payment | null> => {
    setFormErrors({});
    setIsSubmitting(true);
    setError(null);

    // Validate form
    const validationErrors = validateForm(formData, invoice);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setIsSubmitting(false);
      return null;
    }

    try {
      const request: CreatePaymentRequest = {
        amount: formData.amount,
        paymentDate: formData.paymentDate,
      };

      const newPayment = await invoiceService.recordPayment(invoiceId, request);
      
      // Add to payments list
      setPayments([...payments, newPayment]);
      
      return newPayment;
    } catch (err) {
      const apiError = err as ApiError;
      
      // Handle validation errors from backend
      if (apiError.errors && apiError.errors.length > 0) {
        const backendErrors: PaymentFormErrors = {};
        apiError.errors.forEach((error) => {
          const field = error.field.toLowerCase();
          if (field.includes('amount')) backendErrors.amount = error.message;
          else if (field.includes('date')) backendErrors.paymentDate = error.message;
        });
        setFormErrors(backendErrors);
      } else {
        setFormErrors({ general: apiError.message || 'Failed to record payment' });
      }
      
      setError(apiError.message || 'Failed to record payment');
      console.error('Record payment error:', err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form validation
  const validateForm = (formData: PaymentFormData, invoice?: Invoice): PaymentFormErrors => {
    const errors: PaymentFormErrors = {};

    if (!formData.amount || formData.amount <= 0) {
      errors.amount = 'Payment amount must be greater than 0';
    }

    if (invoice && formData.amount > invoice.balance.amount) {
      errors.amount = `Payment amount cannot exceed balance of ${invoice.balance.amount.toFixed(2)} ${invoice.balance.currency}`;
    }

    if (!formData.paymentDate) {
      errors.paymentDate = 'Payment date is required';
    }

    // Validate payment date is not in the future
    const paymentDate = new Date(formData.paymentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (paymentDate > today) {
      errors.paymentDate = 'Payment date cannot be in the future';
    }

    return errors;
  };

  // Clear errors
  const clearErrors = (): void => {
    setFormErrors({});
    setError(null);
  };

  return {
    // State
    payments,
    selectedPayment,
    isLoading,
    isSubmitting,
    error,
    formErrors,
    
    // Actions
    loadPayments,
    loadPayment,
    loadPaymentsByInvoice,
    recordPayment,
    setSelectedPayment,
    clearErrors,
  };
};

export default usePaymentViewModel;

