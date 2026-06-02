import {
  formatTime,
  getProgressPercent,
  minutesToSeconds,
} from '../timerLogic.js'
import {
  DEFAULT_FOCUS_DURATION_MINUTES,
  FOCUS_DURATION_OPTIONS_MINUTES,
  SECONDS_PER_MINUTE,
} from '../focusTimerConfig.js'

describe('timerLogic', () => {
  describe('duration constants', () => {
    it('uses configured duration presets and default', () => {
      expect(FOCUS_DURATION_OPTIONS_MINUTES).toHaveLength(3)
      expect(FOCUS_DURATION_OPTIONS_MINUTES).toContain(DEFAULT_FOCUS_DURATION_MINUTES)
    })
  })

  describe('minutesToSeconds', () => {
    it('converts minutes to seconds', () => {
      FOCUS_DURATION_OPTIONS_MINUTES.forEach((duration) => {
        expect(minutesToSeconds(duration)).toBe(duration * SECONDS_PER_MINUTE)
      })
    })

    it('does not return negative seconds', () => {
      expect(minutesToSeconds(-5)).toBe(0)
    })
  })

  describe('formatTime', () => {
    it('formats seconds as MM:SS', () => {
      expect(formatTime(0)).toBe('00:00')
      expect(formatTime(59)).toBe('00:59')
      expect(formatTime(SECONDS_PER_MINUTE)).toBe('01:00')
      expect(formatTime(minutesToSeconds(DEFAULT_FOCUS_DURATION_MINUTES))).toBe(
        `${String(DEFAULT_FOCUS_DURATION_MINUTES).padStart(2, '0')}:00`,
      )
    })

    it('rounds down fractional seconds and clamps negative values', () => {
      expect(formatTime(61.9)).toBe('01:01')
      expect(formatTime(-3)).toBe('00:00')
    })
  })

  describe('getProgressPercent', () => {
    it('returns elapsed progress from remaining seconds', () => {
      const totalSeconds = minutesToSeconds(DEFAULT_FOCUS_DURATION_MINUTES)

      expect(getProgressPercent(totalSeconds, totalSeconds)).toBe(0)
      expect(getProgressPercent(totalSeconds, totalSeconds * 0.75)).toBe(25)
      expect(getProgressPercent(totalSeconds, totalSeconds * 0.5)).toBe(50)
      expect(getProgressPercent(totalSeconds, 0)).toBe(100)
    })

    it('clamps progress between 0 and 100', () => {
      const totalSeconds = minutesToSeconds(DEFAULT_FOCUS_DURATION_MINUTES)

      expect(getProgressPercent(totalSeconds, totalSeconds + SECONDS_PER_MINUTE)).toBe(0)
      expect(getProgressPercent(totalSeconds, -SECONDS_PER_MINUTE)).toBe(100)
    })

    it('treats zero or invalid total duration as complete', () => {
      expect(getProgressPercent(0, 0)).toBe(100)
      expect(getProgressPercent(-1, 0)).toBe(100)
    })
  })
})
