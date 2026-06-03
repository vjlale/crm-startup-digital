import { Router } from 'express'
import { whatsapp } from '../whatsapp/client.js'

const router = Router()

// Estado actual de la conexión (incluye QR como dataURL si aplica).
router.get('/status', (req, res) => {
  res.json(whatsapp.getStatus())
})

// Iniciar/forzar la conexión (genera QR si no hay sesión).
router.post('/connect', async (req, res) => {
  try {
    await whatsapp.start()
    res.json(whatsapp.getStatus())
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Vincular por número -> devuelve código de emparejamiento.
router.post('/pairing-code', async (req, res) => {
  try {
    const { phone } = req.body
    if (!phone) return res.status(400).json({ error: 'Falta el número de teléfono' })
    const code = await whatsapp.requestPairingCode(phone)
    res.json({ code })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Cerrar sesión y borrar credenciales.
router.post('/logout', async (req, res) => {
  await whatsapp.logout()
  res.json(whatsapp.getStatus())
})

export default router
