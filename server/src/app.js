import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'

const app = express()
const port = process.env.PORT || 4000
app.use(cors())
app.use(helmet())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }))
app.use(express.json())

const organizationId = (req) => req.header('x-organization-id') || 'demo-acme'
const leads = [
  { id: 'lead_1', organizationId: 'demo-acme', name: 'Maya Chen', company: 'Northstar Labs', email: 'maya@northstarlabs.com', status: 'Qualified', score: 92, owner: 'AM', source: 'Inbound' },
  { id: 'lead_2', organizationId: 'demo-acme', name: 'Elliot Brooks', company: 'Vertex Systems', email: 'elliot@vertex.io', status: 'Contacted', score: 76, owner: 'JR', source: 'Referral' },
]
const leadSchema = z.object({ name: z.string().min(2), company: z.string().min(2), email: z.string().email(), status: z.enum(['New', 'Contacted', 'Qualified', 'Nurturing', 'Converted', 'Lost']).default('New'), score: z.number().int().min(0).max(100).default(50), owner: z.string().min(2).default('JD'), source: z.string().min(2).default('Inbound') })
const sendError = (res, message, errorCode, status = 400) => res.status(status).json({ success: false, message, errorCode })

app.get('/api/health', (_req, res) => res.json({ success: true, status: 'ok', service: 'nexus-crm-api' }))
app.get('/api/dashboard', (_req, res) => res.json({ success: true, data: { metrics: { pipeline: 2840000, won: 184000, winRate: 24.8, activities: 126 }, updatedAt: new Date().toISOString() } }))
app.get('/api/leads', (req, res) => {
  const search = String(req.query.search || '').toLowerCase()
  const data = leads.filter((lead) => lead.organizationId === organizationId(req) && `${lead.name} ${lead.company} ${lead.email}`.toLowerCase().includes(search))
  res.json({ success: true, data, meta: { total: data.length, page: 1, pageSize: data.length } })
})
app.post('/api/leads', (req, res) => {
  const parsed = leadSchema.safeParse(req.body)
  if (!parsed.success) return sendError(res, 'Lead payload is invalid', 'VALIDATION_ERROR')
  const lead = { id: `lead_${Date.now()}`, organizationId: organizationId(req), ...parsed.data }
  leads.unshift(lead)
  res.status(201).json({ success: true, data: lead })
})

app.use((error, _req, res, _next) => sendError(res, 'Something went wrong', 'INTERNAL_ERROR', 500))

app.listen(port, () => console.log(`NexusCRM API listening on http://localhost:${port}`))
