import React, { useState, useEffect } from 'react'
import { useCRM } from '../context/CRMContext'
import { X } from 'lucide-react'

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  position: '',
  source: 'Formulario Web',
  status: 'Lead Nuevo',
  industry: 'E-commerce',
  companySize: 'Pequeña',
  budget: '$1000-2000',
  interest: '',
  notes: ''
}

export default function LeadModal({ lead, isOpen, onClose }) {
  const { addLead, updateLead } = useCRM()
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        position: lead.position || '',
        source: lead.source || 'Formulario Web',
        status: lead.status || 'Lead Nuevo',
        industry: lead.industry || 'E-commerce',
        companySize: lead.companySize || 'Pequeña',
        budget: lead.budget || '$1000-2000',
        interest: lead.interest || '',
        notes: lead.notes || ''
      })
    } else {
      setFormData(initialFormData)
    }
  }, [lead])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const calculateScore = (data) => {
    let score = 0
    
    // Company size scoring
    if (data.companySize === 'Mediana') score += 10
    else if (data.companySize === 'Pequeña') score += 8
    else if (data.companySize === 'Micro') score += 5
    
    // Industry scoring
    if (data.industry === 'E-commerce') score += 10
    else if (data.industry === 'SaaS') score += 9
    else if (data.industry === 'Servicios') score += 8
    else score += 5
    
    // Budget scoring
    if (data.budget.includes('$4000+')) score += 10
    else if (data.budget.includes('$2000-4000')) score += 8
    else if (data.budget.includes('$1000-2000')) score += 6
    else score += 3
    
    // Base scoring for complete data
    if (data.name && data.email && data.company) score += 20
    if (data.phone) score += 10
    if (data.interest) score += 15
    if (data.notes) score += 5
    
    return Math.min(score, 100)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const score = calculateScore(formData)
      const leadData = {
        ...formData,
        score
      }
      
      if (lead) {
        updateLead(lead.id, leadData)
      } else {
        addLead(leadData)
      }
      
      onClose()
    } catch (error) {
      console.error('Error saving lead:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {lead ? 'Editar Lead' : 'Nuevo Lead'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa *
              </label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuente
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Formulario Web">Formulario Web</option>
                <option value="Redes Sociales">Redes Sociales</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Referido">Referido</option>
                <option value="Webinar">Webinar</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Lead Nuevo">Lead Nuevo</option>
                <option value="Lead Caliente">Lead Caliente</option>
                <option value="Lead Tibio">Lead Tibio</option>
                <option value="Lead Frío">Lead Frío</option>
                <option value="Cliente">Cliente</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industria
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="E-commerce">E-commerce</option>
                <option value="SaaS">SaaS</option>
                <option value="Servicios">Servicios</option>
                <option value="Retail">Retail</option>
                <option value="Consultoría">Consultoría</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño Empresa
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Micro">Micro (1-10)</option>
                <option value="Pequeña">Pequeña (11-50)</option>
                <option value="Mediana">Mediana (51-200)</option>
                <option value="Grande">Grande (+200)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presupuesto
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="$500-1000">$500-1000</option>
                <option value="$1000-2000">$1000-2000</option>
                <option value="$2000-4000">$2000-4000</option>
                <option value="$4000+">$4000+</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servicio de Interés
            </label>
            <input
              type="text"
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              placeholder="ej: Automatización WhatsApp, CRM Personalizado..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notas adicionales sobre el lead..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : (lead ? 'Actualizar' : 'Crear Lead')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}