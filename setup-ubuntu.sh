#!/bin/bash
# ============================================================
#  SOC Dashboard — Ubuntu Bootstrap Script
#  Run once on a fresh Ubuntu machine to install everything
#  and launch the dashboard.
#
#  Usage:
#    chmod +x setup-ubuntu.sh
#    ./setup-ubuntu.sh
# ============================================================

set -e  # Exit immediately on any error

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "============================================================"
echo "  🛡️  SOC Dashboard — Ubuntu Bootstrap"
echo "============================================================"
echo ""

# ─── Step 1: System Packages ──────────────────────────────────
echo -e "${BOLD}[1/6] Updating system and installing prerequisites...${NC}"
sudo apt-get update -qq
sudo apt-get install -y curl dos2unix postgresql postgresql-contrib

# ─── Step 2: Node.js 20 via NodeSource ───────────────────────
echo ""
echo -e "${BOLD}[2/6] Installing Node.js 20...${NC}"
NODE_VERSION=$(node --version 2>/dev/null || echo "none")
if [[ "$NODE_VERSION" == v2* ]] || [[ "$NODE_VERSION" == "none" ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  echo -e "${GREEN}✅ Node.js $(node --version) installed.${NC}"
else
  echo -e "${GREEN}✅ Node.js $NODE_VERSION already installed.${NC}"
fi

# ─── Step 3: PostgreSQL Configuration ─────────────────────────
echo ""
echo -e "${BOLD}[3/6] Configuring PostgreSQL...${NC}"

# Ensure PostgreSQL is running
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create the database and set password
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE soc_dashboard;" 2>/dev/null || echo "  (Database may already exist — continuing)"

# Fix pg_hba.conf: change 'peer' to 'md5' for local connections
PG_HBA=$(sudo find /etc/postgresql -name pg_hba.conf 2>/dev/null | head -n 1)
if [ -n "$PG_HBA" ]; then
  # Backup first
  sudo cp "$PG_HBA" "${PG_HBA}.bak"
  # Replace peer with md5 for local postgres connections
  sudo sed -i 's/^local\s*all\s*postgres\s*peer/local   all             postgres                                md5/' "$PG_HBA"
  sudo sed -i 's/^local\s*all\s*all\s*peer/local   all             all                                     md5/' "$PG_HBA"
  sudo systemctl restart postgresql
  echo -e "${GREEN}✅ PostgreSQL configured with password auth (md5).${NC}"
else
  echo -e "${YELLOW}⚠️  Could not find pg_hba.conf automatically. You may need to configure it manually.${NC}"
fi

# ─── Step 4: Fix CRLF Line Endings ────────────────────────────
echo ""
echo -e "${BOLD}[4/6] Fixing Windows CRLF line endings...${NC}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
find "$SCRIPT_DIR" \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/build/*" \
  \( -name "*.js" -o -name "*.json" -o -name "*.prisma" -o -name "*.md" -o -name "*.env*" -o -name "*.sh" \) \
  -exec dos2unix {} \; 2>/dev/null
echo -e "${GREEN}✅ Line endings normalized.${NC}"

# Make shell scripts executable
chmod +x "$SCRIPT_DIR"/*.sh 2>/dev/null || true

# ─── Step 5: Export OpenSSL fix ───────────────────────────────
echo ""
echo -e "${BOLD}[5/6] Setting environment variables...${NC}"
export NODE_OPTIONS=--openssl-legacy-provider

# Add to .bashrc if not already present
if ! grep -q "openssl-legacy-provider" ~/.bashrc 2>/dev/null; then
  echo 'export NODE_OPTIONS=--openssl-legacy-provider' >> ~/.bashrc
  echo -e "${GREEN}✅ NODE_OPTIONS added to ~/.bashrc (persists across sessions).${NC}"
else
  echo -e "${GREEN}✅ NODE_OPTIONS already set in ~/.bashrc.${NC}"
fi

# ─── Step 6: Run the App Setup ────────────────────────────────
echo ""
echo -e "${BOLD}[6/6] Running SOC Dashboard setup...${NC}"
echo ""
cd "$SCRIPT_DIR"
node setup.js
