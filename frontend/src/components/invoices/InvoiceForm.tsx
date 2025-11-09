/**
 * InvoiceForm Component - Professional invoice form with customer dropdown and line items
 */

'use client';

import { useState, useEffect } from 'react';
import { Invoice, Customer } from '@/types';
import { InvoiceFormData, FormErrors } from '@/viewmodels/useInvoiceViewModel';
import { Input, Button } from '@/components/ui';
import LineItemForm, { LineItemData } from './LineItemForm';
import { formatCurrency } from '@/lib/utils';

const DEFAULT_CURRENCY = 'USD';
const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}-${random}`;
};

interface InvoiceFormProps {
  invoice?: Invoice | null;
  customers: Customer[];
  onSubmit: (data: InvoiceFormData) => Promise<boolean>;
  onCancel?: () => void;
  isLoading?: boolean;
  errors?: FormErrors;
  defaultCustomerId?: string;
}

export default function InvoiceForm({
  invoice,
  customers,
  onSubmit,
  onCancel,
  isLoading = false,
  errors: externalErrors = {},
  defaultCustomerId,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(() => ({
    customerId: invoice?.customerId || defaultCustomerId || '',
    invoiceNumber: invoice?.invoiceNumber || generateInvoiceNumber(),
    issueDate: invoice?.issueDate
      ? new Date(invoice.issueDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate
      ? new Date(invoice.dueDate).toISOString().split('T')[0]
      : '',
    currency: invoice?.totalAmount?.currency || DEFAULT_CURRENCY,
    lineItems:
      invoice?.lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice.amount,
      })) || [
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
        },
      ],
    notes: invoice?.notes || '',
  }));

  const [lineItems, setLineItems] = useState<LineItemData[]>(
    invoice?.lineItems.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice.amount,
      amount: item.total ? item.total.amount : item.quantity * item.unitPrice.amount,
    })) || [{
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    }]
  );

  const [errors, setErrors] = useState<FormErrors>(externalErrors);

  // Update form data when invoice changes
  useEffect(() => {
    if (invoice) {
      setFormData({
        customerId: invoice.customerId,
        invoiceNumber: invoice.invoiceNumber,
        issueDate: new Date(invoice.issueDate).toISOString().split('T')[0],
        dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
        currency: invoice.totalAmount?.currency || DEFAULT_CURRENCY,
        lineItems: invoice.lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice.amount,
        })),
        notes: invoice.notes || '',
      });
      setLineItems(
        invoice.lineItems.map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice.amount,
          amount: item.total ? item.total.amount : item.quantity * item.unitPrice.amount,
        }))
      );
    } else if (defaultCustomerId) {
      setFormData(prev => ({
        ...prev,
        customerId: defaultCustomerId,
      }));
    }
  }, [invoice, defaultCustomerId]);

  // Update errors when external errors change
  useEffect(() => {
    setErrors(externalErrors);
  }, [externalErrors]);

  const handleChange = (field: keyof InvoiceFormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const handleLineItemsChange = (items: LineItemData[]): void => {
    setLineItems(items);
    setFormData((prev) => ({
      ...prev,
      lineItems: items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    }));
    
    // Clear line items error
    if (errors.lineItems) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.lineItems;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (!success) {
      // Scroll to first error
      const firstError = document.querySelector('.text-danger-600');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-4 border-b border-gray-200 pb-4">
          <h3 className="text-xl font-semibold text-gray-900">Invoice Information</h3>
        </div>
        <div className="space-y-4">
          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Invoice Number"
              value={formData.invoiceNumber}
              onChange={(e) => handleChange('invoiceNumber', e.target.value)}
              error={errors.invoiceNumber}
              disabled={!!invoice || isLoading}
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Currency <span className="text-danger-500">*</span>
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                disabled={!!invoice || isLoading}
                className={`block w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  errors.currency
                    ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
                required
              >
                <option value="">Select currency</option>
                {CURRENCY_OPTIONS.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              {errors.currency && (
                <p className="mt-1.5 text-sm text-danger-600 flex items-center">
                  <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.currency}
                </p>
              )}
            </div>
          </div>

          {/* Customer Selection */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Customer <span className="text-danger-500">*</span>
            </label>
            <select
              value={formData.customerId}
              onChange={(e) => handleChange('customerId', e.target.value)}
              disabled={isLoading || !!invoice}
              className={`block w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.customerId
                  ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
              required
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
            {errors.customerId && (
              <p className="mt-1.5 text-sm text-danger-600 flex items-center">
                <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.customerId}
              </p>
            )}
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Issue Date"
              type="date"
              value={formData.issueDate}
              onChange={(e) => handleChange('issueDate', e.target.value)}
              error={errors.issueDate}
              disabled={isLoading}
              required
            />
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              error={errors.dueDate}
              disabled={isLoading}
              required
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-4 border-b border-gray-200 pb-4">
          <h3 className="text-xl font-semibold text-gray-900">Line Items</h3>
        </div>
        <div>
          <LineItemForm
            lineItems={lineItems}
            onChange={handleLineItemsChange}
            errors={errors.lineItems ? { 0: errors.lineItems } : undefined}
            disabled={isLoading}
            currency={formData.currency || DEFAULT_CURRENCY}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-4 border-b border-gray-200 pb-4">
          <h3 className="text-xl font-semibold text-gray-900">Notes</h3>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Additional Information
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            maxLength={1000}
            rows={4}
            placeholder="Add any payment instructions or additional details for the customer (optional)"
            className={`block w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
              errors.notes
                ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
            }`}
            disabled={isLoading}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>{(formData.notes?.length || 0)}/1000 characters</span>
          </div>
          {errors.notes && (
            <p className="mt-1.5 text-sm text-danger-600 flex items-center">
              <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.notes}
            </p>
          )}
        </div>
      </div>

      {/* Total Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">Total Amount</span>
          <span className="text-3xl font-bold text-gray-900">
            {formatCurrency(totalAmount, formData.currency || DEFAULT_CURRENCY)}
          </span>
        </div>
      </div>

      {/* General Error */}
      {errors.general && (
        <div className="rounded-lg bg-danger-50 border border-danger-200 p-4">
          <p className="text-sm text-danger-600 flex items-center">
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.general}
          </p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}

