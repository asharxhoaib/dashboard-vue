export type NotificationLevel = 'info' | 'success' | 'warning' | 'error'

export interface AppNotification {
  id: string
  title: string
  message: string
  level: NotificationLevel
  read: boolean
  createdAt: string
}

export interface NotificationPreferences {
  emailAlerts: boolean
  pushAlerts: boolean
  weeklyDigest: boolean
  liveFeedAlerts: boolean
}
