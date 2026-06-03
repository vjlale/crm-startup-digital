// Estados del pipeline y su estética. Debe coincidir con LEAD_STATUSES del backend.
export const LEAD_STATUSES = [
  'Nuevo',
  'Contactado',
  'Calificado',
  'Negociación',
  'Cliente',
  'Perdido',
]

export const STATUS_STYLES = {
  Nuevo: 'bg-slate-100 text-slate-700 border-slate-200',
  Contactado: 'bg-blue-100 text-blue-700 border-blue-200',
  Calificado: 'bg-amber-100 text-amber-700 border-amber-200',
  Negociación: 'bg-purple-100 text-purple-700 border-purple-200',
  Cliente: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Perdido: 'bg-rose-100 text-rose-700 border-rose-200',
}

export const STATUS_DOT = {
  Nuevo: 'bg-slate-400',
  Contactado: 'bg-blue-500',
  Calificado: 'bg-amber-500',
  Negociación: 'bg-purple-500',
  Cliente: 'bg-emerald-500',
  Perdido: 'bg-rose-500',
}

export function displayName(contact) {
  return contact?.name || contact?.pushName || contact?.phone || 'Sin nombre'
}

export function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
}

export function formatDay(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('es', { day: '2-digit', month: 'short' })
}
