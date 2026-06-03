import { useEffect, useRef, useState } from 'react'
import { Send, ArrowLeft, UserRound } from 'lucide-react'
import { useStore } from '../store/useStore.js'
import { displayName, formatTime } from '../lib/constants.js'

export default function ChatWindow({ onOpenLead }) {
  const contact = useStore((s) => s.activeContact())
  const messages = useStore((s) => s.messages)
  const send = useStore((s) => s.sendMessage)
  const closeChat = useStore((s) => s.closeChat)
  const waState = useStore((s) => s.waStatus.state)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!contact) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 text-slate-400">
        <div className="text-5xl">💬</div>
        <p className="mt-3 text-sm">Elige una conversación para empezar.</p>
      </div>
    )
  }

  const onSend = async (e) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setText('')
    setSending(true)
    try {
      await send(t)
    } catch (err) {
      alert('No se pudo enviar: ' + err.message)
      setText(t)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-[#f0f2f5]">
      {/* Cabecera */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-3 py-3 md:px-5">
        <button
          onClick={closeChat}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-semibold text-white">
          {displayName(contact).charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-slate-800">{displayName(contact)}</div>
          <div className="text-xs text-slate-400">{contact.phone}</div>
        </div>
        <button
          onClick={onOpenLead}
          className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Ver ficha del cliente"
        >
          <UserRound size={18} /> Ficha
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex-1 space-y-2 overflow-y-auto p-5">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                m.fromMe
                  ? 'rounded-br-sm bg-emerald-500 text-white'
                  : 'rounded-bl-sm bg-white text-slate-800'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{m.body}</p>
              <div
                className={`mt-1 text-right text-[10px] ${
                  m.fromMe ? 'text-emerald-100' : 'text-slate-400'
                }`}
              >
                {formatTime(m.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <form onSubmit={onSend} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={waState === 'connected' ? 'Escribe un mensaje…' : 'WhatsApp desconectado'}
          disabled={waState !== 'connected'}
          className="flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={sending || !text.trim() || waState !== 'connected'}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
