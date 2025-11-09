# Production Setup Guide

This guide explains how to securely configure InvoiceMe for production deployment.

## ⚠️ Security Requirements

**CRITICAL**: Never use default credentials in production! All sensitive values must be set via environment variables.

## Required Environment Variables

### 1. Admin User Credentials

Set these **before** first startup to create the admin user:

```bash
export ADMIN_USERNAME=your_secure_username
export ADMIN_PASSWORD=your_secure_password_here
export ADMIN_EMAIL=admin@yourcompany.com
```

**Requirements:**
- Username: 3-50 characters, alphanumeric
- Password: Minimum 8 characters, recommended 16+ with mixed case, numbers, and symbols
- Email: Valid email format

### 2. JWT Secret Key

**REQUIRED** for JWT token signing:

```bash
export JWT_SECRET=your-256-bit-secret-key-minimum-length-here
```

**Requirements:**
- Minimum 256 bits (32 characters)
- Use cryptographically secure random string
- Never commit to version control

**Generate a secure secret:**
```bash
# Linux/Mac
openssl rand -hex 32

# Or use online generator
# https://www.random.org/strings/?num=1&len=32&digits=on&upperalpha=on&loweralpha=on&unique=on&format=html&rnd=new
```

### 3. Database Configuration

```bash
export DATABASE_URL=jdbc:postgresql://your-db-host:5432/invoiceme
export DATABASE_USERNAME=your_db_user
export DATABASE_PASSWORD=your_db_password
```

### 4. CORS Configuration (Optional)

```bash
export CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 5. Server Port (Optional)

```bash
export PORT=8080
```

## Deployment Methods

### Method 1: Docker

Create a `.env` file (DO NOT commit to git):

```env
ADMIN_USERNAME=your_secure_username
ADMIN_PASSWORD=your_secure_password
ADMIN_EMAIL=admin@yourcompany.com
JWT_SECRET=your-256-bit-secret-key-here
DATABASE_URL=jdbc:postgresql://db:5432/invoiceme
DATABASE_USERNAME=invoiceme_user
DATABASE_PASSWORD=your_db_password
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

Run with:
```bash
docker-compose --env-file .env up -d
```

### Method 2: Systemd Service

Create `/etc/systemd/system/invoiceme.service`:

```ini
[Unit]
Description=InvoiceMe Application
After=network.target

[Service]
Type=simple
User=invoiceme
Environment="ADMIN_USERNAME=your_secure_username"
Environment="ADMIN_PASSWORD=your_secure_password"
Environment="ADMIN_EMAIL=admin@yourcompany.com"
Environment="JWT_SECRET=your-256-bit-secret-key-here"
Environment="DATABASE_URL=jdbc:postgresql://localhost:5432/invoiceme"
Environment="DATABASE_USERNAME=invoiceme_user"
Environment="DATABASE_PASSWORD=your_db_password"
Environment="CORS_ALLOWED_ORIGINS=https://yourdomain.com"
Environment="SPRING_PROFILES_ACTIVE=prod"
ExecStart=/usr/bin/java -jar /opt/invoiceme/invoiceme-1.0.0.jar
Restart=always

[Install]
WantedBy=multi-user.target
```

### Method 3: AWS/Azure Environment Variables

**AWS (EC2/ECS):**
- Use AWS Systems Manager Parameter Store
- Or set in ECS task definition
- Or use AWS Secrets Manager

**Azure:**
- Use Azure Key Vault
- Or set in App Service Configuration
- Or use Azure App Settings

### Method 4: Kubernetes Secrets

Create secret:
```bash
kubectl create secret generic invoiceme-secrets \
  --from-literal=admin-username=your_username \
  --from-literal=admin-password=your_password \
  --from-literal=admin-email=admin@company.com \
  --from-literal=jwt-secret=your-secret-key \
  --from-literal=database-url=jdbc:postgresql://... \
  --from-literal=database-username=user \
  --from-literal=database-password=pass
```

Reference in deployment:
```yaml
env:
  - name: ADMIN_USERNAME
    valueFrom:
      secretKeyRef:
        name: invoiceme-secrets
        key: admin-username
  # ... etc
```

## Activating Production Profile

Set the Spring profile to `prod`:

```bash
export SPRING_PROFILES_ACTIVE=prod
```

Or when running:
```bash
java -jar invoiceme-1.0.0.jar --spring.profiles.active=prod
```

## Verification

After deployment, verify:

1. **Check logs** - Should see:
   ```
   Admin user created from environment variables
   Username: [your_username]
   Password: [SET FROM ENVIRONMENT VARIABLE]
   ```

2. **Test login** - Use your credentials to log in

3. **Verify JWT** - Check that tokens are being generated correctly

## Security Checklist

- [ ] All environment variables set
- [ ] `SPRING_PROFILES_ACTIVE=prod` activated
- [ ] Strong admin password (16+ characters)
- [ ] Secure JWT secret (256+ bits)
- [ ] Database credentials secure
- [ ] CORS restricted to production domain
- [ ] No credentials in logs
- [ ] `.env` files in `.gitignore`
- [ ] Secrets not committed to version control
- [ ] HTTPS enabled
- [ ] Firewall rules configured

## Troubleshooting

### Admin user not created

**Issue**: Admin user not appearing after startup

**Solutions**:
1. Check environment variables are set: `echo $ADMIN_USERNAME`
2. Check logs for errors
3. Verify user doesn't already exist in database
4. Check Spring profile is active: `echo $SPRING_PROFILES_ACTIVE`

### JWT authentication failing

**Issue**: Login works but API calls fail with 401

**Solutions**:
1. Verify `JWT_SECRET` is set
2. Check secret is same across all instances (if load balanced)
3. Verify token is being sent in Authorization header
4. Check token expiration time

### Database connection issues

**Issue**: Cannot connect to database

**Solutions**:
1. Verify `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` are set
2. Check database is accessible from application server
3. Verify firewall rules allow connection
4. Test connection: `psql -h host -U user -d database`

## Best Practices

1. **Rotate secrets regularly** - Change JWT secret and passwords periodically
2. **Use secrets management** - AWS Secrets Manager, Azure Key Vault, HashiCorp Vault
3. **Limit access** - Only necessary personnel should know credentials
4. **Monitor logs** - Watch for authentication failures
5. **Backup database** - Regular backups of user data
6. **Update dependencies** - Keep Spring Boot and dependencies updated

## Support

For issues or questions, refer to:
- `README.md` - General setup
- `API.md` - API documentation
- Application logs - Detailed error messages

