<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import Card from '@/components/ui/card.vue'
import Button from '@/components/ui/button.vue'
import BarChart from '@/components/charts/BarChart.vue'
import { fetchChartDataset, fetchTableRows } from '@/lib/mockApi'
import { exportRowsAsCsv } from '@/lib/csv'
import { useDashboardStore } from '@/stores/dashboardStore'

const dashboardStore = useDashboardStore()

const { data: rows } = useQuery({
  queryKey: ['table-rows'],
  queryFn: () => fetchTableRows(),
  staleTime: 60_000,
})

const { data: chartDataset } = useQuery({
  queryKey: ['chart-dataset', 'report'],
  queryFn: () => fetchChartDataset(dashboardStore.dateRange),
  staleTime: 60_000,
})

const filteredRows = computed(() => {
  const start = new Date(dashboardStore.dateRange.start).getTime()
  const end = new Date(dashboardStore.dateRange.end).getTime()
  return (rows.value ?? []).filter((row) => {
    const time = new Date(row.date).getTime()
    return time >= start && time <= end
  })
})

const totalRevenue = computed(() => filteredRows.value.reduce((sum, row) => sum + row.amount, 0))
const paidCount = computed(() => filteredRows.value.filter((r) => r.status === 'paid').length)
const failedCount = computed(() => filteredRows.value.filter((r) => r.status === 'failed').length)

function handlePrint(): void {
  window.print()
}

function handleExport(): void {
  exportRowsAsCsv(filteredRows.value, `report-${dashboardStore.dateRange.start}-to-${dashboardStore.dateRange.end}`)
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-3 no-print">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Reports</h1>
        <p class="text-sm text-muted-foreground">Printable summary for {{ dashboardStore.rangeLabel.toLowerCase() }}.</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="handleExport">Export CSV</Button>
        <Button @click="handlePrint">Print summary</Button>
      </div>
    </div>

    <div id="print-area" class="flex flex-col gap-4">
      <div class="hidden print:block">
        <h1 class="text-xl font-semibold">Performance Report</h1>
        <p class="text-sm text-muted-foreground">{{ dashboardStore.rangeLabel }}</p>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p class="text-xs font-medium text-muted-foreground">Total revenue</p>
          <p class="mt-1 text-xl font-semibold">{{ formatCurrency(totalRevenue) }}</p>
        </Card>
        <Card>
          <p class="text-xs font-medium text-muted-foreground">Paid orders</p>
          <p class="mt-1 text-xl font-semibold">{{ paidCount }}</p>
        </Card>
        <Card>
          <p class="text-xs font-medium text-muted-foreground">Failed orders</p>
          <p class="mt-1 text-xl font-semibold">{{ failedCount }}</p>
        </Card>
      </div>

      <Card v-if="chartDataset">
        <h2 class="mb-3 text-sm font-semibold">Revenue &amp; Orders</h2>
        <BarChart :labels="chartDataset.labels" :series="chartDataset.series" />
      </Card>

      <Card :padded="false">
        <table class="w-full text-left text-sm">
          <thead class="bg-muted/50">
            <tr>
              <th class="px-3 py-2 text-xs font-semibold text-muted-foreground">Order</th>
              <th class="px-3 py-2 text-xs font-semibold text-muted-foreground">Customer</th>
              <th class="px-3 py-2 text-xs font-semibold text-muted-foreground">Amount</th>
              <th class="px-3 py-2 text-xs font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredRows.slice(0, 25)" :key="row.id" class="border-t border-border">
              <td class="px-3 py-2">{{ row.id }}</td>
              <td class="px-3 py-2">{{ row.customer }}</td>
              <td class="px-3 py-2">{{ formatCurrency(row.amount) }}</td>
              <td class="px-3 py-2 capitalize">{{ row.status }}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  </div>
</template>

<style scoped>
@media print {
  :deep(.no-print) {
    display: none !important;
  }
}
</style>
