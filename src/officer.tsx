import { useMemo, useState } from 'react'
import { Icon, type IconName } from './icons'
import { demoNotifications, officerCases, tinRecords, type OfficerCase, type TinRecord } from './data'
import {
  BottomNav,
  Button,
  DemoNote,
  DetailRow,
  EmptyState,
  MockMap,
  PhoneFrame,
  ScreenHeader,
  SectionLabel,
  Segmented,
  StatusChip,
  TextField,
} from './ui'

type Lang = 'en' | 'am'
type ScreenId = 'welcome' | 'login' | 'home' | 'reports' | 'chat' | 'profile' | 'case' | 'map' | 'tin'

const navItems: { id: ScreenId; label: string; am: string; icon: IconName }[] = [
  { id: 'home', label: 'Home', am: 'መነሻ', icon: 'home' },
  { id: 'chat', label: 'Chat', am: 'ውይይት', icon: 'chat' },
  { id: 'reports', label: 'Reports', am: 'ሪፖርቶች', icon: 'file' },
  { id: 'profile', label: 'Profile', am: 'መገለጫ', icon: 'user' },
]

const screenInfo: Record<ScreenId, { title: string; detail: string }> = {
  welcome: { title: 'Welcome', detail: 'Field-officer entry point before signing in with bureau-issued credentials.' },
  login: { title: 'Sign in', detail: 'Officer accounts are created in the admin panel; sign-in uses phone number and PIN.' },
  home: { title: 'Officer panel', detail: 'Assigned-case summary, status filters, TIN banner and a live case map preview.' },
  reports: { title: 'Case queue', detail: 'Unassigned and all cases, with live filters and a shortcut to the case map.' },
  case: { title: 'Case detail', detail: 'Evidence, reporter details, required response, update history and status actions.' },
  map: { title: 'Case map', detail: 'Status-filtered case markers on OpenStreetMap with a bottom detail panel.' },
  tin: { title: 'TIN lookup', detail: 'Registry status, taxpayer details, officer flagging and previously flagged TINs.' },
  chat: { title: 'Assistant chat', detail: 'Officer-audience RAG chat that can use live case context while investigating.' },
  profile: { title: 'Profile', detail: 'My cases, language preference, notifications and sign out.' },
}

const am: Record<string, string> = {
  Home: 'መነሻ', Chat: 'ውይይት', Reports: 'ሪፖርቶች', Profile: 'መገለጫ',
  'Officer Panel': 'የኦፊሰር ገጽ', 'Verify a TIN': 'ቲን ቁጥር አረጋግጥ', Notifications: 'ማሳወቂያዎች',
  'Add Update': 'ማስታወሻ ጨምር', 'Start Investigation': 'ምርመራ ጀምር', 'Mark Resolved': 'ተፈቷል በል',
  'Take This Case': 'ይህን ጉዳይ ውሰድ', 'Sign In': 'ግባ', 'Sign Out': 'ውጣ', 'My Cases': 'የእኔ ጉዳዮች',
  Preferences: 'ምርጫዎች', 'Case Map': 'የጉዳዮች ካርታ', 'Flag as illegal': 'ሕገወጥ መሆኑን ጠቁም',
  DESCRIPTION: 'መግለጫ', 'REPORT DETAILS': 'የሪፖርቱ ዝርዝር', 'ATTACHED MEDIA': 'የተያያዙ ማስረጃዎች',
  'UPDATE HISTORY': 'የክትትል ታሪክ', 'REQUIRED RESPONSE': 'የሚጠበቅ ምላሽ',
}

export function OfficerDemo() {
  const [screen, setScreen] = useState<ScreenId>('home')
  const [, setHistory] = useState<ScreenId[]>([])
  const [lang, setLang] = useState<Lang>('en')
  const [flash, setFlash] = useState('')
  const [unread, setUnread] = useState(2)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [caseFilter, setCaseFilter] = useState<'all' | 'active' | 'investigating' | 'resolved'>('all')
  const [queueScope, setQueueScope] = useState<'open' | 'all'>('open')
  const [selectedCase, setSelectedCase] = useState<OfficerCase>(officerCases[0])
  const [caseStatuses, setCaseStatuses] = useState<Record<string, OfficerCase['status']>>({})
  const [caseNotes, setCaseNotes] = useState<Record<string, string[]>>({})
  const [noteOpen, setNoteOpen] = useState<'update' | 'investigate' | 'resolve' | null>(null)
  const [noteText, setNoteText] = useState('')
  const [mapStatus, setMapStatus] = useState<'all' | 'Submitted' | 'Under Review' | 'Assigned to Investigator'>('all')
  const [tinQuery, setTinQuery] = useState('1234567890')
  const [tinResult, setTinResult] = useState<TinRecord | null>(tinRecords[0])
  const [flagOpen, setFlagOpen] = useState(false)
  const [flagReason, setFlagReason] = useState('')
  const [flagged, setFlagged] = useState<string[]>([])
  const [profileTab, setProfileTab] = useState<'cases' | 'preferences' | 'notifications'>('cases')
  const [chatMessages, setChatMessages] = useState<{ text: string; isUser: boolean; citations: string[] }[]>([])
  const [chatInput, setChatInput] = useState('')
  const [loginPhone, setLoginPhone] = useState('0911223344')
  const [loginPin, setLoginPin] = useState('1234')

  const t = (en: string, amharic: string) => (lang === 'am' ? amharic : en)
  const label = (en: string) => (lang === 'am' ? am[en] ?? en : en)

  const navigate = (next: ScreenId) => { setHistory((stack) => [...stack, screen]); setScreen(next); setFlash('') }
  const go = (next: ScreenId) => { setScreen(next); setFlash('') }
  const back = () => setHistory((stack) => {
    if (!stack.length) { setScreen('home'); return stack }
    setScreen(stack[stack.length - 1]); return stack.slice(0, -1)
  })
  const showFlash = (message: string) => { setFlash(message); window.setTimeout(() => setFlash(''), 2600) }
  const openCase = (item: OfficerCase) => { setSelectedCase(item); navigate('case') }
  const statusOf = (item: OfficerCase) => caseStatuses[item.reference] ?? item.status

  const filteredCases = officerCases.filter((item) => {
    const status = statusOf(item)
    if (caseFilter === 'active') return status === 'Submitted' || status === 'Under Review'
    if (caseFilter === 'investigating') return status === 'Assigned to Investigator'
    if (caseFilter === 'resolved') return status === 'Resolved'
    return true
  })
  const queueCases = queueScope === 'open' ? officerCases.filter((item) => statusOf(item) !== 'Resolved') : officerCases

  const applyNote = () => {
    if (noteText.trim().length < 3) { showFlash('Write a short note first'); return }
    setCaseNotes((notes) => ({ ...notes, [selectedCase.reference]: [...(notes[selectedCase.reference] ?? []), noteText.trim()] }))
    if (noteOpen === 'investigate') setCaseStatuses((states) => ({ ...states, [selectedCase.reference]: 'Assigned to Investigator' }))
    if (noteOpen === 'resolve') setCaseStatuses((states) => ({ ...states, [selectedCase.reference]: 'Resolved' }))
    setNoteOpen(null); setNoteText(''); showFlash('Case updated')
  }

  const sendChat = (text: string) => {
    if (!text.trim()) return
    setChatMessages((messages) => [...messages, { text, isUser: true, citations: [] }])
    setChatInput('')
    window.setTimeout(() => setChatMessages((messages) => [...messages, {
      text: 'In the live app this answer is grounded in the bureau knowledge base. As an officer you can also ask about tax law or paste a case reference for live context.',
      isUser: false,
      citations: ['Citizen Reporting Guide', 'Evidence Handling Directive'],
    }]), 600)
  }

  const caseCard = (item: OfficerCase) => {
    const status = statusOf(item)
    return (
      <button key={item.reference} className="case-card" onClick={() => openCase(item)}>
        <span className="tile tile--amber"><Icon name="warning" size={21} /></span>
        <span className="case-card-body">
          <strong>{item.category}</strong>
          <span className="case-card-location">{item.location}</span>
          <span className="chip-row"><StatusChip status={status} small />{item.priority === 'High' && <span className="mini-chip mini-chip--danger">High Priority</span>}</span>
          <small><Icon name="clock" size={12} /> {item.receivedAt}</small>
        </span>
        <Icon name="chevronRight" size={16} />
      </button>
    )
  }

  const screenNode = useMemo(() => {
    switch (screen) {
      case 'welcome':
        return (
          <div className="phone-screen welcome-screen">
            <img src="assets/logo.png" alt="" className="onboarding-logo" />
            <img src="assets/onboarding.png" alt="" className="onboarding-art" />
            <h2>{t('Welcome, Officer', 'እንኳን ደህና መጡ')}</h2>
            <p className="muted">{t('Manage your assigned cases, investigate on site, and report findings, all in one place.', 'የተመደቡልዎትን ጉዳዮች ያስተዳድሩ፣ በቦታው ይመርምሩ እና ግኝቶችዎን ሪፖርት ያድርጉ።')}</p>
            <Button full onClick={() => navigate('login')}>{label('Get Started')}</Button>
          </div>
        )

      case 'login':
        return (
          <div className="phone-screen auth-screen">
            <ScreenHeader title={label('Sign In')} onBack={back} />
            <img src="assets/logo.png" alt="" className="auth-logo" />
            <h2>{label('Sign In')}</h2>
            <p className="muted">{t('Use the phone number and PIN issued to you by the bureau.', 'ቢሮው የሰጠዎትን ስልክ ቁጥርና ፒን ይጠቀሙ።')}</p>
            <TextField label="Phone number" value={loginPhone} onChange={setLoginPhone} placeholder="09XXXXXXXX" />
            <TextField label="PIN" type="password" value={loginPin} onChange={setLoginPin} />
            <Button full onClick={() => { go('home'); showFlash('Signed in as Demo Field Officer') }}>{label('Sign In')}</Button>
            <p className="helper">{t('Officer accounts are created by the bureau. Contact your supervisor if you cannot sign in.', 'የኦፊሰር መለያ የሚፈጠረው በቢሮው ነው።')}</p>
          </div>
        )

      case 'home':
        return (
          <div className="phone-screen home-screen">
            <div className="home-header">
              <div className="home-officer-brand">
                <img src="assets/logo.png" alt="" />
                <div><span className="greeting">{t('Addis Ababa', 'አዲስ አበባ')}</span><h2>{label('Officer Panel')}</h2></div>
              </div>
              <div className="home-header-actions">
                <button className="circle-button" onClick={() => { setNotificationsOpen(true); setUnread(0) }}><Icon name="bell" size={21} />{unread > 0 && <span className="badge">{unread}</span>}</button>
                <button className="avatar" onClick={() => go('profile')}>DF</button>
              </div>
            </div>
            <div className="stat-grid stat-grid--officer">
              {[
                { value: '4', label: t('Total Assigned', 'ጠቅላላ የተመደቡ') },
                { value: '2', label: t('Active', 'በሂደት ላይ') },
                { value: '2', label: t('Investigating', 'በምርመራ ላይ') },
                { value: '1', label: t('Resolved', 'የተፈቱ') },
              ].map((stat) => <div key={stat.label} className="stat-card"><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
            </div>
            <button className="action-banner" onClick={() => navigate('tin')}>
              <span className="action-icon"><Icon name="shield" size={23} /></span>
              <span><strong>{label('Verify a TIN')}</strong><small>{t('Status, owner and registration details', 'ሁኔታ፣ ባለቤትና የምዝገባ ዝርዝር')}</small></span>
              <Icon name="arrowRight" size={18} />
            </button>
            <div className="section-heading"><SectionLabel>{t('Current Location', 'አሁን ያሉበት ቦታ')}</SectionLabel><button className="link-button" onClick={() => navigate('map')}>{t('Open map', 'ካርታ ክፈት')}</button></div>
            <button className="map-preview-button" onClick={() => navigate('map')}>
              <MockMap height={130} pins={[{ top: '35%', left: '30%', color: '#145491' }, { top: '60%', left: '65%', color: '#2E9E0F' }, { top: '48%', left: '78%', color: '#D97706' }]} />
            </button>
            <div className="segmented segmented--scroll">
              {([['all', t('All', 'ሁሉም')], ['active', t('Active', 'በሂደት ላይ')], ['investigating', t('Investigating', 'በምርመራ ላይ')], ['resolved', t('Resolved', 'የተፈቱ')]] as const).map(([id, text]) => (
                <button key={id} className={`segment${caseFilter === id ? ' segment--active' : ''}`} onClick={() => setCaseFilter(id)}>{text}</button>
              ))}
            </div>
            <SectionLabel>{t('{n} Tasks', '{n} ጉዳዮች').replace('{n}', String(filteredCases.length))}</SectionLabel>
            {filteredCases.length ? <div className="case-list">{filteredCases.map(caseCard)}</div> : <EmptyState icon="inbox" title={t('No cases here', 'እዚህ ምንም ጉዳይ የለም')} />}
          </div>
        )

      case 'reports':
        return (
          <div className="phone-screen">
            <ScreenHeader title={label('Reports')} onBack={back} trailing={<button className="circle-button" onClick={() => navigate('map')}><Icon name="map" size={19} /></button>} />
            <Segmented value={queueScope} onChange={setQueueScope} options={[{ id: 'open', label: t('Unassigned', 'ያልተመደቡ') }, { id: 'all', label: t('All Cases', 'ሁሉም ጉዳዮች') }]} />
            <div className="case-list">{queueCases.map(caseCard)}</div>
          </div>
        )

      case 'case': {
        const status = statusOf(selectedCase)
        const notes = caseNotes[selectedCase.reference] ?? []
        return (
          <div className="phone-screen case-detail">
            <ScreenHeader title={selectedCase.category} subtitle={selectedCase.reference} onBack={back} />
            <div className="chip-row chip-row--spaced"><StatusChip status={status} small />{selectedCase.priority === 'High' && <span className="mini-chip mini-chip--danger">High Priority</span>}</div>
            <div className="location-card"><Icon name="pin" size={20} /><span>{selectedCase.location}</span></div>
            <MockMap height={140} pins={[{ top: '46%', left: '52%', color: '#D12F2F' }]} />
            <SectionLabel>{label('DESCRIPTION')}</SectionLabel>
            <div className="description-card">{t('A fictional example report used for this portfolio demo. The citizen described a possible VAT receipt issue and attached supporting evidence.', 'ለዚህ የፖርትፎሊዮ ዴሞ የሚያገለግል ሐሰተኛ ሪፖርት።')}</div>
            <SectionLabel>SELLER'S TIN</SectionLabel>
            <button className="tin-link" onClick={() => { setTinQuery('1234567890'); setTinResult(tinRecords[0]); navigate('tin') }}><span className="mono">1234567890</span><span className="link-button">Check</span></button>
            <SectionLabel>{label('REPORT DETAILS')}</SectionLabel>
            <div className="detail-card">
              <DetailRow label="Reference" value={selectedCase.reference} mono />
              <DetailRow label="Reported by" value="Anonymous citizen" />
              <DetailRow label="Date / time" value={selectedCase.receivedAt} />
              <DetailRow label="Office" value="Bole Sub-City, Woreda 03" />
              <DetailRow label="Assigned to" value="Demo Field Officer" />
            </div>
            {selectedCase.priority === 'High' && (
              <>
                <SectionLabel>{label('REQUIRED RESPONSE')}</SectionLabel>
                <div className="required-card"><DetailRow label="Urgency" value="High" /><DetailRow label="Instructions" value="Review attached evidence before the site visit." /></div>
              </>
            )}
            <SectionLabel>{label('ATTACHED MEDIA')}</SectionLabel>
            <div className="evidence-grid">
              <div className="evidence-tile"><Icon name="image" size={22} /><span>receipt.jpg</span></div>
              <div className="evidence-tile"><Icon name="image" size={22} /><span>scene.png</span></div>
              <div className="evidence-tile evidence-tile--wide"><Icon name="mic" size={18} /><span>Voice message · 0:42</span></div>
            </div>
            <SectionLabel>{label('UPDATE HISTORY')}</SectionLabel>
            <div className="timeline timeline--officer">
              <div className="timeline-step timeline-step--done"><span className="timeline-dot"><Icon name="check" size={12} /></span><div><strong>Report Received</strong><small>{selectedCase.receivedAt}</small></div></div>
              <div className="timeline-step timeline-step--done"><span className="timeline-dot"><Icon name="check" size={12} /></span><div><strong>Under Review</strong><small>15 Nov, 11:10</small></div></div>
              {(status === 'Assigned to Investigator' || status === 'Resolved') && <div className="timeline-step timeline-step--done"><span className="timeline-dot"><Icon name="check" size={12} /></span><div><strong>Assigned to Investigator</strong><small>17 Nov, 08:15</small></div></div>}
              {notes.map((note, index) => <div key={index} className="timeline-step timeline-step--done"><span className="timeline-dot"><Icon name="check" size={12} /></span><div><strong>Field note</strong><small>{note}<br />By: Demo Field Officer</small></div></div>)}
              {status === 'Resolved' && <div className="timeline-step timeline-step--done"><span className="timeline-dot"><Icon name="check" size={12} /></span><div><strong>Resolved</strong><small>21 Nov, 15:00</small></div></div>}
            </div>
            <div className="case-actions">
              {status === 'Resolved' ? <p className="helper">This case is resolved.</p> : (
                <>
                  <Button variant="outline" onClick={() => setNoteOpen('update')}>{label('Add Update')}</Button>
                  <Button onClick={() => setNoteOpen(status === 'Assigned to Investigator' ? 'resolve' : 'investigate')}>
                    {label(status === 'Assigned to Investigator' ? 'Mark Resolved' : 'Start Investigation')}
                  </Button>
                </>
              )}
            </div>
          </div>
        )
      }

      case 'map':
        return (
          <div className="phone-screen map-screen">
            <ScreenHeader title={label('Case Map')} subtitle={t('{n} on map', '{n} በካርታ ላይ').replace('{n}', '3')} onBack={back} />
            <div className="segmented segmented--scroll">
              {([['all', t('All', 'ሁሉም')], ['Submitted', 'Submitted'], ['Under Review', 'Under Review'], ['Assigned to Investigator', 'Investigating']] as const).map(([id, text]) => (
                <button key={id} className={`segment${mapStatus === id ? ' segment--active' : ''}`} onClick={() => setMapStatus(id)}>{text}</button>
              ))}
            </div>
            <MockMap height={420} label="Addis Ababa · case locations" pins={[
              { top: '32%', left: '26%', color: '#0284C7' },
              { top: '58%', left: '58%', color: '#D97706' },
              { top: '44%', left: '74%', color: '#2E9E0F' },
              { top: '70%', left: '38%', color: '#145491' },
            ]} />
            <div className="map-panel">
              <strong>{selectedCase.category}</strong>
              <p>{selectedCase.location}</p>
              <div className="chip-row"><StatusChip status={statusOf(selectedCase)} small /></div>
              <Button full onClick={() => navigate('case')}>{t('View case', 'ጉዳዩን ክፈት')}</Button>
            </div>
          </div>
        )

      case 'tin':
        return (
          <div className="phone-screen">
            <ScreenHeader title={label('Verify a TIN')} subtitle={t('Status, owner and registration details', 'ሁኔታ፣ ባለቤት እና የምዝገባ ዝርዝር')} onBack={back} />
            <div className="tin-search">
              <span className="field-label">TIN NUMBER</span>
              <div className="tin-search-row">
                <input className="mono" value={tinQuery} onChange={(e) => setTinQuery(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="0000000000" />
                <Button onClick={() => { setTinResult(tinRecords.find((record) => record.tin === tinQuery) ?? null); showFlash('Registry lookup complete') }}>{label('Check')}</Button>
              </div>
            </div>
            <div className="quick-row">
              {tinRecords.map((record) => <button key={record.tin} className="quick-chip mono" onClick={() => { setTinQuery(record.tin); setTinResult(record) }}>{record.tin}</button>)}
            </div>
            {!tinResult && <EmptyState icon="search" title={t('TIN not registered', 'ቲኑ አልተመዘገበም')} />}
            {tinResult && (
              <>
                <div className={`tin-banner tin-banner--${tinResult.status.toLowerCase()}`}>
                  <Icon name={tinResult.status === 'ACTIVE' ? 'checkCircle' : 'shield'} size={28} />
                  <strong>{tinResult.status === 'ACTIVE' ? t('Valid TIN', 'ትክክለኛ ቲን') : tinResult.status === 'INACTIVE' ? t('TIN not active', 'ቲኑ በሥራ ላይ አይደለም') : t('TIN not registered', 'ቲኑ አልተመዘገበም')}</strong>
                  <span className="mono">{tinResult.tin}</span>
                  <p>{t('Registered and active.', 'የተመዘገበ እና በሥራ ላይ ያለ።')}</p>
                </div>
                <div className="detail-card">
                  <DetailRow label="Owner" value={tinResult.ownerName} />
                  <DetailRow label="Business" value={tinResult.businessName} />
                  <DetailRow label="Taxpayer category" value={tinResult.category} />
                  <DetailRow label="Phone" value={tinResult.phoneNumber} />
                  <DetailRow label="Address" value={tinResult.address} />
                  <DetailRow label="Registered on" value={tinResult.registeredOn} />
                  <DetailRow label="Registry status" value={tinResult.registryStatus} />
                </div>
                {flagged.includes(tinResult.tin)
                  ? <p className="helper">{t('You flagged this TIN. It is waiting for review.', 'ይህን ቲን ጠቁመዋል። በመጠበቅ ላይ ነው።')}</p>
                  : <Button full variant="danger" onClick={() => setFlagOpen(true)}>{label('Flag as illegal')}</Button>}
              </>
            )}
            <SectionLabel>MY FLAGGED TINS</SectionLabel>
            <div className="detail-card">
              {flagged.length ? flagged.map((tin) => <DetailRow key={tin} label={tin} value={t('Waiting', 'በመጠበቅ ላይ')} mono />) : <p className="helper">{t('No flags sent in this demo session.', 'በዚህ ዴሞ ምንም ጥቆማ አልተላከም።')}</p>}
            </div>
          </div>
        )

      case 'chat':
        return (
          <div className="phone-screen chat-screen">
            <ScreenHeader title={label('Chat')} subtitle={t('Message with assistant', 'ከረዳቱ ጋር ይነጋገሩ')} onBack={back} />
            {chatMessages.length === 0 ? (
              <div className="chat-greeting chat-greeting--officer">
                <h2>{t('Hey Officer!\nHow can I help you?', 'ሰላም ኦፊሰር!\nምን ልርዳዎት?')}</h2>
                <p>{t('I’m your Report Assistant AI. Ask me about tax law while you work a case.', 'እኔ የሪፖርት ረዳትዎ ነኝ። ጉዳይ ሲመረምሩ ስለ ግብር ሕግ ይጠይቁኝ።')}</p>
              </div>
            ) : (
              <div className="chat-thread">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`chat-bubble ${message.isUser ? 'chat-bubble--user' : 'chat-bubble--ai'}`}>
                    <p>{message.text}</p>
                    {message.citations.length > 0 && <div className="citation-row">{message.citations.map((citation) => <span key={citation} className="citation">{citation}</span>)}</div>}
                  </div>
                ))}
              </div>
            )}
            {chatMessages.length === 0 && <div className="suggestion-list">
              {['What evidence is needed for a VAT case?', 'AARB-2026-04390 — any update?', 'What is the penalty for no receipt?'].map((suggestion) => (
                <button key={suggestion} onClick={() => sendChat(suggestion)}>{suggestion}<Icon name="chevronRight" size={14} /></button>
              ))}
            </div>}
            <div className="chat-input">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendChat(chatInput) }} placeholder={t('Type something...', 'እዚህ ይጻፉ...')} />
              <button onClick={() => sendChat(chatInput)} aria-label="Send"><Icon name="send" size={18} /></button>
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="phone-screen">
            <ScreenHeader title={label('Profile')} />
            <div className="profile-card profile-card--officer">
              <span className="profile-avatar">DF</span>
              <strong>Demo Field Officer</strong>
              <p>Field Officer · Bole Sub-City Tax Inspection Unit</p>
            </div>
            <Segmented value={profileTab} onChange={setProfileTab} options={[{ id: 'cases', label: label('My Cases') }, { id: 'preferences', label: label('Preferences') }, { id: 'notifications', label: label('Notifications') }]} />
            {profileTab === 'cases' && (
              <>
                <div className="case-list">{officerCases.filter((item) => statusOf(item) !== 'Resolved').map(caseCard)}</div>
                <div className="profile-summary"><span><strong>4</strong>Total assigned</span><span><strong>3</strong>Active</span><span><strong>1</strong>Resolved</span></div>
              </>
            )}
            {profileTab === 'preferences' && (
              <div className="detail-card">
                <SectionLabel>LANGUAGE</SectionLabel>
                {([['en', 'English'], ['am', 'አማርኛ']] as const).map(([code, name]) => (
                  <button key={code} className="language-row" onClick={() => setLang(code)}><span>{name}</span>{lang === code && <Icon name="checkCircle" size={18} />}</button>
                ))}
                <Button full variant="outline" icon="logout" onClick={() => go('welcome')}>{label('Sign Out')}</Button>
              </div>
            )}
            {profileTab === 'notifications' && (
              <div className="detail-card">
                {demoNotifications.map((notification, index) => (
                  <div key={index} className="notification-row notification-row--static">
                    <span className="unread-dot" /><span><strong>{notification.category}</strong><StatusChip status={notification.status} small /><small>{notification.note}</small></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
    }
  }, [screen, lang, caseFilter, queueScope, selectedCase, caseStatuses, caseNotes, noteOpen, noteText, mapStatus, tinQuery, tinResult, flagged, profileTab, chatMessages, chatInput, loginPhone, loginPin, unread, statusOf, filteredCases, queueCases, caseCard, back, go, navigate, openCase, showFlash, t, label, applyNote, sendChat])

  const edgeScreens: ScreenId[] = ['welcome', 'login', 'case', 'map', 'tin']
  const nav = edgeScreens.includes(screen) ? undefined : (
    <BottomNav items={navItems.map((item) => ({ id: item.id, label: label(item.label), icon: item.icon }))} active={screen} onSelect={(id) => go(id as ScreenId)} />
  )

  return (
    <div className="showcase-grid">
      <PhoneFrame label={screenInfo[screen].title} nav={nav} className="phone-wrap--officer">
        {screenNode}
        {flash && <div className="phone-toast">{flash}</div>}
        {notificationsOpen && (
          <div className="sheet-backdrop" onClick={() => setNotificationsOpen(false)}>
            <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-title"><strong>{label('Notifications')}</strong><button onClick={() => setNotificationsOpen(false)}><Icon name="close" size={18} /></button></div>
              {demoNotifications.map((notification, index) => (
                <button key={index} className="notification-row" onClick={() => { setNotificationsOpen(false); openCase(officerCases[index % officerCases.length]) }}>
                  <span className="unread-dot" /><span><strong>{notification.category}</strong><StatusChip status={notification.status} small /><small>{notification.note}</small><small className="mono">{notification.reference}</small></span>
                </button>
              ))}
            </div>
          </div>
        )}
        {noteOpen && (
          <div className="sheet-backdrop" onClick={() => setNoteOpen(null)}>
            <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-title"><strong>{label(noteOpen === 'update' ? 'Add Update' : noteOpen === 'investigate' ? 'Start Investigation' : 'Mark Resolved')}</strong><button onClick={() => setNoteOpen(null)}><Icon name="close" size={18} /></button></div>
              <textarea className="note-area" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="What did you find or do?" rows={4} />
              <div className="sheet-actions"><Button variant="outline" small onClick={() => setNoteOpen(null)}>Cancel</Button><Button small onClick={applyNote}>Save</Button></div>
            </div>
          </div>
        )}
        {flagOpen && (
          <div className="sheet-backdrop" onClick={() => setFlagOpen(false)}>
            <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-title"><strong>Why is this TIN illegal?</strong><button onClick={() => setFlagOpen(false)}><Icon name="close" size={18} /></button></div>
              <textarea className="note-area" value={flagReason} onChange={(e) => setFlagReason(e.target.value)} placeholder="Describe what you found. Your current position is sent with it." rows={4} />
              <div className="sheet-actions">
                <Button variant="outline" small onClick={() => setFlagOpen(false)}>Cancel</Button>
                <Button variant="danger" small onClick={() => { if (flagged.length || !tinResult) return; setFlagged([tinResult.tin]); setFlagOpen(false); showFlash('Flag sent. Staff will review it.') }}>Send flag</Button>
              </div>
            </div>
          </div>
        )}
      </PhoneFrame>

      <aside className="showcase-panel">
        <div className="panel-eyebrow"><Icon name="sparkles" size={15} /> Interactive walkthrough</div>
        <h3>Officer mobile app</h3>
        <p className="panel-lead">The field-officer companion: assigned cases, on-site investigation, evidence review, status updates and TIN flagging. Pick any screen below.</p>
        <div className="screen-picker">
          {(Object.keys(screenInfo) as ScreenId[]).map((id) => (
            <button key={id} className={screen === id ? 'picker-item picker-item--active' : 'picker-item'} onClick={() => go(id)}>
              <span>{screenInfo[id].title}</span><Icon name="chevronRight" size={14} />
            </button>
          ))}
        </div>
        <div className="panel-detail">
          <span className="panel-detail-label">CURRENT SCREEN</span>
          <strong>{screenInfo[screen].title}</strong>
          <p>{screenInfo[screen].detail}</p>
        </div>
        <div className="panel-language">
          <span><Icon name="globe" size={16} /> Language</span>
          <Segmented<Lang> value={lang} onChange={setLang} options={[{ id: 'en', label: 'EN' }, { id: 'am', label: 'አማ' }]} />
        </div>
        <div className="panel-chips"><DemoNote small /><span>Flutter 3</span><span>GoRouter</span><span>Bloc</span><span>OpenStreetMap</span><span>RAG chat</span></div>
      </aside>
    </div>
  )
}
