// Cache only the offline fallback. Never cache private messages or app responses.
const CACHE = 'hobbybff-offline-v2'
const offlineUrl = new URL('offline.html', self.registration.scope).href
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(offlineUrl)))
  self.skipWaiting()
})
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(offlineUrl)))
  }
})
