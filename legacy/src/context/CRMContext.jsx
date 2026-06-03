import React, { createContext, useContext, useState } from 'react'
import { sampleLeads, sampleMetrics, sampleAutomations } from '../data/sampleData'

const CRMContext = createContext()

export const useCRM = () => {
  const context = useContext(CRMContext)
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider')
  }
  return context
}

export const CRMProvider = ({ children }) => {
  const [leads, setLeads] = useState(sampleLeads)
  const [metrics, setMetrics] = useState(sampleMetrics)
  const [automations, setAutomations] = useState(sampleAutomations)
  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    industry: 'all'
  })

  const addLead = (lead) => {
    const newLead = {
      ...lead,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString()
    }
    setLeads(prev => [newLead, ...prev])
  }

  const updateLead = (id, updates) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, ...updates, lastInteraction: new Date().toISOString() } : lead
    ))
  }

  const deleteLead = (id) => {
    setLeads(prev => prev.filter(lead => lead.id !== id))
  }

  const getFilteredLeads = () => {
    return leads.filter(lead => {
      if (filters.status !== 'all' && lead.status !== filters.status) return false
      if (filters.source !== 'all' && lead.source !== filters.source) return false
      if (filters.industry !== 'all' && lead.industry !== filters.industry) return false
      return true
    })
  }

  const getMetricsBySource = () => {
    const sources = {}
    leads.forEach(lead => {
      if (!sources[lead.source]) {
        sources[lead.source] = { total: 0, converted: 0 }
      }
      sources[lead.source].total++
      if (lead.status === 'Cliente') {
        sources[lead.source].converted++
      }
    })
    
    return Object.entries(sources).map(([name, data]) => ({
      name,
      leads: data.total,
      conversions: data.converted,
      rate: data.total > 0 ? ((data.converted / data.total) * 100).toFixed(1) : 0
    }))
  }

  const value = {
    leads,
    metrics,
    automations,
    filters,
    setFilters,
    addLead,
    updateLead,
    deleteLead,
    getFilteredLeads,
    getMetricsBySource
  }

  return (
    <CRMContext.Provider value={value}>
      {children}
    </CRMContext.Provider>
  )
}