# Desplegar WaCRM en un VPS de Hostinger

Guía paso a paso para dejar WaCRM funcionando 24/7 en tu VPS de Hostinger.
Tiempo estimado: ~10 minutos.

---

## Requisitos

- Un VPS de Hostinger con **Ubuntu** (22.04 o 24.04 recomendado).
- Acceso por SSH o el **Terminal del navegador** que ofrece el panel de Hostinger
  (hPanel → VPS → tu servidor → **Terminal del navegador**).

---

## Opción A — Automática (recomendada)

Conéctate al VPS (SSH o Terminal del navegador) y pega esto:

```bash
# 1. Instalar git si no está
sudo apt update && sudo apt install -y git

# 2. Clonar el proyecto
git clone https://github.com/vjlale/crm-startup-digital.git
cd crm-startup-digital
git checkout claude/optimistic-fermat-MRkHb

# 3. Ejecutar el despliegue (instala Docker, configura y levanta todo)
chmod +x deploy.sh
sudo ./deploy.sh
```

El script detecta la IP pública del VPS, crea el `.env`, construye las imágenes y
levanta los contenedores. Al terminar te muestra las URLs.

Abre en tu navegador: **http://TU_IP_DEL_VPS:8080** → pestaña **Conexión** →
escanea el QR con WhatsApp. ¡Listo!

---

## Opción B — Manual (paso a paso)

```bash
# Instalar Docker
curl -fsSL https://get.docker.com | sudo sh

# Clonar
git clone https://github.com/vjlale/crm-startup-digital.git
cd crm-startup-digital
git checkout claude/optimistic-fermat-MRkHb

# Configurar (reemplaza 203.0.113.10 por la IP pública de tu VPS)
cp .env.example .env
nano .env
#   VITE_API_URL=http://203.0.113.10:4000
#   CLIENT_ORIGIN=http://203.0.113.10:8080

# Levantar
sudo docker compose up --build -d
```

---

## Abrir los puertos (firewall)

Si usas el firewall de Hostinger o `ufw`, permite los puertos **8080** y **4000**:

```bash
sudo ufw allow 8080/tcp
sudo ufw allow 4000/tcp
```

En el panel de Hostinger: VPS → **Firewall** → agrega reglas para TCP 8080 y 4000.

---

## Comandos útiles

```bash
docker compose logs -f          # ver logs en vivo
docker compose ps               # estado de los contenedores
docker compose restart          # reiniciar
docker compose down             # detener (los datos se conservan)
docker compose down -v          # detener y BORRAR datos/sesión
```

## Actualizar a una versión nueva

```bash
cd crm-startup-digital
git pull
sudo docker compose up --build -d
```

La base de datos y la sesión de WhatsApp viven en el volumen `wacrm-data`,
así que sobreviven a actualizaciones y reinicios.

---

## (Opcional pero recomendado) Dominio + HTTPS

Acceder por `http://IP:8080` funciona, pero para un producto serio conviene un
dominio con HTTPS. La forma más simple:

1. Apunta un dominio/subdominio (ej. `crm.tudominio.com`) a la IP del VPS (registro A).
2. Instala un reverse proxy con HTTPS automático (Caddy es lo más simple):
   ```bash
   sudo apt install -y caddy
   ```
3. Configura `/etc/caddy/Caddyfile`:
   ```
   crm.tudominio.com {
       reverse_proxy localhost:8080
   }
   api.tudominio.com {
       reverse_proxy localhost:4000
   }
   ```
4. Actualiza el `.env` para usar HTTPS y reconstruye:
   ```
   VITE_API_URL=https://api.tudominio.com
   CLIENT_ORIGIN=https://crm.tudominio.com
   ```
   ```bash
   sudo docker compose up --build -d
   ```

Si quieres, puedo prepararte esta parte (Caddy + dominio) en detalle cuando tengas
el dominio apuntado.

---

## ⚠️ Recordatorio

WaCRM usa una conexión **no oficial** a WhatsApp (Baileys). Infringe los Términos
de Servicio de WhatsApp y existe **riesgo de bloqueo del número**, sobre todo con
envíos masivos. Usa preferentemente un número secundario y sin spam.
