# Solution design

## 1. Solution summary

Build a single-screen React focus timer that runs entirely in the browser. Keep timer UI and session state in `App.jsx`, centralize approved timer settings in a small configuration module, move calculation helpers into a pure utility module, and route completed-block persistence through a tiny client-side storage adapter so the app does not call the localStorage API directly. Use the existing Vite/Vitest setup, no new dependencies, and add focused unit/component coverage for the critical timer and storage flows.

## 2. Component and file plan

- `src/App.jsx`: Replace the starter content with the focus timer experience, including duration selection, timer controls, progress display, completion state, daily total, and current-day selector.
- `src/focusTimerConfig.js`: Create the single source for approved focus duration options, default duration, and shared time constants.
- `src/timerLogic.js`: Create pure helpers for minute conversion, time formatting, and progress calculation using values from `focusTimerConfig.js`.
- `src/focusBlockStore.js`: Create a small persistence adapter for completed focus block totals with `loadCompletedBlocks`, `saveCompletedBlocks`, `getCompletedBlocksForDay`, and `recordCompletedBlock`; MVP implementation uses localStorage internally.
- `src/styles.css`: Replace the starter styling with the approved responsive mechanical/instrument-panel visual system.
- `src/test/timerLogic.test.js`: Add focused unit tests for non-trivial timer and daily-total helpers.
- `src/test/focusBlockStore.test.js`: Add unit tests for storage loading, invalid storage fallback, day lookup, saving, and completed-block increments using a localStorage mock.
- `src/test/App.test.jsx`: Add focused component tests for default state, duration selection, start/pause/reset controls, completion counting, localStorage persistence, and selected-day totals.

## 3. State and data model

Use local state in `App.jsx`; no global store is needed.

```js
import {
  DEFAULT_FOCUS_DURATION_MINUTES,
  FOCUS_DURATION_OPTIONS_MINUTES,
} from './focusTimerConfig.js'

const [selectedDurationMinutes, setSelectedDurationMinutes] = useState(
  DEFAULT_FOCUS_DURATION_MINUTES,
)
const [remainingSeconds, setRemainingSeconds] = useState(
  minutesToSeconds(DEFAULT_FOCUS_DURATION_MINUTES),
)
const [timerStatus, setTimerStatus] = useState('ready')
const [selectedDay, setSelectedDay] = useState(getTodayKey())
const [completedBlocksByDay, setCompletedBlocksByDay] = useState({})
```

Configuration:

- `FOCUS_DURATION_OPTIONS_MINUTES`: approved duration presets.
- `DEFAULT_FOCUS_DURATION_MINUTES`: default selected duration.
- `SECONDS_PER_MINUTE`: shared conversion constant for timer math.
- `DEFAULT_TIMER_TICK_INTERVAL_MS`: real-time timer tick interval.
- `getTimerTickIntervalMs`: returns the active tick interval, allowing `?tickMs=16.67` for roughly 60x manual verification and `VITE_TIMER_TICK_INTERVAL_MS` for automated verification.

`timerStatus` values:

- `ready`: No active run; user can choose duration and start.
- `running`: Timer is counting down.
- `paused`: Timer is stopped with remaining time preserved.
- `completed`: Timer reached zero and the completed block has been counted.

Persisted data shape in localStorage:

```js
{
  "2026-06-02": 2,
  "2026-06-03": 0
}
```

Storage boundary:

```js
const focusBlockStore = {
  loadCompletedBlocks: () => ({ "2026-06-02": 2 }),
  saveCompletedBlocks: (completedBlocksByDay) => {},
  getCompletedBlocksForDay: (completedBlocksByDay, dayKey) => 0,
  recordCompletedBlock: (completedBlocksByDay, dayKey) => ({
    ...completedBlocksByDay,
    [dayKey]: 1,
  }),
}
```

`App.jsx` should treat this as a completed-block store, not as localStorage. Future persistence can replace the store internals without changing timer UI behavior. The MVP store remains synchronous because localStorage is synchronous and the current product does not require remote loading states.

Derived values:

- `durationOptions`: `FOCUS_DURATION_OPTIONS_MINUTES`.
- `totalSeconds`: `minutesToSeconds(selectedDurationMinutes)`.
- `elapsedSeconds`: `totalSeconds - remainingSeconds`.
- `progressPercent`: elapsed progress from 0 to 100.
- `displayTime`: formatted `MM:SS` countdown.
- `completedBlocksForSelectedDay`: count from `completedBlocksByDay[selectedDay] || 0`.
- `isRunning`, `isPaused`, `isCompleted`, `canReset`: boolean state helpers for rendering and control availability.

## 4. Key interactions and events

- Select duration: Updates the selected duration and resets remaining time to that duration when the timer is not running. Duration changes are not available during an active run.
- Start: Changes status from `ready` or `completed` to `running`. If starting after completion, the timer begins a fresh session using the selected duration.
- Pause: Changes status from `running` to `paused` and preserves the current remaining time.
- Resume: Changes status from `paused` to `running` without changing remaining time.
- Reset: Changes status to `ready`, restores remaining time to the selected duration, and does not increment the completed block total.
- Timer tick: While running, decrements remaining time until it reaches zero. The default tick is real time, but verification can speed this up with a config override without changing focus durations.
- Complete session: When remaining time reaches zero, changes status to `completed`, records the completed block through the storage adapter, and updates the selected day's completed block count exactly once.
- Change current day: Updates `selectedDay`, displays that day's stored total, and resets the visible timer to a ready state so the test selector does not create ambiguous in-progress sessions across days.
- Refresh or reopen: Loads completed block totals through the storage adapter and shows the selected day total, defaulting the selected day to the user's current local day.

## 5. Implementation sequence

1. Replace starter project identity and sample UI references so the app no longer presents itself as the pairing starter.
2. Add timer configuration, pure timer helpers, and unit tests for formatting and progress.
3. Add the focus block storage adapter and unit tests for localStorage loading, saving, invalid data fallback, day total lookup, and completed-block increments.
4. Build the core timer state in `App.jsx`: duration presets, countdown status, start/pause/resume/reset behavior, and one-time completion counting through the storage adapter.
5. Add the current-day selector used to validate per-day counts.
6. Replace starter markup with semantic, accessible timer UI that exposes duration choices, countdown, progress text, controls, completion state, daily total, and the testing day selector.
7. Add focused component tests for the core user flows: default ready state, preset selection, start/pause/resume/reset, completion increments exactly once, refresh persistence, and selected-day totals.
8. Replace starter CSS with the approved mechanical precision visual direction, including mobile-first layout, responsive desktop arrangement, clear focus states, selected states, disabled states, and reduced-motion handling.
9. Run validation: unit tests, component tests, lint/build if available, and manual checks across ready, running, paused, reset, completed, persistence, and selected-day scenarios.

## 6. Validation plan

- Default load shows 20 minutes selected, `20:00` remaining, a ready state, and today's completed block total.
- Unit tests cover timer configuration usage, tick interval overrides, time formatting, and progress calculation.
- Storage adapter tests cover localStorage read/write, day total lookup, invalid stored data fallback, and completed-block increment behavior.
- Component tests cover the main timer behavior through user-facing controls and text, using fake timers where needed for countdown completion.
- The user can choose 10, 20, or 30 minutes before starting, and the displayed time updates accordingly.
- Starting the timer begins the countdown and updates the visual progress representation.
- Pausing freezes the countdown; resuming continues from the same remaining time.
- Reset returns the timer to the selected duration and does not increment the daily total.
- Reaching zero visibly marks the session complete and increments the selected day's total exactly once.
- Refreshing the page preserves completed block totals from localStorage.
- `App.jsx` does not call localStorage directly; persistence access goes through the focus block storage adapter.
- Selecting a different current day shows that day's total; a day with no completed sessions shows 0.
- The UI works without horizontal scrolling on mobile and remains constrained and readable on desktop.
- Keyboard focus order is logical, focus states are visible, selected duration is not color-only, and controls have accessible names.
- Reduced-motion preference removes non-essential animation while preserving completion and progress information.

## 7. Tradeoffs and deferrals

- Keep all interaction in one main React surface instead of introducing a component hierarchy or state management library.
- Use localStorage behind a small adapter as the only MVP persistence mechanism; totals are local to the browser and do not sync across devices.
- Keep the storage adapter synchronous for MVP. A future remote store would likely require async loading, error states, and reconciliation decisions that are intentionally out of scope now.
- Count only completed sessions, with no partial credit or manual adjustment.
- Use preset durations only; custom duration input remains post-MVP.
- Skip breaks, Pomodoro cycles, long-term reports, notifications, audio, labels, settings, and historical analytics.
- Keep component tests focused on critical behavior instead of broad visual or styling assertions.
