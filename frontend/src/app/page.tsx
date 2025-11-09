'use client';

import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import useDashboardViewModel from '@/viewmodels/useDashboardViewModel';
import { Card, CardHeader, CardTitle, CardContent, Button, InvoiceStatusBadge, Spinner } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  const {
    stats,
    recentInvoices,
    recentActivity,
    isLoading,
    error,
    refresh,
  } = useDashboardViewModel();

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex min-h-screen items-center justify-center">
            <Spinner size="lg" label="Loading dashboard..." />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex min-h-screen items-center justify-center">
            <Card className="max-w-md">
              <CardContent>
                <div className="text-center">
                  <svg className="mx-auto mb-4 h-12 w-12 text-danger-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Error Loading Dashboard</h3>
                  <p className="mb-4 text-sm text-gray-600">{error}</p>
                  <Button onClick={refresh} variant="primary">Try Again</Button>
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
        <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your business</p>
          </div>
          <Button
            variant="ghost"
            onClick={refresh}
            leftIcon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          >
            Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Customers */}
          <Card className="hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => router.push('/customers')}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Customers</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
                  <p className="mt-2 text-xs text-gray-500">Click to view all</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Invoices */}
          <Card className="hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => router.push('/invoices')}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Invoices</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalInvoices}</p>
                  <p className="mt-2 text-xs text-gray-500">Click to view all</p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Invoices */}
          <Card className="hover:shadow-card-hover transition-shadow cursor-pointer" onClick={() => router.push('/invoices')}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending Invoices</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingInvoices}</p>
                  <p className="mt-2 text-xs text-gray-500">Awaiting payment</p>
                </div>
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="hover:shadow-card-hover transition-shadow">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="mt-2 text-xs text-gray-500">From paid invoices</p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="ghost"
                className="h-auto py-6 flex-col space-y-2 bg-primary-50 hover:bg-primary-100 text-primary-700"
                onClick={() => router.push('/customers/new')}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span className="font-medium">New Customer</span>
              </Button>
              <Button
                variant="ghost"
                className="h-auto py-6 flex-col space-y-2 bg-success-50 hover:bg-success-100 text-success-700"
                onClick={() => router.push('/invoices/new')}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">New Invoice</span>
              </Button>
              <Button
                variant="ghost"
                className="h-auto py-6 flex-col space-y-2 bg-secondary-50 hover:bg-secondary-100 text-secondary-700"
                onClick={() => router.push('/invoices')}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">Record Payment</span>
              </Button>
              <Button
                variant="ghost"
                className="h-auto py-6 flex-col space-y-2 bg-gray-50 hover:bg-gray-100 text-gray-700"
                onClick={() => router.push('/invoices')}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Invoices</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/invoices')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentInvoices.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">No invoices yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/invoices/${invoice.id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {invoice.customerName || `Customer ${invoice.customerId}`}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(invoice.totalAmount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(invoice.issueDate)}
                          </p>
                        </div>
                        <InvoiceStatusBadge status={invoice.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.icon === 'payment' ? 'bg-success-100' :
                        activity.icon === 'sent' ? 'bg-warning-100' :
                        activity.icon === 'customer' ? 'bg-primary-100' :
                        'bg-gray-100'
                      }`}>
                        {activity.icon === 'payment' && (
                          <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        )}
                        {activity.icon === 'sent' && (
                          <svg className="w-4 h-4 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        )}
                        {activity.icon === 'customer' && (
                          <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                        {activity.icon === 'invoice' && (
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Connected to Backend API: <span className="font-mono text-primary-600">http://localhost:8080</span></p>
        </div>
      </div>
      </Layout>
    </ProtectedRoute>
  );
}

