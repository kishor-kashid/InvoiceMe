# Environment Variables Guide

This document explains all environment variables used by InvoiceMe backend.

## 🔐 Security-Critical Variables (Production Required)

### Admin User Credentials

**⚠️ MUST be set in production!**

```bash
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_secure_password_here
ADMIN_EMAIL=admin@yourcompany.com
```

**Behavior:**
- If set: Uses environment variable values (production mode)
- If not set: Falls back to defaults from `application.properties` (development mode)
- Defaults: `admin` / `admin123` / `admin@invoiceme.com`

**Security:**
- Password is always BCrypt hashed before storage
- In production mode, password is NOT logged
- In development mode, password is logged with warning

### JWT Secret

**⚠️ MUST be set in production!**

```bash
JWT_SECRET=your-256-bit-secret-key-minimum-length-here
```

**Requirements:**
- Minimum 256 bits (32 characters)
- Cryptographically secure random string
- Same value across all instances (if load balanced)

**Generate:**
```bash
openssl rand -hex 32
```

**Behavior:**
- If set: Uses environment variable
- If not set: Uses default from `application.properties` (development only)

## 🗄️ Database Configuration

```bash
DATABASE_URL=jdbc:postgresql://host:port/database
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
```

**Used in:** `application-prod.properties`

## 🌐 Server Configuration

```bash
PORT=8080                    # Server port (default: 8080)
SPRING_PROFILES_ACTIVE=prod  # Spring profile (dev/prod)
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## 📋 Quick Reference

### Development (Local)

No environment variables needed - uses defaults:
- Username: `admin`
- Password: `admin123`
- JWT Secret: Default key from properties

### Production

**Required:**
```bash
export ADMIN_USERNAME=secure_user
export ADMIN_PASSWORD=SecurePass123!
export ADMIN_EMAIL=admin@company.com
export JWT_SECRET=$(openssl rand -hex 32)
export SPRING_PROFILES_ACTIVE=prod
```

**Optional:**
```bash
export DATABASE_URL=jdbc:postgresql://...
export DATABASE_USERNAME=...
export DATABASE_PASSWORD=...
export CORS_ALLOWED_ORIGINS=https://...
export PORT=8080
```

## 🔍 How It Works

1. **Environment variables checked first** (highest priority)
2. **Properties file used as fallback** (development defaults)
3. **Production profile** (`application-prod.properties`) requires env vars

## 📝 Example: Setting Up Production

```bash
# 1. Generate secure JWT secret
export JWT_SECRET=$(openssl rand -hex 32)

# 2. Set admin credentials
export ADMIN_USERNAME=invoice_admin
export ADMIN_PASSWORD=$(openssl rand -base64 24)  # Generate random password
export ADMIN_EMAIL=admin@mycompany.com

# 3. Set database
export DATABASE_URL=jdbc:postgresql://db.example.com:5432/invoiceme
export DATABASE_USERNAME=invoiceme_prod
export DATABASE_PASSWORD=secure_db_password

# 4. Activate production profile
export SPRING_PROFILES_ACTIVE=prod

# 5. Start application
java -jar invoiceme-1.0.0.jar
```

## ✅ Verification

After startup, check logs:

**Production mode (env vars set):**
```
Admin user created from environment variables
Username: invoice_admin
Email: admin@mycompany.com
Password: [SET FROM ENVIRONMENT VARIABLE]
```

**Development mode (using defaults):**
```
⚠️  DEVELOPMENT MODE: Using default credentials
⚠️  Set ADMIN_USERNAME and ADMIN_PASSWORD environment variables for production!
Username: admin
Password: admin123
```

## 🚨 Security Checklist

- [ ] `ADMIN_USERNAME` set to non-default value
- [ ] `ADMIN_PASSWORD` is strong (16+ characters)
- [ ] `JWT_SECRET` is 256+ bits and random
- [ ] `SPRING_PROFILES_ACTIVE=prod` in production
- [ ] No credentials in logs (production mode)
- [ ] Environment variables not committed to git
- [ ] Secrets stored in secure vault (AWS Secrets Manager, Azure Key Vault, etc.)

