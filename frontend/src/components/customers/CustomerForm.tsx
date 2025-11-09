/**
 * CustomerForm Component - Professional customer form with validation
 */

'use client';

import { useState, useEffect } from 'react';
import { Customer } from '@/types';
import { Input, Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { CustomerFormData, FormErrors } from '@/viewmodels/useCustomerViewModel';

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (data: CustomerFormData) => Promise<boolean>;
  onCancel?: () => void;
  isLoading?: boolean;
  errors?: FormErrors;
}

export default function CustomerForm({
  customer,
  onSubmit,
  onCancel,
  isLoading = false,
  errors: externalErrors = {},
}: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    street: customer?.address.street || '',
    city: customer?.address.city || '',
    state: customer?.address.state || '',
    zipCode: customer?.address.zipCode || '',
    country: customer?.address.country || 'United States',
  });

  const [errors, setErrors] = useState<FormErrors>(externalErrors);

  // Update form data when customer changes
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        street: customer.address.street,
        city: customer.address.city,
        state: customer.address.state,
        zipCode: customer.address.zipCode,
        country: customer.address.country,
      });
    }
  }, [customer]);

  // Update errors when external errors change
  useEffect(() => {
    setErrors(externalErrors);
  }, [externalErrors]);

  const handleChange = (field: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (!success) {
      // Errors are handled by the ViewModel
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{customer ? 'Edit Customer' : 'Create New Customer'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="rounded-lg bg-danger-50 border border-danger-200 p-4">
              <div className="flex items-start">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-danger-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-danger-800">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                  fullWidth
                  leftIcon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />
              </div>

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                placeholder="john.doe@example.com"
                required
                disabled={isLoading}
                fullWidth
                leftIcon={
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="(555) 123-4567"
                required
                disabled={isLoading}
                fullWidth
                leftIcon={
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Address Information</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label="Street Address"
                  name="street"
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                  error={errors.street}
                  placeholder="123 Main Street"
                  required
                  disabled={isLoading}
                  fullWidth
                  leftIcon={
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                />
              </div>

              <Input
                label="City"
                name="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                error={errors.city}
                placeholder="New York"
                required
                disabled={isLoading}
                fullWidth
              />

              <Input
                label="State / Province"
                name="state"
                type="text"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                error={errors.state}
                placeholder="NY"
                required
                disabled={isLoading}
                fullWidth
              />

              <Input
                label="Zip Code"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                error={errors.zipCode}
                placeholder="10001"
                required
                disabled={isLoading}
                fullWidth
              />

              <Input
                label="Country"
                name="country"
                type="text"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                error={errors.country}
                placeholder="United States"
                required
                disabled={isLoading}
                fullWidth
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-6">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {customer ? 'Update Customer' : 'Create Customer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

