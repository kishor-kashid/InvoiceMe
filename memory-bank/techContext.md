# Technical Context: InvoiceMe

## Technology Stack

### Backend

#### Core Framework
- **Java 17**: Programming language
- **Spring Boot 3.2.0**: Application framework
- **Spring Data JPA**: Data persistence abstraction
- **Spring Security**: Authentication and authorization (planned for PR15)
- **Spring Validation**: Input validation

#### Database
- **PostgreSQL 15**: Primary database (production)
- **H2**: In-memory database (testing)
- **Hibernate 6.3.1**: JPA implementation

#### Build & Dependency Management
- **Maven 3.6+**: Build tool and dependency management
- **Maven Wrapper**: Project-specific Maven distribution (no global installation required)

#### Security & Authentication
- **JWT (jjwt 0.12.3)**: JSON Web Token library
- **BCrypt**: Password encryption (planned for PR15)

#### Development Tools
- **Lombok**: Reduces boilerplate code
- **JUnit 5**: Testing framework
- **Spring Boot Test**: Integration testing support

### Frontend

#### Core Framework
- **TypeScript**: Type-safe JavaScript
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **MVVM Pattern**: Architecture for UI logic

#### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing

#### Development Tools
- **ESLint**: Code linting
- **TypeScript Compiler**: Type checking

### Infrastructure

#### Containerization
- **Docker**: Container runtime
- **Docker Compose**: Multi-container orchestration

#### Deployment Targets
- **AWS**: Primary deployment target (EC2, ECS, RDS)
- **Azure**: Alternative deployment target

## Development Setup

### Prerequisites
- Java 17 or higher
- Maven 3.6+ (optional - wrapper included)
- Node.js 18+ and npm
- Docker and Docker Compose
- Git

### Database Configuration

**PostgreSQL (Development)**:
- Host: `localhost`
- Port: `5432`
- Database: `invoiceme`
- User: `invoiceme_user`
- Password: `invoiceme_password`

**Connection Pool (HikariCP)**:
- Maximum pool size: 10
- Minimum idle: 5
- Connection timeout: 20 seconds

### Application Configuration

**Backend** (`application.properties`):
- Server port: `8080`
- JPA: `ddl-auto=update` (development)
- SQL logging: Enabled in development
- CORS: Configured for `http://localhost:3000`

**Frontend**:
- Development server: `http://localhost:3000`
- API endpoint: `http://localhost:8080/api`

### Build Commands

**Backend**:
```bash
# Windows PowerShell
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
.\mvnw.cmd test

# Unix/Linux
./mvnw clean install
./mvnw spring-boot:run
./mvnw test
```

**Frontend**:
```bash
npm install
npm run dev
npm run type-check
```

## Technical Constraints

### Performance Requirements
- API response times: **< 200ms** for standard CRUD operations
- Database queries: Optimized with proper indexing
- Connection pooling: Configured for optimal performance

### Code Quality Standards
- **Modularity**: Code organized by features (VSA)
- **Documentation**: Well-documented code with JavaDoc
- **DTOs**: Explicit DTOs at all API boundaries
- **Validation**: Input validation using Jakarta Bean Validation
- **Error Handling**: Consistent error responses

### Testing Requirements
- **Unit Tests**: Domain logic must be unit tested
- **Integration Tests**: End-to-end workflows must be integration tested
- **Test Coverage**: Maintain above 80% coverage

### Security Constraints
- **Authentication**: JWT-based (planned for PR15)
- **Authorization**: Role-based access control (planned)
- **Input Validation**: All inputs validated
- **CORS**: Configured for frontend communication
- **CSRF**: Disabled for API endpoints (stateless)

## Dependencies

### Backend Key Dependencies
```xml
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-validation
- spring-boot-starter-security
- postgresql (runtime)
- h2 (test scope)
- jjwt (JWT library)
- lombok
- spring-boot-starter-test
```

### Frontend Key Dependencies
```json
- next
- react
- react-dom
- typescript
- tailwindcss
- postcss
- eslint
```

## Development Workflow

1. **Database**: Start PostgreSQL via Docker Compose
2. **Backend**: Run Spring Boot application
3. **Frontend**: Start Next.js development server
4. **Testing**: Run tests before committing
5. **API Testing**: Use Postman/curl for API validation

## Environment-Specific Configuration

### Development
- Database: Local PostgreSQL (Docker)
- Logging: DEBUG level
- JPA: `ddl-auto=update`
- CORS: Enabled for localhost:3000

### Production (Planned)
- Database: AWS RDS or Azure Database
- Logging: INFO level
- JPA: `ddl-auto=validate`
- CORS: Restricted to production domain
- Security: Full JWT authentication

## Known Technical Decisions

1. **Maven Wrapper**: Included to ensure consistent Maven version across environments
2. **PostgreSQL**: Chosen over H2 for production-readiness simulation
3. **Next.js**: Selected for modern React development with App Router
4. **Tailwind CSS**: Chosen for rapid UI development
5. **JWT**: Selected for stateless authentication
6. **Vertical Slices**: Chosen over traditional layered architecture for better feature cohesion

