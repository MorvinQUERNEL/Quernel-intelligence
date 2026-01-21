# QUERNEL INTELLIGENCE

Plateforme SaaS d'agents IA spécialisés pour les entreprises françaises.

## Architecture

```
QUERNEL-INTELLIGENCE/
├── Saas/
│   ├── backend/          # API Symfony (PHP 8.2)
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
```

## Stack Technique

### Backend
- **Framework**: Symfony 7.x
- **PHP**: 8.2+
- **Base de données**: MySQL
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

## Installation Locale

### Backend

```bash
cd Saas/backend
composer install
cp .env .env.local
# Configurer DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY dans .env.local
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
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

## Déploiement (Hostinger)

### Serveur
- **Host**: quernel-intelligence.com
- **SSH**: ssh -p 65002 u729245499@82.25.113.5

### Structure sur serveur
```
domains/quernel-intelligence.com/
├── backend/              # API Symfony
└── public_html/          # Frontend (dist)
    └── api/              # Symlink vers backend/public
```

### Déploiement manuel

1. **Builder le frontend**:
```bash
cd Saas/frontend
npm run build
```

2. **Uploader le frontend**:
```bash
scp -P 65002 -r dist/* u729245499@82.25.113.5:domains/quernel-intelligence.com/public_html/
```

3. **Uploader le backend** (si modifié):
```bash
scp -P 65002 -r backend/src/* u729245499@82.25.113.5:domains/quernel-intelligence.com/backend/src/
```

4. **Sur le serveur**:
```bash
cd domains/quernel-intelligence.com/backend
composer install --no-dev --optimize-autoloader
php bin/console cache:clear --env=prod
php bin/console doctrine:migrations:migrate --no-interaction
```

## Variables d'Environnement

### Backend (.env.local)
```env
APP_ENV=prod
APP_SECRET=your_secret
DATABASE_URL="mysql://user:pass@localhost:3306/quernel"
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your_passphrase
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
CORS_ALLOW_ORIGIN=https://quernel-intelligence.com
```

### Frontend (.env.local)
```env
VITE_BACKEND_URL=https://quernel-intelligence.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Fonctionnalités

### 9 Agents IA Spécialisés
1. **Tom** - Téléphonie & Relation Client
2. **John** - Marketing Digital
3. **Lou** - SEO & Rédaction Web
4. **Julia** - Conseil Juridique
5. **Elio** - Commercial & Prospection
6. **Charly+** - Assistant Général
7. **Manue** - Comptabilité & Finance
8. **Rony** - RH & Recrutement
9. **Chatbot** - Service Client 24/7

### Plans Tarifaires
| Plan | Prix/mois | Tokens | Agents | Documents |
|------|-----------|--------|--------|-----------|
| Gratuit | 0€ | 50K | 1 | 5 |
| Pro | 29€ | 500K | 5 | 50 |
| Business | 99€ | 2M | 20 | 200 |
| Enterprise | Sur devis | Illimité | Illimité | Illimité |

### Routes Frontend
| Route | Page |
|-------|------|
| `/` | Landing page |
| `#login` | Connexion |
| `#register` | Inscription |
| `#pricing` | Tarifs (4 plans) |
| `#privacy` | Politique de confidentialité |
| `#terms` | CGU |
| `#legal` | Mentions légales |
| `#cookies` | Politique cookies |
| `/chat` | Interface chat (auth) |
| `/dashboard` | Tableau de bord (auth) |
| `/billing` | Facturation (auth) |

### API Endpoints

#### Auth
- `POST /api/login` - Connexion
- `POST /api/register` - Inscription
- `GET /api/me` - Profil utilisateur
- `POST /api/oauth/google/callback` - OAuth Google
- `POST /api/oauth/apple/callback` - OAuth Apple

#### Chat
- `GET /api/chat/conversations` - Liste conversations
- `POST /api/chat/conversations` - Créer conversation
- `GET /api/chat/conversations/{id}` - Détails conversation
- `POST /api/chat/conversations/{id}/messages` - Envoyer message
- `POST /api/chat/conversations/{id}/stream` - Streaming SSE

#### Stripe
- `POST /api/stripe/checkout` - Créer session checkout
- `POST /api/stripe/portal` - Accéder au portail client
- `GET /api/stripe/subscription` - Abonnement actuel
- `POST /api/stripe/subscription/cancel` - Annuler
- `POST /api/stripe/subscription/resume` - Réactiver

## RGPD & Conformité

- **Hébergement**: France (Hostinger EU)
- **Données**: Chiffrées en transit (TLS 1.3) et au repos
- **Cookie Consent**: Bannière RGPD complète
- **Pages légales**: Privacy Policy, CGU, Mentions légales, Cookie Policy
- **DPO Contact**: dpo@quernel-intelligence.com
- **SIREN**: 979632072

## Changelog

### v2.0.0 (22 janvier 2026)
- **Pricing**: 4 plans avec toggle mensuel/annuel
- **Stripe**: Intégration checkout, portal, subscriptions
- **RGPD**: Pages légales complètes (Privacy, CGU, Mentions, Cookies)
- **Cookie Consent**: Bannière + préférences avec Zustand
- **Billing**: Page gestion abonnement
- **Design**: Glassmorphism CSS variables

### v1.0.0 (Initial)
- Landing page avec 9 agents
- Authentification JWT + OAuth
- Interface chat avec streaming
- Dashboard utilisateur

## Support

- **Email**: contact@quernel-intelligence.com
- **Site**: https://quernel-intelligence.com

---

© 2026 QUERNEL INTELLIGENCE SASU. Tous droits réservés.
