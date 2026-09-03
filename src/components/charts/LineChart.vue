<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { useDark } from '@/composables/useDark'
import type { ChartSeries } from '@/types/dashboard'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Legend, Tooltip)

const props = defineProps<{ labels: string[]; series: ChartSeries[] }>()

const { isDark } = useDark()

const palette = ['#3b82f6', '#22c55e', '#f97316', '#a855f7']

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.series.map((s, i) => ({
    label: s.label,
    data: s.data,
    borderColor: s.color ?? palette[i % palette.length],
    backgroundColor: `${s.color ?? palette[i % palette.length]}22`,
    tension: 0.35,
    fill: true,
    pointRadius: 0,
    borderWidth: 2,
  })),
}))

const chartOptions = computed(() => {
  const gridColor = isDark.value ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const textColor = isDark.value ? '#cbd5e1' : '#475569'
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: props.series.length > 1, labels: { color: textColor, boxWidth: 10, font: { size: 11 } } },
      tooltip: { backgroundColor: isDark.value ? '#1e293b' : '#ffffff', titleColor: textColor, bodyColor: textColor, borderColor: gridColor, borderWidth: 1 },
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: textColor, maxRotation: 0, autoSkip: true } },
      y: { grid: { color: gridColor }, ticks: { color: textColor } },
    },
  }
})
</script>

<template>
  <div class="h-52 w-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
