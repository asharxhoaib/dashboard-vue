<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'

interface Props {
  align?: 'start' | 'center' | 'end'
  contentClass?: string
}

withDefaults(defineProps<Props>(), { align: 'end', contentClass: 'w-56' })
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        :align="align"
        :side-offset="6"
        :class="[
          'z-50 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none',
          contentClass,
        ]"
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
