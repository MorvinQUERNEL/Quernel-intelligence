# QUERNEL INTELLIGENCE - Architecture SaaS v7

## Vision du produit

Une plateforme SaaS permettant aux entreprises francaises d'acceder a des agents IA personnalises ("Les 3 Anges"), heberges en France, sans dependance aux APIs americaines.

---

## Architecture globale v7

```
┌────────────────────────────────────────────────────────────────────────────┐
│                     QUERNEL INTELLIGENCE SaaS v7                            │
│                        "Les 3 Anges"                                        │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        FRONTEND (React 18)                           │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │  │
│  │  │   Login    │ │ Dashboard  │ │    Chat    │ │  Billing   │        │  │
│  │  │   OAuth    │ │  Metriques │ │  3 Anges   │ │   Stripe   │        │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │  │
│  │  │  Landing   │ │  Pricing   │ │   Pages    │ │  Cookies   │        │  │
│  │  │   Page     │ │   Plans    │ │  Legales   │ │  Consent   │        │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                       │
│                              HTTPS │ JWT                                   │
│                                    ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        BACKEND (Symfony 7)                           │  │
│  │  ┌──────────────────────────────────────────────────────────────┐    │  │
│  │  │                      API REST                                │    │  │
│  │  │  /api/auth    /api/chat    /api/stripe    /api/users         │    │  │
│  │  └──────────────────────────────────────────────────────────────┘    │  │
│  │                                                                      │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │  │
│  │  │  Security  │ │   Rate     │ │   Usage    │ │  Billing   │        │  │
│  │  │  JWT/OAuth │ │  Limiter   │ │  Tracking  │ │  Stripe    │        │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                       │
│                                    ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     SERVICES DATA                                    │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐                       │  │
│  │  │   MySQL    │ │   Redis    │ │   MinIO    │                       │  │
│  │  │  (Users,   │ │  (Cache,   │ │  (Files)   │                       │  │
│  │  │   Plans)   │ │  Sessions) │ │   Futur    │                       │  │
│  │  └────────────┘ └────────────┘ └────────────┘                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                       │
│                                    ▼                                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     INFRASTRUCTURE IA (RunPod)                       │  │
│  │                                                                      │  │
│  │  ┌─────────────────────────────────────────────────────────────┐    │  │
│  │  │              Flask Server v7 (port 8080)                     │    │  │
│  │  │                                                              │    │  │
│  │  │  ┌──────────────────────────────────────────────────────┐   │    │  │
│  │  │  │              CONTEXTE PARTAGE (Redis)                 │   │    │  │
│  │  │  │  • Profil utilisateur                                │   │    │  │
│  │  │  │  • Historique chiffre AES-256                        │   │    │  │
│  │  │  │  • Insights partages entre anges                      │   │    │  │
│  │  │  └──────────────────────────────────────────────────────┘   │    │  │
│  │  │                          │                                   │    │  │
│  │  │      ┌──────────────────┼──────────────────┐                │    │  │
│  │  │      ▼                  ▼                  ▼                │    │  │
│  │  │  ┌────────┐        ┌────────┐        ┌────────┐            │    │  │
│  │  │  │Raphael │◄──────►│Gabriel │◄──────►│Michael │            │    │  │
│  │  │  │General │        │Market. │        │Commerc.│            │    │  │
│  │  │  │#8b5cf6 │        │#ec4899 │        │#22c55e │            │    │  │
│  │  │  └────────┘        └────────┘        └────────┘            │    │  │
│  │  │                                                              │    │  │
│  │  └─────────────────────────────────────────────────────────────┘    │  │
│  │                                │                                     │  │
│  │                                ▼                                     │  │
│  │  ┌─────────────────────────────────────────────────────────────┐    │  │
│  │  │                    vLLM API (port 8000)                      │    │  │
│  │  │              Hermes-3-Llama-8B + Function Calling            │    │  │
│  │  │                  OpenAI-compatible API                       │    │  │
│  │  └─────────────────────────────────────────────────────────────┘    │  │
│  │                                                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Stack technique

### Frontend (React 18)

| Technologie | Usage |
|-------------|-------|
| **React 18** | Framework UI |
| **TypeScript** | Typage statique |
| **Vite 7** | Build tool |
| **Tailwind CSS 4** | Styling |
| **Zustand** | State management |
| **Framer Motion** | Animations |
| **Lucide React** | Icones |

### Backend (Symfony 7)

| Technologie | Usage |
|-------------|-------|
| **Symfony 7** | Framework backend |
| **PHP 8.3** | Langage |
| **Doctrine ORM** | Base de donnees |
| **LexikJWT** | Authentification JWT |
| **Nelmio CORS** | Gestion CORS |
| **Stripe PHP** | Paiements |

### Infrastructure IA (RunPod)

| Composant | Details |
|-----------|---------|
| **GPU** | NVIDIA RTX 4090 |
| **LLM** | Hermes-3-Llama-8B |
| **Inference** | vLLM (port 8000) |
| **API** | Flask (port 8080) |
| **Cache** | Redis (chiffrement AES-256) |

### Base de donnees

| Service | Usage |
|---------|-------|
| **MySQL** | Donnees relationnelles (Hostinger) |
| **Redis** | Cache, sessions, historique chiffre |

---

## Les 3 Anges - Architecture detaillee

### Raphael - Ange Guerisseur

```
Couleur: #8b5cf6 (violet)
Role: Assistant General
Specialites:
  - Organisation et productivite
  - Redaction de documents
  - Brainstorming et creativite
  - Recherche et synthese
  - Conseils generaux
```

### Gabriel - Ange Messager

```
Couleur: #ec4899 (rose)
Role: Expert Marketing
Specialites:
  - Strategies marketing
  - SEO et mots-cles
  - Creation de contenu
  - Publicite digitale
  - Analyse de performances
```

### Michael - Ange Protecteur

```
Couleur: #22c55e (vert)
Role: Expert Commercial
Specialites:
  - Prospection
  - Scripts de vente
  - Negociation
  - Closing
  - Pipeline commercial
```

### Communication inter-anges

Les 3 anges partagent un contexte utilisateur commun stocke dans Redis :

```json
{
  "userId": "user_123",
  "company": {
    "name": "TechStart SAS",
    "industry": "SaaS",
    "size": "10-50"
  },
  "goals": ["Augmenter le CA", "Lancer US"],
  "challenges": ["Acquisition", "Positionnement"],
  "insights": {
    "raphael": "Utilisateur prepare un pitch",
    "gabriel": "Besoin SEO avant prospection",
    "michael": "Deal en cours avec Acme"
  }
}
```

---

## Tarification v7

| Plan | Prix | Tokens/mois | Anges | Documents |
|------|------|-------------|-------|-----------|
| **Essai Gratuit** | 0eur (7 jours) | 100K | 3 | 10 |
| **Pro** | 50eur/mois | 2M | 3 | 100 |

- Paiement annuel : 480eur/an (2 mois offerts)
- Fonctionnalites Pro : Support prioritaire, API access, historique illimite

---

## Flux de donnees

### Authentification

```
┌────────┐    ┌─────────┐    ┌─────────┐    ┌───────┐
│ Client │───>│ Backend │───>│ JWT     │───>│ Redis │
│        │    │ /login  │    │ Token   │    │Session│
└────────┘    └─────────┘    └─────────┘    └───────┘
```

### Chat avec un Ange

```
┌────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌───────┐
│ Client │───>│ Backend │───>│ RunPod  │───>│ vLLM    │───>│ Redis │
│        │    │ /chat   │    │ Flask   │    │ LLM     │    │History│
└────────┘    └─────────┘    └─────────┘    └─────────┘    └───────┘
                                  │
                                  ▼
                           ┌─────────────┐
                           │   Contexte  │
                           │   Partage   │
                           │   (Redis)   │
                           └─────────────┘
```

### Paiement Stripe

```
┌────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Client │───>│ Backend │───>│ Stripe  │───>│ Webhook │
│        │    │/checkout│    │Checkout │    │ Update  │
└────────┘    └─────────┘    └─────────┘    └─────────┘
```

---

## Securite

### Mesures implementees

- **HTTPS** obligatoire (TLS 1.3)
- **JWT** avec expiration (1h access, 7d refresh)
- **Chiffrement AES-256** pour l'historique (Redis)
- **CORS** configure pour le domaine
- **Rate limiting** par IP et par user
- **Validation** des inputs
- **Headers securite** (CSP, HSTS, X-Frame-Options)

### Conformite RGPD

- [x] Consentement explicite (cookies)
- [x] Droit a l'effacement
- [x] Export des donnees
- [x] Hebergement en France (Hostinger EU)
- [x] DPO : dpo@quernel-intelligence.com
- [x] Pages legales completes

---

## Deploiement

### CI/CD GitHub Actions

```yaml
Workflow: .github/workflows/deploy.yml

Triggers:
  - push: main

Jobs:
  1. frontend:
     - Build React (npm run build)
     - Upload artifact

  2. backend:
     - Validate Symfony
     - Check composer

  3. deploy:
     - Download artifacts
     - rsync frontend → public_html/
     - rsync backend → backend/
     - Create .env production
     - composer install --no-dev
     - cache:clear
```

### URLs de production

| Service | URL |
|---------|-----|
| **Frontend** | https://quernel-intelligence.com |
| **Backend API** | https://quernel-intelligence.com/api |
| **RunPod Flask** | http://runpod-ip:8080 |
| **RunPod vLLM** | http://runpod-ip:8000 |

---

## Monitoring

### Metriques cles

| Metrique | Objectif |
|----------|----------|
| Temps reponse API | < 200ms |
| Temps reponse IA | < 3s |
| Uptime | > 99.5% |
| Erreurs 5xx | < 0.1% |

### Logs

- **Backend**: Symfony logs (var/log/)
- **Frontend**: Console + Sentry (futur)
- **RunPod**: Flask logs

---

## Structure du projet

```
QUERNEL-INTELLIGENCE/
├── Saas/
│   ├── frontend/                 # Application React
│   │   ├── src/
│   │   │   ├── components/       # Composants React
│   │   │   │   ├── auth/         # Login, Register
│   │   │   │   ├── chat/         # ChatInterface
│   │   │   │   ├── dashboard/    # Dashboard
│   │   │   │   ├── landing/      # LandingPage
│   │   │   │   ├── pricing/      # PricingPage
│   │   │   │   └── legal/        # Pages legales
│   │   │   ├── services/         # API calls
│   │   │   ├── stores/           # Zustand stores
│   │   │   └── lib/              # Utilitaires
│   │   ├── public/
│   │   └── package.json
│   │
│   ├── backend/                  # API Symfony
│   │   ├── src/
│   │   │   ├── Controller/       # API endpoints
│   │   │   ├── Entity/           # User, Plan, Agent, etc.
│   │   │   ├── Repository/       # Requetes DB
│   │   │   ├── Service/          # StripeService, etc.
│   │   │   └── DataFixtures/     # Donnees initiales
│   │   ├── config/
│   │   ├── migrations/
│   │   └── composer.json
│   │
│   └── .github/
│       └── workflows/
│           └── deploy.yml        # CI/CD
│
├── docs/
│   ├── ARCHITECTURE_SAAS.md      # Ce fichier
│   ├── AGENTS_IA.md              # Details 3 Anges
│   ├── ROADMAP.md                # Fonctionnalites futures
│   ├── INSTALLATION.md           # Guide installation
│   └── QUICKSTART.md             # Demarrage rapide
│
└── scripts/
    └── deploy.sh                 # Script deploy manuel
```

---

## Evolutions prevues

Voir [ROADMAP.md](./ROADMAP.md) pour le detail des fonctionnalites a venir :

- **Q1-Q2 2026** : Analyse de documents, generation PDF
- **Q2 2026** : RAG (base de connaissances)
- **Q2-Q3 2026** : Voice + Vision
- **Q3 2026** : Integrations CRM
- **Q4 2026** : Workflows automatises
- **2027** : Mode equipe + Enterprise

---

*Derniere mise a jour : 25 janvier 2026 - Architecture v7 "Les 3 Anges"*
