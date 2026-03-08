# Quernel Intelligence

**Site vitrine professionnel pour Quernel Intelligence** - [quernel-intelligence.com](https://quernel-intelligence.com)

Plateforme web full-stack proposant des services d'intelligence artificielle, avec generateur de devis automatise et formulaire de contact.

## Stack Technique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4, Framer Motion, Vite 7 |
| **Backend** | Symfony 7, PHP 8.2, API Platform, Doctrine ORM |
| **Infrastructure** | Docker, Nginx, GitHub Actions (CI/CD) |
| **Hebergement** | Hostinger VPS |

## Fonctionnalites

- **Site vitrine** avec pages Services, Tarifs, FAQ, Contact
- **Generateur de devis** automatise selon les besoins du client
- **Formulaire de contact** avec validation et envoi d'emails
- **Design responsive** avec animations fluides (Framer Motion)
- **SEO optimise** avec meta tags dynamiques

## Architecture

```
quernel-intelligence/
├── frontend/          # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── pages/     # HomePage, ServicesPage, PricingPage, FAQPage, ContactPage
│   │   └── components/
│   └── vite.config.ts
├── backend/           # Symfony 7 API
│   ├── src/
│   │   ├── Controller/
│   │   ├── Entity/
│   │   ├── Service/
│   │   └── Repository/
│   └── config/
├── docker/            # Dockerfiles
├── nginx/             # Configuration Nginx
├── docker-compose.yml
└── scripts/           # Scripts utilitaires
```

## Developpement Local

### Prerequis

- Docker et Docker Compose
- Node.js 20+
- PHP 8.2+ et Composer

### Avec Docker (Recommande)

```bash
./scripts/dev.sh up
```

- Frontend : http://localhost:5173
- Backend : http://localhost:8000

### Sans Docker

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && composer install && symfony server:start
```

## Deploiement

Le deploiement est automatise via GitHub Actions. Chaque push sur `main` declenche le pipeline CI/CD.

## Auteur

**Morvin QUERNEL** - Developpeur Full-Stack
