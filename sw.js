const ARCADIA_VERSION = "19.30.2.0";
const CACHE_NAME = `arcadia-${ARCADIA_VERSION}`;
const APP_SHELL = [
  "./",
  "index.html",
  "style.css",
  "script.js",
  "fruit-ninja.js",
  "sm-kart-zx.js",
  "super-mario-bros.js",
  "hello-kitty-world.js",
  "xtreme-racing.js",
  "manifest.webmanifest",
  "app-version.json",
  "assets/images/games/stack.png",
  "assets/images/games/flappybird.png",
  "assets/images/games/crossyroad.png",
  "assets/images/games/solitaire.png",
  "assets/images/games/fruitblend.png",
  "assets/images/games/fruitninja-icon.png",
  "assets/images/games/super-mario-kart-zx.png",
  "assets/images/games/super-mario-bros.png",
  "assets/images/games/hello-kitty-world.png",
  "assets/images/games/xtreme-racing.png",
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
  "assets/themesong/games/fruit-blend-1.mp3",
  "assets/themesong/games/fruit-blend-2.mp3",
  "assets/themesong/games/fruit-ninja.ogg",
  "assets/audio/sfx/fruit-ninja/cut.wav",
  "assets/audio/sfx/crossy-road/crash.mp3",
  "games/sm-kart-zx/index.html",
  "games/super-mario-bros/index.html",
  "games/super-mario-bros/arcadia-wrapper.js",
  "games/xtreme-racing/index.html",
  "games/xtreme-racing/manifest.webmanifest",
  "games/xtreme-racing/LICENSE",
  "games/xtreme-racing/assets/index-9JzJTszz.css",
  "games/xtreme-racing/assets/index-Dmj1DEJW.js"
];
const KART_RUNTIME_ASSETS = [
  "games/sm-kart-zx/runner.js",
  "games/sm-kart-zx/runner.wasm",
  "games/sm-kart-zx/runner.data",
  "games/sm-kart-zx/game.unx",
  "games/sm-kart-zx/audio-worklet.js",
  "games/sm-kart-zx/runner.json",
  "games/sm-kart-zx/fnames"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.allSettled([
        cache.addAll(APP_SHELL),
        ...KART_RUNTIME_ASSETS.map((asset) => cache.add(asset))
      ]))
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
    const cleanUrl = new URL(request.url);
    cleanUrl.search = "";
    return await cache.match(request) || await cache.match(cleanUrl.href) || await cache.match("index.html");
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
