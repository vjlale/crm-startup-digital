import React, { useState } from 'react'
import { useCRM } from '../context/CRMContext'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  Building,
  Calendar,
  Star,
  Eye
} from 'lucide-react'
import LeadModal from '../components/LeadModal'
import LeadDetailModal from '../components/LeadDetailModal'

const getStatusColor = (status) => {
  switch (status) {
    case 'Lead Caliente': return 'status-badge status-hot'
    case 'Lead Tibio': return 'status-badge status-warm'
    case 'Lead Frío': return 'status-badge status-cold'
    case 'Cliente': return 'status-badge status-client'
    default: return 'status-badge bg-gray-100 text-gray-700'
  }
}

const getScoreColor = (score) => {
  if (score >= 90) return 'text-red-600 bg-red-100'
  if (score >= 70) return 'text-yellow-600 bg-yellow-100'
  if (score >= 50) return 'text-blue-600 bg-blue-100'
  return 'text-gray-600 bg-gray-100'
}

export default function Leads() {
  const { leads, filters, setFilters, deleteLead } = useCRM()
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.company.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filters.status === 'all' || lead.status === filters.status
      const matchesSource = filters.source === 'all' || lead.source === filters.source
      const matchesIndustry = filters.industry === 'all' || lead.industry === filters.industry
      
      return matchesSearch && matchesStatus && matchesSource && matchesIndustry
    })
    .sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleEdit = (lead) => {
    setSelectedLead(lead)
    setIsModalOpen(true)
  }

  const handleView = (lead) => {
    setSelectedLead(lead)
    setIsDetailModalOpen(true)
  }

  const handleDelete = (leadId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este lead?')) {
      deleteLead(leadId)
    }
  }

  const handleAddNew = () => {
    setSelectedLead(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-2">Gestiona tus prospectos y clientes potenciales</p>
        </div>
        <button
          onClick={handleAddNew}
          className="btn-primary mt-4 sm:mt-0 inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Lead
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar leads..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">Todos los estados</option>
            <option value="Lead Caliente">Lead Caliente</option>
            <option value="Lead Tibio">Lead Tibio</option>
            <option value="Lead Frío">Lead Frío</option>
            <option value="Cliente">Cliente</option>
          </select>

          {/* Source Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          >
            <option value="all">Todas las fuentes</option>
            <option value="Formulario Web">Formulario Web</option>
            <option value="Redes Sociales">Redes Sociales</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Referido">Referido</option>
            <option value="Webinar">Webinar</option>
          </select>

          {/* Sort */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field)
              setSortOrder(order)
            }}
          >
            <option value="createdAt-desc">Más recientes</option>
            <option value="createdAt-asc">Más antiguos</option>
            <option value="score-desc">Mayor score</option>
            <option value="score-asc">Menor score</option>
            <option value="name-asc">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredLeads.length} de {leads.length} leads
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="card hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                <p className="text-sm text-gray-600">{lead.position} en {lead.company}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(lead.score)}`}>
                  {lead.score}
                </div>
                <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              </div>
            </div>

            {/* Status */}
            <div className="mb-4">
              <span className={getStatusColor(lead.status)}>
                {lead.status}
              </span>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {lead.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {lead.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Building className="h-4 w-4 mr-2" />
                {lead.industry} • {lead.companySize}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Última interacción: {new Date(lead.lastInteraction).toLocaleDateString('es-ES')}
              </div>
            </div>

            {/* Interest & Budget */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">
                <strong>Interés:</strong> {lead.interest}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Presupuesto:</strong> {lead.budget}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                onClick={() => handleView(lead)}
                className="btn-secondary text-xs flex items-center"
              >
                <Eye className="h-3 w-3 mr-1" />
                Ver
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(lead)}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(lead.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay leads</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filters.status !== 'all' || filters.source !== 'all' || filters.industry !== 'all'
              ? 'No se encontraron leads con los filtros aplicados.'
              : 'Comienza agregando tu primer lead.'}
          </p>
          {(!searchTerm && filters.status === 'all' && filters.source === 'all' && filters.industry === 'all') && (
            <div className="mt-6">
              <button
                onClick={handleAddNew}
                className="btn-primary inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Lead
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <LeadModal
          lead={selectedLead}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedLead(null)
          }}
        />
      )}

      {isDetailModalOpen && selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedLead(null)
          }}
        />
      )}
    </div>
  )
}