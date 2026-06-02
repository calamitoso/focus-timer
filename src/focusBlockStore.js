export const COMPLETED_BLOCKS_STORAGE_KEY = 'focus-timer:completed-blocks-by-day'

function getBrowserStorage(storage) {
  return storage ?? window.localStorage
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function normalizeCompletedBlocks(completedBlocksByDay) {
  if (!isRecord(completedBlocksByDay)) return {}

  return Object.fromEntries(
    Object.entries(completedBlocksByDay)
      .map(([dayKey, count]) => [dayKey, Math.floor(Number(count))])
      .filter(([dayKey, count]) => dayKey && Number.isFinite(count) && count >= 0),
  )
}

export function loadCompletedBlocks(storage) {
  try {
    const storedValue = getBrowserStorage(storage).getItem(COMPLETED_BLOCKS_STORAGE_KEY)
    if (!storedValue) return {}

    return normalizeCompletedBlocks(JSON.parse(storedValue))
  } catch {
    return {}
  }
}

export function saveCompletedBlocks(completedBlocksByDay, storage) {
  const normalizedBlocks = normalizeCompletedBlocks(completedBlocksByDay)

  getBrowserStorage(storage).setItem(
    COMPLETED_BLOCKS_STORAGE_KEY,
    JSON.stringify(normalizedBlocks),
  )
}

export function getCompletedBlocksForDay(completedBlocksByDay, dayKey) {
  return normalizeCompletedBlocks(completedBlocksByDay)[dayKey] ?? 0
}

export function recordCompletedBlock(completedBlocksByDay, dayKey) {
  if (!dayKey) return normalizeCompletedBlocks(completedBlocksByDay)

  return {
    ...normalizeCompletedBlocks(completedBlocksByDay),
    [dayKey]: getCompletedBlocksForDay(completedBlocksByDay, dayKey) + 1,
  }
}
