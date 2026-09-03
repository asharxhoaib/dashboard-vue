<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { CategoryScale, Chart as ChartJS, Filler, LinearScale, LineElement, PointElement } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler)

const props = withDefaults(
  defineProps<{ data: number[]; color?: string; positive?: boolean }>(),
  { color: '', positive: true },
)

const resolvedColor = computed(() => props.color || (props.positive ? '#22c55e' : '#ef4444'))

const chartData = computed(() => ({
  labels: props.data.map((_, i) => String(i)),
  datasets: [
    {
      data: props.data,
      borderColor: resolvedColor.value,
      backgroundColor: `${resolvedColor.value}1a`,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 1.5,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 300 },
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
  scales: {
    x: { display: false },
    y: { display: false },
  },
  elements: { point: { radius: 0 } },
}
</script>

<template>
  <div class="h-10 w-24">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
