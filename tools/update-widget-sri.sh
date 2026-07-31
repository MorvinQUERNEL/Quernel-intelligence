#!/bin/bash
# Recalcule le hash SRI de widget.js (plateforme agents) et met à jour
# frontend/index.html. À lancer après CHAQUE mise à jour de widget.js,
# puis rebuild + redéploiement du site :
#   bash tools/update-widget-sri.sh
#   cd frontend && npx vite build
#   scp -P 65002 dist/index.html u729245499@82.25.113.5:/home/u729245499/domains/quernel-intelligence.com/public_html/index.html
set -e
cd "$(dirname "$0")/.."
URL="https://agents.quernel-cloud.com/widget.js"
HASH="sha384-$(curl -sf "$URL" | openssl dgst -sha384 -binary | openssl base64 -A)"
sed -i '' -E "s|integrity=\"sha384-[A-Za-z0-9+/=]+\"|integrity=\"$HASH\"|" frontend/index.html
grep -o 'integrity="[^"]*"' frontend/index.html
echo "SRI mis à jour — rebuild + redéploiement du site nécessaires."
