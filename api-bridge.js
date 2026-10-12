/**
 * Ragetech Platform — Cross-Tab Synchronization & Cache Sanitizer (api-bridge.js)
 * Native Direct Database Mode:
 * All API calls (/api/*) go directly to the Cloudflare Worker & D1 Database.
 * No mock persistence, no fake local storage overrides, no zombie datasets.
 */

(function () {
  'use strict';

  // 1. Immediately purge any legacy ghost local storage overrides
  try {
    localStorage.removeItem('ragetech_custom_projects');
    localStorage.removeItem('ragetech_custom_developers');
    localStorage.removeItem('ragetech_deleted_projects');
    localStorage.removeItem('ragetech_deleted_developers');
    
    // Purge any individual project override keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ragetech_project_')) {
        localStorage.removeItem(key);
      }
    }
  } catch (e) {}

  // 2. Real-time Cross-Tab & Inter-Window Synchronization Engine
  const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('ragetech_realtime_sync') : null;
  const syncListeners = new Set();

  window.RagetechSync = {
    broadcast(event) {
      if (syncChannel) {
        try { syncChannel.postMessage(event); } catch (e) {}
      }
      try {
        localStorage.setItem('ragetech_last_sync', JSON.stringify({ ...event, _t: Date.now() }));
      } catch (e) {}
      syncListeners.forEach(fn => { try { fn(event); } catch (err) {} });
    },
    subscribe(cb) {
      syncListeners.add(cb);
      return () => syncListeners.delete(cb);
    }
  };

  if (syncChannel) {
    syncChannel.onmessage = (e) => {
      syncListeners.forEach(fn => { try { fn(e.data); } catch (err) {} });
    };
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'ragetech_last_sync' && e.newValue) {
      try {
        const data = JSON.parse(e.newValue);
        syncListeners.forEach(fn => { try { fn(data); } catch (err) {} });
      } catch (err) {}
    }
  });
})();
