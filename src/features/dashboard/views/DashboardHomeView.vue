<script setup lang="ts">
import { onMounted } from 'vue'
import Card from '@/components/ui/card.vue'
import Badge from '@/components/ui/badge.vue'
import ChartSkeleton from '@/components/charts/ChartSkeleton.vue'
import EmptyState from '@/components/charts/EmptyState.vue'
import LineChart from '@/components/charts/LineChart.vue'
import DonutChart from '@/components/charts/DonutChart.vue'
import StatCard from '@/features/dashboard/components/StatCard.vue'
import DateRangePicker from '@/features/dashboard/components/DateRangePicker.vue'
import { useMetrics } from '@/composables/useMetrics'
import { useLiveFeed } from '@/composables/useLiveFeed'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useNotificationStore } from '@/stores/notificationStore'
import type { LiveFeedEvent } from '@/types/dashboard'

const dashboardStore = useDashboardStore()
const notificationStore = useNotificationStore()
const { metrics, isMetricsLoading, chartDataset, isChartLoading, channelBreakdown, isChannelLoading } = useMetrics()

const eventIcons: Record<LiveFeedEvent['type'], string> = {
  order: '🛒',
  signup: '👤',
  refund: '↩️',
  alert: '⚠️',
}

const { events, start } = useLiveFeed({
  intervalMs: 4500,
  onEvent: (event) => {
    if (event.type === 'alert' && notificationStore.preferences.liveFeedAlerts) {
      notificationStore.addNotification({ title: 'Live alert', message: event.message, level: 'warning' })
    }
  },
})

onMounted(() => start())

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Overview</h1>
        <p class="text-sm text-muted-foreground">{{ dashboardStore.rangeLabel }} · live data</p>
      </div>
      <DateRangePicker />
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <template v-if="isMetricsLoading">
        <Card v-for="n in 4" :key="n" class="h-32 animate-pulse" />
      </template>
      <StatCard v-for="metric in metrics" v-else :key="metric.id" :metric="metric" />
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card class="lg:col-span-2">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-sm font-semibold">Revenue &amp; Orders trend</h2>
        </div>
        <ChartSkeleton v-if="isChartLoading" height="208px" />
        <EmptyState v-else-if="chartDataset.series.length === 0" />
        <LineChart v-else :labels="chartDataset.labels" :series="chartDataset.series" />
      </Card>

      <Card>
        <h2 class="mb-3 text-sm font-semibold">Channel breakdown</h2>
        <ChartSkeleton v-if="isChannelLoading" height="224px" />
        <EmptyState v-else-if="channelBreakdown.length === 0" />
        <DonutChart
          v-else
          :labels="channelBreakdown.map((c) => c.channel)"
          :values="channelBreakdown.map((c) => c.value)"
        />
      </Card>
    </div>

    <Card>
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-sm font-semibold">Live activity</h2>
        <Badge variant="success" class="flex items-center gap-1">
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
          Live
        </Badge>
      </div>
      <EmptyState v-if="events.length === 0" title="Waiting for events" description="New activity will stream in shortly." />
      <ul v-else class="flex max-h-72 flex-col gap-2 overflow-y-auto">
        <li
          v-for="event in events"
          :key="event.id"
          class="flex items-center gap-3 rounded-md border border-border/60 px-3 py-2 text-sm"
        >
          <span class="text-base">{{ eventIcons[event.type] }}</span>
          <span class="flex-1">{{ event.message }}</span>
          <span class="text-xs text-muted-foreground">{{ formatTime(event.timestamp) }}</span>
        </li>
      </ul>
    </Card>
  </div>
</template>
