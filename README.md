# ragetech.dev — Independent Engineering Collective

A clean, human-crafted landing page designed for **ragetech.dev** referencing the **Tailark Dusk** aesthetic (`dusk-landing-8`), stripped of generic AI marketing buzzwords, emoji clutter, and rainbow gradients.

---

## ✦ Core Design & Architectural Features

1. **Restrained Dusk Aesthetic**:
   - Deep matte zinc & charcoal canvas (`#09090b`), hairline 1px borders (`rgba(255, 255, 255, 0.07)`), and subtle architectural grid overlay.
   - Clean typographic hierarchy using **Inter** with tight tracking (`-0.03em`) and tabular monospace figures with **JetBrains Mono**.
   - Confident, technical voice without cliché AI marketing copy.

2. **Tailark Dusk Features 5 Sticky Scroll Highlight**:
   - Sticky repository sidebar on the left (`Hyperion`, `PulseOS KV`, `Chimera Runtime`, `Eclipse UI`, `Vortex Scheduler`, `Aether P2P`).
   - As you scroll down the page, `IntersectionObserver` dynamically highlights each active repository in the sidebar and illuminates the corresponding card with a subtle active border.
   - Each project entry features clean architecture specs and a technical preview window (Rust io_uring setup, Raft cluster JSON, OpenTelemetry DAG trace, CSS tokens, cron manifest, WebRTC P2P log).

3. **The 29 Builders Directory**:
   - Complete directory of all 29 collective engineers with authentic handles (`@alexv`, `@elena`, `@mchen`, etc.), roles, primary tech stack, and current focus.
   - **Interactive View Switcher**: Toggle between **Card Grid View** and **High-Density Table View** (similar to Linear / Raycast).
   - **Keyboard Shortcut**: Press <kbd>/</kbd> anywhere on the page to instantly jump focus to the developer search filter.
   - Squad filters: `All 29`, `Systems [13]`, `Interface [6]`, `AI Runtimes [5]`, `Security & Infra [5]`.

4. **Zero Dependencies & Blazing Fast**:
   - Pure HTML5, Vanilla CSS, and Vanilla JavaScript.
   - 0ms build step, zero npm runtime dependencies, instant load.

---

## 🚀 Running Locally

```bash
# Direct browser opening or via local server:
npx serve .
# or
npm start
```

Visit [http://localhost:3000](http://localhost:3000).
