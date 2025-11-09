# System Patterns: InvoiceMe

## Architecture Overview

InvoiceMe follows a **Clean Architecture** approach with three core architectural principles:

1. **Domain-Driven Design (DDD)**
2. **Command Query Responsibility Segregation (CQRS)**
3. **Vertical Slice Architecture (VSA)**

## Layer Structure

### Domain Layer (DDD)
**Location**: `backend/src/main/java/com/invoiceme/domain/`

**Purpose**: Contains pure business logic with no framework dependencies.

**Key Components**:
- **Aggregates**: `Customer`, `Invoice`, `Payment` (Aggregate Roots)
- **Value Objects**: `CustomerId`, `InvoiceId`, `PaymentId`, `Email`, `Address`, `Money`
- **Entities**: `LineItem` (child entity of Invoice aggregate)
- **Repositories**: Interfaces defined in domain layer (`CustomerRepository`, `InvoiceRepository`, `PaymentRepository`)

**Design Patterns**:
- **Aggregate Pattern**: Customer, Invoice, and Payment are aggregate roots
- **Value Object Pattern**: IDs, Email, Address, Money are immutable value objects
- **Repository Pattern**: Abstractions for data access

### Application Layer (CQRS)
**Location**: `backend/src/main/java/com/invoiceme/features/`

**Purpose**: Contains use cases organized as vertical slices.

**Structure**: Each feature is a vertical slice containing:
- **Commands**: Write operations (Create, Update, Delete, State changes)
- **Queries**: Read operations (Get by ID, List with filters)
- **Handlers**: Business logic execution
- **Controllers**: REST API endpoints
- **DTOs**: Data transfer objects for API boundaries

**CQRS Separation**:
- **Commands**: Located in `createCustomer/`, `updateCustomer/`, `deleteCustomer/`, etc.
- **Queries**: Located in `getCustomer/`, `listCustomers/`, etc.

**Vertical Slice Organization**:
```
features/
├── customers/
│   ├── createCustomer/      # Command slice
│   ├── updateCustomer/      # Command slice
│   ├── deleteCustomer/      # Command slice
│   ├── getCustomer/         # Query slice
│   └── listCustomers/        # Query slice
├── invoices/
│   ├── createInvoice/       # Command slice
│   ├── updateInvoice/       # Command slice
│   ├── markInvoiceAsSent/  # Command slice
│   ├── recordPayment/       # Command slice
│   ├── getInvoice/          # Query slice
│   └── listInvoices/        # Query slice
└── payments/
    ├── getPayment/           # Query slice
    └── listPaymentsForInvoice/ # Query slice
```

### Infrastructure Layer
**Location**: `backend/src/main/java/com/invoiceme/infrastructure/`

**Purpose**: Framework-specific implementations.

**Components**:
- **Persistence**: JPA implementations of domain repositories
  - `JpaCustomerRepository`
  - `JpaInvoiceRepository`
  - `JpaPaymentRepository`
- **Security**: (Planned for PR15) JWT service, user management

### Shared Layer
**Location**: `backend/src/main/java/com/invoiceme/shared/`

**Purpose**: Cross-cutting concerns.

**Components**:
- **Exceptions**: `BusinessException`, `NotFoundException`, `GlobalExceptionHandler`
- **DTOs**: Error response DTOs (`ErrorResponse`, `ValidationErrorResponse`)
- **Mappers**: `DtoMapper` for converting domain entities to DTOs
- **Validation**: Jakarta Bean Validation with custom validators

## Key Design Patterns

### 1. Domain-Driven Design (DDD)

**Aggregates**:
- `Customer`: Aggregate root managing customer data
- `Invoice`: Aggregate root managing invoice and line items
- `Payment`: Entity that references Invoice

**Value Objects**:
- `Email`: Validates email format
- `Address`: Encapsulates address details
- `Money`: Handles currency and monetary calculations
- IDs: Strongly-typed identifiers

**Business Logic Location**:
- Domain entities contain business rules (e.g., invoice status transitions)
- Domain services (if needed) for operations spanning multiple aggregates

### 2. Command Query Responsibility Segregation (CQRS)

**Commands** (Write Operations):
- Return void or acknowledgment
- Modify system state
- Examples: `CreateCustomerCommand`, `UpdateInvoiceCommand`, `RecordPaymentCommand`

**Queries** (Read Operations):
- Return data only
- Never modify state
- Examples: `GetCustomerQuery`, `ListInvoicesQuery`

**Benefits**:
- Clear separation of concerns
- Independent optimization of read/write paths
- Easier to understand and maintain

### 3. Vertical Slice Architecture (VSA)

**Principle**: Organize code by features/use cases, not technical layers.

**Structure**: Each feature contains all necessary components:
- Controller (API endpoint)
- Handler (business logic)
- Command/Query (request object)
- DTO (response object)

**Benefits**:
- Feature cohesion
- Easy to locate code for a specific feature
- Independent development and testing
- Reduced coupling between features

## Component Relationships

### Request Flow (Command Example)
```
Client → Controller → Handler → Repository → Database
         ↓
       DTO ← Domain Entity ← Repository
```

### Request Flow (Query Example)
```
Client → Controller → Handler → Repository → Database
         ↓
       DTO ← Domain Entity ← Repository
```

### Domain Entity Relationships
```
Customer (1) ──< (many) Invoice (1) ──< (many) Payment
                      │
                      └──< (many) LineItem
```

## Technical Decisions

### 1. DTOs at Boundaries
- Domain entities never exposed directly through API
- DTOs used for all API communication
- `DtoMapper` handles conversion

### 2. Exception Handling
- Custom exceptions (`BusinessException`, `NotFoundException`)
- Global exception handler for consistent error responses
- Handles: NotFoundException (404), BusinessException (400), IllegalArgumentException (400), IllegalStateException (409), MethodArgumentNotValidException (400), and generic Exception (500)
- Validation errors returned with field-level details via `ValidationErrorResponse`

### 3. Repository Pattern
- Domain layer defines repository interfaces
- Infrastructure layer provides JPA implementations
- Keeps domain layer framework-agnostic

### 4. Transaction Management
- Handlers marked with `@Transactional`
- Read operations use `@Transactional(readOnly = true)`
- Commands use full transaction support

### 5. Input Validation
- Jakarta Bean Validation annotations on all DTOs
- Field-level validation: `@NotBlank`, `@NotNull`, `@Email`, `@Positive`, `@NotEmpty`
- Class-level validation: `@AssertTrue` for complex business rules (e.g., date ranges)
- Nested object validation: `@Valid` annotation for collections and nested DTOs
- All controllers use `@Valid` annotation on request bodies
- Validation errors automatically handled by `GlobalExceptionHandler`

## Frontend Architecture (MVVM)

**Location**: `frontend/src/`

**Structure**:
- **Models**: TypeScript types/interfaces (`types/`)
- **Views**: React components (`components/`, `app/`)
- **ViewModels**: Custom hooks (`viewmodels/`)
- **Services**: API communication layer (`services/`)

**Pattern**: ViewModels mediate between Views and Services, handling presentation logic and state management.

