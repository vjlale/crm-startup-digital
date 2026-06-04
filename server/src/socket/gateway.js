import { whatsapp } from '../whatsapp/client.js'

/**
 * Gateway de Socket.IO: cuando un cliente se conecta le manda el estado actual
 * de WhatsApp para que pinte el QR o la bandeja sin tener que pedir nada.
 */
export function setupSocket(io) {
  io.on('connection', (socket) => {
    socket.emit('wa:status', whatsapp.getStatus())

    socket.on('disconnect', () => {
      // sin estado por socket por ahora
    })
  })
}
