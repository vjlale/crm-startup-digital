// Demo seed: puebla la base con datos ficticios para CAPTURAS de marketing.
// NO usar en producción. Ejecutar contra una instancia local/aislada:
//   node server/scripts/seed-demo.js
//
// Crea contactos en distintos estados del pipeline, con score, etiquetas y
// conversaciones de ejemplo, para que Inbox/Pipeline/Dashboard se vean "con vida".
import { prisma } from '../src/db/client.js'

const now = Date.now()
const min = 60 * 1000

const demo = [
  {
    name: 'María González', phone: '5491122334455', status: 'Cliente', score: 100,
    tags: 'recurrente,mayorista', notes: 'Compró 3 veces. Excelente relación.',
    chat: [
      ['in', '¡Hola! Quería repetir el pedido del mes pasado 😊', 180],
      ['out', '¡Hola María! Claro, te preparo el mismo combo. ¿Te llega el jueves?', 175],
      ['in', 'Perfecto, gracias!', 170],
    ],
  },
  {
    name: 'Carlos López', phone: '5491133445566', status: 'Negociación', score: 80,
    tags: 'presupuesto-enviado', notes: 'Pidió descuento por volumen. Esperando respuesta.',
    chat: [
      ['in', 'Me pasás el precio por 50 unidades?', 90],
      ['out', 'Te paso el presupuesto con descuento por volumen 👍', 88],
      ['in', 'Genial, lo veo y te confirmo', 80],
    ],
  },
  {
    name: 'Ana Martínez', phone: '5491144556677', status: 'Calificado', score: 60,
    tags: 'interesada,instagram', notes: 'Vino por Instagram. Muy interesada.',
    chat: [
      ['in', 'Hola! Vi el producto en Instagram, está disponible?', 60],
      ['out', '¡Hola Ana! Sí, tenemos stock. ¿Qué color buscás?', 58],
    ],
  },
  {
    name: 'Diego Fernández', phone: '5491155667788', status: 'Contactado', score: 40,
    tags: 'frío', notes: 'Respondió pero sin definir.',
    chat: [
      ['out', 'Hola Diego, ¿seguís interesado en la propuesta?', 45],
      ['in', 'Sí, dame unos días', 30],
    ],
  },
  {
    name: 'Lucía Romero', phone: '5491166778899', status: 'Nuevo', score: 0,
    tags: '', notes: '',
    chat: [
      ['in', 'Buenas! Hacen envíos a Córdoba?', 12],
    ],
  },
  {
    name: 'Javier Sosa', phone: '5491177889900', status: 'Nuevo', score: 0,
    tags: 'consulta', notes: '',
    chat: [
      ['in', 'Hola, qué medios de pago aceptan?', 8],
    ],
  },
  {
    name: 'Sofía Díaz', phone: '5491188990011', status: 'Perdido', score: 20,
    tags: 'precio', notes: 'Le pareció caro, no avanzó.',
    chat: [
      ['in', 'Uff, es un poco caro para mí', 1440],
      ['out', 'Te entiendo Sofía, cualquier cosa quedamos en contacto 🙌', 1438],
    ],
  },
  {
    name: 'Martín Pérez', phone: '5491199001122', status: 'Cliente', score: 90,
    tags: 'recomendado', notes: 'Llegó por recomendación de María.',
    chat: [
      ['in', 'Me recomendó María, quiero hacer un pedido', 300],
      ['out', '¡Bienvenido Martín! Te ayudo con eso ahora mismo', 298],
      ['in', 'Genial 🙌', 295],
    ],
  },
]

async function main() {
  console.log('🌱 Sembrando datos de demo…')
  // Limpieza previa (solo demo).
  await prisma.message.deleteMany({})
  await prisma.contact.deleteMany({})

  for (const c of demo) {
    const jid = `${c.phone}@s.whatsapp.net`
    const last = c.chat[c.chat.length - 1]
    const lastTs = new Date(now - last[2] * min)
    const unread = c.chat.filter((m) => m[0] === 'in').length && c.status === 'Nuevo' ? 1 : 0

    const contact = await prisma.contact.create({
      data: {
        jid, phone: c.phone, name: c.name, pushName: c.name,
        status: c.status, score: c.score, tags: c.tags, notes: c.notes,
        unreadCount: unread,
        lastMessageAt: lastTs,
        lastMessagePreview: last[1].slice(0, 120),
      },
    })

    for (const [dir, body, agoMin] of c.chat) {
      await prisma.message.create({
        data: {
          contactId: contact.id,
          fromMe: dir === 'out',
          body,
          type: 'text',
          status: dir === 'out' ? 'read' : 'delivered',
          timestamp: new Date(now - agoMin * min),
        },
      })
    }
    console.log(`  ✓ ${c.name} (${c.status})`)
  }

  console.log('✅ Listo. Abrí la app y tomá las capturas.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
