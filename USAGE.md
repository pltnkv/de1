# DeutschTest Trainer — usage

A two-in-one trainer for the German Einbürgerungstest / Leben in Deutschland that
also helps Russian-speaking learners understand the German questions, the
vocabulary, and *why* the correct answer is correct.

The original product specification lives in [`readme.md`](./readme.md).

## Run locally

Requires Node 18+ and npm.

```bash
npm install
npm run dev      # starts Vite dev server (default http://localhost:5173)
npm run build    # type-check and produce a production build in dist/
npm run preview  # preview the production build locally
```

## What's included

- React + TypeScript SPA built with Vite, routed with React Router.
- Six modes on the home screen: **All questions**, **New**, **Mistakes**,
  **Weak**, **Favorites**, **Exam simulation**, plus a **Statistics** page.
- Per-question progress (seen / correct / wrong / favorite / translation
  opens / help opens) persisted in `localStorage`.
- Exam mode: 33 questions (30 general + 3 Berlin) with a 17-correct pass
  threshold. Attempts are saved locally. The seed dataset is smaller than the
  full exam, so the threshold is scaled proportionally during MVP.
- Mobile-first UI with light/dark color schemes that follow `prefers-color-scheme`.

## Project structure

```
src/
  app/            App.tsx and routes
  components/     QuestionCard, AnswerOption, ModeCard, ProgressSummary
  data/           questions.ts (seed dataset; later replaced by imported JSON)
  hooks/          useQuestionProgress, useTrainingSession
  pages/          HomePage, TrainingPage, ExamPage, StatisticsPage
  styles/         index.css (single CSS file, mobile-first)
  types/          question.ts, progress.ts
  utils/          shuffle, storage, selectors
scripts/
  importQuestions.ts   Future-ready import pipeline (see below)
```

## Question dataset

The app currently ships with **297 questions** in `src/data/imported.json`:

- **289 general questions** (out of the 300 in the official catalog —
  11 image-based "which crest / which map" questions were excluded because
  we don't host the images yet).
- **8 Berlin state questions** (BE-2 .. BE-7, BE-9, BE-10 — image-based
  BE-1 and BE-8 were excluded for the same reason).

Each question has the German text, four German answer options, the correct
answer, **Russian translations of the question and every answer**, and a
**Russian explanation** of the correct answer. Keywords (`keywords[]`) are
empty for now — they're not in the upstream source and would have to be
added by hand.

### Source

Questions and Russian content come from the MIT-licensed
[`leben-in-deutschland/leben-in-deutschland-app`](https://github.com/leben-in-deutschland/leben-in-deutschland-app)
repository, which mirrors the official BAMF catalog *and* fills in the
answer key + Russian translations.

The official sources behind it:

- https://www.bamf.de
- https://oet.bamf.de
- Official PDF catalog:
  https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/Einbuergerung/gesamtfragenkatalog-lebenindeutschland.pdf

> ⚠️ The official BAMF "Gesamtfragenkatalog" PDF intentionally **does not
> contain the correct answers** — the published catalog is questions-only.
> That's why the import pipeline merges the BAMF questions with the
> community-maintained answer key and translations.

> The app does **not** scrape BAMF at runtime. The dataset is committed as
> JSON and refreshed manually via `npm run import:questions`.

### Where to put the imported JSON

Place the produced JSON file at:

```
src/data/imported.json
```

It must follow this shape:

```jsonc
{
  "questions": [
    {
      "id": "1",
      "category": "general",            // "general" | "state"
      "state": "Berlin",                // optional, only for state questions
      "questionDe": "...",
      "questionRu": "...",
      "answers": [
        { "id": "A", "textDe": "...", "textRu": "..." },
        { "id": "B", "textDe": "...", "textRu": "..." },
        { "id": "C", "textDe": "...", "textRu": "..." },
        { "id": "D", "textDe": "...", "textRu": "..." }
      ],
      "correctAnswerId": "B",
      "keywords": [{ "de": "...", "ru": "..." }],
      "explanationRu": "..."
    }
  ]
}
```

Once `src/data/imported.json` exists, swap the seed dataset import in
`src/data/questions.ts` for the JSON file (Vite supports JSON imports
out of the box) — or load it lazily — and the rest of the app keeps working.

### Running the import script

To regenerate `src/data/imported.json` from the leben-in-deutschland source:

```bash
# (one-time) place the upstream JSON files into data-raw/
mkdir -p data-raw
curl -L -o data-raw/leben-questions-core.json \
  https://raw.githubusercontent.com/leben-in-deutschland/leben-in-deutschland-app/main/src/web/data/questions-core.json
curl -L -o data-raw/leben-translations-ru.json \
  https://raw.githubusercontent.com/leben-in-deutschland/leben-in-deutschland-app/main/src/web/public/data/translations/ru.json
curl -L -o data-raw/leben-context-ru.json \
  https://raw.githubusercontent.com/leben-in-deutschland/leben-in-deutschland-app/main/src/web/public/data/context/ru.json

# merge the three files, filter to general + Berlin, write src/data/imported.json
npm run import:questions -- --leben data-raw

# or include more states (e.g. Berlin + Bavaria — needs entries in
# STATE_NAME_LOOKUP inside scripts/importQuestions.ts):
npm run import:questions -- --leben data-raw --states BE,BY
```

Other invocations:

```bash
# Validate / re-emit a single JSON file in our own future-ready shape
npm run import:questions -- --in path/to/yourfile.json

# Smoke-test the pipeline against the bundled seed dataset
npm run import:questions
```

The script (`scripts/importQuestions.ts`) is structured as small composable
steps so each piece can be replaced independently:

1. **Parser** — `parseFromBamfJson` reads a single JSON file in our own
   future-ready shape (`{ "questions": [...] }`); `mergeFromLebenInDeutschland`
   merges the three upstream files into `RawQuestion` records. Add new parsers
   for other input formats (CSV, extracted PDF text, ...).
2. **Normalizer** (`normalize`) — turns raw records into strict `Question`
   objects, dropping anything irreparably broken.
3. **Validator** (`validate`) — checks ids, answer shapes, missing fields,
   and reports errors / warnings.
4. **Writer** (`writeQuestionsJson`) — emits a deterministic JSON file at the
   target path.

### Suggested workflow for the full BAMF catalog

1. Download the official PDF (link above).
2. Convert it into structured JSON. PDF text extraction is fiddly — you can use
   tools like `pdftotext`, then write a small parser that produces
   `RawQuestion` records with the German text. Translations and Russian
   explanations can be filled in incrementally.
3. Drop the raw file in a `data-raw/` directory (gitignored).
4. Implement / extend a parser in `scripts/importQuestions.ts`.
5. Run `npm run import:questions -- --in data-raw/yourfile.json` and address
   any validation warnings / errors.
6. Commit the resulting `src/data/imported.json` and switch the app to load
   from it.

The data model in the app already supports:

- 300+ general questions
- Berlin (and, with a small extension, all other Bundesländer)
- Russian translations of questions and answers
- Keywords (with optional grammar / pronunciation notes)
- Russian explanations of why the correct answer is correct

## Reset progress

The Statistics page has a **Reset progress** button (with confirmation) that
clears all per-question progress and exam attempts from `localStorage`.
