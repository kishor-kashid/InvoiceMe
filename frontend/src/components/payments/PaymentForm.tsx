/**
 * Payment Form Component - Reusable form for recording payments
 */

'use client';

import { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { Invoice } from '@/types';
import { formatCurrency } from '@/lib/utils';

export interface PaymentFormProps {
  invoice: Invoice;
  onSubmit: (amount: number, paymentDate: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  invoice,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error = null,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const paymentAmount = parseFloat(amount);

    // Client-side validation
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setValidationError('Please enter a valid payment amount');
      return;
    }

    if (paymentAmount > invoice.balance.amount) {
      setValidationError(
        `Payment amount cannot exceed balance of ${formatCurrency(
          invoice.balance.amount,
          invoice.balance.currency
        )}`
      );
      return;
    }

    if (!paymentDate) {
      setValidationError('Payment date is required');
      return;
    }

    // Check date is not in future
    const payDate = new Date(paymentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (payDate > today) {
      setValidationError('Payment date cannot be in the future');
      return;
    }

    // Convert date to datetime string for backend (LocalDateTime format)
    const paymentDateTime = `${paymentDate}T00:00:00`;

    await onSubmit(paymentAmount, paymentDateTime);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setValidationError(null);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDate(e.target.value);
    setValidationError(null);
  };

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Invoice Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Invoice Number</p>
            <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">Outstanding Balance</p>
            <p className="font-semibold text-gray-900">
              {formatCurrency(invoice.balance.amount, invoice.balance.currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Amount */}
      <Input
        label="Payment Amount"
        type="number"
        min="0.01"
        step="0.01"
        max={invoice.balance.amount}
        value={amount}
        onChange={handleAmountChange}
        error={displayError || undefined}
        required
        placeholder="0.00"
        disabled={isSubmitting}
      />

      {/* Payment Date */}
      <Input
        label="Payment Date"
        type="date"
        value={paymentDate}
        onChange={handleDateChange}
        max={new Date().toISOString().split('T')[0]}
        required
        disabled={isSubmitting}
      />

      {/* Error Display */}
      {displayError && displayError.length > 0 && (
        <div className="rounded-lg bg-danger-50 border border-danger-200 p-3">
          <p className="text-sm text-danger-600">{displayError}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || !amount || !paymentDate}
        >
          {isSubmitting ? 'Recording...' : 'Record Payment'}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;

