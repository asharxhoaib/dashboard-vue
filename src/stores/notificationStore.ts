import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AppNotification, NotificationPreferences } from '@/types/notification'
import { idbBulkPut, idbGetAll, idbPut } from '@/lib/idb'

const PREFS_KEY = 'dashboard-vue.notification-prefs'

const DEFAULT_PREFS: NotificationPreferences = {
  emailAlerts: true,
  pushAlerts: true,
  weeklyDigest: false,
  liveFeedAlerts: true,
}

function seedNotifications(): AppNotification[] {
  const now = Date.now()
  return [
    {
      id: 'seed-1',
      title: 'Welcome to the dashboard',
      message: 'Your workspace is ready. Explore the KPI overview and live feed.',
      level: 'info',
      read: false,
      createdAt: new Date(now - 1000 * 60 * 5).toISOString(),
    },
    {
      id: 'seed-2',
      title: 'Weekly report generated',
      message: 'Your weekly performance report is ready to download.',
      level: 'success',
      read: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: 'seed-3',
      title: 'Payment retry needed',
      message: '3 transactions require manual review before month end.',
      level: 'warning',
      read: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
    },
  ]
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<AppNotification[]>([])
  const preferences = ref<NotificationPreferences>(loadPreferences())
  const initialized = ref(false)

  function loadPreferences(): NotificationPreferences {
    try {
      const raw = localStorage.getItem(PREFS_KEY)
      if (!raw) return { ...DEFAULT_PREFS }
      return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<NotificationPreferences>) }
    } catch {
      return { ...DEFAULT_PREFS }
    }
  }

  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)
  const sortedNotifications = computed(() =>
    [...notifications.value].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  )

  async function initialize(): Promise<void> {
    if (initialized.value) return
    initialized.value = true
    const stored = await idbGetAll<AppNotification>()
    if (stored.length > 0) {
      notifications.value = stored
    } else {
      const seeded = seedNotifications()
      notifications.value = seeded
      await idbBulkPut(seeded)
    }
  }

  async function addNotification(notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): Promise<void> {
    const entry: AppNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      read: false,
      createdAt: new Date().toISOString(),
    }
    notifications.value.unshift(entry)
    await idbPut(entry)
  }

  async function markAsRead(id: string): Promise<void> {
    const target = notifications.value.find((n) => n.id === id)
    if (!target || target.read) return
    target.read = true
    await idbPut(target)
  }

  async function markAllAsRead(): Promise<void> {
    const unread = notifications.value.filter((n) => !n.read)
    unread.forEach((n) => {
      n.read = true
    })
    await idbBulkPut(unread)
  }

  function updatePreferences(partial: Partial<NotificationPreferences>): void {
    preferences.value = { ...preferences.value, ...partial }
    localStorage.setItem(PREFS_KEY, JSON.stringify(preferences.value))
  }

  return {
    notifications: sortedNotifications,
    preferences,
    unreadCount,
    initialize,
    addNotification,
    markAsRead,
    markAllAsRead,
    updatePreferences,
  }
})
