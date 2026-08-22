import {definePlugin, useClient, type Tool} from 'sanity'
import {useEffect, useMemo, useState} from 'react'
import type {ReactNode} from 'react'

type Period = 'today' | 'last7' | 'last30' | 'month' | 'custom'
type Origin = 'all' | 'landing-page' | 'main-website'
type SortKey = 'submittedAt' | 'appointmentAt' | 'name' | 'status' | 'revenue'
interface Lead {
  _id: string
  name?: string
  phone?: string
  email?: string
  city?: string
  source?: string
  leadOrigin?: string
  submissionAction?: string
  callTargetPhone?: string
  ctaLocation?: string
  submittedAt?: string
  appointmentAt?: string
  status?: string
  visited?: boolean
  outcome?: string
  revenue?: number
  message?: string
  internalNotes?: string
  lastFollowUpAt?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  gclid?: string
  landingPage?: string
  referrer?: string
}
interface Data {
  total: number
  landingPage: number
  mainWebsite: number
  confirmed: number
  visited: number
  won: number
  noShow: number
  spam: number
  lost: number
  revenue: number
  leads: Lead[]
}
const periods: {key: Period; label: string}[] = [
  {key: 'today', label: 'Today'},
  {key: 'last7', label: 'Last 7 Days'},
  {key: 'last30', label: 'Last 30 Days'},
  {key: 'month', label: 'This Month'},
  {key: 'custom', label: 'Custom'},
]
const origins: {key: Origin; label: string}[] = [
  {key: 'all', label: 'All Leads'},
  {key: 'landing-page', label: 'Landing Page'},
  {key: 'main-website', label: 'Main Website'},
]
const statuses = [
  'new',
  'contacted',
  'confirmed',
  'scheduled',
  'visited',
  'no-show',
  'cancelled',
  'spam',
  'closed',
]
const iso = (d: Date) => d.toISOString().slice(0, 10)
function rangeFor(period: Period, startValue: string, endValue: string) {
  const now = new Date(),
    start = new Date(now),
    end = new Date(now)
  if (period === 'custom' && startValue && endValue) {
    const customEnd = new Date(`${endValue}T00:00:00`)
    customEnd.setDate(customEnd.getDate() + 1)
    return {start: new Date(`${startValue}T00:00:00`), end: customEnd}
  }
  if (period === 'today') start.setHours(0, 0, 0, 0)
  if (period === 'last7') {
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)
  }
  if (period === 'last30') {
    start.setDate(start.getDate() - 29)
    start.setHours(0, 0, 0, 0)
  }
  if (period === 'month') {
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
  }
  return {start, end}
}
function fmt(value?: string, dateOnly = false) {
  if (!value) return 'Not scheduled'
  return new Intl.DateTimeFormat(
    'en-IN',
    dateOnly
      ? {day: '2-digit', month: 'short', year: 'numeric'}
      : {day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'},
  ).format(new Date(value))
}
const money = (v = 0) => `₹${v.toLocaleString('en-IN')}`
const title = (v?: string) =>
  (v || 'new').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
const originOf = (l: Lead) =>
  l.leadOrigin === 'landing-page' || l.source === 'landing-page' ? 'Landing Page' : 'Main Website'
function leadType(l: Lead) {
  if (l.submissionAction === 'call_click') return 'Call Click'
  if (l.submissionAction === 'whatsapp_redirect') return 'WhatsApp Form'
  if (l.source === 'popup') return 'Popup Form'
  return 'Website Form'
}

function Btn({
  children,
  onClick,
  active,
  tone = '',
  title: tip,
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  active?: boolean
  tone?: string
  title?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      title={tip}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      className={`ad-btn ${active ? 'active' : ''} ${tone}`}
    >
      {children}
    </button>
  )
}
const StatusBadge = ({value}: {value?: string}) => (
  <span className={`ad-pill status-${value || 'new'}`}>{title(value)}</span>
)
const SourceBadge = ({lead}: {lead: Lead}) => (
  <span
    className={`ad-pill ${originOf(lead) === 'Landing Page' ? 'source-landing' : 'source-website'}`}
  >
    {originOf(lead)}
  </span>
)
function Kpi({
  label,
  value,
  note,
  icon,
  tone,
}: {
  label: string
  value: string | number
  note: string
  icon: string
  tone: string
}) {
  return (
    <div className={`ad-kpi ${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
      <b>{icon}</b>
    </div>
  )
}
function Header({
  range,
  onExport,
  onRefresh,
  loading,
}: {
  range: {start: Date; end: Date}
  onExport: () => void
  onRefresh: () => void
  loading: boolean
}) {
  const end = new Date(range.end)
  if (end.getTime() > Date.now()) end.setTime(Date.now())
  return (
    <header className="ad-header">
      <div>
        <h1>Appointment Dashboard</h1>
        <p>Manage leads, appointments, attribution and conversions from one view.</p>
      </div>
      <div className="ad-header-actions">
        <span className="ad-date">
          ▣ {fmt(range.start.toISOString(), true)} – {fmt(end.toISOString(), true)}
        </span>
        <Btn onClick={onRefresh}>↻ {loading ? 'Refreshing…' : 'Refresh'}</Btn>
        <Btn onClick={onExport} active>
          ⇩ Export CSV
        </Btn>
      </div>
    </header>
  )
}
function Filters(p: any) {
  return (
    <div className="ad-filter-row">
      <input
        value={p.search}
        onChange={(e) => p.setSearch(e.currentTarget.value)}
        placeholder="⌕  Search by name, phone or email…"
      />
      <input
        value={p.utmSearch}
        onChange={(e) => p.setUtmSearch(e.currentTarget.value)}
        placeholder="⌕  Search campaign or UTM source…"
      />
      <select value={p.status} onChange={(e) => p.setStatus(e.currentTarget.value)}>
        <option value="all">All statuses</option>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {title(s)}
          </option>
        ))}
      </select>
      <select value={p.source} onChange={(e) => p.setSource(e.currentTarget.value)}>
        <option value="all">All form sources</option>
        <option value="appointment">Appointment</option>
        <option value="contact">Contact</option>
        <option value="popup">Popup</option>
        <option value="landing-page">Landing page</option>
      </select>
      <select value={p.appointment} onChange={(e) => p.setAppointment(e.currentTarget.value)}>
        <option value="all">All appointments</option>
        <option value="scheduled">Scheduled</option>
        <option value="unscheduled">Not scheduled</option>
      </select>
    </div>
  )
}
function copyMessage(l: Lead) {
  return `Lead Details\n\nName: ${l.name || 'Unknown'}\nPhone: ${l.phone || l.callTargetPhone || '-'}\nAppointment: ${fmt(l.appointmentAt)}\nSource: ${originOf(l)}\nCampaign: ${l.utmCampaign || 'Direct'}\nCity: ${l.city || '-'}\nStatus: ${title(l.status)}\nOutcome: ${title(l.outcome || 'pending')}\nRevenue: ${money(l.revenue)}`
}
function Drawer({
  lead,
  onClose,
  onCopy,
  onUpdate,
}: {
  lead: Lead | null
  onClose: () => void
  onCopy: (l: Lead) => void
  onUpdate: (id: string, v: Record<string, unknown>) => Promise<void>
}) {
  if (!lead) return null
  return (
    <div className="ad-drawer-backdrop" onClick={onClose}>
      <aside
        className="ad-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="ad-drawer-head">
          <div>
            <small>LEAD DETAILS</small>
            <h2>{lead.name || 'Unknown caller'}</h2>
            <a href={`tel:${lead.phone || lead.callTargetPhone}`}>
              {lead.phone || lead.callTargetPhone || '-'}
            </a>
          </div>
          <button onClick={onClose}>×</button>
        </div>
        <div className="ad-drawer-actions">
          <a className="ad-btn active" href={`tel:${lead.phone || lead.callTargetPhone}`}>
            ☎ Call
          </a>
          <Btn tone="green" onClick={() => onCopy(lead)}>
            ▣ Copy WhatsApp
          </Btn>
          <Btn onClick={() => onUpdate(lead._id, {status: 'confirmed'})}>✓ Confirm</Btn>
        </div>
        <DrawerSection
          title="Appointment"
          rows={[
            ['Date & time', fmt(lead.appointmentAt)],
            ['Status', title(lead.status)],
            ['Visited', lead.visited ? 'Yes' : 'No'],
            ['Outcome', title(lead.outcome || 'pending')],
            ['Revenue', money(lead.revenue)],
          ]}
        />
        <DrawerSection
          title="Attribution"
          rows={[
            ['Origin', originOf(lead)],
            ['Form source', lead.source || '-'],
            ['UTM', `${lead.utmSource || 'Direct'} / ${lead.utmMedium || 'Unknown'}`],
            ['Campaign', lead.utmCampaign || 'No UTM parameters'],
            ['Term / content', [lead.utmTerm, lead.utmContent].filter(Boolean).join(' / ') || '-'],
            ['Landing page', lead.landingPage || '-'],
          ]}
        />
        <DrawerSection
          title="Contact & activity"
          rows={[
            ['Email', lead.email || '-'],
            ['City / CTA', lead.city || lead.ctaLocation || '-'],
            ['Message', lead.message || '-'],
            ['Last activity', fmt(lead.lastFollowUpAt || lead.submittedAt)],
          ]}
        />
      </aside>
    </div>
  )
}
function DrawerSection({title: heading, rows}: {title: string; rows: string[][]}) {
  return (
    <section>
      <h3>{heading}</h3>
      <dl>
        {rows.map(([a, b]) => (
          <span key={a}>
            <dt>{a}</dt>
            <dd>{b}</dd>
          </span>
        ))}
      </dl>
    </section>
  )
}

export function AppointmentDashboard() {
  const client = useClient({apiVersion: '2024-01-01'}),
    today = iso(new Date())
  const [period, setPeriod] = useState<Period>('last7'),
    [customStart, setCustomStart] = useState(today),
    [customEnd, setCustomEnd] = useState(today),
    [origin, setOrigin] = useState<Origin>('all')
  const [search, setSearch] = useState(''),
    [utmSearch, setUtmSearch] = useState(''),
    [status, setStatus] = useState('all'),
    [source, setSource] = useState('all'),
    [appointment, setAppointment] = useState('all')
  const [data, setData] = useState<Data | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState<string | null>(null),
    [refresh, setRefresh] = useState(0)
  const [sort, setSort] = useState<SortKey>('submittedAt'),
    [ascending, setAscending] = useState(false),
    [page, setPage] = useState(1),
    [pageSize, setPageSize] = useState(15),
    [selected, setSelected] = useState<Set<string>>(new Set()),
    [drawer, setDrawer] = useState<Lead | null>(null),
    [toast, setToast] = useState<string | null>(null)
  const range = useMemo(
    () => rangeFor(period, customStart, customEnd),
    [period, customStart, customEnd],
  )
  useEffect(() => {
    let cancelled = false
    const query = `{"total":count(*[_type=="appointmentRequest"&&submittedAt>=$start&&submittedAt<$end]),"landingPage":count(*[_type=="appointmentRequest"&&submittedAt>=$start&&submittedAt<$end&&(leadOrigin=="landing-page"||(!defined(leadOrigin)&&source=="landing-page"))]),"mainWebsite":count(*[_type=="appointmentRequest"&&submittedAt>=$start&&submittedAt<$end&&(leadOrigin=="main-website"||(!defined(leadOrigin)&&source!="landing-page"))]),"confirmed":count(*[_type=="appointmentRequest"&&submittedAt>=$start&&submittedAt<$end&&status in ["confirmed","scheduled"]]),"visited":count(*[_type=="appointmentRequest"&&submittedAt>=$start&&submittedAt<$end&&(visited==true||status=="visited")]),"won":count(*[_type=="appointmentRequest"&&submittedAt>=$start&&submittedAt<$end&&outcome=="won"]),"noShow":count(*[_type=="appointmentRequest"&&submittedAt>=$start&&submittedAt<$end&&status=="no-show"]),"spam":count(*[_type=="appointmentRequest"&&submittedAt>=$start&&submittedAt<$end&&status=="spam"]),"lost":count(*[_type=="appointmentRequest"&&submittedAt>=$start&&submittedAt<$end&&outcome=="lost"]),"revenue":math::sum(*[_type=="appointmentRequest"&&submittedAt>=$start&&submittedAt<$end&&outcome=="won"].revenue),"leads":*[_type=="appointmentRequest"&&submittedAt>=$start&&submittedAt<$end]|order(submittedAt desc)[0...1000]{...,"leadOrigin":coalesce(leadOrigin,select(source=="landing-page"=>"landing-page","main-website"))}}`
    setLoading(true)
    setError(null)
    client
      .fetch<Data>(query, {start: range.start.toISOString(), end: range.end.toISOString()})
      .then((v) => {
        if (!cancelled) setData(v)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load leads')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [client, range.start, range.end, refresh])
  useEffect(() => setPage(1), [search, utmSearch, status, source, appointment, origin, period])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(t)
  }, [toast])
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase(),
      u = utmSearch.trim().toLowerCase()
    return (data?.leads || [])
      .filter(
        (l) =>
          (origin === 'all' ||
            (origin === 'landing-page'
              ? originOf(l) === 'Landing Page'
              : originOf(l) === 'Main Website')) &&
          (!q || [l.name, l.phone, l.email].some((v) => v?.toLowerCase().includes(q))) &&
          (!u ||
            [l.utmSource, l.utmMedium, l.utmCampaign, l.utmTerm, l.utmContent].some((v) =>
              v?.toLowerCase().includes(u),
            )) &&
          (status === 'all' || (l.status || 'new') === status) &&
          (source === 'all' || l.source === source) &&
          (appointment === 'all' ||
            (appointment === 'scheduled' ? !!l.appointmentAt : !l.appointmentAt)),
      )
      .sort((a, b) => {
        const av = a[sort] ?? '',
          bv = b[sort] ?? '',
          r =
            typeof av === 'number' && typeof bv === 'number'
              ? av - bv
              : String(av).localeCompare(String(bv))
        return ascending ? r : -r
      })
  }, [data?.leads, origin, search, utmSearch, status, source, appointment, sort, ascending])
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize)),
    pageLeads = filtered.slice((page - 1) * pageSize, page * pageSize)
  async function updateLead(id: string, values: Record<string, unknown>) {
    try {
      const stamp = new Date().toISOString()
      await client
        .patch(id)
        .set({...values, lastFollowUpAt: stamp})
        .commit()
      setData((c) =>
        c
          ? {
              ...c,
              leads: c.leads.map((l) =>
                l._id === id ? {...l, ...values, lastFollowUpAt: stamp} : l,
              ),
            }
          : c,
      )
      setDrawer((l) => (l?._id === id ? {...l, ...values, lastFollowUpAt: stamp} : l))
      setToast('Lead updated successfully')
    } catch {
      setToast('Could not update lead')
    }
  }
  async function copyLead(l: Lead) {
    try {
      await navigator.clipboard.writeText(copyMessage(l))
      setToast('Lead details copied for WhatsApp')
    } catch {
      setToast('Could not copy lead details')
    }
  }
  function sortBy(k: SortKey) {
    if (sort === k) setAscending((v) => !v)
    else {
      setSort(k)
      setAscending(true)
    }
  }
  function exportCsv() {
    const h = [
        'Submitted',
        'Appointment',
        'Name',
        'Phone',
        'Email',
        'Origin',
        'Source',
        'UTM Source',
        'UTM Medium',
        'Campaign',
        'City',
        'Status',
        'Visited',
        'Outcome',
        'Revenue',
      ],
      rows = filtered.map((l) =>
        [
          l.submittedAt,
          l.appointmentAt,
          l.name,
          l.phone,
          l.email,
          originOf(l),
          l.source,
          l.utmSource,
          l.utmMedium,
          l.utmCampaign,
          l.city,
          l.status,
          l.visited ? 'Yes' : 'No',
          l.outcome,
          l.revenue,
        ]
          .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
          .join(','),
      ),
      blob = new Blob([[h.join(','), ...rows].join('\n')], {type: 'text/csv;charset=utf-8'}),
      url = URL.createObjectURL(blob),
      a = document.createElement('a')
    a.href = url
    a.download = `appointment-leads-${today}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setToast(`${filtered.length} leads exported`)
  }
  async function bulkStatus(value: string) {
    const ids = [...selected]
    if (!ids.length) return
    try {
      await Promise.all(
        ids.map((id) =>
          client.patch(id).set({status: value, lastFollowUpAt: new Date().toISOString()}).commit(),
        ),
      )
      setSelected(new Set())
      setRefresh((v) => v + 1)
      setToast(`${ids.length} leads updated`)
    } catch {
      setToast('Bulk update failed')
    }
  }
  return (
    <main className="ad-page">
      <style>{css}</style>
      <Header
        range={range}
        onExport={exportCsv}
        onRefresh={() => setRefresh((v) => v + 1)}
        loading={loading}
      />
      <section className="ad-filter-card">
        <Filters
          {...{
            search,
            setSearch,
            utmSearch,
            setUtmSearch,
            status,
            setStatus,
            source,
            setSource,
            appointment,
            setAppointment,
          }}
        />
        <div className="ad-quick">
          <div>
            {periods.map((i) => (
              <Btn key={i.key} active={period === i.key} onClick={() => setPeriod(i.key)}>
                {i.label}
              </Btn>
            ))}
          </div>
          {period === 'custom' && (
            <div className="ad-custom">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.currentTarget.value)}
              />
              <span>to</span>
              <input
                type="date"
                value={customEnd}
                min={customStart}
                onChange={(e) => setCustomEnd(e.currentTarget.value)}
              />
            </div>
          )}
          <div className="ad-tabs">
            {origins.map((i) => (
              <Btn key={i.key} active={origin === i.key} onClick={() => setOrigin(i.key)}>
                {i.label}
              </Btn>
            ))}
          </div>
        </div>
      </section>
      {error && <div className="ad-error">{error}</div>}
      <section className="ad-kpis">
        <Kpi
          label="Total Leads"
          value={data?.total || 0}
          note="All captured leads"
          icon="◎"
          tone="navy"
        />
        <Kpi
          label="Landing Page"
          value={data?.landingPage || 0}
          note="Campaign leads"
          icon="↗"
          tone="teal"
        />
        <Kpi
          label="Main Website"
          value={data?.mainWebsite || 0}
          note="Website forms"
          icon="◉"
          tone="blue"
        />
        <Kpi
          label="Confirmed"
          value={data?.confirmed || 0}
          note="Appointments"
          icon="✓"
          tone="indigo"
        />
        <Kpi label="Visited" value={data?.visited || 0} note="Clinic visits" icon="♙" tone="cyan" />
        <Kpi label="Won" value={data?.won || 0} note="Converted" icon="♕" tone="green" />
        <Kpi label="No-show" value={data?.noShow || 0} note="Missed visits" icon="×" tone="red" />
        <Kpi label="Spam" value={data?.spam || 0} note="Invalid leads" icon="!" tone="orange" />
        <Kpi label="Lost" value={data?.lost || 0} note="Not converted" icon="−" tone="slate" />
        <Kpi
          label="Revenue"
          value={money(data?.revenue)}
          note="Won revenue"
          icon="₹"
          tone="violet"
        />
      </section>
      <section className="ad-table-card">
        <div className="ad-table-title">
          <div>
            <strong>☷ &nbsp;Latest Leads</strong>
            <span>{filtered.length} results</span>
          </div>
          {selected.size > 0 && (
            <div className="ad-bulk">
              <b>{selected.size} selected</b>
              <select
                defaultValue=""
                onChange={(e) => e.currentTarget.value && bulkStatus(e.currentTarget.value)}
              >
                <option value="" disabled>
                  Bulk status update
                </option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {title(s)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="ad-table-wrap">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={pageLeads.length > 0 && pageLeads.every((l) => selected.has(l._id))}
                    onChange={(e) =>
                      setSelected((c) => {
                        const n = new Set(c)
                        pageLeads.forEach((l) =>
                          e.currentTarget.checked ? n.add(l._id) : n.delete(l._id),
                        )
                        return n
                      })
                    }
                  />
                </th>
                <th onClick={() => sortBy('submittedAt')}>Submitted ↕</th>
                <th onClick={() => sortBy('appointmentAt')}>Appointment ↕</th>
                <th onClick={() => sortBy('name')}>Lead ↕</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Campaign / UTM</th>
                <th className="low">CTA / City</th>
                <th onClick={() => sortBy('status')}>Status ↕</th>
                <th>Visited</th>
                <th>Outcome</th>
                <th onClick={() => sortBy('revenue')} className="low">
                  Revenue ↕
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({length: 8}).map((_, i) => (
                  <tr key={i} className="skeleton">
                    <td colSpan={13}>
                      <i />
                    </td>
                  </tr>
                ))
              ) : pageLeads.length === 0 ? (
                <tr>
                  <td colSpan={13} className="ad-empty">
                    <b>No leads found</b>
                    <span>Try changing the date range or filters.</span>
                  </td>
                </tr>
              ) : (
                pageLeads.map((l) => (
                  <LeadRow
                    key={l._id}
                    lead={l}
                    selected={selected.has(l._id)}
                    setSelected={setSelected}
                    setToast={setToast}
                    open={() => setDrawer(l)}
                    update={updateLead}
                    copy={copyLead}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        <footer className="ad-pagination">
          <span>
            Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–
            {Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.currentTarget.value))
                setPage(1)
              }}
            >
              <option value="10">10 per page</option>
              <option value="15">15 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
            <Btn disabled={page <= 1} onClick={() => setPage((v) => v - 1)}>
              ‹
            </Btn>
            <b>
              {page} / {pages}
            </b>
            <Btn disabled={page >= pages} onClick={() => setPage((v) => v + 1)}>
              ›
            </Btn>
          </div>
        </footer>
      </section>
      <Drawer
        lead={drawer}
        onClose={() => setDrawer(null)}
        onCopy={copyLead}
        onUpdate={updateLead}
      />
      {toast && <div className="ad-toast">✓ {toast}</div>}
    </main>
  )
}

function LeadRow({
  lead: l,
  selected,
  setSelected,
  setToast,
  open,
  update,
  copy,
}: {
  lead: Lead
  selected: boolean
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>
  setToast: (v: string) => void
  open: () => void
  update: (id: string, v: Record<string, unknown>) => Promise<void>
  copy: (l: Lead) => void
}) {
  return (
    <tr onClick={open}>
      <td>
        <input
          type="checkbox"
          checked={selected}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            setSelected((c) => {
              const n = new Set(c)
              e.currentTarget.checked ? n.add(l._id) : n.delete(l._id)
              return n
            })
          }
        />
      </td>
      <td>{fmt(l.submittedAt)}</td>
      <td>
        {l.appointmentAt ? fmt(l.appointmentAt) : <span className="muted">Not scheduled</span>}
      </td>
      <td>
        <strong>{l.name || 'Unknown caller'}</strong>
        <small>{leadType(l)}</small>
      </td>
      <td>
        <a href={`tel:${l.phone || l.callTargetPhone}`} onClick={(e) => e.stopPropagation()}>
          {l.phone || l.callTargetPhone || '-'}
        </a>
        <button
          className="copy-phone"
          onClick={(e) => {
            e.stopPropagation()
            navigator.clipboard.writeText(l.phone || l.callTargetPhone || '')
            setToast('Phone number copied')
          }}
        >
          ▣
        </button>
      </td>
      <td>
        <SourceBadge lead={l} />
        <small>
          {l.utmSource && l.utmSource !== 'direct' ? title(l.utmSource) : l.source || '-'}
        </small>
      </td>
      <td>
        <strong>
          {l.utmSource ? `${l.utmSource} / ${l.utmMedium || 'unknown'}` : 'Direct / Unknown'}
        </strong>
        <small>{l.utmCampaign || 'No UTM parameters'}</small>
      </td>
      <td className="low">{l.ctaLocation || l.city || '-'}</td>
      <td>
        <StatusBadge value={l.status} />
      </td>
      <td>{l.visited ? <span className="yes">Yes</span> : 'No'}</td>
      <td>
        <span className={`ad-pill outcome-${l.outcome || 'pending'}`}>
          {title(l.outcome || 'pending')}
        </span>
      </td>
      <td className="low">{l.revenue ? money(l.revenue) : '-'}</td>
      <td>
        <div className="ad-actions">
          <Btn onClick={() => update(l._id, {status: 'confirmed'})}>✓ Confirm</Btn>
          <Btn onClick={() => update(l._id, {status: 'visited', visited: true})}>♙ Visited</Btn>
          <Btn tone="green" onClick={() => update(l._id, {outcome: 'won'})}>
            ♕ Won
          </Btn>
          <Btn tone="green" title="Copy lead details" onClick={() => copy(l)}>
            ▣ Copy
          </Btn>
          <details onClick={(e) => e.stopPropagation()}>
            <summary>•••</summary>
            <div>
              <button onClick={() => update(l._id, {status: 'no-show'})}>Mark No-show</button>
              <button onClick={open}>View / edit lead</button>
              <button
                onClick={() => {
                  const v = window.prompt('Revenue amount (INR)', String(l.revenue || 0))
                  if (v !== null && !Number.isNaN(Number(v))) update(l._id, {revenue: Number(v)})
                }}
              >
                Add revenue
              </button>
              <button onClick={() => update(l._id, {status: 'spam'})}>Mark spam</button>
            </div>
          </details>
        </div>
      </td>
    </tr>
  )
}

const css = `*{box-sizing:border-box}.ad-page{min-height:100%;background:#f7f9fc;color:#182230;padding:22px;font-family:Inter,Geist,Arial,sans-serif;font-size:13px}.ad-header{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:16px}.ad-header h1{font-size:26px;letter-spacing:-.5px;margin:0 0 4px}.ad-header p{color:#667085;margin:0}.ad-header-actions,.ad-quick,.ad-quick>div,.ad-actions,.ad-bulk,.ad-pagination>div{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.ad-date{background:#fff;border:1px solid #e4e7ec;border-radius:9px;padding:9px 12px;font-weight:600}.ad-btn{border:1px solid #d8dee8;border-radius:7px;background:#fff;color:#344054;cursor:pointer;font:inherit;font-weight:600;padding:7px 10px;white-space:nowrap}.ad-btn:hover{background:#f2f4f7}.ad-btn.active{background:#2563eb;border-color:#2563eb;color:#fff}.ad-btn.green{border-color:#bbf7d0;color:#15803d;background:#f0fdf4}.ad-btn:disabled{opacity:.45}.ad-filter-card,.ad-table-card{background:#fff;border:1px solid #e4e7ec;border-radius:11px;box-shadow:0 1px 3px rgba(16,24,40,.035)}.ad-filter-card{padding:14px;margin-bottom:12px}.ad-filter-row{display:grid;grid-template-columns:minmax(230px,1.5fr) minmax(220px,1.3fr) repeat(3,minmax(130px,.55fr));gap:8px}.ad-filter-row input,.ad-filter-row select,.ad-custom input,.ad-bulk select,.ad-pagination select{height:36px;border:1px solid #dfe3ea;border-radius:7px;background:#fff;color:#344054;padding:0 10px;font:inherit;min-width:0}.ad-quick{border-top:1px solid #eef1f5;margin-top:11px;padding-top:11px;justify-content:space-between}.ad-tabs{border-left:1px solid #e4e7ec;padding-left:12px}.ad-kpis{display:grid;grid-template-columns:repeat(10,minmax(112px,1fr));gap:8px;margin-bottom:12px;overflow-x:auto}.ad-kpi{min-width:112px;background:#fff;border:1px solid #e4e7ec;border-top:3px solid var(--tone);border-radius:10px;padding:12px;display:flex;justify-content:space-between;gap:8px}.ad-kpi span,.ad-kpi small,.ad-table-title span,td small{display:block;color:#667085;font-size:11px}.ad-kpi strong{display:block;font-size:22px;line-height:1.15;margin:6px 0}.ad-kpi b{width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:#f2f4f7;color:var(--tone)}.navy{--tone:#182230}.teal{--tone:#0f9f8f}.blue{--tone:#2563eb}.indigo{--tone:#4f46e5}.cyan{--tone:#0891b2}.green{--tone:#16a34a}.red{--tone:#dc2626}.orange{--tone:#ea580c}.slate{--tone:#64748b}.violet{--tone:#7c3aed}.ad-table-title{height:48px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e4e7ec}.ad-table-title>div:first-child{display:flex;align-items:center;gap:10px}.ad-table-title strong{color:#1d4ed8}.ad-table-wrap{overflow:auto;max-height:calc(100vh - 390px);min-height:300px}table{border-collapse:separate;border-spacing:0;min-width:1560px;width:100%}th{position:sticky;top:0;z-index:2;height:42px;background:#f8fafc;border-bottom:1px solid #e4e7ec;color:#475467;font-size:10px;text-transform:uppercase;text-align:left;padding:0 9px;white-space:nowrap}td{height:52px;border-bottom:1px solid #eef1f4;padding:6px 9px;vertical-align:middle;white-space:nowrap;font-size:12px}tbody tr:hover{background:#f5f8ff}td a{color:#182230;text-decoration:none;font-weight:600}.copy-phone{border:0;background:transparent;color:#667085;cursor:pointer;margin-left:5px}.muted{color:#98a2b3}.yes{color:#15803d;font-weight:700}.ad-pill{display:inline-block;border-radius:999px;padding:3px 7px;font-size:10px;font-weight:700}.source-landing{background:#ccfbf1;color:#0f766e}.source-website{background:#dbeafe;color:#1d4ed8}.status-new{background:#eaf2ff;color:#2563eb}.status-confirmed,.status-scheduled{background:#e0e7ff;color:#4338ca}.status-visited{background:#cffafe;color:#0e7490}.status-no-show{background:#fee2e2;color:#b91c1c}.status-cancelled{background:#ffedd5;color:#c2410c}.status-spam,.status-closed{background:#f1f5f9;color:#475569}.outcome-won{background:#dcfce7;color:#15803d}.outcome-lost{background:#fee2e2;color:#b91c1c}.outcome-pending{background:#fef3c7;color:#b45309}.ad-actions{flex-wrap:nowrap}.ad-actions .ad-btn{font-size:10px;padding:5px 7px}.ad-actions details{position:relative}.ad-actions summary{list-style:none;border:1px solid #d8dee8;border-radius:6px;padding:4px 7px;cursor:pointer}.ad-actions details div{position:absolute;right:0;top:28px;z-index:5;width:145px;background:#fff;border:1px solid #e4e7ec;border-radius:8px;box-shadow:0 12px 30px rgba(16,24,40,.14);padding:5px}.ad-actions details button{display:block;width:100%;border:0;background:#fff;text-align:left;padding:8px;border-radius:5px;cursor:pointer}.ad-pagination{height:48px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;color:#667085}.ad-empty{text-align:center;height:220px!important;color:#667085}.ad-empty b,.ad-empty span{display:block;margin:6px}.skeleton i{display:block;height:30px;border-radius:6px;background:#eef1f5}.ad-error{background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;padding:10px;border-radius:8px;margin-bottom:12px}.ad-toast{position:fixed;right:24px;bottom:24px;z-index:30;background:#182230;color:#fff;border-radius:8px;padding:11px 15px}.ad-drawer-backdrop{position:fixed;inset:0;z-index:20;background:rgba(16,24,40,.32);display:flex;justify-content:flex-end}.ad-drawer{width:min(470px,100%);height:100%;overflow:auto;background:#fff;box-shadow:-14px 0 40px rgba(16,24,40,.12);padding:20px}.ad-drawer-head{display:flex;justify-content:space-between;border-bottom:1px solid #e4e7ec;padding-bottom:16px}.ad-drawer-head h2{margin:5px 0}.ad-drawer-head button{border:0;background:#f2f4f7;border-radius:50%;width:32px;height:32px;font-size:20px}.ad-drawer-actions{display:flex;gap:7px;padding:14px 0}.ad-drawer section{border-top:1px solid #e4e7ec;padding:10px 0}.ad-drawer dl span{display:grid;grid-template-columns:125px 1fr;gap:10px;margin:10px 0}.ad-drawer dt{color:#667085}.ad-drawer dd{margin:0;overflow-wrap:anywhere}.ad-bulk b{color:#2563eb}@media(max-width:1200px){.ad-kpis{grid-template-columns:repeat(5,minmax(130px,1fr))}.low{display:none}.ad-filter-row{grid-template-columns:1fr 1fr repeat(3,130px)}}@media(max-width:760px){.ad-page{padding:12px}.ad-header{align-items:flex-start;flex-direction:column}.ad-header-actions{width:100%}.ad-date{width:100%}.ad-filter-row{grid-template-columns:1fr}.ad-quick{align-items:flex-start;flex-direction:column}.ad-tabs{border:0;padding:0}.ad-kpis{grid-template-columns:repeat(2,minmax(145px,1fr))}.ad-table-wrap{max-height:none;overflow:visible}table,thead,tbody,tr,td{display:block;min-width:0}thead{display:none}tbody{padding:8px}tbody tr{position:relative;border:1px solid #e4e7ec;border-radius:9px;margin-bottom:8px;padding:10px 10px 52px}td{height:auto;border:0;padding:4px 0;white-space:normal}td:first-child{position:absolute;right:9px;top:8px}td:nth-child(7),td:nth-child(8),td:nth-child(10),td:nth-child(12){display:none}.ad-actions{position:absolute;left:8px;right:8px;bottom:8px;overflow-x:auto}.ad-actions details{display:none}.ad-pagination{height:auto;gap:10px;align-items:flex-start;flex-direction:column;padding:12px}}`
export const leadDashboardTool = definePlugin({
  name: 'lead-dashboard-tool',
  tools: [
    {
      name: 'appointment-dashboard',
      title: 'Appointment Dashboard',
      component: AppointmentDashboard,
    } satisfies Tool,
  ],
})
