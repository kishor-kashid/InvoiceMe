/**
 * Edit Customer Page - Professional customer editing form
 */

'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import useCustomerViewModel from '@/viewmodels/useCustomerViewModel';
import CustomerForm from '@/components/customers/CustomerForm';
import Spinner from '@/components/ui/Spinner';

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const {
    selectedCustomer,
    isLoading,
    error,
    loadCustomer,
    updateCustomer,
    isSubmitting,
    formErrors,
  } = useCustomerViewModel();

  useEffect(() => {
    if (customerId) {
      loadCustomer(customerId);
    }
  }, [customerId]);

  const handleSubmit = async (formData: Parameters<typeof updateCustomer>[1]): Promise<boolean> => {
    if (!customerId) return false;
    const success = await updateCustomer(customerId, formData);
    if (success) {
      router.push(`/customers/${customerId}`);
    }
    return success;
  };

  const handleCancel = (): void => {
    router.push(`/customers/${customerId}`);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner size="lg" label="Loading customer..." />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error || !selectedCustomer) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <button
                onClick={() => router.push('/customers')}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Customers
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error || 'Customer not found'}</p>
              <button
                onClick={() => router.push('/customers')}
                className="text-primary-600 hover:text-primary-700"
              >
                Return to Customers
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <button
              onClick={handleCancel}
              className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Customer
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Customer</h1>
            <p className="text-gray-600">Update customer information</p>
          </div>

          {/* Customer Form */}
          <CustomerForm
            customer={selectedCustomer}
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

