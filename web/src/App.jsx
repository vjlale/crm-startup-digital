import { useEffect } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { MessageSquare, LayoutDashboard, KanbanSquare, QrCode } from 'lucide-react'
import { useStore } from './store/useStore.js'
import Connect from './pages/Connect.jsx'
import Inbox from './pages/Inbox.jsx'
import Pipeline from './pages/Pipeline.jsx'
import Dashboard from './pages/Dashboard.jsx'

const NAV = [
  { to: '/inbox', label: 'Bandeja', icon: MessageSquare },
  { to: '/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/connect', label: 'Conexión', icon: QrCode },
]

function ConnectionDot() {
  const state = useStore((s) => s.waStatus.state)
  const map = {
    connected: ['bg-emerald-500', 'Conectado'],
    connecting: ['bg-amber-500 animate-pulse', 'Conectando'],
    qr: ['bg-amber-500 animate-pulse', 'Escanea el QR'],
    disconnected: ['bg-rose-500', 'Desconectado'],
  }
  const [color, label] = map[state] || map.disconnected
  return (
    <div className="flex items-center gap-2 text-xs text-slate-300">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </div>
  )
}

export default function App() {
  const init = useStore((s) => s.init)

  useEffect(() => {
    init()
  }, [init])

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col bg-slate-900 text-white">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-lg">
            💬
          </div>
          <div>
            <div className="font-bold leading-tight">WaCRM</div>
            <ConnectionDot />
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 text-[11px] leading-snug text-slate-500">
          Conexión no oficial (Baileys). No usa la API de WhatsApp.
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/inbox" replace />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/connect" element={<Connect />} />
        </Routes>
      </main>
    </div>
  )
}
