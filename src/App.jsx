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
  const [selectedDay] = useState(getTodayKey)
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
  const completedBlocksForSelectedDay = getCompletedBlocksForDay(
    completedBlocksByDay,
    selectedDay,
  )
  const isRunning = timerStatus === 'running'
  const isPaused = timerStatus === 'paused'
  const isCompleted = timerStatus === 'completed'
  const canReset = timerStatus !== 'ready' || remainingSeconds !== totalSeconds

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

      <section className="placeholder" aria-labelledby="timer-title">
        <h2 id="timer-title">Session timer</h2>

        <fieldset>
          <legend>Work duration</legend>
          {FOCUS_DURATION_OPTIONS_MINUTES.map((durationMinutes) => (
            <button
              aria-pressed={selectedDurationMinutes === durationMinutes}
              disabled={isRunning}
              key={durationMinutes}
              onClick={() => handleDurationSelect(durationMinutes)}
              type="button"
            >
              {durationMinutes} min
            </button>
          ))}
        </fieldset>

        <p aria-live="polite">
          <strong>{formatTime(remainingSeconds)}</strong>
        </p>
        <p>Status: {timerStatus}</p>
        <p>Progress: {Math.round(progressPercent)}%</p>

        <div>
          {!isRunning && (
            <button onClick={handleStart} type="button">
              {isPaused ? 'Resume' : 'Start'}
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

        <p>
          Completed focus blocks today:{' '}
          <strong>{completedBlocksForSelectedDay}</strong>
        </p>
      </section>
    </main>
  )
}

export default App
