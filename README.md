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

Copy the example environment file (if available) or create a `.env` file in the root directory with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=invoiceme
DB_USER=invoiceme_user
DB_PASSWORD=invoiceme_password

SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8080

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=86400000

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

## 🚢 Deployment

### AWS Deployment

1. Set up AWS RDS PostgreSQL instance
2. Configure environment variables for production
3. Deploy backend to AWS EC2 or ECS
4. Deploy frontend to Vercel, Netlify, or AWS S3/CloudFront

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

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
