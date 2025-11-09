# Database Schema Documentation

## Overview

The InvoiceMe database schema is designed following Domain-Driven Design principles with three main aggregates: Customer, Invoice, and Payment. The schema uses PostgreSQL as the primary database with support for complex data types and relationships.

## Entity Relationship Diagram

```
┌─────────────────────────────┐
│         CUSTOMERS           │
│─────────────────────────────│
│ id (UUID) PK                │
│ name VARCHAR(255) NOT NULL  │
│ email VARCHAR(255) UNIQUE   │
│ phone VARCHAR(20)           │
│ address_street VARCHAR(255) │
│ address_city VARCHAR(100)   │
│ address_state VARCHAR(100)  │
│ address_zip_code VARCHAR(20)│
│ address_country VARCHAR(100)│
│ created_at TIMESTAMP        │
│ updated_at TIMESTAMP        │
└─────────────────────────────┘
         │
         │ 1
         │
         │
         │ *
         ▼
┌─────────────────────────────┐        ┌────────────────────────────┐
│         INVOICES            │        │       LINE_ITEMS           │
│─────────────────────────────│◄───────│────────────────────────────│
│ id (UUID) PK                │   *    │ id (UUID) PK               │
│ customer_id (UUID) FK       │        │ invoice_id (UUID) FK       │
│ invoice_number VARCHAR UNIQUE│        │ description VARCHAR(500)   │
│ status VARCHAR(20)          │        │ quantity DECIMAL           │
│ issue_date DATE             │        │ unit_price_amount DECIMAL  │
│ due_date DATE               │        │ unit_price_currency VARCHAR│
│ total_amount DECIMAL        │        │ total_amount DECIMAL       │
│ currency VARCHAR(3)         │        │ total_currency VARCHAR(3)  │
│ paid_amount DECIMAL         │        └────────────────────────────┘
│ paid_currency VARCHAR(3)    │
│ notes TEXT                  │
│ created_at TIMESTAMP        │
│ updated_at TIMESTAMP        │
│ sent_at TIMESTAMP           │
└─────────────────────────────┘
         │
         │ 1
         │
         │
         │ *
         ▼
┌─────────────────────────────┐
│         PAYMENTS            │
│─────────────────────────────│
│ id (UUID) PK                │
│ invoice_id (UUID) FK        │
│ amount DECIMAL              │
│ currency VARCHAR(3)         │
│ payment_date TIMESTAMP      │
│ payment_method VARCHAR(50)  │
│ reference_number VARCHAR    │
│ notes VARCHAR(500)          │
│ created_at TIMESTAMP        │
└─────────────────────────────┘

┌─────────────────────────────┐
│          USERS              │
│─────────────────────────────│
│ id (UUID) PK                │
│ username VARCHAR UNIQUE     │
│ password VARCHAR            │
│ email VARCHAR UNIQUE        │
│ roles VARCHAR(255)          │
│ enabled BOOLEAN             │
│ created_at TIMESTAMP        │
│ updated_at TIMESTAMP        │
└─────────────────────────────┘
```

## Table Definitions

### CUSTOMERS

**Purpose**: Stores customer information as the Customer aggregate root.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Customer full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Customer email address |
| phone | VARCHAR(20) | NULL | Contact phone number |
| address_street | VARCHAR(255) | NULL | Street address |
| address_city | VARCHAR(100) | NULL | City |
| address_state | VARCHAR(100) | NULL | State/Province |
| address_zip_code | VARCHAR(20) | NULL | Postal/ZIP code |
| address_country | VARCHAR(100) | NULL | Country |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NULL | Last update timestamp |

**Indexes**:
- `idx_customer_email` on `email` - Fast email lookups
- `idx_customer_name` on `name` - Name-based searches
- `idx_customer_created_at` on `created_at` - Date-based sorting

**Business Rules**:
- Email must be unique across all customers
- Name is required (cannot be blank)
- Email format validated by domain logic

---

### INVOICES

**Purpose**: Stores invoice information as the Invoice aggregate root.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| customer_id | UUID | NOT NULL, FK → customers.id | Associated customer |
| invoice_number | VARCHAR(50) | NOT NULL, UNIQUE | Business invoice number |
| status | VARCHAR(20) | NOT NULL | Invoice status (DRAFT/SENT/PAID) |
| issue_date | DATE | NOT NULL | Invoice issue date |
| due_date | DATE | NOT NULL | Payment due date |
| total_amount | DECIMAL(19,2) | NOT NULL | Total invoice amount |
| currency | VARCHAR(3) | NOT NULL | Currency code (USD, EUR, GBP) |
| paid_amount | DECIMAL(19,2) | NOT NULL | Total paid amount |
| paid_currency | VARCHAR(3) | NOT NULL | Paid amount currency |
| notes | TEXT | NULL | Additional notes (max 1000 chars) |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NULL | Last update timestamp |
| sent_at | TIMESTAMP | NULL | When invoice was marked as sent |

**Indexes**:
- `idx_invoice_customer_id` on `customer_id` - Customer's invoices
- `idx_invoice_status` on `status` - Status-based filtering
- `idx_invoice_number` on `invoice_number` - Invoice number lookups
- `idx_invoice_issue_date` on `issue_date` - Date range queries
- `idx_invoice_due_date` on `due_date` - Overdue calculations
- `idx_invoice_created_at` on `created_at` - Sorting
- `idx_invoice_customer_status` on `(customer_id, status)` - Composite filter

**Business Rules**:
- Invoice number must be unique across all invoices
- Due date must be >= issue date
- Status transitions: DRAFT → SENT → PAID (unidirectional)
- Only DRAFT invoices can be edited
- Status automatically changes to PAID when balance reaches zero

---

### LINE_ITEMS

**Purpose**: Stores individual line items within an invoice (part of Invoice aggregate).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| invoice_id | UUID | NOT NULL, FK → invoices.id | Parent invoice |
| description | VARCHAR(500) | NOT NULL | Item description |
| quantity | DECIMAL(19,4) | NOT NULL | Quantity |
| unit_price_amount | DECIMAL(19,2) | NOT NULL | Price per unit |
| unit_price_currency | VARCHAR(3) | NOT NULL | Unit price currency |
| total_amount | DECIMAL(19,2) | NOT NULL | Line total (qty × unit price) |
| total_currency | VARCHAR(3) | NOT NULL | Total currency |

**No explicit indexes** - LINE_ITEMS are always accessed through their parent Invoice.

**Business Rules**:
- Line items cannot exist without an invoice (cascade delete)
- Quantity must be positive
- Unit price must be positive
- Total automatically calculated: quantity × unit_price
- All line items in an invoice must use the same currency

---

### PAYMENTS

**Purpose**: Stores payment transactions against invoices.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| invoice_id | UUID | NOT NULL, FK → invoices.id | Associated invoice |
| amount | DECIMAL(19,2) | NOT NULL | Payment amount |
| currency | VARCHAR(3) | NOT NULL | Payment currency |
| payment_date | TIMESTAMP | NOT NULL | When payment was made |
| payment_method | VARCHAR(50) | NULL | Payment method (optional) |
| reference_number | VARCHAR(100) | NULL | Transaction reference |
| notes | VARCHAR(500) | NULL | Additional notes |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |

**Indexes**:
- `idx_payment_invoice_id` on `invoice_id` - Invoice's payments
- `idx_payment_date` on `payment_date` - Date-based queries
- `idx_payment_created_at` on `created_at` - Sorting

**Business Rules**:
- Payment amount must be > 0
- Payment amount cannot exceed invoice balance
- Payments are immutable once created
- Currency must match invoice currency

---

### USERS

**Purpose**: Stores user authentication information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| username | VARCHAR(50) | NOT NULL, UNIQUE | Username for login |
| password | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User email address |
| roles | VARCHAR(255) | NOT NULL | Comma-separated roles |
| enabled | BOOLEAN | NOT NULL | Account enabled status |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NULL | Last update timestamp |

**Business Rules**:
- Username must be unique
- Password stored as BCrypt hash (never plain text)
- Default admin user created on first startup
- Supports multiple roles per user

---

## Relationships

### One-to-Many Relationships

1. **Customer → Invoices**
   - One customer can have many invoices
   - Foreign key: `invoices.customer_id` → `customers.id`
   - Cascade: No cascade delete (invoices preserved for audit)

2. **Invoice → LineItems**
   - One invoice has many line items
   - Foreign key: `line_items.invoice_id` → `invoices.id`
   - Cascade: DELETE (line items removed when invoice deleted)
   - Fetch: EAGER (line items always loaded with invoice)

3. **Invoice → Payments**
   - One invoice can have many payments
   - Foreign key: `payments.invoice_id` → `invoices.id`
   - Cascade: No cascade delete (payments preserved for audit)

## Data Types

### UUID
All primary keys use UUID (Universally Unique Identifier) to:
- Avoid ID collision in distributed systems
- Prevent ID guessing/enumeration attacks
- Enable offline ID generation
- Support database sharding if needed

### Money Storage
Monetary values stored as:
- **Amount**: DECIMAL(19,2) - Supports up to 999,999,999,999,999.99
- **Currency**: VARCHAR(3) - ISO 4217 currency codes (USD, EUR, GBP, etc.)

**Rationale**:
- DECIMAL prevents floating-point precision errors
- Separate currency field ensures explicit currency tracking
- Scale of 2 handles standard currency precision

### Timestamps
All timestamps stored as `TIMESTAMP WITHOUT TIME ZONE`:
- Application handles timezone conversions
- Database stores in UTC
- Consistent cross-region behavior

## Value Objects in Database

Several domain value objects are embedded into tables:

### Email (in CUSTOMERS)
- Stored as `email` VARCHAR(255)
- Domain validates format before persistence
- Uniqueness enforced at database level

### Address (in CUSTOMERS)
- Stored as multiple columns: `address_street`, `address_city`, etc.
- Allows efficient querying by city, state, etc.
- NULL allowed (not all customers have addresses)

### Money (in INVOICES, LINE_ITEMS, PAYMENTS)
- Stored as two columns: `*_amount` and `*_currency`
- Ensures currency is always tracked with amount
- Enables multi-currency support

## Constraints & Validation

### Database-Level Constraints
- **Primary Keys**: Ensure unique identification
- **Foreign Keys**: Maintain referential integrity
- **Unique Constraints**: Prevent duplicate emails, invoice numbers
- **Not Null**: Enforce required fields

### Application-Level Validation
- **Email format**: Validated by Email value object
- **Date ranges**: Due date >= issue date
- **Business rules**: Status transitions, payment amounts
- **String lengths**: Field-specific validation

**Design Decision**: Simple constraints at database level, complex business rules in domain layer.

## Performance Considerations

### Indexing Strategy
11 strategic indexes optimize common queries:
- Email and username lookups (authentication, uniqueness checks)
- Customer name searches
- Invoice filtering by status, customer, dates
- Payment lookups by invoice
- Sorting by creation/payment dates

### Pagination
All list queries support pagination (default 20 items):
- Reduces memory usage
- Improves response times
- Scales with data growth

### Connection Pooling
HikariCP pool configuration:
- Max 20 connections
- Min 10 idle connections
- Prevents connection exhaustion under load

## Migration Strategy

### Development
- JPA `ddl-auto=update`: Hibernate creates/updates schema automatically
- Schema changes tracked in version control via entity annotations
- Database recreated from entities for consistency

### Production (Recommended)
- JPA `ddl-auto=validate`: Hibernate validates but doesn't modify schema
- Use Flyway or Liquibase for versioned migrations
- Manual review of schema changes before production deployment

## Sample Queries

### Common Queries (Optimized by Indexes)

```sql
-- Get customer by email (uses idx_customer_email)
SELECT * FROM customers WHERE email = 'john@example.com';

-- Get invoices by status (uses idx_invoice_status)
SELECT * FROM invoices WHERE status = 'SENT' ORDER BY created_at DESC;

-- Get customer's invoices (uses idx_invoice_customer_id)
SELECT * FROM invoices 
WHERE customer_id = 'uuid-here' 
ORDER BY issue_date DESC;

-- Get overdue invoices (uses idx_invoice_due_date, idx_invoice_status)
SELECT * FROM invoices 
WHERE status = 'SENT' 
  AND due_date < CURRENT_DATE;

-- Get invoice with line items and payments
SELECT i.*, li.*, p.*
FROM invoices i
LEFT JOIN line_items li ON li.invoice_id = i.id
LEFT JOIN payments p ON p.invoice_id = i.id
WHERE i.id = 'uuid-here';

-- Get payment history for invoice (uses idx_payment_invoice_id)
SELECT * FROM payments 
WHERE invoice_id = 'uuid-here' 
ORDER BY payment_date DESC;
```

## Schema Evolution

The schema is designed for evolution:

### Adding New Fields
1. Add column to entity class with JPA annotations
2. Test with `ddl-auto=update` in development
3. Create migration script for production
4. Deploy with zero downtime (nullable fields first, then backfill)

### Adding New Aggregates
1. Create new entity in `domain/` package
2. Create repository interface
3. JPA implementation auto-generated by Spring Data
4. Schema created automatically in development

### Modifying Relationships
1. Carefully plan to avoid breaking existing data
2. Consider adding new relationship alongside old temporarily
3. Migrate data
4. Remove old relationship

## Backup & Recovery

### Recommended Strategy
- **Daily backups**: Full database backup
- **Transaction logs**: Enable for point-in-time recovery
- **Retention**: 30 days minimum
- **Testing**: Regularly test restore procedures

### Critical Data
- **Invoices**: Core business records, must be preserved
- **Payments**: Financial records, required for accounting
- **Customers**: Can be recreated but inconvenient
- **Users**: Can be recreated

## Security Considerations

### Data Protection
- **Passwords**: BCrypt hashed, never stored in plain text
- **JWT Secrets**: Stored in environment variables, not database
- **Connection strings**: Secured in application properties

### Audit Trail
Current schema includes:
- `created_at`: When record was created
- `updated_at`: When record was last modified
- Payments immutable for audit purposes

**Future Enhancement**: Consider audit log table for compliance.

