<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

interface NavLink {
  to: string
  label: string
  icon: string
}

const NAV_LINKS: NavLink[] = [
  { to: '/', label: 'Overview', icon: '📊' },
  { to: '/data', label: 'Data Table', icon: '🗂️' },
  { to: '/reports', label: 'Reports', icon: '🧾' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

function navigate(to: string): void {
  router.push(to)
  emit('close')
}

function handleLogout(): void {
  authStore.logout()
  navigate('/login')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="props.open" class="fixed inset-0 z-40 bg-black/50 md:hidden" @click="emit('close')" />
    </Transition>
    <Transition name="slide">
      <aside
        v-if="props.open"
        class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card shadow-xl md:hidden"
      >
        <div class="flex h-14 items-center justify-between border-b border-border px-4">
          <span class="text-sm font-semibold">Dashboard</span>
          <button class="rounded-md p-1.5 hover:bg-accent" @click="emit('close')">✕</button>
        </div>
        <nav class="flex-1 space-y-1 p-2">
          <button
            v-for="link in NAV_LINKS"
            :key="link.to"
            class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium"
            :class="route.path === link.to ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent'"
            @click="navigate(link.to)"
          >
            <span class="text-base">{{ link.icon }}</span>
            {{ link.label }}
          </button>
        </nav>
        <div class="border-t border-border p-3">
          <p class="truncate text-sm font-medium">{{ authStore.user?.name }}</p>
          <p class="truncate text-xs text-muted-foreground">{{ authStore.user?.email }}</p>
          <button class="mt-2 w-full rounded-md border border-border py-1.5 text-xs font-medium hover:bg-accent" @click="handleLogout">
            Log out
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
