import { fireEvent, render, screen, within } from '@testing-library/react'
import { act } from 'react'
import App from '../App.jsx'
import { COMPLETED_BLOCKS_STORAGE_KEY } from '../focusBlockStore.js'

function createStorageMock(initialValues = {}) {
  const values = new Map(Object.entries(initialValues))

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  }
}

function renderApp({ storedBlocks = {}, search = '?tickMs=10' } = {}) {
  window.history.pushState({}, '', search)

  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: createStorageMock({
      [COMPLETED_BLOCKS_STORAGE_KEY]: JSON.stringify(storedBlocks),
    }),
  })

  return render(<App />)
}

function getDailyTotal() {
  return within(screen.getByRole('complementary', { name: 'Daily total' })).getByText(
    (content, element) => element?.tagName === 'STRONG' && /^\d+$/.test(content),
  )
}

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-02T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the default ready state', () => {
    renderApp()

    expect(screen.getByRole('heading', { name: 'Session timer' })).toBeInTheDocument()
    expect(screen.getByText('20:00')).toBeInTheDocument()
    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled()
    expect(screen.getByRole('button', { name: /20 minute focus duration/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByText('20 min selected')).toBeInTheDocument()
    expect(getDailyTotal()).toHaveTextContent('0')
  })

  it('allows preset selection before the timer starts', () => {
    renderApp()

    fireEvent.click(screen.getByRole('button', { name: /10 minute focus duration/i }))

    expect(screen.getByText('10:00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /10 minute focus duration/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByText('10 min selected')).toBeInTheDocument()
  })

  it('starts, pauses, resumes, and resets the timer', () => {
    renderApp()

    fireEvent.click(screen.getByRole('button', { name: /10 minute focus duration/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))

    expect(screen.getByText('Running')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(20)
    })

    expect(screen.getByText('09:58')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Pause' }))
    expect(screen.getByText('Paused')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Resume' }))
    expect(screen.getByText('Running')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(screen.getByText('10:00')).toBeInTheDocument()
    expect(getDailyTotal()).toHaveTextContent('0')
  })

  it('records a completed focus block exactly once', async () => {
    renderApp()

    fireEvent.click(screen.getByRole('button', { name: /10 minute focus duration/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(6000)
    })

    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText(/Focus block complete/)).toBeInTheDocument()
    expect(getDailyTotal()).toHaveTextContent('1')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    expect(getDailyTotal()).toHaveTextContent('1')
  })

  it('loads persisted totals on refresh', () => {
    renderApp({ storedBlocks: { '2026-06-02': 3 } })

    expect(getDailyTotal()).toHaveTextContent('3')
  })

  it('shows separate totals for selected days', () => {
    renderApp({
      storedBlocks: {
        '2026-06-02': 2,
        '2026-06-03': 5,
      },
    })

    expect(getDailyTotal()).toHaveTextContent('2')

    fireEvent.change(screen.getByLabelText('Current day for testing'), {
      target: { value: '2026-06-03' },
    })

    expect(screen.getByText('Ready')).toBeInTheDocument()
    expect(getDailyTotal()).toHaveTextContent('5')

    fireEvent.change(screen.getByLabelText('Current day for testing'), {
      target: { value: '2026-06-04' },
    })

    expect(getDailyTotal()).toHaveTextContent('0')
  })
})
