# Les 3 Anges - QUERNEL INTELLIGENCE v7

> Architecture "Les 3 Anges" - 3 agents experts travaillant en synergie

---

## Vue d'ensemble

QUERNEL INTELLIGENCE utilise une architecture innovante basee sur 3 agents IA specialises ("Les Anges") qui partagent un contexte utilisateur commun et communiquent entre eux pour offrir une experience coherente et personnalisee.

---

## Les 3 Anges

### Raphael - Ange Guerisseur (Assistant General)

**Couleur**: `#8b5cf6` (violet)
**Icone**: Sparkles

**Specialite**: Assistant polyvalent pour l'organisation, la redaction et la productivite

**Capacites**:
- Recherche et synthese d'informations
- Redaction de documents professionnels
- Organisation et productivite
- Brainstorming et creativite
- Conseils generaux pour les entreprises

**System Prompt**:
```
Tu es Raphael, l'ange guerisseur de QUERNEL INTELLIGENCE.
Tu es un assistant polyvalent qui aide sur tous les sujets :
organisation, redaction, productivite, brainstorming.
Tu travailles en synergie avec Gabriel (Marketing) et Michael (Commercial).
Tu as acces au contexte partage de l'utilisateur.
Reponds en francais de maniere claire et bienveillante.
```

---

### Gabriel - Ange Messager (Expert Marketing)

**Couleur**: `#ec4899` (rose)
**Icone**: TrendingUp

**Specialite**: Strategies marketing, SEO, contenu et communication digitale

**Capacites**:
- Strategies marketing completes
- Optimisation SEO et mots-cles
- Creation de contenu engageant
- Campagnes publicitaires (Google Ads, Meta, LinkedIn)
- Analyse des performances et ROI
- Image de marque et branding

**System Prompt**:
```
Tu es Gabriel, l'ange messager de QUERNEL INTELLIGENCE.
Tu es l'expert marketing et communication qui aide les entreprises.
Specialites : SEO, contenu, publicite, analyse de performances.
Tu travailles en synergie avec Raphael (General) et Michael (Commercial).
Tu partages tes insights marketing avec les autres anges.
Reponds en francais avec des conseils actionnables et des exemples concrets.
```

---

### Michael - Ange Protecteur (Expert Commercial)

**Couleur**: `#22c55e` (vert)
**Icone**: Users

**Specialite**: Vente, prospection, negociation et developpement commercial

**Capacites**:
- Strategies de prospection efficaces
- Scripts de vente percutants
- Techniques de negociation
- Closing et conversion
- Gestion du pipeline commercial
- Formation des equipes commerciales

**System Prompt**:
```
Tu es Michael, l'ange protecteur de QUERNEL INTELLIGENCE.
Tu es l'expert commercial et vente qui aide les entreprises.
Specialites : prospection, negociation, closing, pipeline.
Tu travailles en synergie avec Raphael (General) et Gabriel (Marketing).
Tu partages tes insights commerciaux avec les autres anges.
Reponds en francais avec energie et des conseils terrain concrets.
```

---

## Architecture Technique v7

```
┌─────────────────────────────────────────────────────────────────┐
│                     QUERNEL INTELLIGENCE v7                      │
│                       "Les 3 Anges"                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               CONTEXTE PARTAGE (Redis)                    │   │
│  │  • Profil utilisateur (entreprise, objectifs, defis)     │   │
│  │  • Historique chiffre AES-256                            │   │
│  │  • Insights partages entre anges                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│          ┌───────────────────┼───────────────────┐               │
│          ▼                   ▼                   ▼               │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │
│  │   Raphael    │   │   Gabriel    │   │   Michael    │         │
│  │   (General)  │◄──►│  (Marketing) │◄──►│ (Commercial) │         │
│  │              │   │              │   │              │         │
│  │  #8b5cf6     │   │  #ec4899     │   │  #22c55e     │         │
│  └──────────────┘   └──────────────┘   └──────────────┘         │
│          │                   │                   │               │
│          └───────────────────┼───────────────────┘               │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Flask Server v7 (8080)                   │   │
│  │  • /webhook/chat - Chat avec les anges                   │   │
│  │  • /api/profile - Gestion du profil utilisateur          │   │
│  │  • /api/history - Historique des conversations           │   │
│  │  • /api/feedback - Systeme d'amelioration continue       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    vLLM API (8000)                        │   │
│  │              Hermes-3-Llama-8B + Function Calling         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Synergie entre les Anges

### Contexte Partage

Chaque ange a acces au profil de l'utilisateur stocke dans Redis :

```json
{
  "company_name": "TechStart SAS",
  "industry": "SaaS / Tech",
  "size": "10-50 employes",
  "goals": ["Augmenter le CA de 30%", "Lancer sur le marche US"],
  "challenges": ["Acquisition clients", "Positionnement"],
  "preferences": {"communication_style": "professionnel", "detail_level": "detaille"}
}
```

### Communication Inter-Agents

Les anges partagent des **insights** qui enrichissent leurs reponses :

- **Gabriel** peut dire a **Michael** : "L'utilisateur a besoin d'ameliorer son SEO avant la prospection"
- **Michael** peut dire a **Raphael** : "L'utilisateur prepare un pitch investisseur"
- **Raphael** coordonne et synthetise les informations des deux autres anges

### Amelioration Continue

Un systeme de feedback permet aux utilisateurs d'evaluer les reponses :

```json
{
  "rating": 5,
  "comment": "Tres utile pour ma strategie SEO",
  "agentId": "gabriel",
  "messageId": "msg_123"
}
```

Ces feedbacks sont utilises pour ameliorer les prompts et la qualite des reponses.

---

## Structure Redis

```
user:{userId}:profile           → Profil utilisateur (JSON)
user:{userId}:context           → Contexte partage (JSON chiffre Fernet)
user:{userId}:history:{hash}    → Historique conversations (JSON chiffre)
user:{userId}:insights:raphael  → Insights de Raphael (JSON)
user:{userId}:insights:gabriel  → Insights de Gabriel (JSON)
user:{userId}:insights:michael  → Insights de Michael (JSON)
feedback:{messageId}            → Feedback utilisateur (JSON)
```

---

## API Endpoints

### Chat
```http
POST /webhook/chat
Content-Type: application/json

{
  "message": "Comment ameliorer mon SEO ?",
  "agentId": "gabriel",
  "userId": "user_123"
}
```

### Profil
```http
GET /api/profile/{userId}
PUT /api/profile/{userId}
```

### Historique
```http
GET /api/history/{userId}
GET /api/history/{userId}/{agentId}
DELETE /api/history/{userId}
DELETE /api/history/{userId}/{agentId}
```

### Feedback
```http
POST /api/feedback
{
  "userId": "user_123",
  "agentId": "gabriel",
  "messageId": "msg_456",
  "rating": 5,
  "comment": "Excellente reponse"
}
```

---

## Migration depuis v6 (9 agents)

| Ancien Agent | Nouvel Ange |
|--------------|-------------|
| Tom (Telephonie) | Raphael (General) |
| John (Marketing) | Gabriel (Marketing) |
| Lou (SEO) | Gabriel (Marketing) |
| Julia (Juridique) | Raphael (General) |
| Elio (Commercial) | Michael (Commercial) |
| Charly+ (General) | Raphael (General) |
| Manue (Comptabilite) | Raphael (General) |
| Rony (RH) | Raphael (General) |
| Chatbot (Service Client) | Raphael (General) |

**Note**: Les anciennes conversations sont preservees dans l'historique.

---

## Evolutions Futures

- [ ] RAG (Retrieval Augmented Generation) avec documents clients
- [ ] Fine-tuning sur donnees metier specifiques
- [ ] Voix (Speech-to-Text / Text-to-Speech)
- [ ] Integration CRM (Salesforce, HubSpot)
- [ ] Mode equipe (plusieurs utilisateurs, meme contexte entreprise)
- [ ] Agents supplementaires selon les besoins

---

*Derniere mise a jour: 25 janvier 2026 - Architecture v7 "Les 3 Anges"*
