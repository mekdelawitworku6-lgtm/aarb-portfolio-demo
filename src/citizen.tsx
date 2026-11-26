import { useMemo, useState } from 'react'
import { Icon, type IconName } from './icons'
import {
  categories,
  chatFollowUps,
  chatReplies,
  chatSuggestions,
  defaultChatReply,
  demoNotifications,
  demoReports,
  impactStats,
  subCities,
  tinRecords,
  type DemoReport,
  type TinRecord,
} from './data'
import {
  BottomNav,
  Button,
  DemoNote,
  DetailRow,
  EmptyState,
  MockMap,
  PhoneFrame,
  ProgressBar,
  ScreenHeader,
  SectionLabel,
  Segmented,
  StatCard,
  StatusChip,
  TextField,
} from './ui'

type Lang = 'en' | 'am' | 'om'
type ScreenId =
  | 'onboarding' | 'login' | 'signup' | 'home' | 'chat' | 'reports' | 'profile'
  | 'create' | 'success' | 'track' | 'tin' | 'stats'

interface ChatMessage {
  text: string
  isUser: boolean
  citations: string[]
}

const citizenNav: { id: ScreenId; label: string; am: string; icon: IconName }[] = [
  { id: 'home', label: 'Home', am: 'ዋና ገጽ', icon: 'home' },
  { id: 'chat', label: 'Chat', am: 'ውይይት', icon: 'chat' },
  { id: 'reports', label: 'Reports', am: 'ጥቆማዎች', icon: 'file' },
  { id: 'profile', label: 'Profile', am: 'መገለጫ', icon: 'user' },
]

const screenInfo: Record<ScreenId, { title: string; detail: string }> = {
  onboarding: { title: 'Onboarding', detail: 'Bilingual first-run flow with guest access — reporting works anonymously by default.' },
  login: { title: 'Sign in', detail: 'Phone + PIN authentication with local session and device-linked report tracking.' },
  signup: { title: 'Create account', detail: 'Optional account creation; anonymous reporting stays available to everyone.' },
  home: { title: 'Home dashboard', detail: 'Impact stats, three primary actions, recent reports, notifications and hotline access.' },
  chat: { title: 'Assistant chat', detail: 'Retrieval-grounded answers with document citations, follow-up prompts and case awareness.' },
  reports: { title: 'My reports', detail: 'Device-linked list of submitted reports with live status chips and pull-to-refresh.' },
  create: { title: 'Create report', detail: 'Six categories, attachments, voice note, map location, sub-city and anonymous toggle.' },
  success: { title: 'Submission receipt', detail: 'Reference number, status, location, hotline and share action after a report is sent.' },
  track: { title: 'Track report', detail: 'Reference lookup with a four-stage status timeline and assigned unit.' },
  tin: { title: 'Verify a TIN', detail: '10-digit lookup with four result states, registry details and a report-this-seller action.' },
  stats: { title: 'Impact stats', detail: 'Monthly reports, response time, breakdown by category and by workflow stage.' },
  profile: { title: 'Profile & privacy', detail: 'English / Amharic / Afaan Oromoo, push preferences, protection policy and agency contact.' },
}

const amLabels: Record<string, string> = {
  Home: 'ዋና ገጽ', Chat: 'ውይይት', Reports: 'ጥቆማዎች', Profile: 'መገለጫ',
  'Impact Stats': 'የጥቆማ ውጤቶች', 'Recent Reports': 'የቅርብ ጊዜ ጥቆማዎች', 'View All': 'ሁሉንም እይ',
  'Report Incident': 'ጥቆማ ይላኩ', 'Track My Report': 'ሪፖርቴን ተከታተል', 'Verify a TIN': 'ቲን ቁጥር አረጋግጥ',
  'Reports This Month': 'በዚህ ወር የተላኩ ሪፖርቶች', 'Avg Response Time': 'አማካይ የምላሽ ጊዜ',
  'STATUS TIMELINE': 'የጉዳዩ ሂደት ደረጃ', 'Check Status': 'ሁኔታውን መርምር', Check: 'አረጋግጥ',
  'Report Submitted': 'ጥቆማው በተሳካ ሁኔታ ደርሷል!', 'Report this seller': 'ይህን ሻጭ ሪፖርት አድርግ',
  'Sign In': 'ግባ', 'Create Account': 'መለያ ፍጠር', 'Get Started': 'ጀምር',
  'Continue as Guest': 'እንደ እንግዳ ቀጥል', 'Submit Report': 'ጥቆማውን ላክ', 'Return to Home': 'ወደ ዋናው ገጽ ተመለስ',
  Notifications: 'ማሳወቂያዎች', 'Select Report Category': 'የጥቆማውን አይነት ይምረጡ',
  Description: 'መግለጫ', Language: 'ቋንቋ', 'Push Notifications': 'የማሳወቂያ መልእክቶች',
}

export function CitizenDemo() {
  const [screen, setScreen] = useState<ScreenId>('home')
  const [, setHistory] = useState<ScreenId[]>([])
  const [lang, setLang] = useState<Lang>('en')
  const [flash, setFlash] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [unread, setUnread] = useState(3)
  const [hotlineOpen, setHotlineOpen] = useState(false)
  const [policyOpen, setPolicyOpen] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(true)

  const [trackQuery, setTrackQuery] = useState('AARB-2026-04390')
  const [tracked, setTracked] = useState<DemoReport | null>(demoReports[0])
  const [trackSearched, setTrackSearched] = useState(true)
  const [tinQuery, setTinQuery] = useState('1234567890')
  const [tinResult, setTinResult] = useState<TinRecord | null>(tinRecords[0])
  const [tinSearched, setTinSearched] = useState(true)
  const [statsMode, setStatsMode] = useState<'reports' | 'response'>('reports')

  const [selectedCategory, setSelectedCategory] = useState('')
  const [description, setDescription] = useState('')
  const [subCity, setSubCity] = useState(subCities[3])
  const [anonymous, setAnonymous] = useState(true)
  const [attachments, setAttachments] = useState<string[]>([])
  const [recording, setRecording] = useState(false)
  const [voiceRecorded, setVoiceRecorded] = useState(false)
  const [submittedReport, setSubmittedReport] = useState<DemoReport>(demoReports[0])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatBusy, setChatBusy] = useState(false)

  const [authPhone, setAuthPhone] = useState('0911223344')
  const [authPin, setAuthPin] = useState('1234')
  const [authName, setAuthName] = useState('Demo Citizen')
  const [authError, setAuthError] = useState('')

  const t = (en: string, am: string, om?: string) => (lang === 'am' ? am : lang === 'om' ? om ?? en : en)
  const label = (en: string) => (lang === 'en' ? en : amLabels[en] ?? en)

  const navigate = (next: ScreenId) => {
    setHistory((stack) => [...stack, screen])
    setScreen(next)
    setFlash('')
  }
  const go = (next: ScreenId) => { setScreen(next); setFlash('') }
  const back = () => {
    setHistory((stack) => {
      if (!stack.length) { setScreen('home'); return stack }
      setScreen(stack[stack.length - 1])
      return stack.slice(0, -1)
    })
  }
  const showFlash = (message: string) => {
    setFlash(message)
    window.setTimeout(() => setFlash(''), 2600)
  }

  const navItems = citizenNav.map((item) => ({ id: item.id, label: label(item.label), icon: item.icon }))

  const chatSend = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || chatBusy) return
    setChatMessages((messages) => [...messages, { text: trimmed, isUser: true, citations: [] }])
    setChatInput('')
    setChatBusy(true)
    window.setTimeout(() => {
      const reply = chatReplies[trimmed] ?? defaultChatReply
      setChatMessages((messages) => [...messages, { text: reply.reply, isUser: false, citations: reply.citations }])
      setChatBusy(false)
    }, 650)
  }

  const submitReport = () => {
    if (!selectedCategory || description.trim().length < 8) {
      showFlash(lang === 'en' ? 'Select an incident type and describe what happened.' : 'ጉዳይ ይምረጡና መግለጫ ይጻፉ።')
      return
    }
    const report: DemoReport = {
      reference: 'AARB-2026-DEMO',
      category: selectedCategory,
      status: 'Submitted',
      createdAt: '2026-11-24T10:30:00Z',
      location: `${subCity} Sub-City, Addis Ababa`,
      assignedUnit: null,
      description,
      anonymous,
      timeline: [
        { title: 'Report Received', date: '2026-11-24T10:30:00Z' },
        { title: 'Under Review', date: null },
        { title: 'Assigned to Investigator', date: null },
        { title: 'Resolved', date: null },
      ],
    }
    setSubmittedReport(report)
    go('success')
  }

  const checkTin = () => {
    const found = tinRecords.find((record) => record.tin === tinQuery.trim())
    setTinResult(found ?? null)
    setTinSearched(true)
  }

  const screenNode = useMemo(() => {
    switch (screen) {
      case 'onboarding':
        return (
          <div className="phone-screen onboarding">
            <img src="assets/logo.png" alt="AARB logo" className="onboarding-logo" />
            <div className="onboarding-copy">
              <h2>{t('Report any misconduct confidentially', 'ማንኛውንም ጥሰት በሚስጥር ይጠቁሙ')}</h2>
              <p>{t('Report corruption, tax evasion, and employee misconduct confidentially.', 'ሙስናን፣ የግብር ስወራንና የስነምግባር ጉድለትን በሙሉ ሚስጥራዊነት ይጠቁሙ።')}</p>
            </div>
            <img src="assets/onboarding.png" alt="" className="onboarding-art" />
            <div className="onboarding-actions">
              <Button full onClick={() => navigate('signup')}>{label('Get Started')}</Button>
              <Button full variant="outline" onClick={() => go('home')}>{label('Continue as Guest')}</Button>
              <button className="text-link" onClick={() => navigate('login')}>
                {t('Already have an account? Sign In', 'መለያ አለዎት? ግባ')}
              </button>
            </div>
          </div>
        )

      case 'login':
        return (
          <div className="phone-screen auth-screen">
            <ScreenHeader title={label('Sign In')} onBack={back} />
            <img src="assets/logo.png" alt="" className="auth-logo" />
            <h2>{label('Sign In')}</h2>
            <p className="muted">{t('Sign in to follow your reports on any phone.', 'ሪፖርቶችዎን በማንኛውም ስልክ ለመከታተል ይግቡ።')}</p>
            {authError && <div className="error-banner">{authError}</div>}
            <TextField label="Phone number" value={authPhone} onChange={setAuthPhone} placeholder="09XXXXXXXX" />
            <TextField label="PIN" type="password" value={authPin} onChange={setAuthPin} placeholder="••••" />
            <Button full onClick={() => {
              if (!/^\d{4,8}$/.test(authPin)) { setAuthError('PIN must be 4 to 8 digits'); return }
              setAuthError(''); go('home')
            }}>{label('Sign In')}</Button>
            <button className="text-link" onClick={() => navigate('signup')}>
              {t('No account yet? Create Account', 'መለያ የለዎትም? መለያ ፍጠር')}
            </button>
          </div>
        )

      case 'signup':
        return (
          <div className="phone-screen auth-screen">
            <ScreenHeader title={label('Create Account')} onBack={back} />
            <img src="assets/logo.png" alt="" className="auth-logo" />
            <h2>{label('Create Account')}</h2>
            <p className="muted">{t('You can still report anonymously.', 'ማንነትዎን ሳይገልጹ መጥቆም ይችላሉ።')}</p>
            <TextField label={t('Full name', 'ሙሉ ስም')} value={authName} onChange={setAuthName} />
            <TextField label="Phone number" value={authPhone} onChange={setAuthPhone} placeholder="09XXXXXXXX" />
            <TextField label={t('Choose a PIN (4–8 digits)', 'የይለፍ ቁጥር ይምረጡ')} type="password" value={authPin} onChange={setAuthPin} />
            <TextField label={t('Confirm PIN', 'የይለፍ ቁጥር ያረጋግጡ')} type="password" value={authPin} onChange={() => undefined} />
            <Button full onClick={() => go('home')}>{label('Create Account')}</Button>
            <button className="text-link" onClick={() => navigate('login')}>
              {t('Already have an account? Sign In', 'መለያ አለዎት? ግባ')}
            </button>
          </div>
        )

      case 'home':
        return (
          <div className="phone-screen home-screen">
            <div className="home-header">
              <div><span className="greeting">{t('Good morning', 'እንኳን አደረሳችሁ')}</span><h2>AARB</h2></div>
              <div className="home-header-actions">
                <button className="circle-button" onClick={() => { setNotificationsOpen(true); setUnread(0) }} aria-label="Notifications">
                  <Icon name="bell" size={22} />
                  {unread > 0 && <span className="badge">{unread > 9 ? '9+' : unread}</span>}
                </button>
                <button className="avatar" onClick={() => navigate('profile')}>DE</button>
              </div>
            </div>
            <SectionLabel>{label('Impact Stats')}</SectionLabel>
            <div className="stat-grid">
              <StatCard value={String(impactStats.reportsThisMonth)} label={label('Reports This Month')} footnote="↑ 12% vs last month" onClick={() => { setStatsMode('reports'); navigate('stats') }} />
              <StatCard value={`${impactStats.avgResponseHours}h`} label={label('Avg Response Time')} footnote="↓ 15 min improvement" onClick={() => { setStatsMode('response'); navigate('stats') }} />
            </div>
            <div className="banner-list">
              <button className="action-banner action-banner--primary" onClick={() => navigate('create')}>
                <span className="action-icon"><Icon name="warning" size={24} /></span>
                <span><strong>{label('Report Incident')}</strong><small>6 types available</small></span>
                <Icon name="arrowRight" size={18} />
              </button>
              <button className="action-banner" onClick={() => navigate('track')}>
                <span className="action-icon"><Icon name="search" size={24} /></span>
                <span><strong>{label('Track My Report')}</strong><small>{t('Enter your case reference number', 'የመለያ ቁጥርዎን ያስገቡ')}</small></span>
                <Icon name="arrowRight" size={18} />
              </button>
              <button className="action-banner" onClick={() => navigate('tin')}>
                <span className="action-icon"><Icon name="shield" size={24} /></span>
                <span><strong>{label('Verify a TIN')}</strong><small>{t("Check that a seller's TIN is legal", 'የሻጩ ቲን ሕጋዊ መሆኑን ያረጋግጡ')}</small></span>
                <Icon name="arrowRight" size={18} />
              </button>
            </div>
            <div className="section-heading">
              <SectionLabel>{label('Recent Reports')}</SectionLabel>
              <button className="link-button" onClick={() => go('reports')}>{label('View All')}</button>
            </div>
            <div className="report-list">
              {demoReports.slice(0, 4).map((report) => (
                <button key={report.reference} className="report-card" onClick={() => { setTracked(report); setTrackSearched(true); navigate('track') }}>
                  <span className="tile"><Icon name="warning" size={21} /></span>
                  <span className="report-card-body"><strong>{report.category}</strong><StatusChip status={report.status} small /></span>
                  <span className="report-card-date"><Icon name="clock" size={13} />14 Nov</span>
                </button>
              ))}
            </div>
            <button className="hotline-fab" onClick={() => setHotlineOpen(true)} aria-label="Hotline"><Icon name="phone" size={22} /></button>
          </div>
        )

      case 'reports':
        return (
          <div className="phone-screen">
            <ScreenHeader title={label('Reports')} onBack={back} trailing={<span className="count-pill">6</span>} />
            <p className="screen-intro">{t('Reports sent from this phone', 'ከዚህ ስልክ የተላኩ ጥቆማዎች')}</p>
            <div className="report-list">
              {demoReports.map((report) => (
                <button key={report.reference} className="report-card" onClick={() => { setTracked(report); setTrackQuery(report.reference); setTrackSearched(true); navigate('track') }}>
                  <span className="tile"><Icon name="warning" size={21} /></span>
                  <span className="report-card-body"><strong>{report.category}</strong><StatusChip status={report.status} small /><small className="mono">{report.reference}</small></span>
                  <Icon name="chevronRight" size={16} />
                </button>
              ))}
            </div>
          </div>
        )

      case 'create':
        return (
          <div className="phone-screen form-screen">
            <ScreenHeader title={label('Select Report Category')} subtitle={t('Choose the type of issue you are reporting', 'የሚጠቁሙትን ጉዳይ አይነት ይምረጡ')} onBack={back} />
            <div className="upload-box">
              <span className="tile"><Icon name="upload" size={22} /></span>
              <strong>{t('Tap to add files, photos and videos', 'ፋይሎች፣ ፎቶዎችና ቪዲዮዎች ያክሉ')}</strong>
              <small>{t('Up to 4 attachments', 'እስከ 4 የተያያዙ ፋይሎች')}</small>
              <div className="attachment-slots">
                {[0, 1, 2, 3].map((index) => (
                  <button key={index} className={`attachment-slot${attachments[index] ? ' attachment-slot--filled' : ''}`} onClick={() => {
                    if (attachments[index]) setAttachments(attachments.filter((_, i) => i !== index))
                    else setAttachments([...attachments, ['receipt.jpg', 'scene.png', 'voice.m4a', 'evidence.pdf'][index]])
                  }}>
                    {attachments[index] ? <Icon name="image" size={16} /> : <Icon name="plus" size={16} />}
                  </button>
                ))}
              </div>
            </div>
            <SectionLabel>Incident Type</SectionLabel>
            <div className="dropdown">
              <button onClick={() => setSelectedCategory('')} className={selectedCategory ? '' : 'muted'}>
                {selectedCategory || 'Select incident type'} <Icon name="chevronDown" size={16} />
              </button>
              <div className="radio-list">
                {categories.map((category) => (
                  <button key={category} className={`radio-row${selectedCategory === category ? ' radio-row--selected' : ''}`} onClick={() => setSelectedCategory(category)}>
                    <span className="radio" />{category}
                  </button>
                ))}
              </div>
            </div>
            <SectionLabel>{label('Description')}</SectionLabel>
            <TextField value={description} onChange={setDescription} multiline placeholder={t('Describe what happened...', 'የሆነውን ይግለጹ...')} />
            <SectionLabel>Voice Message</SectionLabel>
            <button className={`voice-box${recording ? ' voice-box--recording' : ''}`} onClick={() => {
              if (recording) { setRecording(false); setVoiceRecorded(true) } else setRecording(true)
            }}>
              <span className="voice-icon"><Icon name={recording ? 'pause' : 'mic'} size={20} /></span>
              <span>
                <strong>{recording ? 'Recording… tap to stop' : voiceRecorded ? 'Voice message recorded' : 'Record a voice message'}</strong>
                <small>{recording ? '0:12 / 3:00' : 'Up to 3 minutes'}</small>
              </span>
              {voiceRecorded && <Icon name="trash" size={16} />}
            </button>
            <SectionLabel>Current Location</SectionLabel>
            <MockMap height={120} label={subCity} pins={[{ top: '42%', left: '48%' }]} />
            <div className="location-row">
              <span>{subCity} Sub-City</span>
              <select value={subCity} onChange={(e) => setSubCity(e.target.value)} aria-label="Change sub-city">
                {subCities.map((city) => <option key={city}>{city}</option>)}
              </select>
            </div>
            <label className="switch-row">
              <span><strong>{t('Report anonymously', 'ማንነትዎን ይደብቁ')}</strong><small>{t("Your name won't be visible to others", 'ስምዎ ለሌሎች አይታይም')}</small></span>
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
              <span className="switch" />
            </label>
            <Button full onClick={submitReport}>{label('Submit Report')}</Button>
          </div>
        )

      case 'success':
        return (
          <div className="phone-screen success-screen">
            <button className="close-button" onClick={() => go('home')}><Icon name="close" size={20} /></button>
            <div className="success-icon"><Icon name="check" size={34} /></div>
            <span className="success-emoji">🎉</span>
            <h2>{label('Report Submitted')}</h2>
            <p className="muted">{t('Thank you for helping keep Addis Ababa safe & compliant.', 'የአዲስ አበባን ገቢና ፍትሃዊነት ስለጠበቁ እናመሰግናለን።')}</p>
            <div className="ticket-card">
              <SectionLabel>REPORT ID</SectionLabel>
              <strong className="mono ticket-ref">#{submittedReport.reference}</strong>
              <StatusChip status={submittedReport.status} />
              <div className="divider" />
              <DetailRow label="Location" value={submittedReport.location} />
              <DetailRow label="Submitted" value="Nov 24, 2026 — 10:30 AM" />
              <DetailRow label="Unit" value="Awaiting assignment to a unit" />
              <button className="ticket-hotline" onClick={() => setHotlineOpen(true)}><Icon name="phone" size={16} /> Hotline 8688</button>
            </div>
            <Button full variant="light" icon="copy" onClick={() => showFlash('Reference copied (demo only)')}>Share Report</Button>
            <button className="text-link" onClick={() => go('home')}>{label('Return to Home')}</button>
          </div>
        )

      case 'track':
        return (
          <div className="phone-screen">
            <ScreenHeader title={label('Track My Report')} subtitle={t('Enter your case reference number', 'የመለያ ቁጥርዎን ያስገቡ')} onBack={back} />
            <div className="search-card">
              <span className="field-label">CASE REFERENCE NUMBER</span>
              <input className="mono" value={trackQuery} onChange={(e) => setTrackQuery(e.target.value.toUpperCase())} placeholder="AARB-2026-00000" />
              <Button full onClick={() => {
                setTracked(demoReports.find((report) => report.reference === trackQuery.trim()) ?? null)
                setTrackSearched(true)
              }}>{label('Check Status')}</Button>
            </div>
            <div className="quick-row">
              {demoReports.slice(0, 3).map((report) => (
                <button key={report.reference} className="quick-chip mono" onClick={() => {
                  setTrackQuery(report.reference); setTracked(report); setTrackSearched(true)
                }}>{report.reference.replace('AARB-2026-', '#')}</button>
              ))}
            </div>
            {trackSearched && !tracked && <EmptyState icon="search" title={t('No report found with that reference number.', 'በዚህ መለያ ቁጥር ሪፖርት አልተገኘም።')} />}
            {trackSearched && tracked && (
              <>
                <div className="summary-card">
                  <div className="summary-top"><strong className="mono">{tracked.reference}</strong><StatusChip status={tracked.status} small /></div>
                  <p>{tracked.category}</p>
                  <DetailRow label="Submitted" value="Nov 14, 09:32" />
                  <DetailRow label="Assigned unit" value={tracked.assignedUnit ?? 'Awaiting assignment'} />
                </div>
                <SectionLabel>{label('STATUS TIMELINE')}</SectionLabel>
                <div className="timeline">
                  {tracked.timeline.map((step) => (
                    <div key={step.title} className={`timeline-step${step.date ? ' timeline-step--done' : ''}`}>
                      <span className="timeline-dot">{step.date && <Icon name="check" size={13} />}</span>
                      <div><strong>{step.title}</strong><small>{step.date ?? 'Pending'}</small></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )

      case 'tin':
        return (
          <div className="phone-screen">
            <ScreenHeader title={label('Verify a TIN')} subtitle={t("Check that a seller's TIN is legal", 'የሻጩ ቲን ሕጋዊ መሆኑን ያረጋግጡ')} onBack={back} />
            <div className="tin-search">
              <span className="field-label">TIN NUMBER</span>
              <div className="tin-search-row">
                <input className="mono" value={tinQuery} onChange={(e) => setTinQuery(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="0000000000" />
                <Button onClick={checkTin}>{label('Check')}</Button>
              </div>
              {tinQuery.length > 0 && tinQuery.length !== 10 && <p className="error-text">A TIN has exactly 10 digits.</p>}
            </div>
            <div className="quick-row">
              {tinRecords.map((record) => (
                <button key={record.tin} className="quick-chip mono" onClick={() => { setTinQuery(record.tin); setTinResult(record); setTinSearched(true) }}>{record.tin}</button>
              ))}
            </div>
            {tinSearched && !tinResult && <EmptyState icon="search" title={t('TIN not registered', 'ቲኑ አልተመዘገበም')} body={t('Enter the 10-digit TIN printed on the receipt or licence.', 'በደረሰኝው ላይ ያለውን ባለ 10 አሃዝ ቲን ያስገቡ።')} />}
            {tinSearched && tinResult && (
              <>
                <div className={`tin-banner tin-banner--${tinResult.status.toLowerCase()}`}>
                  <Icon name={tinResult.status === 'ACTIVE' ? 'checkCircle' : tinResult.status === 'ILLEGAL' ? 'xCircle' : 'shield'} size={30} />
                  <strong>{tinResult.status === 'ACTIVE' ? t('Valid TIN', 'ትክክለኛ ቲን') : tinResult.status === 'INACTIVE' ? t('TIN not active', 'ቲኑ በሥራ ላይ አይደለም') : tinResult.status === 'ILLEGAL' ? t('Illegal TIN', 'ሕገወጥ ቲን') : t('TIN not registered', 'ቲኑ አልተመዘገበም')}</strong>
                  <span className="mono">{tinResult.tin}</span>
                  <p>{tinResult.status === 'ACTIVE' ? t('This TIN is registered and active.', 'ይህ ቲን የተመዘገበ እና በሥራ ላይ ያለ ነው።') : tinResult.status === 'INACTIVE' ? t('Registered but suspended or cancelled.', 'ተመዝግቧል፤ ነገር ግን ታግዷል ወይም ተሰርዟል።') : tinResult.status === 'ILLEGAL' ? t('The bureau has confirmed that this TIN is being used illegally.', 'ይህ ቲን በሕገወጥ መንገድ ጥቅም ላይ እየዋለ መሆኑን ቢሮው አረጋግጧል።') : t('No taxpayer is registered under this TIN.', 'በዚህ ቲን የተመዘገበ ግብር ከፋይ የለም።')}</p>
                </div>
                {tinResult.status !== 'NOT_REGISTERED' && (
                  <div className="detail-card">
                    <DetailRow label="Owner" value={tinResult.ownerName} />
                    <DetailRow label="Business" value={tinResult.businessName} />
                    <DetailRow label="Taxpayer category" value={tinResult.category} />
                    <DetailRow label="Phone" value={tinResult.phoneNumber} />
                    <DetailRow label="Address" value={tinResult.address} />
                    <DetailRow label="Registered on" value={tinResult.registeredOn} />
                    <DetailRow label="Registry status" value={tinResult.registryStatus} />
                    <DetailRow label="Reason" value={tinResult.reason ?? '—'} />
                  </div>
                )}
                <Button full icon="warning" variant={tinResult.status === 'ACTIVE' ? 'primary' : 'outline'} onClick={() => { setSelectedCategory('Illegal Trade / Invalid TIN'); navigate('create') }}>
                  {label('Report this seller')}
                </Button>
                <p className="helper">{t('You will mark on the map where the trade is happening.', 'ንግዱ የሚካሄድበትን ቦታ በካርታው ላይ ያመለክታሉ።')}</p>
              </>
            )}
          </div>
        )

      case 'stats':
        return (
          <div className="phone-screen">
            <ScreenHeader title={label(statsMode === 'reports' ? 'Reports This Month' : 'Avg Response Time')} subtitle={t('All reports sent to the bureau', 'ለቢሮው የተላኩ ሁሉም ሪፖርቶች')} onBack={back} />
            <Segmented
              value={statsMode}
              onChange={setStatsMode}
              options={[{ id: 'reports', label: label('Reports This Month') }, { id: 'response', label: label('Avg Response Time') }]}
            />
            <div className="stats-hero">
              <strong>{statsMode === 'reports' ? impactStats.reportsThisMonth : `${impactStats.avgResponseHours}h`}</strong>
              <span>{statsMode === 'reports' ? '↑ 12% vs last month' : '↓ 15 min improvement'}</span>
            </div>
            {statsMode === 'response' && <p className="screen-intro">{t('The time from a report being sent until bureau staff first act on it.', 'ከጥቆማ መላክ እስከ የቢሮ ሰራተኞች የመጀመሪያ እርምጃ ድረስ ያለው ጊዜ።')}</p>}
            <div className="facts-card">
              <DetailRow label={t('This month', 'በዚህ ወር')} value={statsMode === 'reports' ? '128' : '6.5h'} />
              <DetailRow label={t('Last month', 'ባለፈው ወር')} value={statsMode === 'reports' ? '114' : '7.75h'} />
              {statsMode === 'response' && <><DetailRow label="Answered this month" value="96" /><DetailRow label="Waiting for a first response" value="32" /></>}
            </div>
            <SectionLabel>BY TYPE, THIS MONTH</SectionLabel>
            <div className="progress-list">
              {impactStats.byCategory.map((item) => <ProgressBar key={item.key} label={item.key} value={item.count} max={impactStats.reportsThisMonth} />)}
            </div>
            <SectionLabel>BY STAGE, THIS MONTH</SectionLabel>
            <div className="progress-list">
              {impactStats.byStatus.map((item) => <ProgressBar key={item.key} label={item.key} value={item.count} max={impactStats.reportsThisMonth} />)}
            </div>
          </div>
        )

      case 'chat':
        return (
          <div className="phone-screen chat-screen">
            <ScreenHeader title={label('Chat')} subtitle={t('Message with assistant', 'ከረዳቱ ጋር ይወያዩ')} onBack={back} />
            {chatMessages.length === 0 ? (
              <div className="chat-greeting">
                <span>👋</span>
                <h2>{lang === 'am' ? 'ሰላም!' : 'Hey there!'}</h2>
                <h2>{lang === 'am' ? 'ምን ልርዳዎ?' : 'How can I help you?'}</h2>
                <p>{t('I’m your Report Assistant AI', 'እኔ የሪፖርት አጋዥ AI ረዳት ነኝ')}</p>
              </div>
            ) : (
              <div className="chat-thread">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`chat-bubble ${message.isUser ? 'chat-bubble--user' : 'chat-bubble--ai'}`}>
                    <p>{message.text}</p>
                    {message.citations.length > 0 && (
                      <div className="citation-row">
                        {message.citations.map((citation) => <span key={citation} className="citation">{citation}</span>)}
                      </div>
                    )}
                    <small>{message.isUser ? '10:24' : '10:25'}</small>
                  </div>
                ))}
                {chatBusy && <div className="chat-bubble chat-bubble--ai"><p>Assistant is typing…</p></div>}
              </div>
            )}
            {chatMessages.length === 0 ? (
              <div className="suggestion-list">
                {chatSuggestions.map((suggestion) => (
                  <button key={suggestion} onClick={() => chatSend(suggestion)}>{suggestion}<Icon name="chevronRight" size={14} /></button>
                ))}
              </div>
            ) : (
              <div className="followup-row">
                {chatFollowUps.map((suggestion) => <button key={suggestion} onClick={() => chatSend(suggestion)}>{suggestion}</button>)}
              </div>
            )}
            <div className="chat-input">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') chatSend(chatInput) }} placeholder={t('Type something...', 'ጥያቄዎን እዚህ ይጻፉ...')} />
              <button onClick={() => chatSend(chatInput)} disabled={chatBusy} aria-label="Send"><Icon name="send" size={18} /></button>
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="phone-screen">
            <ScreenHeader title={label('Profile')} />
            <div className="profile-card">
              <span className="profile-avatar">DE</span>
              <strong>Demo Citizen</strong>
              <p>{t('Sign in to follow your reports on any phone', 'ሪፖርቶችዎን በማንኛውም ስልክ ለመከታተል ይግቡ')}</p>
              <div className="profile-actions">
                <Button small onClick={() => navigate('login')}>{label('Sign In')}</Button>
                <Button small variant="outline" onClick={() => navigate('signup')}>{label('Create Account')}</Button>
              </div>
            </div>
            <SectionLabel>PREFERENCES</SectionLabel>
            <div className="detail-card">
              {([['en', 'English'], ['am', 'አማርኛ (Amharic)'], ['om', 'Afaan Oromoo']] as const).map(([code, name]) => (
                <button key={code} className="language-row" onClick={() => { setLang(code); showFlash(`Language switched to ${name}`) }}>
                  <span>{name}</span>{lang === code && <Icon name="checkCircle" size={18} />}
                </button>
              ))}
              <label className="switch-row switch-row--plain">
                <span><Icon name="bell" size={17} /> <strong>{label('Push Notifications')}</strong></span>
                <input type="checkbox" checked={pushEnabled} onChange={(e) => setPushEnabled(e.target.checked)} />
                <span className="switch" />
              </label>
            </div>
            <SectionLabel>SECURITY & PRIVACY</SectionLabel>
            <div className="detail-card">
              <button className="language-row" onClick={() => setPolicyOpen(true)}><span><Icon name="shield" size={17} /> Whistleblower Protection Policy</span><Icon name="chevronRight" size={16} /></button>
            </div>
            <div className="contact-card">
              <strong>{t('Official Agency Contact', 'የቢሮው ይፋዊ አድራሻ')}</strong>
              <p>Addis Ababa City Administration Revenues Bureau<br />Hotline: 8688 | Emergency: 911</p>
            </div>
            <p className="version">AARB Citizen App v1.0.0</p>
          </div>
        )
    }
  }, [screen, lang, trackQuery, tracked, trackSearched, tinQuery, tinResult, tinSearched, statsMode, selectedCategory, description, subCity, anonymous, attachments, recording, voiceRecorded, submittedReport, chatMessages, chatInput, chatBusy, authPhone, authPin, authName, authError, unread, pushEnabled, back, go, navigate, chatSend, submitReport, checkTin, showFlash, t, label])

  const nav = ['onboarding', 'login', 'signup', 'create', 'success', 'track', 'tin', 'stats'].includes(screen)
    ? undefined
    : (
      <BottomNav
        items={navItems}
        active={screen}
        onSelect={(id) => go(id as ScreenId)}
        centerAction={{ onClick: () => navigate('create'), active: screen === 'create' }}
      />
    )

  return (
    <div className="showcase-grid">
      <PhoneFrame label={screenInfo[screen].title} nav={nav} className="phone-wrap--citizen">
        {screenNode}
        {flash && <div className="phone-toast">{flash}</div>}
        {notificationsOpen && (
          <div className="sheet-backdrop" onClick={() => setNotificationsOpen(false)}>
            <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-handle" />
              <div className="sheet-title"><strong>{label('Notifications')}</strong><button onClick={() => setNotificationsOpen(false)}><Icon name="close" size={18} /></button></div>
              {demoNotifications.map((notification, index) => (
                <button key={index} className="notification-row" onClick={() => { setNotificationsOpen(false); setTrackQuery(notification.reference); setTracked(demoReports.find((r) => r.reference === notification.reference) ?? null); setTrackSearched(true); navigate('track') }}>
                  <span className={`unread-dot${notification.read ? ' unread-dot--read' : ''}`} />
                  <span><strong>{notification.category}</strong><StatusChip status={notification.status} small />{notification.note && <small>{notification.note}</small>}<small className="mono">{notification.reference} · Nov {17 + index}, 08:15</small></span>
                </button>
              ))}
            </div>
          </div>
        )}
        {hotlineOpen && (
          <div className="modal-backdrop" onClick={() => setHotlineOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h4>{t('Official Agency Contact', 'የቢሮው ይፋዊ አድራሻ')}</h4>
              <p>{t('Addis Ababa Revenues Bureau Hotline: 8688\nCity Emergency: 911', 'የአዲስ አበባ ገቢዎች ቢሮ ነፃ መስመር፦ 8688\nየከተማ አደጋ ጊዜ፦ 911')}</p>
              <div className="modal-actions"><Button small variant="outline" onClick={() => setHotlineOpen(false)}>Close</Button><Button small icon="phone" onClick={() => setHotlineOpen(false)}>Call 8688</Button></div>
            </div>
          </div>
        )}
        {policyOpen && (
          <div className="modal-backdrop" onClick={() => setPolicyOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h4>Whistleblower Protection Policy</h4>
              <p>Whistleblowers reporting tax evasion, fraud, and corruption to the Addis Ababa Revenues Bureau are legally protected against retaliation, identity exposure, or employer termination under Proclamation No. 983/2016.</p>
              <div className="modal-actions"><Button small onClick={() => setPolicyOpen(false)}>Understood</Button></div>
            </div>
          </div>
        )}
      </PhoneFrame>

      <aside className="showcase-panel">
        <div className="panel-eyebrow"><Icon name="sparkles" size={15} /> Interactive walkthrough</div>
        <h3>Citizen mobile app</h3>
        <p className="panel-lead">A confidential reporting experience built with Flutter 3, Material 3 and Bloc. Tap any screen in the phone, or pick one below to jump straight to it.</p>
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
          <Segmented value={lang} onChange={setLang} options={[{ id: 'en', label: 'EN' }, { id: 'am', label: 'አማ' }, { id: 'om', label: 'OM' }]} />
        </div>
        <div className="panel-chips">
          <DemoNote small /> <span>Flutter 3.44</span><span>Material 3</span><span>Bloc</span><span>Offline-tolerant</span><span>3 languages</span>
        </div>
      </aside>
    </div>
  )
}
