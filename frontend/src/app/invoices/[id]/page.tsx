/**
 * Invoice Detail Page - Display invoice information, line items, payments, and actions
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import useInvoiceViewModel from '@/viewmodels/useInvoiceViewModel';
import InvoiceStatusBadge from '@/components/invoices/InvoiceStatusBadge';
import { Card, CardHeader, CardTitle, CardContent, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Modal, Input, Spinner, ConfirmModal } from '@/components/ui';
import { InvoiceStatus, CreatePaymentRequest, Customer } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';
import { customerService } from '@/services';

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  const {
    selectedInvoice,
    payments,
    isLoading,
    error,
    isSubmitting,
    loadInvoice,
    markAsSent,
    recordPayment,
  } = useInvoiceViewModel();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showMarkAsSentConfirm, setShowMarkAsSentConfirm] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);

  // Load invoice and customer
  useEffect(() => {
    if (invoiceId) {
      loadInvoice(invoiceId);
    }
  }, [invoiceId]);

  // Load customer when invoice is loaded
  useEffect(() => {
    const loadCustomer = async () => {
      if (selectedInvoice?.customerId) {
        try {
          const customerData = await customerService.getById(selectedInvoice.customerId);
          setCustomer(customerData);
        } catch (err) {
          console.error('Failed to load customer:', err);
        }
      }
    };
    loadCustomer();
  }, [selectedInvoice?.customerId]);

  const handleMarkAsSent = async (): Promise<void> => {
    if (!invoiceId) return;
    const success = await markAsSent(invoiceId);
    if (success) {
      setShowMarkAsSentConfirm(false);
    }
  };

  const handleRecordPayment = async (): Promise<void> => {
    if (!invoiceId || !selectedInvoice) return;

    setPaymentError(null);

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      setPaymentError('Please enter a valid payment amount');
      return;
    }

    if (amount > selectedInvoice.balance.amount) {
      setPaymentError(`Payment amount cannot exceed balance of ${formatCurrency(selectedInvoice.balance.amount, selectedInvoice.balance.currency)}`);
      return;
    }

    const paymentRequest: CreatePaymentRequest = {
      amount,
      paymentDate,
    };

    const success = await recordPayment(invoiceId, paymentRequest);
    if (success) {
      setShowPaymentModal(false);
      setPaymentAmount('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setPaymentError(null);
    } else {
      setPaymentError('Failed to record payment. Please try again.');
    }
  };

  const handleEdit = (): void => {
    if (selectedInvoice?.status === InvoiceStatus.DRAFT) {
      router.push(`/invoices/${invoiceId}/edit`);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner size="lg" label="Loading invoice..." />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error || !selectedInvoice) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <button
                onClick={() => router.push('/invoices')}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Invoices
              </button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-red-600 mb-2">{error || 'Invoice not found'}</p>
                  <Button variant="secondary" onClick={() => router.push('/invoices')}>
                    Return to Invoices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/invoices')}
              className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Invoices
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Invoice #{selectedInvoice.invoiceNumber}
                </h1>
                <p className="text-gray-600">Invoice Details</p>
              </div>
              <div className="flex gap-3">
                {selectedInvoice.status === InvoiceStatus.DRAFT && (
                  <>
                    <Button variant="secondary" onClick={handleEdit}>
                      Edit Invoice
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setShowMarkAsSentConfirm(true)}
                      disabled={isSubmitting}
                    >
                      Mark as Sent
                    </Button>
                  </>
                )}
                {selectedInvoice.status === InvoiceStatus.SENT && selectedInvoice.balance.amount > 0 && (
                  <Button
                    variant="primary"
                    onClick={() => setShowPaymentModal(true)}
                    disabled={isSubmitting}
                  >
                    Record Payment
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Invoice Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Invoice Information</CardTitle>
                    <InvoiceStatusBadge status={selectedInvoice.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Customer</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {customer?.name || 'Loading...'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedInvoice.issueDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedInvoice.dueDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedInvoice.createdAt)}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Line Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Line Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow hoverable={false}>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.lineItems.map((item, index) => (
                        <TableRow key={item.id || index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice.amount, item.unitPrice.currency)}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.amount.amount, item.amount.currency)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 flex justify-end border-t pt-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(selectedInvoice.totalAmount.amount, selectedInvoice.totalAmount.currency)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payments History */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No payments recorded yet</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow hoverable={false}>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                      <dd className="mt-1 text-2xl font-bold text-gray-900">
                        {formatCurrency(selectedInvoice.totalAmount.amount, selectedInvoice.totalAmount.currency)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total Paid</dt>
                      <dd className="mt-1 text-xl font-semibold text-green-600">
                        {formatCurrency(selectedInvoice.paidAmount.amount, selectedInvoice.paidAmount.currency)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Balance</dt>
                      <dd className={`mt-1 text-2xl font-bold ${
                        selectedInvoice.balance.amount > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(selectedInvoice.balance.amount, selectedInvoice.balance.currency)}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mark as Sent Confirmation Modal */}
          <ConfirmModal
            isOpen={showMarkAsSentConfirm}
            onClose={() => setShowMarkAsSentConfirm(false)}
            onConfirm={handleMarkAsSent}
            title="Mark Invoice as Sent"
            message="Are you sure you want to mark this invoice as sent? Once sent, the invoice cannot be edited."
            confirmText="Mark as Sent"
            cancelText="Cancel"
            variant="primary"
            isLoading={isSubmitting}
          />

          {/* Record Payment Modal */}
          <Modal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setPaymentError(null);
            }}
            title="Record Payment"
            size="md"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Outstanding Balance: <span className="font-semibold text-gray-900">
                    {formatCurrency(selectedInvoice.balanceAmount)}
                  </span>
                </p>
              </div>
              <Input
                label="Payment Amount"
                type="number"
                min="0.01"
                step="0.01"
                max={selectedInvoice.balanceAmount}
                value={paymentAmount}
                onChange={(e) => {
                  setPaymentAmount(e.target.value);
                  setPaymentError(null);
                }}
                error={paymentError}
                required
              />
              <Input
                label="Payment Date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
              {paymentError && (
                <div className="rounded-lg bg-danger-50 border border-danger-200 p-3">
                  <p className="text-sm text-danger-600">{paymentError}</p>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentError(null);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleRecordPayment}
                  disabled={isSubmitting || !paymentAmount}
                >
                  {isSubmitting ? 'Recording...' : 'Record Payment'}
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

