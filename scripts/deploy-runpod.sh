#!/bin/bash
# =============================================
# QUERNEL INTELLIGENCE - Deploy to RunPod
# =============================================

set -e

# Configuration
RUNPOD_HOST="${RUNPOD_HOST:-38.147.83.30}"
RUNPOD_PORT="${RUNPOD_PORT:-39690}"
RUNPOD_USER="root"
SSH_KEY="~/.ssh/id_ed25519"
REMOTE_DIR="/workspace/quernel-saas"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== QUERNEL INTELLIGENCE - Deploiement RunPod ===${NC}"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
cd "$PROJECT_DIR/frontend"
npm run build

# Create remote directory
echo -e "${YELLOW}Creating remote directory...${NC}"
ssh -i $SSH_KEY -p $RUNPOD_PORT $RUNPOD_USER@$RUNPOD_HOST "mkdir -p $REMOTE_DIR/backend $REMOTE_DIR/frontend"

# Sync backend
echo -e "${YELLOW}Syncing backend...${NC}"
rsync -avz --delete \
  --exclude 'vendor/' \
  --exclude 'var/' \
  --exclude '.env.local' \
  --exclude 'config/jwt/*.pem' \
  -e "ssh -i $SSH_KEY -p $RUNPOD_PORT" \
  "$PROJECT_DIR/backend/" "$RUNPOD_USER@$RUNPOD_HOST:$REMOTE_DIR/backend/"

# Sync frontend build
echo -e "${YELLOW}Syncing frontend...${NC}"
rsync -avz --delete \
  -e "ssh -i $SSH_KEY -p $RUNPOD_PORT" \
  "$PROJECT_DIR/frontend/dist/" "$RUNPOD_USER@$RUNPOD_HOST:$REMOTE_DIR/frontend/"

# Run post-deployment on RunPod
echo -e "${YELLOW}Running post-deployment commands...${NC}"
ssh -i $SSH_KEY -p $RUNPOD_PORT $RUNPOD_USER@$RUNPOD_HOST << 'EOF'
cd /workspace/quernel-saas/backend

# Install PHP if not present
if ! command -v php &> /dev/null; then
    apt-get update && apt-get install -y php8.3 php8.3-cli php8.3-pgsql php8.3-xml php8.3-mbstring php8.3-intl php8.3-uuid
fi

# Install Composer if not present
if ! command -v composer &> /dev/null; then
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
fi

# Install dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Generate JWT keys if not present
if [ ! -f config/jwt/private.pem ]; then
    mkdir -p config/jwt
    openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096 -pass pass:quernel_jwt_2026
    openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout -passin pass:quernel_jwt_2026
fi

# Run migrations
php bin/console doctrine:migrations:migrate --no-interaction --env=prod || true

# Clear and warm cache
php bin/console cache:clear --env=prod
php bin/console cache:warmup --env=prod

# Set permissions
chmod -R 777 var/

echo "Deployment completed!"
EOF

echo -e "${GREEN}=== Deployment complete! ===${NC}"
echo -e "Backend: https://$RUNPOD_HOST:8000"
echo -e "Frontend: Serve files from $REMOTE_DIR/frontend/"
