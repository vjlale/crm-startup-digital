import React from 'react'
import { X, Mail, Phone, Building, Calendar, Star, Target, MessageCircle } from 'lucide-react'

const getStatusColor = (status) => {
  switch (status) {
    case 'Lead Caliente': return 'bg-red-100 text-red-800'
    case 'Lead Tibio': return 'bg-yellow-100 text-yellow-800'
    case 'Lead Frío': return 'bg-blue-100 text-blue-800'
    case 'Cliente': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getScoreColor = (score) => {
  if (score >= 90) return 'text-red-600'
  if (score >= 70) return 'text-yellow-600'
  if (score >= 50) return 'text-blue-600'
  return 'text-gray-600'
}

export default function LeadDetailModal({ lead, isOpen, onClose }) {
  if (!isOpen || !lead) return null

  const timeline = [
    {
      id: 1,
      action: 'Lead creado',
      date: lead.createdAt,
      description: `Lead generado desde ${lead.source}`
    },
    {
      id: 2,
      action: 'Primera interacción',
      date: lead.lastInteraction,
      description: 'Email de bienvenida enviado'
    },
    {
      id: 3,
      action: 'Score actualizado',
      date: lead.lastInteraction,
      description: `Score actual: ${lead.score} puntos`
    }
  ]

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{lead.name}</h3>
            <p className="text-gray-600">{lead.position} en {lead.company}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <div className="card">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-medium">{lead.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Empresa</p>
                      <p className="font-medium">{lead.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Industria</p>
                      <p className="font-medium">{lead.industry}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="card">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Información Comercial</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tamaño Empresa</p>
                    <p className="font-medium">{lead.companySize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Presupuesto</p>
                    <p className="font-medium">{lead.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fuente</p>
                    <p className="font-medium">{lead.source}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Servicio de Interés</p>
                  <p className="font-medium">{lead.interest}</p>
                </div>
              </div>

              {/* Notes */}
              {lead.notes && (
                <div className="card">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Notas</h4>
                  <p className="text-gray-700">{lead.notes}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="card">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Cronología</h4>
                <div className="space-y-4">
                  {timeline.map((item) => (
                    <div key={item.id} className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{item.action}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.date).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Score */}
              <div className="card">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Estado</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Estado Actual</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Lead Score</p>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" />
                      <span className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                      <span className="text-gray-500 ml-1">/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${lead.score >= 90 ? 'bg-red-500' : lead.score >= 70 ? 'bg-yellow-500' : lead.score >= 50 ? 'bg-blue-500' : 'bg-gray-500'}`}
                        style={{ width: `${lead.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h4>
                <div className="space-y-3">
                  <button className="w-full btn-primary flex items-center justify-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Email
                  </button>
                  <button className="w-full btn-secondary flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar
                  </button>
                  <button className="w-full btn-secondary flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </button>
                  <button className="w-full btn-secondary flex items-center justify-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Demo
                  </button>
                </div>
              </div>

              {/* Important Dates */}
              <div className="card">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Fechas Importantes</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Creado</p>
                    <p className="font-medium">
                      {new Date(lead.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Última Interacción</p>
                    <p className="font-medium">
                      {new Date(lead.lastInteraction).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  {lead.nextFollowUp && (
                    <div>
                      <p className="text-sm text-gray-600">Próximo Seguimiento</p>
                      <p className="font-medium text-orange-600">
                        {new Date(lead.nextFollowUp).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}