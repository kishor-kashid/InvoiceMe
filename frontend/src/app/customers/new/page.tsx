/**
 * Create Customer Page - Professional customer creation form
 */

'use client';

import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import useCustomerViewModel from '@/viewmodels/useCustomerViewModel';
import CustomerForm from '@/components/customers/CustomerForm';

export default function NewCustomerPage() {
  const router = useRouter();
  const { createCustomer, isSubmitting, formErrors } = useCustomerViewModel();

  const handleSubmit = async (formData: Parameters<typeof createCustomer>[0]): Promise<boolean> => {
    return await createCustomer(formData);
  };

  const handleCancel = (): void => {
    router.push('/customers');
  };

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
              Back to Customers
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Customer</h1>
            <p className="text-gray-600">Add a new customer to your database</p>
          </div>

          {/* Customer Form */}
          <CustomerForm
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

