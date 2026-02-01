# Quernel Intelligence

Application web avec un frontend React et un backend Symfony.

## Structure du projet

```
quernel-intelligence.com/
├── frontend/          # Application React (Vite + TypeScript)
├── backend/           # API Symfony (API Platform)
└── docker-compose.yml # Configuration Docker pour le développement
```

## Prérequis

- Node.js 18+
- PHP 8.2+
- Composer
- Docker (optionnel)

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

### Backend

```bash
cd backend
composer install

# Configurer la base de données dans .env.local
# DATABASE_URL="mysql://user:password@127.0.0.1:3306/quernel_intelligence"

# Générer les clés JWT
php bin/console lexik:jwt:generate-keypair

# Créer la base de données et les migrations
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# Lancer le serveur
symfony server:start
```

L'API sera accessible sur `http://localhost:8000/api`

## Développement

### Frontend
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualiser le build

### Backend
- `php bin/console` - Console Symfony
- `php bin/console make:entity` - Créer une entité
- `php bin/console doctrine:migrations:diff` - Générer une migration

## Technologies

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand (state management)
- Axios

### Backend
- Symfony 7.4
- API Platform
- Doctrine ORM
- JWT Authentication
- CORS Bundle
