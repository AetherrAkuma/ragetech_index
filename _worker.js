/**
 * Ragetech Platform — Cloudflare Pages & Workers Universal Entrypoint
 * Re-exports the core edge worker handler for Cloudflare Pages (Advanced Mode)
 * and Cloudflare Workers runtime.
 */
import worker from './worker.js';

export default worker;
