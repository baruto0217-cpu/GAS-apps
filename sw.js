// Service Worker — 救急 GASアプリ入口
const CACHE_PREFIX = 'gasapps-';
const CACHE_NAME = CACHE_PREFIX + 'v3';
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(
    ks.filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME).map(k => caches.delete(k))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE_NAME).then(c => c.match(e.request, { ignoreSearch: true }).then(hit =>
    hit || fetch(e.request).then(r => { if (r.ok && r.type === 'basic') c.put(e.request, r.clone()); return r; })
  )));
});
