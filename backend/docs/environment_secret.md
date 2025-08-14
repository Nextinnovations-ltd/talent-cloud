# 🔐 Environment File Encryption Guide

A comprehensive guide for TalentCloud developers to securely manage environment files using GPG encryption.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Setup](#quick-setup)
- [Daily Workflow](#daily-workflow)
- [Commands Reference](#commands-reference)
- [File Structure](#file-structure)
- [Troubleshooting](#troubleshooting)
- [Security Guidelines](#security-guidelines)

## 🎯 Overview

### Why Environment Encryption?

- **🛡️ Security**: Prevents secrets from being committed to Git
- **👥 Team Collaboration**: Secure sharing of sensitive configuration
- **🚀 Development Flow**: Maintains smooth local development experience
- **🔒 Compliance**: Meets security requirements for production systems

### How It Works

1. **Local Development**: Use plain `.env` files for running the application
2. **Git Commits**: Only encrypted `.gpg` files are committed to repository
3. **Team Sharing**: Members decrypt `.gpg` files to get latest configuration

## 🔧 Prerequisites

### 1. Install GPG

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install gnupg
```

**macOS:**
```bash
brew install gnupg
```

**CentOS/RHEL:**
```bash
sudo yum install gnupg2
```

**Verify Installation:**
```bash
gpg --version
```

### 2. Get Team GPG Passphrase

Contact your team lead to get the shared GPG passphrase. This will be needed for:
- Decrypting existing environment files
- Encrypting your changes

> ⚠️ **Security Note**: The passphrase should be shared through secure channels only (Signal, encrypted email, or in-person).

## 🚀 Quick Setup

### For New Team Members

```bash
# 1. Clone the repository
git clone <repository-url>
cd talentcloud

# 2. Install GPG (if not already installed)
# See prerequisites section above

# 3. Setup environment files
make setup-env
# Enter the team GPG passphrase when prompted (asked to related developer)

# 4. Verify setup
make env-status

# 5. Start developing
make run-dev
```

### For Existing Members

If you already have the repository but need to decrypt files:

```bash
# Decrypt all environment files
make decrypt
# Enter the GPG passphrase when prompted

# Check status
make env-status
```

## 📚 Commands Reference

### Environment Management

| Command | Description | When to Use |
|---------|-------------|-------------|
| `make env-status` | Show encryption status of all env files | Check current state |
| `make encrypt` | Encrypt all environment files | Before committing changes |
| `make decrypt` | Decrypt all encrypted files | New setup or reviewing changes |
| `make sync-env` | Encrypt and stage files for Git | Quick commit preparation |
| `make setup-env` | Complete setup for new developers | First-time setup |


## 📁 File Structure

```
talentcloud/
├── backend/
│   ├── scripts/
│   │   ├── encrypt_env.sh          # Encryption script
│   │   └── decrypt_env.sh          # Decryption script
│   ├── .env                        # Local dev (not committed)
│   ├── .env.development            # Development config (not committed)
│   ├── .env.staging                # Staging config (not committed)
│   ├── .env.production             # Production config (not committed)
│   ├── .env.gpg                    # Encrypted local (committed)
│   ├── .env.development.gpg        # Encrypted dev (committed)
│   ├── .env.staging.gpg            # Encrypted staging (committed)
│   └── .env.production.gpg         # Encrypted prod (committed)
├── .gitignore                      # Blocks plain .env files
├── .git/hooks/pre-commit           # Security protection
└── Makefile                        # Convenient commands
```

### What Gets Committed vs. Not Committed

**✅ Committed to Git:**
- `*.gpg` files (encrypted environment files)
- Scripts and configuration

**❌ Never Committed:**
- Plain `.env*` files (blocked by .gitignore)
- GPG passphrase (shared securely offline)

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. Permission Denied
```bash
# Error: ./scripts/encrypt_env.sh: Permission denied
# Solution:
chmod +x backend/scripts/*.sh
# Or:
make setup-scripts
```

#### 2. GPG Command Not Found
```bash
# Error: gpg: command not found
# Solution: Install GPG (see Prerequisites section)
```

#### 3. Wrong Passphrase
```bash
# Error: gpg: decryption failed: Bad session key
# Solution: Contact team lead for correct passphrase
```

#### 4. Files Not Found
```bash
# Error: No environment files found
# Solution: Ensure you're in the correct directory
cd backend  # For direct script execution
# Or use make commands from project root
```

## 🛡️ Security Guidelines

### Do's ✅

- **Use secure channels** for sharing the GPG passphrase
- **Keep original .env files** for local development
- **Run `make env-status`** regularly to check file states
- **Use `make sync-env`** before committing changes
- **Let pre-commit hooks** protect you from accidents

### Don'ts ❌

- **Never commit plain .env files** to Git
- **Never share passphrases** via chat, email, or code comments
- **Don't delete original .env files** after encryption
- **Don't bypass pre-commit hooks**
- **Don't store passphrases** in code or config files

## 📝 Quick Reference

```bash
# Setup (one-time)
make setup-env

# Daily workflow
vim backend/.env.development  # Edit files
make sync-env                 # Prepare for commit
git commit -m "message"       # Commit changes

# Status check
make env-status               # See current state

# Manual operations
make encrypt                  # Encrypt files
make decrypt                  # Decrypt files

```

---
