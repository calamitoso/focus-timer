# Design brief

## 1. Aesthetic direction

Mechanical precision and discipline should feel like a well-calibrated instrument panel, not a themed machine interface. The app should make time feel measurable, intentional, and under control through crisp alignment, restrained contrast, and clear state changes. The tone is focused and steady: no playful clutter, no motivational excess, just a timer that feels reliable.

## 2. Visual language

- Typography: Use a clean sans-serif with a technical character. Numerals should feel stable and easy to scan, especially in the main countdown. Use a strong weight for the timer, medium weight for controls and totals, and lighter supporting text for context.
- Color: Use a neutral, high-contrast base with cool industrial tones. Suggested roles: off-white or pale steel for the surface, charcoal for primary text, muted graphite for secondary text, deep blue or green for active progress, and a precise amber accent for completion or attention. Avoid an all-blue or all-gray look by reserving accent color for meaningful states.
- Space: Keep spacing orderly and grid-like. The timer should have breathing room, while controls and totals should sit in compact, predictable groups. Avoid oversized marketing-style composition.
- Shape: Prefer straight edges, thin borders, and modest radii. Controls may have slight rounding for touch comfort, but the overall language should stay crisp and engineered.
- Graphic character: The visual progress indicator should feel calibrated, with marks, divisions, or a sweep that suggests measured passage of time. The daily total should feel like a concise counter or log entry, not a decorative badge.

## 3. Interaction model

The user should arrive at a ready state with the 20 minute duration selected and the daily total visible. Choosing a duration should feel immediate and low-friction, like setting a dial before starting work. Starting the timer shifts emphasis to the countdown and progress indicator, while secondary controls remain available without competing for attention.

Pausing should clearly freeze the session and make resume the primary action. Resetting should feel deliberate enough to prevent accidental loss, but not heavy or modal. Completion should be unmistakable: the user should see that the session ended, the block was counted, and the app is ready for the next focus block.

The current-day selector is a meta/testing control and should feel visually subordinate to the core timer experience. It must remain discoverable and usable, but it should not be presented as a primary productivity feature.

## 4. Motion personality

Motion should be precise, short, and mechanical. Progress updates can feel like a smooth calibrated sweep or measured step-down, but transitions should never feel bouncy or whimsical. Button and duration changes should respond quickly with subtle state shifts.

The completion moment deserves a slightly stronger treatment: a crisp visual lock-in, pulse, or status change that confirms the completed block. Reduced-motion users should receive the same information through static state changes, color, text, and layout emphasis.

## 5. Key states to design for

- Ready: 20 minutes selected by default, timer waiting, daily total visible. The layout should feel calm and prepared.
- Duration selected: The selected preset is visually clear, with enough contrast and non-color indication to distinguish it.
- Running: Countdown and progress dominate. Start is replaced by pause, and reset is available as a secondary action.
- Paused: The interface communicates that time is stopped. Resume becomes the primary action.
- Reset available: Reset should be reachable but visually secondary to avoid accidental use.
- Completed: The timer reaches zero, the completion state is clear, and today's completed focus block total visibly increments.
- New day selected: The total reflects the selected day, including 0 for a day with no completed blocks.
- Disabled or unavailable controls: Controls that cannot currently be used should look inactive and remain understandable to assistive technology.
- Persistence confirmation: After refresh or return, the daily total should simply appear correct; no extra success message is needed.

## 6. Accessibility direction

- Meet WCAG 2.1 AA contrast for all text, controls, progress labels, and selected states.
- Do not rely on color alone for selected duration, running state, pause state, completion, or disabled controls.
- The main countdown should be readable at a glance and exposed with meaningful text for assistive technology.
- Controls need clear accessible names, visible focus states, and predictable keyboard order.
- Duration presets should behave as a single choice set, with the selected option obvious visually and semantically.
- Progress should have a text equivalent so users are not required to interpret graphics.
- Motion must respect reduced-motion preferences. Any animated progress or completion treatment should have a static equivalent.
- Touch targets should be comfortably sized on mobile.
- The testing day selector must be labelled clearly enough that it does not confuse users about the actual local day behavior.

## 7. Responsive approach

Mobile should use a single-column instrument layout: duration presets near the top, the timer and progress indicator as the central focus, controls directly below, then today's total and the testing day selector. The design should fit comfortably on small screens without requiring horizontal scrolling or dense controls.

Tablet and desktop can use a wider, more balanced layout with the timer/progress area as the dominant region and totals/meta controls placed in a secondary region. The hierarchy should still read top-to-bottom, with the main work session controls never separated far from the timer.

Key responsive shifts:

- Small screens: single column, large timer, stacked control groups, generous touch targets.
- Medium screens: allow timer and daily total to share more horizontal space if it improves scanning.
- Large screens: keep content width constrained so the timer does not sprawl; use alignment, not oversized panels, to create polish.
