import 'dotenv/config'
import http from 'node:http'
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io'

import { whatsapp } from './whatsapp/client.js'
import { attachPersistence } from './whatsapp/persistence.js'
import { setupSocket } from './socket/gateway.js'
import whatsappRoutes from './routes/whatsapp.js'
import contactsRoutes from './routes/contacts.js'
import messagesRoutes from './routes/messages.js'

const PORT = process.env.PORT || 4000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

const app = express()
app.use(cors({ origin: CLIENT_ORIGIN }))
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: CLIENT_ORIGIN } })
app.set('io', io)

// Tiempo real
setupSocket(io)
attachPersistence(io)

// REST
app.get('/api/health', (req, res) => res.json({ status: 'OK' }))
app.use('/api/whatsapp', whatsappRoutes)
app.use('/api/contacts', contactsRoutes)
app.use('/api/messages', messagesRoutes)

server.listen(PORT, () => {
  console.log(`🚀 WaCRM backend en http://localhost:${PORT}`)
  console.log(`🔌 Frontend permitido: ${CLIENT_ORIGIN}`)
  // Intentar reconectar automáticamente si ya hay una sesión guardada.
  whatsapp.start().catch((e) => console.error('Error al iniciar WhatsApp:', e.message))
})
