# Capturas del producto (Fase B)

Capturas limpias de la app para usar en posts, PDF y landing.

## Cómo generarlas (sin ensuciar producción)

1. Levantar una instancia **local/aislada** (no el VPS de producción):
   ```bash
   cd server && cp .env.example .env && npm install && npm run db:push && npm run dev
   cd web && cp .env.example .env && npm install && npm run dev
   ```
2. Cargar el **demo seed** para que las pantallas se vean pobladas:
   ```bash
   node server/scripts/seed-demo.js
   ```
   (Crea contactos, chats y leads ficticios en estados variados.)
3. Abrir http://localhost:5173 y capturar a 2× (zoom del navegador o pantalla retina):
   - `/inbox` → `inbox.png`
   - `/pipeline` → `pipeline.png`
   - `/dashboard` → `dashboard.png`
   - `/connect` → `connect.png` (muestra el QR de ejemplo)

> Alternativa automatizable: usar un headless browser (Playwright/Puppeteer) para
> capturar las 4 rutas a 1× y 2×. No incluido aún para no sumar dependencias pesadas.

## Importante
- El seed es **solo para demo**: nunca correrlo contra la base del VPS.
- Usar nombres y datos ficticios (el seed ya los trae).
