import type { ChartDataset, DateRange, KpiMetric, LiveFeedEvent, MetricId, TableRow } from '@/types/dashboard'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomLatency(min = 300, max = 900): number {
  return Math.floor(Math.random() * (max - min)) + min
}

function seededRandom(seed: number): () => number {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function daysBetween(range: DateRange): number {
  switch (range.preset) {
    case '7d':
      return 7
    case '30d':
      return 30
    case '90d':
      return 90
    case 'custom': {
      const start = new Date(range.start).getTime()
      const end = new Date(range.end).getTime()
      const diff = Math.round((end - start) / (1000 * 60 * 60 * 24))
      return Math.max(1, diff)
    }
  }
}

function generateSeries(days: number, base: number, volatility: number, seed: number): number[] {
  const rand = seededRandom(seed)
  const values: number[] = []
  let current = base
  for (let i = 0; i < days; i++) {
    const trend = Math.sin(i / 6) * volatility * 0.4
    const noise = (rand() - 0.5) * volatility
    current = Math.max(0, current + trend * 0.1 + noise * 0.1)
    values.push(Math.round(current * 100) / 100)
  }
  return values
}

const METRIC_CONFIG: Record<MetricId, { label: string; base: number; volatility: number; format: KpiMetric['format']; seed: number }> = {
  revenue: { label: 'Revenue', base: 18500, volatility: 2200, format: 'currency', seed: 11 },
  users: { label: 'Active Users', base: 4200, volatility: 380, format: 'number', seed: 23 },
  orders: { label: 'Orders', base: 860, volatility: 95, format: 'number', seed: 37 },
  conversion: { label: 'Conversion Rate', base: 3.2, volatility: 0.6, format: 'percent', seed: 53 },
}

export async function fetchKpiMetrics(range: DateRange): Promise<KpiMetric[]> {
  await delay(randomLatency())
  const days = daysBetween(range)

  return (Object.keys(METRIC_CONFIG) as MetricId[]).map((id) => {
    const cfg = METRIC_CONFIG[id]
    const sparkline = generateSeries(days, cfg.base, cfg.volatility, cfg.seed)
    const value = sparkline[sparkline.length - 1] ?? cfg.base
    const previousValue = sparkline[Math.max(0, sparkline.length - 2)] ?? cfg.base
    return {
      id,
      label: cfg.label,
      value,
      previousValue,
      format: cfg.format,
      sparkline,
    }
  })
}

export async function fetchChartDataset(range: DateRange): Promise<ChartDataset> {
  await delay(randomLatency())
  const days = daysBetween(range)
  const labels = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - i - 1))
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  })

  return {
    labels,
    series: [
      { label: 'Revenue', data: generateSeries(days, 18500, 2200, 11) },
      { label: 'Orders', data: generateSeries(days, 860, 95, 37) },
    ],
  }
}

export interface ChannelBreakdown {
  channel: string
  value: number
}

export async function fetchChannelBreakdown(): Promise<ChannelBreakdown[]> {
  await delay(randomLatency(200, 500))
  return [
    { channel: 'Web', value: 4200 },
    { channel: 'Mobile', value: 3100 },
    { channel: 'API', value: 1450 },
    { channel: 'Partner', value: 890 },
  ]
}

const FIRST_NAMES = ['Ava', 'Liam', 'Noah', 'Emma', 'Oliver', 'Sophia', 'Mason', 'Isabella', 'Ethan', 'Mia', 'Lucas', 'Amelia', 'Zayn', 'Layla', 'Omar', 'Farah']
const LAST_NAMES = ['Nguyen', 'Smith', 'Garcia', 'Khan', 'Johnson', 'Brown', 'Ahmed', 'Davis', 'Wilson', 'Hassan', 'Miller', 'Moore', 'Taylor', 'Clark']
const STATUSES: TableRow['status'][] = ['paid', 'pending', 'failed', 'refunded']
const CHANNELS: TableRow['channel'][] = ['web', 'mobile', 'api', 'partner']

let cachedRows: TableRow[] | null = null

function buildRows(): TableRow[] {
  const rand = seededRandom(97)
  const rows: TableRow[] = []
  for (let i = 0; i < 240; i++) {
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]
    const status = STATUSES[Math.floor(rand() * STATUSES.length)]
    const channel = CHANNELS[Math.floor(rand() * CHANNELS.length)]
    const daysAgo = Math.floor(rand() * 120)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    rows.push({
      id: `ord_${(i + 1).toString().padStart(4, '0')}`,
      customer: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      amount: Math.round((rand() * 480 + 20) * 100) / 100,
      status,
      channel,
      date: date.toISOString(),
    })
  }
  return rows
}

export async function fetchTableRows(): Promise<TableRow[]> {
  await delay(randomLatency(400, 900))
  if (!cachedRows) {
    cachedRows = buildRows()
  }
  return cachedRows
}

export async function deleteTableRows(ids: string[]): Promise<void> {
  await delay(randomLatency(200, 500))
  if (!cachedRows) return
  const idSet = new Set(ids)
  cachedRows = cachedRows.filter((row) => !idSet.has(row.id))
}

const EVENT_TYPES: LiveFeedEvent['type'][] = ['order', 'signup', 'refund', 'alert']

const EVENT_MESSAGES: Record<LiveFeedEvent['type'], string[]> = {
  order: ['New order placed', 'Order fulfilled', 'Order shipped'],
  signup: ['New user signed up', 'Trial started', 'Team invite accepted'],
  refund: ['Refund issued', 'Chargeback filed', 'Refund requested'],
  alert: ['High latency detected', 'Payment gateway retried', 'Rate limit warning'],
}

let eventCounter = 0

export function generateLiveFeedEvent(): LiveFeedEvent {
  eventCounter += 1
  const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)]
  const messages = EVENT_MESSAGES[type]
  const message = messages[Math.floor(Math.random() * messages.length)]
  return {
    id: `evt_${Date.now()}_${eventCounter}`,
    type,
    message,
    timestamp: new Date().toISOString(),
  }
}
