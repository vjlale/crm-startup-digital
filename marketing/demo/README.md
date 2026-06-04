# Entorno de demo para capturas

Sirve para sacar capturas de marketing de Konversa **con datos ficticios**, sin
exponer información real de clientes y **sin tocar tu instancia de producción**.

## Por qué

Las capturas con datos reales muestran nombres, teléfonos y conversaciones privadas
de personas — no se pueden publicar (privacidad / protección de datos). Esta demo
usa contactos y chats inventados que se ven realistas.

## Cómo usarlo

En el VPS (o en tu PC con Docker):

```bash
cd marketing/demo
chmod +x demo.sh
./demo.sh
```

Esto:
1. Levanta una copia **aislada** (puertos 8090 / 4010, base de datos separada).
2. La carga con datos de demo (María González, Carlos López, etc.).
3. Te da la URL para sacar capturas.

Abrí **http://TU_IP:8090** y capturá **Bandeja**, **Pipeline** y **Dashboard**.
(No hace falta escanear ningún QR: las pantallas se llenan con los datos de demo.)

> Si no abre, abrí los puertos **8090** y **4010** en el firewall de Hostinger/`ufw`.

## Importante

- Esta demo **no comparte datos** con producción (usa el volumen `demo-data`).
- El seed **borra y recarga** solo la base de la demo. Nunca lo corras contra
  producción.

## Al terminar

```bash
docker compose -f docker-compose.demo.yml down -v
```

Esto apaga la demo y borra sus datos ficticios. Tu Konversa de producción sigue
intacto.
