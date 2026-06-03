import { useEffect, useState } from 'react'
import { Users, MessageCircle, Bell, Trophy } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { api } from '../lib/api.js'
import { useStore } from '../store/useStore.js'
import { LEAD_STATUSES } from '../lib/constants.js'

const STATUS_COLORS = ['#94a3b8', '#3b82f6', '#f59e0b', '#a855f7', '#10b981', '#f43f5e']

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const contacts = useStore((s) => s.contacts)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.stats().then(setStats).catch(() => {})
  }, [contacts.length])

  const byStatus = stats?.byStatus || {}
  const chartData = LEAD_STATUSES.map((s) => ({ name: s, value: byStatus[s] || 0 }))

  return (
    <div className="h-full overflow-auto p-6">
      <h1 className="mb-5 text-2xl font-bold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Contactos totales" value={stats?.total ?? '—'} color="bg-blue-500" />
        <StatCard icon={MessageCircle} label="Nuevos hoy" value={stats?.newToday ?? '—'} color="bg-emerald-500" />
        <StatCard icon={Bell} label="Mensajes sin leer" value={stats?.unread ?? '—'} color="bg-amber-500" />
        <StatCard icon={Trophy} label="Clientes" value={byStatus['Cliente'] ?? '—'} color="bg-purple-500" />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-700">Contactos por estado</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
