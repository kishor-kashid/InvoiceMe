/**
 * Customer type definitions
 */

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface UpdateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
}

