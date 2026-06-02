import {
  DEFAULT_TIMER_TICK_INTERVAL_MS,
  MIN_TIMER_TICK_INTERVAL_MS,
  getTimerTickIntervalMs,
} from '../focusTimerConfig.js'

describe('focusTimerConfig', () => {
  describe('getTimerTickIntervalMs', () => {
    it('uses the default real-time interval when no override is provided', () => {
      expect(getTimerTickIntervalMs({ env: {}, search: '' })).toBe(
        DEFAULT_TIMER_TICK_INTERVAL_MS,
      )
    })

    it('uses a URL query override for manual verification', () => {
      expect(getTimerTickIntervalMs({ env: {}, search: '?tickMs=75' })).toBe(75)
    })

    it('allows sub-17ms intervals for roughly 60x manual verification', () => {
      expect(getTimerTickIntervalMs({ env: {}, search: '?tickMs=16.67' })).toBeCloseTo(
        16.67,
      )
    })

    it('uses an environment override for automated verification', () => {
      expect(
        getTimerTickIntervalMs({
          env: { VITE_TIMER_TICK_INTERVAL_MS: '80' },
          search: '',
        }),
      ).toBe(80)
    })

    it('lets the URL query override take priority over the environment value', () => {
      expect(
        getTimerTickIntervalMs({
          env: { VITE_TIMER_TICK_INTERVAL_MS: '80' },
          search: '?tickMs=60',
        }),
      ).toBe(60)
    })

    it('clamps tiny or invalid overrides to safe values', () => {
      expect(getTimerTickIntervalMs({ env: {}, search: '?tickMs=1' })).toBe(
        MIN_TIMER_TICK_INTERVAL_MS,
      )
      expect(getTimerTickIntervalMs({ env: {}, search: '?tickMs=fast' })).toBe(
        DEFAULT_TIMER_TICK_INTERVAL_MS,
      )
    })
  })
})
