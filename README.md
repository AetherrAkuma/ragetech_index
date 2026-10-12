# Ragetech — Sovereign Systems Engineering Collective

A human-crafted, sovereign edge platform and engineering collective website built referencing the **Tailark Dusk** (`dusk-landing-10`) and **Tailark Quartz** (`blog-article/one` & `team`) design language, powered by **Cloudflare Workers** and a **Cloudflare D1** SQLite database with dynamic **RBAC**.

---

## ✦ Core Architecture & Features

1. **Tailark Dusk Design Foundation**:
   * Obsidian canvas (`#09090b`), surface elevation (`#101015`), hairline borders (`rgba(255, 255, 255, 0.08)`), and subtle ambient mesh gradients.
   * **Equal Spotlight System**: Dynamic mouse-following radial spotlight on repository cards, ensuring all projects receive equal spotlight and prominence.
   * Typographic hierarchy with **Plus Jakarta Sans** and tabular **JetBrains Mono**.
   * **100% SVG Vector Icons** — Zero emojis.
   * **GSAP 3.x** animations for fluid entrance timelines, spring modals, and accordion state changes.

2. **Tailark Header-2 & Hero-2**:
   * `@tailark/header-2`: Blurred floating glass bar with brand mark, navigation links, quick Command Palette trigger, and dynamic RBAC session status.
   * `@tailark/hero-section-2`: Monumental typography, live edge status pill, dual CTAs, and live edge telemetry metrics ribbon.

3. **Expandable Repository Showcase (`@tailark/expandable-features-8`)**:
   * Category filter pills (*Distributed Runtimes*, *Compilers*, *Kernel & Systems*, *Cryptography*).
   * Interactive split-pane accordion with equal spotlight illumination.
   * Live blueprint preview with benchmark metrics, maintainer chips, and direct links to the custom whitepaper page.

4. **The 29 Builders Guild (`@tailark/blocks/quartz/team`)**:
   * Responsive grid of 29 developer cards with squad badges, roles, and verified cryptographic chips.
   * Card click opens the **Developer Modal Dossier** featuring their bio, GPG fingerprint, and assigned repositories linking to project pages.

5. **Templated Custom Repository Page (`project.html`)**:
   * Modeled after **Tailark Quartz Blog Article** (`blog-article/one`).
   * Clean technical whitepaper layout with category badge, read time, and monumental title.
   * **Primary Top Action Bar**: `Visit Live Project Website` (external link) & `Source Repository` (GitHub).
   * Dynamically queries Cloudflare D1 with automatic offline fallback.
   * Dedicated **Assigned Maintainers** block at the bottom styled with Tailark Quartz team cards.

6. **Dedicated Developer Dossier (`developer.html`)**:
   * Individual developer profile with verified status badge, bio, and squad focus.
   * Cryptographic **GPG Public Key Widget** with one-click fingerprint copy.
   * Showcase of all repositories assigned to the engineer.
   * Direct links to personal website and GitHub.

7. **Global Command Palette (`Cmd + K` / `Ctrl + K`)**:
   * Instant search overlay across all 6 repositories, 29 builders, and quick actions with keyboard navigation (`↑`, `↓`, `Enter`, `Esc`).

8. **Dedicated Role Dashboards & Portals**:
   * **Admin Console (`admin.html`)**: Complete CRUD portal for administrators (`reymartchua@ragetech.dev`). Allows adding/modifying/deleting repositories, links, builders, assignments, and inspecting audit trails.
   * **Project Lead Portal (`lead.html`)**: Tailored workspace for project leads to govern assigned blueprints, update live website links, manage whitepaper specifications, and organize maintainer teams.
   * **Developer Studio (`developer-studio.html`)**: Developer self-service studio to manage public dossiers, bios, external website & GitHub coordinates, GPG keys, and SHA-256 access keys.

9. **Security & Authentication**:
   * Standard **SHA-256 cryptographic password hashing** via Web Crypto API.
   * Pre-configured Administrator account: `reymartchua@ragetech.dev` | `yuichirokanade`.

10. **Zero-Downtime Offline Fallback**:
   * Complete isomorphic datasets in `data/projects.js` and `data/developers.js` guarantee 100% functionality even during offline development or static hosting.

---

## 🛠 Cloudflare D1 Database Commands

```bash
# 1. Run local D1 migrations and seed:
npm run db:migrate:local
npm run db:seed:local

# 2. Start Cloudflare Worker edge emulator:
npm run dev

# 3. Deploy to production Cloudflare:
npm run db:migrate:remote
npm run db:seed:remote
npm run deploy
```

---

## 🚀 Running Locally

```bash
# Run lightweight static web server:
npm run start
# (Opens on http://localhost:3000)

# Or run with Cloudflare Worker and D1 emulator:
npm run dev
```
