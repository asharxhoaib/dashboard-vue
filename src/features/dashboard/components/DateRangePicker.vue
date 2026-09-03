<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/button.vue'
import Input from '@/components/ui/input.vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import type { DateRangePreset } from '@/types/dashboard'

const dashboardStore = useDashboardStore()
const showCustom = ref(false)
const customStart = ref(dashboardStore.dateRange.start)
const customEnd = ref(dashboardStore.dateRange.end)

const PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
]

function selectPreset(preset: DateRangePreset): void {
  showCustom.value = false
  dashboardStore.setPreset(preset)
}

function applyCustom(): void {
  if (!customStart.value || !customEnd.value) return
  dashboardStore.setCustomRange(customStart.value, customEnd.value)
  showCustom.value = false
}
</script>

<template>
  <div class="relative flex flex-wrap items-center gap-1.5">
    <div class="flex rounded-md border border-input bg-background p-0.5">
      <button
        v-for="preset in PRESETS"
        :key="preset.value"
        class="rounded px-2.5 py-1 text-xs font-medium transition-colors"
        :class="
          dashboardStore.dateRange.preset === preset.value
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent'
        "
        @click="selectPreset(preset.value)"
      >
        {{ preset.label }}
      </button>
      <button
        class="rounded px-2.5 py-1 text-xs font-medium transition-colors"
        :class="
          dashboardStore.dateRange.preset === 'custom'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent'
        "
        @click="showCustom = !showCustom"
      >
        Custom
      </button>
    </div>

    <div
      v-if="showCustom"
      class="absolute right-0 top-10 z-20 flex w-64 flex-col gap-2 rounded-md border border-border bg-popover p-3 shadow-md"
    >
      <label class="text-xs font-medium text-muted-foreground">
        Start
        <Input v-model="customStart" type="date" class="mt-1" />
      </label>
      <label class="text-xs font-medium text-muted-foreground">
        End
        <Input v-model="customEnd" type="date" class="mt-1" />
      </label>
      <Button size="sm" @click="applyCustom">Apply range</Button>
    </div>
  </div>
</template>
