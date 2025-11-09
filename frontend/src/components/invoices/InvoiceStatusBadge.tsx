/**
 * InvoiceStatusBadge Component - Status badge for invoices
 */

'use client';

import { InvoiceStatus } from '@/types';
import { Badge } from '@/components/ui';

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export default function InvoiceStatusBadge({ status, className }: InvoiceStatusBadgeProps) {
  const getVariant = (): 'gray' | 'warning' | 'success' => {
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

  return (
    <Badge variant={getVariant()} className={className}>
      {status}
    </Badge>
  );
}

