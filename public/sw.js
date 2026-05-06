/* ══════════════════════════════════════════════════════
   sw.js — Service Worker SMK Binatama Absensi
   Strategy:
   • Static assets  → Cache First
   • API calls      → Network First (fallback ke cache)
   • Offline page   → Cache fallback jika network mati
══════════════════════════════════════════════════════ */

const CACHE_NAME     = 'smk-absensi-v2'
const API_CACHE_NAME = 'smk-api-v2'

// File yang di-cache saat install (app shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
]

// ── Install: cache app shell ──────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()) // langsung aktif tanpa menunggu tab lama tutup
  )
})

// ── Activate: hapus cache lama ────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...')
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== API_CACHE_NAME)
          .map(k => {
            console.log('[SW] Deleting old cache:', k)
            return caches.delete(k)
          })
      )
    ).then(() => self.clients.claim())
  )
})

// ── Fetch: strategi per tipe request ─────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip request non-GET
  if (request.method !== 'GET') return

  // Skip request ke API backend → Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstAPI(request))
    return
  }

  // Skip request browser extension / chrome-extension
  if (!url.protocol.startsWith('http')) return

  // Static assets → Cache First
  event.respondWith(cacheFirstStatic(request))
})

/* ── Cache First — untuk static assets ──────────────── */
async function cacheFirstStatic(request) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    // Cache hanya response sukses
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    // Offline: coba fallback ke index.html (SPA routing)
    const fallback = await caches.match('/index.html')
    if (fallback) return fallback

    // Fallback ke halaman offline
    const offline = await caches.match('/offline.html')
    return offline || new Response('Offline', { status: 503 })
  }
}

/* ── Network First — untuk API calls ────────────────── */
async function networkFirstAPI(request) {
  try {
    const response = await fetch(request)
    // Cache response GET API yang berhasil
    if (response.ok) {
      const cache = await caches.open(API_CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    // Offline: gunakan cache API terakhir
    const cached = await caches.match(request)
    if (cached) return cached

    return new Response(
      JSON.stringify({ message: 'Tidak ada koneksi internet. Data mungkin tidak terbaru.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// ── Push Notification (opsional) ─────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return
  const data = event.data.json()
  self.registration.showNotification(data.title || 'SMK Binatama', {
    body:    data.body  || 'Ada notifikasi baru',
    icon:    '/icons/icon-192x192.png',
    badge:   '/icons/icon-72x72.png',
    tag:     data.tag   || 'smk-notif',
    data:    data.url   || '/',
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  )
})