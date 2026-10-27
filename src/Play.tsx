import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  buildTasks,
  firstLetterPrompt,
  NO,
  PRAISE,
  scramble,
  spoken,
  syllabify,
  VOWELS,
  YES,
  type StageId,
  type Task,
} from './content'
import { saveStars } from './progress'
import { say } from './speech'
import { bad, good, win } from './sfx'

/** Гласные малиновые, согласные голубые — как в школьных схемах слова. */
export function Colored({ text }: { text: string }) {
  return (
    <>
      {[...text].map((ch, k) => (
        <span key={k} className={VOWELS.includes(ch.toUpperCase()) ? 'v' : /[а-яё]/i.test(ch) ? 'c' : ''}>
          {ch}
        </span>
      ))}
    </>
  )
}

/** Картинка-ответ; составные (несколько предметов) рисуются мельче, чтобы три варианта влезли в ряд. */
function Pic({ pic }: { pic: string }) {
  const combo = [...pic.replace(/️/g, '')].length > 1
  return <span className={'emoji' + (combo ? ' sm' : '')}>{pic}</span>
}

/** Строка слов. Нажатие на слово — подсказка: оно делится на слоги и произносится. gap — пустое место вместо слова. */
function WordsLine({ words, gap }: { words: string[]; gap?: number }) {
  const [split, setSplit] = useState<number[]>([])
  return (
    <div className="line">
      {words.map((w, k) =>
        k === gap ? (
          <span key={k} className="tile sm slot" />
        ) : (
          <button
            key={k}
            className="tile sm"
            onClick={() => {
              setSplit((s) => (s.includes(k) ? s : [...s, k]))
              say(spoken(w), 0.7)
            }}
          >
            {split.includes(k) ? (
              syllabify(w).map((s, n) => (
                <span key={n} className="syl">
                  <Colored text={s} />
                </span>
              ))
            ) : (
              <Colored text={w} />
            )}
          </button>
        ),
      )}
    </div>
  )
}

// Произнести задание при появлении. Задержка — чтобы не оборвать отклик на прошлый ответ.
function useSayOnMount(speak: () => void) {
  useEffect(() => {
    const id = setTimeout(speak, 450)
    return () => clearTimeout(id)
  }, [])
}

interface ChoicesProps {
  options: string[]
  answer: string
  render: (option: string) => ReactNode
  onMistake: () => void
  onSolved: () => void
  onCorrect?: () => void
  /** words — варианты-слова: шрифт мельче, чтобы длинные слова влезли */
  className?: string
}

/** Варианты ответа: неверный гаснет и можно пробовать дальше, верный ведёт к следующему заданию. */
function Choices({ options, answer, render, onMistake, onSolved, onCorrect, className }: ChoicesProps) {
  const [wrong, setWrong] = useState<string[]>([])
  const [solved, setSolved] = useState(false)

  const pick = (option: string) => {
    if (solved) return
    if (option === answer) {
      setSolved(true)
      good()
      onCorrect?.()
      setTimeout(onSolved, 1300)
    } else {
      setWrong((w) => [...w, option])
      bad()
      onMistake()
    }
  }

  return (
    <div className={'choices' + (className ? ' ' + className : '')}>
      {options.map((o) => (
        <button
          key={o}
          className={'choice' + (solved && o === answer ? ' ok' : '') + (wrong.includes(o) ? ' wrong' : '')}
          disabled={wrong.includes(o)}
          onClick={() => pick(o)}
        >
          {render(o)}
        </button>
      ))}
    </div>
  )
}

interface TaskProps<K extends Task['kind']> {
  t: Extract<Task, { kind: K }>
  onMistake: () => void
  onSolved: () => void
}

function FirstLetter({ t, onMistake, onSolved }: TaskProps<'first'>) {
  const ask = () => say(firstLetterPrompt(t.word))
  useSayOnMount(ask)
  return (
    <>
      <button className="prompt" onClick={ask}>
        <span className="prompt-pic">{t.pic}</span>
        <span className="ear">🔊</span>
      </button>
      <Choices
        options={t.options}
        answer={t.answer}
        render={(o) => <Colored text={o} />}
        onMistake={onMistake}
        onSolved={onSolved}
      />
    </>
  )
}

function Dock({ t, onSolved }: TaskProps<'dock'>) {
  const [merged, setMerged] = useState(false)
  const syllable = t.c + t.v
  const speak = () => say(syllable.toLowerCase(), 0.7)
  return (
    <>
      {merged ? (
        <button className="tile big pop" onClick={speak}>
          <Colored text={syllable} />
        </button>
      ) : (
        <div className="dock">
          <span className="tile">
            <Colored text={t.c} />
          </span>
          <span className="plus">+</span>
          <button className="tile" onClick={() => say(t.v.toLowerCase(), 0.7)}>
            <Colored text={t.v} />
          </button>
        </div>
      )}
      <button
        className="go"
        onClick={() => {
          if (merged) return onSolved()
          setMerged(true)
          speak()
        }}
      >
        {merged ? '➜' : '✨'}
      </button>
    </>
  )
}

function PickSyllable({ t, onMistake, onSolved }: TaskProps<'pickSyl'>) {
  const ask = () => say(t.answer.toLowerCase(), 0.7)
  useSayOnMount(ask)
  return (
    <>
      <button className="prompt" onClick={ask}>
        <span className="prompt-pic">🔊</span>
      </button>
      <Choices
        options={t.options}
        answer={t.answer}
        render={(o) => <Colored text={o} />}
        onMistake={onMistake}
        onSolved={onSolved}
      />
    </>
  )
}

function ReadWord({ t, onMistake, onSolved }: TaskProps<'word'>) {
  // слово целиком звучит только ПОСЛЕ ответа: иначе его можно узнать на слух, не читая
  return (
    <>
      <div className="word">
        {t.syl.map((s, k) => (
          <button key={k} className="tile" onClick={() => say(s.toLowerCase(), 0.7)}>
            <Colored text={s} />
          </button>
        ))}
      </div>
      <Choices
        options={t.options}
        answer={t.answer}
        render={(o) => <Pic pic={o} />}
        onMistake={onMistake}
        onSolved={onSolved}
        onCorrect={() => say(t.syl.join('').toLowerCase())}
      />
    </>
  )
}

function ReadPhrase({ t, onMistake, onSolved }: TaskProps<'phrase'>) {
  return (
    <>
      <WordsLine words={t.words} />
      <Choices
        options={t.options}
        answer={t.answer}
        render={(o) => <Pic pic={o} />}
        onMistake={onMistake}
        onSolved={onSolved}
        onCorrect={() => say(t.words.join(' ').toLowerCase())}
      />
    </>
  )
}

// Страница истории: сначала читает сама, по ✨ — картинка и предложение вслух, потом дальше.
function StoryPage({ t, onSolved }: TaskProps<'page'>) {
  const [shown, setShown] = useState(false)
  return (
    <>
      <div className={'page-pic' + (shown ? ' pop' : ' hidden')}>{shown ? t.pic : '❔'}</div>
      <WordsLine words={t.words} />
      <button
        className="go"
        onClick={() => {
          if (shown) return onSolved()
          setShown(true)
          say(t.words.join(' ').toLowerCase())
        }}
      >
        {shown ? '➜' : '✨'}
      </button>
    </>
  )
}

// Сборка по картинке: верная следующая часть встаёт на место, неверная качается.
// Собранное слово (фразу) произносим целиком только в конце — иначе можно не читать.
function Build({ t, onMistake, onSolved }: TaskProps<'build'>) {
  const pool = useMemo(() => scramble(t.parts), [t])
  const [used, setUsed] = useState<number[]>([])
  const [shaking, setShaking] = useState<number | null>(null)
  const done = used.length === t.parts.length
  const size = t.phrase ? ' sm' : ''

  const tap = (k: number) => {
    if (done || used.includes(k)) return
    if (pool[k] !== t.parts[used.length]) {
      bad()
      onMistake()
      setShaking(k)
      setTimeout(() => setShaking(null), 400)
      return
    }
    const next = [...used, k]
    setUsed(next)
    if (next.length === t.parts.length) {
      good()
      say(t.parts.join(t.phrase ? ' ' : '').toLowerCase())
      setTimeout(onSolved, 1800)
    } else if (!t.phrase && pool[k].length > 1) {
      say(pool[k].toLowerCase(), 0.7) // отдельную букву не озвучиваем: синтезатор назовёт её «тэ», а не звук
    }
  }

  return (
    <>
      <div className="page-pic">{t.pic}</div>
      <div className={t.phrase ? 'line' : 'word'}>
        {t.parts.map((part, k) => (
          <span key={k} className={'tile slot' + size + (k < used.length ? ' filled pop' : '')}>
            {k < used.length && <Colored text={part} />}
          </span>
        ))}
      </div>
      <div className={t.phrase ? 'line' : 'word'}>
        {pool.map((part, k) => (
          <button
            key={k}
            className={'tile' + size + (used.includes(k) ? ' gone' : '') + (shaking === k ? ' shake' : '')}
            disabled={used.includes(k)}
            onClick={() => tap(k)}
          >
            <Colored text={part} />
          </button>
        ))}
      </div>
    </>
  )
}

function PickWord({ t, onMistake, onSolved }: TaskProps<'pickWord'>) {
  return (
    <>
      <div className="prompt-pic">{t.pic}</div>
      <Choices
        className="words"
        options={t.options}
        answer={t.answer}
        render={(o) => <Colored text={o} />}
        onMistake={onMistake}
        onSolved={onSolved}
        onCorrect={() => say(t.answer.toLowerCase())}
      />
    </>
  )
}

function Gap({ t, onMistake, onSolved }: TaskProps<'gap'>) {
  const [filled, setFilled] = useState(false)
  return (
    <>
      <div className="page-pic">{t.pic}</div>
      <WordsLine words={t.words} gap={filled ? undefined : t.gap} />
      <Choices
        className="words"
        options={t.options}
        answer={t.words[t.gap]}
        render={(o) => <Colored text={o} />}
        onMistake={onMistake}
        onSolved={onSolved}
        onCorrect={() => {
          setFilled(true)
          say(t.words.join(' ').toLowerCase())
        }}
      />
    </>
  )
}

// Подходит ли картинка к фразе: 👍 или 👎.
function YesNo({ t, onMistake, onSolved }: TaskProps<'yesNo'>) {
  return (
    <>
      <div className="page-pic">{t.pic}</div>
      <WordsLine words={t.words} />
      <Choices
        options={[YES, NO]}
        answer={t.answer}
        render={(o) => <span className="emoji">{o}</span>}
        onMistake={onMistake}
        onSolved={onSolved}
        onCorrect={() => say(t.words.join(' ').toLowerCase())}
      />
    </>
  )
}

function Question({ t, onMistake, onSolved }: TaskProps<'question'>) {
  const ask = () => say(t.text)
  useSayOnMount(ask)
  return (
    <>
      <button className="question" onClick={ask}>
        {t.text} 🔊
      </button>
      <Choices
        options={t.options}
        answer={t.answer}
        render={(o) => <Pic pic={o} />}
        onMistake={onMistake}
        onSolved={onSolved}
      />
    </>
  )
}

export function Play({ stage, level, onExit }: { stage: StageId; level: number; onExit: () => void }) {
  const [run, setRun] = useState(0)
  // run в зависимостях: «ещё раз» перемешивает задания заново
  const tasks = useMemo(() => buildTasks(stage, level), [stage, level, run])
  const [index, setIndex] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [stars, setStars] = useState<number | null>(null)

  const onMistake = () => setMistakes((m) => m + 1)
  const onSolved = () => {
    if (index + 1 < tasks.length) return setIndex(index + 1)
    const earned = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1
    saveStars(stage, level, earned)
    setStars(earned)
    win()
    say(PRAISE)
  }

  if (stars !== null) {
    return (
      <div className="screen center">
        <div className="finish-stars">
          {'⭐'.repeat(stars)}
          <span className="dim">{'⭐'.repeat(3 - stars)}</span>
        </div>
        <h1 className="title">{PRAISE}</h1>
        <div className="row">
          <button
            className="go"
            onClick={() => {
              setRun(run + 1)
              setIndex(0)
              setMistakes(0)
              setStars(null)
            }}
          >
            🔁
          </button>
          <button className="go" onClick={onExit}>
            🏠
          </button>
        </div>
      </div>
    )
  }

  const t = tasks[index]
  const props = { onMistake, onSolved }
  return (
    <div className="screen">
      <div className="topbar">
        <button className="round" onClick={onExit}>
          ✕
        </button>
        <div className="dots">
          {tasks.map((_, k) => (
            <span key={k} className={'dot' + (k < index ? ' done' : k === index ? ' current' : '')} />
          ))}
        </div>
        <span className="round ghost" />
      </div>
      {/* key: новое задание — новое состояние (погашенные варианты не переезжают) */}
      <div className="task" key={`${run}:${index}`}>
        {t.kind === 'first' && <FirstLetter t={t} {...props} />}
        {t.kind === 'dock' && <Dock t={t} {...props} />}
        {t.kind === 'pickSyl' && <PickSyllable t={t} {...props} />}
        {t.kind === 'word' && <ReadWord t={t} {...props} />}
        {t.kind === 'phrase' && <ReadPhrase t={t} {...props} />}
        {t.kind === 'page' && <StoryPage t={t} {...props} />}
        {t.kind === 'question' && <Question t={t} {...props} />}
        {t.kind === 'build' && <Build t={t} {...props} />}
        {t.kind === 'pickWord' && <PickWord t={t} {...props} />}
        {t.kind === 'gap' && <Gap t={t} {...props} />}
        {t.kind === 'yesNo' && <YesNo t={t} {...props} />}
      </div>
    </div>
  )
}
