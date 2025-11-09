/**
 * Payment List Page - Display all payments across invoices
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PaymentList from '@/components/payments/PaymentList';
import usePaymentViewModel from '@/viewmodels/usePaymentViewModel';
import { Card, CardHeader, CardTitle, CardContent, Button, Spinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

export default function PaymentsPage() {
  const router = useRouter();
  const {
    payments,
    isLoading,
    error,
    loadPayments,
  } = usePaymentViewModel();

  // Load payments on mount
  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // Calculate total payments
  const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const handleViewInvoice = (invoiceId: string): void => {
    router.push(`/invoices/${invoiceId}`);
  };

  const handleRefresh = (): void => {
    loadPayments();
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner size="lg" label="Loading payments..." />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
                <p className="text-gray-600">View all payment transactions</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-danger-50 border border-danger-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-danger-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-danger-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Summary Card */}
          <div className="mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Payments</p>
                    <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(totalPayments)}
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-sm font-medium text-gray-500 mb-1">Average Payment</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {payments.length > 0 
                        ? formatCurrency(totalPayments / payments.length)
                        : formatCurrency(0)
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment List */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentList 
                payments={payments} 
                onViewInvoice={handleViewInvoice}
              />
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

