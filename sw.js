// Simple service worker for PWA offline support
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Only cache same-origin requests (static files, etc)
  if (url.origin === self.location.origin) {
    // Special logic for root URL ('/')
    if (url.pathname === '/') {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            // Update cache with latest index.html
            return caches.open('dynamic-v1').then(cache => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
          .catch(() => {
            // If fetch fails, return cached version if available
            return caches.match(event.request);
          })
      );
    }
    else {
      event.respondWith(
        caches.match(event.request).then(response => {
          return response || fetch(event.request).then(fetchResponse => {
            return caches.open('dynamic-v1').then(cache => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          });
        })
      );
    }
  }

  // and not the root URL (to avoid caching the index.html)
});

