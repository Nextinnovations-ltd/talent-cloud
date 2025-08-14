#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔓 Decrypting Staging Environment Files...${NC}"

# Check if we're in the backend directory (by looking for manage.py)
if [ ! -f "manage.py" ]; then
    echo -e "${RED}❌ Please run this script from the backend directory${NC}"
    echo -e "${YELLOW}💡 Expected to find manage.py in current directory${NC}"
    exit 1
fi

# Function to decrypt a single environment file
decrypt_env_file() {
    local encrypted_file=$1
    local decrypted_file=$2
    local passphrase=$3
    
    if [ -f "$encrypted_file" ]; then
        echo -e "${YELLOW}🔓 Decrypting $encrypted_file...${NC}"
        
        # Decrypt using GPG with passphrase
        if echo "$passphrase" | gpg --batch --yes --quiet --passphrase-fd 0 --decrypt "$encrypted_file" > "$decrypted_file" 2>/dev/null; then
            # Set secure permissions
            chmod 600 "$decrypted_file"
            echo -e "${GREEN}✅ Successfully decrypted $encrypted_file → $decrypted_file${NC}"
        else
            echo -e "${RED}❌ Failed to decrypt $encrypted_file${NC}"
            echo -e "${RED}   Check GPG passphrase or file integrity${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠️  Encrypted file not found: $encrypted_file${NC}"
    fi
}

# Function to validate decrypted file
validate_env_file() {
    local env_file=$1
    
    if [ -f "$env_file" ]; then
        # Check if file has content and basic env format
        if [ -s "$env_file" ] && grep -q "=" "$env_file"; then
            echo -e "${GREEN}✅ Environment file validation passed: $env_file${NC}"
        else
            echo -e "${RED}❌ Environment file appears invalid: $env_file${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ Environment file not found after decryption: $env_file${NC}"
        exit 1
    fi
}

# Main decryption process
echo -e "${BLUE}📋 Starting staging environment decryption...${NC}"

# Check for GPG passphrase in environment variable (required for server deployment)
if [ -z "$GPG_PASSPHRASE" ]; then
    echo -e "${RED}❌ GPG_PASSPHRASE environment variable is required${NC}"
    echo -e "${YELLOW}💡 Set GPG_PASSPHRASE before running this script:${NC}"
    echo -e "${YELLOW}   export GPG_PASSPHRASE='your-passphrase'${NC}"
    echo -e "${YELLOW}   bash scripts/decrypt_staging.sh${NC}"
    exit 1
fi

# Decrypt staging environment file
echo -e "${YELLOW}🎯 Processing staging environment...${NC}"
decrypt_env_file ".env.staging.gpg" ".env.staging" "$GPG_PASSPHRASE"

# Validate the decrypted file
validate_env_file ".env.staging"

# Optional: Decrypt common env file if exists
if [ -f ".env.gpg" ]; then
    echo -e "${YELLOW}🔧 Processing common environment file...${NC}"
    decrypt_env_file ".env.gpg" ".env" "$GPG_PASSPHRASE"
    validate_env_file ".env"
fi

# Clean up passphrase from memory
unset GPG_PASSPHRASE

echo -e "${GREEN}🎉 Staging environment decryption completed successfully!${NC}"
echo -e "${BLUE}📁 Available environment files:${NC}"
for env_file in .env .env.staging; do
    if [ -f "$env_file" ]; then
        echo -e "   ✅ $env_file ($(wc -l < "$env_file") lines)"
    fi
done

echo -e "${YELLOW}🔒 File permissions set to 600 (owner read/write only)${NC}"
echo -e "${BLUE}💡 Ready for staging deployment!${NC}"