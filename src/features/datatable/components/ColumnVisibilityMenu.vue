<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import DropdownMenu from '@/components/ui/dropdown-menu.vue'
import Button from '@/components/ui/button.vue'
import type { TableRow } from '@/types/dashboard'

defineProps<{ table: Table<TableRow> }>()
</script>

<template>
  <DropdownMenu align="end" content-class="w-48">
    <template #trigger>
      <Button variant="outline" size="sm">Columns ▾</Button>
    </template>
    <label
      v-for="column in table.getAllLeafColumns()"
      :key="column.id"
      class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
    >
      <input
        type="checkbox"
        class="h-3.5 w-3.5 rounded border-input"
        :checked="column.getIsVisible()"
        :disabled="!column.getCanHide()"
        @change="column.toggleVisibility()"
      />
      <span class="capitalize">{{ column.id }}</span>
    </label>
  </DropdownMenu>
</template>
