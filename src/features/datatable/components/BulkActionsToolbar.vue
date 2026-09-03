<script setup lang="ts">
import Button from '@/components/ui/button.vue'

const props = defineProps<{ selectedCount: number }>()
const emit = defineEmits<{ delete: []; export: []; clear: [] }>()
</script>

<template>
  <div
    v-if="props.selectedCount > 0"
    class="flex flex-wrap items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm"
  >
    <span class="font-medium">{{ props.selectedCount }} selected</span>
    <div class="ml-auto flex items-center gap-2">
      <Button variant="outline" size="sm" @click="emit('export')">Export selected</Button>
      <Button variant="destructive" size="sm" @click="emit('delete')">Delete selected</Button>
      <Button variant="ghost" size="sm" @click="emit('clear')">Clear</Button>
    </div>
  </div>
</template>
