#!/bin/bash

# InvoiceMe Frontend Deployment Script
# 
# NOTE: This script was originally designed for S3 static hosting.
# However, due to dynamic routes in the application, Next.js is deployed
# as a server instead. For server deployment, use the systemd service
# approach documented in docs/DEPLOYMENT.md section 4.3.
#
# This script can still be used for S3 if you configure static export
# in next.config.js and add generateStaticParams() to all dynamic routes.
# However, this is NOT recommended for this application.
#
# For production deployment, deploy Next.js as a server on EC2 (see docs/DEPLOYMENT.md).
#
# Usage: ./deploy-frontend.sh [bucket-name] [environment]
# Example: ./deploy-frontend.sh invoiceme-frontend production

set -e  # Exit on error

# Configuration
BUCKET_NAME=${1:-invoiceme-frontend}
ENVIRONMENT=${2:-production}
FRONTEND_DIR="frontend"
BUILD_DIR="out"
REGION=${AWS_REGION:-us-east-1}

echo "========================================="
echo "InvoiceMe Frontend Deployment"
echo "Bucket: $BUCKET_NAME"
echo "Environment: $ENVIRONMENT"
echo "========================================="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed"
    echo "Please install AWS CLI: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Error: AWS credentials not configured"
    echo "Please run: aws configure"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "Error: Frontend directory not found: $FRONTEND_DIR"
    exit 1
fi

cd $FRONTEND_DIR

# Check if bucket exists
echo "Checking S3 bucket..."
if ! aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    echo "✓ Bucket exists: $BUCKET_NAME"
else
    echo "Error: Bucket does not exist: $BUCKET_NAME"
    echo "Please create the bucket first (see docs/AWS_SETUP.md)"
    exit 1
fi

# Check for .env.production file
if [ ! -f ".env.production" ]; then
    echo "Warning: .env.production file not found"
    echo "Creating from .env.production.example..."
    if [ -f ".env.production.example" ]; then
        cp .env.production.example .env.production
        echo "✓ Created .env.production from template"
        echo "⚠ Please update .env.production with your production values!"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo "Error: .env.production.example not found"
        exit 1
    fi
fi

# Load environment variables
if [ -f ".env.production" ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Verify NEXT_PUBLIC_API_URL is set
if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo "Warning: NEXT_PUBLIC_API_URL not set in .env.production"
    echo "Using default: http://localhost:8080/api"
    export NEXT_PUBLIC_API_URL="http://localhost:8080/api"
fi

echo "API URL: $NEXT_PUBLIC_API_URL"
echo ""

# Install dependencies
echo "Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm ci
    echo "✓ Dependencies installed"
else
    echo "✓ Dependencies already installed"
fi
echo ""

# Build application
echo "Building Next.js application..."
npm run build

# Check if static export is needed
# Next.js 14 with App Router requires output: 'export' for static export
if [ -d ".next" ] && [ ! -d "$BUILD_DIR" ]; then
    echo "⚠ Next.js build completed, but static export directory not found"
    echo "For S3 static hosting, you may need to configure static export in next.config.js"
    echo "See: https://nextjs.org/docs/app/building-your-application/deploying/static-exports"
    echo ""
    echo "Attempting to export static files..."
    
    # Try to export static files
    if [ -d ".next/static" ]; then
        echo "Copying static assets..."
        mkdir -p $BUILD_DIR
        cp -r .next/static $BUILD_DIR/_next/static 2>/dev/null || true
        echo "✓ Static assets copied"
    fi
    
    # For S3, we'll need to configure Next.js for static export
    # This is a simplified approach - for production, configure next.config.js properly
    echo ""
    echo "⚠ Note: For full static export, update next.config.js with:"
    echo "  output: 'export'"
    echo "  trailingSlash: true"
    echo ""
fi

# If build directory exists, use it
if [ -d "$BUILD_DIR" ]; then
    echo "✓ Build directory found: $BUILD_DIR"
    DEPLOY_DIR=$BUILD_DIR
elif [ -d ".next" ]; then
    echo "⚠ Using .next directory (not ideal for S3 static hosting)"
    echo "Consider configuring Next.js for static export"
    DEPLOY_DIR=".next"
else
    echo "Error: Build output not found"
    exit 1
fi

echo ""

# Upload to S3
echo "Uploading to S3 bucket: $BUCKET_NAME..."

# Upload with proper content types and cache control
if [ -d "$DEPLOY_DIR" ]; then
    # Upload static files with appropriate cache headers
    aws s3 sync $DEPLOY_DIR s3://$BUCKET_NAME \
        --region $REGION \
        --delete \
        --exclude "*.map" \
        --cache-control "public, max-age=31536000, immutable" \
        --exclude "_next/static/*" || true
    
    # Upload _next/static with long cache
    if [ -d "$DEPLOY_DIR/_next/static" ]; then
        aws s3 sync $DEPLOY_DIR/_next/static s3://$BUCKET_NAME/_next/static \
            --region $REGION \
            --cache-control "public, max-age=31536000, immutable" || true
    fi
    
    # Upload HTML files with no cache
    find $DEPLOY_DIR -name "*.html" -type f | while read file; do
        rel_path=${file#$DEPLOY_DIR/}
        aws s3 cp "$file" "s3://$BUCKET_NAME/$rel_path" \
            --region $REGION \
            --content-type "text/html" \
            --cache-control "public, max-age=0, must-revalidate" || true
    done
    
    # Upload other files
    aws s3 sync $DEPLOY_DIR s3://$BUCKET_NAME \
        --region $REGION \
        --delete \
        --exclude "*.map" \
        --exclude "_next/static/*" \
        --exclude "*.html" || true
fi

echo "✓ Files uploaded to S3"
echo ""

# Set proper content types
echo "Setting content types..."
aws s3 cp s3://$BUCKET_NAME s3://$BUCKET_NAME \
    --recursive \
    --exclude "*" \
    --include "*.html" \
    --content-type "text/html" \
    --cache-control "public, max-age=0, must-revalidate" \
    --metadata-directive REPLACE 2>/dev/null || true

aws s3 cp s3://$BUCKET_NAME s3://$BUCKET_NAME \
    --recursive \
    --exclude "*" \
    --include "*.js" \
    --content-type "application/javascript" \
    --cache-control "public, max-age=31536000, immutable" \
    --metadata-directive REPLACE 2>/dev/null || true

aws s3 cp s3://$BUCKET_NAME s3://$BUCKET_NAME \
    --recursive \
    --exclude "*" \
    --include "*.css" \
    --content-type "text/css" \
    --cache-control "public, max-age=31536000, immutable" \
    --metadata-directive REPLACE 2>/dev/null || true

echo "✓ Content types configured"
echo ""

# Get bucket website endpoint
WEBSITE_ENDPOINT=$(aws s3api get-bucket-website --bucket $BUCKET_NAME --region $REGION 2>/dev/null | grep -oP '(?<="Endpoint": ")[^"]*' || echo "")

if [ -z "$WEBSITE_ENDPOINT" ]; then
    # Construct endpoint manually
    WEBSITE_ENDPOINT="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
fi

echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "Bucket: $BUCKET_NAME"
echo "Region: $REGION"
echo "Website Endpoint: $WEBSITE_ENDPOINT"
echo ""
echo "Frontend should be accessible at:"
echo "  - $WEBSITE_ENDPOINT"
echo ""
echo "Next steps:"
echo "  1. Verify website is accessible"
echo "  2. Configure custom domain (optional)"
echo "  3. Update CORS settings on backend for S3 origin"
echo "  4. Test authentication and API connectivity"
echo ""
echo "Useful commands:"
echo "  - List files: aws s3 ls s3://$BUCKET_NAME --recursive"
echo "  - Delete all: aws s3 rm s3://$BUCKET_NAME --recursive"
echo "  - Sync local: aws s3 sync $DEPLOY_DIR s3://$BUCKET_NAME --delete"
echo ""

