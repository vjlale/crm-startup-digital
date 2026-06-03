import { useEffect, useState } from 'react'
import { Star, Tag, Save, Check } from 'lucide-react'
import { useStore } from '../store/useStore.js'
import { LEAD_STATUSES, STATUS_STYLES, displayName } from '../lib/constants.js'

// Panel lateral de CRM: calificar y etiquetar al lead sin salir del chat.
export default function LeadPanel() {
  const contact = useStore((s) => s.activeContact())
  const updateContact = useStore((s) => s.updateContact)

  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setName(contact?.name || contact?.pushName || '')
    setNotes(contact?.notes || '')
    setSaved(false)
  }, [contact?.id])

  if (!contact) {
    return (
      <div className="hidden w-80 border-l border-slate-200 bg-white p-6 text-sm text-slate-400 lg:block">
        Selecciona un chat para calificar al contacto.
      </div>
    )
  }

  const tags = (contact.tags || '').split(',').map((t) => t.trim()).filter(Boolean)
  const score = contact.score || 0

  const patch = (data) => updateContact(contact.id, data)

  const setStatus = (status) => patch({ status })
  const setScore = (value) => patch({ score: value })

  const addTag = (e) => {
    e.preventDefault()
    const t = tagInput.trim()
    if (!t || tags.includes(t)) return setTagInput('')
    patch({ tags: [...tags, t] })
    setTagInput('')
  }
  const removeTag = (t) => patch({ tags: tags.filter((x) => x !== t) })

  const saveText = async () => {
    await patch({ name, notes })
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  // 5 niveles → score 0,25,50,75,100
  const stars = [1, 2, 3, 4, 5]
  const activeStars = Math.round(score / 20)

  return (
    <div className="hidden w-80 flex-col overflow-y-auto border-l border-slate-200 bg-white lg:flex">
      <div className="flex flex-col items-center border-b border-slate-100 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-semibold text-white">
          {displayName(contact).charAt(0).toUpperCase()}
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveText}
          className="mt-3 w-full rounded-md border border-transparent px-2 py-1 text-center text-base font-semibold text-slate-800 hover:border-slate-200 focus:border-emerald-400 focus:outline-none"
        />
        <span className="text-xs text-slate-400">{contact.phone}</span>
      </div>

      {/* Estado */}
      <div className="border-b border-slate-100 p-5">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</h3>
        <div className="flex flex-wrap gap-2">
          {LEAD_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                contact.status === s
                  ? STATUS_STYLES[s]
                  : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Calificación */}
      <div className="border-b border-slate-100 p-5">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Calificación
        </h3>
        <div className="flex items-center gap-1">
          {stars.map((s) => (
            <button key={s} onClick={() => setScore(s * 20)} className="transition hover:scale-110">
              <Star
                size={26}
                className={s <= activeStars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
              />
            </button>
          ))}
          <span className="ml-2 text-sm font-semibold text-slate-600">{score}/100</span>
        </div>
      </div>

      {/* Etiquetas */}
      <div className="border-b border-slate-100 p-5">
        <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Tag size={13} /> Etiquetas
        </h3>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
            >
              {t}
              <button onClick={() => removeTag(t)} className="text-slate-400 hover:text-rose-500">
                ×
              </button>
            </span>
          ))}
          {tags.length === 0 && <span className="text-xs text-slate-400">Sin etiquetas</span>}
        </div>
        <form onSubmit={addTag}>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Nueva etiqueta + Enter"
            className="w-full rounded-lg bg-slate-100 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </form>
      </div>

      {/* Notas */}
      <div className="p-5">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Notas</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Anota detalles del cliente…"
          className="w-full resize-none rounded-lg bg-slate-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
        />
        <button
          onClick={saveText}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'Guardado' : 'Guardar notas'}
        </button>
      </div>
    </div>
  )
}
