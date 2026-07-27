# Pivot IA de Quernel Intelligence — Design

Date : 2026-07-27
Statut : validé par Morvin (périmètre, roster, positionnement, offre audit, nettoyage, retrait trading, migration contact)

## Objectif

Repositionner quernel-intelligence.com sur les solutions IA — agents, workflows, audits — pour augmenter les revenus des PME. Deux livrables : le site vitrine refondu (machine commerciale) et une plateforme démo d'agents (argument de vente), inspirée du template `agents-platform-template` (audité le 2026-07-27 : aucun prompt caché, aucun code malveillant).

## Flux commercial

Prospection → site → audit flash gratuit (formulaire → rapport PDF automatique) → RDV → audit complet payant (490-990 €) → prestation agents/workflows. La démo intervient en RDV ou en libre accès depuis le site.

## Architecture actuelle (constatée en prod, check-up 2026-07-27)

- Domaine servi : `~/domains/quernel-intelligence.com/public_html/` (Hostinger mutualisé, PHP 8.2).
- SPA React 19 (build Vite, source = ce repo) : `/`, `/services`, `/tarifs`, `/faq`, `/contact`, `/mentions-legales`, `/confidentialite`.
- `/devis` : page standalone HTML (hors SPA) → `api/devis-send.php` (PDF FPDF, SQLite `data/quernel_devis.sqlite`, relances cron 14h).
- `/paiement` : PHP → `api/stripe-intent.php` + `data/stripe-config.php`.
- `/admin` : panel single-file (IMAP, devis, prospection).
- `/api/contact` : routé via `api/.htaccess` → `api/index.php` → kernel Symfony dans `~/public_html/backend/` (hors domaine, vestige).
- `prospection/` : emailing cron (actif, non touché par ce chantier).

## Décisions validées

1. **Périmètre** : les deux — refonte du site vitrine ET plateforme démo sur le VPS.
2. **Roster** : agents repensés « orientés revenus » (pas de simple rebranding du template).
3. **Positionnement** : IA en tête (hero, pages dédiées), création/refonte web conservée en offre secondaire.
4. **Audit** : flash gratuit (lead magnet automatisé) + complet payant 490-990 €.
5. **Nettoyage serveur** : suppressions validées, avec archive tar.gz horodatée préalable dans `~/backups/` sur le serveur.
6. **Bots trading** : offre retirée du site (Services + Tarifs).
7. **Contact** : migration vers `api/contact.php` flat, puis suppression du Symfony vestigial `~/public_html/backend/`.

## Partie A — Site vitrine (ce repo, stack conservée)

Stack inchangée : React 19 + Vite en front, endpoints PHP flat en back, Hostinger mutualisé. Le design system existant est conservé.

### Modifications SPA

- **Hero** : « Agents IA, workflows et audits pour augmenter les revenus de votre entreprise » (formulation à affiner au moment du copywriting, passe humanizer obligatoire).
- **Services** : réordonné — Agents IA, Workflows/Automation, Audit IA en tête ; Création web en secondaire. Bots trading retiré.
- **Tarifs** : Trading Bot 1499 retiré ; ajout Audit complet (490-990 € selon taille), les offres Agent IA / Automation Pro restent et sont reliées au catalogue d'agents.
- **Nouvelle page `/agents`** : catalogue des 6 agents QI (voir Partie B), chaque agent = cas d'usage + gains attendus + bouton « Voir la démo » vers la plateforme.
- **Nouvelle page `/audit`** : présentation des deux niveaux d'audit + formulaire audit flash (secteur, taille, tâches répétitives, outils actuels).
- SEO : mise à jour `llms.txt`, `schema.json`, sitemap, meta (title actuel : « Création de Sites Internet & Solutions IA » → inverser la hiérarchie).

### Nouveaux endpoints PHP flat (`public_html/api/`)

- **`audit-send.php`** : calqué sur `devis-send.php` — validation, enregistrement SQLite (table `audits` dans `quernel_devis.sqlite` ou base dédiée), génération PDF FPDF du rapport flash (gains IA possibles par processus, chiffrage indicatif), envoi email, notification Telegram, CTA audit complet en fin de rapport.
- **`contact.php`** : validation + envoi SMTP (même mécanique que devis-send), remplace le kernel Symfony. `api/.htaccess` et `api/index.php` adaptés ; le SPA appelle `/api/contact` → réécrire vers `contact.php`.

### Nettoyage

Sur le serveur (après archive tar.gz horodatée dans `~/backups/`) :
- `public_html/assets/` : vieux builds non référencés (~10 js/css) + ~40 fonts .woff/.woff2 mortes — purgés naturellement par le redéploiement propre du build.
- `public_html/admin/index.php.bak`.
- `public_html/api/devis.php` (appelé par personne).
- `~/domains/quernel-intelligence.com/{frontend,backend,nginx}/` (dépôt jamais servi).
- `~/public_html/backend/` (Symfony vestigial) — seulement APRÈS mise en prod et test de `contact.php`.
- `data/devis-relance.log` purgé (et taille surveillée).

Dans le repo : `backend/`, `docker/`, `nginx/` supprimés ou déplacés dans `archive/` — le déploiement réel est build statique + PHP flat ; le README est réaligné sur la réalité.

## Partie B — Plateforme démo d'agents

- Fork du template audité → `~/Desktop/01_Projets/Quernel_Intelligence/agents-platform/`.
- Rebranding via `platform/src/config/brand.ts` (Quernel Intelligence, contexte entreprise, ton).
- Déploiement VPS 46.202.168.181 (user openclaw), Docker + Nginx, sous-domaine `agents.quernel-cloud.com` (même schéma que dashboard/sambuc/chef).
- Mode mock par défaut (coût API nul, démo permanente) ; `ANTHROPIC_API_KEY` activable pour les démos live en RDV ; `DEMO_MOCK=1` disponible.

### Roster (6 agents, prompts réécrits en gardant la rigueur du template : anti-hallucination, frontmatter, livrables fichiers)

1. **Prospecteur (SDR)** — trouve et qualifie des cibles, rédige des séquences d'emails personnalisées.
2. **Support client** — tri des demandes, réponses, escalade avec to-do priorisée.
3. **Assistant admin** — devis, relances impayés, préparation facturation.
4. **Créateur de contenu** — posts LinkedIn, emails marketing, scripts courts.
5. **Analyste** — rapports de performance, ROI, plan 30 jours ; jamais de chiffre inventé.
6. **Auditeur IA** — cartographie les processus d'une entreprise et chiffre les gains IA ; version interactive de l'offre audit, pont vers le devis.

L'orchestrateur et le workflow multi-agent du template sont conservés. Les agents non retenus du template (Designer, Présentateur, Fireflies, Recruteuse, Gmail) sont retirés du roster actif (`ACTIVE_SLUGS`).

## Ordre de réalisation

1. Plateforme démo rebrandée et déployée sur le VPS (crédibilise le reste).
2. SPA : hero + Services + Tarifs + pages `/agents` et `/audit` ; endpoints `audit-send.php` et `contact.php` ; rebuild + déploiement propre.
3. Nettoyage serveur (archive puis suppressions ; Symfony vestigial en dernier, après validation de contact.php en prod).

## Risques et garde-fous

- **Backup avant toute modif de schéma SQLite** (règle Morvin) : dump avant création de la table `audits`.
- **Contact** : ne supprimer `~/public_html/backend/` qu'après test en prod du nouveau `contact.php` (formulaire réel soumis et email reçu).
- **Coût API démo** : mode mock par défaut ; la clé n'est branchée que ponctuellement.
- **Copywriting** : tout texte public passe le skill humanizer + detect-ai avant mise en ligne.
