# ragetech.dev — Initial Collective Landing Page

A modern, high-octane engineering landing page designed for **ragetech.dev**. Styled after the **Tailark Dusk** aesthetic (`dusk-landing-8`), featuring:

- **Tailark Dusk Design System**: Midnight obsidian backdrop, ambient glowing radial orbs, subtle grid matrix overlay, and electric cyan/indigo neon accents.
- **Projects Incubator**: Features 8 individual engineering projects (replacing generic workflow/agent placeholders) with technical metrics, architecture specs, and assigned builders.
- **The 29 Builders Core Roster**: Dedicated bottom section with interactive placeholder cards for all **29 developers**, searchable in real time by name, role, squad, or tech skills (Rust, Go, WebGL, eBPF, CUDA, etc.).
- **Interactive Telemetry Terminal**: Switchable telemetry tabs (`status.sh`, `stack.json`, `manifest.txt`).
- **Interactive Modals & Toast Feedback**: Click any project to inspect its architecture RFC, click any developer card to see their specialization profile, and copy the `ragetech.dev` domain with instant visual toast confirmation.
- **Zero Dependencies**: Pure HTML5, Vanilla CSS3, and Vanilla JavaScript. Runs directly in any browser with zero build errors and deploys instantaneously to Cloudflare Pages, Vercel, Netlify, or GitHub Pages.

---

## 🚀 Running Locally

You can open `index.html` directly in any web browser, or run a local static server:

```bash
# Using Node / npx
npx serve .

# Or using npm
npm start
```

Then visit [http://localhost:3000](http://localhost:3000) (or whichever port is assigned).

---

## 📁 Project Structure

```
Ragetech/
├── index.html        # Semantic HTML5 landing structure with dusk layout
├── styles.css        # Dusk theme tokens, glassmorphism, responsive grid
├── app.js            # 8 project specifications & 29 developer placeholders
├── package.json      # NPM script configuration
└── README.md         # Documentation
```

---

## 🛠 Features & Customization

1. **Customizing Projects**: Edit `PROJECTS_DATA` in `app.js` to rename projects, change metrics, or update descriptions.
2. **Customizing Developers**: Edit `DEVELOPERS_DATA` in `app.js` to change names, handles, avatars, or project assignments for the 29 developer slots.
3. **Deploying**: Push to your Git repository connected to your hosting provider (e.g. Cloudflare Pages or Vercel) and point `ragetech.dev` to the deployment.
