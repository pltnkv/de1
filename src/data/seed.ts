import type { Question } from '../types/question'

/**
 * Hand-curated fallback dataset. Used when `imported.json` is missing or empty.
 * The runtime entry point is `src/data/questions.ts`, which prefers the
 * imported dataset and falls back here.
 */
export const SEED_QUESTIONS: Question[] = [
  {
    id: 'g-1',
    category: 'general',
    questionDe:
      'In Deutschland dürfen Menschen offen etwas gegen die Regierung sagen, weil …',
    questionRu:
      'В Германии люди могут открыто высказываться против правительства, потому что …',
    answers: [
      {
        id: 'A',
        textDe: '… hier Religionsfreiheit gilt.',
        textRu: '… здесь действует свобода вероисповедания.',
      },
      {
        id: 'B',
        textDe: '… die Menschen Steuern zahlen.',
        textRu: '… люди платят налоги.',
      },
      {
        id: 'C',
        textDe: '… die Menschen das Wahlrecht haben.',
        textRu: '… у людей есть право голоса.',
      },
      {
        id: 'D',
        textDe: '… hier Meinungsfreiheit gilt.',
        textRu: '… здесь действует свобода слова.',
      },
    ],
    correctAnswerId: 'D',
    keywords: [
      { de: 'die Meinungsfreiheit', ru: 'свобода мнений / свобода слова' },
      { de: 'die Regierung', ru: 'правительство' },
      { de: 'die Religionsfreiheit', ru: 'свобода вероисповедания' },
      { de: 'das Wahlrecht', ru: 'право голоса' },
    ],
    explanationRu:
      'Правильный ответ — D. Право открыто высказываться против правительства закреплено в основном законе ФРГ (Grundgesetz, статья 5) как свобода мнений (Meinungsfreiheit). Религиозная свобода и право голоса — это другие, самостоятельные основные права, а уплата налогов вообще не является основанием для критики власти.',
  },
  {
    id: 'g-2',
    category: 'general',
    questionDe: 'Wahlen in Deutschland sind …',
    questionRu: 'Выборы в Германии являются …',
    answers: [
      { id: 'A', textDe: 'frei.', textRu: 'свободными.' },
      { id: 'B', textDe: 'geheim.', textRu: 'тайными.' },
      { id: 'C', textDe: 'gleich.', textRu: 'равными.' },
      {
        id: 'D',
        textDe: 'frei, geheim und gleich.',
        textRu: 'свободными, тайными и равными.',
      },
    ],
    correctAnswerId: 'D',
    keywords: [
      { de: 'die Wahl', ru: 'выборы' },
      { de: 'frei', ru: 'свободный' },
      { de: 'geheim', ru: 'тайный' },
      { de: 'gleich', ru: 'равный' },
      { de: 'allgemein', ru: 'всеобщий' },
    ],
    explanationRu:
      'Правильный ответ — D. По статье 38 Основного закона выборы в Бундестаг являются всеобщими, прямыми, свободными, равными и тайными. Поэтому единственный полный ответ — «свободные, тайные и равные».',
  },
  {
    id: 'g-3',
    category: 'general',
    questionDe: 'Was ist kein Merkmal unserer Demokratie?',
    questionRu: 'Что НЕ является признаком нашей демократии?',
    answers: [
      {
        id: 'A',
        textDe: 'regelmäßige Wahlen',
        textRu: 'регулярные выборы',
      },
      {
        id: 'B',
        textDe: 'Pressezensur',
        textRu: 'цензура прессы',
      },
      {
        id: 'C',
        textDe: 'Meinungsfreiheit',
        textRu: 'свобода мнений',
      },
      {
        id: 'D',
        textDe: 'Rechtsstaatlichkeit',
        textRu: 'правовое государство',
      },
    ],
    correctAnswerId: 'B',
    keywords: [
      { de: 'die Demokratie', ru: 'демократия' },
      { de: 'die Pressezensur', ru: 'цензура прессы' },
      { de: 'die Rechtsstaatlichkeit', ru: 'правовое государство' },
      { de: 'das Merkmal', ru: 'признак' },
    ],
    explanationRu:
      'Правильный ответ — B. Цензура прессы противоречит свободе печати (Pressefreiheit), которая является основой демократии. Регулярные выборы, свобода мнений и правовое государство — это, наоборот, ключевые признаки демократии в Германии.',
  },
  {
    id: 'g-4',
    category: 'general',
    questionDe: 'Wie heißt die deutsche Verfassung?',
    questionRu: 'Как называется немецкая конституция?',
    answers: [
      { id: 'A', textDe: 'Volksgesetz', textRu: 'Народный закон' },
      { id: 'B', textDe: 'Grundgesetz', textRu: 'Основной закон' },
      { id: 'C', textDe: 'Bundesgesetz', textRu: 'Федеральный закон' },
      { id: 'D', textDe: 'Deutsches Gesetz', textRu: 'Немецкий закон' },
    ],
    correctAnswerId: 'B',
    keywords: [
      { de: 'das Grundgesetz', ru: 'Основной закон (конституция ФРГ)' },
      { de: 'die Verfassung', ru: 'конституция' },
      { de: 'das Gesetz', ru: 'закон' },
    ],
    explanationRu:
      'Правильный ответ — B. Немецкая конституция называется Grundgesetz («Основной закон»). Она была принята 23 мая 1949 года и определяет государственный строй ФРГ. «Bundesgesetz» — это просто федеральный закон, а двух других названий в немецком праве не существует.',
  },
  {
    id: 'g-5',
    category: 'general',
    questionDe: 'Was ist die Hauptstadt der Bundesrepublik Deutschland?',
    questionRu: 'Какая столица у Федеративной Республики Германия?',
    answers: [
      { id: 'A', textDe: 'Bonn', textRu: 'Бонн' },
      { id: 'B', textDe: 'Berlin', textRu: 'Берлин' },
      { id: 'C', textDe: 'Hamburg', textRu: 'Гамбург' },
      { id: 'D', textDe: 'Frankfurt am Main', textRu: 'Франкфурт-на-Майне' },
    ],
    correctAnswerId: 'B',
    keywords: [
      { de: 'die Hauptstadt', ru: 'столица' },
      { de: 'die Bundesrepublik', ru: 'федеративная республика' },
    ],
    explanationRu:
      'Правильный ответ — B. Берлин является столицей ФРГ с 1990 года (после объединения Германии). Бонн был столицей Западной Германии до 1990 года. Гамбург и Франкфурт — крупные города, но не столицы.',
  },
  {
    id: 'g-6',
    category: 'general',
    questionDe: 'Wie viele Bundesländer hat die Bundesrepublik Deutschland?',
    questionRu: 'Сколько федеральных земель в Федеративной Республике Германия?',
    answers: [
      { id: 'A', textDe: '14', textRu: '14' },
      { id: 'B', textDe: '15', textRu: '15' },
      { id: 'C', textDe: '16', textRu: '16' },
      { id: 'D', textDe: '17', textRu: '17' },
    ],
    correctAnswerId: 'C',
    keywords: [
      { de: 'das Bundesland', ru: 'федеральная земля' },
      { de: 'die Bundesrepublik', ru: 'федеративная республика' },
    ],
    explanationRu:
      'Правильный ответ — C. В составе ФРГ — 16 федеральных земель (Bundesländer). Среди них есть 13 «обычных» земель и 3 города-земли: Берлин, Гамбург и Бремен.',
  },
  {
    id: 'g-7',
    category: 'general',
    questionDe: 'Welches Recht gehört zu den Grundrechten in Deutschland?',
    questionRu: 'Какое право относится к основным правам в Германии?',
    answers: [
      {
        id: 'A',
        textDe: 'Waffenbesitz',
        textRu: 'владение оружием',
      },
      {
        id: 'B',
        textDe: 'Faustrecht',
        textRu: 'право сильного',
      },
      {
        id: 'C',
        textDe: 'Meinungsfreiheit',
        textRu: 'свобода мнений',
      },
      {
        id: 'D',
        textDe: 'Selbstjustiz',
        textRu: 'самосуд',
      },
    ],
    correctAnswerId: 'C',
    keywords: [
      { de: 'das Grundrecht', ru: 'основное право' },
      { de: 'die Meinungsfreiheit', ru: 'свобода мнений' },
      { de: 'die Selbstjustiz', ru: 'самосуд' },
      { de: 'das Faustrecht', ru: 'право сильного / кулачное право' },
    ],
    explanationRu:
      'Правильный ответ — C. Свобода мнений (Meinungsfreiheit) гарантирована статьёй 5 Основного закона и относится к ключевым основным правам (Grundrechte). Владение оружием, право сильного и самосуд не являются основными правами и в Германии запрещены или строго регулируются.',
  },
  {
    id: 'b-1',
    category: 'state',
    state: 'Berlin',
    questionDe: 'Wie heißt das Wappentier von Berlin?',
    questionRu: 'Как называется геральдическое животное Берлина?',
    answers: [
      { id: 'A', textDe: 'Adler', textRu: 'орёл' },
      { id: 'B', textDe: 'Bär', textRu: 'медведь' },
      { id: 'C', textDe: 'Löwe', textRu: 'лев' },
      { id: 'D', textDe: 'Pferd', textRu: 'конь' },
    ],
    correctAnswerId: 'B',
    keywords: [
      { de: 'das Wappentier', ru: 'геральдическое животное (символ на гербе)' },
      { de: 'der Bär', ru: 'медведь' },
      { de: 'der Adler', ru: 'орёл' },
    ],
    explanationRu:
      'Правильный ответ — B. На гербе Берлина изображён чёрный медведь — он считается официальным символом города. Орёл — это символ Германии (на федеральном гербе), а не Берлина.',
  },
  {
    id: 'b-2',
    category: 'state',
    state: 'Berlin',
    questionDe: 'Wie heißt das Parlament von Berlin?',
    questionRu: 'Как называется парламент Берлина?',
    answers: [
      { id: 'A', textDe: 'Bürgerschaft', textRu: 'Бюргершафт' },
      { id: 'B', textDe: 'Landtag', textRu: 'Ландтаг' },
      {
        id: 'C',
        textDe: 'Abgeordnetenhaus',
        textRu: 'Палата депутатов',
      },
      { id: 'D', textDe: 'Bundestag', textRu: 'Бундестаг' },
    ],
    correctAnswerId: 'C',
    keywords: [
      { de: 'das Abgeordnetenhaus', ru: 'Палата депутатов (парламент Берлина)' },
      { de: 'der Landtag', ru: 'ландтаг (парламент земли)' },
      { de: 'der Bundestag', ru: 'Бундестаг (парламент ФРГ)' },
      { de: 'die Bürgerschaft', ru: 'бюргершафт (парламент Гамбурга и Бремена)' },
    ],
    explanationRu:
      'Правильный ответ — C. Парламент Берлина называется «Abgeordnetenhaus». «Bürgerschaft» — это парламенты Гамбурга и Бремена, «Landtag» — парламенты обычных земель, а «Bundestag» — это федеральный парламент Германии.',
  },
  {
    id: 'b-3',
    category: 'state',
    state: 'Berlin',
    questionDe:
      'Wer leitet die Regierung des Landes Berlin?',
    questionRu: 'Кто возглавляет правительство земли Берлин?',
    answers: [
      {
        id: 'A',
        textDe: 'der Bundeskanzler / die Bundeskanzlerin',
        textRu: 'федеральный канцлер',
      },
      {
        id: 'B',
        textDe: 'der Ministerpräsident / die Ministerpräsidentin',
        textRu: 'премьер-министр земли',
      },
      {
        id: 'C',
        textDe:
          'der Regierende Bürgermeister / die Regierende Bürgermeisterin',
        textRu: 'правящий бургомистр',
      },
      {
        id: 'D',
        textDe: 'der Bundespräsident / die Bundespräsidentin',
        textRu: 'федеральный президент',
      },
    ],
    correctAnswerId: 'C',
    keywords: [
      {
        de: 'der Regierende Bürgermeister',
        ru: 'правящий бургомистр (глава Берлина)',
      },
      { de: 'der Ministerpräsident', ru: 'премьер-министр земли' },
      { de: 'der Bundeskanzler', ru: 'федеральный канцлер' },
      { de: 'leiten', ru: 'руководить, возглавлять' },
    ],
    explanationRu:
      'Правильный ответ — C. В Берлине, как и в Гамбурге и Бремене, главу правительства земли называют «Regierender Bürgermeister» (правящий бургомистр). В обычных землях это «Ministerpräsident». «Bundeskanzler» возглавляет правительство всей ФРГ, а «Bundespräsident» — глава государства.',
  },
]
