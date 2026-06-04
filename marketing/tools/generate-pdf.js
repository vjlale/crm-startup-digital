// PDF de presentación comercial de Konversa.
// Cada página se diseña como SVG (1280x720), se renderiza a PNG y se ensambla en un PDF.
// Uso:  cd marketing/tools && node generate-pdf.js
// Salida: marketing/comercial/konversa-presentacion.pdf
import { Resvg } from '@resvg/resvg-js'
import { PDFDocument } from 'pdf-lib'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'comercial')
const MK = join(__dirname, '..', 'mockups')
mkdirSync(OUT, { recursive: true })

const W = 1280, H = 720
const C = {
  e400: '#34d399', e500: '#10b981', e700: '#047857',
  slate900: '#0f172a', slate700: '#334155', slate500: '#64748b', slate200: '#e2e8f0', slate100: '#f1f5f9', white: '#ffffff',
}
const F = "Inter, 'DejaVu Sans', ui-sans-serif, system-ui, sans-serif"
const defs = `<defs>
  <linearGradient id="g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop stop-color="#10b981"/><stop offset="1" stop-color="#047857"/></linearGradient>
  <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#10b981"/><stop offset="1" stop-color="#047857"/></linearGradient>
</defs>`
const T = (x, y, s, size, w, fill, extra = '') => `<text x="${x}" y="${y}" font-family="${F}" font-size="${size}" font-weight="${w}" fill="${fill}" ${extra}>${s}</text>`
const logo = (x, y, s, white) => `<g transform="translate(${x},${y}) scale(${s / 64})"><rect width="64" height="64" rx="16" fill="${white ? '#ffffff' : 'url(#g)'}"/><path d="M18 38 26 30l6 6 11-13" stroke="${white ? '#059669' : '#fff'}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M38 23h7v7" stroke="${white ? '#059669' : '#fff'}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`
const dataImg = (file, x, y, w, h) => `<image x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${readFileSync(file).toString('base64')}"/>`
const kicker = (s) => `${T(80, 90, 'Konversa', 22, 800, C.slate900)}${logo(80, 50, 30, false).replace('translate(80,50)', 'translate(80,52)')}`
const pageHead = () => `${logo(80, 54, 30)}${T(124, 88, 'Konversa', 20, 800, C.slate900)}`

// Tarjeta para mockups con marco tipo navegador
function frame(file, x, y, w, h) {
  return `${`<rect x="${x}" y="${y}" width="${w}" height="${h + 34}" rx="14" fill="#fff" stroke="${C.slate200}"/>`}
    <circle cx="${x + 24}" cy="${y + 18}" r="6" fill="#f87171"/><circle cx="${x + 44}" cy="${y + 18}" r="6" fill="#fbbf24"/><circle cx="${x + 64}" cy="${y + 18}" r="6" fill="#34d399"/>
    <clipPath id="clip${x}${y}"><rect x="${x + 10}" y="${y + 34}" width="${w - 20}" height="${h - 10}" rx="8"/></clipPath>
    <g clip-path="url(#clip${x}${y})">${dataImg(file, x + 10, y + 34, w - 20, h - 10)}</g>`
}

function bullets(items, x, y, gap) {
  return items.map((it, i) => {
    const cy = y + i * gap
    return `<circle cx="${x + 12}" cy="${cy - 8}" r="14" fill="url(#g)"/><path d="M${x + 6} ${cy - 8} l4 4 8 -9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${T(x + 40, cy, it, 26, 500, C.slate700)}`
  }).join('')
}

const PAGES = []
const page = (svgBody) => PAGES.push(`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${defs}${svgBody}</svg>`)

// 1 — Portada
page(`<rect width="${W}" height="${H}" fill="url(#gv)"/>
  <circle cx="${W - 80}" cy="100" r="240" fill="#fff" opacity="0.06"/><circle cx="60" cy="${H - 60}" r="260" fill="#fff" opacity="0.06"/>
  ${logo(540, 150, 110, true)}
  ${T(W / 2, 380, 'Konversa', 96, 800, '#fff', 'text-anchor="middle" letter-spacing="-2"')}
  ${T(W / 2, 440, 'Convertí tus chats de WhatsApp en clientes.', 32, 600, '#d1fae5', 'text-anchor="middle"')}
  ${T(W / 2, 660, 'Un producto de Alenia · alenia.online', 20, 500, '#a7f3d0', 'text-anchor="middle"')}`)

// 2 — Problema
page(`<rect width="${W}" height="${H}" fill="${C.slate100}"/>${pageHead()}
  ${T(80, 200, 'Vender por WhatsApp se vuelve un caos', 52, 800, C.slate900)}
  ${bullets(['Chats de venta mezclados con lo personal.', 'Clientes que se pierden sin seguimiento.', 'No sabés en qué quedó cada conversación.', 'Cero visibilidad de cuánto estás vendiendo.'], 90, 300, 80)}`)

// 3 — Solución
page(`<rect width="${W}" height="${H}" fill="${C.white}"/>${pageHead()}
  ${T(80, 220, 'La solución', 30, 700, C.e700)}
  ${T(80, 300, 'Konversa: tu WhatsApp,', 60, 800, C.slate900)}${T(80, 372, 'ahora un CRM.', 60, 800, C.slate900)}
  ${T(80, 470, 'Conectá tu WhatsApp y ordená todas tus conversaciones de venta', 28, 500, C.slate700)}
  ${T(80, 510, 'en un CRM simple, visual y en tiempo real.', 28, 500, C.slate700)}`)

// 4 — Bandeja
page(`<rect width="${W}" height="${H}" fill="${C.slate100}"/>${pageHead()}
  ${T(80, 150, 'Bandeja en tiempo real', 40, 800, C.slate900)}${T(80, 184, 'Todos tus chats en un solo lugar, sin saltar de app.', 22, 500, C.slate500)}
  ${frame(join(MK, 'inbox.png'), 230, 215, 820, 470)}`)

// 5 — Pipeline
page(`<rect width="${W}" height="${H}" fill="${C.slate100}"/>${pageHead()}
  ${T(80, 150, 'Pipeline visual', 40, 800, C.slate900)}${T(80, 184, 'Arrastrá cada cliente por el embudo, de "Nuevo" a "Cliente".', 22, 500, C.slate500)}
  ${frame(join(MK, 'pipeline.png'), 230, 215, 820, 470)}`)

// 6 — Dashboard
page(`<rect width="${W}" height="${H}" fill="${C.slate100}"/>${pageHead()}
  ${T(80, 150, 'Métricas en vivo', 40, 800, C.slate900)}${T(80, 184, 'Sabé cómo van tus ventas de un vistazo, sin planillas.', 22, 500, C.slate500)}
  ${frame(join(MK, 'dashboard.png'), 230, 215, 820, 470)}`)

// 7 — Cómo funciona
const step = (x, n, title, sub) => `<circle cx="${x + 60}" cy="320" r="46" fill="url(#g)"/>${T(x + 60, 335, n, 44, 800, '#fff', 'text-anchor="middle"')}${T(x + 60, 420, title, 30, 800, C.slate900, 'text-anchor="middle"')}${T(x + 60, 460, sub, 19, 500, C.slate500, 'text-anchor="middle"')}`
page(`<rect width="${W}" height="${H}" fill="${C.white}"/>${pageHead()}
  ${T(80, 180, 'Cómo funciona', 52, 800, C.slate900)}
  ${step(160, '1', 'Vinculás', 'Escaneás un QR (1 min)')}
  ${step(560, '2', 'Chateás', 'Como siempre, ordenado')}
  ${step(960, '3', 'Organizás', 'Calificás cada cliente')}`)

// 8 — Diferenciadores
page(`<rect width="${W}" height="${H}" fill="${C.slate100}"/>${pageHead()}
  ${T(80, 200, 'Por qué Konversa', 52, 800, C.slate900)}
  ${bullets(['Sin costos de API: usás tu propio número, cero costo por mensaje.', 'Setup en 1 minuto, sin conocimientos técnicos.', 'Chat + CRM en una sola pantalla.', 'Datos en tiempo real de todas tus ventas.'], 90, 300, 80)}`)

// 9 — Planes (placeholder)
const plan = (x, name, note) => `<rect x="${x}" y="250" width="340" height="300" rx="20" fill="#fff" stroke="${C.slate200}"/>${T(x + 30, 320, name, 30, 800, C.slate900)}${T(x + 30, 380, note, 20, 500, C.slate500)}${T(x + 30, 420, 'a definir', 22, 600, C.e700)}`
page(`<rect width="${W}" height="${H}" fill="${C.white}"/>${pageHead()}
  ${T(80, 180, 'Planes', 52, 800, C.slate900)}${T(80, 220, 'Precios a confirmar.', 22, 500, C.slate500)}
  ${plan(120, 'Free', 'Para empezar')}${plan(480, 'Pro', 'Más etiquetas y uso')}${plan(840, 'Business', 'Equipos')}`)

// 10 — Cierre
page(`<rect width="${W}" height="${H}" fill="url(#gv)"/>
  ${logo(560, 130, 90, true)}
  ${T(W / 2, 320, 'Probá Konversa con tu', 52, 800, '#fff', 'text-anchor="middle"')}${T(W / 2, 384, 'WhatsApp hoy.', 52, 800, '#fff', 'text-anchor="middle"')}
  ${T(W / 2, 470, 'alenia.online', 26, 700, '#fff', 'text-anchor="middle"')}
  ${T(W / 2, 520, 'WhatsApp de ventas: (a definir) · @konversa.app', 20, 500, '#d1fae5', 'text-anchor="middle"')}
  ${T(W / 2, 650, 'Konversa usa una conexión no oficial a WhatsApp. Uso responsable, sin envíos masivos.', 15, 500, '#a7f3d0', 'text-anchor="middle"')}`)

// Render cada página a PNG y ensamblar el PDF
console.log('📄 Generando PDF comercial…')
const pdf = await PDFDocument.create()
const pagesDir = join(OUT, 'pages')
mkdirSync(pagesDir, { recursive: true })
for (let i = 0; i < PAGES.length; i++) {
  const png = new Resvg(PAGES[i], { fitTo: { mode: 'width', value: W }, font: { loadSystemFonts: true } }).render().asPng()
  writeFileSync(join(pagesDir, `p${i + 1}.png`), png)
  const img = await pdf.embedPng(png)
  const p = pdf.addPage([W, H])
  p.drawImage(img, { x: 0, y: 0, width: W, height: H })
  console.log('  ✓ página', i + 1)
}
writeFileSync(join(OUT, 'konversa-presentacion.pdf'), await pdf.save())
console.log('✅ PDF en marketing/comercial/konversa-presentacion.pdf (' + PAGES.length + ' páginas)')
