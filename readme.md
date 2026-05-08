You are an experienced senior full-stack engineer and product-minded UI designer.

Build a web application called “DeutschTest Trainer”.

The app is a two-in-one trainer:
1. Einbürgerungstest / Leben in Deutschland test practice
2. German language learning through test questions

The app should be built as a modern React + TypeScript web app. Prefer a clean, minimal, mobile-friendly UI. The app should work well on desktop and mobile.

Core idea:
The user should not only memorize answers, but also understand the German question, the vocabulary, and why the correct answer is correct.

Use local-only storage first. No backend is required for MVP. Store user progress in localStorage or IndexedDB.

Main features:

1. Question training mode

Show questions in random order.

Each question should have:
- German question text
- 4 German answer options
- correct answer
- Russian translation of the question
- Russian translation of each answer option
- translated key vocabulary
- Russian explanation of the correct answer

On the question page:
- Show the German question first
- Show the German answer options
- Do NOT show Russian translations by default
- Add a button: “Show translation”
- After clicking “Show translation”, show:
    - Russian translation of the question
    - Russian translation of all answer options
- Add a section below the answers: “Key words”
    - It should show important German words and Russian translations
    - This can be visible by default or collapsible
- Add a button: “Help”
    - When clicked, show a Russian explanation of the question
    - The explanation should explain why the correct answer is correct and why the others are not correct when possible

Answer behavior:
- Before the user selects an answer, options are neutral
- After selecting an answer:
    - Highlight the correct answer
    - If the user selected a wrong answer, highlight the wrong selected answer too
    - Show whether the answer was correct or incorrect
    - Show the explanation
    - Show a “Next question” button

2. Exam mode

Implement a simulated exam mode:
- 33 questions total
- 30 general questions
- 3 state-specific questions
- For MVP, use Berlin as the default state
- Randomize questions
- Show final score at the end
- Passing score: at least 17 correct answers
- Show pass/fail result
- Save exam attempts locally

3. Training filters / modes

On the home screen, provide these modes:
- All questions
- New questions only
- Questions with mistakes
- Weak questions
- Favorite questions
- Exam mode

Definitions:
- New questions: seenCount === 0
- Questions with mistakes: wrongCount > 0
- Weak questions: wrongCount > correctCount
- Favorite questions: isFavorite === true

4. Progress tracking

Track progress per question locally.

Use a structure similar to:

type QuestionProgress = {
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

When a question is shown, increment seenCount once per session/question display.
When user answers:
- increment correctCount or wrongCount
- update lastAnsweredAt
- update lastAnswerCorrect

When user clicks “Show translation”:
- increment translationOpenedCount

When user clicks “Help”:
- increment helpOpenedCount

5. Statistics page

Create a statistics page showing:
- Total questions
- Seen questions
- Unseen questions
- Correct answer rate
- Total mistakes
- Number of weak questions
- Number of favorite questions
- Exam attempts
- Best exam score
- Last exam score

Add buttons:
- Train mistakes
- Train new questions
- Train weak questions

6. Data model

Create a question data model like this:

type Question = {
id: string
category: 'general' | 'state'
state?: 'Berlin'
questionDe: string
questionRu: string
answers: {
id: 'A' | 'B' | 'C' | 'D'
textDe: string
textRu: string
}[]
correctAnswerId: 'A' | 'B' | 'C' | 'D'
keywords: {
de: string
ru: string
note?: string
}[]
explanationRu: string
}

Create a small seed dataset in the app with at least 10 example questions:
- 7 general questions
- 3 Berlin state questions

Use realistic example data, but keep it easy to replace later with the full official catalog.

Important:
Do not hardcode the app logic around only these 10 questions. The app should support hundreds of questions later.

7. Suggested project structure

Use a clean structure like:

src/
app/
components/
QuestionCard.tsx
AnswerOption.tsx
ProgressSummary.tsx
ModeCard.tsx
data/
questions.ts
hooks/
useQuestionProgress.ts
useTrainingSession.ts
pages/
HomePage.tsx
TrainingPage.tsx
ExamPage.tsx
StatisticsPage.tsx
types/
question.ts
progress.ts
utils/
shuffle.ts
storage.ts
selectors.ts

Routing:
Use React Router or a simple internal state router. React Router is preferred.

8. UI requirements

Design style:
- Clean
- Calm
- Focused
- Mobile-first
- Large readable text
- Good spacing
- Buttons easy to tap
- Cards with rounded corners
- No visual clutter

Home page:
Show app title:
“DeutschTest Trainer”

Subtitle:
“Practice Einbürgerungstest questions and learn German at the same time.”

Mode cards:
- All questions
- New questions
- Mistakes
- Weak questions
- Favorites
- Exam simulation
- Statistics

Question page:
Top:
- Mode name
- Progress in current session, for example “Question 4 / 20”
- Favorite button

Main card:
- German question
- Answer options
- Show translation button
- Key words section
- Help button
- Feedback after answering
- Next question button

Statistics page:
Use cards and simple progress bars.

9. Session logic

When starting a training mode:
- Select the relevant question pool
- Shuffle it
- Show questions one by one
- If no questions exist for the selected mode, show a friendly empty state

Examples:
- No mistakes yet:
  “You do not have any mistakes yet. Try all questions first.”
- No new questions:
  “You have already seen all questions.”

10. Favorite logic

Add a star button on the question page.
Clicking it toggles isFavorite for that question.

11. Persistence

Use localStorage for MVP.

Create helper functions:
- getProgressMap()
- saveProgressMap()
- getQuestionProgress(questionId)
- updateQuestionProgress(questionId, updateFn)
- resetProgress()

Also add a “Reset progress” button on the Statistics page, with confirmation.

12. Accessibility

Make sure:
- Buttons have clear labels
- Answer options are keyboard accessible
- Colors are not the only way to understand correct/wrong answer
- Text contrast is good

13. Code quality

Please:
- Use TypeScript strictly
- Keep components small
- Avoid unnecessary dependencies
- Add comments only where useful
- Make code easy to extend
- Do not over-engineer backend/auth/sync
- Do not implement payments
- Do not implement user accounts

14. Deliverables

Create the full working app.

After implementation:
- Make sure it builds successfully
- Fix TypeScript errors
- Fix lint errors if the project has linting
- Provide a short summary of what was created
- Explain how to run it locally

15. Future-ready requirements

Design the data import in a way that later I can replace the seed dataset with a generated JSON file from the official BAMF PDF.

The app should make it easy to add:
- all 300 general questions
- all Berlin questions
- explanations
- translations
- vocabulary

16. Official question sources

The official Einbürgerungstest / Leben in Deutschland questions come from BAMF.

Official sources:
- https://www.bamf.de
- https://oet.bamf.de

The official PDF catalog:
https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/Einbuergerung/gesamtfragenkatalog-lebenindeutschland.pdf

Important:
Do NOT scrape websites at runtime.
Do NOT depend on external APIs.

Instead:
- create a reusable import pipeline
- assume that later a JSON file with all questions will be added manually

For now:
- create a local sample dataset with mock/sample questions

Also create:
- a documented script or utility for future import
- the import pipeline should support:
    - question text
    - answer options
    - correct answer
    - state-specific questions
    - Russian translations
    - keywords
    - explanations

Expected future JSON structure:

{
"questions": [
{
"id": "1",
"category": "general",
"questionDe": "...",
"questionRu": "...",
"answers": [
{
"id": "A",
"textDe": "...",
"textRu": "..."
}
],
"correctAnswerId": "B",
"keywords": [
{
"de": "...",
"ru": "..."
}
],
"explanationRu": "..."
}
]
}

Additionally:
Create a README section explaining:
- where to download the official BAMF catalog
- how future JSON imports should work
- where the JSON file should be placed in the project
17. Import script

Create a separate utility script for future imports.

Suggested file:
scripts/importQuestions.ts

The script does not need to fully parse the BAMF PDF yet.

But:
- prepare architecture for importing question datasets
- define parser interfaces
- define normalization helpers
- define validation helpers

The goal is that later we can:
1. Download official BAMF PDF
2. Convert it into structured JSON
3. Import into the app

Prepare the project structure for this future workflow.