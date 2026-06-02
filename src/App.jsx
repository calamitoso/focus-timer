import { useEffect, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_FOCUS_DURATION_MINUTES,
  FOCUS_DURATION_OPTIONS_MINUTES,
  getTimerTickIntervalMs,
} from './focusTimerConfig.js'
import {
  getCompletedBlocksForDay,
  loadCompletedBlocks,
  recordCompletedBlock,
  saveCompletedBlocks,
} from './focusBlockStore.js'
import { formatTime, getProgressPercent, minutesToSeconds } from './timerLogic.js'

function getTodayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function App() {
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState(
    DEFAULT_FOCUS_DURATION_MINUTES,
  )
  const [remainingSeconds, setRemainingSeconds] = useState(
    minutesToSeconds(DEFAULT_FOCUS_DURATION_MINUTES),
  )
  const [timerStatus, setTimerStatus] = useState('ready')
  const [selectedDay, setSelectedDay] = useState(getTodayKey)
  const [completedBlocksByDay, setCompletedBlocksByDay] = useState(() =>
    loadCompletedBlocks(),
  )

  const timerTickIntervalMs = useMemo(() => getTimerTickIntervalMs(), [])
  const completionRecordedRef = useRef(false)
  const completedBlocksRef = useRef(completedBlocksByDay)

  const totalSeconds = useMemo(
    () => minutesToSeconds(selectedDurationMinutes),
    [selectedDurationMinutes],
  )
  const progressPercent = getProgressPercent(totalSeconds, remainingSeconds)
  const roundedProgressPercent = Math.round(progressPercent)
  const completedBlocksForSelectedDay = getCompletedBlocksForDay(
    completedBlocksByDay,
    selectedDay,
  )
  const isRunning = timerStatus === 'running'
  const isPaused = timerStatus === 'paused'
  const isCompleted = timerStatus === 'completed'
  const canReset = timerStatus !== 'ready' || remainingSeconds !== totalSeconds
  const statusLabel = {
    ready: 'Ready',
    running: 'Running',
    paused: 'Paused',
    completed: 'Completed',
  }[timerStatus]
  const primaryActionLabel = isPaused
    ? 'Resume'
    : isCompleted
      ? 'Start next focus block'
      : 'Start'

  useEffect(() => {
    completedBlocksRef.current = completedBlocksByDay
  }, [completedBlocksByDay])

  useEffect(() => {
    if (!isRunning) return undefined

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((currentRemainingSeconds) =>
        Math.max(0, currentRemainingSeconds - 1),
      )
    }, timerTickIntervalMs)

    return () => window.clearInterval(intervalId)
  }, [isRunning, timerTickIntervalMs])

  useEffect(() => {
    if (!isRunning || remainingSeconds > 0 || completionRecordedRef.current) {
      return
    }

    completionRecordedRef.current = true

    const updatedCompletedBlocks = recordCompletedBlock(
      completedBlocksRef.current,
      selectedDay,
    )

    saveCompletedBlocks(updatedCompletedBlocks)
    completedBlocksRef.current = updatedCompletedBlocks
    setCompletedBlocksByDay(updatedCompletedBlocks)
    setTimerStatus('completed')
  }, [isRunning, remainingSeconds, selectedDay])

  function handleDurationSelect(durationMinutes) {
    if (isRunning) return

    setSelectedDurationMinutes(durationMinutes)
    setRemainingSeconds(minutesToSeconds(durationMinutes))
    setTimerStatus('ready')
    completionRecordedRef.current = false
  }

  function handleStart() {
    completionRecordedRef.current = false

    if (isCompleted || remainingSeconds === 0) {
      setRemainingSeconds(totalSeconds)
    }

    setTimerStatus('running')
  }

  function handlePause() {
    setTimerStatus('paused')
  }

  function handleReset() {
    completionRecordedRef.current = false
    setRemainingSeconds(totalSeconds)
    setTimerStatus('ready')
  }

  function handleDayChange(event) {
    const nextDay = event.target.value || getTodayKey()

    setSelectedDay(nextDay)
    setRemainingSeconds(totalSeconds)
    setTimerStatus('ready')
    completionRecordedRef.current = false
  }

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">Focus timer</p>
        <h1 id="page-title">Focus Timer</h1>
        <p className="hero-copy">
          Set a work block, keep time visible, and count completed focus
          sessions for the day.
        </p>
      </section>

      <section className="timer-panel" aria-labelledby="timer-title">
        <header>
          <p className="eyebrow">Work block</p>
          <h2 id="timer-title">Session timer</h2>
        </header>

        <form aria-label="Focus timer settings">
          <fieldset disabled={isRunning}>
            <legend>Work duration</legend>
            {FOCUS_DURATION_OPTIONS_MINUTES.map((durationMinutes) => (
              <button
                aria-label={`${durationMinutes} minute focus duration`}
                aria-pressed={selectedDurationMinutes === durationMinutes}
                key={durationMinutes}
                onClick={() => handleDurationSelect(durationMinutes)}
                type="button"
            >
              {durationMinutes} min
              {selectedDurationMinutes === durationMinutes ? ' selected' : ''}
            </button>
          ))}
          </fieldset>
        </form>

        <section aria-labelledby="countdown-title" aria-live="polite">
          <h3 id="countdown-title">Time remaining</h3>
          <time
            aria-label={`${formatTime(remainingSeconds)} remaining`}
            dateTime={`PT${remainingSeconds}S`}
          >
            {formatTime(remainingSeconds)}
          </time>
          <p>
            Status: <strong>{statusLabel}</strong>
          </p>
          {isCompleted && (
            <p role="status">
              Focus block complete. The selected day total has been updated.
            </p>
          )}
        </section>

        <section aria-labelledby="progress-title">
          <h3 id="progress-title">Progress</h3>
          <progress max="100" value={roundedProgressPercent}>
            {roundedProgressPercent}%
          </progress>
          <p>{roundedProgressPercent}% elapsed</p>
        </section>

        <div aria-label="Timer controls" role="group">
          {!isRunning && (
            <button onClick={handleStart} type="button">
              {primaryActionLabel}
            </button>
          )}
          {isRunning && (
            <button onClick={handlePause} type="button">
              Pause
            </button>
          )}
          <button disabled={!canReset} onClick={handleReset} type="button">
            Reset
          </button>
        </div>

        <aside aria-labelledby="daily-total-title">
          <h3 id="daily-total-title">Daily total</h3>
          <p>
            Completed focus blocks for <time dateTime={selectedDay}>{selectedDay}</time>:{' '}
            <strong>{completedBlocksForSelectedDay}</strong>
          </p>
        </aside>

        <section aria-labelledby="testing-title">
          <h3 id="testing-title">Testing day</h3>
          <p id="testing-day-help">
            Change the selected day to verify that totals are tracked separately.
          </p>
          <label htmlFor="selected-day">Current day for testing</label>
          <input
            aria-describedby="testing-day-help"
            id="selected-day"
            onChange={handleDayChange}
            type="date"
            value={selectedDay}
          />
        </section>
      </section>
    </main>
  )
}

export default App
