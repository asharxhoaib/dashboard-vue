<script setup lang="ts">
import { useRoute } from 'vue-router'

interface NavLink {
  to: string
  label: string
  icon: string
}

const NAV_LINKS: NavLink[] = [
  { to: '/', label: 'Overview', icon: '📊' },
  { to: '/data', label: 'Data', icon: '🗂️' },
  { to: '/reports', label: 'Reports', icon: '🧾' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

const route = useRoute()

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <nav class="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-background/95 backdrop-blur md:hidden">
    <RouterLink
      v-for="link in NAV_LINKS"
      :key="link.to"
      :to="link.to"
      class="flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium"
      :class="isActive(link.to) ? 'text-primary' : 'text-muted-foreground'"
    >
      <span class="text-lg leading-none">{{ link.icon }}</span>
      {{ link.label }}
    </RouterLink>
  </nav>
</template>
