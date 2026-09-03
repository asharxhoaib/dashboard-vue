<script setup lang="ts">
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: SelectOption[]
  placeholder?: string
}

withDefaults(defineProps<Props>(), { placeholder: 'Select…' })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <SelectRoot :model-value="modelValue" @update:model-value="(value) => emit('update:modelValue', String(value))">
    <SelectTrigger
      class="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
    >
      <SelectValue :placeholder="placeholder" />
      <SelectIcon>
        <span class="text-muted-foreground">▾</span>
      </SelectIcon>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent class="z-50 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md" position="popper" :side-offset="4">
        <SelectViewport class="p-1">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            class="relative flex cursor-pointer select-none items-center rounded-sm px-6 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
          >
            <SelectItemIndicator class="absolute left-1.5 inline-flex items-center">✓</SelectItemIndicator>
            <SelectItemText>{{ option.label }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
