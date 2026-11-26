import { Icon, type IconName } from './icons'
import { DemoNote } from './ui'

const layers: { title: string; subtitle: string; icon: IconName; items: string[] }[] = [
  {
    title: 'Citizen app',
    subtitle: 'Flutter 3.44 · Material 3 · Bloc',
    icon: 'phone',
    items: ['Anonymous reporting', 'Attachments + voice notes', 'TIN verification', 'Case tracking', 'Impact stats', 'EN / AM / OM'],
  },
  {
    title: 'Officer app',
    subtitle: 'Flutter · GoRouter · Bloc',
    icon: 'briefcase',
    items: ['Assigned case queue', 'On-site map', 'Evidence viewer', 'Field notes + status', 'TIN flagging', 'Officer chat'],
  },
  {
    title: 'Admin panel',
    subtitle: 'Vite · React 18 · TypeScript',
    icon: 'grid',
    items: ['Report triage', 'Role hierarchy', 'Officer accounts', 'TIN registry', 'Knowledge base', 'Audit log'],
  },
]

const backend = [
  { icon: 'terminal' as IconName, title: 'NestJS 10 API', detail: 'Reports, citizens, officers, TIN, chat, knowledge, notifications and admin modules.' },
  { icon: 'database' as IconName, title: 'PostgreSQL 16', detail: 'Relational case data, hierarchy, registry records and embedded knowledge passages.' },
  { icon: 'sparkles' as IconName, title: 'Gemini + RAG', detail: 'Answers grounded in bureau documents, with citations and optional live case context.' },
  { icon: 'bell' as IconName, title: 'Redis + push', detail: 'Cache/queue layer and Firebase Cloud Messaging status notifications.' },
  { icon: 'lock' as IconName, title: 'Auth & audit', detail: 'Citizen device IDs, officer PIN login, admin roles and immutable staff-action logs.' },
  { icon: 'globe' as IconName, title: 'Docker + Nginx', detail: 'Multi-stage builds behind a reverse proxy on a VPS, with Swagger at /api/docs.' },
]

const apiGroups = [
  {
    title: 'Citizen',
    endpoints: ['POST /auth/register', 'POST /auth/login', 'POST /reports', 'GET /reports', 'GET /reports/track/:ref', 'GET /reports/stats', 'GET /tin/:tin', 'GET /notifications', 'POST /chat/message'],
  },
  {
    title: 'Officer',
    endpoints: ['POST /officer/auth/login', 'GET /officer/summary', 'GET /officer/reports', 'POST /officer/reports/:ref/accept', 'POST /officer/reports/:ref/updates', 'GET /officer/tin/:tin', 'POST /officer/tin/:tin/flags', 'GET /officer/notifications'],
  },
  {
    title: 'Admin',
    endpoints: ['POST /admin/auth/login', 'GET /admin/overview', 'GET /admin/reports', 'PATCH /admin/reports/:ref/assign', 'PATCH /admin/reports/:ref/status', 'GET /admin/admins', 'GET /admin/taxpayers', 'GET /admin/knowledge', 'GET /admin/audit-logs'],
  },
]

const capabilities = [
  ['Confidential reporting', true, true, true],
  ['Case status timeline', true, true, true],
  ['Evidence / media', true, true, true],
  ['AI assistant with citations', true, true, false],
  ['TIN verification', true, true, true],
  ['Field investigation tools', false, true, false],
  ['Hierarchy & role management', false, false, true],
  ['Knowledge base management', false, false, true],
]

const tree = `AddisAbabaRevenues/
├── apps/backend/        NestJS 10, TypeORM, PostgreSQL, Swagger
├── apps/admin_panel/    Vite + React staff console
├── apps/officer_app/    Flutter field-officer app
├── apps/mobile_app/     Flutter citizen app
├── docker-compose.yml   PostgreSQL 16 + Redis 7 + backend
├── .env.example
└── README.md`

export function Platform() {
  return (
    <section className="platform" id="platform">
      <div className="section-heading-block">
        <span className="eyebrow"><Icon name="layers" size={15} /> Under the hood</span>
        <h2>One backend, three front ends</h2>
        <p>The same case/workflow domain is exposed through a citizen app, a field-officer app and a role-aware staff console. This demo recreates the interfaces; the real platform runs on Docker behind Nginx.</p>
      </div>

      <div className="architecture">
        <div className="arch-clients">
          {layers.map((layer) => (
            <div key={layer.title} className="arch-card">
              <span className="arch-icon"><Icon name={layer.icon} size={21} /></span>
              <strong>{layer.title}</strong>
              <small>{layer.subtitle}</small>
              <ul>{layer.items.map((item) => <li key={item}><Icon name="check" size={12} />{item}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="arch-flow"><span /><Icon name="arrowRight" size={18} /><small>REST / JSON · Bearer + device identity</small></div>
        <div className="arch-core">
          <div className="arch-core-head"><Icon name="terminal" size={19} /><strong>NestJS API</strong><small>10 modules · Swagger at /api/docs</small></div>
          <div className="arch-services">
            {backend.map((service) => (
              <div key={service.title} className="arch-service"><Icon name={service.icon} size={17} /><span><strong>{service.title}</strong><small>{service.detail}</small></span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="platform-grid">
        <div className="platform-card">
          <h3>Capability matrix</h3>
          <table className="matrix-table">
            <thead><tr><th>Capability</th><th>Citizen</th><th>Officer</th><th>Admin</th></tr></thead>
            <tbody>
              {capabilities.map(([name, ...values]) => (
                <tr key={String(name)}>
                  <td>{name}</td>
                  {values.map((value, i) => <td key={i}>{value ? <Icon name="checkCircle" size={16} className="matrix-yes" /> : <span className="matrix-no">—</span>}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="platform-card">
          <h3>API surface</h3>
          <div className="api-groups">
            {apiGroups.map((group) => (
              <div key={group.title} className="api-group">
                <strong>{group.title}</strong>
                {group.endpoints.map((endpoint) => <code key={endpoint}>{endpoint}</code>)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="platform-grid platform-grid--lower">
        <div className="platform-card">
          <h3>Repository structure</h3>
          <pre className="repo-tree">{tree}</pre>
        </div>
        <div className="platform-card safety-card">
          <h3>Data safety in this demo</h3>
          <p>Every report, name, phone number, TIN, case note and chat answer on this site is fabricated for the walkthrough. No production API is called and no real bureau records are fetched.</p>
          <ul>
            <li><Icon name="check" size={15} /> Static fictional fixtures</li>
            <li><Icon name="check" size={15} /> Actions only show a local confirmation</li>
            <li><Icon name="check" size={15} /> No credentials or environment files</li>
            <li><Icon name="check" size={15} /> Safe to link from a public portfolio</li>
          </ul>
          <DemoNote />
        </div>
      </div>
    </section>
  )
}
