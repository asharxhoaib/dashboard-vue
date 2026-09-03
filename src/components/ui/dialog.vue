<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'

interface Props {
  open: boolean
  title?: string
  showClose?: boolean
}

withDefaults(defineProps<Props>(), { title: '', showClose: true })
const emit = defineEmits<{ 'update:open': [value: boolean] }>()
</script>

<template>
  <DialogRoot :open="open" @update:open="(value) => emit('update:open', value)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
      <DialogContent
        class="fixed left-1/2 top-24 z-50 w-[92vw] max-w-lg -translate-x-1/2 rounded-lg border border-border bg-popover text-popover-foreground shadow-lg focus:outline-none"
      >
        <div v-if="title || showClose" class="flex items-center justify-between border-b border-border px-4 py-3">
          <DialogTitle v-if="title" class="text-sm font-semibold">{{ title }}</DialogTitle>
          <span v-else />
          <DialogClose
            v-if="showClose"
            class="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Close"
          >
            ✕
          </DialogClose>
        </div>
        <div class="p-4">
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
