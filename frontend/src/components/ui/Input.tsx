/**
 * Input Component - Professional form input with validation
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputBaseStyles = 'block w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed';
    
    const inputStateStyles = error
      ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';

    const iconPaddingLeft = leftIcon ? 'pl-10' : '';
    const iconPaddingRight = rightIcon ? 'pr-10' : '';

    return (
      <div className={cn('flex flex-col', fullWidth ? 'w-full' : '')}>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="ml-1 text-danger-500">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              inputBaseStyles,
              inputStateStyles,
              iconPaddingLeft,
              iconPaddingRight,
              className
            )}
            suppressHydrationWarning
            {...props}
          />
          
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1.5 text-sm text-danger-600 flex items-center">
            <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

