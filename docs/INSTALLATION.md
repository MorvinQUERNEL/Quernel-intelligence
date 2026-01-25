# QUERNEL INTELLIGENCE - Documentation d'installation

## Date: 11 janvier 2026
## Version: 1.1 - Stack complète déployée

---

## Infrastructure

### Serveur GPU (RunPod)

| Paramètre | Valeur |
|-----------|--------|
| Pod ID | `l12blhwade9wq3` |
| Pod Name | `complex_beige_orca` |
| GPU | NVIDIA RTX A6000 (48 GB VRAM) |
| RAM | 50 GB |
| Stockage | 170 GB |
| OS | Ubuntu 22.04 |
| CUDA | 12.4 |
| IP | `38.147.83.30` |
| Port SSH | `39037` |

### Connexion SSH

```bash
ssh root@38.147.83.30 -p 39037 -i ~/.ssh/id_ed25519
```

---

## Stack déployée (Status: ACTIF)

### 1. vLLM (API LLM) - Port 8000

| Paramètre | Valeur |
|-----------|--------|
| Version | 0.13.0 |
| Port | 8000 |
| Modèle | Qwen2.5-32B-Instruct-AWQ |
| VRAM utilisée | ~18 GB |
| Contexte max | 8192 tokens |
| Quantization | AWQ |
| API | OpenAI-compatible |

#### Test de l'API
```bash
# Liste des modèles
curl http://localhost:8000/v1/models

# Chat completion
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "/workspace/models/Qwen2.5-32B-Instruct-AWQ",
    "messages": [{"role": "user", "content": "Bonjour!"}],
    "max_tokens": 100
  }'
```

### 2. Open WebUI (Interface Chat) - Port 8080

| Paramètre | Valeur |
|-----------|--------|
| Version | 0.7.2 |
| Port | 8080 |
| Backend | vLLM (localhost:8000) |
| Data | /workspace/open-webui |

**Accès**: Via RunPod HTTP Service sur le port 8080

### 3. n8n (Workflows/Agents) - Port 5678

| Paramètre | Valeur |
|-----------|--------|
| Version | 2.2.6 |
| Port | 5678 |
| Data | /workspace/n8n |

**Accès**: Via RunPod HTTP Service sur le port 5678

---

## URLs d'accès (RunPod)

Accéder via le dashboard RunPod > ton pod > Connect > HTTP Services :

| Service | Port RunPod | Description |
|---------|-------------|-------------|
| Open WebUI | 8080 | Interface chat style ChatGPT |
| n8n | 5678 | Créateur de workflows/agents |
| vLLM API | 8000 | API REST pour intégrations |
| Jupyter | 8888 | Notebooks (optionnel) |

---

## Script de démarrage

Si le pod redémarre, exécuter :

```bash
ssh root@38.147.83.30 -p 39037 -i ~/.ssh/id_ed25519
/workspace/start-services.sh
```

Ou manuellement :
```bash
# 1. vLLM
nohup python -m vllm.entrypoints.openai.api_server \
  --model /workspace/models/Qwen2.5-32B-Instruct-AWQ \
  --host 0.0.0.0 --port 8000 --max-model-len 8192 --quantization awq \
  > /workspace/vllm.log 2>&1 &

# 2. Open WebUI (attendre que vLLM soit prêt)
OPENAI_API_BASE_URL=http://localhost:8000/v1 DATA_DIR=/workspace/open-webui \
nohup open-webui serve --host 0.0.0.0 --port 8080 > /workspace/openwebui.log 2>&1 &

# 3. n8n
N8N_USER_FOLDER=/workspace/n8n N8N_PORT=5678 N8N_HOST=0.0.0.0 \
nohup n8n start > /workspace/n8n.log 2>&1 &
```

---

## Logs

```bash
# vLLM
tail -f /workspace/vllm.log

# Open WebUI
tail -f /workspace/openwebui.log

# n8n
tail -f /workspace/n8n.log
```

---

## Sécurité (À configurer pour production)

### Actions recommandées

1. **Open WebUI** : Créer un compte admin au premier accès
2. **n8n** : Configurer l'authentification basic auth
3. **vLLM** : Ajouter une API key si exposé publiquement
4. **Traefik** : Configurer SSL/TLS avec Let's Encrypt
5. **Firewall** : Limiter les ports exposés

### Variables d'environnement sécurité (à ajouter)

```bash
# n8n
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=<MOT_DE_PASSE_FORT>

# Open WebUI
WEBUI_AUTH=true
```

---

## Coûts

| Poste | Coût/heure | Coût/mois (24/7) |
|-------|------------|------------------|
| GPU RTX A6000 | $0.49 | ~$353 |
| Stockage 170GB | $0.024 | ~$17 |
| **Total** | **$0.514** | **~$370 (~340€)** |

---

## Fichiers importants sur le serveur

```
/workspace/
├── models/
│   └── Qwen2.5-32B-Instruct-AWQ/  # Modèle LLM (19 GB)
├── open-webui/                     # Données Open WebUI
├── n8n/                            # Données n8n
├── start-services.sh               # Script de démarrage
├── vllm.log                        # Logs vLLM
├── openwebui.log                   # Logs Open WebUI
└── n8n.log                         # Logs n8n
```

---

## Contacts

- **Société**: QUERNEL INTELLIGENCE (SASU)
- **SIREN**: 979632072
- **Email**: quernel.corp@gmail.com
