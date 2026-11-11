// Offline cache for the app's own files. Firestore traffic (other origins) is never touched.
// The page itself is fetched fresh when online, so updates arrive without bumping anything here.
const CACHE = "scopa-v2";
const CORE = ["./", "index.html", "firebase.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];
const SUITS = ["denari", "coppe", "spade", "bastoni"], RANKS = ["asso", "02", "03", "04", "05", "06", "07", "fante", "cavallo", "re"];
const CARDS = ["cards/dorso.webp", ...SUITS.flatMap(s => RANKS.map(r => `cards/${s}-${r}.webp`))];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([...CORE, ...CARDS])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin || url.searchParams.has("build-check")) return;
  const isPage = req.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith(".html");
  if (isPage || url.pathname.endsWith("firebase.js")){
    // Network first: always the latest game when online, the cached copy when not.
    e.respondWith(fetch(req, { cache: "no-cache" }).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("index.html"))));
  } else {
    // Cards and icons never change: cache first.
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })));
  }
});
