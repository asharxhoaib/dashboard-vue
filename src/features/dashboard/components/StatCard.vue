<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/components/ui/card.vue'
import Sparkline from '@/components/charts/Sparkline.vue'
import type { KpiMetric } from '@/types/dashboard'

const props = defineProps<{ metric: KpiMetric }>()

function formatValue(value: number, format: KpiMetric['format']): string {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(Math.round(value))
  }
}

const changePercent = computed(() => {
  if (props.metric.previousValue === 0) return 0
  return ((props.metric.value - props.metric.previousValue) / props.metric.previousValue) * 100
})

const isPositive = computed(() => changePercent.value >= 0)
</script>

<template>
  <Card class="flex flex-col gap-3">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xs font-medium text-muted-foreground">{{ metric.label }}</p>
        <p class="mt-1 text-2xl font-semibold tracking-tight">{{ formatValue(metric.value, metric.format) }}</p>
      </div>
      <Sparkline :data="metric.sparkline" :positive="isPositive" />
    </div>
    <div class="flex items-center gap-1 text-xs font-medium" :class="isPositive ? 'text-success' : 'text-destructive'">
      <span>{{ isPositive ? '▲' : '▼' }}</span>
      <span>{{ Math.abs(changePercent).toFixed(1) }}%</span>
      <span class="font-normal text-muted-foreground">vs previous period</span>
    </div>
  </Card>
</template>
