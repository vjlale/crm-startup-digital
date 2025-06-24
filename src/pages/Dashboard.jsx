import React from 'react'
import { useCRM } from '../context/CRMContext'
import { 
  Users, 
  Target, 
  DollarSign, 
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

const chartData = [
  { month: 'Ene', leads: 12, conversions: 2 },
  { month: 'Feb', leads: 15, conversions: 3 },
  { month: 'Mar', leads: 18, conversions: 4 },
  { month: 'Abr', leads: 22, conversions: 5 },
  { month: 'May', leads: 25, conversions: 6 },
  { month: 'Jun', leads: 30, conversions: 8 },
]

export default function Dashboard() {
  const { leads, metrics, getMetricsBySource } = useCRM()
  
  const statusDistribution = [
    { name: 'Lead Caliente', value: leads.filter(l => l.status === 'Lead Caliente').length, color: '#ef4444' },
    { name: 'Lead Tibio', value: leads.filter(l => l.status === 'Lead Tibio').length, color: '#f59e0b' },
    { name: 'Lead Frío', value: leads.filter(l => l.status === 'Lead Frío').length, color: '#3b82f6' },
    { name: 'Cliente', value: leads.filter(l => l.status === 'Cliente').length, color: '#10b981' },
  ]

  const sourceMetrics = getMetricsBySource()

  const urgentTasks = [
    { id: 1, task: 'Demo con María González', time: 'Hoy 15:00', type: 'demo' },
    { id: 2, task: 'Seguimiento Roberto Silva', time: 'Mañana 10:00', type: 'followup' },
    { id: 3, task: 'Propuesta Ana Martínez', time: 'Hoy 17:00', type: 'proposal' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Resumen de tu CRM y métricas principales</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
              <p className="text-sm text-green-600 mt-1">+15% este mes</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Leads Calificados</p>
              <p className="text-3xl font-bold text-gray-900">{leads.filter(l => l.score >= 70).length}</p>
              <p className="text-sm text-green-600 mt-1">+22% este mes</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-full">
              <Target className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversiones</p>
              <p className="text-3xl font-bold text-gray-900">{leads.filter(l => l.status === 'Cliente').length}</p>
              <p className="text-sm text-green-600 mt-1">+33% este mes</p>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-3xl font-bold text-gray-900">$14.5k</p>
              <p className="text-sm text-green-600 mt-1">+28% este mes</p>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <DollarSign className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leads Trend */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Leads</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Source Performance */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Fuente</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#3b82f6" />
                <Bar dataKey="conversions" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Leads</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Tasks */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tareas Urgentes</h3>
            <div className="space-y-3">
              {urgentTasks.map((task) => (
                <div key={task.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mr-3">
                    {task.type === 'demo' && <Calendar className="h-5 w-5 text-primary-600" />}
                    {task.type === 'followup' && <Clock className="h-5 w-5 text-warning-600" />}
                    {task.type === 'proposal' && <AlertCircle className="h-5 w-5 text-danger-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.task}</p>
                    <p className="text-xs text-gray-500">{task.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}