#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔓 TalentCloud Environment Decryption Tool${NC}"
echo "===================================================="

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo -e "${RED}❌ Please run this script from the backend directory${NC}"
    exit 1
fi

# Function to decrypt a file
decrypt_env_file() {
    local encrypted_file=$1
    local env_file="${encrypted_file%.gpg}"
    
    if [ -f "$encrypted_file" ]; then
        echo -e "${YELLOW}🔓 Decrypting $encrypted_file...${NC}"
        
        # Check if decrypted version already exists
        if [ -f "$env_file" ]; then
            echo -e "${YELLOW}⚠️  $env_file already exists${NC}"
            read -p "Overwrite? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                echo -e "${YELLOW}⏭️  Skipping $encrypted_file${NC}"
                return
            fi
        fi
        
        # Decrypt the file
        if gpg --quiet --batch --yes --decrypt --output "$env_file" "$encrypted_file"; then
            # Set secure permissions
            chmod 600 "$env_file"
            echo -e "${GREEN}✅ Successfully decrypted $encrypted_file → $env_file${NC}"
        else
            echo -e "${RED}❌ Failed to decrypt $encrypted_file${NC}"
            echo -e "${RED}   Please check your GPG passphrase${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Encrypted file not found: $encrypted_file${NC}"
    fi
}

# Main decryption process
echo -e "${BLUE}📁 Looking for encrypted environment files...${NC}"

# Use compatible approach for finding encrypted files
found_files=""
found_count=0
for encrypted_file in .env.gpg .env.development.gpg .env.staging.gpg .env.production.gpg; do
    if [ -f "$encrypted_file" ]; then
        if [ -z "$found_files" ]; then
            found_files="$encrypted_file"
        else
            found_files="$found_files $encrypted_file"
        fi
        found_count=$((found_count + 1))
    fi
done

if [ $found_count -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No encrypted environment files found${NC}"
    echo -e "${BLUE}💡 Expected files: .env.gpg .env.development.gpg, .env.staging.gpg, .env.production.gpg${NC}"
    exit 0
fi

echo -e "${GREEN}📋 Found $found_count encrypted file(s):${NC}"
for file in $found_files; do
    echo -e "   🔒 $file"
done
echo

# Confirm decryption
echo -e "${YELLOW}🔓 Ready to decrypt environment files${NC}"
read -p "Continue? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${YELLOW}❌ Decryption cancelled${NC}"
    exit 0
fi

# Decrypt each file
for encrypted_file in $found_files; do
    decrypt_env_file "$encrypted_file"
done

echo
echo -e "${GREEN}🎉 Decryption process completed!${NC}"
echo -e "${YELLOW}⚠️  Important Security Notes:${NC}"
echo -e "   • Decrypted files have 600 permissions (read/write for owner only)"
echo -e "   • Never commit decrypted .env files to Git"
echo -e "   • Re-encrypt files after making changes"