/**
 * Auth ViewModel - MVVM pattern for authentication
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/types';

interface LoginFormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

export const useAuthViewModel = () => {
  const router = useRouter();
  const { login, logout, user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (data: LoginFormData): boolean => {
    const newErrors: FormErrors = {};

    if (!data.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!data.password) {
      newErrors.password = 'Password is required';
    } else if (data.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (data: LoginFormData): Promise<void> => {
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm(data)) {
      return;
    }

    setIsLoading(true);

    try {
      await login({
        username: data.username,
        password: data.password,
      });

      // Redirect to dashboard on success
      router.push('/');
    } catch (error) {
      const apiError = error as ApiError;
      setErrors({
        general: apiError.message || 'Login failed. Please check your credentials.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = (): void => {
    logout();
  };

  const clearErrors = (): void => {
    setErrors({});
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || authLoading,
    errors,
    handleLogin,
    handleLogout,
    clearErrors,
  };
};

export default useAuthViewModel;

