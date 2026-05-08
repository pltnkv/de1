import type { Question } from '../types/question'
import importedData from './imported.json'
import { SEED_QUESTIONS } from './seed'

/**
 * Runtime question dataset. Prefers `imported.json` (produced by
 * `npm run import:questions`) when it contains questions; otherwise falls
 * back to the small hand-curated seed set in `./seed.ts`.
 */
const importedQuestions = (importedData as { questions?: Question[] })
  .questions

export const QUESTIONS: Question[] =
  importedQuestions && importedQuestions.length > 0
    ? importedQuestions
    : SEED_QUESTIONS

export { SEED_QUESTIONS }
