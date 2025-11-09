# InvoiceMe - Complete Task List & PR Breakdown

## Project Overview
Full-stack ERP invoicing system using:
- **Backend**: Java Spring Boot (RESTful APIs)
- **Frontend**: TypeScript with React.js/Next.js (MVVM)
- **Database**: PostgreSQL (via Docker)
- **Architecture**: DDD + CQRS + Vertical Slice Architecture
- **Deployment**: AWS (final step)

---

## Project File Structure

```
invoiceme/
├── backend/                              # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/invoiceme/
│   │   │   │   ├── InvoiceMeApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   └── JpaConfig.java
│   │   │   │   ├── domain/                    # Domain Layer (DDD)
│   │   │   │   │   ├── customer/
│   │   │   │   │   │   ├── Customer.java
│   │   │   │   │   │   ├── CustomerId.java
│   │   │   │   │   │   └── CustomerRepository.java
│   │   │   │   │   ├── invoice/
│   │   │   │   │   │   ├── Invoice.java
│   │   │   │   │   │   ├── InvoiceId.java
│   │   │   │   │   │   ├── InvoiceStatus.java
│   │   │   │   │   │   ├── LineItem.java
│   │   │   │   │   │   └── InvoiceRepository.java
│   │   │   │   │   ├── payment/
│   │   │   │   │   │   ├── Payment.java
│   │   │   │   │   │   ├── PaymentId.java
│   │   │   │   │   │   └── PaymentRepository.java
│   │   │   │   │   └── shared/
│   │   │   │   │       ├── Money.java
│   │   │   │   │       ├── Email.java
│   │   │   │   │       └── Address.java
│   │   │   │   ├── features/                  # Vertical Slices
│   │   │   │   │   ├── customers/
│   │   │   │   │   │   ├── createCustomer/
│   │   │   │   │   │   │   ├── CreateCustomerCommand.java
│   │   │   │   │   │   │   ├── CreateCustomerHandler.java
│   │   │   │   │   │   │   ├── CreateCustomerController.java
│   │   │   │   │   │   │   └── CreateCustomerDto.java
│   │   │   │   │   │   ├── updateCustomer/
│   │   │   │   │   │   │   ├── UpdateCustomerCommand.java
│   │   │   │   │   │   │   ├── UpdateCustomerHandler.java
│   │   │   │   │   │   │   ├── UpdateCustomerController.java
│   │   │   │   │   │   │   └── UpdateCustomerDto.java
│   │   │   │   │   │   ├── deleteCustomer/
│   │   │   │   │   │   │   ├── DeleteCustomerCommand.java
│   │   │   │   │   │   │   ├── DeleteCustomerHandler.java
│   │   │   │   │   │   │   └── DeleteCustomerController.java
│   │   │   │   │   │   ├── getCustomer/
│   │   │   │   │   │   │   ├── GetCustomerQuery.java
│   │   │   │   │   │   │   ├── GetCustomerHandler.java
│   │   │   │   │   │   │   ├── GetCustomerController.java
│   │   │   │   │   │   │   └── CustomerDto.java
│   │   │   │   │   │   └── listCustomers/
│   │   │   │   │   │       ├── ListCustomersQuery.java
│   │   │   │   │   │       ├── ListCustomersHandler.java
│   │   │   │   │   │       └── ListCustomersController.java
│   │   │   │   │   ├── invoices/
│   │   │   │   │   │   ├── createInvoice/
│   │   │   │   │   │   │   ├── CreateInvoiceCommand.java
│   │   │   │   │   │   │   ├── CreateInvoiceHandler.java
│   │   │   │   │   │   │   ├── CreateInvoiceController.java
│   │   │   │   │   │   │   └── CreateInvoiceDto.java
│   │   │   │   │   │   ├── updateInvoice/
│   │   │   │   │   │   │   ├── UpdateInvoiceCommand.java
│   │   │   │   │   │   │   ├── UpdateInvoiceHandler.java
│   │   │   │   │   │   │   ├── UpdateInvoiceController.java
│   │   │   │   │   │   │   └── UpdateInvoiceDto.java
│   │   │   │   │   │   ├── markInvoiceAsSent/
│   │   │   │   │   │   │   ├── MarkInvoiceAsSentCommand.java
│   │   │   │   │   │   │   ├── MarkInvoiceAsSentHandler.java
│   │   │   │   │   │   │   └── MarkInvoiceAsSentController.java
│   │   │   │   │   │   ├── recordPayment/
│   │   │   │   │   │   │   ├── RecordPaymentCommand.java
│   │   │   │   │   │   │   ├── RecordPaymentHandler.java
│   │   │   │   │   │   │   └── RecordPaymentController.java
│   │   │   │   │   │   ├── getInvoice/
│   │   │   │   │   │   │   ├── GetInvoiceQuery.java
│   │   │   │   │   │   │   ├── GetInvoiceHandler.java
│   │   │   │   │   │   │   ├── GetInvoiceController.java
│   │   │   │   │   │   │   └── InvoiceDto.java
│   │   │   │   │   │   └── listInvoices/
│   │   │   │   │   │       ├── ListInvoicesQuery.java
│   │   │   │   │   │       ├── ListInvoicesHandler.java
│   │   │   │   │   │       └── ListInvoicesController.java
│   │   │   │   │   └── payments/
│   │   │   │   │       ├── getPayment/
│   │   │   │   │       │   ├── GetPaymentQuery.java
│   │   │   │   │       │   ├── GetPaymentHandler.java
│   │   │   │   │       │   └── GetPaymentController.java
│   │   │   │   │       └── listPaymentsForInvoice/
│   │   │   │   │           ├── ListPaymentsForInvoiceQuery.java
│   │   │   │   │           ├── ListPaymentsForInvoiceHandler.java
│   │   │   │   │           └── ListPaymentsForInvoiceController.java
│   │   │   │   ├── infrastructure/
│   │   │   │   │   ├── persistence/
│   │   │   │   │   │   ├── JpaCustomerRepository.java
│   │   │   │   │   │   ├── JpaInvoiceRepository.java
│   │   │   │   │   │   └── JpaPaymentRepository.java
│   │   │   │   │   └── security/
│   │   │   │   │       ├── UserEntity.java
│   │   │   │   │       ├── UserRepository.java
│   │   │   │   │       └── JwtService.java
│   │   │   │   └── shared/
│   │   │   │       ├── exceptions/
│   │   │   │       │   ├── BusinessException.java
│   │   │   │       │   ├── NotFoundException.java
│   │   │   │       │   └── GlobalExceptionHandler.java
│   │   │   │       └── mapper/
│   │   │   │           └── DtoMapper.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-dev.properties
│   │   └── test/
│   │       └── java/com/invoiceme/
│   │           ├── integration/
│   │           │   ├── CustomerFlowIntegrationTest.java
│   │           │   ├── InvoiceFlowIntegrationTest.java
│   │           │   └── PaymentFlowIntegrationTest.java
│   │           └── domain/
│   │               ├── CustomerTest.java
│   │               └── InvoiceTest.java
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                             # React/Next.js Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                  # Dashboard
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── customers/
│   │   │   │   ├── page.tsx              # Customer list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx          # Customer details
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── invoices/
│   │   │   │   ├── page.tsx              # Invoice list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx          # Invoice details
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   └── payments/
│   │   │       └── page.tsx              # Payment list
│   │   ├── components/
│   │   │   ├── ui/                       # Reusable UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   └── Badge.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── customers/
│   │   │   │   ├── CustomerForm.tsx
│   │   │   │   └── CustomerList.tsx
│   │   │   ├── invoices/
│   │   │   │   ├── InvoiceForm.tsx
│   │   │   │   ├── InvoiceList.tsx
│   │   │   │   ├── LineItemForm.tsx
│   │   │   │   └── InvoiceStatusBadge.tsx
│   │   │   └── payments/
│   │   │       ├── PaymentForm.tsx
│   │   │       └── PaymentList.tsx
│   │   ├── viewmodels/                   # MVVM ViewModels
│   │   │   ├── useCustomerViewModel.ts
│   │   │   ├── useInvoiceViewModel.ts
│   │   │   └── usePaymentViewModel.ts
│   │   ├── services/                     # API Service Layer
│   │   │   ├── api.ts                    # Base API config
│   │   │   ├── customerService.ts
│   │   │   ├── invoiceService.ts
│   │   │   ├── paymentService.ts
│   │   │   └── authService.ts
│   │   ├── types/                        # TypeScript types
│   │   │   ├── customer.ts
│   │   │   ├── invoice.ts
│   │   │   └── payment.ts
│   │   └── lib/
│   │       └── utils.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.js
├── docker-compose.yml                    # PostgreSQL + App containers
├── .env.example
├── .gitignore
└── README.md
```

---

## Task List & PR Breakdown

---

### **PR #1: Project Setup & Infrastructure**
**Branch**: `setup/project-initialization`

#### Tasks:
- [ ] Create GitHub repository
  - Files: README.md, .gitignore, LICENSE
- [ ] Initialize Spring Boot backend project
  - Files: pom.xml, InvoiceMeApplication.java, application.properties
- [ ] Initialize Next.js frontend project
  - Files: package.json, tsconfig.json, next.config.js, tailwind.config.js
- [ ] Setup Docker configuration for PostgreSQL
  - Files: docker-compose.yml, .env.example
- [ ] Configure Git ignore files
  - Files: .gitignore (root, backend, frontend)
- [ ] Create project documentation
  - Files: README.md with setup instructions
- [ ] Test Docker PostgreSQL connection
  - Verify: `docker-compose up -d` works

**Files Created/Modified**:
- `/docker-compose.yml`
- `/.env.example`
- `/.gitignore`
- `/README.md`
- `/backend/pom.xml`
- `/backend/src/main/java/com/invoiceme/InvoiceMeApplication.java`
- `/backend/src/main/resources/application.properties`
- `/frontend/package.json`
- `/frontend/tsconfig.json`
- `/frontend/next.config.js`
- `/frontend/tailwind.config.js`

---

### **PR #2: Domain Model - Customer Aggregate (DDD)**
**Branch**: `backend/domain-customer`

#### Tasks:
- [ ] Create Customer domain entity (Aggregate Root)
  - Files: Customer.java
- [ ] Create CustomerId value object
  - Files: CustomerId.java
- [ ] Create Email value object
  - Files: Email.java
- [ ] Create Address value object
  - Files: Address.java
- [ ] Create CustomerRepository interface (Domain layer)
  - Files: CustomerRepository.java
- [ ] Add domain validation logic to Customer
  - Files: Customer.java (update)
- [ ] Write unit tests for Customer domain
  - Files: CustomerTest.java

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/domain/customer/Customer.java`
- `/backend/src/main/java/com/invoiceme/domain/customer/CustomerId.java`
- `/backend/src/main/java/com/invoiceme/domain/customer/CustomerRepository.java`
- `/backend/src/main/java/com/invoiceme/domain/shared/Email.java`
- `/backend/src/main/java/com/invoiceme/domain/shared/Address.java`
- `/backend/src/test/java/com/invoiceme/domain/CustomerTest.java`

---

### **PR #3: Domain Model - Invoice Aggregate (DDD)**
**Branch**: `backend/domain-invoice`

#### Tasks:
- [ ] Create Invoice domain entity (Aggregate Root)
  - Files: Invoice.java
- [ ] Create InvoiceId value object
  - Files: InvoiceId.java
- [ ] Create InvoiceStatus enum (DRAFT, SENT, PAID)
  - Files: InvoiceStatus.java
- [ ] Create LineItem entity
  - Files: LineItem.java
- [ ] Create Money value object
  - Files: Money.java
- [ ] Create InvoiceRepository interface
  - Files: InvoiceRepository.java
- [ ] Implement invoice lifecycle methods (markAsSent, applyPayment)
  - Files: Invoice.java (update)
- [ ] Implement balance calculation logic
  - Files: Invoice.java (update)
- [ ] Write unit tests for Invoice domain
  - Files: InvoiceTest.java

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/domain/invoice/Invoice.java`
- `/backend/src/main/java/com/invoiceme/domain/invoice/InvoiceId.java`
- `/backend/src/main/java/com/invoiceme/domain/invoice/InvoiceStatus.java`
- `/backend/src/main/java/com/invoiceme/domain/invoice/LineItem.java`
- `/backend/src/main/java/com/invoiceme/domain/invoice/InvoiceRepository.java`
- `/backend/src/main/java/com/invoiceme/domain/shared/Money.java`
- `/backend/src/test/java/com/invoiceme/domain/InvoiceTest.java`

---

### **PR #4: Domain Model - Payment Aggregate (DDD)**
**Branch**: `backend/domain-payment`

#### Tasks:
- [ ] Create Payment domain entity
  - Files: Payment.java
- [ ] Create PaymentId value object
  - Files: PaymentId.java
- [ ] Create PaymentRepository interface
  - Files: PaymentRepository.java
- [ ] Add payment validation logic
  - Files: Payment.java (update)

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/domain/payment/Payment.java`
- `/backend/src/main/java/com/invoiceme/domain/payment/PaymentId.java`
- `/backend/src/main/java/com/invoiceme/domain/payment/PaymentRepository.java`

---

### **PR #5: Infrastructure Layer - JPA Repositories**
**Branch**: `backend/infrastructure-persistence`

#### Tasks:
- [ ] Configure JPA settings
  - Files: JpaConfig.java, application.properties
- [ ] Implement JpaCustomerRepository
  - Files: JpaCustomerRepository.java
- [ ] Implement JpaInvoiceRepository
  - Files: JpaInvoiceRepository.java
- [ ] Implement JpaPaymentRepository
  - Files: JpaPaymentRepository.java
- [ ] Add JPA annotations to domain entities
  - Files: Customer.java, Invoice.java, Payment.java, LineItem.java (update)
- [ ] Create database migration scripts (if using Flyway/Liquibase)
  - Files: V1__create_tables.sql
- [ ] Test repository connections with Docker PostgreSQL
  - Verify: Database tables created

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/config/JpaConfig.java`
- `/backend/src/main/java/com/invoiceme/infrastructure/persistence/JpaCustomerRepository.java`
- `/backend/src/main/java/com/invoiceme/infrastructure/persistence/JpaInvoiceRepository.java`
- `/backend/src/main/java/com/invoiceme/infrastructure/persistence/JpaPaymentRepository.java`
- `/backend/src/main/resources/application.properties` (update)
- `/backend/src/main/java/com/invoiceme/domain/customer/Customer.java` (update with JPA)
- `/backend/src/main/java/com/invoiceme/domain/invoice/Invoice.java` (update with JPA)
- `/backend/src/main/java/com/invoiceme/domain/payment/Payment.java` (update with JPA)

---

### **PR #6: Vertical Slice - Create Customer (CQRS Command)**
**Branch**: `backend/feature-create-customer`

#### Tasks:
- [ ] Create CreateCustomerCommand
  - Files: CreateCustomerCommand.java
- [ ] Create CreateCustomerHandler
  - Files: CreateCustomerHandler.java
- [ ] Create CreateCustomerDto
  - Files: CreateCustomerDto.java
- [ ] Create CreateCustomerController
  - Files: CreateCustomerController.java
- [ ] Add DTO mapper utility
  - Files: DtoMapper.java
- [ ] Test endpoint with Postman/curl
  - Verify: POST /api/customers creates customer

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/features/customers/createCustomer/CreateCustomerCommand.java`
- `/backend/src/main/java/com/invoiceme/features/customers/createCustomer/CreateCustomerHandler.java`
- `/backend/src/main/java/com/invoiceme/features/customers/createCustomer/CreateCustomerDto.java`
- `/backend/src/main/java/com/invoiceme/features/customers/createCustomer/CreateCustomerController.java`
- `/backend/src/main/java/com/invoiceme/shared/mapper/DtoMapper.java`

---

### **PR #7: Vertical Slice - Get & List Customer (CQRS Query)**
**Branch**: `backend/feature-query-customer`

#### Tasks:
- [ ] Create GetCustomerQuery
  - Files: GetCustomerQuery.java
- [ ] Create GetCustomerHandler
  - Files: GetCustomerHandler.java
- [ ] Create CustomerDto (read model)
  - Files: CustomerDto.java
- [ ] Create GetCustomerController
  - Files: GetCustomerController.java
- [ ] Create ListCustomersQuery
  - Files: ListCustomersQuery.java
- [ ] Create ListCustomersHandler
  - Files: ListCustomersHandler.java
- [ ] Create ListCustomersController
  - Files: ListCustomersController.java
- [ ] Test endpoints
  - Verify: GET /api/customers/{id} and GET /api/customers

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/features/customers/getCustomer/GetCustomerQuery.java`
- `/backend/src/main/java/com/invoiceme/features/customers/getCustomer/GetCustomerHandler.java`
- `/backend/src/main/java/com/invoiceme/features/customers/getCustomer/CustomerDto.java`
- `/backend/src/main/java/com/invoiceme/features/customers/getCustomer/GetCustomerController.java`
- `/backend/src/main/java/com/invoiceme/features/customers/listCustomers/ListCustomersQuery.java`
- `/backend/src/main/java/com/invoiceme/features/customers/listCustomers/ListCustomersHandler.java`
- `/backend/src/main/java/com/invoiceme/features/customers/listCustomers/ListCustomersController.java`

---

### **PR #8: Vertical Slice - Update & Delete Customer (CQRS Command)**
**Branch**: `backend/feature-update-delete-customer`

#### Tasks:
- [ ] Create UpdateCustomerCommand
  - Files: UpdateCustomerCommand.java
- [ ] Create UpdateCustomerHandler
  - Files: UpdateCustomerHandler.java
- [ ] Create UpdateCustomerDto
  - Files: UpdateCustomerDto.java
- [ ] Create UpdateCustomerController
  - Files: UpdateCustomerController.java
- [ ] Create DeleteCustomerCommand
  - Files: DeleteCustomerCommand.java
- [ ] Create DeleteCustomerHandler (with validation for active invoices)
  - Files: DeleteCustomerHandler.java
- [ ] Create DeleteCustomerController
  - Files: DeleteCustomerController.java
- [ ] Test endpoints
  - Verify: PUT /api/customers/{id} and DELETE /api/customers/{id}

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/features/customers/updateCustomer/UpdateCustomerCommand.java`
- `/backend/src/main/java/com/invoiceme/features/customers/updateCustomer/UpdateCustomerHandler.java`
- `/backend/src/main/java/com/invoiceme/features/customers/updateCustomer/UpdateCustomerDto.java`
- `/backend/src/main/java/com/invoiceme/features/customers/updateCustomer/UpdateCustomerController.java`
- `/backend/src/main/java/com/invoiceme/features/customers/deleteCustomer/DeleteCustomerCommand.java`
- `/backend/src/main/java/com/invoiceme/features/customers/deleteCustomer/DeleteCustomerHandler.java`
- `/backend/src/main/java/com/invoiceme/features/customers/deleteCustomer/DeleteCustomerController.java`

---

### **PR #9: Vertical Slice - Create Invoice (CQRS Command)**
**Branch**: `backend/feature-create-invoice`

#### Tasks:
- [ ] Create CreateInvoiceCommand
  - Files: CreateInvoiceCommand.java
- [ ] Create CreateInvoiceHandler
  - Files: CreateInvoiceHandler.java
- [ ] Create CreateInvoiceDto (with line items)
  - Files: CreateInvoiceDto.java
- [ ] Create CreateInvoiceController
  - Files: CreateInvoiceController.java
- [ ] Implement line item handling in handler
  - Files: CreateInvoiceHandler.java (update)
- [ ] Test endpoint with multiple line items
  - Verify: POST /api/invoices creates invoice with line items

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/features/invoices/createInvoice/CreateInvoiceCommand.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/createInvoice/CreateInvoiceHandler.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/createInvoice/CreateInvoiceDto.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/createInvoice/CreateInvoiceController.java`

---

### **PR #10: Vertical Slice - Get & List Invoices (CQRS Query)**
**Branch**: `backend/feature-query-invoice`

#### Tasks:
- [ ] Create GetInvoiceQuery
  - Files: GetInvoiceQuery.java
- [ ] Create GetInvoiceHandler
  - Files: GetInvoiceHandler.java
- [ ] Create InvoiceDto (with line items and payments)
  - Files: InvoiceDto.java
- [ ] Create GetInvoiceController
  - Files: GetInvoiceController.java
- [ ] Create ListInvoicesQuery (with filters for status/customer)
  - Files: ListInvoicesQuery.java
- [ ] Create ListInvoicesHandler
  - Files: ListInvoicesHandler.java
- [ ] Create ListInvoicesController
  - Files: ListInvoicesController.java
- [ ] Test endpoints
  - Verify: GET /api/invoices/{id} and GET /api/invoices?status=SENT

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/features/invoices/getInvoice/GetInvoiceQuery.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/getInvoice/GetInvoiceHandler.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/getInvoice/InvoiceDto.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/getInvoice/GetInvoiceController.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/listInvoices/ListInvoicesQuery.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/listInvoices/ListInvoicesHandler.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/listInvoices/ListInvoicesController.java`

---

### **PR #11: Vertical Slice - Update Invoice & Mark as Sent (CQRS Command)**
**Branch**: `backend/feature-update-invoice`

#### Tasks:
- [ ] Create UpdateInvoiceCommand (only for DRAFT status)
  - Files: UpdateInvoiceCommand.java
- [ ] Create UpdateInvoiceHandler with validation
  - Files: UpdateInvoiceHandler.java
- [ ] Create UpdateInvoiceDto
  - Files: UpdateInvoiceDto.java
- [ ] Create UpdateInvoiceController
  - Files: UpdateInvoiceController.java
- [ ] Create MarkInvoiceAsSentCommand
  - Files: MarkInvoiceAsSentCommand.java
- [ ] Create MarkInvoiceAsSentHandler with state machine logic
  - Files: MarkInvoiceAsSentHandler.java
- [ ] Create MarkInvoiceAsSentController
  - Files: MarkInvoiceAsSentController.java
- [ ] Test endpoints
  - Verify: PUT /api/invoices/{id} and POST /api/invoices/{id}/send

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/features/invoices/updateInvoice/UpdateInvoiceCommand.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/updateInvoice/UpdateInvoiceHandler.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/updateInvoice/UpdateInvoiceDto.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/updateInvoice/UpdateInvoiceController.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/markInvoiceAsSent/MarkInvoiceAsSentCommand.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/markInvoiceAsSent/MarkInvoiceAsSentHandler.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/markInvoiceAsSent/MarkInvoiceAsSentController.java`

---

### **PR #12: Vertical Slice - Record Payment (CQRS Command)**
**Branch**: `backend/feature-record-payment`

#### Tasks:
- [ ] Create RecordPaymentCommand
  - Files: RecordPaymentCommand.java
- [ ] Create RecordPaymentHandler with balance calculation
  - Files: RecordPaymentHandler.java
- [ ] Create RecordPaymentController
  - Files: RecordPaymentController.java
- [ ] Implement automatic status change to PAID when balance = 0
  - Files: RecordPaymentHandler.java (update)
- [ ] Add validation: payment amount <= balance
  - Files: RecordPaymentHandler.java (update)
- [ ] Test endpoint
  - Verify: POST /api/invoices/{id}/payments

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/features/invoices/recordPayment/RecordPaymentCommand.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/recordPayment/RecordPaymentHandler.java`
- `/backend/src/main/java/com/invoiceme/features/invoices/recordPayment/RecordPaymentController.java`

---

### **PR #13: Vertical Slice - Payment Queries (CQRS Query)**
**Branch**: `backend/feature-query-payment`

#### Tasks:
- [ ] Create GetPaymentQuery
  - Files: GetPaymentQuery.java
- [ ] Create GetPaymentHandler
  - Files: GetPaymentHandler.java
- [ ] Create GetPaymentController
  - Files: GetPaymentController.java
- [ ] Create ListPaymentsForInvoiceQuery
  - Files: ListPaymentsForInvoiceQuery.java
- [ ] Create ListPaymentsForInvoiceHandler
  - Files: ListPaymentsForInvoiceHandler.java
- [ ] Create ListPaymentsForInvoiceController
  - Files: ListPaymentsForInvoiceController.java
- [ ] Test endpoints
  - Verify: GET /api/payments/{id} and GET /api/invoices/{id}/payments

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/features/payments/getPayment/GetPaymentQuery.java`
- `/backend/src/main/java/com/invoiceme/features/payments/getPayment/GetPaymentHandler.java`
- `/backend/src/main/java/com/invoiceme/features/payments/getPayment/GetPaymentController.java`
- `/backend/src/main/java/com/invoiceme/features/payments/listPaymentsForInvoice/ListPaymentsForInvoiceQuery.java`
- `/backend/src/main/java/com/invoiceme/features/payments/listPaymentsForInvoice/ListPaymentsForInvoiceHandler.java`
- `/backend/src/main/java/com/invoiceme/features/payments/listPaymentsForInvoice/ListPaymentsForInvoiceController.java`

---

### **PR #14: Exception Handling & Validation**
**Branch**: `backend/error-handling`

#### Tasks:
- [ ] Create custom exception classes
  - Files: BusinessException.java, NotFoundException.java
- [ ] Create GlobalExceptionHandler
  - Files: GlobalExceptionHandler.java
- [ ] Add validation annotations to DTOs
  - Files: Update all DTO files
- [ ] Add error response DTOs
  - Files: ErrorResponse.java
- [ ] Test error scenarios
  - Verify: Proper error messages returned

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/shared/exceptions/BusinessException.java`
- `/backend/src/main/java/com/invoiceme/shared/exceptions/NotFoundException.java`
- `/backend/src/main/java/com/invoiceme/shared/exceptions/GlobalExceptionHandler.java`
- `/backend/src/main/java/com/invoiceme/shared/exceptions/ErrorResponse.java`
- All DTO files (add @Valid, @NotNull, @NotBlank, etc.)

---

### **PR #15: Authentication & Security**
**Branch**: `backend/authentication`

#### Tasks:
- [ ] Create UserEntity and UserRepository
  - Files: UserEntity.java, UserRepository.java
- [ ] Create JwtService for token generation
  - Files: JwtService.java
- [ ] Create SecurityConfig with JWT filter
  - Files: SecurityConfig.java
- [ ] Create login endpoint
  - Files: LoginController.java, LoginDto.java
- [ ] Add password encryption (BCrypt)
  - Files: SecurityConfig.java (update)
- [ ] Create CORS configuration
  - Files: CorsConfig.java
- [ ] Test authentication flow
  - Verify: Login returns JWT, protected endpoints require token

**Files Created/Modified**:
- `/backend/src/main/java/com/invoiceme/infrastructure/security/UserEntity.java`
- `/backend/src/main/java/com/invoiceme/infrastructure/security/UserRepository.java`
- `/backend/src/main/java/com/invoiceme/infrastructure/security/JwtService.java`
- `/backend/src/main/java/com/invoiceme/config/SecurityConfig.java`
- `/backend/src/main/java/com/invoiceme/config/CorsConfig.java`
- `/backend/src/main/java/com/invoiceme/features/auth/LoginController.java`
- `/backend/src/main/java/com/invoiceme/features/auth/LoginDto.java`

---

### **PR #16: Integration Tests**
**Branch**: `backend/integration-tests`

#### Tasks:
- [ ] Setup test configuration
  - Files: application-test.properties
- [ ] Create CustomerFlowIntegrationTest
  - Files: CustomerFlowIntegrationTest.java
  - Test: Create → Get → Update → Delete customer
- [ ] Create InvoiceFlowIntegrationTest
  - Files: InvoiceFlowIntegrationTest.java
  - Test: Create customer → Create invoice → Add line items → Mark as sent
- [ ] Create PaymentFlowIntegrationTest
  - Files: PaymentFlowIntegrationTest.java
  - Test: Create invoice → Record partial payment → Record final payment → Verify PAID status
- [ ] Verify all tests pass
  - Run: `mvn test`

**Files Created/Modified**:
- `/backend/src/test/resources/application-test.properties`
- `/backend/src/test/java/com/invoiceme/integration/CustomerFlowIntegrationTest.java`
- `/backend/src/test/java/com/invoiceme/integration/InvoiceFlowIntegrationTest.java`
- `/backend/src/test/java/com/invoiceme/integration/PaymentFlowIntegrationTest.java`

---

### **PR #17: Frontend Setup & Configuration**
**Branch**: `frontend/setup`

#### Tasks:
- [ ] Configure Tailwind CSS
  - Files: tailwind.config.js
- [ ] Setup TypeScript strict mode
  - Files: tsconfig.json (update)
- [ ] Create base layout components
  - Files: Layout.tsx, Header.tsx, Sidebar.tsx
- [ ] Setup routing structure
  - Files: app/layout.tsx, app/page.tsx
- [ ] Create environment variables
  - Files: .env.local.example
- [ ] Test development server starts
  - Verify: `npm run dev` works

**Files Created/Modified**:
- `/frontend/tailwind.config.js` (update)
- `/frontend/tsconfig.json` (update)
- `/frontend/src/components/layout/Layout.tsx`
- `/frontend/src/components/layout/Header.tsx`
- `/frontend/src/components/layout/Sidebar.tsx`
- `/frontend/src/app/layout.tsx`
- `/frontend/src/app/page.tsx`
- `/frontend/.env.local.example`

---

### **PR #18: Frontend Types & API Service Layer**
**Branch**: `frontend/api-services`

#### Tasks:
- [ ] Define TypeScript types for Customer
  - Files: customer.ts
- [ ] Define TypeScript types for Invoice
  - Files: invoice.ts
- [ ] Define TypeScript types for Payment
  - Files: payment.ts
- [ ] Create base API configuration (axios/fetch)
  - Files: api.ts
- [ ] Create customerService with all CRUD methods
  - Files: customerService.ts
- [ ] Create invoiceService with all methods
  - Files: invoiceService.ts
- [ ] Create paymentService
  - Files: paymentService.ts
- [ ] Create authService (login, logout, token management)
  - Files: authService.ts

**Files Created/Modified**:
- `/frontend/src/types/customer.ts`
- `/frontend/src/types/invoice.ts`
- `/frontend/src/types/payment.ts`
- `/frontend/src/services/api.ts`
- `/frontend/src/services/customerService.ts`
- `/frontend/src/services/invoiceService.ts`
- `/frontend/src/services/paymentService.ts`
- `/frontend/src/services/authService.ts`

---

### **PR #19: Frontend UI Components Library**
**Branch**: `frontend/ui-components`

#### Tasks:
- [ ] Create Button component
  - Files: Button.tsx
- [ ] Create Input component
  - Files: Input.tsx
- [ ] Create Card component
  - Files: Card.tsx
- [ ] Create Table component
  - Files: Table.tsx
- [ ] Create Badge component (for invoice status)
  - Files: Badge.tsx
- [ ] Create Modal component
  - Files: Modal.tsx
- [ ] Create Loading spinner component
  - Files: Spinner.tsx
- [ ] Test all components in Storybook or demo page

**Files Created/Modified**:
- `/frontend/src/components/ui/Button.tsx`
- `/frontend/src/components/ui/Input.tsx`
- `/frontend/src/components/ui/Card.tsx`
- `/frontend/src/components/ui/Table.tsx`
- `/frontend/src/components/ui/Badge.tsx`
- `/frontend/src/components/ui/Modal.tsx`
- `/frontend/src/components/ui/Spinner.tsx`

---

### **PR #20: Frontend Login & Authentication**
**Branch**: `frontend/authentication`

#### Tasks:
- [ ] Create login page UI
  - Files: app/login/page.tsx
- [ ] Create auth ViewModel (MVVM)
  - Files: useAuthViewModel.ts
- [ ] Implement login form with validation
  - Files: app/login/page.tsx (update)
- [ ] Store JWT token in localStorage/cookie
  - Files: authService.ts (update)
- [ ] Create protected route wrapper
  - Files: components/auth/ProtectedRoute.tsx
- [ ] Add authentication context
  - Files: contexts/AuthContext.tsx
- [ ] Test login flow
  - Verify: Login redirects to dashboard, logout clears token

**Files Created/Modified**:
- `/frontend/src/app/login/page.tsx`
- `/frontend/src/viewmodels/useAuthViewModel.ts`
- `/frontend/src/components/auth/ProtectedRoute.tsx`
- `/frontend/src/contexts/AuthContext.tsx`
- `/frontend/src/services/authService.ts` (update)

---

### **PR #21: Frontend Dashboard Page**
**Branch**: `frontend/dashboard`

#### Tasks:
- [ ] Create dashboard layout
  - Files: app/page.tsx (update)
- [ ] Create dashboard ViewModel
  - Files: useDashboardViewModel.ts
- [ ] Display customer count card
  - Files: app/page.tsx (update)
- [ ] Display invoice count card
  - Files: app/page.tsx (update)
- [ ] Display payment summary card
  - Files: app/page.tsx (update)
- [ ] Add recent activity list
  - Files: app/page.tsx (update)
- [ ] Test dashboard loads data from API

**Files Created/Modified**:
- `/frontend/src/app/page.tsx` (update)
- `/frontend/src/viewmodels/useDashboardViewModel.ts`

---

### **PR #22: Frontend Customer Management - List & Create**
**Branch**: `frontend/customer-list-create`

#### Tasks:
- [ ] Create customer list page
  - Files: app/customers/page.tsx
- [ ] Create customer ViewModel (MVVM)
  - Files: useCustomerViewModel.ts
- [ ] Create CustomerList component
  - Files: components/customers/CustomerList.tsx
- [ ] Create customer create page
  - Files: app/customers/new/page.tsx
- [ ] Create CustomerForm component
  - Files: components/customers/CustomerForm.tsx
- [ ] Add form validation
  - Files: CustomerForm.tsx (update)
- [ ] Test create and list functionality

**Files Created/Modified**:
- `/frontend/src/app/customers/page.tsx`
- `/frontend/src/app/customers/new/page.tsx`
- `/frontend/src/viewmodels/useCustomerViewModel.ts`
- `/frontend/src/components/customers/CustomerList.tsx`
- `/frontend/src/components/customers/CustomerForm.tsx`

---

### **PR #23: Frontend Customer Management - Details & Edit**
**Branch**: `frontend/customer-details-edit`

#### Tasks:
- [ ] Create customer details page
  - Files: app/customers/[id]/page.tsx
- [ ] Display customer information
  - Files: app/customers/[id]/page.tsx (update)
- [ ] Display invoices for customer
  - Files: app/customers/[id]/page.tsx (update)
- [ ] Create customer edit page
  - Files: app/customers/[id]/edit/page.tsx
- [ ] Add delete customer functionality
  - Files: app/customers/[id]/page.tsx (update)
- [ ] Test edit and delete functionality

**Files Created/Modified**:
- `/frontend/src/app/customers/[id]/page.tsx`
- `/frontend/src/app/customers/[id]/edit/page.tsx`
- `/frontend/src/viewmodels/useCustomerViewModel.ts` (update)

---

### **PR #24: Frontend Invoice Management - List & Create**
**Branch**: `frontend/invoice-list-create`

#### Tasks:
- [ ] Create invoice list page with status filter
  - Files: app/invoices/page.tsx
- [ ] Create invoice ViewModel (MVVM)
  - Files: useInvoiceViewModel.ts
- [ ] Create InvoiceList component
  - Files: components/invoices/InvoiceList.tsx
- [ ] Create invoice status badge component
  - Files: components/invoices/InvoiceStatusBadge.tsx
- [ ] Create invoice create page
  - Files: app/invoices/new/page.tsx
- [ ] Create InvoiceForm component with customer dropdown
  - Files: components/invoices/InvoiceForm.tsx
- [ ] Create LineItemForm component (dynamic add/remove)
  - Files: components/invoices/LineItemForm.tsx
- [ ] Add automatic total calculation
  - Files: InvoiceForm.tsx (update)
- [ ] Test create invoice with line items

**Files Created/Modified**:
- `/frontend/src/app/invoices/page.tsx`
- `/frontend/src/app/invoices/new/page.tsx`
- `/frontend/src/viewmodels/useInvoiceViewModel.ts`
- `/frontend/src/components/invoices/InvoiceList.tsx`
- `/frontend/src/components/invoices/InvoiceForm.tsx`
- `/frontend/src/components/invoices/LineItemForm.tsx`
- `/frontend/src/components/invoices/InvoiceStatusBadge.tsx`

---

### **PR #25: Frontend Invoice Management - Details & Actions**
**Branch**: `frontend/invoice-details`

#### Tasks:
- [ ] Create invoice details page
  - Files: app/invoices/[id]/page.tsx
- [ ] Display invoice header (customer, status, dates)
  - Files: app/invoices/[id]/page.tsx (update)
- [ ] Display line items table
  - Files: app/invoices/[id]/page.tsx (update)
- [ ] Display payments history
  - Files: app/invoices/[id]/page.tsx (update)
- [ ] Display current balance
  - Files: app/invoices/[id]/page.tsx (update)
- [ ] Add "Mark as Sent" button (only for DRAFT)
  - Files: app/invoices/[id]/page.tsx (update)
- [ ] Add "Record Payment" button (only for SENT)
  - Files: app/invoices/[id]/page.tsx (update)
- [ ] Test invoice details page loads correctly

**Files Created/Modified**:
- `/frontend/src/app/invoices/[id]/page.tsx`
- `/frontend/src/viewmodels/useInvoiceViewModel.ts` (update)

---

### **PR #26: Frontend Invoice Management - Edit**
**Branch**: `frontend/invoice-edit`

#### Tasks:
- [ ] Create invoice edit page (only for DRAFT)
  - Files: app/invoices/[id]/edit/page.tsx
- [ ] Reuse InvoiceForm component with pre-filled data
  - Files: components/invoices/InvoiceForm.tsx (update)
- [ ] Add validation to prevent editing SENT/PAID invoices
  - Files: app/invoices/[id]/edit/page.tsx (update)
- [ ] Test edit functionality

**Files Created/Modified**:
- `/frontend/src/app/invoices/[id]/edit/page.tsx`
- `/frontend/src/components/invoices/InvoiceForm.tsx` (update)

---

### **PR #27: Frontend Payment Recording**
**Branch**: `frontend/payment-recording`

#### Tasks:
- [ ] Create payment ViewModel (MVVM)
  - Files: usePaymentViewModel.ts
- [ ] Create PaymentForm component
  - Files: components/payments/PaymentForm.tsx
- [ ] Add payment modal to invoice details page
  - Files: app/invoices/[id]/page.tsx (update)
- [ ] Add validation: amount <= balance
  - Files: PaymentForm.tsx (update)
- [ ] Add automatic balance update on payment success
  - Files: useInvoiceViewModel.ts (update)
- [ ] Test payment recording flow

**Files Created/Modified**:
- `/frontend/src/viewmodels/usePaymentViewModel.ts`
- `/frontend/src/components/payments/PaymentForm.tsx`
- `/frontend/src/app/invoices/[id]/page.tsx` (update)

---

### **PR #28: Frontend Payment List Page**
**Branch**: `frontend/payment-list`

#### Tasks:
- [ ] Create payment list page
  - Files: app/payments/page.tsx
- [ ] Create PaymentList component
  - Files: components/payments/PaymentList.tsx
- [ ] Display all payments across invoices
  - Files: app/payments/page.tsx (update)
- [ ] Add links to related invoices
  - Files: PaymentList.tsx (update)
- [ ] Test payment list loads correctly

**Files Created/Modified**:
- `/frontend/src/app/payments/page.tsx`
- `/frontend/src/components/payments/PaymentList.tsx`

---

### **PR #29: Frontend Polish & UX Improvements**
**Branch**: `frontend/polish`

#### Tasks:
- [ ] Add loading states to all pages
  - Files: Update all page files
- [ ] Add error handling and toast notifications
  - Files: Create Toast.tsx component, update ViewModels
- [ ] Add confirmation dialogs for delete actions
  - Files: Create ConfirmDialog.tsx component
- [ ] Add smooth transitions and animations
  - Files: Update CSS/Tailwind classes
- [ ] Ensure responsive design (mobile, tablet, desktop)
  - Files: Update all component styles
- [ ] Add empty states for lists
  - Files: Update list components
- [ ] Test UI/UX on different screen sizes

**Files Created/Modified**:
- `/frontend/src/components/ui/Toast.tsx`
- `/frontend/src/components/ui/ConfirmDialog.tsx`
- All page and component files (add loading, error handling)

---

### **PR #30: Performance Optimization**
**Branch**: `backend/performance`

#### Tasks:
- [ ] Add database indexes
  - Files: Migration scripts or JPA annotations
- [ ] Optimize query performance for list endpoints
  - Files: Repository files
- [ ] Add pagination to list endpoints
  - Files: ListCustomersHandler.java, ListInvoicesHandler.java
- [ ] Test API response times (<200ms requirement)
  - Verify: Use JMeter or similar tool
- [ ] Add database connection pooling configuration
  - Files: application.properties

**Files Created/Modified**:
- `/backend/src/main/resources/application.properties` (update)
- `/backend/src/main/java/com/invoiceme/infrastructure/persistence/JpaCustomerRepository.java` (update)
- `/backend/src/main/java/com/invoiceme/infrastructure/persistence/JpaInvoiceRepository.java` (update)
- Handler files for pagination

---

### **PR #31: Documentation & Technical Writeup**
**Branch**: `docs/technical-writeup`

#### Tasks:
- [ ] Create technical writeup document (1-2 pages)
  - Files: docs/TECHNICAL_WRITEUP.md
  - Include: DDD boundaries, CQRS implementation, VSA structure
- [ ] Document database schema with ER diagram
  - Files: docs/DATABASE_SCHEMA.md
- [ ] Document design decisions
  - Files: docs/DESIGN_DECISIONS.md
- [ ] Update main README with setup instructions
  - Files: README.md (update)
- [ ] Create API documentation (Swagger/OpenAPI)
  - Files: Add Swagger annotations, generate swagger.json
- [ ] Document AI tool usage
  - Files: docs/AI_TOOL_USAGE.md

**Files Created/Modified**:
- `/docs/TECHNICAL_WRITEUP.md`
- `/docs/DATABASE_SCHEMA.md`
- `/docs/DESIGN_DECISIONS.md`
- `/docs/AI_TOOL_USAGE.md`
- `/README.md` (update)
- Backend controller files (add Swagger annotations)

---

### **PR #32: End-to-End Testing**
**Branch**: `testing/e2e`

#### Tasks:
- [ ] Setup E2E testing framework (Playwright/Cypress)
  - Files: playwright.config.ts or cypress.config.ts
- [ ] Create E2E test: Complete customer flow
  - Files: e2e/customer-flow.spec.ts
- [ ] Create E2E test: Complete invoice flow with payment
  - Files: e2e/invoice-payment-flow.spec.ts
- [ ] Create E2E test: Authentication flow
  - Files: e2e/auth-flow.spec.ts
- [ ] Verify all E2E tests pass
  - Run: `npm run test:e2e`

**Files Created/Modified**:
- `/frontend/playwright.config.ts` or `cypress.config.ts`
- `/frontend/e2e/customer-flow.spec.ts`
- `/frontend/e2e/invoice-payment-flow.spec.ts`
- `/frontend/e2e/auth-flow.spec.ts`

---

### **PR #33: AWS Deployment Preparation**
**Branch**: `deployment/aws-setup`

#### Tasks:
- [ ] Create Dockerfile for backend
  - Files: backend/Dockerfile
- [ ] Create Dockerfile for frontend
  - Files: frontend/Dockerfile
- [ ] Update docker-compose.yml for production
  - Files: docker-compose.prod.yml
- [ ] Create AWS RDS PostgreSQL configuration
  - Files: docs/AWS_SETUP.md
- [ ] Create AWS EC2 deployment scripts
  - Files: deploy.sh
- [ ] Create environment variables for production
  - Files: .env.production.example
- [ ] Document deployment steps
  - Files: docs/DEPLOYMENT.md

**Files Created/Modified**:
- `/backend/Dockerfile`
- `/frontend/Dockerfile`
- `/docker-compose.prod.yml`
- `/deploy.sh`
- `/.env.production.example`
- `/docs/AWS_SETUP.md`
- `/docs/DEPLOYMENT.md`

---

### **PR #34: AWS Deployment**
**Branch**: `deployment/aws-deploy`

#### Tasks:
- [ ] Setup AWS RDS PostgreSQL instance
  - Document: Connection string in .env
- [ ] Setup AWS EC2 instance
  - Document: Instance details
- [ ] Deploy backend to AWS
  - Verify: API accessible via public URL
- [ ] Deploy frontend to AWS (or Vercel/Netlify)
  - Verify: UI accessible via public URL
- [ ] Configure HTTPS with SSL certificate
  - Files: nginx.conf (if using nginx)
- [ ] Test production deployment
  - Verify: All features work in production
- [ ] Update README with production URLs
  - Files: README.md (update)

**Files Created/Modified**:
- `/nginx.conf` (if applicable)
- `/README.md` (add production URLs)
- AWS console configurations (documented in docs/AWS_SETUP.md)

---
