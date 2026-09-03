import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export interface CommandItem {
  id: string
  label: string
  description?: string
  group: 'Navigation' | 'Records'
  action: () => void
}

/**
 * Lightweight subsequence-based fuzzy matcher (no fuse.js dependency).
 * Returns a score where lower is better, or null when the query does not
 * match as a subsequence of the target string.
 */
export function fuzzyScore(query: string, target: string): number | null {
  if (!query) return 0
  const q = query.toLowerCase()
  const t = target.toLowerCase()

  let qi = 0
  let score = 0
  let lastMatchIndex = -1

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      const gap = lastMatchIndex === -1 ? 0 : ti - lastMatchIndex - 1
      score += gap
      lastMatchIndex = ti
      qi++
    }
  }

  if (qi < q.length) return null
  // Reward matches near the start of the string.
  score += t.indexOf(q[0]) * 0.1
  return score
}

export function fuzzyFilter<T>(query: string, items: T[], getText: (item: T) => string): T[] {
  if (!query.trim()) return items
  const scored = items
    .map((item) => ({ item, score: fuzzyScore(query, getText(item)) }))
    .filter((entry): entry is { item: T; score: number } => entry.score !== null)
  scored.sort((a, b) => a.score - b.score)
  return scored.map((entry) => entry.item)
}

interface NavRoute {
  path: string
  label: string
}

const NAV_ROUTES: NavRoute[] = [
  { path: '/', label: 'Dashboard Home' },
  { path: '/data', label: 'Data Table' },
  { path: '/reports', label: 'Reports' },
  { path: '/settings', label: 'Settings' },
]

export function useCommandPalette(options: { searchRecords?: () => { id: string; label: string; description: string }[] } = {}) {
  const router = useRouter()
  const isOpen = ref(false)
  const query = ref('')
  const activeIndex = ref(0)

  function open(): void {
    isOpen.value = true
    query.value = ''
    activeIndex.value = 0
  }

  function close(): void {
    isOpen.value = false
  }

  function toggle(): void {
    isOpen.value ? close() : open()
  }

  const navItems = computed<CommandItem[]>(() =>
    NAV_ROUTES.map((route) => ({
      id: `nav-${route.path}`,
      label: route.label,
      group: 'Navigation',
      action: () => {
        router.push(route.path)
        close()
      },
    })),
  )

  const recordItems = computed<CommandItem[]>(() => {
    const records = options.searchRecords?.() ?? []
    return records.map((record) => ({
      id: `record-${record.id}`,
      label: record.label,
      description: record.description,
      group: 'Records',
      action: () => close(),
    }))
  })

  const filteredItems = computed<CommandItem[]>(() => {
    const all = [...navItems.value, ...recordItems.value]
    return fuzzyFilter(query.value, all, (item) => `${item.label} ${item.description ?? ''}`)
  })

  function moveActive(direction: 1 | -1): void {
    if (filteredItems.value.length === 0) return
    const next = (activeIndex.value + direction + filteredItems.value.length) % filteredItems.value.length
    activeIndex.value = next
  }

  function runActive(): void {
    const item = filteredItems.value[activeIndex.value]
    item?.action()
  }

  function handleKeydown(event: KeyboardEvent): void {
    const isMeta = event.metaKey || event.ctrlKey
    if (isMeta && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      toggle()
      return
    }
    if (!isOpen.value) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveActive(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveActive(-1)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      runActive()
    } else if (event.key === 'Escape') {
      close()
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

  return { isOpen, query, activeIndex, filteredItems, open, close, toggle, moveActive, runActive }
}
