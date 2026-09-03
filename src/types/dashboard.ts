export type MetricId = 'revenue' | 'users' | 'orders' | 'conversion'

export interface KpiMetric {
  id: MetricId
  label: string
  value: number
  previousValue: number
  format: 'currency' | 'number' | 'percent'
  sparkline: number[]
}

export interface ChartSeries {
  label: string
  data: number[]
  color?: string
}

export interface ChartDataset {
  labels: string[]
  series: ChartSeries[]
}

export interface TableRow {
  id: string
  customer: string
  email: string
  amount: number
  status: 'paid' | 'pending' | 'failed' | 'refunded'
  channel: 'web' | 'mobile' | 'api' | 'partner'
  date: string
}

export type DateRangePreset = '7d' | '30d' | '90d' | 'custom'

export interface DateRange {
  preset: DateRangePreset
  start: string
  end: string
}

export interface LiveFeedEvent {
  id: string
  type: 'order' | 'signup' | 'refund' | 'alert'
  message: string
  timestamp: string
}
