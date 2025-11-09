/**
 * ProtectedRoute - Wrapper for authenticated routes
 */

'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store the attempted URL for redirect after login
      const returnUrl = pathname !== '/login' ? pathname : '/';
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => 
        user?.roles.includes(role)
      );

      if (!hasRequiredRole) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" label="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      user?.roles.includes(role)
    );

    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

