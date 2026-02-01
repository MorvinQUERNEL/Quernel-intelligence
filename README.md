# Quernel Intelligence

Site vitrine pour Quernel Intelligence - [quernel-intelligence.com](https://quernel-intelligence.com)

## Stack Technique

- **Frontend**: React + Vite
- **Backend**: Symfony (PHP 8.2)
- **Hebergement**: Hostinger VPS
- **CI/CD**: GitHub Actions

## Developpement Local

### Prerequis

- Docker et Docker Compose
- Node.js 20+ (pour le developpement sans Docker)
- PHP 8.2+ et Composer (pour le developpement sans Docker)

### Avec Docker (Recommande)

```bash
# Demarrer l'environnement de developpement
./scripts/dev.sh up

# Voir les logs
./scripts/dev.sh logs

# Arreter l'environnement
./scripts/dev.sh down
```

Une fois demarre :
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

### Sans Docker

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (dans un autre terminal)
cd backend
composer install
symfony server:start
```

## Variables d'Environnement

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000/api
```

### Backend (`backend/.env.local`)

```env
APP_ENV=dev
APP_SECRET=<generer-avec-openssl>
DATABASE_URL=mysql://user:password@localhost:3306/quernel
```

> Ne jamais commiter les fichiers `.env.local` ou les secrets !

## Build Production

```bash
# Build complet
./scripts/build.sh all

# Build frontend uniquement
./scripts/build.sh frontend

# Build backend uniquement
./scripts/build.sh backend
```

## Deploiement

### Automatique (Recommande)

Le deploiement est automatise via GitHub Actions. Chaque push sur `main` declenche :

1. Build du frontend
2. Connexion SSH au serveur Hostinger
3. Pull des dernieres modifications
4. Installation des dependances
5. Build des assets de production
6. Rechargement de Nginx

### Secrets GitHub Requis

Configurez ces secrets dans : Settings > Secrets and variables > Actions

| Secret | Description |
|--------|-------------|
| `SSH_HOST` | Adresse IP ou hostname du VPS Hostinger |
| `SSH_PORT` | Port SSH (generalement 22) |
| `SSH_USER` | Nom d'utilisateur SSH |
| `SSH_PASSWORD` | Mot de passe SSH |
| `DEPLOY_PATH` | Chemin du projet (`domains/quernel-intelligence.com`) |

### Manuel

Pour un deploiement manuel, consultez :

```bash
./scripts/deploy.sh
```

## Architecture

```
quernel-intelligence.com/
├── .github/
│   └── workflows/
│       └── deploy.yml      # Pipeline CI/CD
├── docker/
│   └── docker-compose.yml  # Configuration Docker
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   └── dist/               # Build de production
├── backend/
│   ├── Dockerfile
│   ├── src/
│   └── public/
├── nginx/
│   └── quernel-intelligence.conf
├── scripts/
│   ├── dev.sh              # Lancer le dev local
│   ├── build.sh            # Build production
│   └── deploy.sh           # Instructions deploiement
└── README.md
```

## Configuration Nginx

Le fichier `nginx/quernel-intelligence.conf` configure :

- Redirection HTTP vers HTTPS
- SPA routing (React)
- Proxy API vers le backend Symfony (`/api/` vers port 8000)
- Headers de securite (CSP, X-Frame-Options, etc.)
- Compression Gzip
- Cache des assets statiques

## Securite

- Aucun secret dans le code source
- Authentification SSH via GitHub Secrets
- SSL/TLS avec Let's Encrypt
- Headers de securite configures
- Compression Gzip activee
- Cache des assets optimise

## Licence

Proprietaire - Quernel Intelligence 2024
