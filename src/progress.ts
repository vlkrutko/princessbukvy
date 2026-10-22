import type { StageId } from './content'

// Лучший результат (1–3 звезды) по каждому уровню; живёт в браузере этого устройства.
const KEY = 'princessbukvy_progress_v1'

export type Progress = Record<string, number>

export function loadProgress(): Progress {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Progress
  } catch {
    return {}
  }
}

export function starsOf(p: Progress, stage: StageId, level: number): number {
  return p[`${stage}:${level}`] ?? 0
}

export function saveStars(stage: StageId, level: number, stars: number) {
  const p = loadProgress()
  const key = `${stage}:${level}`
  if ((p[key] ?? 0) >= stars) return
  p[key] = stars
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    // приватный режим Safari: прогресс просто не сохранится
  }
}
