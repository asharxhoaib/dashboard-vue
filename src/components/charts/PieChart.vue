<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { useDark } from '@/composables/useDark'

ChartJS.register(ArcElement, Legend, Tooltip)

const props = defineProps<{ labels: string[]; values: number[] }>()
const { isDark } = useDark()
const palette = ['#3b82f6', '#22c55e', '#f97316', '#a855f7', '#ec4899', '#14b8a6']

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: props.labels.map((_, i) => palette[i % palette.length]),
      borderColor: isDark.value ? '#0f172a' : '#ffffff',
      borderWidth: 2,
    },
  ],
}))

const chartOptions = computed(() => {
  const textColor = isDark.value ? '#cbd5e1' : '#475569'
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: textColor, boxWidth: 10, font: { size: 11 } } },
      tooltip: { backgroundColor: isDark.value ? '#1e293b' : '#ffffff', titleColor: textColor, bodyColor: textColor },
    },
  }
})
</script>

<template>
  <div class="h-56 w-full">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>
