<script setup lang="ts">
import { watch } from 'vue'
import Dialog from '@/components/ui/dialog.vue'
import Input from '@/components/ui/input.vue'
import { useCommandPalette } from '@/composables/useCommandPalette'

const props = defineProps<{ open: boolean; searchRecords?: () => { id: string; label: string; description: string }[] }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const palette = useCommandPalette({ searchRecords: props.searchRecords })

watch(
  () => props.open,
  (value) => {
    if (value) palette.open()
    else palette.close()
  },
)

watch(
  () => palette.isOpen.value,
  (value) => emit('update:open', value),
)

function groupLabel(index: number): string | null {
  const item = palette.filteredItems.value[index]
  const prevItem = palette.filteredItems.value[index - 1]
  if (!prevItem || prevItem.group !== item.group) return item.group
  return null
}
</script>

<template>
  <Dialog :open="palette.isOpen.value" title="" :show-close="false" @update:open="(v) => emit('update:open', v)">
    <div class="-m-4">
      <div class="flex items-center gap-2 border-b border-border px-3 py-2">
        <span class="text-muted-foreground">🔍</span>
        <Input
          :model-value="palette.query.value"
          placeholder="Search pages, records…"
          class="border-none px-0 shadow-none focus-visible:ring-0"
          @update:model-value="(v) => (palette.query.value = v)"
        />
        <kbd class="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">Esc</kbd>
      </div>

      <div class="max-h-80 overflow-y-auto p-2">
        <p v-if="palette.filteredItems.value.length === 0" class="px-2 py-6 text-center text-sm text-muted-foreground">
          No results for "{{ palette.query.value }}"
        </p>

        <template v-for="(item, index) in palette.filteredItems.value" :key="item.id">
          <p v-if="groupLabel(index)" class="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase text-muted-foreground">
            {{ groupLabel(index) }}
          </p>
          <button
            class="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm"
            :class="index === palette.activeIndex.value ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'"
            @mouseenter="palette.activeIndex.value = index"
            @click="item.action()"
          >
            <span>{{ item.label }}</span>
            <span v-if="item.description" class="truncate pl-2 text-xs text-muted-foreground">{{ item.description }}</span>
          </button>
        </template>
      </div>
    </div>
  </Dialog>
</template>
