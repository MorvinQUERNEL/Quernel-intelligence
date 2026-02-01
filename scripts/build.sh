#!/bin/bash
# build.sh - Build frontend and backend for production
# Usage: ./scripts/build.sh [frontend|backend|all]

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[BUILD]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

build_frontend() {
    print_status "Building frontend..."
    cd "$PROJECT_ROOT/frontend"

    if [ ! -f "package.json" ]; then
        print_error "frontend/package.json not found!"
        exit 1
    fi

    npm ci
    npm run build

    if [ -d "dist" ]; then
        print_status "Frontend build successful! Output in frontend/dist/"
        ls -la dist/
    else
        print_error "Frontend build failed - dist/ directory not created"
        exit 1
    fi
}

build_backend() {
    print_status "Building backend..."
    cd "$PROJECT_ROOT/backend"

    if [ ! -f "composer.json" ]; then
        print_error "backend/composer.json not found!"
        exit 1
    fi

    composer install --no-dev --optimize-autoloader

    # Clear and warm up cache for production
    if [ -f "bin/console" ]; then
        php bin/console cache:clear --env=prod
        php bin/console cache:warmup --env=prod
    fi

    print_status "Backend build successful!"
}

case "${1:-all}" in
    frontend)
        build_frontend
        ;;

    backend)
        build_backend
        ;;

    all)
        build_frontend
        echo ""
        build_backend
        echo ""
        print_status "Full build complete!"
        ;;

    *)
        echo "Usage: $0 {frontend|backend|all}"
        echo ""
        echo "Commands:"
        echo "  frontend - Build React frontend only"
        echo "  backend  - Build Symfony backend only"
        echo "  all      - Build both (default)"
        exit 1
        ;;
esac
