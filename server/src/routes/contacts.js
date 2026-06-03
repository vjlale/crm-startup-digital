import { Router } from 'express'
import { prisma } from '../db/client.js'

const router = Router()

// Estados válidos del pipeline de CRM.
export const LEAD_STATUSES = [
  'Nuevo',
  'Contactado',
  'Calificado',
  'Negociación',
  'Cliente',
  'Perdido',
]

// Listar contactos/leads ordenados por último mensaje.
router.get('/', async (req, res) => {
  const { status, q } = req.query
  const where = {}
  if (status && status !== 'all') where.status = status
  if (q) where.OR = [{ name: { contains: q } }, { phone: { contains: q } }, { pushName: { contains: q } }]

  const contacts = await prisma.contact.findMany({
    where,
    orderBy: [{ lastMessageAt: 'desc' }, { createdAt: 'desc' }],
  })
  res.json(contacts)
})

// Detalle de un contacto.
router.get('/:id', async (req, res) => {
  const contact = await prisma.contact.findUnique({ where: { id: req.params.id } })
  if (!contact) return res.status(404).json({ error: 'No encontrado' })
  res.json(contact)
})

// Actualizar datos de CRM: estado, score, etiquetas, notas, nombre, asignado.
router.patch('/:id', async (req, res) => {
  const { status, score, tags, notes, name, assignedTo } = req.body
  const data = {}
  if (status !== undefined) {
    if (!LEAD_STATUSES.includes(status)) return res.status(400).json({ error: 'Estado inválido' })
    data.status = status
  }
  if (score !== undefined) data.score = Math.max(0, Math.min(100, Number(score) || 0))
  if (tags !== undefined) data.tags = Array.isArray(tags) ? tags.join(',') : String(tags)
  if (notes !== undefined) data.notes = String(notes)
  if (name !== undefined) data.name = String(name)
  if (assignedTo !== undefined) data.assignedTo = assignedTo

  try {
    const contact = await prisma.contact.update({ where: { id: req.params.id }, data })
    req.app.get('io')?.emit('wa:contact', contact)
    res.json(contact)
  } catch (e) {
    // P2025 = registro no encontrado; cualquier otro error es interno.
    if (e.code === 'P2025') res.status(404).json({ error: 'No encontrado' })
    else res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Marcar como leído (resetear contador de no leídos).
router.post('/:id/read', async (req, res) => {
  try {
    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data: { unreadCount: 0 },
    })
    req.app.get('io')?.emit('wa:contact', contact)
    res.json(contact)
  } catch (e) {
    if (e.code === 'P2025') res.status(404).json({ error: 'No encontrado' })
    else res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Métricas simples para el dashboard.
router.get('/stats/summary', async (req, res) => {
  const byStatus = {}
  for (const s of LEAD_STATUSES) byStatus[s] = 0
  const grouped = await prisma.contact.groupBy({ by: ['status'], _count: true })
  for (const g of grouped) byStatus[g.status] = g._count

  const total = await prisma.contact.count()
  const unread = await prisma.contact.aggregate({ _sum: { unreadCount: true } })
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const newToday = await prisma.contact.count({ where: { createdAt: { gte: today } } })

  res.json({
    total,
    newToday,
    unread: unread._sum.unreadCount || 0,
    byStatus,
  })
})

export default router
