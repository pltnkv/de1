/**
 * Import pipeline scaffold for the official BAMF question catalog.
 *
 * The pipeline is split into small, replaceable steps:
 *   1. Parser     — converts a raw input (PDF text, CSV, official JSON) into
 *                   loosely-shaped `RawQuestion` records.
 *   2. Normalizer — turns each raw record into a strict `Question`.
 *   3. Validator  — checks the resulting list and reports issues.
 *   4. Writer     — writes a JSON file to `src/data/imported.json` (or any
 *                   target path), ready to be loaded by the app.
 *
 * Today this script only validates and re-emits the existing seed dataset, so
 * you can run `npm run import:questions` to confirm the pipeline works.
 *
 * To add real BAMF questions later:
 *   1. Drop a JSON / CSV / extracted-text file into `data-raw/` (gitignored).
 *   2. Implement a parser for that format (see `parseFromBamfJson` below).
 *   3. Run `npm run import:questions -- --in data-raw/yourfile.json`.
 *   4. Inspect the validator output and tweak the parser/normalizer.
 *   5. Replace `SEED_QUESTIONS` import in the app with the produced JSON.
 *
 * IMPORTANT: do not scrape BAMF or any other site at runtime. The official
 * PDF must be downloaded manually:
 *   https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/Einbuergerung/gesamtfragenkatalog-lebenindeutschland.pdf
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { SEED_QUESTIONS } from '../src/data/questions'
import type {
  AnswerId,
  Question,
  QuestionsFile,
  StateName,
} from '../src/types/question'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Loosely-typed shape used during parsing. */
export interface RawQuestion {
  id?: string | number
  category?: string
  state?: string
  questionDe?: string
  questionRu?: string
  answers?: Array<{
    id?: string
    textDe?: string
    textRu?: string
  }>
  correctAnswerId?: string
  keywords?: Array<{ de?: string; ru?: string; note?: string }>
  explanationRu?: string
}

export interface Parser {
  name: string
  /** Returns the raw, untrusted records. Implementations may throw on parse errors. */
  parse(input: string): RawQuestion[]
}

export interface ValidationIssue {
  questionId: string
  severity: 'error' | 'warning'
  message: string
}

// ---------------------------------------------------------------------------
// Parsers
// ---------------------------------------------------------------------------

/**
 * Reads the JSON shape we want to support long-term.
 *
 * Expected shape (see README "Future-ready import pipeline" section):
 *   { "questions": [ { "id": "1", "category": "general", ... } ] }
 */
export const parseFromBamfJson: Parser = {
  name: 'bamf-json',
  parse(input: string): RawQuestion[] {
    const data = JSON.parse(input) as unknown
    if (!data || typeof data !== 'object' || !('questions' in data)) {
      throw new Error('Expected an object with a "questions" array')
    }
    const list = (data as { questions: unknown }).questions
    if (!Array.isArray(list)) throw new Error('"questions" must be an array')
    return list as RawQuestion[]
  },
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

const VALID_ANSWER_IDS: AnswerId[] = ['A', 'B', 'C', 'D']

function asAnswerId(value: unknown): AnswerId | null {
  return typeof value === 'string' && (VALID_ANSWER_IDS as string[]).includes(value)
    ? (value as AnswerId)
    : null
}

/** Converts a `RawQuestion` to a strict `Question`, returning null if too broken. */
export function normalize(raw: RawQuestion): Question | null {
  const id = raw.id !== undefined ? String(raw.id) : ''
  if (!id) return null

  const category =
    raw.category === 'state' ? 'state' : raw.category === 'general' ? 'general' : 'general'
  const state = raw.state === 'Berlin' ? 'Berlin' : undefined

  const answers = (raw.answers ?? [])
    .map((a) => {
      const aid = asAnswerId(a.id)
      if (!aid) return null
      return {
        id: aid,
        textDe: (a.textDe ?? '').trim(),
        textRu: (a.textRu ?? '').trim(),
      }
    })
    .filter((a): a is { id: AnswerId; textDe: string; textRu: string } => a !== null)

  const correctAnswerId = asAnswerId(raw.correctAnswerId)
  if (!correctAnswerId) return null

  return {
    id,
    category,
    state,
    questionDe: (raw.questionDe ?? '').trim(),
    questionRu: (raw.questionRu ?? '').trim(),
    answers,
    correctAnswerId,
    keywords: (raw.keywords ?? [])
      .filter((k) => k && (k.de || k.ru))
      .map((k) => ({
        de: (k.de ?? '').trim(),
        ru: (k.ru ?? '').trim(),
        note: k.note?.trim(),
      })),
    explanationRu: (raw.explanationRu ?? '').trim(),
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export function validate(questions: Question[]): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const seenIds = new Set<string>()

  for (const q of questions) {
    if (seenIds.has(q.id)) {
      issues.push({
        questionId: q.id,
        severity: 'error',
        message: `Duplicate question id "${q.id}"`,
      })
    }
    seenIds.add(q.id)

    if (!q.questionDe) {
      issues.push({
        questionId: q.id,
        severity: 'error',
        message: 'Missing German question text',
      })
    }
    if (!q.questionRu) {
      issues.push({
        questionId: q.id,
        severity: 'warning',
        message: 'Missing Russian translation of the question',
      })
    }
    if (q.answers.length !== 4) {
      issues.push({
        questionId: q.id,
        severity: 'error',
        message: `Expected 4 answers, got ${q.answers.length}`,
      })
    }
    const ids = q.answers.map((a) => a.id).sort().join('')
    if (ids !== 'ABCD') {
      issues.push({
        questionId: q.id,
        severity: 'error',
        message: `Answer ids must be A,B,C,D — got ${ids}`,
      })
    }
    if (!q.answers.some((a) => a.id === q.correctAnswerId)) {
      issues.push({
        questionId: q.id,
        severity: 'error',
        message: `correctAnswerId ${q.correctAnswerId} not found among answers`,
      })
    }
    if (q.category === 'state' && !q.state) {
      issues.push({
        questionId: q.id,
        severity: 'error',
        message: 'State question is missing the state field',
      })
    }
    if (!q.explanationRu) {
      issues.push({
        questionId: q.id,
        severity: 'warning',
        message: 'Missing Russian explanation',
      })
    }
  }

  return issues
}

// ---------------------------------------------------------------------------
// leben-in-deutschland-app source
// ---------------------------------------------------------------------------
//
// The community repo `leben-in-deutschland/leben-in-deutschland-app` (MIT)
// publishes the official BAMF questions plus an answer key, German answer
// text, and Russian translations + explanations for every question. We use
// it as the import source because the BAMF "Gesamtfragenkatalog" PDF itself
// does not contain the correct answers — it's the question catalog only.
//
// Three files feed into one merged dataset:
//   - questions-core.json        German question + 4 answers + solution + num
//   - translations/ru.json       Russian question + 4 answer translations, keyed by num
//   - context/ru.json            Russian explanation, keyed by num
//
// `num` is "1".."300" for general questions and "<STATE>-1".."<STATE>-10" for
// state questions (e.g. BE-1 .. BE-10 for Berlin).

interface LebenCoreEntry {
  num: string
  question: string
  a: string
  b: string
  c: string
  d: string
  solution: 'a' | 'b' | 'c' | 'd'
  image?: string
  category?: string
}

interface LebenTranslationEntry {
  question: string
  a: string
  b: string
  c: string
  d: string
}

interface MergeOptions {
  /** Two-letter Bundesland codes to include, e.g. ["BE"]. Empty = exclude all state questions. */
  includeStateCodes: string[]
  /** Map from state code to display name written into Question.state. */
  stateNames: Record<string, StateName>
  /** Skip questions whose answer text is image-only (e.g. just "1", "2", ...). */
  skipImageQuestions: boolean
}

function isGeneralNum(num: string): boolean {
  return /^\d+$/.test(num)
}

function parseStateNum(num: string): { code: string; index: number } | null {
  const m = /^([A-Z]{2})-(\d+)$/.exec(num)
  if (!m) return null
  return { code: m[1], index: Number(m[2]) }
}

function mergeFromLebenInDeutschland(
  core: LebenCoreEntry[],
  translations: Record<string, LebenTranslationEntry>,
  context: Record<string, string>,
  opts: MergeOptions,
): RawQuestion[] {
  const out: RawQuestion[] = []
  for (const entry of core) {
    const isGeneral = isGeneralNum(entry.num)
    const stateInfo = parseStateNum(entry.num)

    let category: 'general' | 'state' | null = null
    let stateName: StateName | undefined
    if (isGeneral) {
      category = 'general'
    } else if (stateInfo) {
      if (!opts.includeStateCodes.includes(stateInfo.code)) continue
      const name = opts.stateNames[stateInfo.code]
      if (!name) continue
      category = 'state'
      stateName = name
    } else {
      continue
    }

    if (
      opts.skipImageQuestions &&
      entry.image &&
      entry.image !== '-' &&
      entry.image.trim() !== ''
    ) {
      // Image-based questions reference external images we don't host; the
      // answer text alone ("1" / "2" / "3" / "4") is meaningless without them.
      continue
    }

    const tr = translations[entry.num]
    const ctx = context[entry.num]
    const solution = entry.solution.toUpperCase() as AnswerId

    out.push({
      id: entry.num,
      category,
      state: stateName,
      questionDe: entry.question,
      questionRu: tr?.question ?? '',
      answers: (['a', 'b', 'c', 'd'] as const).map((letter) => ({
        id: letter.toUpperCase(),
        textDe: entry[letter],
        textRu: tr?.[letter] ?? '',
      })),
      correctAnswerId: solution,
      keywords: [],
      explanationRu: ctx ?? '',
    })
  }
  return out
}

// ---------------------------------------------------------------------------
// Writer
// ---------------------------------------------------------------------------

export function writeQuestionsJson(questions: Question[], outPath: string): void {
  const payload: QuestionsFile = { questions }
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8')
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

interface CliArgs {
  inPath: string | null
  outPath: string
  /** When set, run the three-file leben-in-deutschland merge from this directory. */
  lebenDir: string | null
  /** Bundesland codes to include in state questions, comma-separated. Default: BE. */
  states: string[]
}

function parseArgs(argv: string[]): CliArgs {
  let inPath: string | null = null
  let outPath = 'src/data/imported.json'
  let lebenDir: string | null = null
  let states: string[] = ['BE']
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--in') inPath = argv[++i] ?? null
    else if (arg === '--out') outPath = argv[++i] ?? outPath
    else if (arg === '--leben') lebenDir = argv[++i] ?? null
    else if (arg === '--states') {
      const next = argv[++i] ?? ''
      states = next
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
    }
  }
  return { inPath, outPath, lebenDir, states }
}

function loadJson<T>(path: string): T {
  const abs = resolve(path)
  if (!existsSync(abs)) {
    console.error(`File not found: ${abs}`)
    process.exit(1)
  }
  return JSON.parse(readFileSync(abs, 'utf8')) as T
}

const STATE_NAME_LOOKUP: Record<string, StateName> = {
  BE: 'Berlin',
}

function run(): void {
  const { inPath, outPath, lebenDir, states } = parseArgs(process.argv.slice(2))

  let raw: RawQuestion[]
  if (lebenDir) {
    const dir = resolve(lebenDir)
    const core = loadJson<LebenCoreEntry[]>(`${dir}/leben-questions-core.json`)
    const translations = loadJson<Record<string, LebenTranslationEntry>>(
      `${dir}/leben-translations-ru.json`,
    )
    const context = loadJson<Record<string, string>>(
      `${dir}/leben-context-ru.json`,
    )
    const stateNames: Record<string, StateName> = {}
    for (const code of states) {
      const name = STATE_NAME_LOOKUP[code]
      if (name) stateNames[code] = name
    }
    const opts: MergeOptions = {
      includeStateCodes: states,
      stateNames,
      skipImageQuestions: true,
    }
    raw = mergeFromLebenInDeutschland(core, translations, context, opts)
    console.log(
      `Merged ${raw.length} questions from leben-in-deutschland at ${dir} (states: ${states.join(',') || 'none'})`,
    )
  } else if (inPath) {
    const abs = resolve(inPath)
    if (!existsSync(abs)) {
      console.error(`Input file not found: ${abs}`)
      process.exit(1)
    }
    const content = readFileSync(abs, 'utf8')
    raw = parseFromBamfJson.parse(content)
    console.log(`Parsed ${raw.length} raw questions from ${abs}`)
  } else {
    console.log('No --in or --leben path given, falling back to seed dataset')
    raw = SEED_QUESTIONS as unknown as RawQuestion[]
  }

  const normalized = raw
    .map((r) => normalize(r))
    .filter((q): q is Question => q !== null)
  console.log(`Normalized ${normalized.length} questions`)

  const issues = validate(normalized)
  const errors = issues.filter((i) => i.severity === 'error')
  const warnings = issues.filter((i) => i.severity === 'warning')

  for (const w of warnings) {
    console.warn(`[warn][${w.questionId}] ${w.message}`)
  }
  for (const e of errors) {
    console.error(`[err ][${e.questionId}] ${e.message}`)
  }

  if (errors.length > 0) {
    console.error(`\nAborting: ${errors.length} validation error(s).`)
    process.exit(1)
  }

  const outAbs = resolve(outPath)
  writeQuestionsJson(normalized, outAbs)
  console.log(`\n✓ Wrote ${normalized.length} questions to ${outAbs}`)
  if (warnings.length > 0) {
    console.log(`  (${warnings.length} warning${warnings.length === 1 ? '' : 's'})`)
  }
}

run()
