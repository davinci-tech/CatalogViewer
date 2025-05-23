// /sync/sw.js
// This service worker will be used for periodic background sync logic.

self.addEventListener('activate', async (event) => {
  event.waitUntil((async () => {
    if ('periodicSync' in registration) {
      try {
        const tags = await registration.periodicSync.getTags();
        if (!tags.includes('sync-state')) {
          await registration.periodicSync.register('sync-state', {
            minInterval: 5 * 60, // 5 minutes in seconds
          });
        }
      } catch (e) {
        // Periodic background sync not supported or permission denied
      }
    }
  })());
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sync-state') {
    event.waitUntil((async () => {
      const StateManager = await import('/sync/state-manager.js');
      
      // TODO: Add your background sync logic here
      // Example: fetch('/api/sync-state')
      console.log('Periodic background sync: sync-state triggered');
      console.log(await StateManager.getRemoteState());
    })());
  }
});
