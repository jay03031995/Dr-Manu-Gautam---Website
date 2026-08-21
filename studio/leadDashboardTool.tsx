import {DashboardIcon} from '@sanity/icons'
import {definePlugin, useClient, type Tool} from 'sanity'
import {useEffect, useMemo, useState} from 'react'
import type {CSSProperties, ReactNode} from 'react'

type PeriodKey = 'today' | 'last7' | 'last30' | 'lastMonth'
type SourceKey = 'all' | 'landing-page' | 'appointment' | 'contact' | 'popup'

interface Lead {
  _id: string
  name?: string
  phone?: string
  email?: string
  city?: string
  source?: string
  submissionAction?: string
  callTargetPhone?: string
  ctaLocation?: string
  submittedAt?: string
  status?: string
  message?: string
}

interface LeadDashboardData {
  total: number
  call: number
  whatsapp: number
  form: number
  other: number
  latest: Lead[]
}

const periods: {key: PeriodKey; label: string}[] = [
  {key: 'today', label: 'Today'},
  {key: 'last7', label: 'Last 7 days'},
  {key: 'last30', label: 'Last 30 days'},
  {key: 'lastMonth', label: 'Last month'},
]

const sources: {key: SourceKey; label: string}[] = [
  {key: 'all', label: 'All sources'},
  {key: 'landing-page', label: 'Landing page'},
  {key: 'appointment', label: 'Appointment'},
  {key: 'contact', label: 'Contact'},
  {key: 'popup', label: 'Popup'},
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

function StatCard({label, value, tone}: {label: string; value: number; tone?: string}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{...styles.statValue, color: tone ?? '#101112'}}>{value}</div>
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

function LeadDashboardTool() {
  const client = useClient({apiVersion: '2024-01-01'})
  const [period, setPeriod] = useState<PeriodKey>('today')
  const [source, setSource] = useState<SourceKey>('all')
  const [data, setData] = useState<LeadDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const range = useMemo(() => getPeriodRange(period), [period])

  useEffect(() => {
    let cancelled = false
    const sourceFilter = source === 'all' ? '' : ' && source == $source'
    const baseFilter = `_type == "appointmentRequest" && defined(submittedAt) && submittedAt >= $start && submittedAt < $end${sourceFilter}`
    const query = `{
      "total": count(*[${baseFilter}]),
      "call": count(*[${baseFilter} && submissionAction == "call_click"]),
      "whatsapp": count(*[${baseFilter} && submissionAction == "whatsapp_redirect"]),
      "form": count(*[${baseFilter} && (!defined(submissionAction) || submissionAction in ["callback_request", "thank_you_redirect"])]),
      "other": count(*[${baseFilter} && defined(submissionAction) && !(submissionAction in ["call_click", "whatsapp_redirect", "callback_request", "thank_you_redirect"])]),
      "latest": *[${baseFilter}] | order(submittedAt desc)[0...100]{
        _id,
        name,
        phone,
        email,
        city,
        source,
        submissionAction,
        callTargetPhone,
        ctaLocation,
        submittedAt,
        status,
        message
      }
    }`

    setLoading(true)
    setError(null)
    client
      .fetch<LeadDashboardData>(query, {
        start: range.start.toISOString(),
        end: range.end.toISOString(),
        source,
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
  }, [client, period, range.end, range.start, source])

  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Lead Dashboard</h1>
          <p style={styles.subtitle}>Track form, WhatsApp, and landing-page call-click leads.</p>
        </div>
        <div style={styles.rangeLabel}>{formatRange(range.start, range.end)}</div>
      </div>

      <section style={styles.controls}>
        <div style={styles.filterGroup}>
          {periods.map((item) => (
            <FilterButton key={item.key} active={period === item.key} onClick={() => setPeriod(item.key)}>
              {item.label}
            </FilterButton>
          ))}
        </div>
        <div style={styles.filterGroup}>
          {sources.map((item) => (
            <FilterButton key={item.key} active={source === item.key} onClick={() => setSource(item.key)}>
              {item.label}
            </FilterButton>
          ))}
        </div>
      </section>

      {error ? <div style={styles.error}>{error}</div> : null}

      <section style={styles.statsGrid}>
        <StatCard label="Total leads" value={data?.total ?? 0} />
        <StatCard label="Call clicks" value={data?.call ?? 0} tone="#0b6e99" />
        <StatCard label="WhatsApp leads" value={data?.whatsapp ?? 0} tone="#168a46" />
        <StatCard label="Form leads" value={data?.form ?? 0} tone="#b45309" />
        {(data?.other ?? 0) > 0 ? <StatCard label="Other" value={data?.other ?? 0} tone="#7c3aed" /> : null}
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
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Source</th>
                <th style={styles.th}>CTA / City</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {!loading && data?.latest.length === 0 ? (
                <tr>
                  <td style={styles.emptyCell} colSpan={7}>
                    No leads found for this filter.
                  </td>
                </tr>
              ) : null}
              {(data?.latest ?? []).map((lead) => {
                const isCall = lead.submissionAction === 'call_click'
                return (
                  <tr key={lead._id}>
                    <td style={styles.td}>{formatDateTime(lead.submittedAt)}</td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, ...(isCall ? styles.callBadge : undefined)}}>
                        {getActionLabel(lead.submissionAction)}
                      </span>
                    </td>
                    <td style={styles.td}>{isCall ? 'Unknown caller' : lead.name || '-'}</td>
                    <td style={styles.td}>{isCall ? lead.callTargetPhone || lead.phone || '-' : lead.phone || '-'}</td>
                    <td style={styles.td}>{lead.source || '-'}</td>
                    <td style={styles.td}>{lead.ctaLocation || lead.city || '-'}</td>
                    <td style={styles.td}>{lead.status || '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100%',
    background: '#f6f7f8',
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
    marginBottom: '20px',
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
    background: '#101112',
    borderColor: '#101112',
    color: '#fff',
  },
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
    borderRadius: '10px',
    background: '#fff',
    padding: '18px',
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
  tableCard: {
    border: '1px solid #e4e7eb',
    borderRadius: '10px',
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
    minWidth: '920px',
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
}

export const leadDashboardTool = definePlugin({
  name: 'lead-dashboard-tool',
  tools: [
    {
      name: 'lead-dashboard',
      title: 'Lead Dashboard',
      icon: DashboardIcon,
      component: LeadDashboardTool,
    } satisfies Tool,
  ],
})
