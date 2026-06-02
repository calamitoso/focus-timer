export const DURATION_OPTIONS = [10, 20, 30]
export const DEFAULT_DURATION_MINUTES = 20

export function minutesToSeconds(minutes) {
  return Math.max(0, Math.floor(minutes * 60))
}

export function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function getProgressPercent(totalSeconds, remainingSeconds) {
  if (totalSeconds <= 0) return 100

  const elapsedSeconds = totalSeconds - remainingSeconds
  const progress = (elapsedSeconds / totalSeconds) * 100

  return Math.min(100, Math.max(0, progress))
}
