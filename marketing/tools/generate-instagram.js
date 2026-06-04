// Fábrica de contenido Konversa: genera piezas de Instagram en PNG desde plantillas SVG.
// Uso:  cd marketing/tools && npm install && npm run instagram
// Salida: marketing/instagram/piezas/*.png
//
// Es la alternativa "por código" (100% reproducible) al diseño en Figma.
// Cada pieza = una función que devuelve SVG; se renderiza a PNG con resvg.
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'instagram', 'piezas')
mkdirSync(OUT, { recursive: true })

// ---- Paleta de marca ----
const C = {
  e400: '#34d399', e500: '#10b981', e600: '#059669', e700: '#047857',
  slate900: '#0f172a', slate500: '#64748b', slate100: '#f1f5f9', white: '#ffffff',
}
const FONT = "Inter, 'DejaVu Sans', ui-sans-serif, system-ui, sans-serif"

// Isotipo (burbuja + flecha) escalable. color: 'white' o 'brand'
function isotipo(x, y, size, variant = 'brand') {
  const s = size / 100
  const bubbleFill = variant === 'white' ? C.white : `url(#brandGrad)`
  const stroke = variant === 'white' ? C.e600 : C.white
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M22 8h56a14 14 0 0 1 14 14v34a14 14 0 0 1-14 14H46L29 84a2.6 2.6 0 0 1-4.3-1.9V70h-2.7A14 14 0 0 1 8 56V22A14 14 0 0 1 22 8Z" fill="${bubbleFill}"/>
    <path d="M28 56 41 43l10 10 18-21" stroke="${stroke}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M61 32h11v11" stroke="${stroke}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>`
}

const defs = `<defs>
  <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="${C.e500}"/><stop offset="1" stop-color="${C.e700}"/>
  </linearGradient>
  <linearGradient id="brandGradV" x1="0" y1="0" x2="0" y2="1">
    <stop stop-color="${C.e500}"/><stop offset="1" stop-color="${C.e700}"/>
  </linearGradient>
</defs>`

function render(name, w, h, body) {
  const svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${defs}${body}</svg>`
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: w }, font: { loadSystemFonts: true } }).render().asPng()
  writeFileSync(join(OUT, `${name}.png`), png)
  console.log('  ✓', name + '.png', `(${w}x${h})`)
}

// Helper: texto multilínea centrado
function lines(arr, x, y, lh, attrs) {
  return arr.map((t, i) => `<text x="${x}" y="${y + i * lh}" ${attrs}>${t}</text>`).join('')
}

// ============ PIEZAS ============

// 1) Lanzamiento de marca (1080x1350) — fondo gradiente
function lanzamiento() {
  const W = 1080, H = 1350
  render('01-lanzamiento', W, H, `
    <rect width="${W}" height="${H}" fill="url(#brandGradV)"/>
    <circle cx="${W - 60}" cy="120" r="220" fill="#ffffff" opacity="0.06"/>
    <circle cx="80" cy="${H - 120}" r="260" fill="#ffffff" opacity="0.06"/>
    ${isotipo(W / 2 - 110, 250, 220, 'white')}
    <text x="${W / 2}" y="720" text-anchor="middle" font-family="${FONT}" font-size="120" font-weight="800" letter-spacing="-3" fill="${C.white}">Konversa</text>
    <text x="${W / 2}" y="800" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="600" fill="${C.e400}" opacity="0.95">CRM para WhatsApp</text>
    ${lines(['Convertí tus chats de', 'WhatsApp en clientes.'], W / 2, 960, 70, `text-anchor="middle" font-family="${FONT}" font-size="56" font-weight="700" fill="${C.white}"`)}
    <rect x="${W / 2 - 290}" y="1120" width="580" height="92" rx="46" fill="${C.white}"/>
    <text x="${W / 2}" y="1176" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="700" fill="${C.e700}">Probalo hoy → alenia.online</text>
  `)
}

// 2) Carrusel feature: vinculación (portada, 1080x1350) — fondo claro
function featureQR() {
  const W = 1080, H = 1350
  render('02-feature-qr', W, H, `
    <rect width="${W}" height="${H}" fill="${C.slate100}"/>
    <rect x="0" y="0" width="${W}" height="18" fill="url(#brandGrad)"/>
    ${isotipo(80, 90, 96, 'brand')}
    <text x="190" y="160" font-family="${FONT}" font-size="34" font-weight="800" fill="${C.slate900}">Konversa</text>
    ${lines(['Conectá tu', 'WhatsApp en', '1 minuto'], 80, 420, 110, `font-family="${FONT}" font-size="96" font-weight="800" letter-spacing="-2" fill="${C.slate900}"`)}
    <circle cx="130" cy="820" r="34" fill="url(#brandGrad)"/><text x="130" y="833" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="800" fill="#fff">1</text>
    <text x="195" y="833" font-family="${FONT}" font-size="42" font-weight="600" fill="${C.slate900}">Abrís Konversa</text>
    <circle cx="130" cy="930" r="34" fill="url(#brandGrad)"/><text x="130" y="943" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="800" fill="#fff">2</text>
    <text x="195" y="943" font-family="${FONT}" font-size="42" font-weight="600" fill="${C.slate900}">Escaneás el QR</text>
    <circle cx="130" cy="1040" r="34" fill="url(#brandGrad)"/><text x="130" y="1053" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="800" fill="#fff">3</text>
    <text x="195" y="1053" font-family="${FONT}" font-size="42" font-weight="600" fill="${C.slate900}">¡Listo, a vender!</text>
    <text x="80" y="1270" font-family="${FONT}" font-size="30" font-weight="600" fill="${C.slate500}">Sin instalar nada · Sin API · Sin vueltas</text>
  `)
}

// 3) Diferenciador: sin costos (1080x1080)
function diferenciador() {
  const W = 1080, H = 1080
  render('03-diferenciador', W, H, `
    <rect width="${W}" height="${H}" fill="${C.slate900}"/>
    ${isotipo(80, 80, 90, 'brand')}
    <text x="185" y="148" font-family="${FONT}" font-size="32" font-weight="800" fill="${C.white}">Konversa</text>
    ${lines(['Sin costos', 'de API.'], 80, 430, 130, `font-family="${FONT}" font-size="120" font-weight="800" letter-spacing="-3" fill="${C.white}"`)}
    <text x="80" y="640" font-family="${FONT}" font-size="48" font-weight="700" fill="${C.e400}">Tu número, tus reglas.</text>
    ${lines(['Usás tu propio WhatsApp directamente.', 'Cero costo por mensaje.'], 80, 760, 60, `font-family="${FONT}" font-size="40" font-weight="500" fill="#cbd5e1"`)}
    <text x="80" y="1000" font-family="${FONT}" font-size="30" font-weight="600" fill="${C.slate500}">alenia.online · @konversa.app</text>
  `)
}

// 4) Konversa en 3 pasos (1080x1080)
function tresPasos() {
  const W = 1080, H = 1080
  const card = (x, n, t1, t2) => `
    <rect x="${x}" y="430" width="290" height="320" rx="28" fill="#fff" stroke="#e2e8f0" stroke-width="2"/>
    <circle cx="${x + 60}" cy="500" r="36" fill="url(#brandGrad)"/><text x="${x + 60}" y="514" text-anchor="middle" font-family="${FONT}" font-size="38" font-weight="800" fill="#fff">${n}</text>
    <text x="${x + 30}" y="600" font-family="${FONT}" font-size="34" font-weight="800" fill="${C.slate900}">${t1}</text>
    <text x="${x + 30}" y="646" font-family="${FONT}" font-size="25" font-weight="500" fill="${C.slate500}">${t2}</text>`
  render('04-tres-pasos', W, H, `
    <rect width="${W}" height="${H}" fill="${C.slate100}"/>
    <rect x="0" y="0" width="${W}" height="18" fill="url(#brandGrad)"/>
    ${isotipo(80, 90, 90, 'brand')}
    <text x="185" y="158" font-family="${FONT}" font-size="32" font-weight="800" fill="${C.slate900}">Konversa</text>
    <text x="80" y="310" font-family="${FONT}" font-size="84" font-weight="800" letter-spacing="-2" fill="${C.slate900}">En 3 pasos</text>
    ${card(70, '1', 'Vinculás', 'tu WhatsApp por QR')}
    ${card(395, '2', 'Chateás', 'como siempre')}
    ${card(720, '3', 'Organizás', 'y calificás clientes')}
    <text x="${W / 2}" y="880" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="700" fill="${C.e700}">Tus ventas, bajo control.</text>
    <text x="${W / 2}" y="980" text-anchor="middle" font-family="${FONT}" font-size="30" font-weight="600" fill="${C.slate500}">Probalo en alenia.online</text>
  `)
}

// ---- Plantillas de carrusel (reutilizables) ----
const headerLight = (y = 70) =>
  `${isotipo(80, y, 64, 'brand')}<text x="160" y="${y + 44}" font-family="${FONT}" font-size="30" font-weight="800" fill="${C.slate900}">Konversa</text>`
const headerDark = (y = 80) =>
  `${isotipo(80, y, 60, 'brand')}<text x="155" y="${y + 42}" font-family="${FONT}" font-size="28" font-weight="800" fill="#ffffff">Konversa</text>`

// Portada de carrusel
function coverSlide(name, kicker, titleLines) {
  render(name, 1080, 1350, `
    <rect width="1080" height="1350" fill="${C.slate100}"/>
    <rect width="1080" height="18" fill="url(#brandGrad)"/>
    ${headerLight(70)}
    <text x="80" y="320" font-family="${FONT}" font-size="34" font-weight="700" fill="${C.e600}">${kicker}</text>
    ${lines(titleLines, 80, 440, 104, `font-family="${FONT}" font-size="92" font-weight="800" letter-spacing="-2" fill="${C.slate900}"`)}
    <text x="80" y="1270" font-family="${FONT}" font-size="30" font-weight="700" fill="${C.slate500}">Deslizá →</text>
  `)
}

// Slide de contenido (número + título + cuerpo)
function contentSlide(name, num, titleLines, bodyLines) {
  render(name, 1080, 1350, `
    <rect width="1080" height="1350" fill="${C.slate100}"/>
    <rect width="1080" height="18" fill="url(#brandGrad)"/>
    ${headerLight(70)}
    <circle cx="138" cy="430" r="56" fill="url(#brandGrad)"/>
    <text x="138" y="452" text-anchor="middle" font-family="${FONT}" font-size="56" font-weight="800" fill="#fff">${num}</text>
    ${lines(titleLines, 80, 600, 84, `font-family="${FONT}" font-size="72" font-weight="800" letter-spacing="-1" fill="${C.slate900}"`)}
    ${lines(bodyLines, 80, 640 + titleLines.length * 84, 56, `font-family="${FONT}" font-size="40" font-weight="500" fill="#334155"`)}
  `)
}

// Slide de cierre (CTA, gradiente)
function ctaSlide(name, bigLines, sub) {
  render(name, 1080, 1350, `
    <rect width="1080" height="1350" fill="url(#brandGradV)"/>
    ${isotipo(490, 230, 100, 'white')}
    ${lines(bigLines, 540, 580, 96, `text-anchor="middle" font-family="${FONT}" font-size="84" font-weight="800" fill="#ffffff"`)}
    <text x="540" y="${580 + bigLines.length * 96 + 30}" text-anchor="middle" font-family="${FONT}" font-size="38" font-weight="600" fill="#a7f3d0">${sub}</text>
    <rect x="270" y="1130" width="540" height="92" rx="46" fill="#ffffff"/>
    <text x="540" y="1188" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="700" fill="${C.e700}">Probalo → alenia.online</text>
  `)
}

// Genera un carrusel completo (cover + contenidos + cierre)
function carousel(slug, cover, slides, cta) {
  coverSlide(`${slug}-1`, cover.kicker, cover.title)
  slides.forEach((s, i) => contentSlide(`${slug}-${i + 2}`, String(i + 1), s.title, s.body))
  ctaSlide(`${slug}-${slides.length + 2}`, cta.big, cta.sub)
}

// Post simple oscuro (lista de puntos)
function listPost(name, kicker, titleLines, items, footer) {
  let y = 560
  const rows = items.map((it, i) => {
    const block = `<circle cx="118" cy="${y - 14}" r="30" fill="url(#brandGrad)"/><text x="118" y="${y - 2}" text-anchor="middle" font-family="${FONT}" font-size="30" font-weight="800" fill="#fff">${i + 1}</text><text x="175" y="${y}" font-family="${FONT}" font-size="40" font-weight="600" fill="#e2e8f0">${it}</text>`
    y += 110
    return block
  }).join('')
  render(name, 1080, 1080, `
    <rect width="1080" height="1080" fill="${C.slate900}"/>
    ${headerDark(80)}
    <text x="80" y="280" font-family="${FONT}" font-size="34" font-weight="700" fill="${C.e400}">${kicker}</text>
    ${lines(titleLines, 80, 360, 64, `font-family="${FONT}" font-size="58" font-weight="800" fill="#ffffff"`)}
    ${rows}
    <text x="80" y="1010" font-family="${FONT}" font-size="30" font-weight="600" fill="${C.slate500}">${footer}</text>
  `)
}

// Historia 1080x1920
function story(name) {
  render(name, 1080, 1920, `
    <rect width="1080" height="1920" fill="url(#brandGradV)"/>
    <circle cx="980" cy="180" r="240" fill="#ffffff" opacity="0.06"/>
    <circle cx="120" cy="1700" r="280" fill="#ffffff" opacity="0.06"/>
    ${isotipo(490, 480, 100, 'white')}
    <text x="540" y="900" text-anchor="middle" font-family="${FONT}" font-size="110" font-weight="800" letter-spacing="-2" fill="#ffffff">Konversa</text>
    <text x="540" y="970" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="600" fill="#a7f3d0">CRM para WhatsApp</text>
    ${lines(['Convertí tus chats', 'en clientes.'], 540, 1140, 84, `text-anchor="middle" font-family="${FONT}" font-size="64" font-weight="700" fill="#ffffff"`)}
    <rect x="290" y="1500" width="500" height="96" rx="48" fill="#ffffff"/>
    <text x="540" y="1560" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="700" fill="${C.e700}">Deslizá arriba ↑</text>
  `)
}

console.log('🎨 Generando piezas de Instagram…')
// Piezas base
lanzamiento()
featureQR()
diferenciador()
tresPasos()

// Carruseles educativos
carousel('05-problema',
  { kicker: 'El problema', title: ['Vender por', 'WhatsApp', 'es un caos'] },
  [
    { title: ['Chats', 'mezclados'], body: ['Lo personal y las ventas,', 'todo en el mismo lugar.'] },
    { title: ['Clientes que', 'se pierden'], body: ['Sin seguimiento,', 'la venta se enfría.'] },
    { title: ['No sabés', 'en qué quedó'], body: ['Cada conversación', 'es un misterio.'] },
  ],
  { big: ['Konversa', 'ordena todo.'], sub: 'Seguinos para conocerlo' })

carousel('06-calificacion',
  { kicker: 'Función', title: ['Calificá', 'clientes', 'al instante'] },
  [
    { title: ['Estrellas'], body: ['Puntuá a cada cliente', 'de 0 a 100.'] },
    { title: ['Etiquetas'], body: ['Segmentá por interés,', 'origen o lo que quieras.'] },
    { title: ['Notas'], body: ['Guardá lo importante', 'de cada charla.'] },
  ],
  { big: ['Sabé a quién', 'priorizar.'], sub: 'Probalo gratis' })

carousel('07-pipeline',
  { kicker: 'Función', title: ['Tu embudo', 'de ventas', 'visual'] },
  [
    { title: ['Arrastrá'], body: ['Mové cada cliente', 'entre etapas.'] },
    { title: ['Etapas claras'], body: ['De "Nuevo" a "Cliente",', 'de un vistazo.'] },
    { title: ['Nada se', 'pierde'], body: ['Seguimiento de cada', 'venta abierta.'] },
  ],
  { big: ['Vendé con', 'orden.'], sub: 'Link en bio' })

carousel('08-dashboard',
  { kicker: 'Función', title: ['Tus ventas', 'en vivo'] },
  [
    { title: ['Métricas'], body: ['Contactos, sin leer', 'y clientes cerrados.'] },
    { title: ['Sin planillas'], body: ['Todo en un panel', 'claro y simple.'] },
    { title: ['Decidí', 'con datos'], body: ['Y no a ojo.'] },
  ],
  { big: ['Mirá cómo', 'vas hoy.'], sub: 'Comentá DEMO' })

// Posts simples
listPost('09-errores', 'Tip de ventas', ['3 errores al vender', 'por WhatsApp'],
  ['Responder sin orden (y olvidarte).', 'No anotar en qué quedó cada cliente.', 'No hacer seguimiento.'],
  'El tercero es el que más ventas cuesta · @konversa.app')

ctaSlide('10-oferta', ['Probá Konversa', 'con tu WhatsApp', 'hoy.'], 'Sin tarjeta · Sin compromiso')

// Historia
story('11-historia')

console.log('✅ Piezas en marketing/instagram/piezas/')

