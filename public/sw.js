// Офлайн-кэш: отдаём из кэша сразу и в фоне обновляем его из сети.
// Новая версия приложения поэтому появляется со ВТОРОГО запуска после выкладки.
// Работает только по HTTPS (или localhost) — по http из домашней сети браузер его не включит.
const CACHE = 'princessbukvy-v1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request)
      const fresh = fetch(e.request)
        .then((resp) => {
          if (resp.ok) cache.put(e.request, resp.clone())
          return resp
        })
        .catch(() => cached)
      return cached || fresh
    }),
  )
})
