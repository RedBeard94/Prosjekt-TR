/* Enkel service worker for Diabetes-sidene: lagrer siden og filene på telefonen, så den åpner uten nett. */
var CACHE = 'diabetes-v6';
var FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "tallerken/index.html", "mat-og-blodsukker/index.html", "manualer/index.html", "rettigheter/index.html", "info/index.html", "trendpiler/index.html", "innstillinger/index.html", "tallene/index.html", "nyttig-info/index.html", "../../fonts/manrope-latin-200-normal.woff2", "../../fonts/manrope-latin-400-normal.woff2", "../../fonts/manrope-latin-600-normal.woff2", "../../fonts/manrope-latin-800-normal.woff2"];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') {
    /* Siden: prøv nettet først, så du får siste versjon. Uten nett brukes den lagrede. */
    e.respondWith(fetch(r).then(function (res) {
      var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, copy); }); return res;
    }).catch(function () { return caches.match(r).then(function (m) { return m || caches.match('./'); }); }));
    return;
  }
  e.respondWith(caches.match(r).then(function (m) {
    return m || fetch(r).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, copy); }); }
      return res;
    });
  }));
});
