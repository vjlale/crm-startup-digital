# Marketing — Konversa (by Alenia)

Material de marca y contenido para difusión de **Konversa**, el CRM para WhatsApp.
Plan completo de referencia: ver el documento de plan aprobado.

## Estructura
```
marketing/
├── brand/         # Logo (SVG+PNG), favicon y guía de marca
├── screenshots/   # Capturas del producto (instrucciones + demo seed)
├── instagram/     # Calendario, copys y piezas generadas (PNG)
├── comercial/     # Guion del PDF de presentación comercial
├── landing/       # Landing page estática (index.html)
├── facebook/      # (pendiente) assets de la fan page
└── tools/         # Fábrica de contenido por código (SVG -> PNG)
```

## Estado de los entregables
| Entregable | Estado | Dónde |
|---|---|---|
| Naming + tagline + value props | ✅ Hecho | `brand/brand-guidelines.md` |
| Logo (isotipo, lockup claro/oscuro, favicon) | ✅ Hecho (SVG+PNG) | `brand/` |
| Guía de marca | ✅ Hecho | `brand/brand-guidelines.md` |
| Calendario Instagram (4 semanas) | ✅ Hecho | `instagram/calendario.md` |
| Copys Instagram (12 piezas) | ✅ Hecho | `instagram/copys.md` |
| Piezas Instagram (27 PNG: posts, 4 carruseles, historia) | ✅ Hecho | `instagram/piezas/` |
| Mockups del producto (Bandeja, Pipeline, Dashboard) | ✅ Hecho | `mockups/` |
| PDF comercial (10 páginas, con mockups) | ✅ Hecho | `comercial/konversa-presentacion.pdf` |
| Landing page (con mockups del producto) | ✅ Hecho (v2) | `landing/index.html` |
| Demo seed para capturas | ✅ Hecho | `../server/scripts/seed-demo.js` |
| Sistema de diseño en Figma | ✅ Hecho (Brand + 4 plantillas IG editables) | `figma.md` |
| Fan page (foto perfil + portada) | ✅ Hecho | `facebook/` |

## Regenerar piezas de Instagram
```bash
cd marketing/tools
npm install
npm run instagram   # -> marketing/instagram/piezas/*.png
```
Editá `tools/generate-instagram.js` para cambiar textos o crear nuevas piezas
(es la "fábrica" por código: cada pieza es una función que devuelve un SVG).

## Ver la landing localmente
Abrí `marketing/landing/index.html` en el navegador (no requiere build; usa Tailwind por CDN).
Pendiente antes de publicar: reemplazar el `action` del formulario y los placeholders de captura.

## Pendientes para producción
- Reemplazar mockups de la landing por capturas reales (Fase B).
- Definir precios y datos de contacto (WhatsApp, email, handle IG) — hoy placeholders.
- Verificar disponibilidad del nombre/dominio y del handle @konversa.app.
