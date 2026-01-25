#!/usr/bin/env python3
"""
QUERNEL INTELLIGENCE Server v7 - Les 3 Anges
Architecture intelligente avec contexte partage et amelioration continue

Agents:
- Raphael (General) - Assistant polyvalent
- Gabriel (Marketing) - Marketing & Communication
- Michael (Commercial) - Ventes & Prospection
"""
import json
import requests
import redis
import hashlib
import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from cryptography.fernet import Fernet
import base64

app = Flask(__name__)
CORS(app, origins=["https://quernel-intelligence.com", "http://localhost:3001", "*"])

VLLM_URL = "http://localhost:8000"
MODEL = "/workspace/models/hermes-3-llama-8b"
SECRET_KEY = os.getenv("QUERNEL_SECRET", "quernel-secret-key-2026-secure")

redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

# =============================================================================
# ENCRYPTION
# =============================================================================

def get_fernet_key():
    key = hashlib.sha256(SECRET_KEY.encode()).digest()
    return Fernet(base64.urlsafe_b64encode(key))

fernet = get_fernet_key()

def encrypt_data(data):
    return fernet.encrypt(json.dumps(data, ensure_ascii=False).encode()).decode()

def decrypt_data(encrypted):
    try:
        return json.loads(fernet.decrypt(encrypted.encode()).decode())
    except:
        return None

# =============================================================================
# LES 3 ANGES - Configuration
# =============================================================================

AGENTS = {
    "raphael": {
        "name": "Raphael",
        "role": "Assistant General",
        "color": "#8b5cf6",
        "icon": "Sparkles",
        "description": "Ange guerisseur - Assistant polyvalent qui vous aide dans toutes vos demarches",
        "expertise": ["aide generale", "conseils", "organisation", "productivite", "redaction"],
        "system_prompt": """Tu es Raphael, l'ange guerisseur de QUERNEL INTELLIGENCE.

PERSONNALITE:
- Bienveillant, sage et polyvalent
- Tu apportes clarte et serenite dans chaque interaction
- Tu guides l'utilisateur avec patience et expertise

MISSION:
- Assister l'utilisateur dans toutes ses demandes
- Identifier ses besoins et le rediriger vers Gabriel (marketing) ou Michael (commercial) si pertinent
- Fournir des conseils pratiques et actionnables

CONTEXTE UTILISATEUR:
{user_context}

CONNAISSANCES PARTAGEES:
{shared_knowledge}

INSTRUCTIONS:
- Reponds toujours en francais
- Sois concis mais complet
- Si la demande concerne le marketing, suggere de consulter Gabriel
- Si la demande concerne les ventes/prospection, suggere de consulter Michael
- Note les informations importantes sur l'utilisateur pour enrichir son profil"""
    },

    "gabriel": {
        "name": "Gabriel",
        "role": "Expert Marketing",
        "color": "#ec4899",
        "icon": "TrendingUp",
        "description": "Ange messager - Expert en marketing digital, SEO, contenus et strategie de communication",
        "expertise": ["marketing digital", "SEO", "reseaux sociaux", "content marketing", "branding", "publicite"],
        "system_prompt": """Tu es Gabriel, l'ange messager de QUERNEL INTELLIGENCE.

PERSONNALITE:
- Creatif, strategique et visionnaire
- Tu portes les bonnes nouvelles et strategies gagnantes
- Tu inspires et guides vers le succes marketing

MISSION:
- Expert en marketing digital, SEO, contenus, reseaux sociaux
- Creer des strategies marketing efficaces
- Rediger des contenus percutants (posts, articles, emails)
- Optimiser la visibilite en ligne

CONTEXTE UTILISATEUR:
{user_context}

CONNAISSANCES PARTAGEES:
{shared_knowledge}

INSIGHTS DE MICHAEL (Commercial):
{michael_insights}

INSTRUCTIONS:
- Reponds toujours en francais
- Propose des strategies concretes et actionnables
- Donne des exemples de contenus quand pertinent
- Aligne tes recommandations avec les objectifs commerciaux (insights de Michael)
- Note les informations marketing importantes pour les partager avec l'equipe"""
    },

    "michael": {
        "name": "Michael",
        "role": "Expert Commercial",
        "color": "#22c55e",
        "icon": "Target",
        "description": "Ange protecteur - Expert en ventes, prospection et developpement commercial",
        "expertise": ["ventes", "prospection", "negociation", "closing", "CRM", "pipeline"],
        "system_prompt": """Tu es Michael, l'ange protecteur de QUERNEL INTELLIGENCE.

PERSONNALITE:
- Leader, stratege et oriente resultats
- Tu proteges les interets commerciaux de l'utilisateur
- Tu menes vers la victoire commerciale

MISSION:
- Expert en ventes, prospection et negociation
- Developper des strategies commerciales gagnantes
- Creer des scripts de vente et d'appels
- Optimiser le pipeline commercial

CONTEXTE UTILISATEUR:
{user_context}

CONNAISSANCES PARTAGEES:
{shared_knowledge}

INSIGHTS DE GABRIEL (Marketing):
{gabriel_insights}

INSTRUCTIONS:
- Reponds toujours en francais
- Propose des techniques de vente concretes
- Donne des scripts et exemples pratiques
- Aligne tes recommandations avec la strategie marketing (insights de Gabriel)
- Note les informations commerciales importantes pour les partager avec l'equipe"""
    }
}

# =============================================================================
# REDIS KEYS STRUCTURE
# =============================================================================

def get_user_profile_key(user_id):
    return f"user:{user_id}:profile"

def get_user_context_key(user_id):
    return f"user:{user_id}:context"

def get_user_history_key(user_id, agent_id):
    h = hashlib.sha256(f"{user_id}:{agent_id}".encode()).hexdigest()[:16]
    return f"user:{user_id}:history:{h}"

def get_agent_insights_key(user_id, agent_id):
    return f"user:{user_id}:insights:{agent_id}"

def get_user_feedback_key(user_id):
    return f"user:{user_id}:feedback"

# =============================================================================
# USER PROFILE MANAGEMENT
# =============================================================================

def get_user_profile(user_id):
    key = get_user_profile_key(user_id)
    data = redis_client.get(key)
    if data:
        return decrypt_data(data)
    return {
        "user_id": user_id,
        "name": None,
        "company": None,
        "sector": None,
        "goals": [],
        "challenges": [],
        "created_at": datetime.now().isoformat(),
        "last_interaction": datetime.now().isoformat()
    }

def save_user_profile(user_id, profile):
    key = get_user_profile_key(user_id)
    profile["last_interaction"] = datetime.now().isoformat()
    redis_client.set(key, encrypt_data(profile))
    redis_client.expire(key, 86400 * 365)

def update_user_profile(user_id, updates):
    profile = get_user_profile(user_id)
    for k, v in updates.items():
        if v is not None:
            if k in ["goals", "challenges"] and isinstance(v, str):
                if v not in profile.get(k, []):
                    profile.setdefault(k, []).append(v)
            else:
                profile[k] = v
    save_user_profile(user_id, profile)
    return profile

# =============================================================================
# SHARED CONTEXT & INSIGHTS
# =============================================================================

def get_shared_context(user_id):
    key = get_user_context_key(user_id)
    data = redis_client.get(key)
    if data:
        return decrypt_data(data)
    return {"facts": [], "preferences": [], "history_summary": ""}

def add_to_shared_context(user_id, context_type, value):
    context = get_shared_context(user_id)
    if context_type in ["facts", "preferences"]:
        if value not in context[context_type]:
            context[context_type].append(value)
            context[context_type] = context[context_type][-20:]
    else:
        context[context_type] = value

    key = get_user_context_key(user_id)
    redis_client.set(key, encrypt_data(context))
    redis_client.expire(key, 86400 * 365)

def get_agent_insights(user_id, agent_id):
    key = get_agent_insights_key(user_id, agent_id)
    data = redis_client.get(key)
    if data:
        return decrypt_data(data)
    return []

def add_agent_insight(user_id, agent_id, insight):
    insights = get_agent_insights(user_id, agent_id)
    insights.append({
        "insight": insight,
        "timestamp": datetime.now().isoformat()
    })
    insights = insights[-10:]

    key = get_agent_insights_key(user_id, agent_id)
    redis_client.set(key, encrypt_data(insights))
    redis_client.expire(key, 86400 * 365)

# =============================================================================
# CONVERSATION HISTORY
# =============================================================================

def save_conversation(user_id, agent_id, message, response):
    key = get_user_history_key(user_id, agent_id)
    conv = {
        "timestamp": datetime.now().isoformat(),
        "user_id": user_id,
        "agent_id": agent_id,
        "agent_name": AGENTS.get(agent_id, {}).get("name", agent_id),
        "message": message,
        "response": response
    }
    redis_client.rpush(key, encrypt_data(conv))
    redis_client.expire(key, 86400 * 90)

    stats_key = f"stats:{user_id}"
    redis_client.hincrby(stats_key, "total_messages", 1)
    redis_client.hincrby(stats_key, f"agent_{agent_id}", 1)
    redis_client.expire(stats_key, 86400 * 365)

def get_conversation_history(user_id, agent_id, limit=10):
    key = get_user_history_key(user_id, agent_id)
    encrypted_list = redis_client.lrange(key, -limit, -1)
    return [decrypt_data(enc) for enc in encrypted_list if decrypt_data(enc)]

def get_all_user_conversations(user_id):
    all_convs = {}
    for agent_id in AGENTS.keys():
        history = get_conversation_history(user_id, agent_id)
        if history:
            all_convs[agent_id] = history
    return all_convs

# =============================================================================
# FEEDBACK
# =============================================================================

def save_feedback(user_id, agent_id, message_id, rating, comment=None):
    key = get_user_feedback_key(user_id)
    feedback = {
        "timestamp": datetime.now().isoformat(),
        "agent_id": agent_id,
        "message_id": message_id,
        "rating": rating,
        "comment": comment
    }
    redis_client.rpush(key, encrypt_data(feedback))
    redis_client.expire(key, 86400 * 365)

    global_key = f"feedback:global:{agent_id}"
    redis_client.hincrby(global_key, f"rating_{rating}", 1)
    redis_client.hincrby(global_key, "total", 1)

# =============================================================================
# CONTEXT BUILDING
# =============================================================================

def build_agent_context(user_id, agent_id):
    profile = get_user_profile(user_id)
    shared_context = get_shared_context(user_id)

    user_context_parts = []
    if profile.get("name"):
        user_context_parts.append(f"- Nom: {profile['name']}")
    if profile.get("company"):
        user_context_parts.append(f"- Entreprise: {profile['company']}")
    if profile.get("sector"):
        user_context_parts.append(f"- Secteur: {profile['sector']}")
    if profile.get("goals"):
        user_context_parts.append(f"- Objectifs: {', '.join(profile['goals'][:5])}")
    if profile.get("challenges"):
        user_context_parts.append(f"- Defis: {', '.join(profile['challenges'][:5])}")

    user_context = "\n".join(user_context_parts) if user_context_parts else "Nouvel utilisateur - profil a decouvrir"

    shared_parts = []
    if shared_context.get("facts"):
        shared_parts.append(f"Faits: {', '.join(shared_context['facts'][-5:])}")
    if shared_context.get("preferences"):
        shared_parts.append(f"Preferences: {', '.join(shared_context['preferences'][-5:])}")

    shared_knowledge = "\n".join(shared_parts) if shared_parts else "Aucune connaissance partagee encore"

    other_insights = {}
    for other_agent in AGENTS.keys():
        if other_agent != agent_id:
            insights = get_agent_insights(user_id, other_agent)
            if insights:
                other_insights[other_agent] = [i["insight"] for i in insights[-3:]]

    return {
        "user_context": user_context,
        "shared_knowledge": shared_knowledge,
        "gabriel_insights": ", ".join(other_insights.get("gabriel", ["Pas encore d'insights"])),
        "michael_insights": ", ".join(other_insights.get("michael", ["Pas encore d'insights"])),
        "raphael_insights": ", ".join(other_insights.get("raphael", ["Pas encore d'insights"]))
    }

# =============================================================================
# DATETIME & WEB SEARCH
# =============================================================================

def get_current_datetime():
    now = datetime.now()
    jours = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
    mois = ["janvier", "fevrier", "mars", "avril", "mai", "juin",
            "juillet", "aout", "septembre", "octobre", "novembre", "decembre"]
    return f"{jours[now.weekday()]} {now.day} {mois[now.month-1]} {now.year}, {now.strftime('%H:%M')}"

def needs_web_search(message):
    keywords = ["recherche", "cherche", "internet", "web", "actualite",
                "news", "dernier", "derniere", "recent", "2026", "2025",
                "aujourd'hui", "tendance", "prix actuel", "meteo", "bourse"]
    return any(kw in message.lower() for kw in keywords)

def web_search(query):
    try:
        from duckduckgo_search import DDGS
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=5))
            formatted = [f"- {r.get('title', '')}: {r.get('body', '')[:150]}" for r in results]
            return "\n".join(formatted) if formatted else "Aucun resultat."
    except Exception as e:
        return f"Recherche indisponible: {str(e)}"

# =============================================================================
# AUTHENTICATION
# =============================================================================

def verify_auth(user_id, auth_header):
    expected = hashlib.sha256(f"{user_id}:{SECRET_KEY}".encode()).hexdigest()[:32]
    return auth_header == f"Bearer {expected}"

# =============================================================================
# API ROUTES - CHAT
# =============================================================================

@app.route("/webhook/chat", methods=["POST", "OPTIONS"])
def webhook_chat():
    if request.method == "OPTIONS":
        return "", 204

    try:
        data = request.get_json()
        message = data.get("message", "")
        agent_id = data.get("agentId", "raphael").lower()
        user_id = data.get("userId", "anonymous")

        if agent_id not in AGENTS:
            agent_id = "raphael"

        agent = AGENTS[agent_id]
        context = build_agent_context(user_id, agent_id)

        system_prompt = agent["system_prompt"].format(**context)
        system_prompt += f"\n\nDate et heure actuelles: {get_current_datetime()}"

        if needs_web_search(message):
            web_results = web_search(message)
            system_prompt += f"\n\n[Resultats de recherche web]:\n{web_results}"

        messages = [{"role": "system", "content": system_prompt}]

        history = get_conversation_history(user_id, agent_id, limit=5)
        for h in history[-5:]:
            messages.append({"role": "user", "content": h["message"]})
            messages.append({"role": "assistant", "content": h["response"]})

        messages.append({"role": "user", "content": message})

        payload = {
            "model": MODEL,
            "messages": messages,
            "max_tokens": 1024,
            "temperature": 0.7
        }

        resp = requests.post(f"{VLLM_URL}/v1/chat/completions", json=payload, timeout=120)
        result = resp.json()

        if "choices" in result and len(result["choices"]) > 0:
            response_text = result["choices"][0]["message"]["content"]
        else:
            response_text = "Desole, une erreur est survenue."

        if user_id != "anonymous":
            save_conversation(user_id, agent_id, message, response_text)
            profile = get_user_profile(user_id)
            profile["last_interaction"] = datetime.now().isoformat()
            save_user_profile(user_id, profile)

        return jsonify({
            "response": response_text,
            "agent": {
                "id": agent_id,
                "name": agent["name"],
                "role": agent["role"]
            }
        })

    except Exception as e:
        return jsonify({"response": f"Erreur: {str(e)}"}), 500

# =============================================================================
# API ROUTES - USER PROFILE
# =============================================================================

@app.route("/api/profile/<user_id>", methods=["GET"])
def get_profile(user_id):
    auth = request.headers.get("Authorization", "")
    if not verify_auth(user_id, auth):
        return jsonify({"error": "Non autorise"}), 401

    profile = get_user_profile(user_id)
    context = get_shared_context(user_id)

    return jsonify({
        "profile": profile,
        "context": context,
        "insights": {
            agent_id: get_agent_insights(user_id, agent_id)
            for agent_id in AGENTS.keys()
        }
    })

@app.route("/api/profile/<user_id>", methods=["POST", "PATCH"])
def update_profile(user_id):
    auth = request.headers.get("Authorization", "")
    if not verify_auth(user_id, auth):
        return jsonify({"error": "Non autorise"}), 401

    data = request.get_json()
    profile = update_user_profile(user_id, data)

    return jsonify({"success": True, "profile": profile})

# =============================================================================
# API ROUTES - HISTORY
# =============================================================================

@app.route("/api/history/<user_id>", methods=["GET"])
def get_history(user_id):
    auth = request.headers.get("Authorization", "")
    if not verify_auth(user_id, auth):
        return jsonify({"error": "Non autorise"}), 401

    stats_key = f"stats:{user_id}"
    raw_stats = redis_client.hgetall(stats_key)
    stats = {k: int(v) for k, v in raw_stats.items()}

    return jsonify({
        "userId": user_id,
        "conversations": get_all_user_conversations(user_id),
        "stats": stats,
        "profile": get_user_profile(user_id)
    })

@app.route("/api/history/<user_id>/<agent_id>", methods=["GET"])
def get_agent_history(user_id, agent_id):
    auth = request.headers.get("Authorization", "")
    if not verify_auth(user_id, auth):
        return jsonify({"error": "Non autorise"}), 401

    return jsonify({
        "userId": user_id,
        "agentId": agent_id,
        "agentName": AGENTS.get(agent_id, {}).get("name", agent_id),
        "history": get_conversation_history(user_id, agent_id)
    })

@app.route("/api/history/<user_id>", methods=["DELETE"])
def delete_all_history(user_id):
    auth = request.headers.get("Authorization", "")
    if not verify_auth(user_id, auth):
        return jsonify({"error": "Non autorise"}), 401

    deleted_count = 0
    for agent_id in AGENTS.keys():
        key = get_user_history_key(user_id, agent_id)
        count = redis_client.llen(key)
        if count > 0:
            redis_client.delete(key)
            deleted_count += count

    return jsonify({"success": True, "deletedCount": deleted_count})

@app.route("/api/history/<user_id>/<agent_id>", methods=["DELETE"])
def delete_agent_history(user_id, agent_id):
    auth = request.headers.get("Authorization", "")
    if not verify_auth(user_id, auth):
        return jsonify({"error": "Non autorise"}), 401

    key = get_user_history_key(user_id, agent_id)
    count = redis_client.llen(key)
    redis_client.delete(key)

    return jsonify({"success": True, "agentId": agent_id, "deletedCount": count})

# =============================================================================
# API ROUTES - FEEDBACK
# =============================================================================

@app.route("/api/feedback", methods=["POST"])
def submit_feedback():
    data = request.get_json()
    user_id = data.get("userId")
    agent_id = data.get("agentId")
    rating = data.get("rating")
    comment = data.get("comment")
    message_id = data.get("messageId", "unknown")

    if not all([user_id, agent_id, rating]):
        return jsonify({"error": "Champs requis manquants"}), 400

    save_feedback(user_id, agent_id, message_id, rating, comment)

    return jsonify({"success": True, "message": "Merci pour votre feedback!"})

# =============================================================================
# API ROUTES - AUTH & HEALTH
# =============================================================================

@app.route("/api/auth/token", methods=["POST"])
def gen_token():
    data = request.get_json()
    user_id = data.get("userId")
    backend_key = data.get("backendKey")

    if backend_key != SECRET_KEY:
        return jsonify({"error": "Cle invalide"}), 403

    token = hashlib.sha256(f"{user_id}:{SECRET_KEY}".encode()).hexdigest()[:32]
    return jsonify({"userId": user_id, "token": token})

@app.route("/api/agents", methods=["GET"])
def get_agents():
    return jsonify({
        "agents": [
            {
                "id": agent_id,
                "name": agent["name"],
                "role": agent["role"],
                "color": agent["color"],
                "icon": agent["icon"],
                "description": agent["description"],
                "expertise": agent["expertise"]
            }
            for agent_id, agent in AGENTS.items()
        ]
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "version": "v7",
        "name": "QUERNEL INTELLIGENCE - Les 3 Anges",
        "agents": [
            {"id": k, "name": v["name"], "role": v["role"]}
            for k, v in AGENTS.items()
        ],
        "features": [
            "shared_context",
            "user_profile",
            "inter_agent_communication",
            "feedback_system",
            "web_search",
            "datetime"
        ],
        "redis": "connected" if redis_client.ping() else "error",
        "datetime": get_current_datetime()
    })

# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("QUERNEL INTELLIGENCE - Les 3 Anges")
    print("=" * 60)
    print(f"Version: v7")
    print(f"Date: {get_current_datetime()}")
    print("")
    print("Agents disponibles:")
    for agent_id, agent in AGENTS.items():
        print(f"  - {agent['name']} ({agent['role']})")
    print("")
    print("Features: Contexte partage, Profils, Communication inter-agents")
    print("=" * 60)
    app.run(host="0.0.0.0", port=8080, threaded=True)
