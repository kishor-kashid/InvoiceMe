# Production Environment Variables

This document describes the required environment variables for InvoiceMe production deployment.

## Backend Environment Variables (EC2)

Set these environment variables in `/etc/invoiceme/environment` (used by systemd via `EnvironmentFile`):

```bash
# Database Configuration (use SPRING_* prefix for Spring Boot)
# Spring Boot automatically maps SPRING_DATASOURCE_URL to spring.datasource.url
SPRING_DATASOURCE_URL=jdbc:postgresql://your-rds-endpoint.region.rds.amazonaws.com:5432/invoiceme
SPRING_DATASOURCE_USERNAME=invoiceme_admin
SPRING_DATASOURCE_PASSWORD=your-secure-database-password-here

# JWT Configuration
JWT_SECRET=your-256-bit-jwt-secret-key-here-minimum-32-characters

# Admin User Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password-here
ADMIN_EMAIL=admin@yourdomain.com

# CORS Configuration (use SPRING_* prefix)
# Format: http://your-ec2-ip:3000,http://localhost:3000
SPRING_WEB_CORS_ALLOWED_ORIGINS=http://your-ec2-ip:3000,http://localhost:3000

# Server Port (optional, defaults to 8080)
PORT=8080
```

**Important**: Use `SPRING_DATASOURCE_*` and `SPRING_WEB_CORS_ALLOWED_ORIGINS` property names so Spring Boot reads them automatically. Spring Boot maps environment variables with `SPRING_` prefix to corresponding `spring.*` properties.

## Frontend Environment Variables (Next.js Server)

Create `.env.production` file in the `frontend` directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://your-ec2-public-ip:8080/api

# Environment
NEXT_PUBLIC_ENV=production
```

**Note**: The frontend is deployed as a Next.js server (not static export) due to dynamic routes. See `docs/DEPLOYMENT.md` for server deployment instructions.

## Generating Secure Secrets

### Database Password
```bash
openssl rand -base64 32
```

### JWT Secret
```bash
openssl rand -base64 32
```

### Admin Password
Use a strong password generator or:
```bash
openssl rand -base64 24
```

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use AWS Secrets Manager** for production secrets
3. **Rotate secrets regularly** (every 90 days)
4. **Use IAM roles** for EC2 instances instead of access keys
5. **Restrict access** using security groups and VPCs

## Example Configuration

See `.env.production.example` in the project root for a complete template.

