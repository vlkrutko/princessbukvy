import { useState } from 'react'
import { STAGES, type Stage, type StageId } from './content'
import { loadProgress, starsOf, type Progress } from './progress'
import { Play } from './Play'

type Screen =
  | { name: 'home' }
  | { name: 'levels'; stage: StageId }
  | { name: 'play'; stage: StageId; level: number }

function stageStars(p: Progress, s: Stage): number {
  return s.levels.reduce((sum, _, level) => sum + starsOf(p, s.id, level), 0)
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  // читается при каждом рендере: после занятия звёзды сразу видны на карте
  const progress = loadProgress()

  if (screen.name === 'play') {
    return (
      <Play
        stage={screen.stage}
        level={screen.level}
        onExit={() => setScreen({ name: 'levels', stage: screen.stage })}
      />
    )
  }

  if (screen.name === 'levels') {
    const stage = STAGES.find((s) => s.id === screen.stage)!
    return (
      <div className="screen">
        <div className="topbar">
          <button className="round" onClick={() => setScreen({ name: 'home' })}>
            ←
          </button>
          <h2>
            {stage.pic} {stage.title}
          </h2>
          <span className="round ghost" />
        </div>
        <div className="levels">
          {stage.levels.map((label, level) => {
            const stars = starsOf(progress, stage.id, level)
            return (
              <button key={level} className="level" onClick={() => setScreen({ name: 'play', stage: stage.id, level })}>
                <span className="level-num">{level + 1}</span>
                <span className="level-label">{label}</span>
                <span className="level-stars">
                  {'⭐'.repeat(stars)}
                  <span className="dim">{'⭐'.repeat(3 - stars)}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const total = STAGES.reduce((sum, s) => sum + stageStars(progress, s), 0)
  return (
    <div className="screen">
      <h1 className="title">👸 Принцессобуквы</h1>
      <div className="total">✨ {total}</div>
      <div className="kingdoms">
        {STAGES.map((s) => {
          const locked = s.levels.length === 0
          return (
            <button
              key={s.id}
              className={'kingdom' + (locked ? ' locked' : '')}
              disabled={locked}
              onClick={() => setScreen({ name: 'levels', stage: s.id })}
            >
              <span className="kingdom-pic">{s.pic}</span>
              <span className="kingdom-title">{s.title}</span>
              <span className="kingdom-stars">
                {locked ? '🔒' : `⭐ ${stageStars(progress, s)} / ${s.levels.length * 3}`}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
