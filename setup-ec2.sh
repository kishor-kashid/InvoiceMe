#!/bin/bash

# InvoiceMe EC2 Setup Script
# This script installs Java 17, Maven, and PostgreSQL client tools on an EC2 instance
# Compatible with Amazon Linux 2023 and Ubuntu 22.04 LTS

set -e  # Exit on error

echo "========================================="
echo "InvoiceMe EC2 Environment Setup"
echo "========================================="
echo ""

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    OS_VERSION=$VERSION_ID
else
    echo "Error: Cannot detect OS"
    exit 1
fi

echo "Detected OS: $OS"
echo ""

# Update system packages
echo "Updating system packages..."
if [ "$OS" = "amzn" ] || [ "$OS" = "amazon" ]; then
    # Amazon Linux 2023
    sudo dnf update -y
    sudo dnf install -y wget curl git
elif [ "$OS" = "ubuntu" ]; then
    # Ubuntu
    sudo apt-get update -y
    sudo apt-get install -y wget curl git
else
    echo "Error: Unsupported OS. This script supports Amazon Linux 2023 and Ubuntu 22.04"
    exit 1
fi

echo "✓ System packages updated"
echo ""

# Install Java 17
echo "Installing Java 17..."
if [ "$OS" = "amzn" ] || [ "$OS" = "amazon" ]; then
    # Amazon Linux 2023
    sudo dnf install -y java-17-amazon-corretto-devel
elif [ "$OS" = "ubuntu" ]; then
    # Ubuntu
    sudo apt-get install -y openjdk-17-jdk
fi

# Verify Java installation
JAVA_VERSION=$(java -version 2>&1 | head -n 1)
echo "✓ Java installed: $JAVA_VERSION"

# Set JAVA_HOME
if [ "$OS" = "amzn" ] || [ "$OS" = "amazon" ]; then
    export JAVA_HOME=/usr/lib/jvm/java-17-amazon-corretto
elif [ "$OS" = "ubuntu" ]; then
    export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
fi

# Add JAVA_HOME to profile
if ! grep -q "JAVA_HOME" ~/.bashrc; then
    echo "" >> ~/.bashrc
    echo "# Java Home" >> ~/.bashrc
    echo "export JAVA_HOME=$JAVA_HOME" >> ~/.bashrc
    echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> ~/.bashrc
fi

echo "✓ JAVA_HOME configured: $JAVA_HOME"
echo ""

# Install Maven
echo "Installing Maven..."
MAVEN_VERSION="3.9.5"
MAVEN_HOME="/opt/maven"

if [ ! -d "$MAVEN_HOME" ]; then
    cd /tmp
    wget "https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz"
    sudo tar -xzf "apache-maven-$MAVEN_VERSION-bin.tar.gz" -C /opt
    sudo mv "/opt/apache-maven-$MAVEN_VERSION" "$MAVEN_HOME"
    sudo rm "apache-maven-$MAVEN_VERSION-bin.tar.gz"
fi

# Add Maven to PATH
if ! grep -q "MAVEN_HOME" ~/.bashrc; then
    echo "" >> ~/.bashrc
    echo "# Maven Home" >> ~/.bashrc
    echo "export MAVEN_HOME=$MAVEN_HOME" >> ~/.bashrc
    echo "export PATH=\$MAVEN_HOME/bin:\$PATH" >> ~/.bashrc
fi

# Verify Maven installation
export MAVEN_HOME=$MAVEN_HOME
export PATH=$MAVEN_HOME/bin:$PATH
MAVEN_VERSION_OUTPUT=$(mvn -version 2>&1 | head -n 1)
echo "✓ Maven installed: $MAVEN_VERSION_OUTPUT"
echo ""

# Install PostgreSQL client tools
echo "Installing PostgreSQL client tools..."
if [ "$OS" = "amzn" ] || [ "$OS" = "amazon" ]; then
    # Amazon Linux 2023
    sudo dnf install -y postgresql15
elif [ "$OS" = "ubuntu" ]; then
    # Ubuntu
    sudo apt-get install -y postgresql-client
fi

# Verify PostgreSQL client
PSQL_VERSION=$(psql --version)
echo "✓ PostgreSQL client installed: $PSQL_VERSION"
echo ""

# Install additional tools
echo "Installing additional tools..."
if [ "$OS" = "amzn" ] || [ "$OS" = "amazon" ]; then
    sudo dnf install -y htop nano unzip
elif [ "$OS" = "ubuntu" ]; then
    sudo apt-get install -y htop nano unzip
fi

echo "✓ Additional tools installed"
echo ""

# Create application directory
echo "Creating application directory..."
APP_DIR="/opt/invoiceme"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR
echo "✓ Application directory created: $APP_DIR"
echo ""

# Install AWS CLI (if not already installed)
echo "Checking AWS CLI..."
if ! command -v aws &> /dev/null; then
    echo "Installing AWS CLI..."
    if [ "$OS" = "amzn" ] || [ "$OS" = "amazon" ]; then
        # Amazon Linux 2023
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        rm -rf aws awscliv2.zip
    elif [ "$OS" = "ubuntu" ]; then
        # Ubuntu
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        rm -rf aws awscliv2.zip
    fi
    echo "✓ AWS CLI installed"
else
    echo "✓ AWS CLI already installed"
fi
echo ""

# Summary
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Installed components:"
echo "  - Java 17: $(java -version 2>&1 | head -n 1)"
echo "  - Maven: $(mvn -version 2>&1 | head -n 1)"
echo "  - PostgreSQL client: $(psql --version)"
echo "  - AWS CLI: $(aws --version 2>&1)"
echo ""
echo "Environment variables configured in ~/.bashrc:"
echo "  - JAVA_HOME=$JAVA_HOME"
echo "  - MAVEN_HOME=$MAVEN_HOME"
echo ""
echo "Next steps:"
echo "  1. Source your profile: source ~/.bashrc"
echo "  2. Configure environment variables (see .env.production.example)"
echo "  3. Clone repository: git clone <your-repo-url> $APP_DIR"
echo "  4. Run deployment script: ./deploy-backend.sh"
echo ""
echo "Note: You may need to log out and log back in for environment variables to take effect."
echo ""

