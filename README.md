# ragetech.dev — Sovereign Systems Engineering Collective

A production-grade, human-crafted web application and edge runtime designed for **ragetech.dev** referencing the **Tailark Dusk** aesthetic, backed by **Cloudflare Workers** and a **Cloudflare D1 SQLite Database**.

---

## ✦ Core Design & Architecture

1. **Restrained Dusk Aesthetic**:
   - Deep matte zinc & charcoal canvas (`#09090b`), hairline borders (`rgba(255, 255, 255, 0.07)`), and subtle ambient mesh gradients.
   - Clean typographic hierarchy using **Plus Jakarta Sans** and tabular monospace with **JetBrains Mono**.
   - No chaotic terminal box in the hero, no noisy tickers — pure technical serenity and craft.

2. **Cloudflare D1 Serverless Database**:
   - Edge SQLite database storing all 6 collective projects, 29 builders, project assignees, and repository showcases.
   - `schema.sql`: Full schema with relational integrity, foreign key cascades, and query indexes.
   - `seed.sql`: Complete database seed with all collective projects and builder profiles.

3. **Dynamic Universal Page Loaders (Zero Subdomains Required)**:
   - **Universal Project Loader** (`/p/:slug` -> `project.html`): Fetches project blueprint, performance specs, architecture breakdown, and lead maintainers dynamically from Cloudflare D1.
   - **Universal Builder Dossier** (`/d/:handle` or `/@:handle` -> `developer.html`): Displays custom developer profile, flagship repository flex showcase, secondary repos, GPG key, and verified status.
   - Both loaders feature automatic offline fallback to local datasets (`data/projects.js` and `data/developers.js`) ensuring 100% uptime.

4. **In-Browser Developer Studio & Dynamic Maintenance**:
   - Authenticated developers can update their status, bio, squad focus, and repos directly from the browser or via the REST API.
   - Project leads can update blueprints, specifications, and code previews without modifying source code or waiting for PR builds.

---

## 🛠 Cloudflare D1 Database Commands

```bash
# 1. Generate or update seed.sql from current data registries:
npm run db:build-seed

# 2. Run migrations and seed on local emulator:
npm run db:migrate:local
npm run db:seed:local

# 3. Create production D1 database on Cloudflare:
npx wrangler d1 create ragetech_db
# (Paste the generated database_id into wrangler.jsonc)

# 4. Deploy schema and seed to production Cloudflare D1:
npm run db:migrate:remote
npm run db:seed:remote
```

---

## 🚀 Running Locally & Deploying

```bash
# Run local preview with Cloudflare Worker & D1 emulator:
npm run dev

# Or run lightweight static preview:
npm start

# Deploy to Cloudflare:
npm run deploy
```

---

## 🌐 Dynamic Routing Map

- `/` — Collective Index (Tailark Dusk showcase & sticky scroll project inspector)
- `/p/:slug` — Dedicated dynamic project page (e.g. `/p/hyperion`, `/p/pulseos`)
- `/d/:handle` — Dedicated builder dossier (e.g. `/d/alexv`, `/d/elena`, `/d/mchen`)
- `/api/projects` — REST API for collective projects
- `/api/developers` — REST API for builders directory
- `/api/auth/*` — Edge token authentication sessions
