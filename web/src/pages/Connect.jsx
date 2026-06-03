import { useState } from 'react'
import { CheckCircle2, Smartphone, QrCode, LogOut, Loader2 } from 'lucide-react'
import { useStore } from '../store/useStore.js'
import { api } from '../lib/api.js'

export default function Connect() {
  const waStatus = useStore((s) => s.waStatus)
  const [mode, setMode] = useState('qr') // qr | phone
  const [phone, setPhone] = useState('')
  const [pairingCode, setPairingCode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const requestCode = async () => {
    setError(null)
    setLoading(true)
    setPairingCode(null)
    try {
      const { code } = await api.waPairingCode(phone)
      setPairingCode(code)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await api.waLogout()
      setPairingCode(null)
    } finally {
      setLoading(false)
    }
  }

  const connect = async () => {
    setLoading(true)
    try {
      await api.waConnect()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full overflow-auto p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold text-slate-900">Vincular WhatsApp</h1>
        <p className="mt-1 text-sm text-slate-500">
          Conecta tu cuenta como en WhatsApp Web. La sesión queda guardada: solo lo haces una vez.
        </p>

        {waStatus.state === 'connected' ? (
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <CheckCircle2 className="mx-auto text-emerald-500" size={56} />
            <h2 className="mt-4 text-lg font-semibold text-emerald-800">¡Conectado!</h2>
            <p className="mt-1 text-sm text-emerald-700">
              {waStatus.me?.name || waStatus.me?.id?.split(':')[0] || 'Tu cuenta'} está vinculada.
            </p>
            <button
              onClick={logout}
              disabled={loading}
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Selector de método */}
            <div className="mb-6 flex gap-2 rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setMode('qr')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition ${
                  mode === 'qr' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
                }`}
              >
                <QrCode size={16} /> Código QR
              </button>
              <button
                onClick={() => setMode('phone')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition ${
                  mode === 'phone' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
                }`}
              >
                <Smartphone size={16} /> Por número
              </button>
            </div>

            {mode === 'qr' && (
              <div className="text-center">
                {waStatus.qr ? (
                  <>
                    <img
                      src={waStatus.qr}
                      alt="Código QR de WhatsApp"
                      className="mx-auto h-64 w-64 rounded-lg border border-slate-200"
                    />
                    <ol className="mx-auto mt-5 max-w-xs space-y-1 text-left text-sm text-slate-600">
                      <li>1. Abre WhatsApp en tu teléfono.</li>
                      <li>2. Ve a Ajustes → Dispositivos vinculados.</li>
                      <li>3. Toca "Vincular un dispositivo" y escanea.</li>
                    </ol>
                  </>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center gap-3 text-slate-400">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="text-sm">Generando código QR…</p>
                    <button
                      onClick={connect}
                      className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                    >
                      Generar QR
                    </button>
                  </div>
                )}
              </div>
            )}

            {mode === 'phone' && (
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Número con código de país
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: 5491123456789"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <button
                  onClick={requestCode}
                  disabled={loading || !phone}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  Obtener código
                </button>

                {pairingCode && (
                  <div className="mt-5 rounded-xl bg-slate-900 p-5 text-center">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Tu código de vinculación
                    </p>
                    <p className="mt-2 text-3xl font-bold tracking-[0.3em] text-emerald-400">
                      {pairingCode}
                    </p>
                    <p className="mt-3 text-xs text-slate-400">
                      En WhatsApp: Dispositivos vinculados → Vincular con número → ingresa el código.
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
            )}
          </div>
        )}

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          ⚠️ Esta herramienta usa una conexión no oficial (estilo WhatsApp Web). El uso indebido o
          masivo puede provocar el bloqueo del número por parte de WhatsApp.
        </div>
      </div>
    </div>
  )
}
