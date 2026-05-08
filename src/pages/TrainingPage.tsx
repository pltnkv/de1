import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { QuestionCard } from '../components/QuestionCard'
import { useTrainingSession } from '../hooks/useTrainingSession'
import { QUESTIONS } from '../data/questions'
import type { TrainingMode } from '../types/progress'

const MODE_LABELS: Record<TrainingMode, string> = {
  all: 'All questions',
  new: 'New questions',
  mistakes: 'Mistakes',
  weak: 'Weak questions',
  favorites: 'Favorites',
  exam: 'Exam simulation',
}

const EMPTY_STATES: Record<TrainingMode, string> = {
  all: 'There are no questions yet.',
  new: 'You have already seen all questions. Try training mistakes or weak questions instead.',
  mistakes:
    'You do not have any mistakes yet. Try all questions first.',
  weak: 'You do not have any weak questions yet — well done!',
  favorites:
    'No favorites yet. Tap the star on any question to add it here.',
  exam: 'No exam questions available.',
}

function isTrainingMode(value: string | undefined): value is TrainingMode {
  return (
    value === 'all' ||
    value === 'new' ||
    value === 'mistakes' ||
    value === 'weak' ||
    value === 'favorites'
  )
}

export function TrainingPage() {
  const { mode } = useParams<{ mode: string }>()
  const navigate = useNavigate()

  const validMode: TrainingMode = isTrainingMode(mode) ? mode : 'all'
  const { current, index, total, next, isFinished } = useTrainingSession({
    questions: QUESTIONS,
    mode: validMode,
  })

  const title = useMemo(() => MODE_LABELS[validMode], [validMode])

  if (total === 0) {
    return (
      <div className="page">
        <header className="page__header">
          <Link to="/" className="link-back" aria-label="Back to home">← Home</Link>
          <h1 className="page__title">{title}</h1>
        </header>
        <div className="empty-state card">
          <p>{EMPTY_STATES[validMode]}</p>
          <Link to="/" className="btn btn--primary">Back to home</Link>
        </div>
      </div>
    )
  }

  if (isFinished || !current) {
    return (
      <div className="page">
        <header className="page__header">
          <Link to="/" className="link-back" aria-label="Back to home">← Home</Link>
          <h1 className="page__title">{title}</h1>
        </header>
        <div className="card session-end">
          <h2>Session complete 🎉</h2>
          <p>You answered {total} questions in this session.</p>
          <div className="actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => navigate(0)}
            >
              Train again
            </button>
            <Link to="/" className="btn btn--secondary">Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page__header">
        <Link to="/" className="link-back" aria-label="Back to home">← Home</Link>
        <div className="page__header-info">
          <h1 className="page__title">{title}</h1>
          <p className="page__progress">
            Question {index + 1} / {total}
          </p>
        </div>
      </header>
      <QuestionCard
        key={current.id}
        question={current}
        onNext={next}
        nextLabel={index + 1 === total ? 'Finish session' : 'Next question'}
      />
    </div>
  )
}
