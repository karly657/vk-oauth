/* global self */
/* eslint no-restricted-globals: ["error"] */

const CACHE = 'cache';
const waitHours = 2;
let lastRequestTime = new Date();

const staticAssets = [
  './',
  './static/js/bundle.js',
  './static/js/0.chunk.js',
  './static/js/main.chunk.js',
];

self.addEventListener('install', async event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(staticAssets)));
});

this.addEventListener('fetch', event => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(resp => {
      const newRequestTime = new Date();
      if (parseInt((newRequestTime - lastRequestTime) / 1000 / 60 / 60) <= waitHours) {
        lastRequestTime = newRequestTime;
        return (
          resp || fetch(req).then(response =>
            caches.open(CACHE).then(cache => {
              cache.put(req, response.clone());
              return response;
            })
          )
        );
      };

      return (
        fetch(req).then(response =>
          caches.open(CACHE).then(cache => {
            cache.put(req, response.clone());
            return response;
          })
        )
      );
    })
  );
});
