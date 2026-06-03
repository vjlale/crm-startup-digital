import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useStore } from '../store/useStore.js'
import { displayName, formatDay, STATUS_DOT } from '../lib/constants.js'

export default function ChatList() {
  const contacts = useStore((s) => s.contacts)
  const activeId = useStore((s) => s.activeId)
  const openChat = useStore((s) => s.openChat)
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return contacts
    return contacts.filter((c) =>
      [c.name, c.pushName, c.phone].filter(Boolean).some((v) => v.toLowerCase().includes(term))
    )
  }, [contacts, q])

  return (
    <div className="flex h-full w-80 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar chat…"
            className="w-full rounded-lg bg-slate-100 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-400">
            Aún no hay conversaciones. Cuando recibas mensajes aparecerán aquí.
          </p>
        )}
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => openChat(c.id)}
            className={`flex w-full items-center gap-3 border-b border-slate-50 px-3 py-3 text-left transition hover:bg-slate-50 ${
              activeId === c.id ? 'bg-emerald-50' : ''
            }`}
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-semibold text-white">
              {displayName(c).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-slate-800">
                  {displayName(c)}
                </span>
                <span className="flex-shrink-0 text-[11px] text-slate-400">
                  {formatDay(c.lastMessageAt)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs text-slate-500">
                  {c.lastMessagePreview || '—'}
                </span>
                {c.unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[11px] font-bold text-white">
                    {c.unreadCount}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${STATUS_DOT[c.status] || 'bg-slate-300'}`} />
                <span className="text-[11px] text-slate-400">{c.status}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
