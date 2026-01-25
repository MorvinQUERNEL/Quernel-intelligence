# Quick Start - QUERNEL INTELLIGENCE

> Commandes essentielles pour l'exploitation quotidienne

---

## Vérifications Rapides

### API vLLM fonctionne?
```bash
curl -s https://zbfi8mg4tmy999-8000.proxy.runpod.net/v1/models | jq .
```

### SaaS accessible?
```bash
curl -s https://quernel-intelligence.com/api/health
```

---

## Connexions

### Pod RunPod
```bash
ssh -tt -i ~/.ssh/id_ed25519 zbfi8mg4tmy999-64410d9a@ssh.runpod.io
```

### Serveur Hostinger (SaaS)
```bash
sshpass -p 'Momokeke@@1' ssh -p 65002 u729245499@82.25.113.5
```

---

## Sur le Pod RunPod

### Voir les services actifs
```bash
tmux ls
# Résultat attendu:
# n8n: 1 windows
# vllm: 1 windows
```

### Logs vLLM (temps réel)
```bash
tmux attach -t vllm
# Ctrl+B puis D pour détacher
```

### Redémarrer vLLM
```bash
tmux kill-session -t vllm
tmux new-session -d -s vllm '/workspace/start-vllm.sh'
```

### Redémarrer n8n
```bash
tmux kill-session -t n8n
tmux new-session -d -s n8n 'n8n start --tunnel'
```

---

## Sur le Serveur SaaS

### Chemin du backend
```bash
cd ~/domains/quernel-intelligence.com/backend
```

### Vider le cache Symfony
```bash
php bin/console cache:clear --env=prod
```

### Voir les logs d'erreur
```bash
tail -f var/log/prod.log
```

### Changer l'URL vLLM
```bash
# Éditer .env.local.php
nano .env.local.php
# Modifier la ligne VLLM_API_URL

# OU en une commande:
sed -i 's|OLD_POD_ID|NEW_POD_ID|g' .env.local.php

# Puis vider le cache
php bin/console cache:clear --env=prod
```

---

## Tests API

### Test simple chat
```bash
curl -X POST https://zbfi8mg4tmy999-8000.proxy.runpod.net/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"/workspace/models/hermes-3-llama-8b","messages":[{"role":"user","content":"Test"}],"max_tokens":50}'
```

### Test via le SaaS (authentifié)
```bash
# Nécessite un token JWT valide
curl -X POST https://quernel-intelligence.com/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Bonjour","agent":"charly"}'
```

---

## Problèmes Courants

| Problème | Solution |
|----------|----------|
| vLLM ne répond pas | `tmux attach -t vllm` pour voir les erreurs |
| 404 sur le chat | Vérifier `.env.local.php` et vider le cache |
| SSH PTY error | Utiliser `ssh -tt` |
| n8n inaccessible | Redémarrer la session tmux n8n |

---

## URLs de Référence

| Service | URL |
|---------|-----|
| Site public | https://quernel-intelligence.com |
| API vLLM | https://zbfi8mg4tmy999-8000.proxy.runpod.net/v1 |
| Console RunPod | https://www.runpod.io/console/pods |
| n8n (tunnel) | Voir logs n8n pour l'URL tunnel |

---

*Quick Reference - QUERNEL INTELLIGENCE*
