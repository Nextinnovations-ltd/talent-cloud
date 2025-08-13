#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 TalentCloud Environment Encryption Tool${NC}"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo -e "${RED}❌ Please run this script from the backend directory${NC}"
    exit 1
fi

# Function to encrypt a file
encrypt_env_file() {
    local env_file=$1
    local encrypted_file="${env_file}.gpg"
    
    if [ -f "$env_file" ]; then
        echo -e "${YELLOW}🔒 Processing $env_file...${NC}"
        
        # Check if encrypted file exists and handle it upfront
        if [ -f "$encrypted_file" ]; then
            echo -e "${YELLOW}⚠️  $encrypted_file already exists${NC}"
            read -p "Overwrite existing encrypted file? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                echo -e "${YELLOW}⏭️  Skipping $env_file${NC}"
                return
            fi
            # Remove existing file to avoid GPG prompt
            rm "$encrypted_file"
            echo -e "${BLUE}🗑️  Removed existing $encrypted_file${NC}"
        fi
        
        echo -e "${YELLOW}🔒 Encrypting $env_file...${NC}"
        
        # Encrypt the file
        if gpg --trust-model always --cipher-algo AES256 --compress-algo 1 \
           --symmetric --armor --output "$encrypted_file" "$env_file"; then
            
            echo -e "${GREEN}✅ Successfully encrypted $env_file → $encrypted_file${NC}"
            echo -e "${BLUE}📁 Kept original $env_file for local development${NC}"
            
        else
            echo -e "${RED}❌ Failed to encrypt $env_file${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  File not found: $env_file${NC}"
    fi
}

# Main encryption process
echo -e "${BLUE}📁 Looking for environment files...${NC}"

# Look for all environment files
env_patterns=".env .env.local .env.development .env.staging .env.production"
found_files=""
found_count=0

for env_file in $env_patterns; do
    if [ -f "$env_file" ]; then
        if [ -z "$found_files" ]; then
            found_files="$env_file"
        else
            found_files="$found_files $env_file"
        fi
        found_count=$((found_count + 1))
    fi
done

# Also check for any other .env.* files that might exist
for env_file in .env.*; do
    if [ -f "$env_file" ] && [[ ! "$env_file" == *.gpg ]] && [[ ! "$env_file" == *.example ]]; then
        case " $found_files " in
            *" $env_file "*)
                ;;
            *)
                if [ -z "$found_files" ]; then
                    found_files="$env_file"
                else
                    found_files="$found_files $env_file"
                fi
                found_count=$((found_count + 1))
                ;;
        esac
    fi
done

if [ $found_count -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No environment files found to encrypt${NC}"
    echo -e "${BLUE}💡 Looking for: .env, .env.test, .env.local, .env.development, .env.staging, .env.production${NC}"
    exit 0
fi

echo -e "${GREEN}📋 Found $found_count environment file(s):${NC}"
for file in $found_files; do
    if [ -f "${file}.gpg" ]; then
        echo -e "   📄 $file ${YELLOW}(will update existing .gpg)${NC}"
    else
        echo -e "   📄 $file ${GREEN}(new encryption)${NC}"
    fi
done
echo

# Confirm encryption
echo -e "${YELLOW}🔐 Ready to encrypt environment files${NC}"
echo -e "${BLUE}💡 Note: Original files will be kept for local development${NC}"
read -p "Continue? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo -e "${YELLOW}❌ Encryption cancelled${NC}"
    exit 0
fi

# Encrypt each file
for env_file in $found_files; do
    encrypt_env_file "$env_file"
    echo  # Add spacing between files
done

echo
echo -e "${GREEN}🎉 Encryption process completed!${NC}"
echo -e "${BLUE}📝 What happened:${NC}"
echo -e "   • Created encrypted .gpg files for Git commits"
echo -e "   • Kept original files for local development"
echo -e "   • .gitignore ensures only .gpg files are committed"
echo
echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "   1. ${GREEN}git add *.gpg${NC} - Stage encrypted files"
echo -e "   2. ${GREEN}git commit -m 'Update encrypted environment files'${NC}"
echo -e "   3. ${GREEN}git push${NC} - Push to repository"
echo
echo -e "${GREEN}💡 Development Workflow:${NC}"
echo -e "   • Use original .env files for local development"
echo -e "   • Only .gpg files are committed to Git (secure)"
echo -e "   • Team members decrypt .gpg files when needed"