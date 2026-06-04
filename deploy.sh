#!/usr/bin/env bash
# WaCRM — despliegue de un solo paso para un VPS (Ubuntu/Debian, como Hostinger).
#
# Uso (dentro de la carpeta del proyecto ya clonado):
#   chmod +x deploy.sh
#   sudo ./deploy.sh
#
# Qué hace:
#   1. Instala Docker + Compose si no están.
#   2. Crea el archivo .env con la IP pública del VPS (si aún no existe).
#   3. Construye y levanta los contenedores en segundo plano.
set -e

echo "==> WaCRM deploy"

# 1) Docker
if ! command -v docker >/dev/null 2>&1; then
  echo "==> Instalando Docker..."
  curl -fsSL https://get.docker.com | sh
else
  echo "==> Docker ya está instalado."
fi

# 2) .env
if [ ! -f .env ]; then
  echo "==> Creando .env..."
  PUBLIC_IP="$(curl -fsS https://api.ipify.org 2>/dev/null || curl -fsS https://ifconfig.me 2>/dev/null || echo '')"
  if [ -z "$PUBLIC_IP" ]; then
    echo "    No pude detectar la IP pública automáticamente."
    read -rp "    Ingresa la IP pública o dominio del VPS: " PUBLIC_IP
  fi
  echo "    Usando host público: $PUBLIC_IP"
  cat > .env <<EOF
VITE_API_URL=http://${PUBLIC_IP}:4000
CLIENT_ORIGIN=http://${PUBLIC_IP}:8080
WEB_PORT=8080
SERVER_PORT=4000
EOF
else
  echo "==> .env ya existe, no lo toco."
fi

# 3) Build + up
echo "==> Construyendo y levantando contenedores..."
docker compose up --build -d

echo ""
echo "==> ¡Listo! WaCRM está corriendo:"
# shellcheck disable=SC1091
. ./.env
echo "    Frontend: ${CLIENT_ORIGIN}"
echo "    Backend:  ${VITE_API_URL}"
echo ""
echo "    Abre el frontend, ve a 'Conexión' y escanea el QR."
echo "    Ver logs:    docker compose logs -f"
echo "    Detener:     docker compose down  (los datos se conservan)"
