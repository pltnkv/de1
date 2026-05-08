import type { ExamAttempt, ProgressMap, QuestionProgress } from '../types/progress'

const PROGRESS_KEY = 'dtt:progress:v1'
const EXAM_ATTEMPTS_KEY = 'dtt:examAttempts:v1'

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota / privacy mode errors
  }
}

export function emptyProgressFor(questionId: string): QuestionProgress {
  return {
    questionId,
    seenCount: 0,
    correctCount: 0,
    wrongCount: 0,
    isFavorite: false,
    translationOpenedCount: 0,
    helpOpenedCount: 0,
  }
}

export function getProgressMap(): ProgressMap {
  return safeRead<ProgressMap>(PROGRESS_KEY, {})
}

export function saveProgressMap(map: ProgressMap): void {
  safeWrite(PROGRESS_KEY, map)
}

export function getQuestionProgress(questionId: string): QuestionProgress {
  const map = getProgressMap()
  return map[questionId] ?? emptyProgressFor(questionId)
}

export function updateQuestionProgress(
  questionId: string,
  updateFn: (current: QuestionProgress) => QuestionProgress,
): QuestionProgress {
  const map = getProgressMap()
  const current = map[questionId] ?? emptyProgressFor(questionId)
  const next = updateFn(current)
  map[questionId] = next
  saveProgressMap(map)
  return next
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(PROGRESS_KEY)
    localStorage.removeItem(EXAM_ATTEMPTS_KEY)
  } catch {
    // ignore
  }
}

export function getExamAttempts(): ExamAttempt[] {
  return safeRead<ExamAttempt[]>(EXAM_ATTEMPTS_KEY, [])
}

export function saveExamAttempt(attempt: ExamAttempt): void {
  const all = getExamAttempts()
  all.push(attempt)
  safeWrite(EXAM_ATTEMPTS_KEY, all)
}
