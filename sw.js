// Service worker do Banco Sub-15 — cache local para funcionar 100% offline.
//
// IMPORTANTE: sempre que a app for atualizada (novo conteúdo do index.html),
// muda o nome do CACHE abaixo (ex.: 'banco-sub15-v3') para forçar o telemóvel
// a ir buscar a versão nova. Sem isto, o telemóvel continua a mostrar a
// versão antiga guardada em cache.
const CACHE = "banco-sub15-v16";
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

// Exceção: plantel.csv nunca passa pela cache — vai sempre à rede, para a
// sincronização do plantel ver logo a versão mais recente editada no GitHub.
//
// Página principal (navegação — abrir/reabrir a app): tenta SEMPRE a rede
// primeiro. Isto é o que resolve o problema de "abro a app e ainda vejo a
// versão antiga depois de fazer deploy": com cache-primeiro, o telemóvel
// podia continuar a mostrar a versão antiga indefinidamente mesmo com rede
// disponível, porque só atualizava a cache em segundo plano *depois* de já
// ter mostrado a versão velha. Com rede-primeiro, a app abre sempre com o
// conteúdo mais recente quando há sinal, e só usa a cópia em cache quando
// está mesmo offline.
//
// Restantes ficheiros (ícones, manifest): continuam cache-primeiro, com
// atualização em segundo plano — são estáticos, raramente mudam, e assim a
// app abre instantaneamente mesmo com rede lenta.
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  if (event.request.url.indexOf("plantel.csv") > -1) {
    event.respondWith(fetch(event.request));
    return;
  }

  var isNavigation = event.request.mode === "navigate" || event.request.destination === "document";
  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then(function (resp) {
          if (resp && resp.status === 200) {
            var copy = resp.clone();
            caches.open(CACHE).then(function (cache) { cache.put(event.request, copy); });
          }
          return resp;
        })
        .catch(function () { return caches.match(event.request); })
    );
    return;
  }

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
