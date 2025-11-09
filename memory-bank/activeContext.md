# Active Context: InvoiceMe

## Current Work Focus

**Status**: Backend fully complete (PRs 1-16). Frontend fully complete (PR17-29). Performance optimization complete (PR30). All 52 backend tests passing. Application has complete API integration, authentication with JWT, interactive dashboard, full CRUD operations for customers/invoices/payments, toast notifications, loading skeletons, smooth animations, database indexes, pagination support, and optimized connection pooling. Ready for documentation (PR31) and deployment (PR32+).

**Last Completed**: 
- PR1: Project setup and infrastructure (Docker, Maven, Next.js)
- PR2-PR5: Domain layer (Customer, Invoice, Payment aggregates with value objects)
- PR6-PR10: Customer API endpoints (CRUD operations)
- PR11-PR13: Invoice and Payment API endpoints (lifecycle management)
- PR14: Exception handling and validation fully implemented and tested
- PR15: Authentication & Security fully implemented with JWT
- PR16: Integration and authentication tests complete (52 tests passing)
- **PR17: Frontend Setup & Configuration (Tailwind, TypeScript strict mode, Layout components)**
- **PR18: Frontend Types & API Service Layer (TypeScript types, axios, all services)**
- **PR19: Frontend UI Components Library (Button, Input, Card, Table, Badge, Modal, Spinner)**
- **PR20: Frontend Login & Authentication (AuthContext, ProtectedRoute, login page)**
- **PR21: Frontend Dashboard Page (Real-time data, stats, recent activity)**
- **PR22: Frontend Customer Management - List & Create (CustomerList, CustomerForm, useCustomerViewModel, full CRUD UI)**
- **PR23-29: Complete frontend implementation (customer/invoice/payment management, UI polish)**
- **PR30: Performance Optimization (database indexes, pagination, connection pool tuning)**
- API documentation created (`API.md`)
- Security with JWT authentication fully functional
- Professional ERP-quality frontend with complete authentication flow and CRUD operations
- Performance optimized with indexes, pagination, and connection pooling

## Recent Changes

### Completed (PRs 1-13)

1. **Domain Layer (PR2-PR5)**
   - ✅ Customer aggregate with value objects
   - ✅ Invoice aggregate with lifecycle and line items
   - ✅ Payment entity
   - ✅ Shared value objects (Email, Address, Money)
   - ✅ Repository interfaces defined

2. **Infrastructure Layer (PR5)**
   - ✅ JPA repository implementations
   - ✅ JPA configuration
   - ✅ Database connection setup

3. **Application Layer - Customers (PR6-PR10)**
   - ✅ Create Customer (Command)
   - ✅ Get Customer by ID (Query)
   - ✅ List All Customers (Query)
   - ✅ Update Customer (Command)
   - ✅ Delete Customer (Command)

4. **Application Layer - Invoices (PR11-PR12)**
   - ✅ Create Invoice with Line Items (Command)
   - ✅ Get Invoice by ID (Query)
   - ✅ List Invoices with Filters (Query)
   - ✅ Update Invoice - DRAFT only (Command)
   - ✅ Mark Invoice as Sent (Command)
   - ✅ Record Payment (Command)

5. **Application Layer - Payments (PR13)**
   - ✅ Get Payment by ID (Query)
   - ✅ List Payments for Invoice (Query)

6. **Shared Components (PR14)**
   - ✅ Exception handling (BusinessException, NotFoundException)
   - ✅ Global exception handler with comprehensive error handling
   - ✅ Error response DTOs (ErrorResponse, ValidationErrorResponse)
   - ✅ DTO mapper utility
   - ✅ Comprehensive validation on all DTOs
   - ✅ Custom date range validation (due date >= issue date)
   - ✅ Validation test suite (7 test cases, all passing)

7. **Documentation**
   - ✅ API.md created with complete endpoint documentation
   - ✅ README.md updated with API references

### Recent Implementations (PR15)

**Authentication & Security**:
- ✅ UserEntity and UserRepository for user management
- ✅ JwtService for token generation, validation, and parsing (using JJWT 0.12.3)
- ✅ JwtAuthenticationFilter for request authentication
- ✅ UserDetailsServiceImpl for Spring Security integration
- ✅ SecurityConfig with BCrypt password encoding and stateless session management
- ✅ Login endpoint (POST /api/auth/login) with JWT token response
- ✅ DataInitializer creating default admin user (username: admin, password: admin123)
- ✅ JWT configuration in application.properties (24-hour token expiration)
- ✅ JpaConfig updated to scan security repository package
- ✅ CORS integration with existing configuration

**Testing (PR16)**:
- ✅ 8 authentication tests (login, token generation/validation, user roles)
- ✅ 14 integration tests (Customer, Invoice, Payment flows)
- ✅ All 52 tests passing (23 domain + 7 validation + 14 integration + 8 auth)

## Next Steps

### Completed (PR14-PR16)
- ✅ Exception handling fully implemented
- ✅ Validation on all DTOs implemented and enhanced
- ✅ Date range validation added (due date >= issue date)
- ✅ Validation test suite created and passing (7 tests)
- ✅ Build verification successful (clean compile, all tests pass, package builds)
- ✅ UserEntity and UserRepository created
- ✅ JwtService for token generation and validation
- ✅ SecurityConfig with JWT filter and BCrypt
- ✅ Login endpoint implemented
- ✅ Password encryption (BCrypt) implemented
- ✅ CORS configuration integrated
- ✅ Authentication flow fully tested (8 tests)
- ✅ Integration tests complete (14 tests)
- ✅ All 52 tests passing

### Completed (PR17)
- ✅ Tailwind CSS configuration with comprehensive design tokens
- ✅ TypeScript strict mode enabled with all checks
- ✅ Layout components created (Layout, Header, Sidebar)
- ✅ Responsive routing structure implemented (sidebar mobile-only, header desktop)
- ✅ Environment variables documentation created

### Completed (PR18)
- ✅ TypeScript type definitions (Customer, Invoice, Payment, Auth, API types)
- ✅ Base API configuration with axios interceptors (auto token, error handling)
- ✅ Complete API services (customerService, invoiceService, paymentService, authService)
- ✅ Token management (storage, retrieval, removal)

### Completed (PR19)
- ✅ Professional UI component library (7 components)
- ✅ Button component (7 variants, 3 sizes, loading states)
- ✅ Input component (validation, icons, error states)
- ✅ Card component (variants, sub-components)
- ✅ Table component (responsive, striped, hoverable)
- ✅ Badge component (status indicators, InvoiceStatusBadge)
- ✅ Modal component (sizes, ConfirmModal helper)
- ✅ Spinner component (sizes, full-screen mode)

### Completed (PR20)
- ✅ AuthContext and AuthProvider (global auth state)
- ✅ useAuthViewModel (MVVM pattern, form validation)
- ✅ Login page (professional split-screen design)
- ✅ ProtectedRoute wrapper (auto-redirect, role-based access)
- ✅ JWT token management (localStorage, auto-attach to requests)

### Completed (PR21)
- ✅ useDashboardViewModel (fetch data, calculate stats, generate activity)
- ✅ Interactive dashboard with real API data
- ✅ Stats grid (4 clickable cards: Customers, Invoices, Pending, Revenue)
- ✅ Quick actions (4 buttons for common operations)
- ✅ Recent invoices list (last 5 with status badges)
- ✅ Recent activity timeline (payment, sent, customer, invoice events)
- ✅ Loading states, error handling, refresh functionality

### Completed (PR22)
- ✅ useCustomerViewModel (MVVM pattern, CRUD operations, form validation, search/filter)
- ✅ CustomerList component (professional table with View/Edit/Delete actions)
- ✅ CustomerForm component (comprehensive validation, error handling, create/edit modes)
- ✅ Customer list page (/customers) with search, stats, delete confirmation
- ✅ Customer create page (/customers/new) with form validation
- ✅ Full integration with backend API (create, list, update, delete)
- ✅ Type system aligned with backend (zipCode field, flat request structure)
- ✅ Import fixes (centralized UI component imports)
- ✅ Hydration warning suppression (browser extension compatibility)

### Completed (PR23)
- ✅ Customer detail page (/customers/[id]) displaying customer information and associated invoices
- ✅ Customer edit page (/customers/[id]/edit) reusing CustomerForm component
- ✅ Customer deletion functionality integrated
- ✅ Invoice list display on customer detail page with status badges
- ✅ Customer name display and navigation

### Completed (PR24)
- ✅ Invoice list page (/invoices) with status filtering and summary statistics
- ✅ InvoiceList component (professional table with status badges, customer links, balance display)
- ✅ Invoice create page (/invoices/new) with comprehensive form
- ✅ InvoiceForm component with customer dropdown, invoice number, currency, dates, line items, notes
- ✅ LineItemForm component (dynamic add/remove line items with automatic calculations)
- ✅ InvoiceStatusBadge component for status display
- ✅ useInvoiceViewModel (MVVM pattern, CRUD operations, form validation, invoice lifecycle)
- ✅ Automatic total calculation from line items
- ✅ Invoice number generation helper
- ✅ Currency selection (USD, EUR, GBP)
- ✅ Notes field with character count (max 1000 characters)

### Completed (PR25)
- ✅ Invoice detail page (/invoices/[id]) displaying complete invoice information
- ✅ Invoice header (customer name, invoice number, status, dates, totals)
- ✅ Line items table with descriptions, quantities, unit prices, amounts
- ✅ Payments history display
- ✅ Current balance display with color coding (red for positive balance, green for zero)
- ✅ "Mark as Sent" button (only visible for DRAFT invoices)
- ✅ "Record Payment" button and modal (only visible for SENT invoices)
- ✅ Payment amount validation (cannot exceed balance)
- ✅ Customer name fetching and display

### Completed (PR26)
- ✅ Invoice edit page (/invoices/[id]/edit) for DRAFT invoices only
- ✅ InvoiceForm component updated to support edit mode with pre-filled data
- ✅ Validation to prevent editing SENT/PAID invoices
- ✅ Money object handling (extracting amount and currency from backend responses)
- ✅ Line items pre-population from existing invoice data

### Completed (PR27-PR28)
- ✅ usePaymentViewModel (MVVM pattern, payment recording logic, validation)
- ✅ PaymentForm component (reusable form with validation, balance checking, date validation)
- ✅ Payment modal integrated into invoice detail page (refactored for cleaner code)
- ✅ Payment list page (/payments) with summary statistics
- ✅ PaymentList component (professional table with invoice links)
- ✅ Payment navigation in sidebar
- ✅ Full payment management workflow (record, view, track)
- ✅ Client-side validation (amount > 0, amount <= balance, date not in future)
- ✅ Server-side validation error handling
- ✅ Empty state handling
- ✅ Refresh functionality
- ✅ Payment statistics (total payments, total amount, average payment)
- ✅ Payment-to-invoice navigation

### Completed (PR29)
- ✅ Toast notification system (Toast component, ToastContainer, ToastProvider)
- ✅ Global toast context integrated into app layout
- ✅ Success/error/info/warning toast variants with auto-dismiss
- ✅ Toast notifications added to all CRUD operations (customer, invoice, payment)
- ✅ Loading skeleton components (Skeleton, SkeletonText, SkeletonCard, SkeletonTable, SkeletonStats)
- ✅ Smooth animations (fade-in, slide-in, scale-in)
- ✅ Tailwind animation utilities (6 keyframe animations)
- ✅ Improved empty states for table components
- ✅ Modal animations (fade-in overlay, scale-in content)
- ✅ Responsive design verified across all pages
- ✅ Hero Icons library installed for toast icons
- ✅ Logout dropdown in Header component (user menu with logout button)
- ✅ Fixed hydration warning in Input component (suppressHydrationWarning)

### Key Fixes (PR23-PR29)
- ✅ Fixed Money object handling throughout frontend (backend sends `{amount, currency}` objects)
- ✅ Fixed "$NaN" display issues by correctly accessing Money object properties
- ✅ Fixed validation errors when creating invoices (added invoiceNumber, currency, notes fields)
- ✅ Fixed component import issues (Spinner default export, Card component removal)
- ✅ Fixed Next.js Suspense boundaries for useSearchParams
- ✅ Fixed customer name display on invoice detail page
- ✅ Fixed apostrophe escaping in dashboard text
- ✅ Fixed Badge variant types (DRAFT status uses 'gray' variant)
- ✅ Fixed missing backend endpoint: Created `GET /api/payments` endpoint for payment list
- ✅ Fixed LineItem type mismatch: Changed `amount` to `total` to match backend DTO
- ✅ Fixed payment date format: Converting date to LocalDateTime format (`YYYY-MM-DDTHH:mm:ss`)
- ✅ Removed backend API connection status text from dashboard page
- ✅ Fixed hydration warning from browser extensions (suppressHydrationWarning on Input)

### Completed (PR30)
- ✅ Database indexes (11 indexes across Customer, Invoice, Payment entities)
- ✅ Pagination support (backend repositories, handlers, controllers)
- ✅ Frontend pagination types and services (PageResponse, PaginationParams)
- ✅ Connection pool optimization (HikariCP tuning for 20 connections)
- ✅ JPA/Hibernate performance tuning (batch processing, ordered operations)
- ✅ Backward compatible pagination (optional page parameter)
- ✅ All 52 tests still passing after changes

### Upcoming (PR31+)
- [ ] Documentation and technical writeup (PR31)
- [ ] Deployment to AWS/Azure (PR32-34)

## Active Decisions and Considerations

### 1. Security Configuration
**Decision**: Implemented JWT-based stateless authentication
**Rationale**: Provides scalable, production-ready authentication for REST API
**Implementation**: 
  - JWT tokens with 24-hour expiration
  - BCrypt password hashing
  - Stateless session management
  - Public endpoints: `/api/auth/**`, `/actuator/health`
  - All other endpoints require authentication
**Status**: Complete and fully tested

### 2. API Documentation
**Decision**: Created dedicated `API.md` file
**Rationale**: Comprehensive API documentation improves developer experience
**Status**: Complete with all implemented endpoints

### 3. Maven Wrapper
**Decision**: Include Maven Wrapper in project
**Rationale**: Ensures consistent Maven version across all development environments
**Status**: Implemented and working

### 4. Database Schema
**Decision**: Use JPA `ddl-auto=update` for development
**Rationale**: Simplifies development, schema auto-generated from entities
**Future**: Will use `validate` or migrations for production

## Current Blockers

None - All backend features complete and tested.

## Testing Status

- ✅ Domain tests: Customer logic (9 tests)
- ✅ Domain tests: Invoice logic (14 tests)
- ✅ Validation tests: DTO validation (7 tests)
- ✅ Integration tests: Customer, Invoice, Payment flows (14 tests)
- ✅ Authentication tests: Login, JWT, user roles (8 tests)
- ✅ **Total: 52 tests, all passing**
- ✅ Build verification: Clean compile, all tests pass, JAR packaged successfully

## API Status

All backend endpoints implemented, secured, and documented:
- ✅ **Authentication**: Login endpoint with JWT token generation
- ✅ **Customer CRUD**: All operations protected with JWT
- ✅ **Invoice CRUD**: Lifecycle operations protected with JWT
- ✅ **Payment operations**: Query operations protected with JWT
- ✅ **Exception handling**: Comprehensive error responses
- ✅ **Input validation**: Field-level and class-level validation
- ✅ **Date range validation**: Business rule enforcement
- ✅ **Validation error responses**: Detailed field-level error information
- ✅ **Security**: JWT authentication, BCrypt passwords, role-based access

## Known Issues

1. ⚠️ **Default Admin Password**: Default admin user has password `admin123` - must be changed in production
2. ⚠️ **JWT Secret**: JWT secret key in application.properties should be changed for production
3. ⚠️ **User Management**: No user registration or multi-user system - single business owner model (by design)
4. **Next.js Build Cache**: If encountering module resolution errors, clear `.next` directory and restart dev server
5. **Documentation**: Technical writeup and deployment guide pending (PR31+)
6. **Deployment**: Not yet configured (PR32+)

## Development Environment

- **Backend**: Running on `http://localhost:8080`
- **Database**: PostgreSQL via Docker on port 5432
- **Frontend**: Running on `http://localhost:3000` (use `npm run dev`)
- **Testing**: Postman/curl for API testing, Jest for frontend tests (when added)

