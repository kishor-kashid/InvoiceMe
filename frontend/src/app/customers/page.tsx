/**
 * Customer List Page - Professional customer management
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import useCustomerViewModel from '@/viewmodels/useCustomerViewModel';
import CustomerList from '@/components/customers/CustomerList';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, ConfirmModal } from '@/components/ui';

export default function CustomersPage() {
  const router = useRouter();
  const {
    customers,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    deleteCustomer,
    loadCustomers,
  } = useCustomerViewModel();

  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string): Promise<void> => {
    setDeleteConfirm({ id, name: customers.find(c => c.id === id)?.name || 'this customer' });
  };

  const confirmDelete = async (): Promise<void> => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    const success = await deleteCustomer(deleteConfirm.id);
    setIsDeleting(false);

    if (success) {
      setDeleteConfirm(null);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
              <p className="text-gray-600">Manage your customer database</p>
            </div>
            <Button
              variant="primary"
              onClick={() => router.push('/customers/new')}
              leftIcon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              New Customer
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    label="Search Customers"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, phone, or city..."
                    fullWidth
                    leftIcon={
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    onClick={loadCustomers}
                    leftIcon={
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    }
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Card className="mb-6 border-danger-200 bg-danger-50">
              <CardContent className="pt-6">
                <div className="flex items-start">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-danger-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-danger-800">Error Loading Customers</h3>
                    <p className="mt-1 text-sm text-danger-700">{error}</p>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" onClick={loadCustomers}>
                        Try Again
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Card */}
          {!isLoading && !error && (
            <div className="mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Customers</p>
                      <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
                    </div>
                    {searchQuery && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Search Results</p>
                        <p className="text-3xl font-bold text-primary-600">
                          {customers.length} {customers.length === 1 ? 'match' : 'matches'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Customer List */}
          {!error && (
            <CustomerList
              customers={customers}
              isLoading={isLoading}
              onDelete={handleDelete}
            />
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={!!deleteConfirm}
            onClose={() => setDeleteConfirm(null)}
            onConfirm={confirmDelete}
            title="Delete Customer"
            message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone and will remove all associated data.`}
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
            isLoading={isDeleting}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

