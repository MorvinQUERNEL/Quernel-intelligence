# Configuration RunPod - QUERNEL INTELLIGENCE

> Documentation technique du pod GPU pour le SaaS

---

## Informations du Pod

| Paramètre | Valeur |
|-----------|--------|
| **Pod ID** | `zbfi8mg4tmy999` |
| **GPU** | NVIDIA RTX A6000 (49 GB VRAM) |
| **SSH** | `zbfi8mg4tmy999-64410d9a@ssh.runpod.io` |
| **Clé SSH** | `~/.ssh/id_ed25519` |
| **API URL** | `https://zbfi8mg4tmy999-8000.proxy.runpod.net/v1` |

---

## Services Installés

### 1. vLLM (Serveur LLM)

**Version**: 0.13.0

**Modèle**: Hermes-3-Llama-3.1-8B
- Optimisé pour le function calling
- Context: 8192 tokens max
- Support des tools OpenAI-compatible

**Configuration**:
```bash
python -m vllm.entrypoints.openai.api_server \
    --model /workspace/models/hermes-3-llama-8b \
    --host 0.0.0.0 --port 8000 \
    --max-model-len 8192 \
    --tensor-parallel-size 1 \
    --enable-auto-tool-choice \
    --tool-call-parser hermes
```

**Endpoints**:
- Health: `GET /health`
- Models: `GET /v1/models`
- Chat: `POST /v1/chat/completions`
- Completions: `POST /v1/completions`

### 2. n8n (Workflows)

**Version**: 2.3.6

**Port**: 5678 (tunnel mode)

**Utilisations**:
- Orchestration des agents IA
- Intégrations tierces (email, CRM, etc.)
- Automatisation des workflows métier

---

## Sessions tmux

Les services tournent dans des sessions tmux persistantes:

```bash
# Lister les sessions
tmux ls

# Sessions actives:
# - vllm: Serveur API vLLM
# - n8n: Interface workflows
```

### Commandes utiles

```bash
# Attacher à une session
tmux attach -t vllm
tmux attach -t n8n

# Détacher (depuis une session)
Ctrl+B, puis D

# Voir les logs vLLM
tmux attach -t vllm

# Redémarrer vLLM
tmux kill-session -t vllm
tmux new-session -d -s vllm '/workspace/start-vllm.sh'

# Redémarrer n8n
tmux kill-session -t n8n
tmux new-session -d -s n8n 'n8n start --tunnel'
```

---

## Connexion SSH

```bash
# Connexion standard
ssh -tt -i ~/.ssh/id_ed25519 zbfi8mg4tmy999-64410d9a@ssh.runpod.io

# Note: Le flag -tt est nécessaire pour forcer l'allocation PTY
```

---

## Structure des fichiers sur le Pod

```
/workspace/
├── models/
│   └── hermes-3-llama-8b/      # Modèle Hermes-3 (~16 GB)
├── vllm-env/                    # Environnement virtuel Python
├── start-vllm.sh               # Script de démarrage vLLM
└── n8n-data/                   # Données n8n (si configuré)
```

---

## API vLLM - Exemples

### Test de santé
```bash
curl https://zbfi8mg4tmy999-8000.proxy.runpod.net/health
```

### Liste des modèles
```bash
curl https://zbfi8mg4tmy999-8000.proxy.runpod.net/v1/models
```

### Chat completion
```bash
curl -X POST https://zbfi8mg4tmy999-8000.proxy.runpod.net/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "/workspace/models/hermes-3-llama-8b",
    "messages": [
      {"role": "system", "content": "Tu es un assistant professionnel."},
      {"role": "user", "content": "Bonjour!"}
    ],
    "max_tokens": 500,
    "temperature": 0.7
  }'
```

### Chat avec Tools (Function Calling)
```bash
curl -X POST https://zbfi8mg4tmy999-8000.proxy.runpod.net/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "/workspace/models/hermes-3-llama-8b",
    "messages": [
      {"role": "user", "content": "Quelle heure est-il à Paris?"}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_current_time",
          "description": "Obtenir l heure actuelle dans une ville",
          "parameters": {
            "type": "object",
            "properties": {
              "city": {"type": "string", "description": "Nom de la ville"}
            },
            "required": ["city"]
          }
        }
      }
    ],
    "tool_choice": "auto"
  }'
```

---

## Maintenance

### Mise à jour du modèle
```bash
# Télécharger un nouveau modèle
huggingface-cli download NousResearch/Hermes-3-Llama-3.1-8B \
  --local-dir /workspace/models/nouveau-modele

# Modifier start-vllm.sh avec le nouveau chemin
# Redémarrer vLLM
```

### Mise à jour de vLLM
```bash
source /workspace/vllm-env/bin/activate
pip install --upgrade vllm
```

### Backup des données n8n
```bash
# Sur le pod
tar -czvf n8n-backup.tar.gz ~/.n8n

# Télécharger localement
scp -i ~/.ssh/id_ed25519 zbfi8mg4tmy999-64410d9a@ssh.runpod.io:~/n8n-backup.tar.gz .
```

---

## Troubleshooting

### vLLM ne répond pas
```bash
# Vérifier si le process tourne
tmux attach -t vllm
# Regarder les erreurs dans les logs

# Redémarrer
tmux kill-session -t vllm
/workspace/start-vllm.sh
```

### Erreur CUDA out of memory
- Réduire `--max-model-len` dans start-vllm.sh
- Ou utiliser un modèle plus petit

### SSH "PTY not supported"
- Toujours utiliser `ssh -tt` pour forcer l'allocation PTY

---

## Coûts RunPod

| GPU | Prix/heure | VRAM |
|-----|------------|------|
| RTX A6000 | ~$0.79/h | 48 GB |

**Estimation mensuelle** (24/7): ~$570/mois

---

*Dernière mise à jour: 20 janvier 2026*
