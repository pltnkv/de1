import type { AnswerId } from '../types/question'

interface AnswerOptionProps {
  id: AnswerId
  textDe: string
  textRu?: string
  showTranslation: boolean
  selectedId: AnswerId | null
  correctId: AnswerId
  disabled: boolean
  onSelect: (id: AnswerId) => void
}

export function AnswerOption({
  id,
  textDe,
  textRu,
  showTranslation,
  selectedId,
  correctId,
  disabled,
  onSelect,
}: AnswerOptionProps) {
  const answered = selectedId !== null
  const isCorrect = id === correctId
  const isSelected = id === selectedId

  let state: 'neutral' | 'correct' | 'wrong' | 'selected' = 'neutral'
  if (answered) {
    if (isCorrect) state = 'correct'
    else if (isSelected) state = 'wrong'
  }

  let badge = ''
  if (state === 'correct') badge = '✓ Verdict: correct'
  if (state === 'wrong') badge = '✗ Verdict: wrong'

  return (
    <button
      type="button"
      className={`answer answer--${state}${isSelected ? ' answer--picked' : ''}`}
      onClick={() => onSelect(id)}
      disabled={disabled}
      aria-pressed={isSelected}
      aria-label={`Answer ${id}: ${textDe}${badge ? `. ${badge}` : ''}`}
    >
      <span className="answer__id" aria-hidden="true">{id}</span>
      <span className="answer__body">
        <span className="answer__de">{textDe}</span>
        {showTranslation && textRu && (
          <span className="answer__ru">{textRu}</span>
        )}
      </span>
      {state !== 'neutral' && (
        <span className={`answer__mark answer__mark--${state}`} aria-hidden="true">
          {state === 'correct' ? '✓' : '✗'}
        </span>
      )}
    </button>
  )
}
