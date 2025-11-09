/**
 * Dashboard ViewModel - MVVM pattern for dashboard data
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { customerService, invoiceService } from '@/services';
import { Customer, Invoice, InvoiceStatus, ApiError } from '@/types';

interface DashboardStats {
  totalCustomers: number;
  totalInvoices: number;
  pendingInvoices: number;
  totalRevenue: number;
}

interface RecentActivity {
  id: string;
  type: 'invoice_created' | 'invoice_sent' | 'payment_received' | 'customer_added';
  title: string;
  description: string;
  timestamp: string;
  icon: 'invoice' | 'payment' | 'customer' | 'sent';
}

export const useDashboardViewModel = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalInvoices: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
  });

  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load all data in parallel
      const [customers, invoices] = await Promise.all([
        customerService.getAll(),
        invoiceService.getAll(),
      ]);

      // Calculate stats
      const pendingCount = invoices.filter(
        inv => inv.status === InvoiceStatus.SENT || inv.status === InvoiceStatus.DRAFT
      ).length;

      const totalRevenue = invoices
        .filter(inv => inv.status === InvoiceStatus.PAID)
        .reduce((sum, inv) => sum + inv.totalAmount.amount, 0);

      setStats({
        totalCustomers: customers.length,
        totalInvoices: invoices.length,
        pendingInvoices: pendingCount,
        totalRevenue,
      });

      // Get recent invoices (last 5)
      const sortedInvoices = [...invoices].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentInvoices(sortedInvoices.slice(0, 5));

      // Get recent customers (last 5)
      const sortedCustomers = [...customers].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentCustomers(sortedCustomers.slice(0, 5));

      // Generate recent activity from invoices and customers
      const activities: RecentActivity[] = [];

      // Add invoice activities
      sortedInvoices.slice(0, 3).forEach(invoice => {
        if (invoice.status === InvoiceStatus.PAID) {
          activities.push({
            id: invoice.id,
            type: 'payment_received',
            title: 'Payment Received',
            description: `Invoice ${invoice.invoiceNumber} - $${invoice.totalAmount.amount.toFixed(2)}`,
            timestamp: invoice.updatedAt,
            icon: 'payment',
          });
        } else if (invoice.status === InvoiceStatus.SENT) {
          activities.push({
            id: invoice.id,
            type: 'invoice_sent',
            title: 'Invoice Sent',
            description: `Invoice ${invoice.invoiceNumber} sent to ${invoice.customerName || 'customer'}`,
            timestamp: invoice.updatedAt,
            icon: 'sent',
          });
        } else {
          activities.push({
            id: invoice.id,
            type: 'invoice_created',
            title: 'Invoice Created',
            description: `Invoice ${invoice.invoiceNumber} - Draft`,
            timestamp: invoice.createdAt,
            icon: 'invoice',
          });
        }
      });

      // Add customer activities
      sortedCustomers.slice(0, 2).forEach(customer => {
        activities.push({
          id: customer.id,
          type: 'customer_added',
          title: 'New Customer Added',
          description: customer.name,
          timestamp: customer.createdAt,
          icon: 'customer',
        });
      });

      // Sort all activities by timestamp
      activities.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setRecentActivity(activities.slice(0, 10));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const refresh = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    stats,
    recentInvoices,
    recentCustomers,
    recentActivity,
    isLoading,
    error,
    refresh,
  };
};

export default useDashboardViewModel;

