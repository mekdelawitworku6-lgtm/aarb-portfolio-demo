import { useState } from 'react'
import { AdminDemo } from './admin'
import { CitizenDemo } from './citizen'
import { siteConfig } from './config'
import { Icon, type IconName } from './icons'
import { OfficerDemo } from './officer'
import { Platform } from './platform'
import { DemoNote } from './ui'

const sections = [
  { id: 'overview', label: 'Overview', icon: 'grid' as IconName },
  { id: 'citizen', label: 'Citizen app', icon: 'phone' as IconName },
  { id: 'officer', label: 'Officer app', icon: 'briefcase' as IconName },
  { id: 'admin', label: 'Admin panel', icon: 'settings' as IconName },
  { id: 'platform', label: 'Platform', icon: 'layers' as IconName },
]

const overviewCards = [
  {
    target: 'citizen',
    eyebrow: '01 · Mobile',
    title: 'Citizen app',
    body: 'Confidential reporting, TIN checks, case tracking, AI help and public impact stats in English, Amharic and Afaan Oromoo.',
    icon: 'phone' as IconName,
    chips: ['Flutter 3', 'Bloc', 'Anonymous reports', 'Voice notes'],
  },
  {
    target: 'officer',
    eyebrow: '02 · Mobile',
    title: 'Officer app',
    body: 'Field-case queue, on-site map, evidence review, status actions and TIN flagging for bureau investigators.',
    icon: 'briefcase' as IconName,
    chips: ['GoRouter', 'OpenStreetMap', 'RAG chat', 'PIN login'],
  },
  {
    target: 'admin',
    eyebrow: '03 · Web',
    title: 'Admin panel',
    body: 'Role-aware case triage, officer management, TIN registry, hierarchy, knowledge base, analytics and audit log.',
    icon: 'settings' as IconName,
    chips: ['React 18', 'TypeScript', 'HashRouter', 'SVG charts'],
  },
  {
    target: 'platform',
    eyebrow: '04 · Backend',
    title: 'Platform & API',
    body: 'NestJS modules over PostgreSQL and Redis, with Gemini-powered retrieval, push notifications and Docker deployment.',
    icon: 'terminal' as IconName,
    chips: ['NestJS 10', 'PostgreSQL 16', 'Redis 7', 'Docker'],
  },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function App() {
  const [active, setActive] = useState('overview')

  const go = (id: string) => {
    setActive(id)
    window.history.replaceState(null, '', `#${id}`)
    scrollTo(id)
  }

  return (
    <div className="site">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand" onClick={() => go('overview')}>
            <img src="assets/logo.png" alt="" />
            <span><strong>AARB Platform</strong><small>Interactive portfolio demo</small></span>
          </button>
          <nav className="topnav">
            {sections.map((section) => (
              <button key={section.id} className={active === section.id ? 'topnav-item topnav-item--active' : 'topnav-item'} onClick={() => go(section.id)}>
                {section.label}
              </button>
            ))}
          </nav>
          <div className="topbar-actions"><DemoNote small /><a className="topbar-github" href={siteConfig.githubUrl} target="_blank" rel="noreferrer"><Icon name="external" size={15} /> Source</a></div>
        </div>
      </header>

      <main>
        <section className="hero" id="overview">
          <div className="hero-copy">
            <span className="hero-eyebrow"><Icon name="sparkles" size={15} /> Full-stack case management · portfolio walkthrough</span>
            <h1>Built for confidential reporting.<br /><em>Designed to show every screen.</em></h1>
            <p>An interactive demo of a multi-platform revenue bureau system: a citizen reporting app, a field-officer app and a role-aware web console, all connected to one NestJS API. Every record here is fictional and safe to share publicly.</p>
            <div className="hero-actions">
              <ButtonLike onClick={() => go('citizen')} icon="arrowRight">Explore the demo</ButtonLike>
              <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer" className="button button--outline"><Icon name="code" size={17} /> View source</a>
            </div>
            <div className="hero-stats">
              <div><strong>3</strong><span>client applications</span></div>
              <div><strong>10</strong><span>API modules</span></div>
              <div><strong>4</strong><span>case stages</span></div>
              <div><strong>0</strong><span>real records shown</span></div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="visual-glow" />
            <div className="visual-phone visual-phone--back"><span className="visual-phone-notch" /><div className="visual-phone-body"><i /><i /><i /><i /></div></div>
            <div className="visual-phone visual-phone--front">
              <span className="visual-phone-notch" />
              <div className="visual-phone-header"><img src="assets/logo.png" alt="" /><span><small>AARB</small><strong>Report Incident</strong></span></div>
              <div className="visual-stat"><span>128</span><small>Reports this month</small></div>
              <div className="visual-banner visual-banner--solid"><Icon name="warning" size={20} /><span><strong>Corruption / Bribery</strong><small>Under Review</small></span></div>
              <div className="visual-banner"><Icon name="shield" size={20} /><span><strong>Verify a TIN</strong><small>Check a seller's TIN</small></span></div>
              <div className="visual-bottomnav"><Icon name="home" size={18} /><Icon name="chat" size={18} /><Icon name="plus" size={18} /><Icon name="file" size={18} /><Icon name="user" size={18} /></div>
            </div>
            <div className="visual-card visual-card--admin"><span className="visual-card-dots"><i /><i /><i /></span><strong>Reports Management</strong><div className="visual-table"><i /><i /><i /><i /><i /></div></div>
            <div className="visual-card visual-card--api"><Icon name="terminal" size={16} /><strong>POST /reports</strong><small>201 Created</small></div>
          </div>
        </section>

        <section className="overview-section">
          <div className="section-heading-block">
            <span className="eyebrow"><Icon name="grid" size={15} /> What's in the demo</span>
            <h2>Four parts of one system</h2>
            <p>Choose an area below. Each section opens an interactive walkthrough with clickable screens and sample data.</p>
          </div>
          <div className="overview-cards">
            {overviewCards.map((card) => (
              <button key={card.target} className="overview-card" onClick={() => go(card.target)}>
                <span className="overview-icon"><Icon name={card.icon} size={23} /></span>
                <span className="overview-eyebrow">{card.eyebrow}</span>
                <strong>{card.title}</strong>
                <p>{card.body}</p>
                <span className="overview-chips">{card.chips.map((chip) => <small key={chip}>{chip}</small>)}</span>
                <span className="overview-link">Open walkthrough <Icon name="arrowRight" size={15} /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="demo-section" id="citizen"><SectionTitle number="01" eyebrow="Citizen experience" title="Report, verify and follow up" description="Tap through the full citizen journey. The language switch changes the phone interface instantly." /><CitizenDemo /></section>
        <section className="demo-section demo-section--alt" id="officer"><SectionTitle number="02" eyebrow="Field operations" title="Investigate a case in the field" description="Open a case, add a note, move it through its stages, check a TIN or explore the case map." /><OfficerDemo /></section>
        <section className="demo-section" id="admin"><SectionTitle number="03" eyebrow="Staff console" title="Triage, assign and audit" description="Every sidebar page is included. Switch roles to see how the real hierarchy limits visibility." /><AdminDemo /></section>
        <Platform />
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div><img src="assets/logo.png" alt="" /><span><strong>{siteConfig.projectName}</strong><small>Portfolio demo · fictional data only</small></span></div>
          <p>Built by {siteConfig.author} · {siteConfig.role}. Interfaces recreated for demonstration; no production system or personal data is connected.</p>
          <div className="footer-links"><a href={siteConfig.githubUrl} target="_blank" rel="noreferrer">GitHub</a>{siteConfig.liveUrl && <a href={siteConfig.liveUrl} target="_blank" rel="noreferrer">Live demo</a>}<button onClick={() => go('overview')}>Back to top ↑</button></div>
        </div>
      </footer>
    </div>
  )
}

function SectionTitle({ number, eyebrow, title, description }: { number: string; eyebrow: string; title: string; description: string }) {
  return (
    <div className="section-heading-block section-heading-block--demo">
      <span className="eyebrow"><Icon name="layers" size={15} /> {number} · {eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

function ButtonLike({ onClick, icon, children }: { onClick: () => void; icon: IconName; children: React.ReactNode }) {
  return <button className="button button--primary" onClick={onClick}><Icon name={icon} size={17} />{children}</button>
}
