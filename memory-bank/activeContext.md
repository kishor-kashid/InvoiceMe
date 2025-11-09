# Active Context: InvoiceMe

## Current Work Focus

**Status**: Backend API implementation complete (PRs 1-13), preparing for authentication and frontend development.

**Last Completed**: 
- PR6-PR13: All customer, invoice, and payment API endpoints implemented
- API documentation created (`API.md`)
- Exception handling and validation implemented
- Security configuration temporarily set to allow unauthenticated API access

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

6. **Shared Components**
   - ✅ Exception handling (BusinessException, NotFoundException)
   - ✅ Global exception handler
   - ✅ Error response DTOs
   - ✅ DTO mapper utility
   - ✅ Validation on DTOs

7. **Documentation**
   - ✅ API.md created with complete endpoint documentation
   - ✅ README.md updated with API references

### Current Issue
- **Security**: Spring Security is enabled but not configured, causing login form to appear
- **Temporary Fix**: SecurityConfig created to allow unauthenticated API access (will be replaced in PR15)

## Next Steps

### Immediate (PR14 - Already Partially Complete)
- ✅ Exception handling implemented
- ✅ Validation on DTOs implemented
- ⏳ Additional validation scenarios testing

### Upcoming (PR15)
- [ ] Create UserEntity and UserRepository
- [ ] Create JwtService for token generation
- [ ] Create SecurityConfig with JWT filter
- [ ] Create login endpoint
- [ ] Add password encryption (BCrypt)
- [ ] Create CORS configuration
- [ ] Test authentication flow

### Future (PR16+)
- [ ] Integration tests
- [ ] Frontend implementation
- [ ] Deployment to AWS/Azure

## Active Decisions and Considerations

### 1. Security Configuration
**Decision**: Temporarily allow unauthenticated API access for development/testing
**Rationale**: Authentication is planned for PR15, but API endpoints need to be testable now
**Action**: Created `SecurityConfig.java` that permits all `/api/**` endpoints
**Future**: Will be replaced with proper JWT authentication in PR15

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

None - All implemented features are working.

## Testing Status

- ✅ Unit tests for Customer domain logic
- ✅ Unit tests for Invoice domain logic
- ⏳ Integration tests (planned for PR16)

## API Status

All endpoints implemented and documented:
- ✅ Customer CRUD operations
- ✅ Invoice CRUD and lifecycle operations
- ✅ Payment query operations
- ✅ Exception handling
- ✅ Input validation

## Known Issues

1. **Security**: Temporary security configuration in place (will be replaced in PR15)
2. **Authentication**: Not yet implemented (PR15)
3. **Integration Tests**: Not yet implemented (PR16)
4. **Frontend**: Not yet implemented (PR17+)

## Development Environment

- **Backend**: Running on `http://localhost:8080`
- **Database**: PostgreSQL via Docker on port 5432
- **Frontend**: Not yet started
- **Testing**: Postman/curl for API testing

