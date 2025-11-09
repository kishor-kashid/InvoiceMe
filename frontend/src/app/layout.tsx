import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/ToastContainer';
import './globals.css';

export const metadata: Metadata = {
  title: 'InvoiceMe - ERP Invoicing System',
  description: 'AI-Assisted Full-Stack ERP Invoicing System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

