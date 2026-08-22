import {definePlugin, useClient, type Tool} from 'sanity'
import {useEffect, useMemo, useState} from 'react'
import type {CSSProperties, ReactNode} from 'react'

type PeriodKey = 'today' | 'last7' | 'last30' | 'lastMonth'
type OriginKey = 'all' | 'landing-page' | 'main-website'

interface Lead {
  _id: string
  name?: string
  phone?: string
  email?: string
  city?: string
  source?: string
  leadOrigin?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  gclid?: string
  landingPage?: string
  submissionAction?: string
  callTargetPhone?: string
  ctaLocation?: string
  submittedAt?: string
  status?: string
  message?: string
  appointmentAt?: string
  visited?: boolean
  outcome?: string
  revenue?: number
  lastFollowUpAt?: string
}

interface LeadDashboardData {
  total: number
  call: number
  whatsapp: number
  form: number
  other: number
  confirmed: number
  visited: number
  won: number
  noShow: number
  revenue: number
  landingPage: number
  mainWebsite: number
  latest: Lead[]
}

const periods: {key: PeriodKey; label: string}[] = [
  {key: 'today', label: 'Today'},
  {key: 'last7', label: 'Last 7 days'},
  {key: 'last30', label: 'Last 30 days'},
  {key: 'lastMonth', label: 'Last month'},
]

const origins: {key: OriginKey; label: string}[] = [
  {key: 'all', label: 'All leads'},
  {key: 'landing-page', label: 'Landing Page'},
  {key: 'main-website', label: 'Main Website'},
]

const actionLabels: Record<string, string> = {
  call_click: 'Call click',
  whatsapp_redirect: 'WhatsApp',
  callback_request: 'Form',
  thank_you_redirect: 'Form',
}

function getPeriodRange(period: PeriodKey) {
  const now = new Date()
  const start = new Date(now)
  const end = new Date(now)

  if (period === 'today') {
    start.setHours(0, 0, 0, 0)
    return {start, end}
  }

  if (period === 'last7') {
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)
    return {start, end}
  }

  if (period === 'last30') {
    start.setDate(start.getDate() - 29)
    start.setHours(0, 0, 0, 0)
    return {start, end}
  }

  start.setMonth(start.getMonth() - 1, 1)
  start.setHours(0, 0, 0, 0)
  end.setDate(1)
  end.setHours(0, 0, 0, 0)
  return {start, end}
}

function formatDateTime(value?: string) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatRange(start: Date, end: Date) {
  const displayEnd =
    end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0
      ? new Date(end.getTime() - 1)
      : end
  const dateFormat = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  return `${dateFormat.format(start)} - ${dateFormat.format(displayEnd)}`
}

function getActionLabel(action?: string) {
  if (!action) return 'Form'
  return actionLabels[action] ?? action.replace(/_/g, ' ')
}

function StatCard({label, value, tone, note}: {label: string; value: number; tone?: string; note?: string}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{...styles.statValue, color: tone ?? '#101112'}}>{value}</div>
      {note ? <div style={styles.statNote}>{note}</div> : null}
    </div>
  )
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.filterButton,
        ...(active ? styles.filterButtonActive : undefined),
      }}
    >
      {children}
    </button>
  )
}

export function AppointmentDashboard() {
  const client = useClient({apiVersion: '2024-01-01'})
  const [period, setPeriod] = useState<PeriodKey>('today')
  const [origin, setOrigin] = useState<OriginKey>('all')
  const [data, setData] = useState<LeadDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [utmSearch, setUtmSearch] = useState('')

  const range = useMemo(() => getPeriodRange(period), [period])

  useEffect(() => {
    let cancelled = false
    const originFilter = origin === 'all' ? '' : origin === 'landing-page'
      ? ' && (leadOrigin == "landing-page" || (!defined(leadOrigin) && source == "landing-page"))'
      : ' && (leadOrigin == "main-website" || (!defined(leadOrigin) && source != "landing-page"))'
    const statusFilter = status === 'all' ? '' : ' && status == $status'
    const baseFilter = `_type == "appointmentRequest" && defined(submittedAt) && submittedAt >= $start && submittedAt < $end${originFilter}${statusFilter}`
    const query = `{
      "total": count(*[${baseFilter}]),
      "call": count(*[${baseFilter} && submissionAction == "call_click"]),
      "whatsapp": count(*[${baseFilter} && submissionAction == "whatsapp_redirect"]),
      "form": count(*[${baseFilter} && (!defined(submissionAction) || submissionAction in ["callback_request", "thank_you_redirect"])]),
      "other": count(*[${baseFilter} && defined(submissionAction) && !(submissionAction in ["call_click", "whatsapp_redirect", "callback_request", "thank_you_redirect"])]),
      "confirmed": count(*[${baseFilter} && status in ["confirmed", "scheduled", "visited"]]),
      "visited": count(*[${baseFilter} && (visited == true || status == "visited")]),
      "won": count(*[${baseFilter} && outcome == "won"]),
      "noShow": count(*[${baseFilter} && status == "no-show"]),
      "revenue": math::sum(*[${baseFilter} && outcome == "won"].revenue),
      "landingPage": count(*[${baseFilter} && (leadOrigin == "landing-page" || (!defined(leadOrigin) && source == "landing-page"))]),
      "mainWebsite": count(*[${baseFilter} && (leadOrigin == "main-website" || (!defined(leadOrigin) && source != "landing-page"))]),
      "latest": *[${baseFilter}] | order(submittedAt desc)[0...100]{
        _id,
        name,
        phone,
        email,
        city,
        source,
        "leadOrigin": coalesce(leadOrigin, select(source == "landing-page" => "landing-page", "main-website")),
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        gclid,
        landingPage,
        submissionAction,
        callTargetPhone,
        ctaLocation,
        submittedAt,
        status,
        message
        ,appointmentAt,
        visited,
        outcome,
        revenue,
        lastFollowUpAt
      }
    }`

    setLoading(true)
    setError(null)
    client
      .fetch<LeadDashboardData>(query, {
        start: range.start.toISOString(),
        end: range.end.toISOString(),
        status,
      })
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load leads.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [client, origin, period, range.end, range.start, status])

  const visibleLeads = useMemo(() => {
    const needle = search.trim().toLowerCase()
    const utmNeedle = utmSearch.trim().toLowerCase()
    return (data?.latest ?? []).filter((lead) =>
      (!needle || [lead.name, lead.phone, lead.email, lead.city].some((value) => value?.toLowerCase().includes(needle))) &&
      (!utmNeedle || [lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.utmTerm, lead.utmContent, lead.gclid].some((value) => value?.toLowerCase().includes(utmNeedle))),
    )
  }, [data?.latest, search, utmSearch])

  async function updateLead(id: string, values: Record<string, unknown>) {
    await client.patch(id).set({...values, lastFollowUpAt: new Date().toISOString()}).commit()
    setData((current) => current ? {...current, latest: current.latest.map((lead) => lead._id === id ? {...lead, ...values, lastFollowUpAt: new Date().toISOString()} : lead)} : current)
  }

  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Appointment Dashboard</h1>
          <p style={styles.subtitle}>One view for Landing Page and Main Website leads, with campaign attribution.</p>
        </div>
        <div style={styles.rangeLabel}>{formatRange(range.start, range.end)}</div>
      </div>

      <section style={styles.controls}>
        <div style={styles.filterGroup}>
          <input aria-label="Search appointments" value={search} onChange={(event) => setSearch(event.currentTarget.value)} placeholder="Search by name, phone or email" style={styles.searchInput} />
          <input aria-label="Search UTM attribution" value={utmSearch} onChange={(event) => setUtmSearch(event.currentTarget.value)} placeholder="Search UTM source or campaign" style={styles.searchInput} />
          <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.currentTarget.value)} style={styles.select}>
            <option value="all">All statuses</option><option value="new">New</option><option value="confirmed">Confirmed</option><option value="scheduled">Scheduled</option><option value="visited">Visited</option><option value="no-show">No-show</option><option value="closed">Closed</option>
          </select>
        </div>
        <div style={styles.filterGroup}>
          {periods.map((item) => (
            <FilterButton key={item.key} active={period === item.key} onClick={() => setPeriod(item.key)}>
              {item.label}
            </FilterButton>
          ))}
        </div>
        <div style={styles.filterGroup}>
          {origins.map((item) => (
            <FilterButton key={item.key} active={origin === item.key} onClick={() => setOrigin(item.key)}>
              {item.label}
            </FilterButton>
          ))}
        </div>
      </section>

      {error ? <div style={styles.error}>{error}</div> : null}

      <section style={styles.statsGrid}>
        <StatCard label="Total requests" value={data?.total ?? 0} note="All captured enquiries" />
        <StatCard label="Landing Page" value={data?.landingPage ?? 0} tone="#0f766e" note="Campaign landing leads" />
        <StatCard label="Main Website" value={data?.mainWebsite ?? 0} tone="#1d4ed8" note="Appointment, contact & popup" />
        <StatCard label="Confirmed" value={data?.confirmed ?? 0} tone="#168a46" />
        <StatCard label="Visited" value={data?.visited ?? 0} tone="#2563eb" />
        <StatCard label="Won" value={data?.won ?? 0} tone="#15803d" />
        <StatCard label="No-show" value={data?.noShow ?? 0} tone="#dc2626" />
        <div style={styles.statCard}><div style={styles.statLabel}>Revenue</div><div style={{...styles.statValue, color: '#7c3aed'}}>₹{(data?.revenue ?? 0).toLocaleString('en-IN')}</div></div>
      </section>

      <section style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h2 style={styles.sectionTitle}>Latest leads</h2>
          {loading ? <span style={styles.muted}>Loading...</span> : <span style={styles.muted}>Showing latest 100</span>}
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Submitted</th>
                <th style={styles.th}>Appointment</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Origin</th>
                <th style={styles.th}>UTM attribution</th>
                <th style={styles.th}>CTA / City</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Visited</th>
                <th style={styles.th}>Outcome</th>
                <th style={styles.th}>Revenue</th>
                <th style={styles.th}>Quick actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && data?.latest.length === 0 ? (
                <tr>
                  <td style={styles.emptyCell} colSpan={13}>
                    No leads found for this filter.
                  </td>
                </tr>
              ) : null}
              {visibleLeads.map((lead) => {
                const isCall = lead.submissionAction === 'call_click'
                return (
                  <tr key={lead._id}>
                    <td style={styles.td}>{formatDateTime(lead.submittedAt)}</td>
                    <td style={styles.td}>{formatDateTime(lead.appointmentAt)}</td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, ...(isCall ? styles.callBadge : undefined)}}>
                        {getActionLabel(lead.submissionAction)}
                      </span>
                    </td>
                    <td style={styles.td}>{isCall ? 'Unknown caller' : lead.name || '-'}</td>
                    <td style={styles.td}>{isCall ? lead.callTargetPhone || lead.phone || '-' : lead.phone || '-'}</td>
                    <td style={styles.td}><span style={{...styles.badge, ...(lead.leadOrigin === 'landing-page' ? styles.landingBadge : styles.websiteBadge)}}>{lead.leadOrigin === 'landing-page' ? 'Landing Page' : 'Main Website'}</span><div style={styles.cellNote}>{lead.source || '-'}</div></td>
                    <td style={styles.td}><strong>{lead.utmSource || 'Direct / unknown'}</strong><div style={styles.cellNote}>{[lead.utmMedium, lead.utmCampaign].filter(Boolean).join(' · ') || 'No UTM parameters'}{lead.utmTerm ? ` · ${lead.utmTerm}` : ''}</div></td>
                    <td style={styles.td}>{lead.ctaLocation || lead.city || '-'}</td>
                    <td style={styles.td}>{lead.status || '-'}</td>
                    <td style={styles.td}>{lead.visited ? 'Yes' : 'No'}</td>
                    <td style={styles.td}>{lead.outcome || 'pending'}</td>
                    <td style={styles.td}>{lead.revenue ? `₹${lead.revenue.toLocaleString('en-IN')}` : '-'}</td>
                    <td style={styles.td}><div style={styles.actions}><button style={styles.actionButton} onClick={() => updateLead(lead._id, {status: 'confirmed'})}>Confirm</button><button style={styles.actionButton} onClick={() => updateLead(lead._id, {status: 'visited', visited: true})}>Visited</button><button style={styles.wonButton} onClick={() => updateLead(lead._id, {outcome: 'won'})}>Won</button><button style={styles.actionButton} onClick={() => updateLead(lead._id, {status: 'no-show'})}>No-show</button></div></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
      <aside style={styles.supportCard}><strong>Need help?</strong><span>Genesis Virtue support for dashboard, tracking and website operations.</span><a href="https://genesisvirtue.com" target="_blank" rel="noreferrer" style={styles.supportLink}>Contact Genesis Virtue</a></aside>
    </main>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100%',
    background: 'linear-gradient(180deg, #f3f7ff 0, #f8fafc 280px)',
    color: '#101112',
    padding: '32px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '24px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '32px',
    lineHeight: 1.2,
    margin: 0,
  },
  subtitle: {
    color: '#5f6368',
    margin: '8px 0 0',
  },
  rangeLabel: {
    border: '1px solid #d8dde3',
    borderRadius: '8px',
    background: '#fff',
    color: '#3c4043',
    padding: '10px 12px',
    whiteSpace: 'nowrap',
  },
  controls: {
    display: 'grid',
    gap: '12px',
    marginBottom: '20px', border: '1px solid #dbe4f0', borderRadius: '14px', background: '#fff', padding: '16px', boxShadow: '0 8px 30px rgba(15, 23, 42, .05)',
  },
  filterGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  filterButton: {
    appearance: 'none',
    border: '1px solid #d8dde3',
    borderRadius: '8px',
    background: '#fff',
    color: '#3c4043',
    cursor: 'pointer',
    font: 'inherit',
    fontSize: '14px',
    padding: '9px 12px',
  },
  filterButtonActive: {
    background: '#174ea6',
    borderColor: '#174ea6',
    color: '#fff',
  },
  searchInput: {minWidth: '260px', flex: 1, border: '1px solid #d8dde3', borderRadius: '8px', background: '#fff', color: '#101112', font: 'inherit', padding: '10px 12px'},
  select: {border: '1px solid #d8dde3', borderRadius: '8px', background: '#fff', color: '#101112', font: 'inherit', padding: '10px 12px'},
  error: {
    border: '1px solid #f2b8b5',
    borderRadius: '8px',
    background: '#fff4f4',
    color: '#b3261e',
    marginBottom: '20px',
    padding: '12px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  },
  statCard: {
    border: '1px solid #e4e7eb',
    borderRadius: '14px',
    background: '#fff',
    padding: '18px', boxShadow: '0 6px 24px rgba(15, 23, 42, .045)',
  },
  statLabel: {
    color: '#5f6368',
    fontSize: '13px',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '34px',
    fontWeight: 700,
    lineHeight: 1,
  },
  statNote: {color: '#64748b', fontSize: '12px', marginTop: '8px'},
  tableCard: {
    border: '1px solid #e4e7eb',
    borderRadius: '14px',
    background: '#fff',
    overflow: 'hidden',
  },
  tableHeader: {
    alignItems: 'center',
    borderBottom: '1px solid #e4e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '16px 18px',
  },
  sectionTitle: {
    fontSize: '18px',
    margin: 0,
  },
  muted: {
    color: '#6b7280',
    fontSize: '13px',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    borderCollapse: 'collapse',
    minWidth: '1500px',
    width: '100%',
  },
  th: {
    background: '#f8fafc',
    borderBottom: '1px solid #e4e7eb',
    color: '#4b5563',
    fontSize: '12px',
    fontWeight: 700,
    padding: '12px',
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  td: {
    borderBottom: '1px solid #eef1f4',
    color: '#1f2937',
    fontSize: '14px',
    padding: '12px',
    verticalAlign: 'top',
  },
  emptyCell: {
    color: '#6b7280',
    padding: '28px 12px',
    textAlign: 'center',
  },
  badge: {
    background: '#eef2ff',
    borderRadius: '999px',
    color: '#3730a3',
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: 700,
    padding: '4px 8px',
    whiteSpace: 'nowrap',
  },
  callBadge: {
    background: '#e0f2fe',
    color: '#075985',
  },
  landingBadge: {background: '#ccfbf1', color: '#115e59'},
  websiteBadge: {background: '#dbeafe', color: '#1e40af'},
  cellNote: {color: '#64748b', fontSize: '12px', marginTop: '5px', maxWidth: '240px'},
  actions: {display: 'flex', flexWrap: 'wrap', gap: '6px'},
  actionButton: {border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff', color: '#334155', cursor: 'pointer', padding: '6px 8px'},
  wonButton: {border: '1px solid #86efac', borderRadius: '6px', background: '#f0fdf4', color: '#166534', cursor: 'pointer', padding: '6px 8px'},
  supportCard: {display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px', border: '1px solid #dbeafe', borderRadius: '10px', background: '#eff6ff', color: '#1e3a8a', padding: '18px'},
  supportLink: {color: '#1d4ed8', fontWeight: 700, textDecoration: 'none'},
}

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
