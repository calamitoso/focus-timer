import {
  COMPLETED_BLOCKS_STORAGE_KEY,
  getCompletedBlocksForDay,
  loadCompletedBlocks,
  recordCompletedBlock,
  saveCompletedBlocks,
} from '../focusBlockStore.js'

function createStorageMock() {
  const values = new Map()

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  }
}

describe('focusBlockStore', () => {
  let storage

  beforeEach(() => {
    storage = createStorageMock()
  })

  describe('loadCompletedBlocks', () => {
    it('loads completed block totals from localStorage', () => {
      storage.setItem(
        COMPLETED_BLOCKS_STORAGE_KEY,
        JSON.stringify({ '2026-06-02': 2, '2026-06-03': 0 }),
      )

      expect(loadCompletedBlocks(storage)).toEqual({
        '2026-06-02': 2,
        '2026-06-03': 0,
      })
    })

    it('returns an empty record when storage is empty or invalid', () => {
      expect(loadCompletedBlocks(storage)).toEqual({})

      storage.setItem(COMPLETED_BLOCKS_STORAGE_KEY, '{not-json')
      expect(loadCompletedBlocks(storage)).toEqual({})

      storage.setItem(COMPLETED_BLOCKS_STORAGE_KEY, JSON.stringify(['not', 'a', 'record']))
      expect(loadCompletedBlocks(storage)).toEqual({})
    })

    it('normalizes invalid stored counts', () => {
      storage.setItem(
        COMPLETED_BLOCKS_STORAGE_KEY,
        JSON.stringify({
          '2026-06-02': '3',
          '2026-06-03': -1,
          '2026-06-04': 'done',
        }),
      )

      expect(loadCompletedBlocks(storage)).toEqual({ '2026-06-02': 3 })
    })
  })

  describe('saveCompletedBlocks', () => {
    it('saves normalized completed block totals to localStorage', () => {
      saveCompletedBlocks({
        '2026-06-02': 2,
        '2026-06-03': '1',
        '2026-06-04': -4,
      }, storage)

      expect(JSON.parse(storage.getItem(COMPLETED_BLOCKS_STORAGE_KEY))).toEqual({
        '2026-06-02': 2,
        '2026-06-03': 1,
      })
    })
  })

  describe('getCompletedBlocksForDay', () => {
    it('returns a day total or 0 when the day has not been tracked', () => {
      const completedBlocksByDay = { '2026-06-02': 2 }

      expect(getCompletedBlocksForDay(completedBlocksByDay, '2026-06-02')).toBe(2)
      expect(getCompletedBlocksForDay(completedBlocksByDay, '2026-06-03')).toBe(0)
    })
  })

  describe('recordCompletedBlock', () => {
    it('increments an existing day total', () => {
      expect(recordCompletedBlock({ '2026-06-02': 2 }, '2026-06-02')).toEqual({
        '2026-06-02': 3,
      })
    })

    it('starts a new day total at 1', () => {
      expect(recordCompletedBlock({}, '2026-06-02')).toEqual({
        '2026-06-02': 1,
      })
    })

    it('does not mutate the previous completed block totals', () => {
      const completedBlocksByDay = { '2026-06-02': 2 }
      const updatedBlocks = recordCompletedBlock(completedBlocksByDay, '2026-06-02')

      expect(completedBlocksByDay).toEqual({ '2026-06-02': 2 })
      expect(updatedBlocks).not.toBe(completedBlocksByDay)
    })
  })
})
