#!/bin/bash

# InvoiceMe Backend Deployment Script
# This script deploys the InvoiceMe backend to an EC2 instance
# Usage: ./deploy-backend.sh [environment]
# Example: ./deploy-backend.sh production

set -e  # Exit on error

# Configuration
ENVIRONMENT=${1:-production}
APP_DIR="/opt/invoiceme"
BACKEND_DIR="$APP_DIR/backend"
SERVICE_NAME="invoiceme-backend"
SERVICE_USER="invoiceme"

echo "========================================="
echo "InvoiceMe Backend Deployment"
echo "Environment: $ENVIRONMENT"
echo "========================================="
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "This script requires sudo privileges for service management."
    echo "Please run with: sudo ./deploy-backend.sh"
    exit 1
fi

# Check if application directory exists
if [ ! -d "$APP_DIR" ]; then
    echo "Error: Application directory not found: $APP_DIR"
    echo "Please clone the repository first:"
    echo "  git clone <your-repo-url> $APP_DIR"
    exit 1
fi

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo "Error: Backend directory not found: $BACKEND_DIR"
    exit 1
fi

cd $BACKEND_DIR

# Check if environment file exists
echo "Checking environment file..."
if [ ! -f "/etc/invoiceme/environment" ]; then
    echo "Warning: Environment file not found: /etc/invoiceme/environment"
    echo "Please create it with the following variables:"
    echo "  - SPRING_DATASOURCE_URL"
    echo "  - SPRING_DATASOURCE_USERNAME"
    echo "  - SPRING_DATASOURCE_PASSWORD"
    echo "  - JWT_SECRET"
    echo "  - ADMIN_USERNAME"
    echo "  - ADMIN_PASSWORD"
    echo "  - ADMIN_EMAIL"
    echo "  - SPRING_WEB_CORS_ALLOWED_ORIGINS"
    echo "  - PORT"
    echo ""
    echo "See env.production.example for template."
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create service user if it doesn't exist
if ! id "$SERVICE_USER" &>/dev/null; then
    echo "Creating service user: $SERVICE_USER..."
    useradd -r -s /bin/false $SERVICE_USER
    echo "✓ Service user created"
fi

# Stop existing service if running
if systemctl is-active --quiet $SERVICE_NAME; then
    echo "Stopping existing service..."
    systemctl stop $SERVICE_NAME
    echo "✓ Service stopped"
fi

# Pull latest code (if using git)
if [ -d ".git" ]; then
    echo "Pulling latest code..."
    git pull origin main || git pull origin master
    echo "✓ Code updated"
fi

# Build application
echo "Building application..."
cd $BACKEND_DIR

# Use Maven wrapper if available, otherwise use system Maven
if [ -f "./mvnw" ]; then
    chmod +x ./mvnw
    ./mvnw clean package -DskipTests
    JAR_FILE=$(find target -name "*.jar" -not -name "*sources.jar" -not -name "*javadoc.jar" | head -n 1)
else
    mvn clean package -DskipTests
    JAR_FILE=$(find target -name "*.jar" -not -name "*sources.jar" -not -name "*javadoc.jar" | head -n 1)
fi

if [ -z "$JAR_FILE" ]; then
    echo "Error: JAR file not found after build"
    exit 1
fi

echo "✓ Application built: $JAR_FILE"
echo ""

# Create application directory structure
echo "Setting up application directories..."
mkdir -p $APP_DIR/logs
mkdir -p $APP_DIR/config
mkdir -p $APP_DIR/backups
chown -R $SERVICE_USER:$SERVICE_USER $APP_DIR
echo "✓ Directories created"
echo ""

# Copy JAR file
echo "Installing application..."
cp $JAR_FILE $APP_DIR/invoiceme-backend.jar
chown $SERVICE_USER:$SERVICE_USER $APP_DIR/invoiceme-backend.jar
echo "✓ Application installed"
echo ""

# Get EC2 IP for CORS (if not already set in environment file)
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")

# Create systemd service file
echo "Creating systemd service..."
cat > /etc/systemd/system/$SERVICE_NAME.service <<EOF
[Unit]
Description=InvoiceMe Backend Application
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
Group=$SERVICE_USER
WorkingDirectory=$APP_DIR
EnvironmentFile=/etc/invoiceme/environment
Environment="SPRING_WEB_CORS_ALLOWED_ORIGINS=http://${EC2_IP}:3000,http://localhost:3000"
ExecStart=/usr/bin/java -jar $APP_DIR/invoiceme-backend.jar --spring.profiles.active=$ENVIRONMENT
Restart=always
RestartSec=10
StandardOutput=append:$APP_DIR/logs/application.log
StandardError=append:$APP_DIR/logs/application-error.log

[Install]
WantedBy=multi-user.target
EOF

# Ensure environment file is readable
if [ -f "/etc/invoiceme/environment" ]; then
    chmod 644 /etc/invoiceme/environment
fi

# Reload systemd
systemctl daemon-reload
echo "✓ Systemd service created"
echo ""

# Enable service to start on boot
systemctl enable $SERVICE_NAME
echo "✓ Service enabled to start on boot"
echo ""

# Start service
echo "Starting service..."
systemctl start $SERVICE_NAME
echo "✓ Service started"
echo ""

# Wait for service to be ready
echo "Waiting for service to be ready..."
sleep 5

# Check service status
if systemctl is-active --quiet $SERVICE_NAME; then
    echo "✓ Service is running"
else
    echo "⚠ Warning: Service may not be running correctly"
    echo "Check logs with: sudo journalctl -u $SERVICE_NAME -f"
    echo "Or check application logs: tail -f $APP_DIR/logs/application.log"
fi
echo ""

# Display service information
echo "========================================="
echo "Deployment Complete!"
echo "========================================="
echo ""
echo "Service: $SERVICE_NAME"
echo "Status: $(systemctl is-active $SERVICE_NAME)"
echo "JAR File: $APP_DIR/invoiceme-backend.jar"
echo "Logs: $APP_DIR/logs/application.log"
echo ""
echo "Useful commands:"
echo "  - View logs: sudo journalctl -u $SERVICE_NAME -f"
echo "  - Restart: sudo systemctl restart $SERVICE_NAME"
echo "  - Stop: sudo systemctl stop $SERVICE_NAME"
echo "  - Status: sudo systemctl status $SERVICE_NAME"
echo ""
echo "Application should be accessible at:"
echo "  - http://localhost:8080"
echo "  - http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080"
echo ""
echo "Health check endpoint:"
echo "  - http://localhost:8080/actuator/health"
echo ""

