#!/bin/bash

set -e

echo "🚀 Setting up TalentCloud development environment..."

# Set script permissions
echo "🔧 Setting script permissions..."
find . -name "*.sh" -type f -exec chmod +x {} \; 2>/dev/null || true

# Function to detect OS
detect_os() {
    if command -v apt-get >/dev/null 2>&1; then
        echo "debian"
    elif command -v yum >/dev/null 2>&1; then
        echo "rhel"
    elif command -v brew >/dev/null 2>&1; then
        echo "macos"
    elif command -v pacman >/dev/null 2>&1; then
        echo "arch"
    else
        echo "unknown"
    fi
}

# Verify GPG installation
echo "🔍 Checking GPG installation..."
if command -v gpg >/dev/null 2>&1; then
    GPG_VERSION=$(gpg --version | head -n1)
    echo "✅ GPG found: $GPG_VERSION"
else
    echo "⚠️  GPG not found. Installing..."
    
    OS_TYPE=$(detect_os)
    case "$OS_TYPE" in
        "debian")
            echo "📦 Installing GPG on Debian/Ubuntu..."
            sudo apt update && sudo apt install -y gnupg
            ;;
        "rhel")
            echo "📦 Installing GPG on CentOS/RHEL..."
            sudo yum install -y gnupg2
            ;;
        "macos")
            echo "📦 Installing GPG on macOS..."
            if command -v brew >/dev/null 2>&1; then
                brew install gnupg
            else
                echo "❌ Homebrew not found. Please install Homebrew first:"
                echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                exit 1
            fi
            ;;
        "arch")
            echo "📦 Installing GPG on Arch Linux..."
            sudo pacman -S gnupg
            ;;
        *)
            echo "❌ Unsupported operating system. Please install GPG manually:"
            echo "   Visit: https://gnupg.org/download/"
            exit 1
            ;;
    esac
    
    # Verify installation
    if command -v gpg >/dev/null 2>&1; then
        echo "✅ GPG successfully installed"
    else
        echo "❌ GPG installation failed"
        exit 1
    fi
fi

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "⚠️  Not in backend directory. Looking for Django project..."
    if [ -f "../manage.py" ]; then
        echo "📁 Found Django project in parent directory"
        echo "💡 Run this script from the backend directory or use 'make setup-env' from project root"
    else
        echo "❌ Django project not found. Make sure you're in the correct directory."
        exit 1
    fi
fi

# Check current environment file status
echo "📊 Checking environment file status..."
env_files_found=0
encrypted_files_found=0

for env_file in .env .env.test .env.local .env.development .env.staging .env.production; do
    if [ -f "$env_file" ]; then
        env_files_found=$((env_files_found + 1))
        echo "   📄 Found: $env_file"
    fi
    if [ -f "${env_file}.gpg" ]; then
        encrypted_files_found=$((encrypted_files_found + 1))
        echo "   🔒 Found: ${env_file}.gpg"
    fi
done

echo ""
echo "✅ Development environment setup complete!"
echo ""
echo "📊 Summary:"
echo "   • Scripts: Permissions set"
echo "   • GPG: Installed and verified"
echo "   • Environment files: $env_files_found plain, $encrypted_files_found encrypted"
echo ""

# Provide next steps based on what was found
if [ $encrypted_files_found -gt 0 ] && [ $env_files_found -eq 0 ]; then
    echo "🔓 Next steps (New team member):"
    echo "1. Get GPG passphrase from colleages"
    echo "2. Run: make decrypt"
    echo "3. Run: make env-status"
elif [ $env_files_found -gt 0 ] && [ $encrypted_files_found -eq 0 ]; then
    echo "🔐 Next steps (Existing developer):"
    echo "1. Run: make encrypt"
    echo "2. Run: make env-status"
elif [ $env_files_found -gt 0 ] && [ $encrypted_files_found -gt 0 ]; then
    echo "✅ Next steps (All set up):"
    echo "1. Run: make env-status (to verify)"
    echo "2. Start developing!"
else
    echo "📋 Next steps (Clean setup):"
    echo "1. Create your .env files or run: make decrypt"
    echo "2. Run: make env-status"
fi

echo ""
echo "💡 Available commands:"
echo "   • make env-status    - Check file status"
echo "   • make encrypt       - Encrypt environment files"
echo "   • make decrypt       - Decrypt environment files"
echo "   • make sync-env      - Quick encrypt and stage for commit"