import { useMemo, useState } from 'react'
import { Icon, type IconName } from './icons'
import {
  adminChatLog,
  adminKpis,
  adminUsers,
  allStatuses,
  auditEntries,
  categories,
  demoReports,
  hierarchyTree,
  impactStats,
  knowledgeDocs,
  subCities,
  tinRecords,
  type AdminPageId,
  type DemoReport,
} from './data'
import { Button, DemoNote } from './ui'

const NAV: { id: AdminPageId; label: string; icon: IconName; cityOnly?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'reports', label: 'Reports Management', icon: 'file' },
  { id: 'officers', label: 'Officers', icon: 'users' },
  { id: 'taxpayers', label: 'TIN Registry', icon: 'database', cityOnly: true },
  { id: 'tin-flags', label: 'Flagged TINs', icon: 'flag' },
  { id: 'hierarchy', label: 'Hierarchy', icon: 'layers' },
  { id: 'analytics', label: 'Analytics', icon: 'chart' },
  { id: 'audit', label: 'Audit Logs', icon: 'list', cityOnly: true },
  { id: 'knowledge', label: 'Knowledge Base', icon: 'book', cityOnly: true },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'chat-log', label: 'Assistant', icon: 'sparkles' },
]

const PAGE_HEADERS: Record<AdminPageId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Reports submitted by citizens and where they stand · Addis Ababa' },
  reports: { title: 'Reports', subtitle: '6 matching' },
  officers: { title: 'Officers', subtitle: 'Field officers who sign in to the Officer App' },
  taxpayers: { title: 'TIN registry', subtitle: '4 matching' },
  'tin-flags': { title: 'Flagged TINs', subtitle: 'TINs that officers reported as illegally used' },
  hierarchy: { title: 'Hierarchy', subtitle: 'City bureau, sub-city offices and woreda offices, and who is responsible for each' },
  analytics: { title: 'Analytics', subtitle: 'Reports submitted in the last 30 days' },
  audit: { title: 'Audit Log', subtitle: 'Record of staff actions: who, what and when. Entries cannot be edited.' },
  knowledge: { title: 'Knowledge base', subtitle: 'The documents the chat assistant answers from' },
  settings: { title: 'Settings', subtitle: 'Your account and the admin accounts below your level' },
  'chat-log': { title: 'Assistant conversations', subtitle: 'Questions asked, answers given and the documents cited' },
}

const pageInfo: Record<AdminPageId, string> = {
  dashboard: 'Four KPI tiles, category/stage breakdowns, a hand-drawn SVG trend chart and recent staff activity.',
  reports: 'Searchable, filterable report table with stage, category, office and officer filters mirrored in the URL hash.',
  officers: 'Officer accounts, active-case counts, deactivation and the phone/PIN used for the Officer App.',
  taxpayers: 'The registry that TIN lookups are checked against, with status, import and record editing.',
  'tin-flags': 'Officer-submitted TIN flags, their review state and the decision notes added by staff.',
  hierarchy: 'City → sub-city → woreda structure with assigned admins, officer counts and open reports.',
  analytics: 'Time-range controls, priority/response tiles, CSV export and breakdown charts.',
  audit: 'Immutable staff-action log with filters, action tags and CSV export.',
  knowledge: 'RAG source documents with passage counts and embedding progress.',
  settings: 'Admin accounts across the bureau hierarchy, including view-only access and level hints.',
  'chat-log': 'Back-office view of assistant questions, answers and retrieved sources (demo showcase view).',
}

interface OfficerRow {
  name: string
  phone: string
  title: string
  office: string
  unit: string
  cases: number
  status: 'Active' | 'Deactivated'
  added: string
}

const officerRows: OfficerRow[] = [
  { name: 'Demo Field Officer', phone: '0911223344', title: 'Tax Inspector', office: 'Bole / Woreda 03', unit: 'Audit Unit', cases: 3, status: 'Active', added: '04 Nov 2026' },
  { name: 'Demo Investigation Officer', phone: '0911223355', title: 'Investigator', office: 'Lideta / Woreda 02', unit: 'Revenue Protection', cases: 2, status: 'Active', added: '12 Oct 2026' },
  { name: 'Demo Junior Officer', phone: '0911223366', title: 'Field Assistant', office: 'Arada / Woreda 05', unit: 'Ethics & Discipline', cases: 0, status: 'Active', added: '28 Sep 2026' },
  { name: 'Demo Retired Officer', phone: '0911223377', title: 'Tax Inspector', office: 'Kirkos / Woreda 01', unit: 'Audit Unit', cases: 0, status: 'Deactivated', added: '02 Jun 2026' },
]

const roles = ['System Super Admin', 'City Bureau Admin', 'Sub-City Admin', 'Woreda Admin'] as const
type Role = typeof roles[number]

function Breakdown({ title, rows }: { title: string; rows: { key: string; count: number }[] }) {
  const max = Math.max(...rows.map((row) => row.count), 1)
  return (
    <section className="admin-card">
      <h2>{title}</h2>
      <div className="breakdown">
        {rows.map((row) => (
          <div key={row.key} className="breakdown-row">
            <span>{row.key}</span>
            <div className="breakdown-track"><i style={{ width: `${(row.count / max) * 100}%` }} /></div>
            <strong>{row.count}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

function LineChart() {
  const points = [4, 6, 5, 9, 7, 11, 8, 13, 10, 14, 12, 16, 15, 18, 17, 20, 19, 22, 21, 24]
  const max = 25
  const path = points.map((value, i) => `${i === 0 ? 'M' : 'L'} ${34 + i * (590 / (points.length - 1))} ${212 - (value / max) * 190}`).join(' ')
  return (
    <section className="admin-card">
      <h2>Reports over time (30 days)</h2>
      <svg className="line-chart" viewBox="0 0 640 240" role="img" aria-label="Reports over time">
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1="34" x2="626" y1={22 + i * 47.5} y2={22 + i * 47.5} stroke="#eef2f6" />)}
        <path d={path} fill="none" stroke="#145491" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="34" cy={212 - (points[0] / max) * 190} r="4" fill="#145491" />
        <circle cx="624" cy={212 - (points[points.length - 1] / max) * 190} r="4" fill="#145491" />
        <text x="34" y="236">30 days ago</text>
        <text x="560" y="236">Today</text>
      </svg>
    </section>
  )
}

export function AdminDemo() {
  const [page, setPage] = useState<AdminPageId>('dashboard')
  const [detail, setDetail] = useState<DemoReport | null>(null)
  const [role, setRole] = useState<Role>('System Super Admin')
  const [readOnly, setReadOnly] = useState(false)
  const [flash, setFlash] = useState('')
  const [reportSearch, setReportSearch] = useState('')
  const [reportStage, setReportStage] = useState('All stages')
  const [reportCategory, setReportCategory] = useState('All categories')
  const [modal, setModal] = useState<string | null>(null)
  const [auditSearch, setAuditSearch] = useState('')
  const [analyticsRange, setAnalyticsRange] = useState<'week' | 'month' | 'year'>('month')

  const cityLevel = role === 'System Super Admin' || role === 'City Bureau Admin'
  const canEdit = !readOnly
  const visibleNav = NAV.filter((item) => cityLevel || !item.cityOnly)

  const showFlash = (message: string) => { setFlash(message); window.setTimeout(() => setFlash(''), 2600) }
  const openPage = (id: AdminPageId) => { setPage(id); setDetail(null); setFlash('') }

  const filteredReports = demoReports.filter((report) => {
    const matchesSearch = `${report.reference} ${report.category} ${report.location} ${report.description}`.toLowerCase().includes(reportSearch.toLowerCase())
    const matchesStage = reportStage === 'All stages' || report.status === reportStage
    const matchesCategory = reportCategory === 'All categories' || report.category === reportCategory
    return matchesSearch && matchesStage && matchesCategory
  })

  const pageBody = useMemo(() => {
    if (detail) {
      return (
        <>
          <div className="admin-back"><Icon name="arrowLeft" size={16} /> <button onClick={() => setDetail(null)}>Reports</button></div>
          <div className="page-header"><div><h1>{detail.category}</h1><p className="mono">{detail.reference}</p></div></div>
          <div className="chip-row chip-row--spaced"><StatusBadge status={detail.status} /><span className="admin-badge admin-badge--neutral">Normal priority</span></div>
          <div className="admin-detail-grid">
            <div>
              <section className="admin-card"><h2>Description</h2><p className="prose">{detail.description}</p></section>
              <section className="admin-card">
                <h2>Details</h2>
                <dl className="facts-grid">
                  <dt>Seller's TIN</dt><dd className="mono">—</dd>
                  <dt>Location</dt><dd>{detail.location} · <button className="admin-link" onClick={() => showFlash('Demo only: map link is not opened')}>Open map</button></dd>
                  <dt>Office</dt><dd>City bureau (not sent to a sub-city yet)</dd>
                  <dt>Reported by</dt><dd>{detail.anonymous ? 'Anonymous citizen' : 'Demo Citizen'}</dd>
                  <dt>Submitted</dt><dd>24 Nov 2026, 10:30</dd>
                  <dt>Assigned to</dt><dd>{detail.assignedUnit ? `Demo Field Officer · since 24 Nov 2026` : 'Not assigned yet'}</dd>
                </dl>
              </section>
              <section className="admin-card"><h2>Evidence</h2><div className="admin-evidence"><span className="evidence-file">FILE</span><span>receipt.jpg · 0.8 MB</span><span className="evidence-file">FILE</span><span>voice.m4a · 0.4 MB</span></div></section>
              <section className="admin-card">
                <h2>History</h2>
                <div className="admin-timeline">
                  {detail.timeline.map((step, i) => <div key={step.title} className={`admin-timeline-row${step.date ? '' : ' admin-timeline-row--pending'}`}><StatusBadge status={i === 0 ? 'Submitted' : step.title === 'Resolved' ? 'Resolved' : step.title === 'Under Review' ? 'Under Review' : 'Assigned to Investigator'} /><div><strong>{step.title}</strong><small>{step.date ?? 'Pending'}</small></div></div>)}
                </div>
              </section>
            </div>
            <div>
              <section className="admin-card"><h2>Send to an office</h2><select defaultValue="City bureau"><option>City bureau</option>{subCities.slice(0, 4).map((city) => <option key={city}>{city} Sub-City</option>)}</select><Button full className="admin-action" onClick={() => showFlash('Demo only: routing change is not saved')}>Send</Button></section>
              <section className="admin-card"><h2>Assign to an officer</h2><select defaultValue="Demo Field Officer"><option>Demo Field Officer</option><option>Demo Investigation Officer</option></select><select defaultValue="Normal"><option>Low</option><option>Normal</option><option>High</option></select><textarea rows={3} placeholder="What the officer is expected to do. Only staff see this." /><Button full className="admin-action" onClick={() => showFlash('Demo only: assignment is not saved')}>Assign</Button></section>
              <section className="admin-card"><h2>Update the reporter</h2><select defaultValue={detail.status}>{allStatuses.map((status) => <option key={status}>{status}</option>)}</select><textarea rows={3} placeholder="Shown in the citizen app with this update." /><Button full className="admin-action" onClick={() => showFlash('Demo only: status update is not sent')}>Send update</Button></section>
            </div>
          </div>
        </>
      )
    }

    switch (page) {
      case 'dashboard':
        return (
          <>
            <div className="admin-tiles">
              {adminKpis.map((kpi) => (
                <button key={kpi.label} className="admin-tile" onClick={() => openPage('reports')}>
                  <span>{kpi.label}</span><strong>{kpi.value}</strong><small>{kpi.detail}</small>
                </button>
              ))}
            </div>
            <div className="admin-grid-2"><Breakdown title="Reports by category" rows={impactStats.byCategory} /><LineChart /></div>
            <Breakdown title="Reports by sub-city" rows={subCities.slice(0, 6).map((city, i) => ({ key: city, count: [24, 18, 15, 21, 12, 9][i] }))} />
            <section className="admin-card">
              <div className="admin-card-head"><h2>Recent activity</h2><button className="admin-link" onClick={() => openPage('audit')}>View all</button></div>
              {auditEntries.slice(0, 4).map((entry, i) => (
                <div key={i} className="activity-row"><div><strong>{entry.target}</strong><p>{entry.action} · {entry.time}</p><small className="muted">by {entry.actor}</small></div><span className="admin-tag">{entry.action.toUpperCase()}</span></div>
              ))}
            </section>
          </>
        )

      case 'reports':
        return (
          <>
            <section className="admin-card filters">
              <input value={reportSearch} onChange={(e) => setReportSearch(e.target.value)} placeholder="Search reference, TIN, location or description" />
              <select value={reportStage} onChange={(e) => setReportStage(e.target.value)}><option>All stages</option>{allStatuses.map((status) => <option key={status}>{status}</option>)}</select>
              <select value={reportCategory} onChange={(e) => setReportCategory(e.target.value)}><option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>
              <select defaultValue="All offices"><option>All offices</option><option>City bureau (not sent down yet)</option>{subCities.slice(0, 4).map((city) => <option key={city}>{city} Sub-City</option>)}</select>
              <select defaultValue="Any officer"><option>Any officer</option><option>Not assigned</option><option>Demo Field Officer</option></select>
            </section>
            <div className="admin-table-card">
              <table className="admin-table">
                <thead><tr><th>Reference</th><th>Category</th><th>Location</th><th>Office</th><th>Stage</th><th>Officer</th><th>Submitted</th><th /></tr></thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.reference} onClick={() => setDetail(report)}>
                      <td className="mono admin-link">{report.reference}</td>
                      <td>{report.category}</td>
                      <td className="muted">{report.location}</td>
                      <td>City bureau</td>
                      <td><div className="chip-row"><StatusBadge status={report.status} /></div></td>
                      <td>{report.assignedUnit ? 'Demo Field Officer' : 'Not assigned'}</td>
                      <td className="muted">24 Nov 2026</td>
                      <td className="muted">{detail ? 'Open' : 'Open'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredReports.length && <p className="admin-empty">No reports match these filters.</p>}
              <div className="admin-pager"><span>Previous</span><span>Page 1 of 1</span><span>Next</span></div>
            </div>
          </>
        )

      case 'officers':
        return (
          <>
            <div className="page-actions-inline"><Button small onClick={() => canEdit ? setModal('Add an officer') : showFlash('View-only demo account')}>Add officer</Button></div>
            <div className="admin-table-card">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Phone</th><th>Title</th><th>Office</th><th>Unit</th><th>Active cases</th><th>Status</th><th>Added</th><th /></tr></thead>
                <tbody>{officerRows.map((officer) => (
                  <tr key={officer.phone}>
                    <td><strong>{officer.name}</strong></td><td className="mono">{officer.phone}</td><td>{officer.title}</td><td>{officer.office}</td><td className="muted">{officer.unit}</td>
                    <td><button className="admin-link" onClick={() => openPage('reports')}>{officer.cases}</button></td>
                    <td><span className={`admin-badge admin-badge--${officer.status === 'Active' ? 'success' : 'neutral'}`}>{officer.status}</span></td>
                    <td className="muted">{officer.added}</td>
                    <td><button className="admin-link" onClick={() => canEdit ? setModal('Edit officer') : showFlash('View-only demo account')}>Edit</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )

      case 'taxpayers':
        return (
          <>
            <div className="page-actions-inline"><Button small variant="outline" onClick={() => setModal('Import a taxpayer list')}>Import file</Button><Button small onClick={() => canEdit ? setModal('Add a TIN') : showFlash('View-only demo account')}>Add TIN</Button></div>
            <section className="admin-card filters"><input placeholder="Search TIN, owner or business name" /><select defaultValue="All statuses"><option>All statuses</option><option>Active</option><option>Suspended</option><option>Cancelled</option></select></section>
            <div className="admin-table-card">
              <table className="admin-table">
                <thead><tr><th>TIN</th><th>Owner</th><th>Business</th><th>Address</th><th>Phone</th><th>Status</th><th>Updated</th><th /></tr></thead>
                <tbody>{tinRecords.map((record) => (
                  <tr key={record.tin}>
                    <td className="mono">{record.tin}</td><td>{record.ownerName}</td><td>{record.businessName}<br /><small className="muted">{record.category}</small></td><td className="muted">{record.address}</td><td className="mono">{record.phoneNumber}</td>
                    <td><div className="chip-row"><span className={`admin-badge admin-badge--${record.status === 'ACTIVE' ? 'success' : 'warning'}`}>{record.registryStatus}</span>{record.status === 'ILLEGAL' && <span className="admin-badge admin-badge--danger">Illegal</span>}</div>{record.reason && <small className="muted">{record.reason}</small>}</td>
                    <td className="muted">12 Nov 2026</td><td><button className="admin-link" onClick={() => setModal('Edit TIN record')}>Edit</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )

      case 'tin-flags':
        return (
          <>
            <div className="page-actions-inline"><select defaultValue="All flags"><option>All flags</option><option>Waiting for review</option><option>Illegal</option><option>Rejected</option></select></div>
            <div className="admin-table-card">
              <table className="admin-table">
                <thead><tr><th>TIN</th><th>Registry</th><th>Reason</th><th>Flagged by</th><th>Status</th><th /></tr></thead>
                <tbody>
                  <tr><td className="mono">1111111111</td><td>Placeholder Enterprises</td><td>TIN used on a receipt that did not match the business name.</td><td>Demo Field Officer<br /><small className="muted">Bole / Woreda 03 · 20 Nov 2026</small></td><td><span className="admin-badge admin-badge--warning">Waiting for review</span></td><td><button className="admin-link" onClick={() => setModal('Label TIN 1111111111 illegal')}>Label illegal</button></td></tr>
                  <tr><td className="mono">0987654321</td><td>Example Retail Shop</td><td>Seller claimed the TIN was active after cancellation.</td><td>Demo Investigation Officer<br /><small className="muted">Lideta / Woreda 02 · 18 Nov 2026</small></td><td><span className="admin-badge admin-badge--danger">Illegal</span></td><td><button className="admin-link" onClick={() => showFlash('Demo only: label removal is not saved')}>Remove label</button></td></tr>
                </tbody>
              </table>
            </div>
          </>
        )

      case 'hierarchy':
        return (
          <>
            <div className="page-actions-inline"><Button small onClick={() => canEdit ? setModal('Add a sub-city') : showFlash('View-only demo account')}>Add sub-city</Button></div>
            {hierarchyTree.map((city) => (
              <section key={city.name} className="admin-card hierarchy-card">
                <span className="unit-kind">City bureau</span><h2>{city.name}</h2>
                <div className="hierarchy-summary"><span className="admin-badge admin-badge--success">Demo Super Admin · System Super Admin</span><span>8 officer(s)</span><span>64 open report(s)</span></div>
                <div className="tree-children">
                  {city.children.map((sub) => (
                    <div key={sub.name} className="tree-node">
                      <span className="unit-kind">Sub-city office</span><h3>{sub.name} Sub-City</h3>
                      <div className="hierarchy-summary"><span className="admin-badge admin-badge--info">Demo Sub-City Admin · Sub-City Admin</span><span>3 officer(s)</span><span>18 open report(s)</span></div>
                      <div className="woredas">
                        {sub.children.map((woreda) => (
                          <div key={woreda.name} className="woreda-node">
                            <span className="unit-kind">Woreda office</span><strong>{woreda.name}</strong>
                            <div className="hierarchy-summary"><span className="admin-badge admin-badge--neutral">No admin assigned</span><span>1 officer(s)</span><span>7 open report(s)</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </>
        )

      case 'analytics':
        return (
          <>
            <div className="page-actions-inline">
              <div className="segmented">
                {([['week', 'This week'], ['month', 'This month'], ['year', 'This year']] as const).map(([id, text]) => <button key={id} className={`segment${analyticsRange === id ? ' segment--active' : ''}`} onClick={() => setAnalyticsRange(id)}>{text}</button>)}
              </div>
              <Button small variant="outline" onClick={() => showFlash('Demo only: CSV export is not downloaded')}>Export</Button>
            </div>
            <div className="admin-tiles">
              <div className="admin-tile"><span>Total reports</span><strong>{analyticsRange === 'week' ? '32' : analyticsRange === 'month' ? '128' : '1,482'}</strong><small>fictional demo figure</small></div>
              <div className="admin-tile"><span>High priority reports</span><strong>9</strong><small>flagged for urgent action</small></div>
              <div className="admin-tile"><span>Avg. response time</span><strong>6.5 h</strong><small>−15 min vs last month</small></div>
              <div className="admin-tile"><span>Top location</span><strong className="tile-text">Bole</strong><small>24 reports</small></div>
            </div>
            <LineChart />
            <div className="admin-grid-2"><Breakdown title="Reports by stage" rows={impactStats.byStatus} /><Breakdown title="Reports by category" rows={impactStats.byCategory} /></div>
          </>
        )

      case 'audit':
        return (
          <>
            <section className="admin-card filters"><input value={auditSearch} onChange={(e) => setAuditSearch(e.target.value)} placeholder="Filter by actor, record or details" /><Button small variant="outline" onClick={() => showFlash('Demo only: CSV export is not downloaded')}>Export CSV</Button></section>
            <div className="chip-row chip-row--spaced">{['LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'ASSIGN', 'STATUS', 'LOOKUP'].map((action) => <span key={action} className={`admin-tag${action === 'ASSIGN' ? ' admin-tag--active' : ''}`}>{action}</span>)}</div>
            <div className="admin-table-card">
              {auditEntries.filter((entry) => `${entry.actor} ${entry.target} ${entry.action}`.toLowerCase().includes(auditSearch.toLowerCase())).map((entry, i) => (
                <div key={i} className="activity-row activity-row--table"><span className="admin-tag">{entry.action.toUpperCase()}</span><div><strong>{entry.actor}</strong> <span className="muted">(Staff)</span><p className="mono">{entry.target}</p><p>{entry.action} · from 192.0.2.{10 + i}</p></div><span className="muted mono">{entry.time}</span></div>
              ))}
              <div className="admin-pager"><span>Previous</span><span>Page 1 of 1</span><span>Next</span></div>
            </div>
          </>
        )

      case 'knowledge':
        return (
          <>
            <div className="page-actions-inline"><Button small onClick={() => canEdit ? setModal('Add a document') : showFlash('View-only demo account')}>Add document</Button></div>
            <div className="admin-table-card">
              <table className="admin-table">
                <thead><tr><th>Document</th><th>Passages</th><th>Indexed</th><th>Updated</th><th /></tr></thead>
                <tbody>{knowledgeDocs.map((doc) => (
                  <tr key={doc.title}><td><strong>{doc.title}</strong><br /><small className="muted">{doc.source}</small></td><td>{doc.passages}</td><td>{doc.embedded === doc.passages ? <span className="admin-badge admin-badge--success">Ready</span> : <span className="admin-badge admin-badge--warning">{doc.embedded} of {doc.passages}</span>}</td><td className="muted">{doc.updated}</td><td><button className="admin-link" onClick={() => showFlash('Demo only: document is not removed')}>Remove</button></td></tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )

      case 'settings':
        return (
          <>
            <div className="page-actions-inline"><Button small onClick={() => canEdit ? setModal('Add an admin') : showFlash('View-only demo account')}>Add admin</Button></div>
            <h2 className="admin-section-heading">Team</h2>
            <div className="admin-table-card">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Level</th><th>Office</th><th>Status</th><th>Added</th><th /></tr></thead>
                <tbody>{adminUsers.map((user, i) => (
                  <tr key={user.name}><td><strong>{user.name}</strong>{i === 0 && <span className="muted"> (you)</span>}</td><td className="muted">{user.name.toLowerCase().replace(/ /g, '.')}@demo.invalid</td><td>{user.role}{user.status === 'View only' && <span className="muted"> · view only</span>}</td><td>{user.office}</td><td><span className="admin-badge admin-badge--success">Active</span></td><td className="muted">12 Jan 2026</td><td>{i !== 0 && <button className="admin-link" onClick={() => setModal('Edit admin')}>Edit</button>}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </>
        )

      case 'chat-log':
        return (
          <div className="admin-table-card">
            <table className="admin-table">
              <thead><tr><th>Time</th><th>Question</th><th>Answer</th><th>Sources</th></tr></thead>
              <tbody>{adminChatLog.map((entry) => (
                <tr key={entry.time}><td className="muted mono">{entry.time}</td><td><strong>{entry.question}</strong></td><td className="muted">{entry.answer}</td><td><div className="chip-row">{entry.sources.split(', ').map((source) => <span key={source} className="admin-badge admin-badge--info">{source}</span>)}</div></td></tr>
              ))}</tbody>
            </table>
          </div>
        )
    }
  }, [page, detail, role, readOnly, reportSearch, reportStage, reportCategory, auditSearch, analyticsRange, canEdit, showFlash, openPage])

  return (
    <div className="showcase-grid showcase-grid--admin">
      <div className="admin-wrap">
        <div className="browser-chrome">
          <div className="browser-dots"><i /><i /><i /></div>
          <div className="browser-url"><Icon name="lock" size={12} /> addisabarevenue.possibletechplc.com/admin/#/{page === 'dashboard' ? '' : page}</div>
          <span className="browser-label"><DemoNote small /></span>
        </div>
        <div className="admin-shell">
          <aside className="admin-sidebar">
            <div className="admin-brand"><img src="assets/logo.png" alt="" /><span><strong>AARB Admin</strong><small>Revenues Bureau</small></span></div>
            <nav>
              {visibleNav.map((item) => (
                <button key={item.id} className={`admin-nav-item${page === item.id ? ' admin-nav-item--active' : ''}`} onClick={() => openPage(item.id)}>
                  <Icon name={item.icon} size={16} />{item.label}
                </button>
              ))}
            </nav>
            <button className="admin-logout" onClick={() => showFlash('Demo only: no session is active')}><Icon name="logout" size={15} /> Logout</button>
          </aside>
          <main className="admin-main">
            <div className="admin-userbar"><span className="admin-avatar">{role.split(' ').slice(0, 2).map((word) => word[0]).join('')}</span><span><strong>{role}</strong><small>{role}{readOnly ? ' (view only)' : ''} · Addis Ababa</small></span></div>
            <div className="page-header"><div><h1>{detail ? 'Report detail' : PAGE_HEADERS[page].title}</h1><p>{detail ? detail.reference : PAGE_HEADERS[page].subtitle}</p></div></div>
            {flash && <div className="admin-toast">{flash}</div>}
            {pageBody}
          </main>
        </div>
      </div>

      <aside className="showcase-panel">
        <div className="panel-eyebrow"><Icon name="sparkles" size={15} /> Interactive walkthrough</div>
        <h3>Web admin panel</h3>
        <p className="panel-lead">The staff side of the platform. Browse every page, switch roles to see hierarchy-based visibility, and open a report to inspect its detail view.</p>
        <div className="screen-picker">
          {NAV.map((item) => (
            <button key={item.id} className={page === item.id ? 'picker-item picker-item--active' : 'picker-item'} onClick={() => openPage(item.id)}>
              <span>{item.label}{item.cityOnly && <em> · city only</em>}</span><Icon name="chevronRight" size={14} />
            </button>
          ))}
        </div>
        <div className="panel-detail">
          <span className="panel-detail-label">CURRENT PAGE</span>
          <strong>{PAGE_HEADERS[page].title}</strong>
          <p>{pageInfo[page]}</p>
        </div>
        <div className="panel-role">
          <span><Icon name="users" size={16} /> View as</span>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>{roles.map((item) => <option key={item}>{item}</option>)}</select>
          <label><input type="checkbox" checked={readOnly} onChange={(e) => setReadOnly(e.target.checked)} /> View only</label>
        </div>
        <div className="panel-chips"><DemoNote small /><span>Vite</span><span>React 18</span><span>TypeScript</span><span>HashRouter</span><span>SVG charts</span></div>
      </aside>

      {modal && (
        <div className="admin-modal-backdrop" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head"><h3>{modal}</h3><button onClick={() => setModal(null)}><Icon name="close" size={18} /></button></div>
            <div className="admin-modal-body">
              <label>Full name<input placeholder="Demo name" /></label>
              <label>Phone / email<input placeholder="09XXXXXXXX or name@demo.invalid" /></label>
              <label>Level or office<select><option>City bureau</option>{subCities.slice(0, 4).map((city) => <option key={city}>{city} Sub-City</option>)}</select></label>
              <p className="muted">This modal is part of the walkthrough. Nothing is saved and no real account is created.</p>
            </div>
            <div className="admin-modal-actions"><Button small variant="outline" onClick={() => setModal(null)}>Cancel</Button><Button small onClick={() => { setModal(null); showFlash('Demo only: nothing was saved') }}>Save</Button></div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const tone = status === 'Submitted' ? 'info' : status === 'Under Review' ? 'warning' : status === 'Assigned to Investigator' ? 'success' : status === 'Resolved' ? 'neutral' : 'info'
  return <span className={`admin-badge admin-badge--${tone}`}>{status}</span>
}
