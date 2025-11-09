/**
 * Spinner Component - Loading indicator
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  fullScreen?: boolean;
  label?: string;
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      color = 'primary',
      fullScreen = false,
      label,
      className,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
    };

    const colorStyles = {
      primary: 'text-primary-600',
      white: 'text-white',
      gray: 'text-gray-600',
    };

    const spinner = (
      <div className={cn('inline-flex flex-col items-center', className)} ref={ref} {...props}>
        <svg
          className={cn('animate-spin', sizeStyles[size], colorStyles[color])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {label && <p className="mt-2 text-sm text-gray-600">{label}</p>}
      </div>
    );

    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
          {spinner}
        </div>
      );
    }

    return spinner;
  }
);

Spinner.displayName = 'Spinner';

export default Spinner;

