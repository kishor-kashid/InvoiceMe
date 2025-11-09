/**
 * InvoiceList Component - Professional invoice table with status filter
 */

'use client';

import { useRouter } from 'next/navigation';
import { Invoice, InvoiceStatus } from '@/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty, Button } from '@/components/ui';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { formatDate, formatCurrency } from '@/lib/utils';

interface InvoiceListProps {
  invoices: Invoice[];
  isLoading?: boolean;
  statusFilter?: InvoiceStatus | 'ALL';
  onStatusFilterChange?: (status: InvoiceStatus | 'ALL') => void;
}

export default function InvoiceList({
  invoices,
  isLoading,
  statusFilter = 'ALL',
  onStatusFilterChange,
}: InvoiceListProps) {
  const router = useRouter();

  const handleView = (id: string): void => {
    router.push(`/invoices/${id}`);
  };

  const handleEdit = (id: string, status: InvoiceStatus): void => {
    if (status === InvoiceStatus.DRAFT) {
      router.push(`/invoices/${id}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="text-sm text-gray-500">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      {onStatusFilterChange && (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === 'ALL' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onStatusFilterChange('ALL')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === InvoiceStatus.DRAFT ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onStatusFilterChange(InvoiceStatus.DRAFT)}
          >
            Draft
          </Button>
          <Button
            variant={statusFilter === InvoiceStatus.SENT ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onStatusFilterChange(InvoiceStatus.SENT)}
          >
            Sent
          </Button>
          <Button
            variant={statusFilter === InvoiceStatus.PAID ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onStatusFilterChange(InvoiceStatus.PAID)}
          >
            Paid
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow hoverable={false}>
            <TableHead>Invoice #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableEmpty colSpan={8} message="No invoices found" />
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.customerName || 'N/A'}</TableCell>
                <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.totalAmount.amount, invoice.totalAmount.currency)}</TableCell>
                <TableCell className="text-right">
                  <span className={invoice.balance.amount > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                    {formatCurrency(invoice.balance.amount, invoice.balance.currency)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleView(invoice.id)}
                    >
                      View
                    </Button>
                    {invoice.status === InvoiceStatus.DRAFT && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(invoice.id, invoice.status)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

