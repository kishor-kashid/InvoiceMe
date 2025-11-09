# Design Decisions

This document records the key architectural and technical decisions made during the development of InvoiceMe, along with the rationale behind each choice.

## Table of Contents
1. [Architectural Decisions](#architectural-decisions)
2. [Technology Stack](#technology-stack)
3. [Domain Model Design](#domain-model-design)
4. [API Design](#api-design)
5. [Security](#security)
6. [Performance](#performance)
7. [Frontend Architecture](#frontend-architecture)
8. [Testing Strategy](#testing-strategy)

---

## Architectural Decisions

### 1. Domain-Driven Design (DDD)

**Decision**: Organize the application around business domains with explicit aggregates and value objects.

**Rationale**:
- Business logic is complex enough to warrant domain modeling
- DDD provides clear boundaries between aggregates (Customer, Invoice, Payment)
- Value objects (Email, Money, Address) encapsulate validation logic
- Domain entities are framework-agnostic, improving testability
- Business rules are explicit and maintainable

**Alternatives Considered**:
- **Anemic Domain Model**: Rejected because it would spread business logic across service classes
- **CRUD-based Architecture**: Too simplistic for complex invoice lifecycle management

**Trade-offs**:
- **Pro**: Clear business logic, excellent maintainability
- **Con**: Steeper learning curve for developers unfamiliar with DDD
- **Con**: More boilerplate code than simple CRUD

**Outcome**: Highly successful. Business rules are clear, testable, and centralized in domain entities.

---

### 2. CQRS (Command Query Responsibility Segregation)

**Decision**: Strictly separate read operations (queries) from write operations (commands).

**Rationale**:
- Invoice system has complex read requirements (filtered lists, aggregations)
- Write operations have strict business rules and validation
- Separation allows independent optimization of each path
- Clear separation of concerns improves code readability
- Aligns well with DDD and VSA

**Alternatives Considered**:
- **Traditional Service Layer**: Rejected because it mixes reads and writes
- **Full Event Sourcing**: Overkill for current requirements

**Implementation Details**:
- Commands return minimal data (ID or acknowledgment)
- Queries return optimized DTOs
- Handlers are separate classes for commands vs queries
- No shared logic between command and query paths

**Trade-offs**:
- **Pro**: Independent scaling, clear intent, optimized queries
- **Con**: More code than combined read/write operations
- **Con**: Potential data duplication in DTOs

**Outcome**: Very successful. Code is self-documenting, and optimization paths are clear.

---

### 3. Vertical Slice Architecture (VSA)

**Decision**: Organize code by features (use cases) rather than technical layers.

**Rationale**:
- Each feature is completely independent
- Easy to locate all code for a specific operation
- Reduces coupling between features
- Natural fit for microservices if needed in future
- Better than traditional layered architecture for medium/large applications

**Structure**:
```
features/
├── createCustomer/     # All code for this feature
│   ├── Command
│   ├── Handler
│   ├── Controller
│   └── DTO
```

**Alternatives Considered**:
- **Layered Architecture**: Rejected because it spreads feature code across multiple layers
- **Hexagonal Architecture**: Too complex for current scale

**Trade-offs**:
- **Pro**: Feature cohesion, easy navigation, reduced coupling
- **Pro**: New developers can understand one feature at a time
- **Con**: Shared code needs careful management (placed in `shared/`)
- **Con**: May seem unusual to developers accustomed to layered architecture

**Outcome**: Excellent. Code is easy to find, and features don't interfere with each other.

---

## Technology Stack

### 4. Spring Boot 3.2.0

**Decision**: Use Spring Boot 3.2.0 as the backend framework.

**Rationale**:
- Industry-standard framework with excellent DDD support
- Spring Data JPA reduces repository boilerplate
- Built-in security features (Spring Security)
- Extensive documentation and community support
- Native support for REST APIs
- Excellent testing support

**Alternatives Considered**:
- **Quarkus**: Faster startup but smaller community
- **Micronaut**: Good alternative but less mature ecosystem
- **Plain Java EE**: Too much boilerplate

**Trade-offs**:
- **Pro**: Mature ecosystem, extensive libraries, excellent DDD support
- **Con**: Larger memory footprint than alternatives
- **Con**: Slower startup time (not critical for long-running services)

**Outcome**: Excellent choice. Spring Boot enabled rapid development without sacrificing quality.

---

### 5. PostgreSQL

**Decision**: Use PostgreSQL as the primary database.

**Rationale**:
- Production-grade relational database
- Excellent support for complex queries
- ACID compliance for financial data
- Rich data types (UUID, JSON if needed)
- Strong indexing capabilities
- Open source with no licensing costs

**Alternatives Considered**:
- **MySQL**: Less feature-rich, weaker for complex queries
- **H2**: Too lightweight for production
- **MongoDB**: NoSQL doesn't fit transactional invoice requirements

**Trade-offs**:
- **Pro**: Robust, feature-rich, excellent for financial data
- **Pro**: Strong community and tooling
- **Con**: Slightly more complex setup than MySQL
- **Con**: Requires careful query optimization for performance

**Outcome**: Perfect fit. PostgreSQL handles all requirements with excellent performance.

---

### 6. JWT Authentication

**Decision**: Implement stateless JWT-based authentication.

**Rationale**:
- Stateless: Enables horizontal scaling
- No server-side session storage required
- Standard protocol (RFC 7519)
- Can include custom claims (roles, permissions)
- Works well with modern frontend frameworks
- Reduces database lookups for authentication

**Implementation**:
- 24-hour token expiration
- HS256 signing algorithm
- BCrypt password hashing
- Roles encoded in token

**Alternatives Considered**:
- **Session-based Auth**: Rejected because it requires sticky sessions
- **OAuth2**: Overkill for single-application use case

**Trade-offs**:
- **Pro**: Stateless, scalable, standard protocol
- **Pro**: Reduces server memory requirements
- **Con**: Token cannot be invalidated before expiration
- **Con**: Slightly larger HTTP headers

**Outcome**: Works excellently. Perfect for scalable REST API.

---

### 7. Next.js 14 with App Router

**Decision**: Use Next.js 14 for the frontend framework.

**Rationale**:
- Modern React framework with excellent TypeScript support
- Built-in routing reduces boilerplate
- Server-side rendering capabilities for future SEO
- Large ecosystem and community
- Excellent developer experience
- Official React team recommendation

**Alternatives Considered**:
- **Create React App**: Deprecated, no longer recommended
- **Vite + React**: Good alternative but requires more configuration
- **Angular**: Different paradigm, steeper learning curve

**Trade-offs**:
- **Pro**: Modern, feature-rich, excellent DX
- **Pro**: TypeScript integration is seamless
- **Con**: App Router is relatively new (learning curve)
- **Con**: Some features (SSR) not used yet (over-engineered for SPA)

**Outcome**: Excellent. App Router provides great structure for the application.

---

### 8. Tailwind CSS

**Decision**: Use Tailwind CSS for styling.

**Rationale**:
- Utility-first approach speeds up development
- Highly customizable design system
- Excellent responsive design support
- No naming conflicts (no global CSS classes)
- Tree-shaking removes unused styles
- Large component ecosystem

**Alternatives Considered**:
- **Bootstrap**: Too opinionated, harder to customize
- **Material-UI**: Heavy, conflicts with custom design
- **Plain CSS**: Too much boilerplate, maintenance burden

**Trade-offs**:
- **Pro**: Fast development, consistent design
- **Pro**: No CSS file maintenance
- **Con**: HTML can be verbose with many classes
- **Con**: Learning curve for utility classes

**Outcome**: Very successful. Rapid UI development with consistent design.

---

## Domain Model Design

### 9. Strongly-Typed IDs

**Decision**: Use dedicated ID classes (CustomerId, InvoiceId, PaymentId) instead of String/UUID.

**Rationale**:
- Type safety: Cannot pass CustomerID where InvoiceId expected
- Self-documenting: Clear what ID type is needed
- Prevents primitive obsession anti-pattern
- Encapsulates ID generation logic

**Implementation**:
```java
@Embeddable
public class CustomerId {
    private String id;
    
    public static CustomerId generate() {
        return new CustomerId(UUID.randomUUID().toString());
    }
}
```

**Trade-offs**:
- **Pro**: Type safety, clear intent, prevents errors
- **Con**: More boilerplate than String IDs
- **Con**: JPA requires @Embeddable annotation

**Outcome**: Excellent. Type safety caught several bugs during development.

---

### 10. Money Value Object

**Decision**: Create a Money value object containing amount and currency.

**Rationale**:
- Money should always have an associated currency
- Prevents mixing currencies in calculations
- Encapsulates monetary arithmetic
- Makes currency explicit in the domain

**Implementation**:
```java
@Embeddable
public class Money {
    private BigDecimal amount;
    private String currency;
    
    public Money add(Money other) {
        if (!currency.equals(other.currency)) {
            throw new IllegalArgumentException("Currency mismatch");
        }
        return new Money(amount.add(other.amount), currency);
    }
}
```

**Trade-offs**:
- **Pro**: Currency is always tracked, prevents errors
- **Pro**: Centralizes monetary logic
- **Con**: Two database columns per money value
- **Con**: Slightly more complex than simple decimal

**Outcome**: Critical for correctness. Prevented potential currency mixing bugs.

---

### 11. Invoice Status as Enum

**Decision**: Model invoice status as an enum (DRAFT, SENT, PAID) rather than string.

**Rationale**:
- Limited set of valid values
- Type-safe status checks
- Clear state machine transitions
- Database stores as string for flexibility

**Implementation**:
```java
public enum InvoiceStatus {
    DRAFT, SENT, PAID;
    
    public boolean canBeEdited() {
        return this == DRAFT;
    }
    
    public boolean canAcceptPayments() {
        return this == SENT;
    }
}
```

**Trade-offs**:
- **Pro**: Type-safe, self-documenting
- **Pro**: Business rules centralized in enum
- **Con**: Adding new status requires code change
- **Con**: Database stores as string (not optimal storage)

**Outcome**: Perfect. State machine logic is clear and maintainable.

---

## API Design

### 12. DTOs at API Boundaries

**Decision**: Never expose domain entities directly; always use DTOs.

**Rationale**:
- Decouples API from domain model
- Prevents exposing internal domain structure
- Allows different representations for different endpoints
- Prevents accidental lazy-loading issues
- Provides versioning flexibility

**Implementation**:
```java
// Never expose Customer entity directly
// Instead, use CustomerDto
public class CustomerDto {
    private String id;
    private String name;
    private String email;
    // ... only fields needed by API
}
```

**Trade-offs**:
- **Pro**: API stability, security, flexibility
- **Con**: Mapping boilerplate (mitigated by DtoMapper)
- **Con**: More classes to maintain

**Outcome**: Essential. Allows API evolution without changing domain.

---

### 13. Pagination with Backward Compatibility

**Decision**: Make pagination optional by checking if `page` parameter is present.

**Rationale**:
- Existing API consumers don't break
- New consumers can opt into pagination
- Gradual migration path
- Same endpoint serves both use cases

**Implementation**:
```java
if (page != null) {
    return paginatedResponse;
} else {
    return allResults;
}
```

**Trade-offs**:
- **Pro**: Backward compatible, gradual adoption
- **Con**: Two code paths to maintain
- **Con**: Non-paginated path could cause issues with large datasets

**Outcome**: Excellent for migration. No breaking changes.

---

## Security

### 14. BCrypt for Password Hashing

**Decision**: Use BCrypt algorithm for password hashing.

**Rationale**:
- Industry standard for password hashing
- Built-in salt generation
- Configurable work factor
- Designed to be slow (prevents brute force)
- Spring Security native support

**Alternatives Considered**:
- **Plain SHA**: Too fast, vulnerable to rainbow tables
- **Argon2**: Better but not yet standard in Spring Security
- **PBKDF2**: Good alternative but BCrypt more common

**Trade-offs**:
- **Pro**: Secure, standard, well-tested
- **Con**: Slower than simpler algorithms (by design)

**Outcome**: Perfect for password security.

---

### 15. 24-Hour JWT Expiration

**Decision**: Set JWT token expiration to 24 hours.

**Rationale**:
- Balance between security and user experience
- Users don't need to login too frequently
- Short enough to limit damage if token stolen
- Standard practice for business applications

**Alternatives Considered**:
- **Longer (7 days)**: Too risky if token stolen
- **Shorter (1 hour)**: Too frequent logins, poor UX
- **Refresh tokens**: Overkill for current requirements

**Trade-offs**:
- **Pro**: Good security/UX balance
- **Con**: Stolen token valid for up to 24 hours
- **Con**: Cannot revoke before expiration

**Outcome**: Good balance. May add refresh tokens in future.

---

## Performance

### 16. Strategic Indexing

**Decision**: Add 11 targeted indexes based on query patterns.

**Rationale**:
- Analyzed common queries (by status, by customer, by date)
- Added indexes for foreign keys
- Added composite index for common combined filters
- Avoided over-indexing (slows writes)

**Indexes Added**:
- Customer: email, name, created_at
- Invoice: customer_id, status, number, dates, customer_id+status
- Payment: invoice_id, payment_date, created_at

**Trade-offs**:
- **Pro**: Dramatic query performance improvement
- **Con**: Slightly slower writes
- **Con**: More storage space

**Outcome**: Essential for performance. Queries are sub-100ms.

---

### 17. Connection Pool Sizing

**Decision**: Configure HikariCP with 20 max connections, 10 minimum idle.

**Rationale**:
- Calculated based on expected concurrent users (~20)
- Allows burst capacity
- Minimum idle prevents connection acquisition delay
- Leak detection helps identify bugs

**Formula Used**:
```
connections = (core_count * 2) + effective_spindle_count
= (8 * 2) + 4 = 20
```

**Trade-offs**:
- **Pro**: Handles concurrent load well
- **Con**: More database connections than minimal
- **Con**: More memory usage

**Outcome**: Excellent. No connection exhaustion under load.

---

## Frontend Architecture

### 18. MVVM Pattern

**Decision**: Organize frontend using Model-View-ViewModel pattern.

**Rationale**:
- Separates presentation logic from UI rendering
- ViewModels are testable without React
- Reusable ViewModels across components
- Clear data flow

**Structure**:
- **Model**: TypeScript interfaces
- **View**: React components
- **ViewModel**: Custom hooks with business logic

**Alternatives Considered**:
- **MVC**: Less common in React
- **Container/Presentational**: Similar but less structured
- **Redux**: Overkill for current state management needs

**Trade-offs**:
- **Pro**: Clean separation, testable logic
- **Con**: More files than simple components
- **Con**: Learning curve for team

**Outcome**: Very successful. Logic is reusable and testable.

---

### 19. TypeScript Strict Mode

**Decision**: Enable TypeScript strict mode with all checks.

**Rationale**:
- Catches errors at compile time
- Better IDE support and autocomplete
- Self-documenting code
- Prevents null/undefined bugs

**Configuration**:
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true
}
```

**Trade-offs**:
- **Pro**: Fewer runtime errors, better DX
- **Con**: More type annotations required
- **Con**: Slightly slower development initially

**Outcome**: Essential. Caught numerous potential bugs.

---

## Testing Strategy

### 20. Test Pyramid Approach

**Decision**: Follow test pyramid with unit tests at base, fewer integration tests.

**Rationale**:
- Unit tests are fast and focused
- Integration tests cover critical flows
- Avoids slow, brittle E2E tests for now
- Focus on testing business logic in domain

**Distribution**:
- Unit tests: 30 tests (domain logic)
- Integration tests: 22 tests (complete flows)
- E2E tests: Planned for PR32

**Alternatives Considered**:
- **Only Integration Tests**: Too slow, hard to maintain
- **Only Unit Tests**: Misses interaction bugs

**Trade-offs**:
- **Pro**: Fast feedback, maintainable tests
- **Con**: May miss some integration issues

**Outcome**: Excellent. 52 tests run in ~50 seconds.

---

## Lessons Learned

### What Worked Well
1. **DDD**: Business logic is clear and maintainable
2. **VSA**: Features are easy to find and modify
3. **Type Safety**: TypeScript and strongly-typed IDs caught many bugs
4. **Pagination**: Performance improved significantly
5. **JWT**: Stateless authentication scales well

### What We'd Do Differently
1. **Consider refresh tokens**: 24-hour expiration may be too long
2. **Add event sourcing**: For audit trail and compliance
3. **Implement CQRS read models**: Separate database for queries
4. **Add caching layer**: Redis for frequently accessed data
5. **Swagger earlier**: API docs should be generated from code

### Future Improvements
1. Add OpenAPI/Swagger annotations
2. Implement refresh token mechanism
3. Add comprehensive E2E tests
4. Consider event-driven architecture for scalability
5. Add monitoring and observability (Prometheus, Grafana)

---

## Conclusion

These design decisions prioritized:
1. **Code Quality**: Maintainable, readable, testable code
2. **Business Logic**: Clear domain boundaries and rules
3. **Performance**: Strategic optimization where it matters
4. **Security**: Industry-standard authentication and authorization
5. **Scalability**: Stateless design enables horizontal scaling

The architecture successfully balances pragmatism with best practices, delivering a production-ready application that can evolve as requirements grow.

