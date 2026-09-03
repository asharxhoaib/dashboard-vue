<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'
}

const props = withDefaults(defineProps<Props>(), { variant: 'default' })

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  outline: 'border border-input text-foreground',
  success: 'bg-success text-success-foreground',
}

const classes = computed(() =>
  [
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
    variantClasses[props.variant],
  ].join(' '),
)
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
