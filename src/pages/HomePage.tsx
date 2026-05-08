import { useMemo } from 'react'
import { ModeCard } from '../components/ModeCard'
import { QUESTIONS } from '../data/questions'

import {
  computeOverallStats,
  selectQuestionsForMode,
} from '../utils/selectors'
import { getProgressMap } from '../utils/storage'

export function HomePage() {
  const progressMap = useMemo(() => getProgressMap(), [])
  const stats = useMemo(
    () => computeOverallStats(QUESTIONS, progressMap),
    [progressMap],
  )

  const counts = useMemo(
    () => ({
      all: QUESTIONS.length,
      new: selectQuestionsForMode(QUESTIONS, progressMap, 'new').length,
      mistakes: selectQuestionsForMode(QUESTIONS, progressMap, 'mistakes')
        .length,
      weak: selectQuestionsForMode(QUESTIONS, progressMap, 'weak').length,
      favorites: selectQuestionsForMode(
        QUESTIONS,
        progressMap,
        'favorites',
      ).length,
    }),
    [progressMap],
  )

  return (
    <div className="page home">
      <header className="hero">
        <h1 className="hero__title">DeutschTest Trainer</h1>
        <p className="hero__subtitle">
          Practice Einbürgerungstest questions and learn German at the same time.
        </p>
      </header>

      <section className="home__quick">
        <span>
          <strong>{stats.seen}</strong> / {stats.total} seen ·{' '}
          <strong>{stats.correctRatePct}%</strong> correct
        </span>
      </section>

      <section className="modes" aria-label="Training modes">
        <ModeCard
          to="/train/all"
          title="All questions"
          subtitle="Practice every question in random order"
          count={counts.all}
          emoji="📚"
        />
        <ModeCard
          to="/train/new"
          title="New questions"
          subtitle="Questions you have not seen yet"
          count={counts.new}
          emoji="✨"
        />
        <ModeCard
          to="/train/mistakes"
          title="Mistakes"
          subtitle="Questions you answered wrong before"
          count={counts.mistakes}
          emoji="✗"
        />
        <ModeCard
          to="/train/weak"
          title="Weak questions"
          subtitle="More wrong answers than right ones"
          count={counts.weak}
          emoji="🎯"
        />
        <ModeCard
          to="/train/favorites"
          title="Favorites"
          subtitle="Questions you marked with a star"
          count={counts.favorites}
          emoji="★"
        />
        <ModeCard
          to="/exam"
          title="Exam simulation"
          subtitle="33 questions · 17 to pass · Berlin"
          emoji="📝"
          emphasis
        />
        <ModeCard
          to="/stats"
          title="Statistics"
          subtitle="See your progress in detail"
          emoji="📊"
        />
      </section>
    </div>
  )
}
