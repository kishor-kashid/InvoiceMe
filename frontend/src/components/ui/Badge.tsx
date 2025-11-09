/**
 * Badge Component - Status indicators and labels
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'gray',
      size = 'md',
      dot = false,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full';

    const variantStyles = {
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-secondary-100 text-secondary-800',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-800',
      danger: 'bg-danger-100 text-danger-800',
      gray: 'bg-gray-100 text-gray-800',
    };

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    const dotColors = {
      primary: 'bg-primary-600',
      secondary: 'bg-secondary-600',
      success: 'bg-success-600',
      warning: 'bg-warning-600',
      danger: 'bg-danger-600',
      gray: 'bg-gray-600',
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'mr-1.5 h-2 w-2 rounded-full',
              dotColors[variant]
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Invoice status badge helper
export const InvoiceStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    DRAFT: { variant: 'gray' as const, label: 'Draft' },
    SENT: { variant: 'warning' as const, label: 'Sent' },
    PAID: { variant: 'success' as const, label: 'Paid' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    variant: 'gray' as const,
    label: status,
  };

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
};

export default Badge;

