import type { Question } from '../types/question'
import type { ProgressMap, QuestionProgress, TrainingMode } from '../types/progress'
import { emptyProgressFor } from './storage'

function progressFor(map: ProgressMap, id: string): QuestionProgress {
  return map[id] ?? emptyProgressFor(id)
}

export function isNewQuestion(p: QuestionProgress): boolean {
  return p.seenCount === 0
}

export function hasMistake(p: QuestionProgress): boolean {
  return p.wrongCount > 0
}

export function isWeakQuestion(p: QuestionProgress): boolean {
  return p.wrongCount > p.correctCount
}

export function isFavorite(p: QuestionProgress): boolean {
  return p.isFavorite
}

export function selectQuestionsForMode(
  questions: readonly Question[],
  progressMap: ProgressMap,
  mode: TrainingMode,
): Question[] {
  if (mode === 'all') return questions.slice()
  return questions.filter((q) => {
    const p = progressFor(progressMap, q.id)
    switch (mode) {
      case 'new':
        return isNewQuestion(p)
      case 'mistakes':
        return hasMistake(p)
      case 'weak':
        return isWeakQuestion(p)
      case 'favorites':
        return isFavorite(p)
      default:
        return true
    }
  })
}

export interface OverallStats {
  total: number
  seen: number
  unseen: number
  correctRatePct: number
  totalMistakes: number
  weakCount: number
  favoriteCount: number
}

export function computeOverallStats(
  questions: readonly Question[],
  progressMap: ProgressMap,
): OverallStats {
  let seen = 0
  let totalCorrect = 0
  let totalWrong = 0
  let weakCount = 0
  let favoriteCount = 0
  for (const q of questions) {
    const p = progressFor(progressMap, q.id)
    if (p.seenCount > 0) seen += 1
    totalCorrect += p.correctCount
    totalWrong += p.wrongCount
    if (isWeakQuestion(p)) weakCount += 1
    if (isFavorite(p)) favoriteCount += 1
  }
  const totalAnswered = totalCorrect + totalWrong
  const correctRatePct =
    totalAnswered === 0 ? 0 : Math.round((totalCorrect / totalAnswered) * 100)
  return {
    total: questions.length,
    seen,
    unseen: questions.length - seen,
    correctRatePct,
    totalMistakes: totalWrong,
    weakCount,
    favoriteCount,
  }
}
