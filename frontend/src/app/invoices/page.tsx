/**
 * Invoice List Page - Professional invoice management
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import useInvoiceViewModel from '@/viewmodels/useInvoiceViewModel';
import InvoiceList from '@/components/invoices/InvoiceList';
import { Card, CardContent, Button } from '@/components/ui';
import { InvoiceStatus } from '@/types';

export default function InvoicesPage() {
  const router = useRouter();
  const {
    invoices,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    loadInvoices,
  } = useInvoiceViewModel();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoices</h1>
                <p className="text-gray-600">Manage your invoices</p>
              </div>
              <Button
                variant="primary"
                onClick={() => router.push('/invoices/new')}
              >
                Create Invoice
              </Button>
            </div>
          </div>

          {/* Stats Card */}
          {!isLoading && !error && (
            <div className="mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                      <p className="text-3xl font-bold text-gray-900">{invoices.length}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Draft</p>
                      <p className="text-3xl font-bold text-gray-700">
                        {invoices.filter(inv => inv.status === InvoiceStatus.DRAFT).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sent</p>
                      <p className="text-3xl font-bold text-warning-600">
                        {invoices.filter(inv => inv.status === InvoiceStatus.SENT).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Paid</p>
                      <p className="text-3xl font-bold text-success-600">
                        {invoices.filter(inv => inv.status === InvoiceStatus.PAID).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-danger-50 border border-danger-200 p-4">
              <p className="text-sm text-danger-600">{error}</p>
            </div>
          )}

          {/* Invoice List */}
          <InvoiceList
            invoices={invoices}
            isLoading={isLoading}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

