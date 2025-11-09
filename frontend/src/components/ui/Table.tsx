/**
 * Table Component - Professional data table
 */

import { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hoverable?: boolean;
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, striped = false, hoverable = true, className, ...props }, ref) => {
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table
          ref={ref}
          className={cn('min-w-full divide-y divide-gray-200', className)}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

// TableHeader
export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ children, className, ...props }, ref) => {
  return (
    <thead ref={ref} className={cn('bg-gray-50', className)} {...props}>
      {children}
    </thead>
  );
});

TableHeader.displayName = 'TableHeader';

// TableBody
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  striped?: boolean;
  hoverable?: boolean;
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, striped = false, hoverable = true, className, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={cn(
          'divide-y divide-gray-200 bg-white',
          striped && '[&>*:nth-child(even)]:bg-gray-50',
          className
        )}
        {...props}
      >
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = 'TableBody';

// TableRow
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  hoverable?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, hoverable = true, className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          hoverable && 'hover:bg-gray-100 transition-colors cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

// TableHead
export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        scope="col"
        className={cn(
          'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500',
          className
        )}
        {...props}
      >
        {children}
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

// TableCell
export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn('whitespace-nowrap px-6 py-4 text-sm text-gray-900', className)}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';

// TableEmpty - Empty state for tables
export const TableEmpty = ({ colSpan, message = 'No data available' }: { colSpan: number; message?: string }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <svg
            className="mb-3 h-12 w-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </td>
    </tr>
  );
};

export default Table;

