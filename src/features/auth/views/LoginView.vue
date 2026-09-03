<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/card.vue'
import Input from '@/components/ui/input.vue'
import Button from '@/components/ui/button.vue'
import { useAuthStore } from '@/stores/authStore'
import { loginSchema } from '@/lib/zodSchemas'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ email: 'admin@dashboard.dev', password: 'admin123' })
const errors = reactive<{ email?: string; password?: string }>({})
const submitError = ref('')
const isSubmitting = ref(false)

async function handleSubmit(): Promise<void> {
  errors.email = undefined
  errors.password = undefined
  submitError.value = ''

  const result = loginSchema.safeParse(form)
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as 'email' | 'password'
      errors[field] = issue.message
    }
    return
  }

  isSubmitting.value = true
  const response = await authStore.login(result.data)
  isSubmitting.value = false

  if (!response.success) {
    submitError.value = response.error ?? 'Unable to sign in.'
    return
  }

  router.push('/')
}

function fillDemo(role: 'admin' | 'viewer'): void {
  if (role === 'admin') {
    form.email = 'admin@dashboard.dev'
    form.password = 'admin123'
  } else {
    form.email = 'viewer@dashboard.dev'
    form.password = 'viewer123'
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-muted/30 px-4">
    <Card class="w-full max-w-sm">
      <div class="mb-5 text-center">
        <div class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-lg font-bold text-primary-foreground">
          D
        </div>
        <h1 class="text-lg font-semibold">Sign in to Dashboard</h1>
        <p class="text-sm text-muted-foreground">Mock authentication — no backend required.</p>
      </div>

      <form class="flex flex-col gap-3" @submit.prevent="handleSubmit">
        <label class="text-sm font-medium">
          Email
          <Input v-model="form.email" type="email" placeholder="you@example.com" class="mt-1" />
          <p v-if="errors.email" class="mt-1 text-xs text-destructive">{{ errors.email }}</p>
        </label>

        <label class="text-sm font-medium">
          Password
          <Input v-model="form.password" type="password" placeholder="••••••••" class="mt-1" />
          <p v-if="errors.password" class="mt-1 text-xs text-destructive">{{ errors.password }}</p>
        </label>

        <p v-if="submitError" class="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">{{ submitError }}</p>

        <Button type="submit" class="mt-1 w-full" :disabled="isSubmitting">
          {{ isSubmitting ? 'Signing in…' : 'Sign in' }}
        </Button>
      </form>

      <div class="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Demo accounts:</span>
        <button class="font-medium text-primary hover:underline" @click="fillDemo('admin')">admin</button>
        <span>/</span>
        <button class="font-medium text-primary hover:underline" @click="fillDemo('viewer')">viewer</button>
      </div>
    </Card>
  </div>
</template>
