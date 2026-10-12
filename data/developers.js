(function () {
  const root = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this);
  // Registry is dynamically driven by Cloudflare D1 database.
  root.RAGETECH_DEVELOPERS = [];
})();
