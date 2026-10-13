/**
 * Ragetech Platform — Cross-Tab Synchronization & Cache Sanitizer (api-bridge.js)
 * Native Direct Database Mode:
 * All API calls (/api/*) go directly to the Cloudflare Worker & D1 Database.
 * No mock persistence, no fake local storage overrides, no zombie datasets.
 */

(function () {
  'use strict';

  // 1. Immediately purge any legacy ghost local storage overrides & caches
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

  // 2. Unregister any stale Service Workers or CacheStorage to prevent stale JS caching
  try {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        for (const reg of regs) reg.unregister();
      }).catch(() => {});
    }
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then(names => {
        for (const name of names) caches.delete(name);
      }).catch(() => {});
    }
  } catch (e) {}

  // 3. Ensure global fallback namespaces are strictly empty
  if (typeof window !== 'undefined') {
    window.RAGETECH_PROJECTS = [];
    window.RAGETECH_DEVELOPERS = [];
  }

  // 4. Real-time Cross-Tab & Inter-Window Synchronization Engine
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

  // Cross-tab/window storage event fallback
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === 'ragetech_last_sync' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          syncListeners.forEach(fn => { try { fn(data); } catch (err) {} });
        } catch (err) {}
      }
    });
  }

  // 5. Ragetech Global Auth Helper
  window.RagetechAuth = {
    getSession() {
      try {
        const raw = localStorage.getItem('ragetech_session');
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },
    getToken() {
      const sess = this.getSession();
      return (sess && sess.token) ? sess.token : null;
    },
    getUser() {
      const sess = this.getSession();
      return (sess && sess.user) ? sess.user : null;
    },
    async logout() {
      try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      } catch (e) {}
      localStorage.removeItem('ragetech_session');
      if (window.RagetechSync) {
        window.RagetechSync.broadcast({ type: 'AUTH_LOGOUT' });
      }
      window.location.href = 'index.html';
    }
  };

  // 6. Universal Fetch Security & Localhost Bridge Interceptor
  // Automatically attaches HMAC Bearer token to /api/ requests and proxies localhost dev requests
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    const origFetch = window.fetch;
    const isLocalHost = (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' || 
      window.location.protocol === 'file:'
    );
    const isLocalWorker = window.location.port === '8787';
    const REMOTE_API_BASE = 'https://ragetech.dev';

    window.fetch = async function (resource, options = {}) {
      let url = '';
      if (typeof resource === 'string') {
        url = resource;
      } else if (resource instanceof Request) {
        url = resource.url;
      } else if (resource && typeof resource.toString === 'function') {
        url = resource.toString();
      }

      const isApiRoute = url.startsWith('/api/') || url === '/api' || url.includes('/api/');
      let finalUrl = url;

      // Localhost Static Server DevBridge: proxy /api/* to Cloudflare D1
      if (isLocalHost && !isLocalWorker) {
        if (url.startsWith('/api/') || url === '/api') {
          finalUrl = `${REMOTE_API_BASE}${url}`;
        } else {
          try {
            const parsed = new URL(url, window.location.href);
            if (parsed.pathname.startsWith('/api')) {
              finalUrl = `${REMOTE_API_BASE}${parsed.pathname}${parsed.search}`;
            }
          } catch (e) {}
        }
      }

      // Clone or initialize options
      const reqOptions = { ...options };

      // Ensure credentials and auth header are attached for API calls
      if (isApiRoute) {
        if (!reqOptions.credentials) {
          reqOptions.credentials = 'include';
        }

        const token = window.RagetechAuth.getToken();
        if (token) {
          if (reqOptions.headers instanceof Headers) {
            if (!reqOptions.headers.has('Authorization')) {
              reqOptions.headers.set('Authorization', `Bearer ${token}`);
            }
          } else if (Array.isArray(reqOptions.headers)) {
            const hasAuth = reqOptions.headers.some(([k]) => k.toLowerCase() === 'authorization');
            if (!hasAuth) {
              reqOptions.headers.push(['Authorization', `Bearer ${token}`]);
            }
          } else {
            reqOptions.headers = { ...(reqOptions.headers || {}) };
            if (!reqOptions.headers['Authorization'] && !reqOptions.headers['authorization']) {
              reqOptions.headers['Authorization'] = `Bearer ${token}`;
            }
          }
        }
      }

      // Execute request with proper URL
      let response;
      if (resource instanceof Request && finalUrl === url) {
        response = await origFetch(resource, reqOptions);
      } else {
        response = await origFetch(finalUrl, reqOptions);
      }

      // Handle 401 Unauthorized for management endpoints
      if (response && response.status === 401 && isApiRoute && (url.includes('/api/manage') || url.includes('/api/auth/verify'))) {
        localStorage.removeItem('ragetech_session');
        const currentPath = window.location.pathname.toLowerCase();
        if (currentPath.includes('admin') || currentPath.includes('lead') || currentPath.includes('developer-studio') || currentPath.includes('repository_editor')) {
          console.warn('[Ragetech Auth] Session expired or unauthorized. Redirecting to home.');
          window.location.href = 'index.html?auth=session_expired';
        }
      }

      return response;
    };

    if (isLocalHost && !isLocalWorker) {
      console.info('[Ragetech DevBridge] Active: Localhost static server detected. Seamlessly routing /api/* requests to Cloudflare D1 (https://ragetech.dev) with Web Crypto auth headers.');
    }
  }
})();
