import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CRM API is running' })
})

// Sample API endpoints for the CRM
app.get('/api/leads', (req, res) => {
  // In a real app, this would fetch from a database
  res.json({
    leads: [
      {
        id: '1',
        name: 'María González',
        email: 'maria@techcorp.com',
        company: 'TechCorp',
        status: 'Lead Caliente',
        score: 95
      }
    ]
  })
})

app.post('/api/leads', (req, res) => {
  // In a real app, this would save to a database
  const newLead = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  }
  res.status(201).json(newLead)
})

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 CRM Server running on port ${PORT}`)
  console.log(`📊 Dashboard: http://localhost:${PORT}`)
  console.log(`🔗 API: http://localhost:${PORT}/api`)
})