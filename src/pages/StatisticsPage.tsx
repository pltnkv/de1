import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProgressBar, StatCard } from '../components/ProgressSummary'
import { QUESTIONS } from '../data/questions'
import { computeOverallStats } from '../utils/selectors'
import { getExamAttempts, getProgressMap, resetProgress } from '../utils/storage'

export function StatisticsPage() {
  const [tick, setTick] = useState(0)
  const progressMap = useMemo(() => getProgressMap(), [tick])
  const stats = useMemo(
    () => computeOverallStats(QUESTIONS, progressMap),
    [progressMap],
  )
  const attempts = useMemo(() => getExamAttempts(), [tick])
  const bestExam = attempts.reduce(
    (best, a) => (a.correctCount > best ? a.correctCount : best),
    0,
  )
  const lastExam = attempts.length > 0 ? attempts[attempts.length - 1] : null

  function handleReset() {
    const confirmed = window.confirm(
      'Reset all progress? This will clear seen counts, mistakes, favorites and exam attempts. This cannot be undone.',
    )
    if (!confirmed) return
    resetProgress()
    setTick((t) => t + 1)
  }

  return (
    <div className="page">
      <header className="page__header">
        <Link to="/" className="link-back">← Home</Link>
        <h1 className="page__title">Statistics</h1>
      </header>

      <section className="card stats-section">
        <h2 className="section-title">Questions seen</h2>
        <ProgressBar value={stats.seen} max={stats.total} label="Seen questions" />
        <p className="stats-section__hint">
          {stats.seen} of {stats.total} ({stats.unseen} unseen)
        </p>
      </section>

      <section className="stat-grid">
        <StatCard label="Total questions" value={stats.total} />
        <StatCard label="Seen" value={stats.seen} />
        <StatCard label="Unseen" value={stats.unseen} />
        <StatCard
          label="Correct rate"
          value={`${stats.correctRatePct}%`}
          hint="Across all answers"
        />
        <StatCard label="Total mistakes" value={stats.totalMistakes} />
        <StatCard label="Weak questions" value={stats.weakCount} />
        <StatCard label="Favorites" value={stats.favoriteCount} />
        <StatCard label="Exam attempts" value={attempts.length} />
        <StatCard
          label="Best exam score"
          value={attempts.length === 0 ? '—' : bestExam}
        />
        <StatCard
          label="Last exam score"
          value={lastExam ? lastExam.correctCount : '—'}
          hint={lastExam ? (lastExam.passed ? 'passed' : 'not passed') : undefined}
        />
      </section>

      <section className="card stats-actions">
        <h2 className="section-title">Train weak spots</h2>
        <div className="actions">
          <Link to="/train/mistakes" className="btn btn--primary">
            Train mistakes
          </Link>
          <Link to="/train/new" className="btn btn--secondary">
            Train new questions
          </Link>
          <Link to="/train/weak" className="btn btn--secondary">
            Train weak questions
          </Link>
        </div>
      </section>

      <section className="card stats-actions stats-actions--danger">
        <h2 className="section-title">Danger zone</h2>
        <p>This permanently clears all your local progress and exam attempts.</p>
        <button type="button" className="btn btn--danger" onClick={handleReset}>
          Reset progress
        </button>
      </section>
    </div>
  )
}
