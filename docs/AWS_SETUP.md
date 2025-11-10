# AWS Infrastructure Setup Guide

This guide provides step-by-step instructions for setting up AWS infrastructure for InvoiceMe deployment, including RDS PostgreSQL, EC2 for backend, and S3 for frontend hosting.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS RDS PostgreSQL Setup](#aws-rds-postgresql-setup)
3. [AWS EC2 Instance Setup](#aws-ec2-instance-setup)
4. [AWS S3 Bucket Setup](#aws-s3-bucket-setup)
5. [Security Groups Configuration](#security-groups-configuration)
6. [Network Configuration](#network-configuration)
7. [Cost Estimation](#cost-estimation)

---

## Prerequisites

Before starting, ensure you have:

- AWS Account with appropriate permissions
- AWS CLI installed and configured (`aws configure`)
- SSH key pair for EC2 access
- Basic knowledge of AWS services (RDS, EC2, S3, VPC)
- Domain name (optional, for custom domain setup)

---

## AWS RDS PostgreSQL Setup

### Step 1: Create RDS Subnet Group

1. Navigate to **RDS** → **Subnet Groups** in AWS Console
2. Click **Create DB subnet group**
3. Configure:
   - **Name**: `invoiceme-db-subnet-group`
   - **Description**: Subnet group for InvoiceMe PostgreSQL database
   - **VPC**: Select your VPC (or create a new one)
   - **Availability Zones**: Select at least 2 zones (e.g., `us-east-1a`, `us-east-1b`)
   - **Subnets**: Select subnets in different availability zones
4. Click **Create**

### Step 2: Create RDS PostgreSQL Instance

1. Navigate to **RDS** → **Databases** → **Create database**
2. Select **PostgreSQL** engine
3. Choose **Production** template (or **Free tier** for testing)
4. Configure database settings:
   - **DB instance identifier**: `invoiceme-db`
   - **Master username**: `invoiceme_admin` (or your preferred username)
   - **Master password**: Generate a strong password (save securely!)
   - **DB instance class**: 
     - **Free tier**: `db.t3.micro` (1 vCPU, 1 GB RAM)
     - **Production**: `db.t3.small` (2 vCPU, 2 GB RAM) or larger
   - **Storage**: 
     - **Type**: General Purpose SSD (gp3)
     - **Allocated storage**: 20 GB (minimum, increase for production)
     - **Storage autoscaling**: Enable (recommended)
   - **VPC**: Select your VPC
   - **Subnet group**: Select `invoiceme-db-subnet-group`
   - **Public access**: **No** (for security)
   - **VPC security group**: Create new or select existing
     - **Security group name**: `invoiceme-db-sg`
   - **Availability Zone**: Leave default (multi-AZ for production)
   - **Database name**: `invoiceme`
   - **DB parameter group**: Default
   - **Backup retention**: 7 days (production), 1 day (testing)
   - **Encryption**: Enable (recommended)
5. Click **Create database**

### Step 3: Configure RDS Security Group

1. Navigate to **EC2** → **Security Groups**
2. Select `invoiceme-db-sg`
3. Edit **Inbound rules**:
   - **Type**: PostgreSQL
   - **Protocol**: TCP
   - **Port**: 5432
   - **Source**: Select the security group of your EC2 instance (created below)
   - **Description**: Allow PostgreSQL access from EC2
4. Save rules

### Step 4: Retrieve RDS Connection Details

After RDS instance is created (takes 5-10 minutes):

1. Navigate to **RDS** → **Databases** → Select `invoiceme-db`
2. Note the **Endpoint** (e.g., `invoiceme-db.xxxxx.us-east-1.rds.amazonaws.com`)
3. Note the **Port** (default: 5432)
4. Save these details for environment variables configuration

**Connection String Format**:
```
jdbc:postgresql://invoiceme-db.xxxxx.us-east-1.rds.amazonaws.com:5432/invoiceme
```

---

## AWS EC2 Instance Setup

### Step 1: Create EC2 Key Pair

1. Navigate to **EC2** → **Key Pairs** → **Create key pair**
2. Configure:
   - **Name**: `invoiceme-ec2-key`
   - **Key pair type**: RSA
   - **Private key file format**: `.pem` (for Linux/Mac) or `.ppk` (for PuTTY)
3. Click **Create key pair**
4. **Download and save securely** - you cannot download again!

### Step 2: Create EC2 Security Group

1. Navigate to **EC2** → **Security Groups** → **Create security group**
2. Configure:
   - **Name**: `invoiceme-backend-sg`
   - **Description**: Security group for InvoiceMe backend API
   - **VPC**: Select your VPC
3. Add **Inbound rules**:
   - **SSH (22)**: 
     - Type: SSH
     - Source: My IP (or specific IP for security)
     - Description: SSH access for administration
   - **HTTP (8080)**:
     - Type: Custom TCP
     - Port: 8080
     - Source: 0.0.0.0/0 (or restrict to specific IPs/ALB)
     - Description: Backend API access
   - **HTTPS (443)** (if using Application Load Balancer):
     - Type: HTTPS
     - Source: 0.0.0.0/0
     - Description: HTTPS access via ALB
4. Add **Outbound rules** (default: All traffic)
5. Click **Create security group**

### Step 3: Launch EC2 Instance

1. Navigate to **EC2** → **Instances** → **Launch instance**
2. Configure:
   - **Name**: `invoiceme-backend`
   - **AMI**: Amazon Linux 2023 (or Ubuntu 22.04 LTS)
   - **Instance type**: 
     - **Testing**: `t3.micro` (1 vCPU, 1 GB RAM) - Free tier eligible
     - **Production**: `t3.small` (2 vCPU, 2 GB RAM) or `t3.medium` (2 vCPU, 4 GB RAM)
   - **Key pair**: Select `invoiceme-ec2-key`
   - **Network settings**:
     - **VPC**: Select your VPC
     - **Subnet**: Select public subnet (for direct access) or private (for ALB)
     - **Auto-assign public IP**: Enable (if public subnet)
     - **Security group**: Select `invoiceme-backend-sg`
   - **Storage**: 
     - **Size**: 20 GB (gp3 SSD)
     - **Delete on termination**: Disable (for production)
   - **Advanced details** (optional):
     - **IAM role**: Create role with S3 access (if needed)
     - **User data**: Can add initialization script here
3. Click **Launch instance**

### Step 4: Connect to EC2 Instance

1. Wait for instance to be in **Running** state
2. Note the **Public IPv4 address** (or use Elastic IP)
3. Connect via SSH:
   ```bash
   # Linux/Mac
   ssh -i invoiceme-ec2-key.pem ec2-user@<PUBLIC_IP>
   
   # For Ubuntu AMI, use:
   ssh -i invoiceme-ec2-key.pem ubuntu@<PUBLIC_IP>
   ```

### Step 5: Setup EC2 Environment

Run the `setup-ec2.sh` script on the EC2 instance to install:
- Java 17
- Maven
- PostgreSQL client tools
- System dependencies

See `setup-ec2.sh` for details.

---

## AWS S3 Bucket Setup

### Step 1: Create S3 Bucket

1. Navigate to **S3** → **Create bucket**
2. Configure:
   - **Bucket name**: `invoiceme-frontend` (must be globally unique)
   - **AWS Region**: Select same region as EC2/RDS
   - **Object Ownership**: ACLs disabled (recommended)
   - **Block Public Access**: **Uncheck** (required for static website hosting)
   - **Bucket Versioning**: Enable (recommended for production)
   - **Default encryption**: Enable (AES-256)
   - **Bucket policy**: Will configure in next step
3. Click **Create bucket**

### Step 2: Enable Static Website Hosting

1. Select your bucket → **Properties** tab
2. Scroll to **Static website hosting**
3. Click **Edit**:
   - **Static website hosting**: Enable
   - **Hosting type**: Static website hosting
   - **Index document**: `index.html`
   - **Error document**: `404.html` (or `index.html` for SPA)
4. Click **Save changes**
5. Note the **Bucket website endpoint** (e.g., `http://invoiceme-frontend.s3-website-us-east-1.amazonaws.com`)

### Step 3: Configure Bucket Policy

1. Select your bucket → **Permissions** tab
2. Scroll to **Bucket policy**
3. Click **Edit** and add:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::invoiceme-frontend/*"
       }
     ]
   }
   ```
4. Replace `invoiceme-frontend` with your bucket name
5. Click **Save changes**

### Step 4: Configure CORS (Optional)

If your frontend needs to make API calls to a different domain:

1. Select your bucket → **Permissions** tab
2. Scroll to **Cross-origin resource sharing (CORS)**
3. Click **Edit** and add:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "HEAD"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```
4. Click **Save changes**

### Step 5: Upload Frontend Build

Use the `deploy-frontend.sh` script to build and upload:

```bash
./deploy-frontend.sh
```

Or manually:
```bash
cd frontend
npm run build
aws s3 sync .next/static s3://invoiceme-frontend/_next/static
aws s3 sync out s3://invoiceme-frontend --delete
```

---

## Security Groups Configuration

### Summary of Security Groups

1. **invoiceme-db-sg** (RDS):
   - Inbound: PostgreSQL (5432) from EC2 security group
   - Outbound: All traffic

2. **invoiceme-backend-sg** (EC2):
   - Inbound: 
     - SSH (22) from your IP
     - Custom TCP (8080) from 0.0.0.0/0 (or ALB security group)
   - Outbound: All traffic

### Best Practices

- **Restrict SSH access** to specific IP addresses
- **Use Application Load Balancer (ALB)** for production (recommended)
- **Enable VPC Flow Logs** for monitoring
- **Use AWS WAF** with ALB for additional security
- **Regularly rotate** database passwords and JWT secrets

---

## Network Configuration

### VPC Setup (If creating new VPC)

1. **Create VPC**:
   - **CIDR**: `10.0.0.0/16`
   - **Name**: `invoiceme-vpc`

2. **Create Subnets**:
   - **Public Subnet 1**: `10.0.1.0/24` (us-east-1a) - for EC2
   - **Public Subnet 2**: `10.0.2.0/24` (us-east-1b) - for EC2 (optional)
   - **Private Subnet 1**: `10.0.3.0/24` (us-east-1a) - for RDS
   - **Private Subnet 2**: `10.0.4.0/24` (us-east-1b) - for RDS

3. **Internet Gateway**:
   - Attach to VPC for public subnet internet access

4. **Route Tables**:
   - Public route table: Route `0.0.0.0/0` to Internet Gateway
   - Private route table: No internet route (RDS doesn't need internet)

5. **NAT Gateway** (if EC2 in private subnet):
   - Create in public subnet
   - Update private route table to route `0.0.0.0/0` to NAT Gateway

---

## Cost Estimation

### Monthly Costs (Approximate, US East region)

**Free Tier Eligible (First 12 months)**:
- RDS: `db.t3.micro` - **Free** (750 hours/month)
- EC2: `t3.micro` - **Free** (750 hours/month)
- S3: 5 GB storage - **Free**
- **Total**: ~$0/month (within free tier limits)

**Production (Small Scale)**:
- RDS: `db.t3.small` - **~$30/month**
- EC2: `t3.small` - **~$15/month**
- S3: 20 GB storage + requests - **~$1/month**
- Data transfer: **~$5/month**
- **Total**: ~$50-60/month

**Production (Medium Scale)**:
- RDS: `db.t3.medium` - **~$60/month**
- EC2: `t3.medium` - **~$30/month**
- ALB: **~$20/month**
- S3: 50 GB storage - **~$2/month**
- Data transfer: **~$10/month**
- **Total**: ~$120-150/month

### Cost Optimization Tips

1. Use **Reserved Instances** for predictable workloads (save 30-50%)
2. Enable **S3 Lifecycle Policies** to move old files to Glacier
3. Use **CloudWatch** to monitor and optimize resource usage
4. Consider **AWS Lightsail** for simpler deployments (fixed pricing)
5. Use **Auto Scaling** to scale down during low-traffic periods

---

## Next Steps

After completing AWS infrastructure setup:

1. ✅ Run `setup-ec2.sh` on EC2 instance
2. ✅ Configure environment variables (see `.env.production.example`)
3. ✅ Deploy backend using `deploy-backend.sh`
4. ✅ Deploy frontend using `deploy-frontend.sh`
5. ✅ Test production deployment
6. ✅ Configure custom domain (optional)
7. ✅ Set up monitoring and alerts

See `docs/DEPLOYMENT.md` for detailed deployment steps.

---

## Troubleshooting

### RDS Connection Issues

- **Check security group**: Ensure EC2 security group is allowed in RDS security group
- **Check VPC**: Ensure RDS and EC2 are in same VPC or have VPC peering
- **Check endpoint**: Verify RDS endpoint is correct
- **Test connection**: Use `psql` from EC2 to test database connectivity

### EC2 Access Issues

- **Check security group**: Ensure SSH port 22 is open to your IP
- **Check key pair**: Verify correct `.pem` file and permissions (`chmod 400`)
- **Check instance state**: Ensure instance is running
- **Check public IP**: Verify instance has public IP (if using public subnet)

### S3 Website Not Loading

- **Check bucket policy**: Ensure public read access is configured
- **Check static website hosting**: Ensure enabled with correct index document
- **Check CORS**: If making API calls, ensure CORS is configured
- **Check file paths**: Verify files are uploaded to correct paths

---

## Additional Resources

- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS VPC Documentation](https://docs.aws.amazon.com/vpc/)
- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)

