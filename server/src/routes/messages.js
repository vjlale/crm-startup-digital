import { Router } from 'express'
import { prisma } from '../db/client.js'
import { whatsapp } from '../whatsapp/client.js'

const router = Router()

// Historial de mensajes de un contacto.
router.get('/:contactId', async (req, res) => {
  const messages = await prisma.message.findMany({
    where: { contactId: req.params.contactId },
    orderBy: { timestamp: 'asc' },
    take: 500,
  })
  res.json(messages)
})

// Enviar un mensaje de texto a un contacto.
router.post('/:contactId', async (req, res) => {
  const { text } = req.body
  if (!text || !text.trim()) return res.status(400).json({ error: 'Mensaje vacío' })

  const contact = await prisma.contact.findUnique({ where: { id: req.params.contactId } })
  if (!contact) return res.status(404).json({ error: 'Contacto no encontrado' })

  try {
    const sent = await whatsapp.sendText(contact.jid, text.trim())

    const message = await prisma.message.create({
      data: {
        waId: sent.waId,
        contactId: contact.id,
        fromMe: true,
        body: text.trim(),
        type: 'text',
        status: 'sent',
        timestamp: sent.timestamp,
      },
    })

    const updated = await prisma.contact.update({
      where: { id: contact.id },
      data: { lastMessageAt: sent.timestamp, lastMessagePreview: text.trim().slice(0, 120) },
    })

    const io = req.app.get('io')
    io?.emit('wa:message', { contact: updated, message })
    io?.emit('wa:contact', updated)

    res.json(message)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
