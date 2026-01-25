# RunPod Setup Complet - QUERNEL INTELLIGENCE v7

> Guide d'installation complet pour recreer le pod depuis zero

---

## Specifications du Pod

### Configuration recommandee

| Parametre | Valeur |
|-----------|--------|
| **GPU** | NVIDIA RTX 4090 (24 GB VRAM) ou A6000 (48 GB) |
| **CPU** | 8 vCPU minimum |
| **RAM** | 32 GB minimum |
| **Stockage** | 100 GB SSD |
| **Image Docker** | `runpod/pytorch:2.1.0-py3.10-cuda11.8.0-devel-ubuntu22.04` |
| **Ports exposes** | 8000 (vLLM), 8080 (Flask), 6379 (Redis) |

### Ports a configurer sur RunPod

Dans les parametres du pod, exposer :
- **8000** : API vLLM (HTTP)
- **8080** : Flask Server v7 (HTTP)
- **22** : SSH

---

## Etape 1 : Connexion SSH

```bash
# Recuperer la commande SSH depuis le dashboard RunPod
# Format: ssh root@<pod-ip> -p <port> -i ~/.ssh/id_ed25519

# Ou via le proxy RunPod:
ssh -tt -i ~/.ssh/id_ed25519 <pod-id>@ssh.runpod.io
```

---

## Etape 2 : Installation des dependances systeme

```bash
# Mise a jour du systeme
apt-get update && apt-get upgrade -y

# Installer les outils essentiels
apt-get install -y \
    git \
    curl \
    wget \
    htop \
    tmux \
    vim \
    redis-server \
    python3-pip \
    python3-venv

# Demarrer Redis
systemctl start redis-server
systemctl enable redis-server

# Verifier Redis
redis-cli ping
# Doit repondre: PONG
```

---

## Etape 3 : Telecharger le modele LLM

```bash
# Creer le dossier des modeles
mkdir -p /workspace/models
cd /workspace/models

# Installer huggingface-cli
pip install huggingface_hub

# Telecharger Hermes-3-Llama-8B (recommande pour function calling)
huggingface-cli download NousResearch/Hermes-3-Llama-3.1-8B \
    --local-dir /workspace/models/hermes-3-llama-8b \
    --local-dir-use-symlinks False

# Taille: ~16 GB, temps: 10-30 min selon connexion
```

---

## Etape 4 : Installer vLLM

```bash
# Creer un environnement virtuel
cd /workspace
python3 -m venv vllm-env
source vllm-env/bin/activate

# Installer vLLM
pip install vllm

# Verifier l'installation
python -c "import vllm; print(vllm.__version__)"
```

---

## Etape 5 : Creer le script de demarrage vLLM

```bash
cat > /workspace/start-vllm.sh << 'EOF'
#!/bin/bash
source /workspace/vllm-env/bin/activate

python -m vllm.entrypoints.openai.api_server \
    --model /workspace/models/hermes-3-llama-8b \
    --host 0.0.0.0 \
    --port 8000 \
    --max-model-len 8192 \
    --tensor-parallel-size 1 \
    --enable-auto-tool-choice \
    --tool-call-parser hermes \
    --gpu-memory-utilization 0.9
EOF

chmod +x /workspace/start-vllm.sh
```

---

## Etape 6 : Installer le Flask Server v7

```bash
# Creer le dossier du serveur
mkdir -p /workspace/flask-server
cd /workspace/flask-server

# Creer l'environnement virtuel
python3 -m venv venv
source venv/bin/activate

# Installer les dependances
pip install flask flask-cors redis cryptography requests
```

### Creer le fichier server.py

```bash
cat > /workspace/flask-server/server.py << 'PYEOF'
#!/usr/bin/env python3
"""
QUERNEL INTELLIGENCE - Flask Server v7
Architecture "Les 3 Anges"
"""

import os
import json
import hashlib
import redis
from datetime import datetime
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from cryptography.fernet import Fernet
import requests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration
VLLM_URL = "http://localhost:8000/v1/chat/completions"
REDIS_HOST = "localhost"
REDIS_PORT = 6379

# Cle de chiffrement (a stocker en variable d'environnement en prod)
ENCRYPTION_KEY = os.environ.get('ENCRYPTION_KEY', Fernet.generate_key())
fernet = Fernet(ENCRYPTION_KEY)

# Connexion Redis
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)

# Les 3 Anges - System Prompts
ANGELS = {
    "raphael": {
        "name": "Raphael",
        "role": "Ange Guerisseur",
        "color": "#8b5cf6",
        "system_prompt": """Tu es Raphael, l'ange guerisseur de QUERNEL INTELLIGENCE.
Tu es un assistant polyvalent qui aide sur tous les sujets : organisation, redaction, productivite, brainstorming.
Tu travailles en synergie avec Gabriel (Marketing) et Michael (Commercial).
Tu as acces au contexte partage de l'utilisateur.
Reponds en francais de maniere claire et bienveillante."""
    },
    "gabriel": {
        "name": "Gabriel",
        "role": "Ange Messager",
        "color": "#ec4899",
        "system_prompt": """Tu es Gabriel, l'ange messager de QUERNEL INTELLIGENCE.
Tu es l'expert marketing et communication qui aide les entreprises.
Specialites : SEO, contenu, publicite, analyse de performances.
Tu travailles en synergie avec Raphael (General) et Michael (Commercial).
Tu partages tes insights marketing avec les autres anges.
Reponds en francais avec des conseils actionnables et des exemples concrets."""
    },
    "michael": {
        "name": "Michael",
        "role": "Ange Protecteur",
        "color": "#22c55e",
        "system_prompt": """Tu es Michael, l'ange protecteur de QUERNEL INTELLIGENCE.
Tu es l'expert commercial et vente qui aide les entreprises.
Specialites : prospection, negociation, closing, pipeline.
Tu travailles en synergie avec Raphael (General) et Gabriel (Marketing).
Tu partages tes insights commerciaux avec les autres anges.
Reponds en francais avec energie et des conseils terrain concrets."""
    }
}

def encrypt_data(data):
    """Chiffrer les donnees avec Fernet (AES-256)"""
    json_data = json.dumps(data)
    return fernet.encrypt(json_data.encode()).decode()

def decrypt_data(encrypted_data):
    """Dechiffrer les donnees"""
    try:
        decrypted = fernet.decrypt(encrypted_data.encode())
        return json.loads(decrypted.decode())
    except:
        return None

def get_user_context(user_id):
    """Recuperer le contexte utilisateur depuis Redis"""
    key = f"user:{user_id}:context"
    encrypted = redis_client.get(key)
    if encrypted:
        return decrypt_data(encrypted)
    return {"profile": {}, "insights": {}}

def save_user_context(user_id, context):
    """Sauvegarder le contexte utilisateur"""
    key = f"user:{user_id}:context"
    encrypted = encrypt_data(context)
    redis_client.set(key, encrypted)

def get_conversation_history(user_id, agent_id, limit=10):
    """Recuperer l'historique des conversations"""
    key = f"user:{user_id}:history:{agent_id}"
    encrypted = redis_client.get(key)
    if encrypted:
        history = decrypt_data(encrypted)
        return history[-limit:] if history else []
    return []

def save_conversation_history(user_id, agent_id, messages):
    """Sauvegarder l'historique"""
    key = f"user:{user_id}:history:{agent_id}"
    # Garder les 50 derniers messages
    encrypted = encrypt_data(messages[-50:])
    redis_client.set(key, encrypted)

@app.route('/health', methods=['GET'])
def health():
    """Endpoint de sante"""
    return jsonify({
        "status": "healthy",
        "version": "7.0",
        "architecture": "Les 3 Anges",
        "angels": list(ANGELS.keys())
    })

@app.route('/api/agents', methods=['GET'])
def get_agents():
    """Liste des anges disponibles"""
    agents = []
    for agent_id, agent in ANGELS.items():
        agents.append({
            "id": agent_id,
            "name": agent["name"],
            "role": agent["role"],
            "color": agent["color"]
        })
    return jsonify(agents)

@app.route('/webhook/chat', methods=['POST'])
def chat():
    """Endpoint principal de chat"""
    try:
        data = request.json
        message = data.get('message', '')
        agent_id = data.get('agentId', 'raphael').lower()
        user_id = data.get('userId', 'anonymous')

        # Verifier que l'agent existe
        if agent_id not in ANGELS:
            return jsonify({"error": f"Agent {agent_id} non trouve"}), 400

        angel = ANGELS[agent_id]

        # Recuperer le contexte et l'historique
        context = get_user_context(user_id)
        history = get_conversation_history(user_id, agent_id)

        # Construire le prompt systeme avec contexte
        system_prompt = angel["system_prompt"]
        if context.get("profile"):
            system_prompt += f"\n\nContexte utilisateur: {json.dumps(context['profile'], ensure_ascii=False)}"

        # Construire les messages
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(history)
        messages.append({"role": "user", "content": message})

        # Appeler vLLM
        response = requests.post(VLLM_URL, json={
            "model": "/workspace/models/hermes-3-llama-8b",
            "messages": messages,
            "max_tokens": 2000,
            "temperature": 0.7,
            "stream": False
        }, timeout=60)

        if response.status_code != 200:
            return jsonify({"error": "Erreur vLLM", "details": response.text}), 500

        result = response.json()
        assistant_message = result['choices'][0]['message']['content']

        # Sauvegarder dans l'historique
        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": assistant_message})
        save_conversation_history(user_id, agent_id, history)

        return jsonify({
            "success": True,
            "agent": angel["name"],
            "response": assistant_message,
            "timestamp": datetime.now().isoformat()
        })

    except requests.exceptions.Timeout:
        return jsonify({"error": "Timeout - Le modele met trop de temps"}), 504
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/webhook/chat/stream', methods=['POST'])
def chat_stream():
    """Endpoint de chat avec streaming SSE"""
    try:
        data = request.json
        message = data.get('message', '')
        agent_id = data.get('agentId', 'raphael').lower()
        user_id = data.get('userId', 'anonymous')

        if agent_id not in ANGELS:
            return jsonify({"error": f"Agent {agent_id} non trouve"}), 400

        angel = ANGELS[agent_id]
        context = get_user_context(user_id)
        history = get_conversation_history(user_id, agent_id)

        system_prompt = angel["system_prompt"]
        if context.get("profile"):
            system_prompt += f"\n\nContexte utilisateur: {json.dumps(context['profile'], ensure_ascii=False)}"

        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(history)
        messages.append({"role": "user", "content": message})

        def generate():
            full_response = ""
            response = requests.post(VLLM_URL, json={
                "model": "/workspace/models/hermes-3-llama-8b",
                "messages": messages,
                "max_tokens": 2000,
                "temperature": 0.7,
                "stream": True
            }, stream=True, timeout=120)

            for line in response.iter_lines():
                if line:
                    line_str = line.decode('utf-8')
                    if line_str.startswith('data: '):
                        json_str = line_str[6:]
                        if json_str.strip() == '[DONE]':
                            break
                        try:
                            chunk = json.loads(json_str)
                            if 'choices' in chunk and chunk['choices']:
                                delta = chunk['choices'][0].get('delta', {})
                                content = delta.get('content', '')
                                if content:
                                    full_response += content
                                    yield f"data: {json.dumps({'content': content})}\n\n"
                        except json.JSONDecodeError:
                            continue

            # Sauvegarder l'historique apres streaming
            history.append({"role": "user", "content": message})
            history.append({"role": "assistant", "content": full_response})
            save_conversation_history(user_id, agent_id, history)

            yield f"data: {json.dumps({'done': True})}\n\n"

        return Response(generate(), mimetype='text/event-stream')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profile/<user_id>', methods=['GET'])
def get_profile(user_id):
    """Recuperer le profil utilisateur"""
    context = get_user_context(user_id)
    return jsonify(context.get('profile', {}))

@app.route('/api/profile/<user_id>', methods=['PUT'])
def update_profile(user_id):
    """Mettre a jour le profil utilisateur"""
    profile = request.json
    context = get_user_context(user_id)
    context['profile'] = profile
    save_user_context(user_id, context)
    return jsonify({"success": True, "profile": profile})

@app.route('/api/history/<user_id>', methods=['GET'])
def get_history(user_id):
    """Recuperer tout l'historique"""
    histories = {}
    for agent_id in ANGELS.keys():
        histories[agent_id] = get_conversation_history(user_id, agent_id, limit=50)
    return jsonify(histories)

@app.route('/api/history/<user_id>/<agent_id>', methods=['DELETE'])
def delete_history(user_id, agent_id):
    """Supprimer l'historique d'un agent"""
    key = f"user:{user_id}:history:{agent_id}"
    redis_client.delete(key)
    return jsonify({"success": True})

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    """Soumettre un feedback"""
    data = request.json
    feedback_id = f"feedback:{datetime.now().timestamp()}"
    redis_client.set(feedback_id, json.dumps(data))
    return jsonify({"success": True, "feedbackId": feedback_id})

if __name__ == '__main__':
    print("=" * 50)
    print("QUERNEL INTELLIGENCE - Flask Server v7")
    print("Architecture: Les 3 Anges")
    print("=" * 50)
    print(f"Anges disponibles: {list(ANGELS.keys())}")
    print("Demarrage sur http://0.0.0.0:8080")
    print("=" * 50)
    app.run(host='0.0.0.0', port=8080, debug=False)
PYEOF

chmod +x /workspace/flask-server/server.py
```

### Creer le script de demarrage Flask

```bash
cat > /workspace/start-flask.sh << 'EOF'
#!/bin/bash
cd /workspace/flask-server
source venv/bin/activate
export ENCRYPTION_KEY=$(cat /workspace/.encryption_key 2>/dev/null || python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")

# Sauvegarder la cle si elle n'existe pas
if [ ! -f /workspace/.encryption_key ]; then
    echo $ENCRYPTION_KEY > /workspace/.encryption_key
    chmod 600 /workspace/.encryption_key
fi

python server.py
EOF

chmod +x /workspace/start-flask.sh
```

---

## Etape 7 : Creer le script de demarrage global

```bash
cat > /workspace/start-all.sh << 'EOF'
#!/bin/bash
echo "================================================"
echo "QUERNEL INTELLIGENCE v7 - Demarrage des services"
echo "================================================"

# Demarrer Redis si pas deja lance
if ! pgrep -x "redis-server" > /dev/null; then
    echo "[1/3] Demarrage Redis..."
    redis-server --daemonize yes
    sleep 2
fi
echo "[OK] Redis actif"

# Demarrer vLLM dans tmux
if ! tmux has-session -t vllm 2>/dev/null; then
    echo "[2/3] Demarrage vLLM..."
    tmux new-session -d -s vllm '/workspace/start-vllm.sh'
    echo "    Attente du chargement du modele (60s)..."
    sleep 60
fi
echo "[OK] vLLM actif (port 8000)"

# Demarrer Flask dans tmux
if ! tmux has-session -t flask 2>/dev/null; then
    echo "[3/3] Demarrage Flask Server v7..."
    tmux new-session -d -s flask '/workspace/start-flask.sh'
    sleep 5
fi
echo "[OK] Flask actif (port 8080)"

echo ""
echo "================================================"
echo "Tous les services sont demarres!"
echo ""
echo "URLs:"
echo "  - vLLM API:  http://localhost:8000"
echo "  - Flask API: http://localhost:8080"
echo "  - Health:    http://localhost:8080/health"
echo ""
echo "Sessions tmux:"
echo "  - tmux attach -t vllm"
echo "  - tmux attach -t flask"
echo "================================================"
EOF

chmod +x /workspace/start-all.sh
```

---

## Etape 8 : Configurer le demarrage automatique

```bash
# Creer le script de demarrage au boot
cat > /workspace/autostart.sh << 'EOF'
#!/bin/bash
# Attendre que le systeme soit pret
sleep 10

# Demarrer tous les services
/workspace/start-all.sh
EOF

chmod +x /workspace/autostart.sh

# Ajouter au crontab pour demarrage automatique
(crontab -l 2>/dev/null; echo "@reboot /workspace/autostart.sh") | crontab -
```

---

## Etape 9 : Demarrer les services

```bash
# Demarrer tout
/workspace/start-all.sh

# Verifier que tout fonctionne
curl http://localhost:8080/health
```

Reponse attendue :
```json
{
  "status": "healthy",
  "version": "7.0",
  "architecture": "Les 3 Anges",
  "angels": ["raphael", "gabriel", "michael"]
}
```

---

## Structure finale du Pod

```
/workspace/
├── models/
│   └── hermes-3-llama-8b/          # Modele LLM (~16 GB)
├── vllm-env/                        # Env virtuel vLLM
├── flask-server/
│   ├── venv/                        # Env virtuel Flask
│   └── server.py                    # Serveur Flask v7
├── .encryption_key                  # Cle AES-256 (chmod 600)
├── start-vllm.sh                    # Script demarrage vLLM
├── start-flask.sh                   # Script demarrage Flask
├── start-all.sh                     # Script demarrage global
└── autostart.sh                     # Script boot automatique
```

---

## Commandes utiles

### Gestion des services

```bash
# Voir les sessions tmux
tmux ls

# Attacher a une session
tmux attach -t vllm
tmux attach -t flask

# Detacher: Ctrl+B puis D

# Redemarrer vLLM
tmux kill-session -t vllm
tmux new-session -d -s vllm '/workspace/start-vllm.sh'

# Redemarrer Flask
tmux kill-session -t flask
tmux new-session -d -s flask '/workspace/start-flask.sh'

# Redemarrer tout
tmux kill-server
/workspace/start-all.sh
```

### Monitoring

```bash
# Utilisation GPU
nvidia-smi

# Logs vLLM (dans tmux)
tmux attach -t vllm

# Logs Flask
tmux attach -t flask

# Tester le chat
curl -X POST http://localhost:8080/webhook/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Bonjour, comment vas-tu?",
    "agentId": "raphael",
    "userId": "test123"
  }'
```

### Redis

```bash
# Verifier Redis
redis-cli ping

# Voir les cles
redis-cli keys "*"

# Voir une cle specifique
redis-cli get "user:test123:context"
```

---

## Backup et Restauration

### Sauvegarder les donnees

```bash
# Sur le pod - Creer un backup
cd /workspace
tar -czvf backup-quernel-v7.tar.gz \
    flask-server/server.py \
    start-*.sh \
    autostart.sh \
    .encryption_key

# Backup Redis
redis-cli BGSAVE
cp /var/lib/redis/dump.rdb /workspace/redis-backup.rdb

# Telecharger en local
scp -i ~/.ssh/id_ed25519 root@<pod-ip>:/workspace/backup-quernel-v7.tar.gz .
scp -i ~/.ssh/id_ed25519 root@<pod-ip>:/workspace/redis-backup.rdb .
```

### Restaurer sur un nouveau pod

```bash
# Uploader les fichiers
scp -i ~/.ssh/id_ed25519 backup-quernel-v7.tar.gz root@<new-pod-ip>:/workspace/
scp -i ~/.ssh/id_ed25519 redis-backup.rdb root@<new-pod-ip>:/workspace/

# Sur le nouveau pod
cd /workspace
tar -xzvf backup-quernel-v7.tar.gz

# Restaurer Redis
cp redis-backup.rdb /var/lib/redis/dump.rdb
systemctl restart redis-server

# Reinstaller les dependances (voir etapes 2-6)
# Puis demarrer
/workspace/start-all.sh
```

---

## Troubleshooting

### vLLM ne demarre pas

```bash
# Verifier les logs
tmux attach -t vllm

# Erreur CUDA: Verifier le GPU
nvidia-smi

# Erreur memoire: Reduire max-model-len
# Editer /workspace/start-vllm.sh
# Changer --max-model-len 8192 en 4096
```

### Flask ne repond pas

```bash
# Verifier les logs
tmux attach -t flask

# Verifier que vLLM est actif
curl http://localhost:8000/health

# Redemarrer Flask
tmux kill-session -t flask
/workspace/start-flask.sh
```

### Redis erreur connexion

```bash
# Verifier que Redis tourne
systemctl status redis-server

# Redemarrer Redis
systemctl restart redis-server
```

---

## URLs de Production

Une fois le pod demarre, noter les URLs proxy RunPod :

| Service | URL |
|---------|-----|
| Flask API | `https://<pod-id>-8080.proxy.runpod.net` |
| vLLM API | `https://<pod-id>-8000.proxy.runpod.net` |

Ces URLs sont a configurer dans le backend Symfony (RUNPOD_API_URL).

---

## Couts estimes

| GPU | Prix/heure | VRAM | Recommandation |
|-----|------------|------|----------------|
| RTX 4090 | ~$0.44/h | 24 GB | Production |
| RTX A6000 | ~$0.79/h | 48 GB | Si besoin plus VRAM |
| RTX 3090 | ~$0.34/h | 24 GB | Dev/Test |

**Estimation mensuelle 24/7** : $320-570/mois selon GPU

---

*Document cree le 25 janvier 2026 - QUERNEL INTELLIGENCE v7*
