# InvoiceMe API Documentation

## Overview

This document describes the RESTful API endpoints for the InvoiceMe application. The API follows REST principles and uses JSON for request/response payloads.

**Base URL:** `http://localhost:8080/api`

**Content-Type:** `application/json`

**Architecture:** CQRS (Command Query Responsibility Segregation)

---

## Table of Contents

- [Customer Management](#customer-management)
  - [Create Customer](#create-customer)
  - [Get Customer by ID](#get-customer-by-id)
  - [List All Customers](#list-all-customers)
  - [Update Customer](#update-customer)
  - [Delete Customer](#delete-customer)
- [Invoice Management](#invoice-management)
  - [Create Invoice](#create-invoice)
  - [Get Invoice by ID](#get-invoice-by-id)
  - [List Invoices](#list-invoices)
  - [Update Invoice](#update-invoice)
  - [Mark Invoice as Sent](#mark-invoice-as-sent)
  - [Record Payment](#record-payment)
  - [List Payments for Invoice](#list-payments-for-invoice)
- [Payment Management](#payment-management)
  - [Get Payment by ID](#get-payment-by-id)
- [Error Handling](#error-handling)

---

## Customer Management

### Create Customer

Create a new customer in the system.

**Endpoint:** `POST /api/customers`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0100",
  "street": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA"
}
```

**Response:** `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Customer created successfully"
}
```

**Validation Rules:**
- `name`: Required, cannot be blank
- `email`: Required, must be valid email format
- `street`: Required
- `city`: Required
- `country`: Required
- `phone`, `state`, `zipCode`: Optional

**Error Responses:**
- `400 Bad Request`: Validation failed or email already exists
- `500 Internal Server Error`: Server error

---

### Get Customer by ID

Retrieve a specific customer by their ID.

**Endpoint:** `GET /api/customers/{id}`

**Path Parameters:**
- `id` (string): Customer ID

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0100",
  "address": {
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "createdAt": "2025-11-08T20:00:00",
  "updatedAt": "2025-11-08T20:00:00"
}
```

**Error Responses:**
- `404 Not Found`: Customer not found

---

### List All Customers

Retrieve a list of all customers.

**Endpoint:** `GET /api/customers`

**Response:** `200 OK`
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0100",
    "address": {
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "createdAt": "2025-11-08T20:00:00",
    "updatedAt": "2025-11-08T20:00:00"
  }
]
```

---

### Update Customer

Update an existing customer's information.

**Endpoint:** `PUT /api/customers/{id}`

**Path Parameters:**
- `id` (string): Customer ID

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "+1-555-0200",
  "street": "456 Oak Avenue",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "country": "USA"
}
```

**Response:** `200 OK`
```json
{
  "message": "Customer updated successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed
- `404 Not Found`: Customer not found

---

### Delete Customer

Delete a customer from the system.

**Endpoint:** `DELETE /api/customers/{id}`

**Path Parameters:**
- `id` (string): Customer ID

**Response:** `200 OK`
```json
{
  "message": "Customer deleted successfully"
}
```

**Business Rules:**
- Cannot delete a customer who has existing invoices

**Error Responses:**
- `400 Bad Request`: Customer has existing invoices
- `404 Not Found`: Customer not found

---

## Invoice Management

### Create Invoice

Create a new invoice with line items.

**Endpoint:** `POST /api/invoices`

**Request Body:**
```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "invoiceNumber": "INV-2025-001",
  "issueDate": "2025-11-08",
  "dueDate": "2025-12-08",
  "currency": "USD",
  "lineItems": [
    {
      "description": "Web Development Services",
      "quantity": 40,
      "unitPrice": 100.00
    },
    {
      "description": "Domain Registration",
      "quantity": 1,
      "unitPrice": 15.00
    }
  ],
  "notes": "Payment terms: Net 30 days"
}
```

**Response:** `201 Created`
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "message": "Invoice created successfully"
}
```

**Validation Rules:**
- `customerId`: Required, must exist
- `invoiceNumber`: Required, must be unique
- `issueDate`: Required
- `dueDate`: Required, must be after issue date
- `currency`: Required (e.g., "USD", "EUR", "GBP")
- `lineItems`: Required, must have at least one item
  - `description`: Required
  - `quantity`: Required, must be greater than 0
  - `unitPrice`: Required, must be greater than 0

**Business Rules:**
- Invoice is created in `DRAFT` status
- Total amount is calculated automatically from line items

**Error Responses:**
- `400 Bad Request`: Validation failed or invoice number already exists
- `404 Not Found`: Customer not found

---

### Get Invoice by ID

Retrieve a specific invoice with all details.

**Endpoint:** `GET /api/invoices/{id}`

**Path Parameters:**
- `id` (string): Invoice ID

**Response:** `200 OK`
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "invoiceNumber": "INV-2025-001",
  "status": "SENT",
  "issueDate": "2025-11-08",
  "dueDate": "2025-12-08",
  "lineItems": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "description": "Web Development Services",
      "quantity": 40,
      "unitPrice": {
        "amount": 100.00,
        "currency": "USD"
      },
      "total": {
        "amount": 4000.00,
        "currency": "USD"
      }
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "description": "Domain Registration",
      "quantity": 1,
      "unitPrice": {
        "amount": 15.00,
        "currency": "USD"
      },
      "total": {
        "amount": 15.00,
        "currency": "USD"
      }
    }
  ],
  "totalAmount": {
    "amount": 4015.00,
    "currency": "USD"
  },
  "paidAmount": {
    "amount": 1000.00,
    "currency": "USD"
  },
  "balance": {
    "amount": 3015.00,
    "currency": "USD"
  },
  "notes": "Payment terms: Net 30 days",
  "createdAt": "2025-11-08T20:00:00",
  "updatedAt": "2025-11-08T20:30:00",
  "sentAt": "2025-11-08T20:30:00"
}
```

**Error Responses:**
- `404 Not Found`: Invoice not found

---

### List Invoices

Retrieve a list of invoices with optional filters.

**Endpoint:** `GET /api/invoices`

**Query Parameters:**
- `status` (optional): Filter by status (`DRAFT`, `SENT`, `PAID`)
- `customerId` (optional): Filter by customer ID

**Examples:**
- `GET /api/invoices` - All invoices
- `GET /api/invoices?status=SENT` - Only sent invoices
- `GET /api/invoices?customerId=550e8400-e29b-41d4-a716-446655440000` - Invoices for specific customer
- `GET /api/invoices?status=SENT&customerId=550e8400-e29b-41d4-a716-446655440000` - Sent invoices for specific customer

**Response:** `200 OK`
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "invoiceNumber": "INV-2025-001",
    "status": "SENT",
    "issueDate": "2025-11-08",
    "dueDate": "2025-12-08",
    "lineItems": [...],
    "totalAmount": {
      "amount": 4015.00,
      "currency": "USD"
    },
    "paidAmount": {
      "amount": 1000.00,
      "currency": "USD"
    },
    "balance": {
      "amount": 3015.00,
      "currency": "USD"
    },
    "notes": "Payment terms: Net 30 days",
    "createdAt": "2025-11-08T20:00:00",
    "updatedAt": "2025-11-08T20:30:00",
    "sentAt": "2025-11-08T20:30:00"
  }
]
```

---

### Update Invoice

Update invoice details (only available for DRAFT invoices).

**Endpoint:** `PUT /api/invoices/{id}`

**Path Parameters:**
- `id` (string): Invoice ID

**Request Body:**
```json
{
  "issueDate": "2025-11-09",
  "dueDate": "2025-12-09",
  "notes": "Updated payment terms: Net 45 days"
}
```

**Response:** `200 OK`
```json
{
  "message": "Invoice updated successfully"
}
```

**Business Rules:**
- Only `DRAFT` invoices can be updated
- Line items cannot be modified through this endpoint

**Error Responses:**
- `400 Bad Request`: Validation failed
- `404 Not Found`: Invoice not found
- `409 Conflict`: Invoice is not in DRAFT status

---

### Mark Invoice as Sent

Change invoice status from DRAFT to SENT.

**Endpoint:** `POST /api/invoices/{id}/send`

**Path Parameters:**
- `id` (string): Invoice ID

**Response:** `200 OK`
```json
{
  "message": "Invoice marked as sent"
}
```

**Business Rules:**
- Only `DRAFT` invoices can be marked as sent
- Invoice must have at least one line item
- Status changes: `DRAFT` → `SENT`

**Error Responses:**
- `404 Not Found`: Invoice not found
- `409 Conflict`: Invoice is not in DRAFT status or has no line items

---

### Record Payment

Record a payment against an invoice.

**Endpoint:** `POST /api/invoices/{id}/payments`

**Path Parameters:**
- `id` (string): Invoice ID

**Request Body:**
```json
{
  "amount": 1000.00,
  "paymentDate": "2025-11-09T14:30:00",
  "paymentMethod": "Bank Transfer",
  "referenceNumber": "TXN-20251109-001",
  "notes": "First installment"
}
```

**Response:** `201 Created`
```json
{
  "paymentId": "990e8400-e29b-41d4-a716-446655440000",
  "message": "Payment recorded successfully"
}
```

**Validation Rules:**
- `amount`: Required, must be greater than zero
- `paymentDate`: Optional (defaults to current time)
- `paymentMethod`: Optional
- `referenceNumber`: Optional
- `notes`: Optional

**Business Rules:**
- Only `SENT` invoices can accept payments
- Payment amount cannot exceed remaining balance
- When balance reaches zero, invoice status automatically changes to `PAID`
- Currency is inherited from invoice

**Error Responses:**
- `400 Bad Request`: Amount exceeds balance or validation failed
- `404 Not Found`: Invoice not found
- `409 Conflict`: Invoice is not in SENT status

---

### List Payments for Invoice

Retrieve all payments for a specific invoice.

**Endpoint:** `GET /api/invoices/{id}/payments`

**Path Parameters:**
- `id` (string): Invoice ID

**Response:** `200 OK`
```json
[
  {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "invoiceId": "660e8400-e29b-41d4-a716-446655440000",
    "amount": 1000.00,
    "currency": "USD",
    "paymentDate": "2025-11-09T14:30:00",
    "paymentMethod": "Bank Transfer",
    "referenceNumber": "TXN-20251109-001",
    "notes": "First installment",
    "createdAt": "2025-11-09T14:30:00"
  }
]
```

---

## Payment Management

### Get Payment by ID

Retrieve a specific payment by ID.

**Endpoint:** `GET /api/payments/{id}`

**Path Parameters:**
- `id` (string): Payment ID

**Response:** `200 OK`
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440000",
  "invoiceId": "660e8400-e29b-41d4-a716-446655440000",
  "amount": 1000.00,
  "currency": "USD",
  "paymentDate": "2025-11-09T14:30:00",
  "paymentMethod": "Bank Transfer",
  "referenceNumber": "TXN-20251109-001",
  "notes": "First installment",
  "createdAt": "2025-11-09T14:30:00"
}
```

**Error Responses:**
- `404 Not Found`: Payment not found

---

## Error Handling

All error responses follow a consistent format:

### Standard Error Response

```json
{
  "status": 400,
  "message": "Customer with email john.doe@example.com already exists",
  "timestamp": "2025-11-08T20:00:00"
}
```

### Validation Error Response

When validation fails, the response includes field-level errors:

```json
{
  "status": 400,
  "message": "Validation failed",
  "timestamp": "2025-11-08T20:00:00",
  "fieldErrors": {
    "name": "Customer name is required",
    "email": "Invalid email format"
  }
}
```

### HTTP Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Validation failed or business rule violation
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `409 Conflict`: State conflict (e.g., trying to edit a sent invoice)
- `500 Internal Server Error`: Server error

---

## Invoice Lifecycle

Invoices follow a strict lifecycle:

```
DRAFT → SENT → PAID
```

**DRAFT:**
- Can be edited
- Can add/remove line items
- Can be marked as sent
- Cannot accept payments

**SENT:**
- Cannot be edited
- Cannot modify line items
- Can accept payments
- Automatically becomes PAID when balance reaches zero

**PAID:**
- Read-only
- No modifications allowed
- Final state

---

## Common Workflows

### 1. Complete Invoice Flow

```
1. POST /api/customers (create customer)
2. POST /api/invoices (create invoice in DRAFT)
3. POST /api/invoices/{id}/send (mark as SENT)
4. POST /api/invoices/{id}/payments (record payment)
5. GET /api/invoices/{id} (verify status changed to PAID)
```

### 2. Customer Management Flow

```
1. POST /api/customers (create)
2. GET /api/customers/{id} (retrieve)
3. PUT /api/customers/{id} (update)
4. GET /api/invoices?customerId={id} (check for invoices)
5. DELETE /api/customers/{id} (delete if no invoices)
```

### 3. Payment Tracking Flow

```
1. GET /api/invoices?status=SENT (get unpaid invoices)
2. GET /api/invoices/{id} (check balance)
3. POST /api/invoices/{id}/payments (record payment)
4. GET /api/invoices/{id}/payments (list all payments)
```

---

## Data Types

### Money
```json
{
  "amount": 1234.56,
  "currency": "USD"
}
```

### Address
```json
{
  "street": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA"
}
```

### Invoice Status
- `DRAFT`: Invoice is being edited
- `SENT`: Invoice has been sent to customer
- `PAID`: Invoice is fully paid

---

## Notes

1. **Date Format**: ISO 8601 format (`YYYY-MM-DD` for dates, `YYYY-MM-DDTHH:mm:ss` for timestamps)
2. **Currency Codes**: ISO 4217 format (e.g., USD, EUR, GBP)
3. **IDs**: UUID v4 format
4. **All endpoints** support CORS for frontend integration
5. **Transaction Management**: All write operations are transactional
6. **Validation**: Jakarta Bean Validation is used for input validation

---

## Testing with cURL

### Create Customer
```bash
curl -X POST http://localhost:8080/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0100",
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }'
```

### Create Invoice
```bash
curl -X POST http://localhost:8080/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "invoiceNumber": "INV-2025-001",
    "issueDate": "2025-11-08",
    "dueDate": "2025-12-08",
    "currency": "USD",
    "lineItems": [
      {
        "description": "Web Development",
        "quantity": 40,
        "unitPrice": 100.00
      }
    ]
  }'
```

### Record Payment
```bash
curl -X POST http://localhost:8080/api/invoices/660e8400-e29b-41d4-a716-446655440000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000.00,
    "paymentMethod": "Bank Transfer",
    "referenceNumber": "TXN-001"
  }'
```

---

## API Design Principles

This API follows these design principles:

1. **RESTful**: Resource-based URLs with appropriate HTTP methods
2. **CQRS**: Separate commands (writes) from queries (reads)
3. **Idempotent**: PUT and DELETE operations are idempotent
4. **Stateless**: Each request contains all necessary information
5. **Consistent**: Uniform error handling and response formats
6. **Versioned**: Ready for future versioning (e.g., `/api/v1/`)
7. **Domain-Driven**: Endpoints reflect business domain concepts

---

For more information, see:
- [Product Requirements Document](InvoiceMe-PRD.md)
- [Task List](InvoiceMe_Task_List.md)
- [README](README.md)

