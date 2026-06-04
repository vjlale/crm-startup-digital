// Genera los assets de la fan page de Facebook (SVG -> PNG).
// Uso:  cd marketing/tools && npm install && node generate-facebook.js
// Salida: marketing/facebook/*.png
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'facebook')
mkdirSync(OUT, { recursive: true })

const FONT = "Inter, 'DejaVu Sans', ui-sans-serif, system-ui, sans-serif"
const defs = `<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#10b981"/><stop offset="1" stop-color="#047857"/></linearGradient>
  <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#10b981"/><stop offset="1" stop-color="#047857"/></linearGradient>
</defs>`

function iso(x, y, size, white) {
  const s = size / 100
  const bubble = white ? '#ffffff' : 'url(#g)'
  const stroke = white ? '#059669' : '#ffffff'
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M22 8h56a14 14 0 0 1 14 14v34a14 14 0 0 1-14 14H46L29 84a2.6 2.6 0 0 1-4.3-1.9V70h-2.7A14 14 0 0 1 8 56V22A14 14 0 0 1 22 8Z" fill="${bubble}"/>
    <path d="M28 56 41 43l10 10 18-21" stroke="${stroke}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M61 32h11v11" stroke="${stroke}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>`
}

function render(name, w, h, body) {
  const svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${defs}${body}</svg>`
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: w }, font: { loadSystemFonts: true } }).render().asPng()
  writeFileSync(join(OUT, `${name}.png`), png)
  console.log('  ✓', name + '.png', `(${w}x${h})`)
}

console.log('🎨 Generando assets de Facebook…')

// Foto de perfil (se recorta en círculo): 512x512, isotipo blanco centrado sobre gradiente.
render('fb-perfil', 512, 512, `
  <rect width="512" height="512" fill="url(#gv)"/>
  ${iso(146, 150, 220, true)}
`)

// Portada: 1640x624. La zona segura visible en móvil es la franja central,
// por eso el contenido clave va centrado.
render('fb-portada', 1640, 624, `
  <rect width="1640" height="624" fill="url(#gv)"/>
  <circle cx="1500" cy="90" r="260" fill="#ffffff" opacity="0.06"/>
  <circle cx="160" cy="560" r="300" fill="#ffffff" opacity="0.06"/>
  ${iso(560, 150, 120, true)}
  <text x="700" y="250" font-family="${FONT}" font-size="92" font-weight="800" fill="#ffffff">Konversa</text>
  <text x="702" y="320" font-family="${FONT}" font-size="34" font-weight="600" fill="#a7f3d0">CRM para WhatsApp</text>
  <text x="820" y="470" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="700" fill="#ffffff">Convertí tus chats de WhatsApp en clientes.</text>
`)

console.log('✅ Assets en marketing/facebook/')
