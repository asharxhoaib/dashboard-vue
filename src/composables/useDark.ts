import { useDark as useVueUseDark, useToggle } from '@vueuse/core'

/**
 * Thin wrapper over VueUse's useDark, applying the `dark` class strategy
 * expected by tailwind.config.ts (darkMode: 'class') and persisting the
 * preference to localStorage automatically via VueUse.
 */
export function useDark() {
  const isDark = useVueUseDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
    storageKey: 'dashboard-vue.theme',
  })
  const toggleDark = useToggle(isDark)

  return { isDark, toggleDark }
}
