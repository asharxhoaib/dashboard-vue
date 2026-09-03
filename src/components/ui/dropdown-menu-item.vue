<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui'

withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false })
const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <DropdownMenuItem
    :disabled="disabled"
    class="flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    @select="emit('select')"
  >
    <slot />
  </DropdownMenuItem>
</template>
