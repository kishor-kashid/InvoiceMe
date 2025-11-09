/**
 * Customer Detail Page - Display customer information and invoices
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import useCustomerViewModel from '@/viewmodels/useCustomerViewModel';
import { invoiceService } from '@/services';
import { Invoice, InvoiceStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, ConfirmModal, Spinner } from '@/components/ui';
import { formatDate, formatPhone, formatCurrency } from '@/lib/utils';

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const {
    selectedCustomer,
    isLoading: customerLoading,
    error: customerError,
    loadCustomer,
    deleteCustomer,
  } = useCustomerViewModel();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load customer and invoices
  useEffect(() => {
    if (customerId) {
      loadCustomer(customerId);
      loadInvoices();
    }
  }, [customerId]);

  const loadInvoices = async (): Promise<void> => {
    if (!customerId) return;
    
    setIsLoadingInvoices(true);
    try {
      const data = await invoiceService.getByCustomerId(customerId);
      setInvoices(data);
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const handleEdit = (): void => {
    router.push(`/customers/${customerId}/edit`);
  };

  const handleDelete = (): void => {
    setDeleteConfirm(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!customerId) return;

    setIsDeleting(true);
    const success = await deleteCustomer(customerId);
    setIsDeleting(false);

    if (success) {
      router.push('/customers');
    } else {
      setDeleteConfirm(false);
    }
  };

  const handleInvoiceClick = (invoiceId: string): void => {
    router.push(`/invoices/${invoiceId}`);
  };

  const getStatusBadgeVariant = (status: InvoiceStatus): 'gray' | 'warning' | 'success' => {
    switch (status) {
      case InvoiceStatus.DRAFT:
        return 'gray';
      case InvoiceStatus.SENT:
        return 'warning';
      case InvoiceStatus.PAID:
        return 'success';
      default:
        return 'gray';
    }
  };

  if (customerLoading) {
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

  if (customerError || !selectedCustomer) {
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
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-red-600 mb-2">{customerError || 'Customer not found'}</p>
                  <Button variant="secondary" onClick={() => router.push('/customers')}>
                    Return to Customers
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
              onClick={() => router.push('/customers')}
              className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Customers
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCustomer.name}</h1>
                <p className="text-gray-600">Customer Details</p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleEdit}>
                  Edit Customer
                </Button>
                <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                  Delete
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedCustomer.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatPhone(selectedCustomer.phone)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedCustomer.address.street}<br />
                        {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zipCode}<br />
                        {selectedCustomer.address.country}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedCustomer.createdAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedCustomer.updatedAt)}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Invoices */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Invoices ({invoices.length})</CardTitle>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => router.push(`/invoices/new?customerId=${customerId}`)}
                    >
                      Create Invoice
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingInvoices ? (
                    <div className="flex items-center justify-center py-8">
                      <Spinner size="md" label="Loading invoices..." />
                    </div>
                  ) : invoices.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No invoices found for this customer.</p>
                      <Button
                        variant="primary"
                        onClick={() => router.push(`/invoices/new?customerId=${customerId}`)}
                      >
                        Create First Invoice
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow hoverable={false}>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Issue Date</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow
                            key={invoice.id}
                            onClick={() => handleInvoiceClick(invoice.id)}
                            className="cursor-pointer"
                          >
                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                            <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                            <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(invoice.status)}>
                                {invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(invoice.totalAmount.amount, invoice.totalAmount.currency)}</TableCell>
                            <TableCell className="text-right">
                              <span className={invoice.balance.amount > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                                {formatCurrency(invoice.balance.amount, invoice.balance.currency)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total Invoices</dt>
                      <dd className="mt-1 text-2xl font-bold text-gray-900">{invoices.length}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                      <dd className="mt-1 text-2xl font-bold text-gray-900">
                        {formatCurrency(invoices.reduce((sum, inv) => sum + inv.totalAmount.amount, 0))}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Outstanding Balance</dt>
                      <dd className="mt-1 text-2xl font-bold text-red-600">
                        {formatCurrency(invoices.reduce((sum, inv) => sum + inv.balance.amount, 0))}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Paid Invoices</dt>
                      <dd className="mt-1 text-xl font-semibold text-green-600">
                        {invoices.filter(inv => inv.status === InvoiceStatus.PAID).length}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          <ConfirmModal
            isOpen={deleteConfirm}
            onClose={() => setDeleteConfirm(false)}
            onConfirm={confirmDelete}
            title="Delete Customer"
            message={`Are you sure you want to delete "${selectedCustomer.name}"? This action cannot be undone and will remove all associated data.`}
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

