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
| Piezas Instagram (4 PNG de muestra) | ✅ Hecho | `instagram/piezas/` |
| Guion PDF comercial | ✅ Hecho | `comercial/guion-presentacion.md` |
| Landing page | ✅ Hecho (v1) | `landing/index.html` |
| Demo seed para capturas | ✅ Hecho | `../server/scripts/seed-demo.js` |
| Capturas reales de la app | ⏳ Pendiente (requiere navegador local) | `screenshots/README.md` |
| Sistema de diseño en Figma | ✅ Hecho (Brand + 4 plantillas IG editables) | `figma.md` |
| Fan page (assets + setup) | ⏳ Pendiente | `facebook/` |

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
