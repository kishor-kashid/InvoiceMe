/**
 * CustomerList Component - Professional customer table
 */

'use client';

import { useRouter } from 'next/navigation';
import { Customer } from '@/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty, Button } from '@/components/ui';
import { formatDate, formatPhone } from '@/lib/utils';

interface CustomerListProps {
  customers: Customer[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

export default function CustomerList({ customers, isLoading, onDelete }: CustomerListProps) {
  const router = useRouter();

  const handleView = (id: string): void => {
    router.push(`/customers/${id}`);
  };

  const handleEdit = (id: string): void => {
    router.push(`/customers/${id}/edit`);
  };

  const handleDelete = (id: string, name: string): void => {
    if (window.confirm(`Are you sure you want to delete customer "${name}"? This action cannot be undone.`)) {
      onDelete?.(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="text-sm text-gray-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <Table>
        <TableHeader>
          <TableRow hoverable={false}>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody striped hoverable>
          {customers.length === 0 ? (
            <TableEmpty colSpan={6} message="No customers found. Create your first customer to get started." />
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                      <span className="text-sm font-semibold">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{customer.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {customer.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {formatPhone(customer.phone)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{customer.address.city}</p>
                    <p className="text-xs text-gray-500">{customer.address.state}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {formatDate(customer.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(customer.id)}
                      leftIcon={
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      }
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(customer.id)}
                      leftIcon={
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      }
                    >
                      Edit
                    </Button>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(customer.id, customer.name)}
                        leftIcon={
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        }
                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
  );
}

