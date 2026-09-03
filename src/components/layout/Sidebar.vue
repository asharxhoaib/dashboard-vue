<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useAuthStore } from '@/stores/authStore'

interface NavLink {
  to: string
  label: string
  icon: string
  roles?: Array<'admin' | 'viewer'>
}

const NAV_LINKS: NavLink[] = [
  { to: '/', label: 'Overview', icon: '📊' },
  { to: '/data', label: 'Data Table', icon: '🗂️' },
  { to: '/reports', label: 'Reports', icon: '🧾' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

const dashboardStore = useDashboardStore()
const authStore = useAuthStore()
const route = useRoute()

const visibleLinks = computed(() =>
  NAV_LINKS.filter((link) => !link.roles || authStore.hasRole(link.roles)),
)

function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <aside
    class="hidden shrink-0 border-r border-border bg-card transition-all duration-200 md:flex md:flex-col"
    :class="dashboardStore.sidebarCollapsed ? 'md:w-16' : 'md:w-56'"
  >
    <div class="flex h-14 items-center gap-2 border-b border-border px-4">
      <div class="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
        D
      </div>
      <span v-if="!dashboardStore.sidebarCollapsed" class="text-sm font-semibold">Dashboard</span>
    </div>

    <nav class="flex-1 space-y-1 p-2">
      <RouterLink
        v-for="link in visibleLinks"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
        :class="
          isActive(link.to)
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        "
      >
        <span class="text-base">{{ link.icon }}</span>
        <span v-if="!dashboardStore.sidebarCollapsed">{{ link.label }}</span>
      </RouterLink>
    </nav>

    <button
      class="m-2 flex items-center justify-center rounded-md border border-border py-1.5 text-xs text-muted-foreground hover:bg-accent"
      @click="dashboardStore.toggleSidebar"
    >
      {{ dashboardStore.sidebarCollapsed ? '»' : '« Collapse' }}
    </button>
  </aside>
</template>
