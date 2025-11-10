# InvoiceMe Deployment Guide

This guide provides step-by-step instructions for deploying InvoiceMe to AWS production environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Overview](#deployment-overview)
3. [Step 1: AWS Infrastructure Setup](#step-1-aws-infrastructure-setup)
4. [Step 2: EC2 Environment Setup](#step-2-ec2-environment-setup)
5. [Step 3: Backend Deployment](#step-3-backend-deployment)
6. [Step 4: Frontend Deployment](#step-4-frontend-deployment)
7. [Step 5: Configuration and Testing](#step-5-configuration-and-testing)
8. [Step 6: Post-Deployment](#step-6-post-deployment)
9. [Troubleshooting](#troubleshooting)
10. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

Before starting deployment, ensure you have:

- ✅ AWS Account with appropriate permissions
- ✅ AWS CLI installed and configured (`aws configure`)
- ✅ SSH key pair for EC2 access
- ✅ Git repository access
- ✅ Domain name (optional, for custom domain)
- ✅ Completed AWS infrastructure setup (see `docs/AWS_SETUP.md`)

---

## Deployment Overview

InvoiceMe deployment consists of:

1. **AWS Infrastructure**: RDS PostgreSQL, EC2 instance, S3 bucket
2. **Backend**: Spring Boot application on EC2
3. **Frontend**: Next.js static site on S3
4. **Configuration**: Environment variables, CORS, security groups

**Estimated Time**: 2-3 hours for first deployment

---

## Step 1: AWS Infrastructure Setup

Follow the complete guide in `docs/AWS_SETUP.md` to set up:

1. ✅ RDS PostgreSQL instance
2. ✅ EC2 instance for backend
3. ✅ S3 bucket for frontend
4. ✅ Security groups
5. ✅ VPC and networking (if needed)

**Key Information to Note**:
- RDS endpoint URL
- RDS username and password
- EC2 public IP address
- EC2 security group ID
- S3 bucket name
- S3 website endpoint

---

## Step 2: EC2 Environment Setup

### 2.1 Connect to EC2 Instance

```bash
# Linux/Mac
ssh -i invoiceme-ec2-key.pem ec2-user@<EC2_PUBLIC_IP>

# For Ubuntu AMI
ssh -i invoiceme-ec2-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### 2.2 Run Setup Script

Upload `setup-ec2.sh` to EC2 and run:

```bash
# Make executable
chmod +x setup-ec2.sh

# Run with sudo
sudo ./setup-ec2.sh
```

This installs:
- Java 17
- Maven
- PostgreSQL client tools
- AWS CLI
- System dependencies

### 2.3 Verify Installation

```bash
# Check Java
java -version
# Should show: openjdk version "17" or similar

# Check Maven
mvn -version
# Should show: Apache Maven 3.9.x

# Check PostgreSQL client
psql --version
# Should show: psql (PostgreSQL) 15.x

# Reload environment
source ~/.bashrc
```

### 2.4 Clone Repository

```bash
# Create application directory
sudo mkdir -p /opt/invoiceme
sudo chown $USER:$USER /opt/invoiceme

# Clone repository
cd /opt/invoiceme
git clone <your-repository-url> .

# Or if repository is private, use SSH:
# git clone git@github.com:yourusername/invoiceme.git .
```

---

## Step 3: Backend Deployment

### 3.1 Configure Environment Variables

Create environment variables file:

```bash
# Create environment file
sudo mkdir -p /etc/invoiceme
sudo nano /etc/invoiceme/environment

# Add (use Spring Boot property names):
SPRING_DATASOURCE_URL=jdbc:postgresql://your-rds-endpoint:5432/invoiceme
SPRING_DATASOURCE_USERNAME=invoiceme_admin
SPRING_DATASOURCE_PASSWORD=your-secure-password
JWT_SECRET=your-256-bit-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_EMAIL=admin@yourdomain.com
SPRING_WEB_CORS_ALLOWED_ORIGINS=http://your-ec2-ip:3000,http://localhost:3000
PORT=8080
```

**Important**: Use `SPRING_DATASOURCE_*` and `SPRING_WEB_CORS_ALLOWED_ORIGINS` property names so Spring Boot reads them automatically. Spring Boot maps environment variables with `SPRING_` prefix to corresponding `spring.*` properties.

Set proper permissions:
```bash
sudo chmod 600 /etc/invoiceme/environment
sudo chown root:root /etc/invoiceme/environment
```

**Note**: The `deploy-backend.sh` script uses `EnvironmentFile=/etc/invoiceme/environment` to load these variables automatically.

### 3.2 Test Database Connection

```bash
# Test RDS connection from EC2
psql -h your-rds-endpoint.rds.amazonaws.com -U invoiceme_admin -d invoiceme

# Enter password when prompted
# If successful, you'll see: invoiceme=>
# Type \q to exit
```

### 3.3 Deploy Backend

```bash
cd /opt/invoiceme

# Make deployment script executable
chmod +x deploy-backend.sh

# Run deployment (requires sudo)
sudo ./deploy-backend.sh production
```

The script will:
1. Pull latest code (if using git)
2. Build application with Maven
3. Create systemd service
4. Start the service
5. Enable auto-start on boot

### 3.4 Verify Backend Deployment

```bash
# Check service status
sudo systemctl status invoiceme-backend

# View logs
sudo journalctl -u invoiceme-backend -f

# Test health endpoint
curl http://localhost:8080/actuator/health

# Test from outside (replace with your EC2 IP)
curl http://<EC2_PUBLIC_IP>:8080/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### 3.5 Test API Endpoints

```bash
# Test login endpoint
curl -X POST http://<EC2_PUBLIC_IP>:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-admin-password"}'

# Should return JWT token
```

---

## Step 4: Frontend Deployment

**Note**: Due to dynamic routes in the application, Next.js is deployed as a server (not static export to S3). This allows all dynamic routes to work correctly.

### 4.1 Configure Frontend Environment

On your EC2 instance:

```bash
cd /opt/invoiceme/frontend

# Get EC2 IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "EC2 IP: $EC2_IP"

# Create production environment file
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=http://${EC2_IP}:8080/api
NEXT_PUBLIC_ENV=production
EOF

# Verify
cat .env.production
```

### 4.2 Build Frontend

```bash
cd /opt/invoiceme/frontend

# Install dependencies
npm ci

# Build application
npm run build
```

**Note**: The build will complete successfully. We're not using static export (`output: 'export'`) because the app has dynamic routes that need server-side rendering.

### 4.3 Create Frontend Systemd Service

```bash
# Get EC2 IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Create service file
sudo tee /etc/systemd/system/invoiceme-frontend.service > /dev/null << EOF
[Unit]
Description=InvoiceMe Frontend Application
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/invoiceme/frontend
Environment="NODE_ENV=production"
Environment="NEXT_PUBLIC_API_URL=http://${EC2_IP}:8080/api"
Environment="NEXT_PUBLIC_ENV=production"
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=append:/opt/invoiceme/logs/frontend.log
StandardError=append:/opt/invoiceme/logs/frontend-error.log

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable invoiceme-frontend
sudo systemctl start invoiceme-frontend

# Check status
sudo systemctl status invoiceme-frontend
```

### 4.4 Update Security Group

Allow inbound traffic on port 3000:

1. AWS Console → EC2 → Security Groups
2. Select your EC2 security group
3. Edit Inbound Rules → Add Rule:
   - **Type**: Custom TCP
   - **Port**: 3000
   - **Source**: 0.0.0.0/0 (or restrict to your IP)
   - **Description**: Next.js Frontend
4. Save rules

### 4.5 Verify Frontend Deployment

1. **Check Service Status**:
   ```bash
   sudo systemctl status invoiceme-frontend
   ```

2. **Check Port**:
   ```bash
   sudo ss -tlnp | grep 3000
   ```

3. **Access Website**:
   - Open `http://YOUR_EC2_IP:3000` in browser
   - Should see InvoiceMe login page

4. **Test Authentication**:
   - Login with admin credentials
   - Verify API connectivity
   - Test all features (customers, invoices, payments)

---

## Step 5: Configuration and Testing

### 5.1 Update CORS Settings

Ensure backend CORS allows your frontend origin:

```bash
# Get EC2 IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Update environment file
sudo sed -i "s|SPRING_WEB_CORS_ALLOWED_ORIGINS=.*|SPRING_WEB_CORS_ALLOWED_ORIGINS=http://${EC2_IP}:3000,http://localhost:3000|" /etc/invoiceme/environment

# Or manually edit
sudo nano /etc/invoiceme/environment
# Update: SPRING_WEB_CORS_ALLOWED_ORIGINS=http://YOUR_EC2_IP:3000,http://localhost:3000

# Restart backend to apply changes
sudo systemctl restart invoiceme-backend

# Verify CORS is set correctly
sudo systemctl show invoiceme-backend | grep CORS
```

**Note**: The `deploy-backend.sh` script automatically sets CORS with the EC2 IP. If you need to update it, edit `/etc/invoiceme/environment` and restart the service.

### 5.2 Test Complete Flow

1. **Access Frontend**: Open `http://YOUR_EC2_IP:3000`
2. **Login**: Use admin credentials
3. **Create Customer**: Test customer creation
4. **Create Invoice**: Test invoice creation
5. **Record Payment**: Test payment recording
6. **Verify Data**: Check data in database

### 5.3 Performance Testing

```bash
# Test API response times
time curl http://<EC2_PUBLIC_IP>:8080/api/customers

# Should be < 200ms for standard operations
```

---

## Step 6: Post-Deployment

### 6.1 Set Up Monitoring

**CloudWatch Alarms**:
- EC2 CPU utilization
- RDS connection count
- Application error rate

**Application Logs**:
```bash
# View application logs
sudo journalctl -u invoiceme-backend -f

# View log files
tail -f /opt/invoiceme/logs/application.log
```

### 6.2 Set Up Backups

**RDS Automated Backups**:
- Already enabled (7-day retention)
- Test restore procedure

**Application Backups**:
```bash
# Backup database
pg_dump -h <RDS_ENDPOINT> -U invoiceme_admin invoiceme > backup.sql

# Store in S3
aws s3 cp backup.sql s3://invoiceme-backups/$(date +%Y%m%d)/backup.sql
```

### 6.3 Configure Custom Domain (Optional)

1. **Route 53**: Create hosted zone
2. **S3**: Configure bucket for custom domain
3. **CloudFront**: Set up CDN (recommended)
4. **SSL Certificate**: Request ACM certificate
5. **Update CORS**: Add custom domain to allowed origins

### 6.4 Security Hardening

1. **Change Default Passwords**: Update admin password
2. **Rotate JWT Secret**: Generate new secret
3. **Restrict SSH Access**: Update security group
4. **Enable VPC Flow Logs**: Monitor network traffic
5. **Set Up WAF**: Use AWS WAF with ALB (if using)

---

## Troubleshooting

### Backend Not Starting

**Check logs**:
```bash
sudo journalctl -u invoiceme-backend -n 50
```

**Common issues**:
- Database connection failed → Check RDS security group
- Port already in use → Check if another process is using 8080
- Environment variables not set → Verify systemd service configuration

### Frontend Not Loading

**Check service status**:
```bash
sudo systemctl status invoiceme-frontend
sudo journalctl -u invoiceme-frontend -n 50
```

**Check port**:
```bash
sudo ss -tlnp | grep 3000
```

**Common issues**:
- Service not running → Check logs for errors
- Port 3000 not accessible → Check security group allows port 3000
- Build failed → Check Node.js/npm installation
- Environment variables not set → Verify `.env.production` file

### API Connection Errors

**Check CORS**:
- Verify `SPRING_WEB_CORS_ALLOWED_ORIGINS` includes frontend URL (`http://EC2_IP:3000`)
- Check browser console for CORS errors
- Test CORS: `curl -H "Origin: http://EC2_IP:3000" -X OPTIONS http://EC2_IP:8080/api/auth/login -v`

**Check Security Groups**:
- EC2 security group allows port 8080 (backend)
- EC2 security group allows port 3000 (frontend)
- RDS security group allows EC2 security group

### Database Connection Issues

**Test connection**:
```bash
psql -h <RDS_ENDPOINT> -U invoiceme_admin -d invoiceme
```

**Common issues**:
- Security group not configured → Add EC2 security group to RDS
- Wrong endpoint → Verify RDS endpoint URL
- Wrong credentials → Check environment variables

---

## Rollback Procedures

### Rollback Backend

```bash
# Stop service
sudo systemctl stop invoiceme-backend

# Restore previous version
cd /opt/invoiceme/backend
git checkout <previous-commit>
sudo ./deploy-backend.sh production

# Or restore from backup JAR
sudo cp /opt/invoiceme/backups/invoiceme-backend-previous.jar /opt/invoiceme/invoiceme-backend.jar
sudo systemctl restart invoiceme-backend
```

### Rollback Frontend

```bash
# Stop service
sudo systemctl stop invoiceme-frontend

# Restore previous build
cd /opt/invoiceme/frontend
git checkout <previous-commit>
npm run build

# Restart service
sudo systemctl start invoiceme-frontend

# Or restore from backup
sudo cp /opt/invoiceme/backups/frontend-previous /opt/invoiceme/frontend
sudo systemctl restart invoiceme-frontend
```

### Rollback Database

**RDS Point-in-Time Recovery**:
1. Go to RDS console
2. Select database → Actions → Restore to point in time
3. Select restore point
4. Create new database instance
5. Update `SPRING_DATASOURCE_URL` in `/etc/invoiceme/environment`
6. Restart backend: `sudo systemctl restart invoiceme-backend`

---

## Maintenance

### Regular Tasks

**Weekly**:
- Review application logs
- Check CloudWatch metrics
- Verify backups are running

**Monthly**:
- Update dependencies
- Review security groups
- Rotate secrets (if needed)
- Performance optimization review

**Quarterly**:
- Full security audit
- Disaster recovery test
- Cost optimization review

### Updates and Upgrades

1. **Test in staging** first
2. **Backup database** before updates
3. **Deploy during low-traffic** periods
4. **Monitor** after deployment
5. **Rollback** if issues occur

---

## Additional Resources

- [AWS Setup Guide](docs/AWS_SETUP.md)
- [Environment Variables](docs/ENVIRONMENT_VARIABLES.md)
- [Technical Documentation](docs/TECHNICAL_WRITEUP.md)
- [API Documentation](API.md)

---

## Support

For issues or questions:
1. Check logs and error messages
2. Review troubleshooting section
3. Check AWS service health
4. Review documentation
5. Contact system administrator

---

**Last Updated**: PR33 - AWS Deployment Preparation

