import React, { useState } from 'react'
import { useCRM } from '../context/CRMContext'
import { 
  BarChart3, 
  TrendingUp, 
  Download,
  Calendar,
  Users,
  DollarSign,
  Target,
  Mail
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const monthlyData = [
  { month: 'Ene', leads: 18, conversions: 3, revenue: 7500 },
  { month: 'Feb', leads: 22, conversions: 4, revenue: 10000 },
  { month: 'Mar', leads: 28, conversions: 6, revenue: 15000 },
  { month: 'Abr', leads: 25, conversions: 5, revenue: 12500 },
  { month: 'May', leads: 32, conversions: 8, revenue: 20000 },
  { month: 'Jun', leads: 35, conversions: 9, revenue: 22500 }
]

const sourceData = [
  { name: 'Formulario Web', leads: 15, conversions: 4, cost: 375 },
  { name: 'Redes Sociales', leads: 12, conversions: 3, cost: 180 },
  { name: 'Google Ads', leads: 8, conversions: 2, cost: 320 },
  { name: 'Referidos', leads: 6, conversions: 3, cost: 0 },
  { name: 'Webinar', leads: 4, conversions: 1, cost: 80 }
]

const industryData = [
  { name: 'E-commerce', value: 35, leads: 12 },
  { name: 'SaaS', value: 25, leads: 8 },
  { name: 'Servicios', value: 20, leads: 7 },
  { name: 'Retail', value: 15, leads: 5 },
  { name: 'Otros', value: 5, leads: 2 }
]

const emailMetrics = [
  { campaign: 'Bienvenida', sent: 245, opened: 110, clicked: 28, conversions: 8 },
  { campaign: 'Demo Follow-up', sent: 89, opened: 55, clicked: 22, conversions: 12 },
  { campaign: 'Proposal', sent: 45, opened: 32, clicked: 15, conversions: 9 },
  { campaign: 'Win-back', sent: 156, opened: 44, clicked: 8, conversions: 3 }
]

export default function Reports() {
  const { leads, getMetricsBySource } = useCRM()
  const [dateRange, setDateRange] = useState('30')
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', name: 'Resumen General', icon: BarChart3 },
    { id: 'sources', name: 'Fuentes', icon: Users },
    { id: 'email', name: 'Email Marketing', icon: Mail },
    { id: 'revenue', name: 'Revenue', icon: DollarSign }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-600 mt-2">Análisis detallado del rendimiento de tu CRM</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 3 meses</option>
            <option value="365">Último año</option>
          </select>
          <button className="btn-primary flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm flex items-center
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-3xl font-bold text-gray-900">245</p>
                  <p className="text-sm text-green-600 mt-1">+18% vs anterior</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-full">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasa Conversión</p>
                  <p className="text-3xl font-bold text-gray-900">22.4%</p>
                  <p className="text-sm text-green-600 mt-1">+3.2% vs anterior</p>
                </div>
                <div className="p-3 bg-success-100 rounded-full">
                  <Target className="h-6 w-6 text-success-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">$87.5k</p>
                  <p className="text-sm text-green-600 mt-1">+24% vs anterior</p>
                </div>
                <div className="p-3 bg-success-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-success-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CAC Promedio</p>
                  <p className="text-3xl font-bold text-gray-900">$156</p>
                  <p className="text-sm text-red-600 mt-1">+8% vs anterior</p>
                </div>
                <div className="p-3 bg-warning-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-warning-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia Mensual</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="leads" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="conversions" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Industry Distribution */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Industria</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sources' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Análisis por Fuente</h2>
          
          {/* Source Performance Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Fuente</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={sourceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#3b82f6" name="Leads" />
                <Bar dataKey="conversions" fill="#10b981" name="Conversiones" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Source Metrics Table */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas Detalladas</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversiones</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasa Conv.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CAC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sourceData.map((source) => {
                    const conversionRate = ((source.conversions / source.leads) * 100).toFixed(1)
                    const cac = source.conversions > 0 ? (source.cost / source.conversions).toFixed(0) : 0
                    const roi = source.cost > 0 ? (((source.conversions * 2500 - source.cost) / source.cost) * 100).toFixed(0) : '∞'
                    
                    return (
                      <tr key={source.name}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {source.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {source.leads}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {source.conversions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {conversionRate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${source.cost}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${cac}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {roi}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'email' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Email Marketing Analytics</h2>
          
          {/* Email KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Emails Enviados</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">535</p>
                <p className="text-sm text-green-600 mt-1">+12% este mes</p>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Tasa Apertura</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">41.3%</p>
                <p className="text-sm text-green-600 mt-1">+2.1% vs anterior</p>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Tasa Click</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">13.6%</p>
                <p className="text-sm text-green-600 mt-1">+1.8% vs anterior</p>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Conversiones</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">32</p>
                <p className="text-sm text-green-600 mt-1">+25% vs anterior</p>
              </div>
            </div>
          </div>

          {/* Email Campaign Performance */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Campaña</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaña</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enviados</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abiertos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversiones</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasa Conv.</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emailMetrics.map((campaign) => {
                    const openRate = ((campaign.opened / campaign.sent) * 100).toFixed(1)
                    const clickRate = ((campaign.clicked / campaign.opened) * 100).toFixed(1)
                    const conversionRate = ((campaign.conversions / campaign.sent) * 100).toFixed(1)
                    
                    return (
                      <tr key={campaign.campaign}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {campaign.campaign}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {campaign.sent}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {campaign.opened} ({openRate}%)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {campaign.clicked} ({clickRate}%)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {campaign.conversions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {conversionRate}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Análisis de Revenue</h2>
          
          {/* Revenue Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución del Revenue</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Revenue Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$87,500</p>
                <p className="text-sm text-green-600 mt-1">+24% vs anterior</p>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$2,679</p>
                <p className="text-sm text-green-600 mt-1">+8% vs anterior</p>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">LTV:CAC Ratio</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">4.2:1</p>
                <p className="text-sm text-green-600 mt-1">Excelente</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}