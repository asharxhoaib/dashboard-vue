<script setup lang="ts">
withDefaults(defineProps<{ height?: string }>(), { height: '200px' })
</script>

<template>
  <div class="w-full animate-pulse rounded-md bg-muted" :style="{ height }">
    <div class="flex h-full items-end gap-2 p-4">
      <div v-for="n in 8" :key="n" class="flex-1 rounded-sm bg-muted-foreground/20" :style="{ height: `${20 + (n % 5) * 15}%` }" />
    </div>
  </div>
</template>
