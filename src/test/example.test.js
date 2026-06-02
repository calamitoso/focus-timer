// Example: unit test for a pure utility function.
// This pattern is the preferred test target in this repo:
// pure logic functions and state transformers, not rendering.

function calculateStreak(completedDates, today) {
  let streak = 0
  let current = new Date(today)

  while (true) {
    const dateStr = current.toISOString().split('T')[0]
    if (!completedDates.includes(dateStr)) break
    streak++
    current.setDate(current.getDate() - 1)
  }

  return streak
}

describe('calculateStreak', () => {
  it('returns 0 when no dates are completed', () => {
    expect(calculateStreak([], '2024-01-10')).toBe(0)
  })

  it('returns 1 when only today is completed', () => {
    expect(calculateStreak(['2024-01-10'], '2024-01-10')).toBe(1)
  })

  it('returns correct streak for consecutive days', () => {
    const dates = ['2024-01-08', '2024-01-09', '2024-01-10']
    expect(calculateStreak(dates, '2024-01-10')).toBe(3)
  })

  it('stops at a gap in the sequence', () => {
    const dates = ['2024-01-07', '2024-01-09', '2024-01-10']
    expect(calculateStreak(dates, '2024-01-10')).toBe(2)
  })
})
