import { create } from 'zustand'
import { api } from '../lib/api.js'
import { socket } from '../lib/socket.js'

// Estado global de la app: conexión de WhatsApp, contactos, chat activo y mensajes.
export const useStore = create((set, get) => ({
  waStatus: { state: 'disconnected', qr: null, me: null },
  contacts: [],
  activeId: null,
  messages: [], // mensajes del contacto activo
  loadingContacts: false,

  // ---- Carga inicial y suscripción a tiempo real ----
  init: async () => {
    try {
      const status = await api.waStatus()
      set({ waStatus: status })
    } catch (_) {}

    await get().loadContacts()

    socket.on('wa:status', (status) => set({ waStatus: status }))

    socket.on('wa:contact', (contact) => {
      set((s) => {
        const exists = s.contacts.some((c) => c.id === contact.id)
        const contacts = exists
          ? s.contacts.map((c) => (c.id === contact.id ? contact : c))
          : [contact, ...s.contacts]
        contacts.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0))
        return { contacts }
      })
    })

    socket.on('wa:message', ({ contact, message }) => {
      const { activeId } = get()
      if (contact.id === activeId) {
        set((s) => {
          if (s.messages.some((m) => m.id === message.id)) return {}
          return { messages: [...s.messages, message] }
        })
      }
    })
  },

  loadContacts: async () => {
    set({ loadingContacts: true })
    try {
      const contacts = await api.contacts()
      set({ contacts })
    } finally {
      set({ loadingContacts: false })
    }
  },

  openChat: async (id) => {
    set({ activeId: id, messages: [] })
    const messages = await api.messages(id)
    set({ messages })
    api.markRead(id).catch(() => {})
    set((s) => ({
      contacts: s.contacts.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    }))
  },

  closeChat: () => set({ activeId: null, messages: [] }),

  sendMessage: async (text) => {
    const { activeId } = get()
    if (!activeId) return
    const message = await api.sendMessage(activeId, text)
    set((s) => ({
      messages: s.messages.some((m) => m.id === message.id) ? s.messages : [...s.messages, message],
    }))
  },

  updateContact: async (id, data) => {
    const updated = await api.updateContact(id, data)
    set((s) => ({ contacts: s.contacts.map((c) => (c.id === id ? updated : c)) }))
    return updated
  },

  activeContact: () => {
    const { contacts, activeId } = get()
    return contacts.find((c) => c.id === activeId) || null
  },
}))
