/**
 * Create Invoice Page - Professional invoice creation form
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import useInvoiceViewModel from '@/viewmodels/useInvoiceViewModel';
import InvoiceForm from '@/components/invoices/InvoiceForm';
import Spinner from '@/components/ui/Spinner';

function InvoiceFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get('customerId');

  const {
    customers = [],
    isLoading: customersLoading = false,
    loadCustomers,
    createInvoice,
    isSubmitting = false,
    formErrors = {},
  } = useInvoiceViewModel();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await loadCustomers();
      setIsInitialized(true);
    };
    initialize();
  }, [loadCustomers]);

  const handleSubmit = async (formData: Parameters<typeof createInvoice>[0]): Promise<boolean> => {
    return await createInvoice(formData);
  };

  const handleCancel = (): void => {
    router.push('/invoices');
  };

  if (!isInitialized || customersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" label="Loading..." />
      </div>
    );
  }

  return (
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
          Back to Invoices
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Invoice</h1>
        <p className="text-gray-600">Create a new invoice with line items</p>
      </div>

      {/* Invoice Form */}
      <InvoiceForm
        customers={customers}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSubmitting}
        errors={formErrors}
        defaultCustomerId={customerId || undefined}
      />
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner size="lg" label="Loading..." />
          </div>
        }>
          <InvoiceFormContent />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
}
