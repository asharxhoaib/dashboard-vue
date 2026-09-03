<script setup lang="ts">
import { reactive, ref } from 'vue'
import Card from '@/components/ui/card.vue'
import Input from '@/components/ui/input.vue'
import Button from '@/components/ui/button.vue'
import Switch from '@/components/ui/switch.vue'
import { useDark } from '@/composables/useDark'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { profileSchema } from '@/lib/zodSchemas'

const PROFILE_KEY = 'dashboard-vue.profile'

const { isDark, toggleDark } = useDark()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

function loadProfile() {
  const raw = localStorage.getItem(PROFILE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch {
      // fall through to defaults
    }
  }
  return {
    name: authStore.user?.name ?? '',
    email: authStore.user?.email ?? '',
    bio: '',
    company: '',
  }
}

const profileForm = reactive(loadProfile())
const profileErrors = reactive<Record<string, string>>({})
const saveState = ref<'idle' | 'saved'>('idle')

function saveProfile(): void {
  Object.keys(profileErrors).forEach((key) => delete profileErrors[key])
  const result = profileSchema.safeParse(profileForm)
  if (!result.success) {
    for (const issue of result.error.issues) {
      profileErrors[String(issue.path[0])] = issue.message
    }
    return
  }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(result.data))
  saveState.value = 'saved'
  setTimeout(() => (saveState.value = 'idle'), 2000)
}

function togglePref(key: 'emailAlerts' | 'pushAlerts' | 'weeklyDigest' | 'liveFeedAlerts', value: boolean): void {
  notificationStore.updatePreferences({ [key]: value })
}
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-col gap-6">
    <div>
      <h1 class="text-xl font-semibold tracking-tight">Settings</h1>
      <p class="text-sm text-muted-foreground">Manage your profile, appearance, and notification preferences.</p>
    </div>

    <Card>
      <h2 class="mb-3 text-sm font-semibold">Appearance</h2>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">Dark mode</p>
          <p class="text-xs text-muted-foreground">Toggle between light and dark themes.</p>
        </div>
        <Switch :model-value="isDark" @update:model-value="() => toggleDark()" />
      </div>
    </Card>

    <Card>
      <h2 class="mb-3 text-sm font-semibold">Profile</h2>
      <form class="flex flex-col gap-3" @submit.prevent="saveProfile">
        <label class="text-sm font-medium">
          Full name
          <Input v-model="profileForm.name" class="mt-1" />
          <p v-if="profileErrors.name" class="mt-1 text-xs text-destructive">{{ profileErrors.name }}</p>
        </label>
        <label class="text-sm font-medium">
          Email
          <Input v-model="profileForm.email" type="email" class="mt-1" />
          <p v-if="profileErrors.email" class="mt-1 text-xs text-destructive">{{ profileErrors.email }}</p>
        </label>
        <label class="text-sm font-medium">
          Company
          <Input v-model="profileForm.company" class="mt-1" />
          <p v-if="profileErrors.company" class="mt-1 text-xs text-destructive">{{ profileErrors.company }}</p>
        </label>
        <label class="text-sm font-medium">
          Bio
          <textarea
            v-model="profileForm.bio"
            rows="3"
            class="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <p v-if="profileErrors.bio" class="mt-1 text-xs text-destructive">{{ profileErrors.bio }}</p>
        </label>
        <div class="flex items-center gap-2">
          <Button type="submit">Save profile</Button>
          <span v-if="saveState === 'saved'" class="text-xs text-success">Saved to localStorage ✓</span>
        </div>
      </form>
    </Card>

    <Card>
      <h2 class="mb-3 text-sm font-semibold">Notification preferences</h2>
      <div class="flex flex-col divide-y divide-border">
        <div class="flex items-center justify-between py-2.5">
          <div>
            <p class="text-sm font-medium">Email alerts</p>
            <p class="text-xs text-muted-foreground">Receive important updates via email.</p>
          </div>
          <Switch
            :model-value="notificationStore.preferences.emailAlerts"
            @update:model-value="(v) => togglePref('emailAlerts', v)"
          />
        </div>
        <div class="flex items-center justify-between py-2.5">
          <div>
            <p class="text-sm font-medium">Push alerts</p>
            <p class="text-xs text-muted-foreground">Browser push notifications for critical events.</p>
          </div>
          <Switch
            :model-value="notificationStore.preferences.pushAlerts"
            @update:model-value="(v) => togglePref('pushAlerts', v)"
          />
        </div>
        <div class="flex items-center justify-between py-2.5">
          <div>
            <p class="text-sm font-medium">Weekly digest</p>
            <p class="text-xs text-muted-foreground">A weekly summary of key metrics.</p>
          </div>
          <Switch
            :model-value="notificationStore.preferences.weeklyDigest"
            @update:model-value="(v) => togglePref('weeklyDigest', v)"
          />
        </div>
        <div class="flex items-center justify-between py-2.5">
          <div>
            <p class="text-sm font-medium">Live feed alerts</p>
            <p class="text-xs text-muted-foreground">Create a notification for live activity alerts.</p>
          </div>
          <Switch
            :model-value="notificationStore.preferences.liveFeedAlerts"
            @update:model-value="(v) => togglePref('liveFeedAlerts', v)"
          />
        </div>
      </div>
    </Card>
  </div>
</template>
