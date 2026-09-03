<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/ui/button.vue'
import DropdownMenu from '@/components/ui/dropdown-menu.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu-item.vue'
import NotificationCenter from '@/features/notifications/components/NotificationCenter.vue'
import { useDark } from '@/composables/useDark'
import { useAuthStore } from '@/stores/authStore'

const emit = defineEmits<{ 'open-drawer': []; 'open-palette': [] }>()

const { isDark, toggleDark } = useDark()
const authStore = useAuthStore()
const router = useRouter()

function handleLogout(): void {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
    <button class="rounded-md p-2 hover:bg-accent md:hidden" aria-label="Open menu" @click="emit('open-drawer')">
      ☰
    </button>

    <button
      class="hidden flex-1 max-w-sm items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent sm:flex"
      @click="emit('open-palette')"
    >
      <span>🔍</span>
      <span class="flex-1">Search or jump to…</span>
      <kbd class="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
    </button>

    <div class="flex-1 sm:hidden" />

    <div class="ml-auto flex items-center gap-1.5">
      <Button variant="ghost" size="icon" aria-label="Toggle theme" @click="toggleDark()">
        <span>{{ isDark ? '🌙' : '☀️' }}</span>
      </Button>

      <NotificationCenter />

      <DropdownMenu align="end" content-class="w-48">
        <template #trigger>
          <button class="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {{ authStore.user?.avatarInitials ?? '??' }}
          </button>
        </template>
        <div class="px-2 py-1.5">
          <p class="truncate text-sm font-medium">{{ authStore.user?.name }}</p>
          <p class="truncate text-xs text-muted-foreground">{{ authStore.user?.email }}</p>
        </div>
        <div class="my-1 h-px bg-border" />
        <DropdownMenuItem @select="router.push('/settings')">⚙️ Settings</DropdownMenuItem>
        <DropdownMenuItem @select="handleLogout">🚪 Log out</DropdownMenuItem>
      </DropdownMenu>
    </div>
  </header>
</template>
