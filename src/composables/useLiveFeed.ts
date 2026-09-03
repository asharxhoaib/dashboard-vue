import { onScopeDispose, ref } from 'vue'
import type { LiveFeedEvent } from '@/types/dashboard'
import { generateLiveFeedEvent } from '@/lib/mockApi'

const MAX_EVENTS = 50

/**
 * Simulates a live SSE/polling stream of backend events using setInterval.
 * Feeds an in-memory ring buffer consumed by the activity feed and can
 * optionally notify the notification store for high-signal events.
 */
export function useLiveFeed(options: { intervalMs?: number; onEvent?: (event: LiveFeedEvent) => void } = {}) {
  const { intervalMs = 4000, onEvent } = options

  const events = ref<LiveFeedEvent[]>([])
  const isStreaming = ref(false)
  let timer: ReturnType<typeof setInterval> | null = null

  function pushEvent(event: LiveFeedEvent): void {
    events.value = [event, ...events.value].slice(0, MAX_EVENTS)
    onEvent?.(event)
  }

  function start(): void {
    if (timer) return
    isStreaming.value = true
    timer = setInterval(() => {
      pushEvent(generateLiveFeedEvent())
    }, intervalMs)
  }

  function stop(): void {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    isStreaming.value = false
  }

  function clear(): void {
    events.value = []
  }

  onScopeDispose(() => stop())

  return { events, isStreaming, start, stop, clear }
}
