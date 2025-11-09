/**
 * Modal Component - Professional dialog/modal
 */

'use client';

import { Fragment, ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlay?: boolean;
  footer?: ReactNode;
  showCloseButton?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlay = true,
  footer,
  showCloseButton = true,
}: ModalProps) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  const handleOverlayClick = (): void => {
    if (closeOnOverlay) {
      onClose();
    }
  };

  const handleContentClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
  };

  return (
    <Fragment>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity animate-fade-in"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* Modal Content */}
          <div
            className={cn(
              'relative w-full rounded-xl bg-white shadow-2xl animate-scale-in',
              'transform transition-all',
              sizeStyles[size]
            )}
            onClick={handleContentClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                {title && (
                  <h3 id="modal-title" className="text-xl font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="px-6 py-4">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Modal;

// Confirmation Modal Helper
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  isLoading = false,
}: ConfirmModalProps) => {
  const iconColors = {
    danger: 'text-danger-600',
    warning: 'text-warning-600',
    info: 'text-primary-600',
  };

  const buttonVariants = {
    danger: 'bg-danger-600 hover:bg-danger-700',
    warning: 'bg-warning-600 hover:bg-warning-700',
    info: 'bg-primary-600 hover:bg-primary-700',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnOverlay={!isLoading}
      showCloseButton={!isLoading}
    >
      <div className="text-center">
        <div className={cn('mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-opacity-10', iconColors[variant])}>
          {variant === 'danger' && (
            <svg className={cn('h-6 w-6', iconColors[variant])} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {variant === 'warning' && (
            <svg className={cn('h-6 w-6', iconColors[variant])} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {variant === 'info' && (
            <svg className={cn('h-6 w-6', iconColors[variant])} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mb-6 text-sm text-gray-500">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50',
              buttonVariants[variant]
            )}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

