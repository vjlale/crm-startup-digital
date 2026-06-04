#!/usr/bin/env bash
# Levanta el entorno de DEMO aislado y lo carga con datos ficticios.
# Pensado para sacar capturas de marketing sin tocar producción.
#
# Uso (en el VPS o local):  chmod +x demo.sh && ./demo.sh
set -e
cd "$(dirname "$0")"

# Detectar host público (para que el navegador llegue al backend de demo).
IP="$(curl -fsS https://api.ipify.org 2>/dev/null || echo localhost)"
export DEMO_API_URL="http://${IP}:4010"
export DEMO_ORIGIN="http://${IP}:8090"

echo "==> Construyendo y levantando la demo (host: ${IP})…"
docker compose -f docker-compose.demo.yml up -d --build

echo "==> Esperando al backend…"
sleep 8

echo "==> Cargando datos de demo…"
docker compose -f docker-compose.demo.yml exec -T server-demo node scripts/seed-demo.js

echo ""
echo "✅ Demo lista para capturas:"
echo "   Frontend: http://${IP}:8090"
echo "   (Sacá capturas de Bandeja, Pipeline y Dashboard.)"
echo ""
echo "   Si no abre, abrí los puertos 8090 y 4010 en el firewall de Hostinger/ufw."
echo "   Para borrar la demo cuando termines:"
echo "     docker compose -f docker-compose.demo.yml down -v"
