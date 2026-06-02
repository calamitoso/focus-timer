import { starterCards } from './data/sampleData.js'

// Demo mode: set VITE_APP_MODE=demo in .env.local to load pre-populated sample data.
// Use this to show a visually rich state during a presentation or design review.
// Replace DEMO_HABITS with problem-specific sample data before enabling.
const IS_DEMO_MODE = import.meta.env.VITE_APP_MODE === 'demo'
const DEMO_HABITS = []

function App() {
  return (
    <main className="app-shell">
      {/* Starting point — replace with problem-specific implementation */}
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">Frontend pairing starter</p>
        <h1 id="page-title">Build the smallest useful experience first.</h1>
        <p className="hero-copy">
          This starter is intentionally lightweight: React, plain JavaScript,
          semantic HTML, and CSS ready for fast iteration.
        </p>
      </section>

      <section className="card-grid" aria-label="Starter workflow">
        {starterCards.map((card) => (
          <article className="workflow-card" key={card.title}>
            <span className="card-step">{card.step}</span>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App
