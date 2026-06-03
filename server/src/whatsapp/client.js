import { EventEmitter } from 'node:events'
import path from 'node:path'
import fs from 'node:fs'
import qrcode from 'qrcode'
import pino from 'pino'
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys'

const logger = pino({ level: 'warn' })

/**
 * Capa de WhatsApp basada en Baileys.
 *
 * Emite eventos de alto nivel para que el resto de la app no dependa de Baileys:
 *   - 'status'   -> { state, qr?, me? }   estado de conexión (incluye QR como dataURL)
 *   - 'message'  -> mensaje normalizado entrante/saliente
 *   - 'presence' -> reservado para futuro
 *
 * No usa la API oficial de WhatsApp: se conecta como WhatsApp Web (sin costos),
 * con el riesgo de bloqueo que eso implica.
 */
class WhatsAppService extends EventEmitter {
  constructor() {
    super()
    this.sock = null
    this.authDir = process.env.WA_AUTH_DIR || path.resolve('./.wa-auth')
    this.state = 'disconnected' // disconnected | connecting | qr | connected
    this.lastQrDataUrl = null
    this.me = null
    this.starting = false
  }

  getStatus() {
    return {
      state: this.state,
      qr: this.state === 'qr' ? this.lastQrDataUrl : null,
      me: this.me,
    }
  }

  setState(state, extra = {}) {
    this.state = state
    this.emit('status', this.getStatus())
    if (extra.log) console.log(`📡 WhatsApp: ${state}`)
  }

  async start() {
    if (this.starting || this.sock) return
    this.starting = true

    if (!fs.existsSync(this.authDir)) fs.mkdirSync(this.authDir, { recursive: true })

    const { state, saveCreds } = await useMultiFileAuthState(this.authDir)
    const { version } = await fetchLatestBaileysVersion()

    this.setState('connecting', { log: true })

    this.sock = makeWASocket({
      version,
      auth: state,
      logger,
      printQRInTerminal: false,
      browser: ['WaCRM', 'Chrome', '1.0.0'],
      markOnlineOnConnect: false,
      syncFullHistory: false,
    })

    this.sock.ev.on('creds.update', saveCreds)

    this.sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update

      if (qr) {
        this.lastQrDataUrl = await qrcode.toDataURL(qr)
        this.setState('qr', { log: true })
      }

      if (connection === 'open') {
        this.me = this.sock.user || null
        this.lastQrDataUrl = null
        this.setState('connected', { log: true })
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode
        const loggedOut = statusCode === DisconnectReason.loggedOut
        this.sock = null
        this.starting = false
        this.setState('disconnected', { log: true })

        if (loggedOut) {
          // Sesión cerrada desde el teléfono: borrar credenciales para forzar nuevo QR.
          this.clearAuth()
        } else {
          // Reconexión automática (red caída, reinicio, etc.)
          setTimeout(() => this.start().catch((e) => console.error('reconnect error', e)), 2500)
        }
      }
    })

    this.sock.ev.on('messages.upsert', ({ messages, type }) => {
      if (type !== 'notify') return
      for (const m of messages) {
        const normalized = this.normalizeMessage(m)
        if (normalized) this.emit('message', normalized)
      }
    })

    this.starting = false
  }

  normalizeMessage(m) {
    if (!m.message) return null
    const jid = m.key.remoteJid
    if (!jid || jid === 'status@broadcast') return null

    const msg = m.message
    let type = 'other'
    let body = ''

    if (msg.conversation) {
      type = 'text'
      body = msg.conversation
    } else if (msg.extendedTextMessage) {
      type = 'text'
      body = msg.extendedTextMessage.text || ''
    } else if (msg.imageMessage) {
      type = 'image'
      body = msg.imageMessage.caption || '📷 Imagen'
    } else if (msg.videoMessage) {
      type = 'video'
      body = msg.videoMessage.caption || '🎥 Video'
    } else if (msg.audioMessage) {
      type = 'audio'
      body = '🎵 Audio'
    } else if (msg.documentMessage) {
      type = 'document'
      body = msg.documentMessage.fileName || '📎 Documento'
    } else if (msg.stickerMessage) {
      type = 'other'
      body = 'Sticker'
    }

    return {
      waId: m.key.id,
      jid,
      fromMe: !!m.key.fromMe,
      isGroup: jid.endsWith('@g.us'),
      pushName: m.pushName || null,
      type,
      body,
      timestamp: m.messageTimestamp ? new Date(Number(m.messageTimestamp) * 1000) : new Date(),
    }
  }

  /** Vinculación por número (código de emparejamiento, alternativa al QR). */
  async requestPairingCode(phoneNumber) {
    if (!this.sock) await this.start()
    const clean = String(phoneNumber).replace(/[^0-9]/g, '')
    if (!clean) throw new Error('Número inválido')
    // Pequeña espera para asegurar socket listo
    await new Promise((r) => setTimeout(r, 1500))
    const code = await this.sock.requestPairingCode(clean)
    return code
  }

  async sendText(jid, text) {
    if (!this.sock || this.state !== 'connected') throw new Error('WhatsApp no está conectado')
    const result = await this.sock.sendMessage(jid, { text })
    return {
      waId: result?.key?.id || null,
      jid,
      fromMe: true,
      type: 'text',
      body: text,
      timestamp: new Date(),
    }
  }

  async logout() {
    try {
      if (this.sock) await this.sock.logout()
    } catch (_) {
      // ignorar
    } finally {
      this.sock = null
      this.clearAuth()
      this.me = null
      this.setState('disconnected', { log: true })
    }
  }

  clearAuth() {
    try {
      if (fs.existsSync(this.authDir)) fs.rmSync(this.authDir, { recursive: true, force: true })
    } catch (e) {
      console.error('No se pudo limpiar la sesión:', e.message)
    }
  }
}

export const whatsapp = new WhatsAppService()
