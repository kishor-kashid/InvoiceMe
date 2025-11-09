/**
 * Edit Invoice Page - Professional invoice editing form (DRAFT only)
 */

'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import useInvoiceViewModel from '@/viewmodels/useInvoiceViewModel';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import { Spinner, Card, CardContent } from '@/components/ui';
import { InvoiceStatus } from '@/types';

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  const {
    selectedInvoice,
    customers,
    isLoading,
    error,
    loadInvoice,
    loadCustomers,
    updateInvoice,
    isSubmitting,
    formErrors,
  } = useInvoiceViewModel();

  useEffect(() => {
    if (invoiceId) {
      loadInvoice(invoiceId);
      loadCustomers();
    }
  }, [invoiceId]);

  const handleSubmit = async (formData: Parameters<typeof updateInvoice>[1]): Promise<boolean> => {
    if (!invoiceId) return false;
    const success = await updateInvoice(invoiceId, formData);
    if (success) {
      router.push(`/invoices/${invoiceId}`);
    }
    return success;
  };

  const handleCancel = (): void => {
    router.push(`/invoices/${invoiceId}`);
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
                  <p className="text-red-600 mb-4">{error || 'Invoice not found'}</p>
                  <button
                    onClick={() => router.push('/invoices')}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Return to Invoices
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Validate that invoice is in DRAFT status
  if (selectedInvoice.status !== InvoiceStatus.DRAFT) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <button
                onClick={() => router.push(`/invoices/${invoiceId}`)}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Invoice
              </button>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-red-600 mb-2">
                    This invoice cannot be edited because it is {selectedInvoice.status}.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Only invoices in DRAFT status can be edited.
                  </p>
                  <button
                    onClick={() => router.push(`/invoices/${invoiceId}`)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Return to Invoice Details
                  </button>
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
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={handleCancel}
              className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Invoice
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Invoice</h1>
            <p className="text-gray-600">Update invoice information and line items</p>
          </div>

          {/* Invoice Form */}
          <InvoiceForm
            invoice={selectedInvoice}
            customers={customers}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
            errors={formErrors}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

