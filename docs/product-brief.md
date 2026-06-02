# Product brief

## 1. Problem restatement

People need a simple way to start a focused work session, understand how much time remains at a glance, and get credit when the session is completed. The app should make time passing feel clear and motivating without adding planning overhead.

## 2. User goals

- Set a work duration before starting.
- Choose from 10, 20, or 30 minute work durations, with 20 minutes as the default.
- Start, pause, resume, and reset a focus session.
- See a clear visual indication of time passing during the session.
- Know when the session has ended.
- See that the completed session was counted as a focus block for today.
- See a running total of completed focus blocks for today.
- Check daily totals against a selectable current day for testing.

## 3. Clarifying questions

- What duration options should be supported?
  - Decision: The MVP supports 10, 20, and 30 minute durations. The default is 20 minutes. Custom duration input is post-MVP.
- Should partial sessions count toward the daily total?
  - Decision: No. Only sessions that reach the end count as completed focus blocks.
- Should the daily total persist after closing or refreshing the browser?
  - Decision: Yes. The daily total should persist in browser local storage to simulate longer-term storage. No account or server-backed history is in scope.
- What happens when a new day starts?
  - Decision: The new day starts at 0 completed focus blocks.
- How should the new-day behavior be tested?
  - Decision: The MVP includes a meta selector for the current day so the team can verify that totals are tracked per day.
- Does the timer need breaks, Pomodoro cycles, or long-term statistics?
  - Decision: No. This brief is limited to work sessions and today's completed total.
- Does the session end need an audible alert?
  - Assumption: A visible completion state is required. Audio is optional and should not be required for MVP success.

## 4. Assumptions

- The app runs entirely in the browser.
- The primary user is working alone and wants a lightweight focus aid, not a full productivity system.
- A completed focus block means one work session that reaches zero.
- The daily total is based on the user's local day.
- Today's focus block total is stored locally in the browser and does not sync across devices.
- The app includes a test-oriented way to select the current day.
- The MVP does not require login, sync, collaboration, notifications, analytics, or backend storage.
- The visual representation of time passing should be understandable without reading detailed instructions.

## 5. Success criteria

- The user can choose 10, 20, or 30 minutes before beginning a session.
- The app defaults to a 20 minute work duration.
- The user can start a session and see time counting down.
- The user can pause and resume an active session.
- The user can reset a session before completion without incrementing the daily total.
- The interface shows a clear visual representation of elapsed or remaining time.
- When the timer reaches the end, the session is marked complete.
- Each completed session increments today's focus block total by one.
- The app clearly shows today's running total of completed focus blocks.
- Today's focus block total remains available after refresh or reopening the browser.
- Changing to a different current day shows that day's total, starting at 0 when no sessions have been completed for that day.
- The app remains usable on both mobile and desktop screen sizes.

## 6. MVP scope

### Must-have

- Work-duration selection with 10, 20, and 30 minute options.
- 20 minutes selected by default.
- Countdown timer for a single focus session.
- Start, pause, resume, and reset controls.
- Clear visual progress/time-passing indicator.
- Completed-session state when the timer ends.
- Today's completed focus block total.
- Browser-local persistence for daily focus block totals.
- Meta selector for current day testing.
- Basic responsive usability.

### Nice-to-have within MVP only if time allows

- A lightweight completion acknowledgement.

## 7. Nice-to-have

- Custom duration entry.
- Sound or browser notification when the session ends.
- Short break timer.
- Streaks or historical totals.
- Session notes or labels.
- Keyboard shortcuts.
- Reduced-motion-friendly visual treatment.

## 8. Explicit deferrals

- User accounts.
- Backend services, databases, APIs, or server-side sync.
- Team or shared focus sessions.
- Calendar integrations.
- Full Pomodoro cycle management.
- Historical reporting beyond today's running total.
- Custom duration input.
- Production-grade notification handling.
- Complex settings screens.

## 9. Main tradeoffs

- We prioritize a clear, usable timer over a full productivity workflow.
- We keep scope centered on today's completed blocks, giving up richer history and analytics.
- We avoid backend features, which means totals are local rather than synced across devices.
- We favor a focused MVP over advanced personalization.
- We require only completed sessions to count, which keeps the total meaningful but does not reward partial effort.
