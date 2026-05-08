export interface QuestionProgress {
  questionId: string
  seenCount: number
  correctCount: number
  wrongCount: number
  lastAnsweredAt?: string
  lastAnswerCorrect?: boolean
  isFavorite: boolean
  translationOpenedCount: number
  helpOpenedCount: number
}

export type ProgressMap = Record<string, QuestionProgress>

export interface ExamAttempt {
  id: string
  startedAt: string
  finishedAt: string
  totalQuestions: number
  correctCount: number
  passed: boolean
  state?: string
}

export type TrainingMode =
  | 'all'
  | 'new'
  | 'mistakes'
  | 'weak'
  | 'favorites'
  | 'exam'
