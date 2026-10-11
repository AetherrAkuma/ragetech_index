# Ragetech Collective — Modular Data Architecture

Welcome to the data registry of `ragetech.dev`. This directory houses the modular data files powering the landing page and developer directory.

## File Structure

- **`data/projects.js`**: Incubated collective projects (Hyperion, PulseOS KV, Chimera, etc.).
- **`data/developers.js`**: The 29 builders registry, featuring individual profiles and flexed repositories.

---

## How to Edit Your Profile & Flex Your Repo

Any developer can update their profile, add new repositories, or adjust their stats by submitting a Pull Request.

### 1. Developer Entry Schema

Open `data/developers.js` and locate your entry or add a new object:

```javascript
{
  id: 30, // Next available index
  handle: 'your_github_handle',
  name: 'Your Name',
  squad: 'systems', // 'systems' | 'ai' | 'frontend' | 'security'
  role: 'Your Engineering Role',
  status: '⚡ Current focus / what you are building',
  location: 'City, Country (UTC+X)',
  bio: 'A concise 1-2 sentence engineering bio.',
  stack: ['Rust', 'eBPF', 'Linux'],
  ragetechProject: 'hyperion', // Collective project link
  featuredRepo: {
    name: 'your_handle/your-flagship-repo',
    tagline: 'What your repository does and why it is great.',
    stars: 1250,
    forks: 98,
    language: 'Rust',
    languageColor: '#dea584', // Hex color of language dot
    url: 'https://github.com/your_handle/your-flagship-repo',
    cloneUrl: 'git clone https://github.com/your_handle/your-flagship-repo.git',
    topics: ['rust', 'systems', 'perf']
  },
  secondaryRepos: [
    { name: 'your_handle/helper-tool', stars: 240, language: 'Go', languageColor: '#00ADD8', url: '...' }
  ],
  socials: {
    github: 'https://github.com/your_handle',
    x: 'https://x.com/your_handle',
    website: 'https://yourwebsite.dev'
  },
  gpgKey: '4A8B 91F0 C128 7E53'
}
```

### 2. How to Add a Collective Incubated Project

Open `data/projects.js` and add your project to the `PROJECTS` array with architecture specs, preview code/JSON/logs, and lead assignees.

### 3. Submitting Changes

```bash
git checkout -b feat/update-my-profile
git add data/developers.js
git commit -m "feat(builders): update profile and featured repo for @your_handle"
git push origin feat/update-my-profile
```

Once merged, Cloudflare automatically deploys the update to `ragetech.dev` with zero build delay!
