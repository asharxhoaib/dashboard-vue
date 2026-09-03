import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { DateRange, DateRangePreset } from '@/types/dashboard'

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function rangeForPreset(preset: DateRangePreset): DateRange {
  const end = new Date()
  const start = new Date()
  const days = preset === '7d' ? 7 : preset === '30d' ? 30 : preset === '90d' ? 90 : 30
  start.setDate(start.getDate() - days)
  return { preset, start: isoDate(start), end: isoDate(end) }
}

export const useDashboardStore = defineStore('dashboard', () => {
  const dateRange = ref<DateRange>(rangeForPreset('30d'))
  const searchQuery = ref('')
  const sidebarCollapsed = ref(false)

  const rangeLabel = computed(() => {
    switch (dateRange.value.preset) {
      case '7d':
        return 'Last 7 days'
      case '30d':
        return 'Last 30 days'
      case '90d':
        return 'Last 90 days'
      case 'custom':
        return `${dateRange.value.start} → ${dateRange.value.end}`
    }
  })

  function setPreset(preset: DateRangePreset): void {
    if (preset === 'custom') return
    dateRange.value = rangeForPreset(preset)
  }

  function setCustomRange(start: string, end: string): void {
    dateRange.value = { preset: 'custom', start, end }
  }

  function setSearchQuery(query: string): void {
    searchQuery.value = query
  }

  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    dateRange,
    rangeLabel,
    searchQuery,
    sidebarCollapsed,
    setPreset,
    setCustomRange,
    setSearchQuery,
    toggleSidebar,
  }
})
