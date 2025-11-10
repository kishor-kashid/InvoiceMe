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
- **Security**: JWT authentication and user management
  - `UserEntity` - User domain entity
  - `UserRepository` - JPA repository for users
  - `JwtService` - JWT token generation/validation
  - `JwtAuthenticationFilter` - Request authentication filter
  - `UserDetailsServiceImpl` - Spring Security user details service

### Shared Layer
**Location**: `backend/src/main/java/com/invoiceme/shared/`

**Purpose**: Cross-cutting concerns.

**Components**:
- **Exceptions**: `BusinessException`, `NotFoundException`, `GlobalExceptionHandler`
- **DTOs**: Error response DTOs (`ErrorResponse`, `ValidationErrorResponse`)
- **Mappers**: `DtoMapper` for converting domain entities to DTOs
- **Validation**: Jakarta Bean Validation with custom validators

### Configuration Layer
**Location**: `backend/src/main/java/com/invoiceme/config/`

**Purpose**: Application-wide configuration.

**Components**:
- **SecurityConfig**: JWT authentication, BCrypt password encoder, stateless sessions
- **JpaConfig**: JPA repository scanning (persistence and security packages)
- **CorsConfig**: CORS configuration for frontend integration
- **DataInitializer**: Creates default admin user on startup

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

## Performance Optimization Patterns (PR30)

**Database Indexing**:
- Strategic indexes on frequently queried columns
- Composite indexes for multi-column queries (e.g., customer_id + status)
- Automatic index creation via JPA `@Index` annotations

**Pagination Pattern**:
- Optional pagination: Omit `page` parameter for all results (backward compatible)
- Standard parameters: `page`, `size`, `sortBy`, `direction`
- Backend: Spring Data `Page<T>` and `Pageable`
- Frontend: `PageResponse<T>` with metadata
- Default page size: 20 items

**Connection Pooling** (HikariCP):
- Pool size: 20 max connections, 10 minimum idle
- Connection lifecycle: 30 min max lifetime, 10 min idle timeout
- Leak detection: 2-minute threshold
- Validation: Test query before use

**JPA Optimization**:
- Batch operations: Size 20 for inserts/updates
- Ordered operations: Inserts and updates ordered for efficiency
- Query optimization: Use indexes automatically

## Frontend Architecture (MVVM)

**Location**: `frontend/src/`

**Structure**:
- **Models**: TypeScript types/interfaces (`types/`) - ✅ COMPLETE
  - Customer, Invoice, Payment, Auth types
  - API error and response types
  - Pagination types (PageResponse, PaginationParams)
- **Views**: React components (`components/`, `app/`)
  - Layout components (Header, Sidebar, Layout)
  - UI component library (Button, Input, Card, Table, Badge, Modal, Spinner)
  - Customer components (CustomerList, CustomerForm)
  - Invoice components (InvoiceList, InvoiceForm, LineItemForm, InvoiceStatusBadge)
  - Pages (Login, Dashboard, Customers List/Create/Detail/Edit, Invoices List/Create/Detail/Edit)
- **ViewModels**: Custom hooks (`viewmodels/`) - ✅ IMPLEMENTED
  - useAuthViewModel (authentication logic)
  - useDashboardViewModel (dashboard data and calculations)
  - useCustomerViewModel (customer CRUD, search/filter, form validation)
  - useInvoiceViewModel (invoice CRUD, form validation, invoice lifecycle, payment recording)
- **Services**: API communication layer (`services/`) - ✅ COMPLETE
  - Base API configuration (axios with interceptors)
  - customerService, invoiceService, paymentService, authService

**Pattern**: ViewModels mediate between Views and Services, handling presentation logic and state management.

**Current Status**: Frontend foundation complete with full MVVM implementation. Type system, API services, UI components, authentication, dashboard, customer management, invoice management, and payment management all functional. Customer CRUD complete (PR22-PR23). Invoice CRUD complete (PR24-PR26). Payment management complete (PR27-PR28). Ready for UI polish (PR29+) and deployment (PR30+).

**Key Frontend Patterns**:
- **Money Object Handling**: Backend sends monetary values as `{amount: number, currency: string}` objects. Frontend components correctly extract `.amount` and `.currency` properties for display and calculations. **Exception**: When creating/updating invoices, `unitPrice` is sent as a number (not Money object) to match backend DTO expectations.
- **Form Validation**: Client-side validation in ViewModels with backend error mapping. Validation includes field-level (required, format) and business rules (date ranges, payment amounts).
- **Component Reusability**: CustomerForm and InvoiceForm support both create and edit modes. LineItemForm is reusable for dynamic line item management. PaymentForm is reusable for payment recording.
- **Status Management**: InvoiceStatusBadge component provides consistent status display across all pages. Status-based conditional rendering for actions (Mark as Sent, Record Payment).
- **Suspense Boundaries**: Next.js App Router requires Suspense boundaries for components using `useSearchParams`. Proper placement ensures correct server-side rendering.
- **Date/Time Handling**: Payment dates are converted from HTML date input format (`YYYY-MM-DD`) to LocalDateTime format (`YYYY-MM-DDTHH:mm:ss`) for backend compatibility.
- **Type Safety**: LineItem interface uses `total: Money` instead of `amount: Money` to match backend DTO structure. CreateInvoiceRequest and UpdateInvoiceRequest use `unitPrice: number` (not Money) for API requests.
- **Authentication Flow**: Logout dropdown in Header provides user menu with logout functionality. Integrates with AuthContext for token management and navigation.
- **Hydration Warnings**: Input components use `suppressHydrationWarning` to handle browser extension attributes (password managers, form fillers) without console warnings.

## Deployment Patterns (PR33-PR34)

### AWS Deployment Architecture
- **Backend**: Spring Boot application on EC2 instance (port 8080)
- **Frontend**: Next.js server on EC2 instance (port 3000) - NOT static S3 hosting
- **Database**: AWS RDS PostgreSQL
- **Reason for Server Deployment**: Dynamic routes require server-side rendering (cannot use static export)

### Environment Variable Management
- **Location**: `/etc/invoiceme/environment` (systemd EnvironmentFile)
- **Naming Convention**: Use Spring Boot property names for automatic mapping:
  - `SPRING_DATASOURCE_URL` → `spring.datasource.url`
  - `SPRING_DATASOURCE_USERNAME` → `spring.datasource.username`
  - `SPRING_DATASOURCE_PASSWORD` → `spring.datasource.password`
  - `SPRING_WEB_CORS_ALLOWED_ORIGINS` → `spring.web.cors.allowed-origins`
- **CORS Configuration**: Automatically includes EC2 IP in allowed origins during deployment

### Systemd Service Pattern
- **Backend Service**: `invoiceme-backend.service`
  - Uses `EnvironmentFile=/etc/invoiceme/environment`
  - Runs as dedicated service user (`invoiceme`)
  - Logs to `/opt/invoiceme/logs/`
- **Frontend Service**: `invoiceme-frontend.service`
  - Runs Next.js server (`npm start`)
  - Environment variables for API URL
  - Logs to `/opt/invoiceme/logs/`

### Deployment Scripts Pattern
- **setup-ec2.sh**: One-time EC2 environment setup (OS detection, package installation)
- **deploy-backend.sh**: Backend deployment (git pull, Maven build, JAR deployment, systemd service)
- **deploy-frontend.sh**: Frontend deployment (deprecated for S3, now manual EC2 deployment)

