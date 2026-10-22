// Учебный материал и сборка заданий.
// Тематика: диснеевские принцессы.
// Этапы: Звуки → Слоги → Слова (4 уровня) → Фразы (5 уровней) → Истории (5 историй).
// Чтобы добавить слово или уровень — правьте списки ниже, код игр трогать не нужно.

export type StageId = 'sounds' | 'syllables' | 'words' | 'phrases' | 'stories'

export interface Stage {
  id: StageId
  title: string
  pic: string
  /** подписи уровней; пустой список — этап ещё не готов */
  levels: string[]
}

export const VOWELS = 'АЕЁИОУЫЭЮЯ'

// ── Этап 1: слово на слух → первая буква ─────────────────────────────────────
// Берутся слова, где первый звук слышен однозначно (без безударной «о» → «а»).
const FIRST_LETTER: { word: string; pic: string }[][] = [
  // Уровень 1: гласные А О У И + сонорные М Н Л Р
  [
    { word: 'арфа', pic: '🎵' },
    { word: 'утро', pic: '🌅' },
    { word: 'облако', pic: '☁️' },
    { word: 'игла', pic: '🪡' },
    { word: 'луна', pic: '🌙' },
    { word: 'море', pic: '🌊' },
    { word: 'небо', pic: '⭐' },
    { word: 'роза', pic: '🌹' },
  ],
  // Уровень 2: С К Т П Б Д В З
  [
    { word: 'сказка', pic: '📖' },
    { word: 'корона', pic: '👑' },
    { word: 'туфелька', pic: '👠' },
    { word: 'платье', pic: '👗' },
    { word: 'башня', pic: '🗼' },
    { word: 'дворец', pic: '🏰' },
    { word: 'волшебство', pic: '🪄' },
    { word: 'замок', pic: '🔒' },
  ],
  // Уровень 3: Ш Ж Х Ф Ц Ч Я Ё
  [
    { word: 'шляпа', pic: '🎩' },
    { word: 'жираф', pic: '🦒' },
    { word: 'хлеб', pic: '🍞' },
    { word: 'фея', pic: '🧚' },
    { word: 'цветок', pic: '🌸' },
    { word: 'черепаха', pic: '🐢' },
    { word: 'яблоко', pic: '🍎' },
    { word: 'ёжик', pic: '🦔' },
  ],
]

// ── Этап 2: слоги «согласная + гласная» ──────────────────────────────────────
const SYLLABLES: { cons: string; vowels: string }[] = [
  { cons: 'МНЛР', vowels: 'АОУЫИ' },
  { cons: 'СКТП', vowels: 'АОУЫИ' },
  { cons: 'БДГВЗ', vowels: 'АОУЫИ' },
  { cons: 'ШЖХФ', vowels: 'АОУИ' },
  { cons: 'МНЛРСТ', vowels: 'ЯЕЁЮ' },
]
// сочетания, которых в русских словах почти нет
const NO_SUCH_SYLLABLE = ['КЫ', 'ГЫ', 'ХЫ']

// ── Этап 3: слова по слогам + картинка ───────────────────────────────────────
// Уровни: два открытых слога → три открытых → закрытые и кластеры → имена принцесс.
const WORDS: { syl: string[]; pic: string }[][] = [
  // Уровень 1: два открытых слога (СГ-СГ или СГ-Г)
  [
    { syl: ['РО', 'ЗА'], pic: '🌹' },
    { syl: ['МА', 'МА'], pic: '👸' },
    { syl: ['МО', 'РЕ'], pic: '🌊' },
    { syl: ['КО', 'НИ'], pic: '🐴' },
    { syl: ['ЛИ', 'СА'], pic: '🦊' },
    { syl: ['СО', 'ВА'], pic: '🦉' },
    { syl: ['РЫ', 'БА'], pic: '🐟' },
    { syl: ['ФЕ', 'Я'], pic: '🧚' },
  ],
  // Уровень 2: три открытых слога
  [
    { syl: ['КО', 'РО', 'НА'], pic: '👑' },
    { syl: ['КА', 'РЕ', 'ТА'], pic: '🎠' },
    { syl: ['РА', 'ДУ', 'ГА'], pic: '🌈' },
    { syl: ['МА', 'ЛИ', 'НА'], pic: '🍓' },
    { syl: ['ДЕ', 'РЕ', 'ВО'], pic: '🌳' },
    { syl: ['СО', 'БА', 'КА'], pic: '🐕' },
    { syl: ['НЕ', 'БЕ', 'СА'], pic: '✨' },
    { syl: ['ГИ', 'ТА', 'РА'], pic: '🎸' },
  ],
  // Уровень 3: закрытые слоги и кластеры согласных
  [
    { syl: ['ЗА', 'МОК'], pic: '🏰' },
    { syl: ['ЦВЕ', 'ТОК'], pic: '🌸' },
    { syl: ['ДРА', 'КОН'], pic: '🐉' },
    { syl: ['ПЛА', 'ТЬЕ'], pic: '👗' },
    { syl: ['ДЕ', 'ВОЧ', 'КА'], pic: '👧' },
    { syl: ['БА', 'БОЧ', 'КА'], pic: '🦋' },
    { syl: ['ЗЕР', 'КА', 'ЛО'], pic: '🪞' },
    { syl: ['КОН', 'ФЕ', 'ТА'], pic: '🍬' },
  ],
  // Уровень 4: имена принцесс и волшебные слова
  [
    { syl: ['А', 'РИ', 'ЭЛЬ'], pic: '🧜‍♀️' },
    { syl: ['ЗО', 'ЛУШ', 'КА'], pic: '👠' },
    { syl: ['АВ', 'РО', 'РА'], pic: '💜' },
    { syl: ['ЖАС', 'МИН'], pic: '🌺' },
    { syl: ['МУ', 'ЛАН'], pic: '🏹' },
    { syl: ['ПРИН', 'ЦЕС', 'СА'], pic: '👸' },
    { syl: ['ЧУ', 'ДЕ', 'СА'], pic: '✨' },
    { syl: ['ВОЛ', 'ШЕБ', 'НИК'], pic: '🪄' },
  ],
]

// ── Этап 4: фразы ────────────────────────────────────────────────────────────
// Картинка-ответ составлена из тех же предметов, что и фраза;
// неверные варианты (wrong) отличаются одним предметом.
const PHRASES: { text: string; pic: string; wrong?: string[] }[][] = [
  // Уровень 1: 2-3 слова (слово + картинка)
  [
    { text: 'ВОТ РОЗА', pic: '🌹' },
    { text: 'ВОТ КОРОНА', pic: '👑' },
    { text: 'ЭТО ФЕЯ', pic: '🧚' },
    { text: 'ТАМ ЗАМОК', pic: '🏰' },
    { text: 'ВОТ КАРЕТА', pic: '🎠' },
    { text: 'ЭТО ДРАКОН', pic: '🐉' },
    { text: 'ТУТ ПРИНЦ', pic: '🤴' },
    { text: 'ВОТ ПЛАТЬЕ', pic: '👗' },
  ],
  // Уровень 2: 3-4 слова (кто где / что делает)
  [
    { text: 'АРИЭЛЬ В МОРЕ', pic: '🧜🌊', wrong: ['🧜🏰', '🐟🌊'] },
    { text: 'ПРИНЦ НА КОНЕ', pic: '🤴🐴', wrong: ['🤴🎠', '👸🐴'] },
    { text: 'ФЕЯ У ЗОЛУШКИ', pic: '🧚👠', wrong: ['🧚👗', '🤴👠'] },
    { text: 'БЕЛЛЬ В ЗАМКЕ', pic: '👸🏰', wrong: ['👸🌳', '🐻🏰'] },
    { text: 'ДРАКОН ДЫШИТ ОГНЁМ', pic: '🐉🔥', wrong: ['🐉💨', '🦁🔥'] },
    { text: 'РЫБА В МОРЕ', pic: '🐟🌊', wrong: ['🐟🌳', '🦈🌊'] },
    { text: 'ЗВЕЗДА НАД ЗАМКОМ', pic: '⭐🏰', wrong: ['⭐🌊', '🌙🏰'] },
    { text: 'РОЗА У ПРИНЦЕССЫ', pic: '🌹👸', wrong: ['🌹🧚', '💜👸'] },
  ],
  // Уровень 3: 4-5 слов
  [
    { text: 'БЕЛЛЬ ЧИТАЕТ КНИГУ', pic: '👸📖', wrong: ['👸🌹', '🧚📖'] },
    { text: 'ПРИНЦ НАШЁЛ ТУФЕЛЬКУ', pic: '🤴👠', wrong: ['🤴👑', '👸👠'] },
    { text: 'ФЕЯ ДАЁТ ПЛАТЬЕ', pic: '🧚👗', wrong: ['🧚👑', '👸👗'] },
    { text: 'ЗОЛУШКА ЕДЕТ НА БАЛ', pic: '👠🎠', wrong: ['👗🎠', '👠🏰'] },
    { text: 'РАПУНЦЕЛЬ В ВЫСОКОЙ БАШНЕ', pic: '💛🗼', wrong: ['💛🏰', '👸🗼'] },
    { text: 'МУЛАН ДЕРЖИТ ЛУК', pic: '🏹✨', wrong: ['🏹🐉', '🗡️✨'] },
    { text: 'АРИЭЛЬ НАШЛА РАКОВИНУ', pic: '🧜🐚', wrong: ['🧜🐟', '👸🐚'] },
    { text: 'КАРЕТА ЕДЕТ К ЗАМКУ', pic: '🎠🏰', wrong: ['🎠🌊', '🐴🏰'] },
  ],
  // Уровень 4: 5-6 слов
  [
    { text: 'ПРИНЦЕССА ИДЁТ НА БАЛ', pic: '👸💃', wrong: ['👸🌊', '🧚💃'] },
    { text: 'АВРОРА СПИТ В ЗАМКЕ', pic: '💜🏰', wrong: ['💜🌳', '👸🏰'] },
    { text: 'БЕЛЛЬ И ЧУДОВИЩЕ В ЗАМКЕ', pic: '👸🐻🏰', wrong: ['👸🐻🌊', '🧚🐻🏰'] },
    { text: 'ПРИНЦ ИЩЕТ ХОЗЯЙКУ ТУФЕЛЬКИ', pic: '🤴👠', wrong: ['🤴👑', '👸👠'] },
    { text: 'МУЛАН ПОБЕДИЛА ЗЛОГО ДРАКОНА', pic: '🏹🐉', wrong: ['🏹💜', '🗡️🐉'] },
    { text: 'РАПУНЦЕЛЬ ВИДИТ ОГНИ С БАШНИ', pic: '💛🗼✨', wrong: ['💛🗼🌊', '💜🗼✨'] },
    { text: 'АРИЭЛЬ ОТДАЛА ГОЛОС ВЕДЬМЕ', pic: '🧜✨', wrong: ['🧜🌊', '🧜🐚'] },
    { text: 'ФЕЯ ПРЕВРАЩАЕТ ТЫКВУ В КАРЕТУ', pic: '🧚🎠', wrong: ['🧚🏰', '🌟🎠'] },
  ],
  // Уровень 5: длинные предложения (6-8 слов)
  [
    { text: 'МАЛЕНЬКАЯ РУСАЛОЧКА ЖИЛА В СИНЕМ МОРЕ', pic: '🧜🌊', wrong: ['🧜🏰', '🐟🌊'] },
    { text: 'ДОБРАЯ ФЕЯ ПОМОГЛА ЗОЛУШКЕ ПОПАСТЬ НА БАЛ', pic: '🧚👠💃', wrong: ['🧚👗💃', '🧚👠🌊'] },
    { text: 'ЗЛАЯ ВЕДЬМА УСЫПИЛА КРАСАВИЦУ АВРОРУ', pic: '👿💜', wrong: ['👿👸', '🧚💜'] },
    { text: 'ПРИНЦ ПОЦЕЛОВАЛ СПЯЩУЮ АВРОРУ И ОНА ПРОСНУЛАСЬ', pic: '🤴💜✨', wrong: ['🤴👸✨', '🤴💜🌊'] },
    { text: 'ВОЛШЕБНОЕ ЗЕРКАЛО ГОВОРИЛО ТОЛЬКО ПРАВДУ', pic: '🪞✨', wrong: ['🪞👸', '💎✨'] },
    { text: 'НА БАЛУ ВСЕ ЛЮБОВАЛИСЬ ЗОЛУШКОЙ В ПЛАТЬЕ', pic: '💃👗✨', wrong: ['💃👑✨', '💃👗🌊'] },
    { text: 'РАПУНЦЕЛЬ СПУСТИЛАСЬ С БАШНИ И УВИДЕЛА МИР', pic: '💛🗼🌟', wrong: ['💛🗼🌊', '💜🗼🌟'] },
    { text: 'БЕЛЛЬ УВИДЕЛА ЧТО ЧУДОВИЩЕ НА САМОМ ДЕЛЕ ДОБРОЕ', pic: '👸🐻💙', wrong: ['👸🐻🏰', '🧚🐻💙'] },
  ],
]

// ── Этап 5: короткие истории ─────────────────────────────────────────────────
// По предложению на экран; в конце один вопрос на понимание.
interface Story {
  title: string
  pic: string
  pages: { text: string; pic: string }[]
  ask: string
  answer: string
  wrong: string[]
}

const STORIES: Story[] = [
  {
    title: 'АРИЭЛЬ И ПРИНЦ',
    pic: '🧜‍♀️',
    pages: [
      { text: 'ЭТО АРИЭЛЬ.', pic: '🧜‍♀️' },
      { text: 'ОНА ЖИВЁТ В МОРЕ.', pic: '🧜🌊' },
      { text: 'АРИЭЛЬ ЛЮБИТ ПЕТЬ.', pic: '🧜🎵' },
      { text: 'ОНА ВИДИТ КОРАБЛЬ.', pic: '🧜🚢' },
      { text: 'НА КОРАБЛЕ СТОИТ ПРИНЦ.', pic: '🤴🚢' },
    ],
    ask: 'Кто стоит на корабле?',
    answer: '🤴',
    wrong: ['🧚', '👸'],
  },
  {
    title: 'ЗОЛУШКА НА БАЛУ',
    pic: '👠',
    pages: [
      { text: 'ЭТО ЗОЛУШКА.', pic: '👠' },
      { text: 'ОНА МЕЧТАЕТ О БАЛЕ.', pic: '👠💃' },
      { text: 'ФЕЯ ПРИШЛА НА ПОМОЩЬ.', pic: '🧚✨' },
      { text: 'ФЕЯ СШИЛА ЗОЛУШКЕ ПЛАТЬЕ.', pic: '🧚👗' },
      { text: 'КАРЕТА ВЕЗЁТ ЗОЛУШКУ НА БАЛ.', pic: '🎠💃' },
      { text: 'НА БАЛУ ПРИНЦ ТАНЦУЕТ С НЕЙ.', pic: '🤴💃' },
    ],
    ask: 'Что сшила фея Золушке?',
    answer: '👗',
    wrong: ['👑', '👠'],
  },
  {
    title: 'БЕЛЛЬ И ЧУДОВИЩЕ',
    pic: '🌹',
    pages: [
      { text: 'БЕЛЛЬ ЖИВЁТ В ДЕРЕВНЕ.', pic: '👸🌳' },
      { text: 'ОНА ЛЮБИТ ЧИТАТЬ КНИГИ.', pic: '👸📖' },
      { text: 'В ЗАМКЕ ЖИВЁТ ЧУДОВИЩЕ.', pic: '🏰🐻' },
      { text: 'БЕЛЛЬ ВОШЛА В ЗАМОК.', pic: '👸🏰' },
      { text: 'ТАМ ОГРОМНАЯ БИБЛИОТЕКА!', pic: '📚✨' },
      { text: 'БЕЛЛЬ ОЧЕНЬ РАДА.', pic: '👸😊' },
    ],
    ask: 'Что любит делать Белль?',
    answer: '📖',
    wrong: ['💃', '🌹'],
  },
  {
    title: 'РАПУНЦЕЛЬ И БАШНЯ',
    pic: '💛',
    pages: [
      { text: 'РАПУНЦЕЛЬ ЖИВЁТ В БАШНЕ.', pic: '💛🗼' },
      { text: 'У НЕЁ ОЧЕНЬ ДЛИННЫЕ ВОЛОСЫ.', pic: '💛✨' },
      { text: 'РАЗ В ГОД ОНА ВИДИТ ОГНИ.', pic: '💛🕯️' },
      { text: 'ОДНАЖДЫ ПРИНЦ ЗАЛЕЗ В БАШНЮ.', pic: '🤴🗼' },
      { text: 'ОН ВЗЯЛ РАПУНЦЕЛЬ С СОБОЙ.', pic: '🤴💛' },
      { text: 'РАПУНЦЕЛЬ УВИДЕЛА МИР!', pic: '💛🌟' },
    ],
    ask: 'Где живёт Рапунцель?',
    answer: '🗼',
    wrong: ['🏰', '🌊'],
  },
  {
    title: 'АВРОРА И СОН',
    pic: '💜',
    pages: [
      { text: 'АВРОРА ГУЛЯЛА В ЛЕСУ.', pic: '💜🌳' },
      { text: 'ОНА НАШЛА ДОМ В ЧАЩЕ.', pic: '💜🏠' },
      { text: 'В ДОМЕ БЫЛО ВЕРЕТЕНО.', pic: '🏠🧵' },
      { text: 'АВРОРА УКОЛОЛАСЬ И УСНУЛА.', pic: '💜😴' },
      { text: 'ПРИНЦ НАШЁЛ СПЯЩУЮ АВРОРУ.', pic: '🤴💜' },
      { text: 'ОН ПОЦЕЛОВАЛ ЕЁ И ОНА ПРОСНУЛАСЬ.', pic: '🤴💜✨' },
    ],
    ask: 'Что случилось с Авророй?',
    answer: '😴',
    wrong: ['💃', '📖'],
  },
]

export const STAGES: Stage[] = [
  { id: 'sounds', title: 'Звуки', pic: '🌹', levels: ['А О У И М Н Л Р', 'С К Т П Б Д В З', 'Ш Ж Х Ф Ц Ч Я Ё'] },
  { id: 'syllables', title: 'Слоги', pic: '👑', levels: ['М Н Л Р', 'С К Т П', 'Б Д Г В З', 'Ш Ж Х Ф', 'Я Е Ё Ю'] },
  { id: 'words', title: 'Слова', pic: '🏰', levels: ['РО-ЗА', 'КО-РО-НА', 'ЗА-МОК', 'А-РИ-ЭЛЬ'] },
  {
    id: 'phrases',
    title: 'Фразы',
    pic: '🎠',
    levels: ['ВОТ РОЗА', 'АРИЭЛЬ В МОРЕ', 'БЕЛЛЬ ЧИТАЕТ', 'ПРИНЦЕССА НА БАЛУ', 'ДЛИННЫЕ ФРАЗЫ'],
  },
  { id: 'stories', title: 'Истории', pic: '✨', levels: STORIES.map((s) => `${s.pic} ${s.title}`) },
]

/**
 * Деление слова на слоги для подсказки по нажатию. Правило простое: одна
 * согласная между гласными уходит вправо (КА-РЕ-ТА), из двух и более первая
 * остаётся слева (КОС-МОС, ЗВЕЗ-ДА); й, ь, ъ не отрываются от своего слога.
 * Знак препинания остаётся при последнем слоге.
 */
export function syllabify(word: string): string[] {
  const tail = word.match(/[.,!?…]+$/)?.[0] ?? ''
  const chars = [...word.slice(0, word.length - tail.length)]
  const vowelAt = chars.flatMap((ch, i) => (VOWELS.includes(ch.toUpperCase()) ? [i] : []))
  const parts: string[] = []
  let start = 0
  for (let k = 0; k + 1 < vowelAt.length; k++) {
    const next = vowelAt[k + 1]
    let cut = next - vowelAt[k] - 1 >= 2 ? vowelAt[k] + 2 : vowelAt[k] + 1
    while (cut < next && 'ЙЬЪ'.includes(chars[cut].toUpperCase())) cut++
    parts.push(chars.slice(start, cut).join(''))
    start = cut
  }
  parts.push(chars.slice(start).join('') + tail)
  return parts
}

// ── Тексты для озвучки ───────────────────────────────────────────────────────
export const PRAISE = 'Молодец!'

export const firstLetterPrompt = (word: string) => `${word}. Какая первая буква?`

/** Слово из фразы без знаков препинания — так оно произносится по нажатию. */
export const spoken = (word: string) => word.toLowerCase().replace(/[.,!?…]/g, '')

/**
 * Всё, что приложение может произнести. По этому списку tools/make_audio.py
 * записывает файлы озвучки, поэтому любой новый текст для say() добавлять сюда.
 */
export function allUtterances(): string[] {
  const out = new Set<string>()
  const add = (text: string) => out.add(text.toLowerCase())
  const addSentence = (text: string) => {
    add(text)
    text.split(' ').forEach((w) => add(spoken(w)))
  }
  FIRST_LETTER.flat().forEach((x) => add(firstLetterPrompt(x.word)))
  for (const { cons, vowels } of SYLLABLES) {
    for (const v of vowels) add(v)
    for (const c of cons) for (const v of vowels) if (!NO_SUCH_SYLLABLE.includes(c + v)) add(c + v)
  }
  WORDS.flat().forEach((w) => {
    w.syl.forEach(add)
    add(w.syl.join(''))
  })
  PHRASES.flat().forEach((p) => addSentence(p.text))
  STORIES.forEach((s) => {
    s.pages.forEach((p) => addSentence(p.text))
    add(s.ask)
  })
  add(PRAISE)
  return [...out]
}

// ── Задания ──────────────────────────────────────────────────────────────────
export type Task =
  | { kind: 'first'; word: string; pic: string; answer: string; options: string[] }
  | { kind: 'dock'; c: string; v: string }
  | { kind: 'pickSyl'; answer: string; options: string[] }
  | { kind: 'word'; syl: string[]; answer: string; options: string[] }
  | { kind: 'phrase'; words: string[]; answer: string; options: string[] }
  | { kind: 'page'; words: string[]; pic: string }
  | { kind: 'question'; text: string; answer: string; options: string[] }

// занятие: 8 заданий ≈ 5 минут
const SESSION = 8

function shuffle<T>(items: T[]): T[] {
  const r = [...items]
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[r[i], r[j]] = [r[j], r[i]]
  }
  return r
}

function withDistractors(answer: string, pool: string[], count = 2): string[] {
  const others = shuffle([...new Set(pool)].filter((x) => x !== answer)).slice(0, count)
  return shuffle([answer, ...others])
}

function soundTasks(level: number): Task[] {
  const items = FIRST_LETTER[level]
  const letters = items.map((x) => x.word[0].toUpperCase())
  return shuffle(items)
    .slice(0, SESSION)
    .map((x) => {
      const answer = x.word[0].toUpperCase()
      return { kind: 'first', word: x.word, pic: x.pic, answer, options: withDistractors(answer, letters) }
    })
}

function syllableTasks(level: number): Task[] {
  const { cons, vowels } = SYLLABLES[level]
  const all: string[] = []
  for (const c of cons) for (const v of vowels) if (!NO_SUCH_SYLLABLE.includes(c + v)) all.push(c + v)
  const picked = shuffle(all).slice(0, SESSION)
  // сначала три «стыковки» (буква + буква = слог), потом поиск слога на слух
  const docks: Task[] = picked.slice(0, 3).map((s) => ({ kind: 'dock', c: s[0], v: s[1] }))
  const quizzes: Task[] = picked.slice(3).map((answer) => {
    // соседи отличаются одной буквой — иначе слог угадывается по первой букве
    const sameCons = shuffle(all.filter((s) => s[0] === answer[0] && s !== answer))[0]
    const sameVowel = shuffle(all.filter((s) => s[1] === answer[1] && s !== answer))[0]
    return { kind: 'pickSyl', answer, options: shuffle([answer, sameCons, sameVowel]) }
  })
  return [...docks, ...quizzes]
}

function wordTasks(level: number): Task[] {
  const pics = WORDS.flat().map((w) => w.pic)
  return shuffle(WORDS[level])
    .slice(0, SESSION)
    .map((w) => ({ kind: 'word', syl: w.syl, answer: w.pic, options: withDistractors(w.pic, pics) }))
}

function phraseTasks(level: number): Task[] {
  const pics = PHRASES[level].map((p) => p.pic)
  return shuffle(PHRASES[level])
    .slice(0, SESSION)
    .map((p) => ({
      kind: 'phrase',
      words: p.text.split(' '),
      answer: p.pic,
      options: p.wrong ? shuffle([p.pic, ...p.wrong]) : withDistractors(p.pic, pics),
    }))
}

// история читается по порядку, без перемешивания
function storyTasks(level: number): Task[] {
  const s = STORIES[level]
  return [
    ...s.pages.map((p): Task => ({ kind: 'page', words: p.text.split(' '), pic: p.pic })),
    { kind: 'question', text: s.ask, answer: s.answer, options: shuffle([s.answer, ...s.wrong]) },
  ]
}

export function buildTasks(stage: StageId, level: number): Task[] {
  if (stage === 'sounds') return soundTasks(level)
  if (stage === 'syllables') return syllableTasks(level)
  if (stage === 'words') return wordTasks(level)
  if (stage === 'phrases') return phraseTasks(level)
  return storyTasks(level)
}
