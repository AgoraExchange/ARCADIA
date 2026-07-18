const ARCADIA_VERSION = "19.7.5.29";
const CACHE_NAME = `arcadia-${ARCADIA_VERSION}`;
const APP_SHELL = [
  "./",
  "index.html",
  "style.css",
  "script.js",
  "manifest.webmanifest",
  "app-version.json",
  "assets/images/games/stack.png",
  "assets/images/games/flappybird.png",
  "assets/images/games/crossyroad.png",
  "assets/images/games/solitaire.png",
  "assets/images/arcadia-logo-180.png",
  "assets/images/arcadia-logo-192.png",
  "assets/images/arcadia-logo-512.png",
  "assets/themesong/games/stack.mp3",
  "assets/themesong/games/stack-2.mp3",
  "assets/themesong/games/stack-3.mp3",
  "assets/themesong/games/flappy-bird.mp3",
  "assets/themesong/games/crossy-road-street.mp3",
  "assets/themesong/games/solitaire-1.mp3",
  "assets/themesong/games/solitaire-2.mp3",
  "assets/audio/sfx/crossy-road/crash.mp3"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => undefined)
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("arcadia-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate" || ["script", "style", "worker"].includes(request.destination)) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request, { cache: "no-store" });
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return await cache.match(request) || await cache.match("index.html");
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}
