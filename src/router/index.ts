import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { Role } from '@/types/auth'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: Role[]
    public?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    name: 'dashboard-home',
    component: () => import('@/features/dashboard/views/DashboardHomeView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'viewer'] },
  },
  {
    path: '/data',
    name: 'data-table',
    component: () => import('@/features/datatable/views/DataTableView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'viewer'] },
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/features/reporting/views/ReportView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'viewer'] },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/features/settings/views/SettingsView.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/features/auth/views/ForbiddenView.vue'),
    meta: { public: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/features/auth/views/NotFoundView.vue'),
    meta: { public: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.public) {
    if (to.name === 'login' && authStore.isAuthenticated) {
      return { path: '/' }
    }
    return true
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.roles && !authStore.hasRole(to.meta.roles)) {
    return { path: '/403' }
  }

  return true
})

export default router
