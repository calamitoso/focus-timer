# CSS Repertoire

Use this as a reminder of techniques that can add polish without heavy dependencies.

## Layout

- mobile-first layout
- CSS grid
- flexbox
- `minmax()`
- `clamp()`
- `min()`
- `max()`
- `calc()`
- `aspect-ratio`
- container queries when appropriate
- subgrid when support and context make sense

## Visual polish

- CSS custom properties
- layered gradients
- subtle shadows
- border highlights
- backdrop blur, used carefully
- responsive typography
- hover and focus states
- transform/opacity transitions
- scroll snap when useful

## Motion

Prefer small, purposeful motion.

Good defaults:

- animate `transform`
- animate `opacity`
- keep durations short
- support reduced motion

Example:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Accessibility

Remember:

- visible `:focus-visible`
- sufficient contrast
- no motion-only feedback
- do not remove outlines without replacing them
- buttons for actions
- links for navigation
