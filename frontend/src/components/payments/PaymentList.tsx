/**
 * Payment List Component - Display list of payments in a table
 */

'use client';

import Link from 'next/link';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from '@/components/ui';
import { Payment } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

export interface PaymentListProps {
  payments: Payment[];
  onViewInvoice?: (invoiceId: string) => void;
}

export const PaymentList: React.FC<PaymentListProps> = ({
  payments,
  onViewInvoice,
}) => {
  if (payments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No payments found</h3>
        <p className="mt-2 text-sm text-gray-500">
          Payments will appear here once they are recorded against invoices.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow hoverable={false}>
            <TableHead>Payment ID</TableHead>
            <TableHead>Payment Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                <span className="font-mono text-sm text-gray-600">
                  {payment.id.substring(0, 8)}...
                </span>
              </TableCell>
              <TableCell>
                <span className="font-medium text-gray-900">
                  {formatDate(payment.paymentDate)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-semibold text-green-600">
                  {formatCurrency(payment.amount)}
                </span>
              </TableCell>
              <TableCell>
                <Link
                  href={`/invoices/${payment.invoiceId}`}
                  className="text-primary-600 hover:text-primary-800 hover:underline font-medium transition-colors"
                >
                  View Invoice
                </Link>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {formatDate(payment.createdAt)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onViewInvoice?.(payment.invoiceId)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentList;

