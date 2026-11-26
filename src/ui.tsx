import type { CSSProperties, ReactNode } from 'react'
import { Icon, type IconName } from './icons'
import type { ReportStatus } from './data'

export function DemoNote({ small = false }: { small?: boolean }) {
  return <span className={`demo-note${small ? ' demo-note--small' : ''}`}>DEMO DATA</span>
}

export function statusTone(status: string): string {
  if (status === 'Assigned to Investigator' || status === 'ACTIVE' || status === 'Active') return 'success'
  if (status === 'Resolved') return 'danger'
  if (status === 'Submitted' || status === 'NOT_REGISTERED') return 'info'
  if (status === 'INACTIVE' || status === 'Suspended') return 'warning'
  return 'warning'
}

export function StatusChip({ status, small = false }: { status: string; small?: boolean }) {
  const label =
    status === 'Assigned to Investigator' ? 'Investigating' :
    status === 'ACTIVE' ? 'Valid' :
    status === 'INACTIVE' ? 'Inactive' :
    status === 'NOT_REGISTERED' ? 'Unregistered' :
    status === 'ILLEGAL' ? 'Illegal' : status
  return <span className={`status-chip status-chip--${statusTone(status)}${small ? ' status-chip--small' : ''}`}>{label}</span>
}

export function PhoneFrame({
  label,
  children,
  nav,
  className = '',
}: {
  label: string
  children: ReactNode
  nav?: ReactNode
  className?: string
}) {
  return (
    <div className={`phone-wrap ${className}`}>
      <div className="phone-device">
        <div className="phone-statusbar">
          <span>9:41</span>
          <span className="phone-statusbar-icons"><i /><i /><i /></span>
        </div>
        <div className="phone-content" key={label}>{children}</div>
        {nav}
      </div>
      <div className="phone-caption"><span className="phone-caption-dot" />{label}</div>
    </div>
  )
}

export function BottomNav({
  items,
  active,
  onSelect,
  centerAction,
}: {
  items: { id: string; label: string; icon: IconName }[]
  active: string
  onSelect: (id: string) => void
  centerAction?: { onClick: () => void; active?: boolean }
}) {
  const rendered = centerAction
    ? [...items.slice(0, 2), { id: '__add', label: '', icon: 'plus' as IconName }, ...items.slice(2)]
    : items
  return (
    <nav className="bottom-nav">
      {rendered.map((item) =>
        item.id === '__add' ? (
          <button key={item.id} className="nav-add" onClick={centerAction?.onClick} aria-label="Create report">
            <Icon name="plus" size={26} />
          </button>
        ) : (
          <button
            key={item.id}
            className={`nav-item${active === item.id ? ' nav-item--active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <Icon name={item.icon} size={23} />
            <span>{item.label}</span>
          </button>
        ),
      )}
    </nav>
  )
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  trailing,
}: {
  title: string
  subtitle?: string
  onBack?: () => void
  trailing?: ReactNode
}) {
  return (
    <div className="screen-header">
      {onBack && (
        <button className="circle-button" onClick={onBack} aria-label="Back">
          <Icon name="arrowLeft" size={20} />
        </button>
      )}
      <div className="screen-header-text">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {trailing}
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="section-label">{children}</div>
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  icon,
  full = false,
  disabled = false,
  small = false,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'light' | 'danger' | 'ghost'
  icon?: IconName
  full?: boolean
  disabled?: boolean
  small?: boolean
  className?: string
}) {
  return (
    <button
      className={`button button--${variant}${full ? ' button--full' : ''}${small ? ' button--small' : ''}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={small ? 14 : 17} />}
      {children}
    </button>
  )
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  mono = false,
  multiline = false,
  type = 'text',
}: {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  mono?: boolean
  multiline?: boolean
  type?: string
}) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4} />
      ) : (
        <input
          type={type}
          className={mono ? 'mono' : ''}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  )
}

export function DetailRow({ label, value, mono = false }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong className={mono ? 'mono' : ''}>{value}</strong>
    </div>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
}) {
  return (
    <div className="segmented">
      {options.map((option) => (
        <button
          key={option.id}
          className={`segment${value === option.id ? ' segment--active' : ''}`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function MockMap({
  height = 140,
  pins = [],
  label,
}: {
  height?: number
  pins?: { top: string; left: string; color?: string; label?: string }[]
  label?: string
}) {
  return (
    <div className="mock-map" style={{ height, '--map-h': `${height}px` } as CSSProperties}>
      <span className="map-road map-road--a" />
      <span className="map-road map-road--b" />
      <span className="map-road map-road--c" />
      <span className="map-block map-block--a" />
      <span className="map-block map-block--b" />
      <span className="map-block map-block--c" />
      <span className="map-street-label">{label ?? 'Addis Ababa'}</span>
      {pins.map((pin, i) => (
        <span
          key={i}
          className="map-pin"
          style={{ top: pin.top, left: pin.left, background: pin.color ?? '#145491' }}
          title={pin.label}
        />
      ))}
    </div>
  )
}

export function EmptyState({ icon, title, body }: { icon: IconName; title: string; body?: string }) {
  return (
    <div className="empty-state">
      <Icon name={icon} size={32} />
      <strong>{title}</strong>
      {body && <p>{body}</p>}
    </div>
  )
}

export function StatCard({ value, label, footnote, onClick }: { value: string; label: string; footnote?: string; onClick?: () => void }) {
  const inner = (
    <>
      <strong>{value}</strong>
      <span>{label}</span>
      <small>{footnote ?? 'Not enough data yet'}</small>
    </>
  )
  return onClick ? (
    <button className="stat-card" onClick={onClick}>{inner}</button>
  ) : (
    <div className="stat-card">{inner}</div>
  )
}

export function ProgressBar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="progress-row">
      <div className="progress-head"><span>{label}</span><strong>{value}</strong></div>
      <div className="progress-track"><span style={{ width: `${Math.max(4, (value / max) * 100)}%` }} /></div>
    </div>
  )
}

export function StatusLegend({ statuses }: { statuses: ReportStatus[] }) {
  return (
    <div className="status-legend">
      {statuses.map((status) => <StatusChip key={status} status={status} small />)}
    </div>
  )
}
