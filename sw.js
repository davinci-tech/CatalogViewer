// public/sw.js
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

// Precache static assets (required for injectManifest)
precacheAndRoute(self.__WB_MANIFEST);
console.log('Custom Service Worker Loaded. Precaching assets...');

// NetworkFirst strategy for the root URL ('/')
registerRoute(
  ({ url }) => url.pathname === '/',
  new NetworkFirst({ cacheName: 'dynamic-v1' })
);