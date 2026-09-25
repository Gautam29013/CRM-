import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity, ArrowUpRight, BarChart3, Bell, Building2, CalendarDays, Check,
  ChevronDown, CircleDollarSign, Clock3, Command, FileText, Filter, LayoutDashboard,
  MoonStar, MoreHorizontal, Plus, Search, Settings, Sparkles, SunMedium, Target, Users, Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Deal = { id: number; title: string; company: string; value: number; owner: string; probability: number; priority: string }
type Lead = { id: number; name: string; company: string; email: string; status: string; score: number; owner: string; source: string }
type NavEntry = [string, string, LucideIcon]

const navGroups: { title: string; items: NavEntry[] }[] = [
  { title: 'Workspace', items: [
    ['Overview', '/', LayoutDashboard], ['Leads', '/leads', Target], ['Contacts', '/contacts', Users], ['Companies', '/companies', Building2], ['Deals', '/deals', CircleDollarSign], ['Activities', '/activities', Activity],
  ] },
  { title: 'Insights', items: [['Analytics', '/analytics', BarChart3], ['Reports', '/reports', FileText]] },
]
const leads: Lead[] = [
  { id: 1, name: 'Maya Chen', company: 'Northstar Labs', email: 'maya@northstarlabs.com', status: 'Qualified', score: 92, owner: 'AM', source: 'Inbound' },
  { id: 2, name: 'Elliot Brooks', company: 'Vertex Systems', email: 'elliot@vertex.io', status: 'Contacted', score: 76, owner: 'JR', source: 'Referral' },
  { id: 3, name: 'Priya Shah', company: 'Lumen Finance', email: 'priya@lumen.finance', status: 'New', score: 64, owner: 'SK', source: 'Website' },
  { id: 4, name: 'Noah Williams', company: 'Orbit Commerce', email: 'noah@orbitcommerce.co', status: 'Nurturing', score: 58, owner: 'OL', source: 'Event' },
  { id: 5, name: 'Sofia Rodriguez', company: 'Acme Industries', email: 'sofia@acme.com', status: 'Qualified', score: 88, owner: 'AM', source: 'Inbound' },
]
const seedDeals: Deal[] = [
  { id: 1, title: 'Enterprise expansion', company: 'Acme Industries', value: 245000, owner: 'AM', probability: 72, priority: 'High' },
  { id: 2, title: 'Platform rollout', company: 'Northstar Labs', value: 180000, owner: 'JR', probability: 58, priority: 'Medium' },
  { id: 3, title: 'Data workflow', company: 'Vertex Systems', value: 92000, owner: 'SK', probability: 42, priority: 'Medium' },
  { id: 4, title: 'Team plan', company: 'Lumen Finance', value: 68000, owner: 'OL', probability: 81, priority: 'High' },
  { id: 5, title: 'Renewal + add-ons', company: 'Orbit Commerce', value: 132000, owner: 'AM', probability: 64, priority: 'Low' },
]
const stages = ['Discovery', 'Proposal', 'Negotiation', 'Contract sent']
const stageValues: Record<string, number[]> = { Discovery: [2, 4], Proposal: [0, 1], Negotiation: [1, 2], 'Contract sent': [3] }

export default function App() {
  return <Routes><Route path="*" element={<Workspace />} /></Routes>
}

function Workspace() {
  const [query, setQuery] = useState('')
  const [deals, setDeals] = useState(seedDeals)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const location = useLocation()
  const navigate = useNavigate()
  const activeLabel: string = navGroups.flatMap((group) => group.items).find((item) => item[1] === location.pathname)?.[0] ?? 'Overview'
  const filteredLeads = useMemo(() => leads.filter((lead) => `${lead.name} ${lead.company} ${lead.email}`.toLowerCase().includes(query.toLowerCase())), [query])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const moveDeal = (id: number, direction: number) => {
    setDeals((current) => current.map((deal) => deal.id === id ? { ...deal, probability: Math.max(20, Math.min(95, deal.probability + direction * 10)) } : deal))
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Zap size={17} fill="currentColor" /></span><span>Nexus<span className="brand-accent">CRM</span></span></div>
      <div className="workspace-switcher"><div className="workspace-icon">A</div><div><strong>Acme Inc.</strong><span>Sales workspace</span></div><ChevronDown size={15} /></div>
      <nav className="primary-nav">{navGroups.map((group) => <div key={group.title}><p className={`nav-label ${group.title === 'Insights' ? 'nav-label-spaced' : ''}`}>{group.title}</p>{group.items.map(([label, path, Icon]) => <NavLink className="nav-item" to={path as string} key={path as string}><Icon size={18} /><span>{label as string}</span>{label === 'Leads' && <span className="nav-count">24</span>}</NavLink>)}</div>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item"><Settings size={18} /><span>Settings</span></button><div className="user-card"><div className="avatar avatar-coral">JD</div><div><strong>Jordan Davis</strong><span>Admin</span></div><MoreHorizontal size={16} /></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="breadcrumb"><span>Workspace</span><span className="slash">/</span><strong>{activeLabel}</strong></div><div className="topbar-actions"><div className="search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anything..." /><kbd><Command size={11} /> K</kbd></div><button type="button" className="icon-button theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
      </button><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><div className="avatar avatar-teal">JD</div></div></header>
      <div className="content-wrap"><Routes>
        <Route path="/" element={<Overview navigate={navigate} />} />
        <Route path="/leads" element={<LeadsPage leads={filteredLeads} query={query} />} />
        <Route path="/deals" element={<DealsPage deals={deals} moveDeal={moveDeal} />} />
        <Route path="*" element={<ComingSoon label={activeLabel} />} />
      </Routes></div>
    </main>
  </div>
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: ReactNode; description: string; action?: ReactNode }) { return <section className="page-heading"><div><div className="eyebrow"><Sparkles size={14} /> {eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</section> }
function MetricCard({ label, value, change, positive = true, icon, tone }: { label: string; value: string; change: string; positive?: boolean; icon: React.ReactNode; tone: string }) { return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><div className="metric-label">{label}<span className={positive ? 'positive' : 'neutral'}>{positive ? '↑' : '•'} {change}</span></div><strong className="metric-value">{value}</strong><span className="metric-caption">vs. last month</span></div> }
function Overview({ navigate }: { navigate: (path: string) => void }) { return <><PageHeading eyebrow="Monday, September 25, 2026" title={<>Good morning, Jordan <span>✦</span></>} description="Here is what is happening across your sales floor today." action={<button className="primary-button" onClick={() => navigate('/leads')}><Plus size={17} /> Add new <ChevronDown size={14} /></button>} /><section className="metric-grid"><MetricCard label="Total pipeline" value="$2.84m" change="18.2%" icon={<CircleDollarSign />} tone="blue" /><MetricCard label="Won this month" value="$184k" change="12.6%" icon={<ArrowUpRight />} tone="green" /><MetricCard label="Win rate" value="24.8%" change="3.1%" icon={<Target />} tone="purple" /><MetricCard label="Open activities" value="126" change="8.4%" positive={false} icon={<Activity />} tone="orange" /></section><section className="dashboard-grid"><PipelinePreview /><ActivityPreview /></section><section className="bottom-grid"><div className="panel focus-panel"><div className="panel-heading"><div><h2>Today&apos;s focus</h2><p>Keep your momentum going</p></div><CalendarDays size={19} className="heading-icon" /></div><div className="focus-stat"><div className="focus-ring"><span>68%</span></div><div><strong>9 of 13 tasks complete</strong><p>You&apos;re ahead of your daily average.</p></div></div><div className="progress-line"><span /></div></div><div className="panel insight-panel"><div className="insight-icon"><Sparkles size={19} /></div><div><span className="eyebrow">Nexus insight</span><h2>Deals are moving faster</h2><p>Your average sales cycle is down <strong>4 days</strong> this month. Keep leaning into your proposal follow-ups.</p></div><ArrowUpRight size={18} className="insight-arrow" /></div></section></> }
function PipelinePreview() { return <div className="panel pipeline-panel"><div className="panel-heading"><div><h2>Pipeline overview</h2><p>Deal movement by stage</p></div><NavLink className="text-button" to="/deals">View pipeline <ArrowUpRight size={15} /></NavLink></div><div className="pipeline-total"><div><span>Weighted pipeline</span><strong>$1,264,000</strong></div><div className="mini-chart">{[32, 48, 42, 70, 56, 86, 72, 100].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div></div><div className="stage-list">{stages.map((stage, index) => <div className="stage-row" key={stage}><div className={`stage-dot ${['cyan', 'blue', 'violet', 'coral'][index]}`} /><div className="stage-name">{stage}<span>{stageValues[stage].length + 3} deals</span></div><div className="stage-bar"><span className={['cyan', 'blue', 'violet', 'coral'][index]} style={{ width: `${40 + index * 15}%` }} /></div><strong>{['$480k', '$920k', '$1.14m', '$300k'][index]}</strong><MoreHorizontal size={17} className="muted-icon" /></div>)}</div></div> }
function ActivityPreview() { return <div className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Your team&apos;s latest updates</p></div><button className="round-button" aria-label="More activity"><MoreHorizontal size={18} /></button></div><div className="activity-list">{[['AM', 'Ava Mitchell', 'moved Acme Corp to Negotiation', '12 min ago', 'lavender'], ['JR', 'James Rivera', 'completed a call with Northstar', '48 min ago', 'peach'], ['SK', 'Sofia Kim', 'added a new lead from website', '2 hrs ago', 'mint'], ['OL', 'Owen Lee', 'sent proposal to Vertex Labs', '3 hrs ago', 'sky']].map(([initials, name, action, time, tone]) => <div className="activity-row" key={name}><div className={`avatar avatar-${tone}`}>{initials}</div><div className="activity-copy"><strong>{name}</strong><span>{action}</span><small><Clock3 size={12} /> {time}</small></div></div>)}</div><NavLink className="full-text-button" to="/activities">View all activity <ArrowUpRight size={15} /></NavLink></div> }
function LeadsPage({ leads: visibleLeads, query }: { leads: Lead[]; query: string }) { const [status, setStatus] = useState('All statuses'); return <><PageHeading eyebrow="Lead intelligence" title="Leads" description="Qualify demand and keep every opportunity moving." action={<button className="primary-button"><Plus size={17} /> New lead</button>} /><div className="list-toolbar"><div className="toolbar-title"><strong>{visibleLeads.length} leads</strong><span>Updated moments ago</span></div><div className="toolbar-actions"><button className="secondary-button"><Filter size={15} /> Filters</button><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>New</option><option>Contacted</option><option>Qualified</option><option>Nurturing</option></select><button className="secondary-button"><FileText size={15} /> Export</button></div></div><div className="table-panel"><table><thead><tr><th>Lead</th><th>Status</th><th>Score</th><th>Source</th><th>Owner</th><th>Last touch</th><th /></tr></thead><tbody>{visibleLeads.filter((lead) => status === 'All statuses' || lead.status === status).map((lead) => <tr key={lead.id}><td><div className="lead-person"><div className="avatar avatar-lavender">{lead.name.split(' ').map((part) => part[0]).join('')}</div><div><strong>{lead.name}</strong><span>{lead.company} · {lead.email}</span></div></div></td><td><span className={`status-badge ${lead.status.toLowerCase()}`}>{lead.status}</span></td><td><div className="score"><span style={{ width: `${lead.score}%` }} /><strong>{lead.score}</strong></div></td><td>{lead.source}</td><td><div className="small-avatar">{lead.owner}</div></td><td>Today, 10:42 AM</td><td><MoreHorizontal size={17} className="muted-icon" /></td></tr>)}</tbody></table>{visibleLeads.length === 0 && <div className="empty-state"><Search size={21} /><strong>No leads found</strong><span>Try a different search term.</span></div>}</div><div className="table-footer"><span>Showing {visibleLeads.length} of 24 leads</span><div><button disabled>Previous</button><button className="page-active">1</button><button>2</button><button>3</button><button>Next</button></div></div></> }
function DealsPage({ deals, moveDeal }: { deals: Deal[]; moveDeal: (id: number, direction: number) => void }) { return <><PageHeading eyebrow="Revenue workspace" title="Deals" description="See every opportunity, from first conversation to close." action={<button className="primary-button"><Plus size={17} /> New deal</button>} /><div className="deal-toolbar"><div className="pipeline-summary"><strong>$2.84m</strong><span>total pipeline · 42 open deals</span></div><div className="toolbar-actions"><button className="secondary-button"><Filter size={15} /> Filter</button><button className="secondary-button"><Users size={15} /> All owners <ChevronDown size={14} /></button></div></div><div className="kanban">{stages.map((stage, stageIndex) => <div className="kanban-column" key={stage}><div className="kanban-heading"><div><span className={`stage-dot ${['cyan', 'blue', 'violet', 'coral'][stageIndex]}`} /><strong>{stage}</strong><em>{stageValues[stage].length}</em></div><MoreHorizontal size={17} className="muted-icon" /></div>{stageValues[stage].map((dealIndex) => { const deal = deals[dealIndex]; return <article className="deal-card" key={deal.id}><div className="deal-card-top"><span className={`priority ${deal.priority.toLowerCase()}`}>{deal.priority}</span><MoreHorizontal size={15} className="muted-icon" /></div><h3>{deal.title}</h3><p>{deal.company}</p><div className="deal-value">${deal.value.toLocaleString()}</div><div className="deal-card-footer"><div className="small-avatar">{deal.owner}</div><span>{deal.probability}% likely</span><button aria-label="Move deal" onClick={() => moveDeal(deal.id, stageIndex === 0 ? 1 : -1)}><ArrowUpRight size={14} /></button></div></article>})}<button className="add-card"><Plus size={15} /> Add deal</button></div>)}</div></> }
function ComingSoon({ label }: { label: string }) { return <div className="empty-module"><div className="empty-module-icon"><Sparkles size={22} /></div><h1>{label}</h1><p>This module is scaffolded into the workspace and ready for the next data-backed phase.</p><button className="secondary-button"><Plus size={15} /> Create first record</button></div> }
