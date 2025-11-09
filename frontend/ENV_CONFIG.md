# Environment Variables Configuration

This file documents the required environment variables for the InvoiceMe frontend application.

## Setup Instructions

Create a `.env.local` file in the `frontend` directory with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key-here

# Environment
NEXT_PUBLIC_ENV=development
```

## Variable Descriptions

### NEXT_PUBLIC_API_URL
- **Description**: Base URL for the backend API
- **Default**: `http://localhost:8080/api`
- **Production**: Update to your production API URL

### NEXT_PUBLIC_JWT_SECRET
- **Description**: Secret key for JWT token validation (should match backend)
- **Default**: `your-jwt-secret-key-here`
- **Production**: Use a secure, randomly generated key

### NEXT_PUBLIC_ENV
- **Description**: Current environment
- **Values**: `development`, `production`, `staging`
- **Default**: `development`

## Notes

- All variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` to version control
- Update values for production deployment

