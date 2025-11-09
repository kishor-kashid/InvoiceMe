/**
 * Customer type definitions
 */

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string; // Backend uses zipCode
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
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UpdateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
}

