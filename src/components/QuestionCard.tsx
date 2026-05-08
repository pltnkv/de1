import { useEffect, useMemo, useRef, useState } from 'react'
import type { AnswerId, Question } from '../types/question'
import { AnswerOption } from './AnswerOption'
import { useQuestionProgress } from '../hooks/useQuestionProgress'

interface QuestionCardProps {
  question: Question
  /** Whether to suppress translation/help/explanation (used by exam mode). */
  examMode?: boolean
  /** Called when the user answers. Receives whether the answer was correct. */
  onAnswered?: (isCorrect: boolean) => void
  /** Called when the user clicks "Next question". */
  onNext?: () => void
  /** Label for the next button (e.g. "Next question" or "Finish exam"). */
  nextLabel?: string
}

export function QuestionCard({
  question,
  examMode = false,
  onAnswered,
  onNext,
  nextLabel = 'Next question',
}: QuestionCardProps) {
  const { progress, update, toggleFavorite } = useQuestionProgress(question.id)

  const [selectedId, setSelectedId] = useState<AnswerId | null>(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const seenRecordedRef = useRef(false)
  const translationRecordedRef = useRef(false)
  const helpRecordedRef = useRef(false)

  // Reset per-question UI state and bump seenCount once per question display.
  useEffect(() => {
    setSelectedId(null)
    setShowTranslation(false)
    setShowHelp(false)
    seenRecordedRef.current = false
    translationRecordedRef.current = false
    helpRecordedRef.current = false

    if (!seenRecordedRef.current) {
      update((p) => ({ ...p, seenCount: p.seenCount + 1 }))
      seenRecordedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id])

  const isCorrect = useMemo(
    () => selectedId !== null && selectedId === question.correctAnswerId,
    [selectedId, question.correctAnswerId],
  )

  function handleSelect(id: AnswerId) {
    if (selectedId !== null) return
    setSelectedId(id)
    const correct = id === question.correctAnswerId
    update((p) => ({
      ...p,
      correctCount: p.correctCount + (correct ? 1 : 0),
      wrongCount: p.wrongCount + (correct ? 0 : 1),
      lastAnsweredAt: new Date().toISOString(),
      lastAnswerCorrect: correct,
    }))
    onAnswered?.(correct)
  }

  function handleShowTranslation() {
    setShowTranslation(true)
    if (!translationRecordedRef.current) {
      update((p) => ({
        ...p,
        translationOpenedCount: p.translationOpenedCount + 1,
      }))
      translationRecordedRef.current = true
    }
  }

  function handleShowHelp() {
    setShowHelp(true)
    if (!helpRecordedRef.current) {
      update((p) => ({ ...p, helpOpenedCount: p.helpOpenedCount + 1 }))
      helpRecordedRef.current = true
    }
  }

  const answered = selectedId !== null

  return (
    <article className="card question-card" aria-labelledby={`q-${question.id}`}>
      <header className="question-card__header">
        <h2 id={`q-${question.id}`} className="question-card__de">
          {question.questionDe}
        </h2>
        <button
          type="button"
          className={`favorite-btn${progress.isFavorite ? ' favorite-btn--on' : ''}`}
          onClick={toggleFavorite}
          aria-pressed={progress.isFavorite}
          aria-label={progress.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={progress.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {progress.isFavorite ? '★' : '☆'}
        </button>
      </header>

      {showTranslation && (
        <p className="question-card__ru">{question.questionRu}</p>
      )}

      <ol className="answers" role="radiogroup" aria-label="Answer options">
        {question.answers.map((a) => (
          <li key={a.id}>
            <AnswerOption
              id={a.id}
              textDe={a.textDe}
              textRu={a.textRu}
              showTranslation={showTranslation}
              selectedId={selectedId}
              correctId={question.correctAnswerId}
              disabled={answered}
              onSelect={handleSelect}
            />
          </li>
        ))}
      </ol>

      <div className="actions">
        {!showTranslation && !examMode && question.questionRu && (
          <button type="button" className="btn btn--secondary" onClick={handleShowTranslation}>
            Show translation
          </button>
        )}
        {!showHelp && !examMode && question.explanationRu && (
          <button type="button" className="btn btn--secondary" onClick={handleShowHelp}>
            Help
          </button>
        )}
      </div>

      {!examMode && question.keywords.length > 0 && (
        <section className="keywords" aria-label="Key words">
          <h3 className="section-title">Key words</h3>
          <ul className="keywords__list">
            {question.keywords.map((k, i) => (
              <li key={`${k.de}-${i}`} className="keyword">
                <span className="keyword__de">{k.de}</span>
                <span className="keyword__ru">— {k.ru}</span>
                {k.note && <span className="keyword__note"> ({k.note})</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {showHelp && !examMode && question.explanationRu && (
        <section className="explanation" aria-label="Explanation">
          <h3 className="section-title">Explanation</h3>
          <p>{question.explanationRu}</p>
        </section>
      )}

      {answered && (
        <section
          className={`feedback feedback--${isCorrect ? 'correct' : 'wrong'}`}
          role="status"
          aria-live="polite"
        >
          <p className="feedback__title">
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          {!examMode && question.explanationRu && (
            <p className="feedback__explanation">{question.explanationRu}</p>
          )}
          {onNext && (
            <button type="button" className="btn btn--primary" onClick={onNext}>
              {nextLabel}
            </button>
          )}
        </section>
      )}
    </article>
  )
}
