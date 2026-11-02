// Penyimpan offline: semua file game disimpan saat pemasangan, lalu game selalu dibuka dari simpanan ini.
// aa78108733 dan ["./", "art.js", "art2.js", "art3.js", "art4.js", "art5.js", "audio.js", "carnival.js", "data.js", "drum.js", "extras.js", "features.js", "flower.js", "fonts/andika-614248ee.woff2", "fonts/andika-bold-614248ee.woff2", "fonts/kosugi-7a728e56.woff2", "fonts/zcool-0-977b9a3b.woff2", "fonts/zcool-1-fb77d5c0.woff2", "fonts/zcool-2-a36f0f99.woff2", "game.js", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "lang.js", "manifest.webmanifest", "market.js", "music.js", "pwa.js", "rocket.js", "salon.js", "scenes.js", "scenes2.js", "scenes3.js", "seasons.js", "station.js", "story.js", "sushi.js", "ui.js", "workshop.js"] diisi oleh tools/build_pwa.py; versi baru = isi file berubah.
const CACHE = 'desa-russel-aa78108733';
const FILES = ["./", "art.js", "art2.js", "art3.js", "art4.js", "art5.js", "audio.js", "carnival.js", "data.js", "drum.js", "extras.js", "features.js", "flower.js", "fonts/andika-614248ee.woff2", "fonts/andika-bold-614248ee.woff2", "fonts/kosugi-7a728e56.woff2", "fonts/zcool-0-977b9a3b.woff2", "fonts/zcool-1-fb77d5c0.woff2", "fonts/zcool-2-a36f0f99.woff2", "game.js", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "lang.js", "manifest.webmanifest", "market.js", "music.js", "pwa.js", "rocket.js", "salon.js", "scenes.js", "scenes2.js", "scenes3.js", "seasons.js", "station.js", "story.js", "sushi.js", "ui.js", "workshop.js"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('desa-russel-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, { ignoreSearch: true });
    if (hit) return hit;
    if (e.request.mode === 'navigate') return c.match('./');
    return fetch(e.request);
  }));
});
