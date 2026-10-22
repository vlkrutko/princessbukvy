// Озвучка. Основной голос — заранее записанные файлы public/audio (нейросетевой
// женский голос, tools/make_audio.py). Текст, которого нет в записи, читает
// синтезатор устройства — он звучит грубее, поэтому это только запасной путь.
import manifest from './audio.json'
import { audioContext } from './sfx'

const files = manifest as Record<string, string>
const buffers = new Map<string, Promise<AudioBuffer>>()
let playing: AudioBufferSourceNode | null = null
// номер последнего вызова say(): запоздавшая загрузка не должна перебить более новую реплику
let latest = 0

function load(ac: AudioContext, file: string): Promise<AudioBuffer> {
  let buffer = buffers.get(file)
  if (!buffer) {
    buffer = fetch(`audio/${file}`)
      .then((resp) => {
        if (!resp.ok) throw new Error(`audio ${file}: ${resp.status}`)
        return resp.arrayBuffer()
      })
      .then((data) => ac.decodeAudioData(data))
    buffer.catch(() => buffers.delete(file))
    buffers.set(file, buffer)
  }
  return buffer
}

const synth = 'speechSynthesis' in window ? window.speechSynthesis : null
let voice: SpeechSynthesisVoice | null = null

function pickVoice() {
  if (!synth) return
  const ru = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith('ru'))
  voice = ru.find((v) => /milena|милена|katya|катя/i.test(v.name)) ?? ru[0] ?? null
}

if (synth) {
  pickVoice()
  // список голосов на iOS приходит не сразу
  synth.addEventListener?.('voiceschanged', pickVoice)
}

function synthSay(text: string, rate: number) {
  if (!synth) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ru-RU'
  if (voice) u.voice = voice
  u.rate = rate
  synth.speak(u)
}

// Ждём, пока iOS разбудит контекст (resume из жеста завершается не мгновенно).
async function running(ac: AudioContext): Promise<boolean> {
  if (ac.state === 'running') return true
  await Promise.race([ac.resume().catch(() => undefined), new Promise((r) => setTimeout(r, 400))])
  return (ac.state as string) === 'running'
}

// Запасной путь, если Web Audio так и не проснулся: медиа-элемент (на iOS он играет
// и в беззвучном режиме), а если и ему не дали играть — синтезатор.
let element: HTMLAudioElement | null = null

function playElement(file: string, text: string, rate: number) {
  element = new Audio(`audio/${file}`)
  element.play().catch(() => synthSay(text, rate))
}

/** rate действует только на синтезатор: темп записей задан при их создании. */
export function say(text: string, rate = 0.85) {
  const call = ++latest
  playing?.stop()
  playing = null
  element?.pause()
  element = null
  synth?.cancel()

  const file = files[text.toLowerCase()]
  const ac = audioContext()
  if (!file) return synthSay(text, rate)
  if (!ac) return playElement(file, text, rate)

  load(ac, file)
    .then(async (buffer) => {
      if (call !== latest) return
      if (!(await running(ac))) {
        if (call === latest) playElement(file, text, rate)
        return
      }
      if (call !== latest) return
      const source = ac.createBufferSource()
      source.buffer = buffer
      source.connect(ac.destination)
      source.start()
      playing = source
    })
    .catch(() => {
      if (call === latest) synthSay(text, rate)
    })
}
