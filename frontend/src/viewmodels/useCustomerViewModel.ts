/**
 * Customer ViewModel - MVVM pattern for customer management
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { customerService } from '@/services';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest, ApiError } from '@/types';
import { useToast } from '@/components/ui';

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  general?: string;
}

export const useCustomerViewModel = () => {
  const router = useRouter();
  const toast = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Load all customers
  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load customers');
      console.error('Load customers error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load customer by ID
  const loadCustomer = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const customer = await customerService.getById(id);
      setSelectedCustomer(customer);
      return customer;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load customer');
      console.error('Load customer error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create customer
  const createCustomer = async (formData: CustomerFormData): Promise<boolean> => {
    setFormErrors({});
    setIsSubmitting(true);

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setIsSubmitting(false);
      return false;
    }

    try {
      const request: CreateCustomerRequest = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        country: formData.country.trim(),
      };

      const newCustomer = await customerService.create(request);
      
      // Refresh customer list
      await loadCustomers();
      
      toast.success('Customer created successfully');
      
      // Navigate to customer detail page
      router.push(`/customers/${newCustomer.id}`);
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      
      // Handle validation errors from backend
      if (apiError.errors && apiError.errors.length > 0) {
        const backendErrors: FormErrors = {};
        apiError.errors.forEach((error) => {
          const field = error.field.toLowerCase();
          if (field.includes('name')) backendErrors.name = error.message;
          else if (field.includes('email')) backendErrors.email = error.message;
          else if (field.includes('phone')) backendErrors.phone = error.message;
          else if (field.includes('street')) backendErrors.street = error.message;
          else if (field.includes('city')) backendErrors.city = error.message;
          else if (field.includes('state')) backendErrors.state = error.message;
          else if (field.includes('zip') || field.includes('postal')) backendErrors.zipCode = error.message;
          else if (field.includes('country')) backendErrors.country = error.message;
        });
        setFormErrors(backendErrors);
      } else {
        const errorMessage = apiError.message || 'Failed to create customer';
        setFormErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
      
      console.error('Create customer error:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update customer
  const updateCustomer = async (id: string, formData: CustomerFormData): Promise<boolean> => {
    setFormErrors({});
    setIsSubmitting(true);

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setIsSubmitting(false);
      return false;
    }

    try {
      const request: UpdateCustomerRequest = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        country: formData.country.trim(),
      };

      const updatedCustomer = await customerService.update(id, request);
      setSelectedCustomer(updatedCustomer);
      
      // Refresh customer list
      await loadCustomers();
      
      toast.success('Customer updated successfully');
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      
      // Handle validation errors from backend
      if (apiError.errors && apiError.errors.length > 0) {
        const backendErrors: FormErrors = {};
        apiError.errors.forEach((error) => {
          const field = error.field.toLowerCase();
          if (field.includes('name')) backendErrors.name = error.message;
          else if (field.includes('email')) backendErrors.email = error.message;
          else if (field.includes('phone')) backendErrors.phone = error.message;
          else if (field.includes('street')) backendErrors.street = error.message;
          else if (field.includes('city')) backendErrors.city = error.message;
          else if (field.includes('state')) backendErrors.state = error.message;
          else if (field.includes('zip') || field.includes('postal')) backendErrors.zipCode = error.message;
          else if (field.includes('country')) backendErrors.country = error.message;
        });
        setFormErrors(backendErrors);
      } else {
        const errorMessage = apiError.message || 'Failed to update customer';
        setFormErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
      
      console.error('Update customer error:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete customer
  const deleteCustomer = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await customerService.delete(id);
      
      // Remove from local state
      setCustomers(customers.filter(c => c.id !== id));
      
      // Clear selected if deleted
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
      
      toast.success('Customer deleted successfully');
      
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to delete customer';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Delete customer error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Form validation
  const validateForm = (formData: CustomerFormData): FormErrors => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    }

    if (!formData.street.trim()) {
      errors.street = 'Street address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      errors.zipCode = 'Zip code is required';
    }

    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }

    return errors;
  };

  // Filtered customers based on search
  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      customer.address.city.toLowerCase().includes(query)
    );
  });

  // Clear errors
  const clearErrors = (): void => {
    setFormErrors({});
    setError(null);
  };

  // Initialize - load customers on mount
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return {
    // State
    customers: filteredCustomers,
    selectedCustomer,
    isLoading,
    isSubmitting,
    error,
    searchQuery,
    formErrors,
    
    // Actions
    loadCustomers,
    loadCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    setSearchQuery,
    setSelectedCustomer,
    clearErrors,
  };
};

export default useCustomerViewModel;

