/* ============================================================
   service-worker.js — makes AgriLink work offline.
   Once the app is installed, everything it needs is cached,
   so it opens even when the farm has no signal.
============================================================ */

const CACHE_NAME = "agrilink-v22";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/planner.js",
  "./js/community.js",
  "./js/app.js",
  "./js/problems.js",
  "./assets/logo-mark.png",
  "./assets/fonts/barlow-400.woff2",
  "./assets/fonts/barlow-500.woff2",
  "./assets/fonts/barlow-600.woff2",
  "./assets/fonts/barlow-700.woff2",
  "./assets/fonts/barlow-condensed-500.woff2",
  "./assets/fonts/barlow-condensed-600.woff2",
  "./assets/fonts/barlow-condensed-700.woff2",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
];

// First visit: save all the app files.
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});

// Clean up old caches when we update the app.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Every request: use the cache for app files, but always go online
// for live weather (so it stays fresh when there IS a connection).
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("open-meteo.com")) return; // let the browser handle it
  event.respondWith(
    // ignoreSearch so "styles.css?v=21" still matches the cached "styles.css"
    caches.match(event.request, { ignoreSearch: true }).then((cached) => cached || fetch(event.request))
  );
});
