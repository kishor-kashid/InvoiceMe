# InvoiceMe - AI-Assisted Full-Stack ERP Invoicing System

A production-quality ERP-style invoicing system demonstrating modern software architecture principles including Domain-Driven Design (DDD), Command Query Responsibility Segregation (CQRS), and Vertical Slice Architecture (VSA).

## 🎯 Project Overview

InvoiceMe is a full-stack invoicing application that manages **Customers**, **Invoices**, and **Payments** with a clean, scalable architecture designed for enterprise-level SaaS applications.

### Key Features

- ✅ Customer Management (CRUD operations)
- ✅ Invoice Creation with Multiple Line Items
- ✅ Invoice Lifecycle (Draft → Sent → Paid)
- ✅ Payment Recording and Balance Tracking
- ✅ RESTful API with CQRS pattern
- ✅ Modern React/Next.js Frontend with MVVM
- ✅ JWT Authentication
- ✅ PostgreSQL Database

## 🏗️ Architecture

This project follows three core architectural principles:

1. **Domain-Driven Design (DDD)**: Rich domain models with business logic encapsulated in entities
2. **Command Query Responsibility Segregation (CQRS)**: Separate read and write operations
3. **Vertical Slice Architecture (VSA)**: Code organized by features rather than technical layers

## 🛠️ Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2.0**
- **Spring Data JPA** for persistence
- **PostgreSQL** database
- **Spring Security** with JWT authentication
- **Maven** for dependency management

### Frontend
- **TypeScript** with **Next.js 14**
- **React 18** with **MVVM** pattern
- **Tailwind CSS** for styling
- **Axios** for API communication

### Infrastructure
- **Docker** and **Docker Compose** for PostgreSQL
- **AWS** (or Azure) for deployment

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher
- **Maven 3.6+** (optional - Maven Wrapper is included)
- **Node.js 18+** and **npm** (or **yarn**)
- **Docker** and **Docker Compose**
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd InvoiceMe
```

### 2. Start PostgreSQL Database

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This will:
- Start a PostgreSQL 15 container
- Create a database named `invoiceme`
- Set up user credentials (see `.env.example`)

Verify the database is running:

```bash
docker-compose ps
```

You should see the `invoiceme-postgres` container running.

### 3. Configure Environment Variables

#### Development Mode (Default)

For local development, the application uses default credentials:
- **Username**: `admin`
- **Password**: `admin123`
- **JWT Secret**: Default key (change for production!)

These are automatically created on first startup.

#### Production Mode

**⚠️ CRITICAL**: For production deployment, you MUST set environment variables:

```bash
# Required for Production
export ADMIN_USERNAME=your_secure_username
export ADMIN_PASSWORD=your_secure_password_here
export ADMIN_EMAIL=admin@yourcompany.com
export JWT_SECRET=your-256-bit-secret-key-minimum-length-here

# Database Configuration
export DATABASE_URL=jdbc:postgresql://your-db-host:5432/invoiceme
export DATABASE_USERNAME=your_db_user
export DATABASE_PASSWORD=your_db_password

# Optional
export CORS_ALLOWED_ORIGINS=https://yourdomain.com
export PORT=8080
export SPRING_PROFILES_ACTIVE=prod
```

**See [PRODUCTION_SETUP.md](backend/PRODUCTION_SETUP.md) for detailed production deployment guide.**

#### Frontend Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 4. Backend Setup

Navigate to the backend directory and build the project:

**Using Maven Wrapper (Recommended - No Maven installation required):**

```bash
cd backend
./mvnw clean install
```

Or on Windows PowerShell:
```powershell
cd backend
.\mvnw.cmd clean install
```

Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

Or on Windows PowerShell:
```powershell
.\mvnw.cmd spring-boot:run
```

**Note:** If you have Maven installed globally, you can use `mvn` instead of `./mvnw` or `.\mvnw.cmd`.

The backend API will be available at `http://localhost:8080`

### 5. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🧪 Testing

### Backend Tests

Run all backend tests:

```bash
cd backend
./mvnw test
```

Or on Windows PowerShell:
```powershell
.\mvnw.cmd test
```

Run integration tests:

```bash
./mvnw test -Dtest=*IntegrationTest
```

Or on Windows PowerShell:
```powershell
.\mvnw.cmd test -Dtest=*IntegrationTest
```

### Frontend Tests

Run frontend type checking:

```bash
cd frontend
npm run type-check
```

## 📁 Project Structure

```
InvoiceMe/
├── backend/                    # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/invoiceme/
│   │   │   │   ├── domain/          # Domain Layer (DDD)
│   │   │   │   ├── features/        # Vertical Slices (CQRS)
│   │   │   │   ├── infrastructure/  # Infrastructure Layer
│   │   │   │   └── shared/          # Shared utilities
│   │   │   └── resources/
│   │   └── test/                    # Test files
│   └── pom.xml
├── frontend/                   # Next.js Application
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   ├── components/         # React components
│   │   ├── viewmodels/         # MVVM ViewModels
│   │   ├── services/           # API services
│   │   └── types/              # TypeScript types
│   └── package.json
├── docker-compose.yml          # PostgreSQL container
├── .env.example                # Environment variables template
└── README.md
```

## 🔌 API Endpoints

See **[API.md](API.md)** for complete API documentation with request/response examples.

### Quick Reference

**Customers:**
- `POST /api/customers` - Create customer
- `GET /api/customers` - List all customers
- `GET /api/customers/{id}` - Get customer by ID
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

**Invoices:**
- `POST /api/invoices` - Create invoice with line items
- `GET /api/invoices` - List invoices (filters: status, customerId)
- `GET /api/invoices/{id}` - Get invoice by ID
- `PUT /api/invoices/{id}` - Update invoice (DRAFT only)
- `POST /api/invoices/{id}/send` - Mark invoice as sent
- `POST /api/invoices/{id}/payments` - Record payment
- `GET /api/invoices/{id}/payments` - List payments for invoice

**Payments:**
- `GET /api/payments/{id}` - Get payment by ID

## 🐳 Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f postgres
```

### Remove Volumes (⚠️ This will delete all data)
```bash
docker-compose down -v
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Customer**: Stores customer information
- **Invoice**: Stores invoice data with line items
- **Payment**: Records payments applied to invoices

See the technical documentation for detailed schema information.

## 🔒 Security

- JWT-based authentication
- Password encryption with BCrypt
- CORS configuration for frontend communication
- Input validation on all endpoints
- **Environment variable-based configuration for production**
- **No hardcoded credentials in production mode**

### Security Best Practices

1. **Never use default credentials in production**
   - Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `JWT_SECRET` environment variables
   - Use strong passwords (16+ characters with mixed case, numbers, symbols)
   - Generate secure JWT secret (256+ bits)

2. **Production Profile**
   - Activate `prod` profile: `SPRING_PROFILES_ACTIVE=prod`
   - Uses `application-prod.properties` with stricter settings
   - Disables SQL logging and debug output

3. **Secrets Management**
   - Use AWS Secrets Manager, Azure Key Vault, or similar for cloud deployments
   - Never commit secrets to version control
   - Rotate secrets regularly

See **[PRODUCTION_SETUP.md](backend/PRODUCTION_SETUP.md)** for complete security guidelines.

## 🚢 Deployment

### Production Deployment

**⚠️ IMPORTANT**: Before deploying to production:

1. **Set all required environment variables** (see Production Mode above)
2. **Activate production profile**: `SPRING_PROFILES_ACTIVE=prod`
3. **Generate secure JWT secret**: `openssl rand -hex 32`
4. **Use strong admin password**: Minimum 16 characters
5. **Configure database**: Set `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`

### AWS Deployment

1. Set up AWS RDS PostgreSQL instance
2. Configure environment variables (use AWS Secrets Manager or Parameter Store)
3. Deploy backend to AWS EC2 or ECS
4. Deploy frontend to Vercel, Netlify, or AWS S3/CloudFront

### Azure Deployment

1. Set up Azure Database for PostgreSQL
2. Configure environment variables (use Azure Key Vault)
3. Deploy backend to Azure App Service or Container Instances
4. Deploy frontend to Azure Static Web Apps or App Service

**See [PRODUCTION_SETUP.md](backend/PRODUCTION_SETUP.md) for detailed deployment instructions.**

## 📝 Development Guidelines

### Code Style
- Follow Java naming conventions for backend
- Use TypeScript strict mode for frontend
- Maintain consistent formatting

### Architecture
- Keep domain logic in domain layer
- Separate commands and queries (CQRS)
- Organize code by features (VSA)

### Testing
- Write unit tests for domain logic
- Write integration tests for complete workflows
- Maintain test coverage above 80%

## 🤝 Contributing

This is an assessment project. For questions or issues, please refer to the project documentation.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Additional Documentation

- **[API Documentation](API.md)** - Complete REST API reference
- [Product Requirements Document](InvoiceMe-PRD.md)
- [Task List & PR Breakdown](InvoiceMe_Task_List.md)
- Technical Writeup (coming soon)

## 🎯 Success Criteria

- ✅ All CRUD operations working
- ✅ Invoice lifecycle properly implemented
- ✅ API responses under 200ms
- ✅ Passing integration tests
- ✅ Clean, modular, documented code
- ✅ Deployed to AWS/Azure

---
