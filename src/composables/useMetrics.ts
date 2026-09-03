import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { fetchChannelBreakdown, fetchChartDataset, fetchKpiMetrics } from '@/lib/mockApi'
import { useDashboardStore } from '@/stores/dashboardStore'

/**
 * TanStack Query-backed KPI + chart data fetching. Query keys include the
 * active date range so widgets automatically refetch when the global
 * date-range filter (Pinia dashboardStore) changes.
 */
export function useMetrics() {
  const dashboardStore = useDashboardStore()

  const rangeKey = computed(() => [
    dashboardStore.dateRange.preset,
    dashboardStore.dateRange.start,
    dashboardStore.dateRange.end,
  ])

  const kpiQuery = useQuery({
    queryKey: computed(() => ['kpi-metrics', ...rangeKey.value]),
    queryFn: () => fetchKpiMetrics(dashboardStore.dateRange),
    staleTime: 30_000,
  })

  const chartQuery = useQuery({
    queryKey: computed(() => ['chart-dataset', ...rangeKey.value]),
    queryFn: () => fetchChartDataset(dashboardStore.dateRange),
    staleTime: 30_000,
  })

  const channelQuery = useQuery({
    queryKey: ['channel-breakdown'],
    queryFn: () => fetchChannelBreakdown(),
    staleTime: 60_000,
  })

  return {
    metrics: computed(() => kpiQuery.data.value ?? []),
    isMetricsLoading: kpiQuery.isPending,
    metricsError: kpiQuery.error,
    chartDataset: computed(() => chartQuery.data.value ?? { labels: [], series: [] }),
    isChartLoading: chartQuery.isPending,
    channelBreakdown: computed(() => channelQuery.data.value ?? []),
    isChannelLoading: channelQuery.isPending,
    refetchAll: () => {
      kpiQuery.refetch()
      chartQuery.refetch()
      channelQuery.refetch()
    },
  }
}
