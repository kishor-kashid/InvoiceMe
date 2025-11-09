# Project Brief: InvoiceMe

## Project Goal

InvoiceMe is a production-quality ERP-style invoicing system designed to demonstrate mastery of modern software architecture principles:
- **Domain-Driven Design (DDD)**
- **Command Query Responsibility Segregation (CQRS)**
- **Vertical Slice Architecture (VSA)**

The project serves as an assessment to prove that AI tools can be used effectively as accelerators while maintaining architectural quality and sound system design.

## Core Requirements

### Business Domains
The system manages three core business domains:
1. **Customer** - Customer information and management
2. **Invoice** - Invoice creation, lifecycle management, and line items
3. **Payment** - Payment recording and balance tracking

### Functional Requirements

#### Customer Operations
- **Commands**: Create, Update, Delete Customer
- **Queries**: Retrieve Customer by ID, List all Customers

#### Invoice Operations
- **Commands**: Create (Draft), Update, Mark as Sent, Record Payment
- **Queries**: Retrieve Invoice by ID, List Invoices by Status/Customer
- **Lifecycle**: Draft → Sent → Paid
- **Line Items**: Each invoice must support multiple line items

#### Payment Operations
- **Commands**: Record Payment (applies to Invoice)
- **Queries**: Retrieve Payment by ID, List Payments for an Invoice

### Non-Functional Requirements
- API response times under 200ms for standard CRUD operations
- Production-quality code with proper documentation
- Integration tests for complete workflows
- Deployment to AWS or Azure

## Success Criteria

✅ **Architecture**: Clear implementation of DDD, CQRS, and VSA patterns  
✅ **Functionality**: All CRUD operations working with proper invoice lifecycle  
✅ **Code Quality**: Modular, documented, with DTOs at boundaries  
✅ **Performance**: API responses under 200ms  
✅ **Testing**: Passing integration tests for complete workflows  
✅ **Deployment**: Application deployed to AWS/Azure  

## Project Scope

This is a full-stack application with:
- **Backend**: Java Spring Boot RESTful APIs
- **Frontend**: TypeScript with React.js/Next.js (MVVM pattern)
- **Database**: PostgreSQL (via Docker for development)
- **Authentication**: JWT-based authentication (planned for PR15)

## Time Constraint

Recommended completion time: 5-7 days

