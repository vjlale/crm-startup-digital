import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore.js'
import { LEAD_STATUSES, STATUS_DOT, displayName } from '../lib/constants.js'

// Kanban del pipeline. Arrastra una tarjeta a otra columna para cambiar el estado.
export default function Pipeline() {
  const contacts = useStore((s) => s.contacts)
  const updateContact = useStore((s) => s.updateContact)
  const openChat = useStore((s) => s.openChat)
  const navigate = useNavigate()

  const onDrop = (e, status) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) updateContact(id, { status })
  }

  const goToChat = (id) => {
    openChat(id)
    navigate('/inbox')
  }

  return (
    <div className="flex h-full flex-col p-6">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Pipeline de ventas</h1>
      <p className="mb-5 text-sm text-slate-500">
        Arrastra los contactos entre columnas para actualizar su estado.
      </p>

      <div className="flex flex-1 gap-4 overflow-x-auto pb-2">
        {LEAD_STATUSES.map((status) => {
          const items = contacts.filter((c) => c.status === status)
          return (
            <div
              key={status}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, status)}
              className="flex w-72 flex-shrink-0 flex-col rounded-xl bg-slate-100/70"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[status]}`} />
                  <span className="text-sm font-semibold text-slate-700">{status}</span>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">
                  {items.length}
                </span>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-3">
                {items.map((c) => (
                  <div
                    key={c.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', c.id)}
                    onClick={() => goToChat(c.id)}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-xs font-semibold text-white">
                        {displayName(c).charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-slate-800">
                          {displayName(c)}
                        </div>
                        <div className="text-[11px] text-slate-400">{c.phone}</div>
                      </div>
                    </div>
                    {c.score > 0 && (
                      <div className="mt-2 flex items-center gap-1">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${c.score}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">{c.score}</span>
                      </div>
                    )}
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-300">
                    Vacío
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
