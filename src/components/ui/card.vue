<script setup lang="ts">
withDefaults(defineProps<{ padded?: boolean }>(), { padded: true })
</script>

<template>
  <div class="rounded-lg border border-border bg-card text-card-foreground shadow-sm" :class="padded ? 'p-4 sm:p-5' : ''">
    <slot />
  </div>
</template>
