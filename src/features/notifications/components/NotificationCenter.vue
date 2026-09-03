<script setup lang="ts">
import { computed } from 'vue'
import DropdownMenu from '@/components/ui/dropdown-menu.vue'
import Button from '@/components/ui/button.vue'
import Badge from '@/components/ui/badge.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import type { NotificationLevel } from '@/types/notification'

const store = useNotificationStore()

const levelDot: Record<NotificationLevel, string> = {
  info: 'bg-blue-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
}

const hasUnread = computed(() => store.unreadCount > 0)

function formatTime(iso: string): string {
  const date = new Date(iso)
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.round(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return date.toLocaleDateString()
}
</script>

<template>
  <DropdownMenu align="end" content-class="w-80 max-h-96 overflow-y-auto">
    <template #trigger>
      <Button variant="ghost" size="icon" class="relative" aria-label="Notifications">
        <span class="text-base">🔔</span>
        <span
          v-if="hasUnread"
          class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground"
        >
          {{ store.unreadCount > 9 ? '9+' : store.unreadCount }}
        </span>
      </Button>
    </template>

    <div class="flex items-center justify-between px-2 py-1.5">
      <p class="text-sm font-semibold">Notifications</p>
      <button
        class="text-xs font-medium text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
        :disabled="!hasUnread"
        @click="store.markAllAsRead"
      >
        Mark all read
      </button>
    </div>
    <div class="my-1 h-px bg-border" />

    <div v-if="store.notifications.length === 0" class="px-2 py-6 text-center text-xs text-muted-foreground">
      You're all caught up.
    </div>

    <div
      v-for="notification in store.notifications"
      :key="notification.id"
      class="flex cursor-pointer gap-2 rounded-sm px-2 py-2 text-left hover:bg-accent"
      @click="store.markAsRead(notification.id)"
    >
      <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full" :class="notification.read ? 'bg-transparent' : levelDot[notification.level]" />
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-2">
          <p class="truncate text-sm font-medium" :class="notification.read ? 'text-muted-foreground' : 'text-foreground'">
            {{ notification.title }}
          </p>
          <Badge v-if="!notification.read" variant="secondary" class="shrink-0 text-[10px]">New</Badge>
        </div>
        <p class="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{{ notification.message }}</p>
        <p class="mt-0.5 text-[10px] text-muted-foreground">{{ formatTime(notification.createdAt) }}</p>
      </div>
    </div>
  </DropdownMenu>
</template>
