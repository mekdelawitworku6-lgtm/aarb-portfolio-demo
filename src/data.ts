/**
 * Fictional demo data only.
 * Nothing in this file corresponds to a real taxpayer, report, officer or case.
 */

export type ReportStatus =
  | 'Submitted'
  | 'Report Received'
  | 'Under Review'
  | 'Assigned to Investigator'
  | 'Resolved'
  | 'Pending'

export interface TimelineStep {
  title: string
  date: string | null
}

export interface DemoReport {
  reference: string
  category: string
  status: ReportStatus
  createdAt: string
  location: string
  assignedUnit: string | null
  description: string
  anonymous: boolean
  timeline: TimelineStep[]
}

export const categories = [
  'Corruption / Bribery',
  'Employee Misconduct',
  'VAT / Tax Evasion',
  'Unregistered Business',
  'Illegal Trade / Invalid TIN',
  'Other Issue',
]

export const subCities = [
  'Addis Ketema',
  'Akaky Kaliti',
  'Arada',
  'Bole',
  'Gullele',
  'Kirkos',
  'Kolfe Keranio',
  'Lemi Kura',
  'Lideta',
  'Nifas Silk-Lafto',
  'Yeka',
]

export const allStatuses: ReportStatus[] = [
  'Submitted',
  'Under Review',
  'Assigned to Investigator',
  'Resolved',
]

const timeline = (current: number, dates: (string | null)[]): TimelineStep[] =>
  ['Report Received', 'Under Review', 'Assigned to Investigator', 'Resolved'].map((title, i) => ({
    title,
    date: i <= current ? dates[i] ?? '2026-11-16T10:00:00Z' : null,
  }))

export const demoReports: DemoReport[] = [
  {
    reference: 'AARB-2026-04390',
    category: 'VAT / Tax Evasion',
    status: 'Assigned to Investigator',
    createdAt: '2026-11-14T09:32:00Z',
    location: 'Bole Sub-City, Addis Ababa',
    assignedUnit: 'Audit Unit',
    description:
      'A shop declined to issue a VAT receipt for a purchase. (Fictional example used for this portfolio demo.)',
    anonymous: true,
    timeline: timeline(2, ['2026-11-14T09:32:00Z', '2026-11-15T11:10:00Z', '2026-11-17T08:15:00Z']),
  },
  {
    reference: 'AARB-2026-04371',
    category: 'Corruption / Bribery',
    status: 'Under Review',
    createdAt: '2026-11-12T14:05:00Z',
    location: 'Lideta Sub-City, Addis Ababa',
    assignedUnit: null,
    description: 'Unsolicited payment requested at a service counter. Fictional scenario.',
    anonymous: true,
    timeline: timeline(1, ['2026-11-12T14:05:00Z', '2026-11-13T09:40:00Z']),
  },
  {
    reference: 'AARB-2026-04358',
    category: 'Unregistered Business',
    status: 'Submitted',
    createdAt: '2026-11-10T11:22:00Z',
    location: 'Kirkos Sub-City, Addis Ababa',
    assignedUnit: null,
    description: 'Commercial activity observed without a displayed business licence.',
    anonymous: false,
    timeline: timeline(0, ['2026-11-10T11:22:00Z']),
  },
  {
    reference: 'AARB-2026-04312',
    category: 'Employee Misconduct',
    status: 'Resolved',
    createdAt: '2026-11-03T16:48:00Z',
    location: 'Arada Sub-City, Addis Ababa',
    assignedUnit: 'Ethics & Discipline Unit',
    description: 'Reported discourteous conduct by a field officer. Case closed in this fictional dataset.',
    anonymous: true,
    timeline: timeline(3, [
      '2026-11-03T16:48:00Z',
      '2026-11-04T08:30:00Z',
      '2026-11-06T10:15:00Z',
      '2026-11-20T15:00:00Z',
    ]),
  },
  {
    reference: 'AARB-2026-04289',
    category: 'Illegal Trade / Invalid TIN',
    status: 'Under Review',
    createdAt: '2026-10-29T10:12:00Z',
    location: 'Addis Ketema Sub-City, Addis Ababa',
    assignedUnit: null,
    description: 'Seller used a TIN that did not match the receipt. Fictional training case.',
    anonymous: true,
    timeline: timeline(1, ['2026-10-29T10:12:00Z', '2026-10-30T13:20:00Z']),
  },
  {
    reference: 'AARB-2026-04241',
    category: 'Other Issue',
    status: 'Resolved',
    createdAt: '2026-10-21T08:45:00Z',
    location: 'Yeka Sub-City, Addis Ababa',
    assignedUnit: 'Revenue Protection Unit',
    description: 'General enquiry resolved by the bureau. Fictional example.',
    anonymous: false,
    timeline: timeline(3, [
      '2026-10-21T08:45:00Z',
      '2026-10-22T09:00:00Z',
      '2026-10-24T11:00:00Z',
      '2026-11-02T14:30:00Z',
    ]),
  },
]

export interface DemoNotification {
  reference: string
  category: string
  status: ReportStatus
  note: string | null
  createdAt: string
  read: boolean
}

export const demoNotifications: DemoNotification[] = [
  {
    reference: 'AARB-2026-04390',
    category: 'VAT / Tax Evasion',
    status: 'Assigned to Investigator',
    note: 'Assigned to the Audit Unit.',
    createdAt: '2026-11-17T08:15:00Z',
    read: false,
  },
  {
    reference: 'AARB-2026-04371',
    category: 'Corruption / Bribery',
    status: 'Under Review',
    note: 'Your report is now being reviewed.',
    createdAt: '2026-11-13T09:40:00Z',
    read: false,
  },
  {
    reference: 'AARB-2026-04312',
    category: 'Employee Misconduct',
    status: 'Resolved',
    note: 'The case has been closed.',
    createdAt: '2026-11-20T15:00:00Z',
    read: false,
  },
  {
    reference: 'AARB-2026-04358',
    category: 'Unregistered Business',
    status: 'Submitted',
    note: null,
    createdAt: '2026-11-10T11:22:00Z',
    read: true,
  },
]

export interface TinRecord {
  tin: string
  status: 'ACTIVE' | 'INACTIVE' | 'NOT_REGISTERED' | 'ILLEGAL'
  ownerName: string
  businessName: string
  phoneNumber: string
  address: string
  category: string
  registeredOn: string
  registryStatus: 'Active' | 'Suspended' | 'Cancelled' | '—'
  reason: string | null
}

export const tinRecords: TinRecord[] = [
  {
    tin: '1234567890',
    status: 'ACTIVE',
    ownerName: 'Demo Owner A',
    businessName: 'Sample Goods Trading',
    phoneNumber: '+251 91 000 0001',
    address: 'Bole, 03, House 12',
    category: 'VAT registered',
    registeredOn: '2019-04-12',
    registryStatus: 'Active',
    reason: null,
  },
  {
    tin: '0987654321',
    status: 'INACTIVE',
    ownerName: 'Demo Owner B',
    businessName: 'Example Retail Shop',
    phoneNumber: '+251 92 000 0002',
    address: 'Arada, 05, House 8',
    category: 'Small taxpayer',
    registeredOn: '2020-08-23',
    registryStatus: 'Suspended',
    reason: 'Fictional suspension for demo purposes.',
  },
  {
    tin: '1111111111',
    status: 'ILLEGAL',
    ownerName: 'Demo Owner C',
    businessName: 'Placeholder Enterprises',
    phoneNumber: '+251 93 000 0003',
    address: 'Kirkos, 02, House 4',
    category: 'VAT registered',
    registeredOn: '2018-02-01',
    registryStatus: 'Cancelled',
    reason: 'TIN flagged in this fictional demo dataset.',
  },
  {
    tin: '2222222222',
    status: 'NOT_REGISTERED',
    ownerName: '—',
    businessName: '—',
    phoneNumber: '—',
    address: '—',
    category: '—',
    registeredOn: '—',
    registryStatus: '—',
    reason: null,
  },
]

export const impactStats = {
  reportsThisMonth: 128,
  reportsLastMonth: 114,
  trendVsLastMonthPercentage: 12,
  avgResponseHours: 6.5,
  avgResponseHoursLastMonth: 7.75,
  avgResponseImprovementMinutes: 15,
  answeredThisMonth: 96,
  waitingThisMonth: 32,
  byCategory: [
    { key: 'VAT / Tax Evasion', count: 42 },
    { key: 'Corruption / Bribery', count: 31 },
    { key: 'Employee Misconduct', count: 21 },
    { key: 'Unregistered Business', count: 18 },
    { key: 'Illegal Trade / Invalid TIN', count: 10 },
    { key: 'Other Issue', count: 6 },
  ],
  byStatus: [
    { key: 'Submitted', count: 24 },
    { key: 'Under Review', count: 37 },
    { key: 'Assigned to Investigator', count: 45 },
    { key: 'Resolved', count: 22 },
  ],
}

export const chatSuggestions = [
  'How do I report VAT evasion anonymously?',
  'ቫት ደረሰኝ ካልሰጡኝ ምን ማድረግ አለብኝ?',
  'What evidence is needed for fake receipts?',
  'What happens after I submit a report?',
]

export const chatFollowUps = [
  'What is the penalty for not issuing a receipt?',
  'Who has to register for VAT?',
  'Is there a reward for reporting tax evasion?',
  'What counts as tax evasion?',
]

export const chatReplies: Record<string, { reply: string; citations: string[] }> = {
  'How do I report VAT evasion anonymously?': {
    reply:
      'Choose “VAT / Tax Evasion” in the Report Incident screen, describe what happened and leave “Report anonymously” switched on. You will receive a reference number you can use to follow the case without giving your name.',
    citations: ['Citizen Reporting Guide', 'Whistleblower Protection Policy'],
  },
  'What evidence is needed for fake receipts?': {
    reply:
      'Useful evidence includes the receipt, a photo of the location, the date and time, and any seller TIN shown. You can attach up to four files and a voice message.',
    citations: ['Evidence Handling Directive'],
  },
  'What happens after I submit a report?': {
    reply:
      'A report moves through four stages: Report Received, Under Review, Assigned to Investigator and Resolved. Status changes appear in your notifications and on the tracking screen.',
    citations: ['Case Management Procedure'],
  },
  'What is the penalty for not issuing a receipt?': {
    reply:
      'The assistant answers only from the bureau knowledge base. In this demo the cited training document summarises the penalty for failing to issue a receipt.',
    citations: ['Ethiopian VAT Proclamation No. 285/2002'],
  },
  'Who has to register for VAT?': {
    reply:
      'VAT registration obligations depend on turnover and business type. The knowledge-base article cited below is the source used for this answer.',
    citations: ['Ethiopian VAT Proclamation No. 285/2002'],
  },
  'Is there a reward for reporting tax evasion?': {
    reply:
      'Reward eligibility is set by bureau policy and assessed after a report is verified. See the cited policy document for the full conditions.',
    citations: ['Reward Policy Directive'],
  },
  'What counts as tax evasion?': {
    reply:
      'Examples include under-declaring sales, issuing fake receipts, unregistered trading and misuse of a TIN. Each example is described in the cited training material.',
    citations: ['Tax Evasion Identification Guide'],
  },
}

export const defaultChatReply = {
  reply:
    'This answer comes from the bureau knowledge base. In the live app the assistant retrieves the relevant passages, cites the documents it used and can look up a case when you include a reference number.',
  citations: ['Citizen Reporting Guide'],
}

export interface OfficerCase {
  id: string
  category: string
  status: 'Assigned to Investigator' | 'Under Review' | 'Submitted' | 'Resolved'
  location: string
  priority: 'High' | 'Medium' | 'Low'
  receivedAt: string
  due: string
  notes: string[]
  reference: string
}

export const officerCases: OfficerCase[] = [
  {
    id: 'CASE-0148',
    reference: 'AARB-2026-04390',
    category: 'VAT / Tax Evasion',
    status: 'Assigned to Investigator',
    location: 'Bole Sub-City, Woreda 03',
    priority: 'High',
    receivedAt: '14 Nov 2026, 09:32',
    due: 'Today, 17:00',
    notes: ['Fictional demo note: follow up on the receipt evidence.'],
  },
  {
    id: 'CASE-0146',
    reference: 'AARB-2026-04371',
    category: 'Corruption / Bribery',
    status: 'Assigned to Investigator',
    location: 'Lideta Sub-City, Woreda 02',
    priority: 'Medium',
    receivedAt: '12 Nov 2026, 14:05',
    due: 'Tomorrow, 12:00',
    notes: [],
  },
  {
    id: 'CASE-0141',
    reference: 'AARB-2026-04358',
    category: 'Unregistered Business',
    status: 'Under Review',
    location: 'Kirkos Sub-City, Woreda 01',
    priority: 'Low',
    receivedAt: '10 Nov 2026, 11:22',
    due: '27 Nov 2026',
    notes: ['Fictional demo note: verify business licence status.'],
  },
  {
    id: 'CASE-0132',
    reference: 'AARB-2026-04312',
    category: 'Employee Misconduct',
    status: 'Resolved',
    location: 'Arada Sub-City, Woreda 05',
    priority: 'Low',
    receivedAt: '03 Nov 2026, 16:48',
    due: 'Closed',
    notes: ['Fictional demo note: closure recorded after review.'],
  },
]

export type AdminPageId =
  | 'dashboard'
  | 'reports'
  | 'officers'
  | 'taxpayers'
  | 'tin-flags'
  | 'hierarchy'
  | 'analytics'
  | 'audit'
  | 'knowledge'
  | 'settings'
  | 'chat-log'

export interface AdminUser {
  name: string
  role: string
  office: string
  status: 'Active' | 'View only' | 'Suspended'
  lastActive: string
}

export const adminUsers: AdminUser[] = [
  { name: 'Demo Super Admin', role: 'System Super Admin', office: 'City Bureau', status: 'Active', lastActive: '2 min ago' },
  { name: 'Demo City Admin', role: 'City Bureau Admin', office: 'City Bureau', status: 'Active', lastActive: '18 min ago' },
  { name: 'Demo Sub-City Admin', role: 'Sub-City Admin', office: 'Bole Sub-City', status: 'Active', lastActive: '1 hour ago' },
  { name: 'Demo Woreda Admin', role: 'Woreda Admin', office: 'Bole / Woreda 03', status: 'View only', lastActive: 'Yesterday' },
  { name: 'Demo Field Officer', role: 'Field Officer', office: 'Bole / Woreda 03', status: 'Active', lastActive: '3 hours ago' },
]

export interface KnowledgeDoc {
  title: string
  source: string
  passages: number
  embedded: number
  updated: string
}

export const knowledgeDocs: KnowledgeDoc[] = [
  { title: 'Ethiopian VAT Proclamation No. 285/2002', source: 'Federal Negarit Gazette', passages: 48, embedded: 48, updated: '12 Nov 2026' },
  { title: 'Citizen Reporting Guide', source: 'AARB internal handbook', passages: 22, embedded: 22, updated: '04 Nov 2026' },
  { title: 'Whistleblower Protection Policy', source: 'Proclamation No. 983/2016', passages: 16, embedded: 16, updated: '28 Oct 2026' },
  { title: 'Evidence Handling Directive', source: 'AARB internal directive', passages: 14, embedded: 14, updated: '19 Oct 2026' },
  { title: 'Reward Policy Directive', source: 'AARB internal directive', passages: 11, embedded: 8, updated: '02 Nov 2026' },
]

export interface AuditEntry {
  time: string
  actor: string
  action: string
  target: string
}

export const auditEntries: AuditEntry[] = [
  { time: '24 Nov, 16:42', actor: 'Demo City Admin', action: 'Assigned report', target: 'AARB-2026-04390 → Audit Unit' },
  { time: '24 Nov, 15:18', actor: 'Demo Sub-City Admin', action: 'Updated status', target: 'AARB-2026-04371 → Under Review' },
  { time: '24 Nov, 11:05', actor: 'Demo Super Admin', action: 'Created officer account', target: 'Demo Field Officer' },
  { time: '23 Nov, 17:30', actor: 'System', action: 'Embedded knowledge passages', target: 'Citizen Reporting Guide' },
  { time: '23 Nov, 09:12', actor: 'Demo City Admin', action: 'Added knowledge document', target: 'Evidence Handling Directive' },
]

export const hierarchyTree = [
  {
    name: 'Addis Ababa City Bureau',
    type: 'City',
    children: [
      {
        name: 'Bole Sub-City',
        type: 'Sub-City',
        children: [
          { name: 'Bole / Woreda 01', type: 'Woreda', children: [] },
          { name: 'Bole / Woreda 03', type: 'Woreda', children: [] },
        ],
      },
      {
        name: 'Lideta Sub-City',
        type: 'Sub-City',
        children: [{ name: 'Lideta / Woreda 02', type: 'Woreda', children: [] }],
      },
      {
        name: 'Arada Sub-City',
        type: 'Sub-City',
        children: [{ name: 'Arada / Woreda 05', type: 'Woreda', children: [] }],
      },
    ],
  },
]

export const adminKpis = [
  { label: 'Open reports', value: '64', detail: '+12 this week', tone: 'blue' },
  { label: 'Avg. first response', value: '6.5h', detail: '−15 min vs last month', tone: 'green' },
  { label: 'Active officers', value: '38', detail: 'across 11 sub-cities', tone: 'amber' },
  { label: 'Resolved this month', value: '22', detail: 'fictional demo figure', tone: 'violet' },
]

export const adminChatLog = [
  {
    time: '24 Nov, 16:10',
    question: 'How do I report VAT evasion anonymously?',
    answer: 'Choose VAT / Tax Evasion and keep “Report anonymously” enabled…',
    sources: 'Citizen Reporting Guide, Whistleblower Protection Policy',
  },
  {
    time: '24 Nov, 15:44',
    question: 'AARB-2026-04390 — any update?',
    answer: 'This report is assigned to the Audit Unit. Current stage: Under Review…',
    sources: 'Live case context',
  },
  {
    time: '24 Nov, 14:02',
    question: 'What counts as tax evasion?',
    answer: 'Examples include under-declaring sales, fake receipts and unregistered trading…',
    sources: 'Tax Evasion Identification Guide',
  },
]
