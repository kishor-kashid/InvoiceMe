'use client';

import { useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles: Record<ToastType, { bg: string; border: string; text: string; icon: typeof CheckCircleIcon }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: CheckCircleIcon,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: ExclamationCircleIcon,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: InformationCircleIcon,
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: ExclamationTriangleIcon,
  },
};

export default function Toast({ id, type, message, duration = 5000, onClose }: ToastProps) {
  const style = toastStyles[type];
  const Icon = style.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [id, duration, onClose]);

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        ${style.bg} ${style.border}
        animate-slide-in-right
        min-w-[320px] max-w-md
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${style.text} flex-shrink-0 mt-0.5`} />
      <p className={`flex-1 text-sm font-medium ${style.text}`}>{message}</p>
      <button
        onClick={() => onClose(id)}
        className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
        aria-label="Close notification"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

