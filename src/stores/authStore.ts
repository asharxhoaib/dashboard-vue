import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { LoginCredentials, Role, User } from '@/types/auth'

const TOKEN_KEY = 'dashboard-vue.auth.token'
const USER_KEY = 'dashboard-vue.auth.user'

const MOCK_ACCOUNTS: Array<{ email: string; password: string; role: Role; name: string }> = [
  { email: 'admin@dashboard.dev', password: 'admin123', role: 'admin', name: 'Alex Rivera' },
  { email: 'viewer@dashboard.dev', password: 'viewer123', role: 'viewer', name: 'Jordan Lee' },
]

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function createFakeToken(email: string, role: Role): string {
  const payload = btoa(JSON.stringify({ email, role, iat: Date.now() }))
  return `mock.${payload}.signed`
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const rawUser = localStorage.getItem(USER_KEY)
  const user = ref<User | null>(rawUser ? (JSON.parse(rawUser) as User) : null)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const role = computed<Role | null>(() => user.value?.role ?? null)

  async function login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const account = MOCK_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === credentials.email.toLowerCase() && acc.password === credentials.password,
    )
    if (!account) {
      return { success: false, error: 'Invalid email or password.' }
    }

    const newUser: User = {
      id: account.email,
      name: account.name,
      email: account.email,
      role: account.role,
      avatarInitials: initials(account.name),
    }
    const newToken = createFakeToken(account.email, account.role)

    user.value = newUser
    token.value = newToken
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))

    return { success: true }
  }

  function logout(): void {
    user.value = null
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  function hasRole(allowed: Role[]): boolean {
    if (!role.value) return false
    return allowed.includes(role.value)
  }

  return { token, user, isAuthenticated, role, login, logout, hasRole }
})
