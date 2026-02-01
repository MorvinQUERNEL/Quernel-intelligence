#!/bin/bash
# deploy.sh - Manual deployment instructions and helper
# Usage: ./scripts/deploy.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        Quernel Intelligence - Deployment Guide                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${GREEN}=== AUTOMATIC DEPLOYMENT (Recommended) ===${NC}"
echo ""
echo "Deployment is automated via GitHub Actions."
echo "Simply push to the 'main' branch:"
echo ""
echo -e "  ${YELLOW}git push origin main${NC}"
echo ""
echo "The pipeline will:"
echo "  1. Build the frontend"
echo "  2. Connect to Hostinger via SSH"
echo "  3. Pull latest changes"
echo "  4. Install dependencies"
echo "  5. Build production assets"
echo "  6. Reload Nginx"
echo ""

echo -e "${GREEN}=== MANUAL DEPLOYMENT ===${NC}"
echo ""
echo "If you need to deploy manually, SSH into the server:"
echo ""
echo -e "  ${YELLOW}ssh -p <PORT> <USER>@<HOST>${NC}"
echo ""
echo "Then run these commands:"
echo ""
cat << 'EOF'
  cd domains/quernel-intelligence.com

  # Pull latest changes
  git pull origin main

  # Build frontend
  cd frontend
  npm ci
  npm run build

  # Build backend
  cd ../backend
  composer install --no-dev --optimize-autoloader
  php bin/console cache:clear --env=prod

  # Reload Nginx
  sudo systemctl reload nginx
EOF
echo ""

echo -e "${GREEN}=== REQUIRED GITHUB SECRETS ===${NC}"
echo ""
echo "Configure these in: Settings > Secrets and variables > Actions"
echo ""
echo "  SSH_HOST      - Hostinger VPS IP or hostname"
echo "  SSH_PORT      - SSH port (usually 22)"
echo "  SSH_USER      - SSH username"
echo "  SSH_PASSWORD  - SSH password"
echo "  DEPLOY_PATH   - Path to project (domains/quernel-intelligence.com)"
echo ""

echo -e "${GREEN}=== NGINX CONFIGURATION ===${NC}"
echo ""
echo "Copy the Nginx config to the server:"
echo ""
echo -e "  ${YELLOW}sudo cp nginx/quernel-intelligence.conf /etc/nginx/sites-available/${NC}"
echo -e "  ${YELLOW}sudo ln -sf /etc/nginx/sites-available/quernel-intelligence.conf /etc/nginx/sites-enabled/${NC}"
echo -e "  ${YELLOW}sudo nginx -t${NC}"
echo -e "  ${YELLOW}sudo systemctl reload nginx${NC}"
echo ""

echo -e "${GREEN}=== SSL CERTIFICATE ===${NC}"
echo ""
echo "If not already configured, install Let's Encrypt:"
echo ""
echo -e "  ${YELLOW}sudo certbot --nginx -d quernel-intelligence.com -d www.quernel-intelligence.com${NC}"
echo ""

echo -e "${GREEN}=== TROUBLESHOOTING ===${NC}"
echo ""
echo "Check Nginx status:  sudo systemctl status nginx"
echo "Check Nginx logs:    sudo tail -f /var/log/nginx/quernel-intelligence.error.log"
echo "Test Nginx config:   sudo nginx -t"
echo "Restart Nginx:       sudo systemctl restart nginx"
echo ""
