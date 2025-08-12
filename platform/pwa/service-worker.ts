const CACHE = 'v1';
const ASSETS = ['/'];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request)),
  );
});
