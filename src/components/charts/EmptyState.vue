<script setup lang="ts">
withDefaults(defineProps<{ title?: string; description?: string }>(), {
  title: 'No data yet',
  description: 'There is nothing to show for the selected range.',
})
</script>

<template>
  <div class="flex h-full min-h-[160px] flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border p-6 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mb-2 h-8 w-8 text-muted-foreground">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M7 15l3-3 3 2 4-5" />
    </svg>
    <p class="text-sm font-medium text-foreground">{{ title }}</p>
    <p class="text-xs text-muted-foreground">{{ description }}</p>
  </div>
</template>
