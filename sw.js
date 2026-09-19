// Service worker do Banco Sub-15 — cache local para funcionar 100% offline.
//
// IMPORTANTE: sempre que a app for atualizada (novo conteúdo do index.html),
// muda o nome do CACHE abaixo (ex.: 'banco-sub15-v3') para forçar o telemóvel
// a ir buscar a versão nova. Sem isto, o telemóvel continua a mostrar a
// versão antiga guardada em cache.
const CACHE = "banco-sub15-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

// Estratégia: responde da cache imediatamente (rápido, funciona offline) e,
// se houver rede, atualiza a cache em segundo plano para a próxima vez.
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  var isOwnOrigin = event.request.url.indexOf(self.location.origin) === 0;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var network = fetch(event.request).then(function (resp) {
        if (isOwnOrigin && resp && resp.status === 200) {
          var copy = resp.clone();
          caches.open(CACHE).then(function (cache) { cache.put(event.request, copy); });
        }
        return resp;
      }).catch(function () { return cached; });
      return cached || network;
    })
  );
});
