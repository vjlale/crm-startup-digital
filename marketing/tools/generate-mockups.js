// Mockups del producto (SVG -> PNG) para PDF comercial y landing.
// Recrean las pantallas de Konversa con datos de demo (sin información real).
// Uso:  cd marketing/tools && node generate-mockups.js
// Salida: marketing/mockups/*.png
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'mockups')
mkdirSync(OUT, { recursive: true })

const C = {
  e400: '#34d399', e500: '#10b981', e600: '#059669', e700: '#047857',
  slate900: '#0f172a', slate800: '#1e293b', slate700: '#334155', slate500: '#64748b',
  slate400: '#94a3b8', slate200: '#e2e8f0', slate100: '#f1f5f9', white: '#ffffff',
  blue: '#3b82f6', amber: '#f59e0b', purple: '#a855f7', rose: '#f43f5e', chatbg: '#f0f2f5',
}
const F = "Inter, 'DejaVu Sans', ui-sans-serif, system-ui, sans-serif"
const defs = `<defs><linearGradient id="g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop stop-color="#10b981"/><stop offset="1" stop-color="#047857"/></linearGradient></defs>`

const r = (x, y, w, h, rx, fill, stroke) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${stroke ? ` stroke="${stroke}"` : ''}/>`
const t = (x, y, s, size, w, fill, extra = '') =>
  `<text x="${x}" y="${y}" font-family="${F}" font-size="${size}" font-weight="${w}" fill="${fill}" ${extra}>${s}</text>`
const av = (x, y, d, letter, color = 'url(#g)') =>
  `${r(x, y, d, d, d / 2, color)}<text x="${x + d / 2}" y="${y + d / 2 + d * 0.16}" text-anchor="middle" font-family="${F}" font-size="${d * 0.42}" font-weight="700" fill="#fff">${letter}</text>`
const logo = (x, y, s) =>
  `<g transform="translate(${x},${y}) scale(${s / 64})"><rect width="64" height="64" rx="16" fill="url(#g)"/><path d="M18 38 26 30l6 6 11-13" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M38 23h7v7" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`

function render(name, w, h, body) {
  const svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${defs}${body}</svg>`
  writeFileSync(join(OUT, `${name}.png`), new Resvg(svg, { fitTo: { mode: 'width', value: w }, font: { loadSystemFonts: true } }).render().asPng())
  console.log('  ✓', name + '.png', `(${w}x${h})`)
}

// Sidebar reutilizable (active: índice del item activo)
function sidebar(active, h) {
  const items = ['Bandeja', 'Pipeline', 'Dashboard', 'Conexión']
  const nav = items.map((it, i) => {
    const y = 150 + i * 56
    const on = i === active
    return `${on ? r(16, y - 28, 198, 44, 10, C.e500) : ''}<text x="40" y="${y}" font-family="${F}" font-size="19" font-weight="600" fill="${on ? '#fff' : C.slate400}">${it}</text>`
  }).join('')
  return `${r(0, 0, 230, h, 0, C.slate900)}${logo(24, 26, 42)}${t(78, 48, 'Konversa', 22, 800, '#fff')}${t(78, 72, 'Conectado', 13, 500, C.e400)}${nav}${t(24, h - 30, 'Conexión no oficial (Baileys).', 12, 500, C.slate500)}`
}

// ---- INBOX ----
function inbox() {
  const W = 1600, H = 1000
  const rows = [
    ['J', 'Javier Sosa', 'Hola, ¿qué medios de pago aceptan?', 'Nuevo', C.slate400, 1],
    ['L', 'Lucía Romero', 'Buenas! ¿Hacen envíos a Córdoba?', 'Nuevo', C.slate400, 0],
    ['D', 'Diego Fernández', 'Sí, dame unos días', 'Contactado', C.blue, 0, true],
    ['A', 'Ana Martínez', '¡Hola Ana! Sí, tenemos stock.', 'Calificado', C.amber, 0],
    ['C', 'Carlos López', 'Genial, lo veo y te confirmo', 'Negociación', C.purple, 0],
    ['M', 'María González', 'Perfecto, gracias!', 'Cliente', C.e500, 0],
  ]
  const list = rows.map((row, i) => {
    const y = 150 + i * 92
    const [letter, name, prev, status, dot, unread, sel] = row
    return `${sel ? r(230, y - 20, 380, 92, 0, '#ecfdf5') : ''}${av(252, y, 44, letter)}
      ${t(310, y + 16, name, 17, 700, C.slate800)}${t(560, y + 14, '04 jun', 12, 500, C.slate400, 'text-anchor="end"')}
      ${t(310, y + 40, prev.length > 30 ? prev.slice(0, 30) + '…' : prev, 14, 400, C.slate500)}
      <circle cx="318" cy="${y + 60}" r="5" fill="${dot}"/>${t(332, y + 65, status, 12, 500, C.slate400)}
      ${unread ? `${r(566, y + 30, 24, 24, 12, C.e500)}<text x="578" y="${y + 46}" text-anchor="middle" font-family="${F}" font-size="13" font-weight="700" fill="#fff">${unread}</text>` : ''}`
  }).join('')

  const convX = 610, convW = 660
  const bubbles = `
    ${r(convX + convW - 470, 150, 450, 86, 16, C.e500)}${t(convX + convW - 446, 188, 'Hola Diego, ¿seguís interesado en la', 18, 500, '#fff')}${t(convX + convW - 446, 214, 'propuesta?', 18, 500, '#fff')}
    ${r(convX + 20, 270, 250, 64, 16, '#fff')}${t(convX + 44, 308, 'Sí, dame unos días', 18, 500, C.slate800)}`

  const panelX = 1270, panelW = 330
  const chips = ['Nuevo', 'Contactado', 'Calificado', 'Negociación', 'Cliente', 'Perdido']
  let cx = panelX + 24, cy = 250
  const chipEls = chips.map((c) => {
    const on = c === 'Contactado'
    const w = 26 + c.length * 9
    if (cx + w > panelX + panelW - 20) { cx = panelX + 24; cy += 42 }
    const el = `${r(cx, cy, w, 32, 16, on ? '#dbeafe' : '#fff', on ? '#bfdbfe' : C.slate200)}${t(cx + 14, cy + 21, c, 13, 600, on ? '#1d4ed8' : C.slate400)}`
    cx += w + 8
    return el
  }).join('')
  const stars = [0, 1, 2, 3, 4].map((i) => `<text x="${panelX + 24 + i * 34}" y="${cy + 120}" font-family="${F}" font-size="30" fill="${i < 2 ? C.amber : C.slate200}">★</text>`).join('')

  render('inbox', W, H, `
    ${r(0, 0, W, H, 0, C.chatbg)}
    ${sidebar(0, H)}
    ${r(230, 0, 380, H, 0, '#fff')}${r(252, 40, 336, 44, 22, C.slate100)}${t(286, 68, 'Buscar chat…', 16, 400, C.slate400)}
    ${list}
    ${r(convX, 0, convW, 90, 0, '#fff')}${av(convX + 24, 24, 44, 'D')}${t(convX + 82, 44, 'Diego Fernández', 18, 700, C.slate800)}${t(convX + 82, 68, '5491155667788', 13, 400, C.slate400)}
    ${bubbles}
    ${r(convX + 20, H - 76, convW - 40, 52, 26, '#fff')}${t(convX + 48, H - 44, 'Escribe un mensaje…', 15, 400, C.slate400)}
    ${r(panelX, 0, panelW, H, 0, '#fff')}${av(panelX + panelW / 2 - 34, 40, 68, 'D')}${t(panelX + panelW / 2, 150, 'Diego Fernández', 19, 700, C.slate800, 'text-anchor="middle"')}${t(panelX + panelW / 2, 174, '5491155667788', 13, 400, C.slate400, 'text-anchor="middle"')}
    ${t(panelX + 24, 220, 'ESTADO', 12, 700, C.slate500)}${chipEls}
    ${t(panelX + 24, cy + 90, 'CALIFICACIÓN', 12, 700, C.slate500)}${stars}${t(panelX + 24 + 5 * 34 + 10, cy + 121, '40/100', 15, 700, C.slate700)}
    ${t(panelX + 24, cy + 175, 'ETIQUETAS', 12, 700, C.slate500)}${r(panelX + 24, cy + 190, 70, 30, 15, C.slate100)}${t(panelX + 40, cy + 210, 'frío', 13, 500, C.slate700)}
    ${t(panelX + 24, cy + 265, 'NOTAS', 12, 700, C.slate500)}${r(panelX + 24, cy + 280, panelW - 48, 80, 10, C.slate100)}${t(panelX + 40, cy + 312, 'Respondió pero sin definir.', 14, 400, C.slate700)}
    ${r(panelX + 24, cy + 380, panelW - 48, 46, 10, C.slate900)}${t(panelX + panelW / 2, cy + 409, 'Guardar notas', 15, 600, '#fff', 'text-anchor="middle"')}
  `)
}

// ---- PIPELINE ----
function pipeline() {
  const W = 1600, H = 1000
  const cols = [
    ['Contactado', C.blue, [['D', 'Diego Fernández', '5491155667788', 40]]],
    ['Calificado', C.amber, [['A', 'Ana Martínez', '5491144556677', 60]]],
    ['Negociación', C.purple, [['C', 'Carlos López', '5491133445566', 80]]],
    ['Cliente', C.e500, [['M', 'María González', '5491122334455', 100], ['M', 'Martín Pérez', '5491199001122', 90]]],
  ]
  const colW = 300, gap = 24, startX = 270
  const colsEl = cols.map((col, ci) => {
    const x = startX + ci * (colW + gap)
    const [title, dot, cards] = col
    const cardsEl = cards.map((c, i) => {
      const cy = 200 + i * 130
      const [letter, name, phone, score] = c
      return `${r(x, cy, colW, 110, 14, '#fff', C.slate200)}${av(x + 20, cy + 20, 40, letter)}${t(x + 72, cy + 38, name, 16, 700, C.slate800)}${t(x + 72, cy + 60, phone, 12, 400, C.slate400)}
        ${r(x + 20, cy + 82, colW - 80, 8, 4, C.slate100)}${r(x + 20, cy + 82, (colW - 80) * score / 100, 8, 4, C.amber)}${t(x + colW - 28, cy + 90, String(score), 11, 700, C.slate400, 'text-anchor="end"')}`
    }).join('')
    return `<circle cx="${x + 8}" cy="146" r="7" fill="${dot}"/>${t(x + 26, 152, title, 17, 700, C.slate700)}${r(x + colW - 44, 134, 28, 24, 12, '#fff', C.slate200)}${t(x + colW - 30, 151, String(cards.length), 12, 700, C.slate500, 'text-anchor="middle"')}${cardsEl}`
  }).join('')
  render('pipeline', W, H, `
    ${r(0, 0, W, H, 0, C.slate100)}${sidebar(1, H)}
    ${t(270, 70, 'Pipeline de ventas', 32, 800, C.slate900)}${t(270, 104, 'Arrastra los contactos entre columnas para actualizar su estado.', 16, 400, C.slate500)}
    ${colsEl}`)
}

// ---- DASHBOARD ----
function dashboard() {
  const W = 1600, H = 1000
  const cards = [
    ['8', 'Contactos totales', C.blue], ['8', 'Nuevos hoy', C.e500], ['1', 'Mensajes sin leer', C.amber], ['2', 'Clientes', C.purple],
  ]
  const cardW = 295, gap = 22, sx = 270
  const cardsEl = cards.map((c, i) => {
    const x = sx + i * (cardW + gap)
    return `${r(x, 140, cardW, 130, 16, '#fff', C.slate200)}${r(x + 26, 168, 60, 60, 16, c[2])}${t(x + 110, 205, c[0], 40, 800, C.slate900)}${t(x + 110, 235, c[1], 15, 500, C.slate500)}`
  }).join('')
  const bars = [['Nuevo', 2, C.slate400], ['Contactado', 1, C.blue], ['Calificado', 1, C.amber], ['Negociación', 1, C.purple], ['Cliente', 2, C.e500], ['Perdido', 1, C.rose]]
  const maxH = 360, baseY = 820, bw = 150, bgap = 50, bx = 360
  const barsEl = bars.map((b, i) => {
    const x = bx + i * (bw + bgap)
    const h = (b[1] / 2) * maxH
    return `${r(x, baseY - h, bw, h, 6, b[2])}${t(x + bw / 2, baseY + 30, b[0], 15, 500, C.slate500, 'text-anchor="middle"')}`
  }).join('')
  render('dashboard', W, H, `
    ${r(0, 0, W, H, 0, C.slate100)}${sidebar(2, H)}
    ${t(270, 70, 'Dashboard', 32, 800, C.slate900)}
    ${cardsEl}
    ${r(270, 300, W - 300, 620, 16, '#fff', C.slate200)}${t(300, 350, 'Contactos por estado', 18, 700, C.slate700)}
    ${barsEl}`)
}

console.log('🎨 Generando mockups del producto…')
inbox()
pipeline()
dashboard()
console.log('✅ Mockups en marketing/mockups/')
