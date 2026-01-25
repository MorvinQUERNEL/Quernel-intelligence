# QUERNEL INTELLIGENCE - Schéma de Base de Données

## Vue d'ensemble

Base de données: **PostgreSQL**
ORM: **Doctrine** (Symfony)

---

## Tables principales

### 1. `users` - Utilisateurs

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),

    -- Statut
    email_verified_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,

    -- Plan
    plan_id UUID REFERENCES plans(id),
    plan_started_at TIMESTAMP,
    plan_expires_at TIMESTAMP,

    -- Stripe
    stripe_customer_id VARCHAR(255),

    -- Organisation (optionnel)
    organization_id UUID REFERENCES organizations(id),
    role VARCHAR(50) DEFAULT 'member', -- owner, admin, member

    -- Métadonnées
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);
```

### 2. `plans` - Plans tarifaires

```sql
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- Free, Pro, Business, Enterprise
    slug VARCHAR(50) UNIQUE NOT NULL,

    -- Limites
    monthly_tokens INTEGER NOT NULL, -- 10000, 100000, 500000, -1 (illimité)
    max_agents INTEGER NOT NULL, -- 1, 5, 20, -1
    max_documents INTEGER NOT NULL, -- 0, 50, 500, -1
    max_team_members INTEGER DEFAULT 1,

    -- Features
    has_api_access BOOLEAN DEFAULT false,
    has_workflows BOOLEAN DEFAULT false,
    has_priority_support BOOLEAN DEFAULT false,

    -- Prix
    price_monthly DECIMAL(10, 2),
    price_yearly DECIMAL(10, 2),
    stripe_price_id_monthly VARCHAR(255),
    stripe_price_id_yearly VARCHAR(255),

    -- Métadonnées
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. `conversations` - Conversations

```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id),

    title VARCHAR(255),

    -- Stats
    message_count INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,

    -- Métadonnées
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archived_at TIMESTAMP
);

CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);
```

### 4. `messages` - Messages

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,

    -- Tokens
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,

    -- Métadonnées
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
```

### 5. `agents` - Agents IA personnalisés

```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    description TEXT,
    avatar_url VARCHAR(500),

    -- Configuration
    system_prompt TEXT NOT NULL,
    model VARCHAR(100) DEFAULT 'Qwen2.5-32B-Instruct-AWQ',
    temperature DECIMAL(3, 2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 2048,

    -- Visibilité
    is_public BOOLEAN DEFAULT false,

    -- Métadonnées
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agents_user ON agents(user_id);
```

### 6. `api_keys` - Clés API

```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL, -- SHA256 du préfixe + clé
    key_prefix VARCHAR(10) NOT NULL, -- Préfixe visible (ex: "qk_abc...")

    -- Permissions
    scopes TEXT[], -- ['chat', 'agents', 'documents']

    -- Limites
    rate_limit_per_minute INTEGER DEFAULT 60,

    -- Stats
    last_used_at TIMESTAMP,
    total_requests INTEGER DEFAULT 0,

    -- Métadonnées
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP
);

CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
```

### 7. `usage_logs` - Logs d'utilisation

```sql
CREATE TABLE usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Type d'action
    action VARCHAR(50) NOT NULL, -- 'chat', 'api_call', 'document_upload'

    -- Ressource
    resource_type VARCHAR(50), -- 'conversation', 'agent', 'document'
    resource_id UUID,

    -- Tokens
    tokens_used INTEGER DEFAULT 0,

    -- API
    api_key_id UUID REFERENCES api_keys(id),

    -- Métadonnées
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usage_user_date ON usage_logs(user_id, created_at);

-- Partition par mois pour performance
-- CREATE TABLE usage_logs_2026_01 PARTITION OF usage_logs
--     FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

### 8. `organizations` - Organisations (Phase Enterprise)

```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,

    -- Billing
    plan_id UUID REFERENCES plans(id),
    stripe_customer_id VARCHAR(255),

    -- Settings
    settings JSONB DEFAULT '{}',

    -- Métadonnées
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 9. `documents` - Documents RAG (Phase 2)

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    mime_type VARCHAR(100),
    file_size INTEGER,

    -- Stockage
    storage_path VARCHAR(500), -- MinIO path

    -- Indexation
    indexed_at TIMESTAMP,
    chunk_count INTEGER DEFAULT 0,

    -- Métadonnées
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_user ON documents(user_id);
```

---

## Relations

```
users ─┬── conversations ──── messages
       │
       ├── agents
       │
       ├── api_keys
       │
       ├── documents
       │
       ├── usage_logs
       │
       └── organizations (many-to-one)

plans ─── users (many-to-one)
```

---

## Données initiales

```sql
-- Plans par défaut
INSERT INTO plans (name, slug, monthly_tokens, max_agents, max_documents, price_monthly, has_api_access, has_workflows) VALUES
('Free', 'free', 10000, 1, 0, 0, false, false),
('Pro', 'pro', 100000, 5, 50, 29, false, false),
('Business', 'business', 500000, 20, 500, 99, true, true),
('Enterprise', 'enterprise', -1, -1, -1, NULL, true, true);
```

---

## Indexes recommandés

```sql
-- Pour les requêtes fréquentes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_conversations_user_updated ON conversations(user_id, updated_at DESC);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at);
CREATE INDEX idx_usage_monthly ON usage_logs(user_id, DATE_TRUNC('month', created_at));
```

---

## Déploiement

### Option 1: PostgreSQL sur le GPU RunPod (dev)
```bash
docker run -d --name postgres \
  -e POSTGRES_DB=quernel \
  -e POSTGRES_USER=quernel \
  -e POSTGRES_PASSWORD=<secret> \
  -p 5432:5432 \
  -v /workspace/postgres:/var/lib/postgresql/data \
  postgres:16
```

### Option 2: Service managé (production)
- Scaleway Database
- OVH Cloud Databases
- Neon (PostgreSQL serverless)

---

*Schéma créé le 11 janvier 2026 - QUERNEL INTELLIGENCE*
