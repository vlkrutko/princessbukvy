import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { unlockAudio } from './sfx'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// iOS разрешает звук только из жеста: будим аудиоконтекст на каждом нажатии (после блокировки
// экрана он снова засыпает), иначе реплика, произносимая с задержкой после нажатия, осталась бы
// немой. capture — чтобы это случилось раньше обработчиков кнопок. pointerdown не годится:
// на iOS касание пальцем жестом для звука не считается (см. sfx.ts).
for (const event of ['touchend', 'click', 'keydown']) {
  window.addEventListener(event, unlockAudio, { capture: true, passive: true })
}

// офлайн-кэш только в собранной версии: в dev он мешал бы видеть свежие правки
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('sw.js')
  })
}
