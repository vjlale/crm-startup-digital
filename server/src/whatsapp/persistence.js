import { prisma } from '../db/client.js'
import { whatsapp } from './client.js'

/**
 * Conecta los eventos crudos de WhatsApp con la base de datos y el tiempo real.
 * Cada mensaje entrante/saliente: upsert de contacto + guardado de mensaje + emisión por socket.
 */
export function attachPersistence(io) {
  // Reenviar estado de conexión (QR, conectado, etc.) al frontend.
  whatsapp.on('status', (status) => {
    io.emit('wa:status', status)
  })

  // Upsert con reintento: si dos mensajes simultáneos de un contacto nuevo
  // corren a la vez, uno puede fallar con P2002 (jid duplicado). Reintentamos
  // una vez: en el segundo intento el contacto ya existe y se hace update.
  async function upsertContact(msg, phone) {
    const payload = {
      where: { jid: msg.jid },
      update: {
        pushName: msg.pushName || undefined,
        lastMessageAt: msg.timestamp,
        lastMessagePreview: msg.body.slice(0, 120),
        // Sólo incrementa no leídos si el mensaje es entrante.
        ...(msg.fromMe ? {} : { unreadCount: { increment: 1 } }),
      },
      create: {
        jid: msg.jid,
        phone,
        isGroup: msg.isGroup,
        name: msg.pushName || null,
        pushName: msg.pushName || null,
        lastMessageAt: msg.timestamp,
        lastMessagePreview: msg.body.slice(0, 120),
        unreadCount: msg.fromMe ? 0 : 1,
      },
    }
    try {
      return await prisma.contact.upsert(payload)
    } catch (e) {
      if (e.code === 'P2002') return await prisma.contact.upsert(payload)
      throw e
    }
  }

  whatsapp.on('message', async (msg) => {
    try {
      const phone = msg.jid.split('@')[0]

      const contact = await upsertContact(msg, phone)

      // Evitar duplicar mensajes ya guardados (waId único).
      let saved = null
      if (msg.waId) {
        const existing = await prisma.message.findUnique({ where: { waId: msg.waId } })
        if (existing) saved = existing
      }
      if (!saved) {
        saved = await prisma.message.create({
          data: {
            waId: msg.waId || null,
            contactId: contact.id,
            fromMe: msg.fromMe,
            body: msg.body,
            type: msg.type,
            status: msg.fromMe ? 'sent' : 'delivered',
            timestamp: msg.timestamp,
          },
        })
      }

      io.emit('wa:message', { contact, message: saved })
      io.emit('wa:contact', contact)
    } catch (e) {
      console.error('Error al persistir mensaje:', e.message)
    }
  })
}
