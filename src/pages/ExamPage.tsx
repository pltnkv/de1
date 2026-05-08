import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { QuestionCard } from '../components/QuestionCard'
import { QUESTIONS } from '../data/questions'
import { shuffle } from '../utils/shuffle'
import { saveExamAttempt } from '../utils/storage'
import type { Question } from '../types/question'

const EXAM_TOTAL = 33
const GENERAL_COUNT = 30
const STATE_COUNT = 3
const PASS_THRESHOLD = 17
const DEFAULT_STATE = 'Berlin'

function buildExamPool(all: readonly Question[]): Question[] {
  const general = all.filter((q) => q.category === 'general')
  const state = all.filter(
    (q) => q.category === 'state' && q.state === DEFAULT_STATE,
  )
  // Take up to GENERAL_COUNT / STATE_COUNT depending on how many seed questions
  // we have; in MVP the seed dataset is smaller than 33.
  const generalPick = shuffle(general).slice(0, Math.min(GENERAL_COUNT, general.length))
  const statePick = shuffle(state).slice(0, Math.min(STATE_COUNT, state.length))
  return shuffle([...generalPick, ...statePick])
}

interface ExamResult {
  correctCount: number
  total: number
  passed: boolean
}

export function ExamPage() {
  const navigate = useNavigate()
  const startedAt = useMemo(() => new Date().toISOString(), [])
  const [pool] = useState<Question[]>(() => buildExamPool(QUESTIONS))
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [result, setResult] = useState<ExamResult | null>(null)

  const total = pool.length
  const current = pool[index]
  const isLast = index + 1 >= total

  function handleAnswered(isCorrect: boolean) {
    if (isCorrect) setCorrectCount((c) => c + 1)
  }

  function handleNext() {
    if (!isLast) {
      setIndex((i) => i + 1)
      return
    }
    // last question -> finish exam
    const finalCorrect = correctCount
    // Adjusted pass threshold for MVP: at least 17 of the official 33 questions
    // is the real rule, but our seed dataset has only 10 — so we fall back
    // proportionally so the result is meaningful in the MVP.
    const expectedTotal = total === EXAM_TOTAL ? EXAM_TOTAL : total
    const adjustedThreshold =
      total === EXAM_TOTAL
        ? PASS_THRESHOLD
        : Math.ceil((PASS_THRESHOLD / EXAM_TOTAL) * total)
    const passed = finalCorrect >= adjustedThreshold

    saveExamAttempt({
      id: `${Date.now()}`,
      startedAt,
      finishedAt: new Date().toISOString(),
      totalQuestions: expectedTotal,
      correctCount: finalCorrect,
      passed,
      state: DEFAULT_STATE,
    })
    setResult({ correctCount: finalCorrect, total, passed })
  }

  if (total === 0) {
    return (
      <div className="page">
        <header className="page__header">
          <Link to="/" className="link-back">← Home</Link>
          <h1 className="page__title">Exam simulation</h1>
        </header>
        <div className="card empty-state">
          <p>No exam questions available yet.</p>
          <Link to="/" className="btn btn--primary">Back to home</Link>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="page">
        <header className="page__header">
          <Link to="/" className="link-back">← Home</Link>
          <h1 className="page__title">Exam result</h1>
        </header>
        <div className={`card exam-result exam-result--${result.passed ? 'pass' : 'fail'}`}>
          <h2>{result.passed ? 'You passed! 🎉' : 'Not passed'}</h2>
          <p className="exam-result__score">
            {result.correctCount} / {result.total} correct
          </p>
          <p className="exam-result__hint">
            Real exam: 33 questions, 17 correct to pass. State: {DEFAULT_STATE}.
          </p>
          <div className="actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => navigate(0)}
            >
              Try again
            </button>
            <Link to="/stats" className="btn btn--secondary">See statistics</Link>
            <Link to="/" className="btn btn--secondary">Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page__header">
        <Link to="/" className="link-back">← Home</Link>
        <div className="page__header-info">
          <h1 className="page__title">Exam simulation</h1>
          <p className="page__progress">
            Question {index + 1} / {total}
          </p>
        </div>
      </header>
      <QuestionCard
        key={current.id}
        question={current}
        examMode
        onAnswered={handleAnswered}
        onNext={handleNext}
        nextLabel={isLast ? 'Finish exam' : 'Next question'}
      />
    </div>
  )
}
