export type AnswerId = 'A' | 'B' | 'C' | 'D'

export type QuestionCategory = 'general' | 'state'

export type StateName = 'Berlin'

export interface Answer {
  id: AnswerId
  textDe: string
  textRu: string
}

export interface Keyword {
  de: string
  ru: string
  note?: string
}

export interface Question {
  id: string
  category: QuestionCategory
  state?: StateName
  questionDe: string
  questionRu: string
  answers: Answer[]
  correctAnswerId: AnswerId
  keywords: Keyword[]
  explanationRu: string
}

export interface QuestionsFile {
  questions: Question[]
}
