export const FOCUS_DURATION_OPTIONS_MINUTES = Object.freeze([10, 20, 30])
export const DEFAULT_FOCUS_DURATION_MINUTES = 20
export const SECONDS_PER_MINUTE = 60
export const DEFAULT_TIMER_TICK_INTERVAL_MS = 1000
export const MIN_TIMER_TICK_INTERVAL_MS = 10
export const TIMER_TICK_INTERVAL_QUERY_PARAM = 'tickMs'

function normalizeTickIntervalMs(value) {
  const intervalMs = Number(value)

  if (!Number.isFinite(intervalMs)) return DEFAULT_TIMER_TICK_INTERVAL_MS

  return Math.max(MIN_TIMER_TICK_INTERVAL_MS, intervalMs)
}

export function getTimerTickIntervalMs({
  env = import.meta.env,
  search = typeof window === 'undefined' ? '' : window.location.search,
} = {}) {
  const queryIntervalMs = new URLSearchParams(search).get(TIMER_TICK_INTERVAL_QUERY_PARAM)

  return normalizeTickIntervalMs(
    queryIntervalMs ?? env?.VITE_TIMER_TICK_INTERVAL_MS ?? DEFAULT_TIMER_TICK_INTERVAL_MS,
  )
}
