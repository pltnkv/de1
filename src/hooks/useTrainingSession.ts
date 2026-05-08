import { useMemo, useState } from 'react'
import type { Question } from '../types/question'
import type { TrainingMode } from '../types/progress'
import { shuffle } from '../utils/shuffle'
import { selectQuestionsForMode } from '../utils/selectors'
import { getProgressMap } from '../utils/storage'

interface UseTrainingSessionOptions {
  questions: readonly Question[]
  mode: TrainingMode
  /** When true, freeze the pool to a fresh shuffle once and never re-evaluate. */
  freezePool?: boolean
}

export function useTrainingSession({
  questions,
  mode,
  freezePool = true,
}: UseTrainingSessionOptions) {
  const initialPool = useMemo(() => {
    const filtered = selectQuestionsForMode(questions, getProgressMap(), mode)
    return shuffle(filtered)
    // We intentionally only build the pool once per (questions, mode) pair.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, mode])

  const [pool] = useState<Question[]>(initialPool)
  const [index, setIndex] = useState(0)

  const current = pool[index]
  const total = pool.length
  const next = () => setIndex((i) => Math.min(i + 1, total))
  const isFinished = index >= total

  return { pool, current, index, total, next, isFinished, freezePool }
}
