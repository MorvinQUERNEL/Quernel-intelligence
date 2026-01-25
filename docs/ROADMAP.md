# QUERNEL INTELLIGENCE - Roadmap des Fonctionnalites

> Vision produit et fonctionnalites a venir pour la plateforme IA

---

## Vision

Faire de QUERNEL INTELLIGENCE la plateforme IA de reference pour les PME francaises, avec une suite complete d'outils intelligents, 100% hebergee en France, conforme RGPD.

---

## Statut actuel (v7.1 - Janvier 2026)

### Fonctionnalites en production

- [x] **Les 3 Anges IA** (Raphael, Gabriel, Michael)
- [x] **Chat conversationnel** avec streaming temps reel
- [x] **Contexte partage** entre les anges
- [x] **Authentification** JWT + OAuth (Google, Apple)
- [x] **Abonnements Stripe** (Essai 7j + Pro 50eur/mois)
- [x] **Dashboard utilisateur** avec statistiques
- [x] **Historique des conversations** chiffre
- [x] **Pages legales RGPD** completes
- [x] **CI/CD GitHub Actions** vers Hostinger

---

## Phase 2 : Analyse de Documents (Q1 2026)

### Analyse de fichiers par l'IA

> Permettre aux anges d'analyser des fichiers uploades par l'utilisateur

| Fonctionnalite | Description | Priorite |
|----------------|-------------|----------|
| **Upload de fichiers** | PDF, DOCX, XLSX, images, CSV | Haute |
| **Extraction de texte** | OCR pour les images et scans | Haute |
| **Analyse contextuelle** | L'ange analyse et repond sur le contenu | Haute |
| **Resume automatique** | Generation de syntheses de documents | Moyenne |
| **Comparaison** | Comparer plusieurs documents | Moyenne |

#### Implementation technique

```
Frontend:
- Composant FileUpload avec drag & drop
- Preview des fichiers avant envoi
- Progress bar pour l'upload

Backend:
- Endpoint POST /api/documents/upload
- Stockage MinIO/S3 (chiffre)
- Extraction texte: Apache Tika / PyMuPDF
- OCR: Tesseract via RunPod

IA:
- Contexte augmente avec le contenu du document
- Chunking intelligent pour les gros documents
```

#### Formats supportes

| Type | Extensions | Taille max |
|------|------------|------------|
| Documents | PDF, DOCX, DOC, ODT, TXT | 50 Mo |
| Tableurs | XLSX, XLS, CSV | 20 Mo |
| Images | PNG, JPG, JPEG, WEBP | 10 Mo |
| Presentations | PPTX, PPT | 50 Mo |

---

### Generation de PDF

> Les anges peuvent creer des documents PDF professionnels

| Fonctionnalite | Description | Priorite |
|----------------|-------------|----------|
| **Export conversation** | Exporter un chat en PDF formate | Haute |
| **Rapports structures** | Generer des rapports avec sections | Haute |
| **Templates** | Modeles de documents pre-configures | Moyenne |
| **Branding personnalise** | Logo et couleurs de l'entreprise | Moyenne |
| **Tableaux et graphiques** | Inclusion de donnees visuelles | Basse |

#### Templates de documents

- **Raphael** : Comptes-rendus, notes de reunion, to-do lists
- **Gabriel** : Plans marketing, briefs SEO, rapports analytics
- **Michael** : Propositions commerciales, devis, scripts de vente

#### Implementation technique

```
Backend:
- Service PDFGenerator (wkhtmltopdf / Puppeteer)
- Templates Twig pour chaque type de document
- Endpoint GET /api/documents/{id}/export/pdf

Frontend:
- Bouton "Exporter en PDF" dans le chat
- Choix du template
- Apercu avant telechargement
```

---

## Phase 3 : RAG Avance (Q2 2026)

### Base de connaissances personnalisee

> Chaque utilisateur peut creer sa propre base documentaire

| Fonctionnalite | Description | Priorite |
|----------------|-------------|----------|
| **Upload en masse** | Importer plusieurs documents | Haute |
| **Indexation vectorielle** | Embeddings via Qdrant | Haute |
| **Recherche semantique** | Trouver des infos par sens | Haute |
| **Citations** | References aux sources dans les reponses | Moyenne |
| **Mise a jour** | Reindexation automatique | Moyenne |

#### Architecture RAG

```
┌──────────────────────────────────────────────────────────────┐
│                    Pipeline RAG                               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │   Upload    │───>│  Chunking   │───>│  Embedding  │       │
│  │  Document   │    │  (512 tok)  │    │  (BGE-M3)   │       │
│  └─────────────┘    └─────────────┘    └─────────────┘       │
│                                               │               │
│                                               ▼               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │   Reponse   │<───│   Fusion    │<───│   Qdrant    │       │
│  │   Ange IA   │    │  Contexte   │    │   Search    │       │
│  └─────────────┘    └─────────────┘    └─────────────┘       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

#### Modele d'embedding

- **BGE-M3** : Multilingue, optimise pour le francais
- Heberge sur RunPod (meme infra que le LLM)
- Dimension : 1024
- Chunking : 512 tokens avec overlap 50

---

## Phase 4 : Communication Multimodale (Q2-Q3 2026)

### Voix (Speech-to-Text / Text-to-Speech)

> Parler avec les anges et recevoir des reponses vocales

| Fonctionnalite | Description | Priorite |
|----------------|-------------|----------|
| **Dictee vocale** | Enregistrer sa voix au lieu de taper | Haute |
| **Reponses audio** | Les anges parlent | Moyenne |
| **Transcription** | Convertir des fichiers audio | Moyenne |
| **Voix personnalisee** | Choisir la voix de chaque ange | Basse |

#### Stack technique

```
Speech-to-Text:
- Whisper Large V3 (via RunPod)
- Support francais natif
- Temps reel avec WebSocket

Text-to-Speech:
- Coqui TTS ou Bark
- Voix francaises naturelles
- Streaming audio
```

### Analyse d'images

> Les anges peuvent voir et analyser des images

| Fonctionnalite | Description | Priorite |
|----------------|-------------|----------|
| **Vision** | Decrire le contenu d'une image | Haute |
| **OCR intelligent** | Extraire le texte des images | Haute |
| **Analyse de graphiques** | Interpreter des charts/diagrammes | Moyenne |
| **Screenshots** | Analyser des captures d'ecran | Moyenne |

#### Modele Vision

- **LLaVA 1.6** ou **Qwen-VL**
- Heberge sur RunPod
- Integration via multimodal prompt

---

## Phase 5 : Integrations Externes (Q3 2026)

### CRM / Outils metier

> Connecter les anges aux outils du quotidien

| Integration | Description | Ange principal |
|-------------|-------------|----------------|
| **HubSpot** | Sync contacts, deals, companies | Michael |
| **Salesforce** | CRM enterprise | Michael |
| **Pipedrive** | Pipeline commercial | Michael |
| **Mailchimp** | Campagnes email | Gabriel |
| **Google Analytics** | Donnees de trafic | Gabriel |
| **SEMrush** | Donnees SEO | Gabriel |
| **Notion** | Base de connaissances | Raphael |
| **Slack** | Notifications et chat | Tous |
| **Google Calendar** | Planification | Raphael |

#### Architecture des integrations

```
┌─────────────────────────────────────────────────────────────┐
│                   Integration Hub                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │  HubSpot   │  │ Salesforce │  │  Pipedrive │             │
│  │  Connector │  │  Connector │  │  Connector │             │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘             │
│        │               │               │                     │
│        └───────────────┼───────────────┘                     │
│                        ▼                                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Unified Data Layer                       │   │
│  │  - Contacts normalisés                               │   │
│  │  - Deals/Opportunites                                │   │
│  │  - Activites                                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                        │                                     │
│                        ▼                                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 Anges IA                              │   │
│  │  Michael : "Votre deal avec Acme est en phase 3..."  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 6 : Automatisation (Q4 2026)

### Workflows intelligents

> Automatiser des taches repetitives avec les anges

| Fonctionnalite | Description | Priorite |
|----------------|-------------|----------|
| **Triggers** | Declencheurs (heure, evenement, webhook) | Haute |
| **Actions** | Envoyer email, creer doc, notifier | Haute |
| **Templates** | Workflows pre-configures | Moyenne |
| **Builder visuel** | Interface drag & drop | Moyenne |
| **Historique** | Logs des executions | Haute |

#### Exemples de workflows

**Gabriel - Marketing Automation**
```
Trigger: Nouveau lead sur landing page
→ Analyser le profil du lead
→ Generer un email personnalise
→ Ajouter au CRM avec score
→ Notifier l'equipe commerciale
```

**Michael - Suivi Commercial**
```
Trigger: Deal inactif depuis 7 jours
→ Analyser l'historique du deal
→ Suggerer une action de relance
→ Rediger un email de suivi
→ Creer une tache de rappel
```

**Raphael - Reporting**
```
Trigger: Chaque lundi 9h
→ Agreger les metriques de la semaine
→ Generer un rapport PDF
→ Envoyer par email au manager
```

---

## Phase 7 : Collaboration (Q1 2027)

### Mode equipe

> Plusieurs utilisateurs partagent le meme espace

| Fonctionnalite | Description | Priorite |
|----------------|-------------|----------|
| **Organisations** | Creer une equipe | Haute |
| **Roles** | Admin, Member, Viewer | Haute |
| **Conversations partagees** | Chat visible par l'equipe | Haute |
| **Mentions** | @utilisateur dans le chat | Moyenne |
| **Base de connaissances equipe** | Documents partages | Haute |

#### Modele de permissions

| Role | Chat | Documents | Parametres | Facturation |
|------|------|-----------|------------|-------------|
| Owner | Tout | Tout | Tout | Tout |
| Admin | Tout | Tout | Tout | Lecture |
| Member | Tout | Tout | - | - |
| Viewer | Lecture | Lecture | - | - |

---

## Phase 8 : Enterprise (Q2 2027)

### Fonctionnalites enterprise

| Fonctionnalite | Description |
|----------------|-------------|
| **SSO SAML** | Azure AD, Okta, Google Workspace |
| **Audit logs** | Traçabilite complete des actions |
| **IP Whitelisting** | Restriction par IP |
| **Retention policies** | Politique de conservation des donnees |
| **SLA garanti** | 99.9% uptime |
| **Support dedie** | Account manager + support 24/7 |
| **Instance dediee** | Infra isolee sur demande |
| **Fine-tuning** | Modeles entraines sur vos donnees |

---

## Metriques de succes

### KPIs techniques

| Metrique | Objectif |
|----------|----------|
| Temps de reponse IA | < 2s (P95) |
| Uptime | > 99.5% |
| Satisfaction utilisateur | > 4.5/5 |
| Taux de retention | > 80% M3 |

### KPIs business

| Metrique | Objectif Q4 2026 |
|----------|------------------|
| MRR | 50K EUR |
| Utilisateurs actifs | 500 |
| Conversion trial → paid | > 15% |
| Churn mensuel | < 5% |

---

## Calendrier previsionnel

```
Q1 2026 │ v7.1 Actuel
        │ ├── 3 Anges IA
        │ ├── Chat + Streaming
        │ └── Stripe + Auth
        │
Q1-Q2   │ v8.0 Documents
2026    │ ├── Upload fichiers
        │ ├── Analyse PDF/DOCX
        │ ├── Generation PDF
        │ └── Resume automatique
        │
Q2 2026 │ v9.0 RAG
        │ ├── Base de connaissances
        │ ├── Embeddings Qdrant
        │ └── Citations sources
        │
Q2-Q3   │ v10.0 Multimodal
2026    │ ├── Voice input/output
        │ ├── Analyse d'images
        │ └── OCR intelligent
        │
Q3 2026 │ v11.0 Integrations
        │ ├── CRM (HubSpot, etc.)
        │ ├── Marketing tools
        │ └── Notifications Slack
        │
Q4 2026 │ v12.0 Automation
        │ ├── Workflows builder
        │ ├── Triggers & Actions
        │ └── Templates
        │
Q1 2027 │ v13.0 Teams
        │ ├── Organisations
        │ ├── Roles & Permissions
        │ └── Partage d'espace
        │
Q2 2027 │ v14.0 Enterprise
        │ ├── SSO SAML
        │ ├── Audit & Compliance
        │ └── Support Premium
```

---

## Contributions

Ce document est maintenu par l'equipe QUERNEL INTELLIGENCE.
Pour suggerer une fonctionnalite : contact@quernel-intelligence.com

---

*Derniere mise a jour : 25 janvier 2026*
*Version du document : 1.0*
