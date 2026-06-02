import {
  DEFAULT_DURATION_MINUTES,
  DURATION_OPTIONS,
  formatTime,
  getProgressPercent,
  minutesToSeconds,
} from '../timerLogic.js'

describe('timerLogic', () => {
  describe('duration constants', () => {
    it('defines the approved duration presets and default', () => {
      expect(DURATION_OPTIONS).toEqual([10, 20, 30])
      expect(DEFAULT_DURATION_MINUTES).toBe(20)
    })
  })

  describe('minutesToSeconds', () => {
    it('converts minutes to seconds', () => {
      expect(minutesToSeconds(10)).toBe(600)
      expect(minutesToSeconds(20)).toBe(1200)
      expect(minutesToSeconds(30)).toBe(1800)
    })

    it('does not return negative seconds', () => {
      expect(minutesToSeconds(-5)).toBe(0)
    })
  })

  describe('formatTime', () => {
    it('formats seconds as MM:SS', () => {
      expect(formatTime(0)).toBe('00:00')
      expect(formatTime(59)).toBe('00:59')
      expect(formatTime(60)).toBe('01:00')
      expect(formatTime(1200)).toBe('20:00')
    })

    it('rounds down fractional seconds and clamps negative values', () => {
      expect(formatTime(61.9)).toBe('01:01')
      expect(formatTime(-3)).toBe('00:00')
    })
  })

  describe('getProgressPercent', () => {
    it('returns elapsed progress from remaining seconds', () => {
      expect(getProgressPercent(1200, 1200)).toBe(0)
      expect(getProgressPercent(1200, 900)).toBe(25)
      expect(getProgressPercent(1200, 600)).toBe(50)
      expect(getProgressPercent(1200, 0)).toBe(100)
    })

    it('clamps progress between 0 and 100', () => {
      expect(getProgressPercent(1200, 1500)).toBe(0)
      expect(getProgressPercent(1200, -30)).toBe(100)
    })

    it('treats zero or invalid total duration as complete', () => {
      expect(getProgressPercent(0, 0)).toBe(100)
      expect(getProgressPercent(-1, 0)).toBe(100)
    })
  })
})
