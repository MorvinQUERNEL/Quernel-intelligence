# Quernel Intelligence

**Site officiel de Quernel Intelligence** - [quernel-intelligence.com](https://quernel-intelligence.com)

Solutions IA pour PME : agents IA sur mesure, workflows automatisés et audits IA chiffrés. Création de sites web en offre complémentaire. Le site comprend un tunnel de devis automatisé, un audit IA flash en ligne et le paiement Stripe.

## Stack technique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4, Framer Motion, Vite |
| **Backend** | PHP 8.2 (endpoints flat), SQLite, FPDF |
| **Paiement** | Stripe (Checkout + webhooks) |
| **Hébergement** | Hostinger mutualisé (Apache + .htaccess) |
| **Démo agents IA** | [agents.quernel-cloud.com](https://agents.quernel-cloud.com) — Next.js sur VPS (repo séparé) |

## Fonctionnalités

- **Site vitrine** : pages Accueil, Services, Agents IA, Audit, Tarifs, FAQ, Contact
- **Audit IA flash** : formulaire → rapport PDF automatique par email (`api/audit-send.php`)
- **Générateur de devis** : questionnaire → PDF + relances automatiques (`api/devis-send.php`)
- **Paiement en ligne** : Stripe (carte, Apple Pay, Google Pay)
- **Contact** : `api/contact.php` (PHP flat, accusé de réception automatique)
- **SEO/GEO** : meta dynamiques, `schema.json`, `llms.txt`, `llms-full.txt`, `ai.txt`

## Architecture

```
quernel-intelligence/
├── frontend/            # SPA React 19 + TypeScript + Vite
│   ├── src/pages/       # HomePage, AgentsPage, AuditPage, ServicesPage, ...
│   ├── src/components/  # sections, layout, seo, ui
│   └── public/          # llms.txt, schema.json, sitemap.xml, ...
├── server/              # Copies de référence des endpoints PHP de production
│   └── api/             # audit-send.php, contact.php (secrets externalisés)
└── docs/                # Specs et plans (superpowers)
```

En production, le build Vite est déployé dans `public_html/` à côté des dossiers `api/`, `devis/`, `paiement/`, `admin/` et `lib/fpdf/`. Les secrets (SMTP) vivent dans `data/smtp-config.php`, hors du dépôt et hors de la racine web.

## Développement local

```bash
cd frontend && npm install && npm run dev
```

## Déploiement

```bash
cd frontend && npm run build
rsync -az -e "ssh -p 65002" dist/ u…@82.25.113.5:~/domains/quernel-intelligence.com/public_html/
```

Les endpoints PHP de `server/api/` sont copiés manuellement dans `public_html/api/` après modification.

## Auteur

**Morvin QUERNEL** — Développeur Full-Stack
