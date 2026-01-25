# QUERNEL INTELLIGENCE v7

Plateforme SaaS d'IA conversationnelle pour les entreprises francaises - Architecture "Les 3 Anges".

## Les 3 Anges IA

| Ange | Role | Specialite |
|------|------|------------|
| **Raphael** | Ange Guerisseur | Assistant general, organisation, redaction, productivite |
| **Gabriel** | Ange Messager | Marketing digital, SEO, contenu, publicite |
| **Michael** | Ange Protecteur | Commercial, prospection, negociation, vente |

Les 3 anges partagent un contexte commun et travaillent en synergie pour accompagner chaque utilisateur.

## Architecture

```
QUERNEL-INTELLIGENCE/
├── Saas/
│   ├── backend/          # API Symfony (PHP 8.3)
│   │   ├── src/
│   │   │   ├── Controller/
│   │   │   ├── Entity/
│   │   │   ├── Service/
│   │   │   └── Repository/
│   │   ├── config/
│   │   └── migrations/
│   └── frontend/         # React + Vite + TypeScript
│       ├── src/
│       │   ├── components/
│       │   ├── services/
│       │   └── stores/
│       └── dist/         # Build production
└── docs/                 # Documentation
```

## Stack Technique

### Backend
- **Framework**: Symfony 7.x
- **PHP**: 8.3+
- **Base de donnees**: MySQL (Hostinger)
- **Auth**: JWT (LexikJWTAuthenticationBundle)
- **Paiement**: Stripe API
- **API Style**: REST

### Frontend
- **Framework**: React 18
- **Build**: Vite 7
- **Language**: TypeScript
- **CSS**: Tailwind CSS 4
- **State**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Infrastructure IA
- **Serveur**: RunPod GPU
- **LLM**: Hermes-3-Llama-8B via vLLM
- **API**: Flask (port 8080) + vLLM (port 8000)
- **Cache**: Redis (conversations chiffrees AES-256)

## Tarification v7

| Plan | Prix | Tokens | Anges | Documents |
|------|------|--------|-------|-----------|
| **Essai Gratuit** | 0eur (7 jours) | 100K | 3 | 10 |
| **Pro** | 50eur/mois | 2M | 3 | 100 |

- Paiement annuel : 480eur/an (2 mois offerts)
- Annulation a tout moment
- Support prioritaire avec le plan Pro

## Installation Locale

### Backend

```bash
cd Saas/backend
composer install
cp .env .env.local
# Configurer DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY dans .env.local
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
symfony server:start
```

### Frontend

```bash
cd Saas/frontend
npm install
cp .env.example .env.local
# Configurer VITE_BACKEND_URL
npm run dev
```

## Deploiement (Hostinger)

### CI/CD via GitHub Actions

Le deploiement est automatise via `.github/workflows/deploy.yml` :
- Push sur `main` → Build frontend → Deploy backend + frontend sur Hostinger

### Serveur
- **URL**: https://quernel-intelligence.com
- **SSH**: ssh -p 65002 u729245499@82.25.113.5

### Structure sur serveur
```
domains/quernel-intelligence.com/
├── backend/              # API Symfony
└── public_html/          # Frontend (dist)
    └── api/              # Symlink vers backend/public
```

## Variables d'Environnement

### Backend (.env.local)
```env
APP_ENV=prod
APP_SECRET=your_secret
DEFAULT_URI=https://quernel-intelligence.com
DATABASE_URL="mysql://user:pass@localhost:3306/quernel"
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your_passphrase
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
CORS_ALLOW_ORIGIN=https://quernel-intelligence.com
FRONTEND_URL=https://quernel-intelligence.com
```

### Frontend (.env.local)
```env
VITE_BACKEND_URL=https://quernel-intelligence.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Routes Frontend

| Route | Page |
|-------|------|
| `/` | Landing page |
| `#login` | Connexion |
| `#register` | Inscription |
| `#pricing` | Tarifs |
| `#privacy` | Politique de confidentialite |
| `#terms` | CGU |
| `#legal` | Mentions legales |
| `#cookies` | Politique cookies |
| `/chat` | Interface chat (auth) |
| `/dashboard` | Tableau de bord (auth) |
| `/billing` | Facturation (auth) |

## API Endpoints

### Auth
- `POST /api/login` - Connexion
- `POST /api/register` - Inscription
- `GET /api/me` - Profil utilisateur
- `POST /api/oauth/google/callback` - OAuth Google
- `POST /api/oauth/apple/callback` - OAuth Apple

### Chat
- `GET /api/chat/conversations` - Liste conversations
- `POST /api/chat/conversations` - Creer conversation
- `GET /api/chat/conversations/{id}` - Details conversation
- `POST /api/chat/conversations/{id}/messages` - Envoyer message
- `POST /api/chat/conversations/{id}/stream` - Streaming SSE

### Stripe
- `POST /api/stripe/checkout` - Creer session checkout
- `POST /api/stripe/portal` - Acceder au portail client
- `GET /api/stripe/subscription` - Abonnement actuel
- `POST /api/stripe/subscription/cancel` - Annuler
- `POST /api/stripe/subscription/resume` - Reactiver

## RGPD & Conformite

- **Hebergement**: France (Hostinger EU)
- **Donnees**: Chiffrees en transit (TLS 1.3) et au repos (AES-256)
- **Cookie Consent**: Banniere RGPD complete
- **Pages legales**: Privacy Policy, CGU, Mentions legales, Cookie Policy
- **DPO Contact**: dpo@quernel-intelligence.com
- **SIREN**: 979632072

## Changelog

### v7.1 (25 janvier 2026)
- **Pricing**: Simplifie - Essai 7j + Pro 50eur/mois
- **Textes**: Mise a jour 9 agents → 3 Anges
- **Deploy**: GitHub Actions corrige (DEFAULT_URI)

### v7.0 (24 janvier 2026)
- **Architecture**: "Les 3 Anges" - 3 agents specialises
- **Anges**: Raphael (General), Gabriel (Marketing), Michael (Commercial)
- **Contexte**: Partage entre anges via Redis chiffre

### v2.0.0 (22 janvier 2026)
- **Pricing**: 4 plans avec toggle mensuel/annuel
- **Stripe**: Integration checkout, portal, subscriptions
- **RGPD**: Pages legales completes
- **Cookie Consent**: Banniere + preferences

### v1.0.0 (Initial)
- Landing page avec 9 agents
- Authentification JWT + OAuth
- Interface chat avec streaming
- Dashboard utilisateur

## Support

- **Email**: contact@quernel-intelligence.com
- **Site**: https://quernel-intelligence.com

---

Voir aussi:
- [ROADMAP.md](../docs/ROADMAP.md) - Fonctionnalites futures
- [AGENTS_IA.md](../docs/AGENTS_IA.md) - Details sur les 3 Anges
- [ARCHITECTURE_SAAS.md](../docs/ARCHITECTURE_SAAS.md) - Architecture technique

---

(c) 2026 QUERNEL INTELLIGENCE SASU. Tous droits reserves.
