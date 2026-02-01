#!/bin/bash
# dev.sh - Start local development environment with Docker
# Usage: ./scripts/dev.sh [up|down|logs|build|clean]

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$PROJECT_ROOT/docker/docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[DEV]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

case "${1:-up}" in
    up)
        check_docker
        print_status "Starting development environment..."
        docker compose -f "$COMPOSE_FILE" up -d --build
        print_status "Development environment started!"
        echo ""
        echo "  Frontend: http://localhost:5173"
        echo "  Backend:  http://localhost:8000"
        echo ""
        print_status "Use './scripts/dev.sh logs' to view logs"
        ;;

    down)
        check_docker
        print_status "Stopping development environment..."
        docker compose -f "$COMPOSE_FILE" down
        print_status "Development environment stopped."
        ;;

    logs)
        check_docker
        docker compose -f "$COMPOSE_FILE" logs -f
        ;;

    build)
        check_docker
        print_status "Rebuilding containers..."
        docker compose -f "$COMPOSE_FILE" build --no-cache
        print_status "Containers rebuilt successfully."
        ;;

    clean)
        check_docker
        print_warning "This will remove all containers, volumes, and images for this project."
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker compose -f "$COMPOSE_FILE" down -v --rmi local
            print_status "Cleanup complete."
        else
            print_status "Cleanup cancelled."
        fi
        ;;

    *)
        echo "Usage: $0 {up|down|logs|build|clean}"
        echo ""
        echo "Commands:"
        echo "  up     - Start development environment (default)"
        echo "  down   - Stop development environment"
        echo "  logs   - View container logs"
        echo "  build  - Rebuild containers"
        echo "  clean  - Remove containers, volumes, and images"
        exit 1
        ;;
esac
