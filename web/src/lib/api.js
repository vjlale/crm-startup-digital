// Cliente REST mínimo hacia el backend.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Error ${res.status}`)
  }
  return res.json()
}

export const api = {
  // WhatsApp
  waStatus: () => request('/whatsapp/status'),
  waConnect: () => request('/whatsapp/connect', { method: 'POST' }),
  waPairingCode: (phone) =>
    request('/whatsapp/pairing-code', { method: 'POST', body: JSON.stringify({ phone }) }),
  waLogout: () => request('/whatsapp/logout', { method: 'POST' }),

  // Contactos / leads
  contacts: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/contacts${qs ? `?${qs}` : ''}`)
  },
  updateContact: (id, data) =>
    request(`/contacts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  markRead: (id) => request(`/contacts/${id}/read`, { method: 'POST' }),
  stats: () => request('/contacts/stats/summary'),

  // Mensajes
  messages: (contactId) => request(`/messages/${contactId}`),
  sendMessage: (contactId, text) =>
    request(`/messages/${contactId}`, { method: 'POST', body: JSON.stringify({ text }) }),
}

export { BASE as API_BASE }
