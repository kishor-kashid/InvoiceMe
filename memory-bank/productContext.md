# Product Context: InvoiceMe

## Why This Project Exists

InvoiceMe is designed to solve the challenge of building a production-quality ERP invoicing system that demonstrates:
1. **Architectural Mastery**: Proving understanding of DDD, CQRS, and VSA
2. **AI-Assisted Development**: Using AI tools intelligently as accelerators, not primary designers
3. **Enterprise-Level Quality**: Code quality suitable for real SaaS environments

## Problems It Solves

### Business Problems
- **Invoice Management**: Complete lifecycle management from draft to paid
- **Customer Relationship**: Centralized customer information management
- **Payment Tracking**: Accurate balance calculation and payment application
- **Multi-Item Invoicing**: Support for invoices with multiple line items

### Technical Problems
- **Architectural Clarity**: Demonstrating clean separation of concerns
- **Scalability**: Architecture that can grow with business needs
- **Maintainability**: Code organized by features for easy navigation and modification
- **Testability**: Clear boundaries enabling comprehensive testing

## How It Should Work

### User Experience Goals

1. **Customer Management**
   - Users can create, view, update, and delete customers
   - Customer information includes name, email, phone, and address
   - Email validation ensures data integrity

2. **Invoice Creation**
   - Users can create invoices in DRAFT status
   - Invoices can have multiple line items (product/service, quantity, unit price)
   - Total amount calculated automatically from line items

3. **Invoice Lifecycle**
   - Draft invoices can be edited
   - Draft invoices can be marked as SENT
   - Once sent, invoices cannot be edited
   - Payments can be recorded against invoices
   - When balance reaches zero, invoice automatically becomes PAID

4. **Payment Processing**
   - Payments are recorded with amount and date
   - Payments are applied to invoice balance
   - Multiple payments can be made against a single invoice
   - Balance is calculated as: Invoice Total - Sum of Payments

### System Behavior

- **API-First**: All operations exposed via RESTful APIs
- **Stateless**: Each request contains all necessary information
- **Validation**: Input validation at API boundaries
- **Error Handling**: Consistent error responses across all endpoints
- **Performance**: Fast response times (< 200ms for CRUD operations)

## Target Users

- **Business Users**: Need to manage customers, create invoices, and track payments
- **Developers**: Need to understand and maintain the codebase
- **Assessors**: Evaluating architectural and technical skills

## Key Differentiators

1. **Architectural Excellence**: Not just working code, but well-architected code
2. **AI Integration**: Demonstrates effective use of AI tools
3. **Production Ready**: Code quality suitable for enterprise deployment
4. **Comprehensive Testing**: Integration tests covering complete workflows

