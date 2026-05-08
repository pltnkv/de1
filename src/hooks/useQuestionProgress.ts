import { useCallback, useEffect, useState } from 'react'
import type { QuestionProgress } from '../types/progress'
import {
  getQuestionProgress,
  updateQuestionProgress,
} from '../utils/storage'

/** Reads + updates progress for a single question, kept in sync with localStorage. */
export function useQuestionProgress(questionId: string) {
  const [progress, setProgress] = useState<QuestionProgress>(() =>
    getQuestionProgress(questionId),
  )

  useEffect(() => {
    setProgress(getQuestionProgress(questionId))
  }, [questionId])

  const update = useCallback(
    (fn: (p: QuestionProgress) => QuestionProgress) => {
      const next = updateQuestionProgress(questionId, fn)
      setProgress(next)
      return next
    },
    [questionId],
  )

  const toggleFavorite = useCallback(() => {
    update((p) => ({ ...p, isFavorite: !p.isFavorite }))
  }, [update])

  return { progress, update, toggleFavorite }
}
