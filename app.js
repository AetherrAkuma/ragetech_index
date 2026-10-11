/**
 * RAGETECH.DEV — Application Core & SPA Router
 * High-craft systems engineering collective hub, client-side hash router,
 * dedicated project & developer profile pages, and in-browser Developer Studio.
 */

// Load modular registries from window (defined in data/projects.js and data/developers.js)
let PROJECTS = window.PROJECTS || [];
let DEVELOPERS = window.DEVELOPERS || [];

// Global state for directory filters & active route
let currentSquadFilter = 'all';
let currentStackFilter = 'all';
let currentSearchQuery = '';
let currentSortBy = 'featured';
let currentDirectoryView = 'showcase'; // 'showcase' | 'compact' | 'terminal'
let currentAuthUser = null;

// ============================================================================
// 1. INITIALIZATION & CLIENT-SIDE SPA ROUTER
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Listen for hash changes
  window.addEventListener('hashchange', handleRoute);

  // Initialize Landing Page components
  renderStickySidebar();
  renderProjectEntries();
  initStickyScrollObserver();
  renderBuildersDirectory();
  initDirectoryControls();
  initKeyboardShortcuts();
  initDomainCopy();
  initModals();
  initHeaderScroll();
  initAuth();

  // Route on initial load
  handleRoute();
});

function handleRoute() {
  const hash = window.location.hash || '#/';
  const mainViews = ['view-landing', 'view-project-detail', 'view-developer-detail'];
  
  // Hide all SPA views
  mainViews.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });

  if (hash.startsWith('#/project/')) {
    const projectId = hash.replace('#/project/', '').trim();
    showView('view-project-detail');
    renderProjectDetailPage(projectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (hash.startsWith('#/developer/')) {
    const handle = hash.replace('#/developer/', '').trim();
    showView('view-developer-detail');
    renderDeveloperDetailPage(handle);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (hash === '#/projects') {
    showView('view-landing');
    const el = document.getElementById('repositories');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (hash === '#/developers') {
    showView('view-landing');
    const el = document.getElementById('directory');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // Default: Landing Page
    showView('view-landing');
  }
}

function showView(viewId) {
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active');
  }
}

// ============================================================================
// 2. DEDICATED PROJECT DETAIL PAGE (#/project/:id)
// ============================================================================

function renderProjectDetailPage(projectId) {
  const container = document.getElementById('view-project-detail');
  if (!container) return;

  const p = PROJECTS.find(item => item.id === projectId);
  if (!p) {
    container.innerHTML = `
      <div class="container" style="padding: 60px 24px; text-align: center;">
        <h2 style="font-size:1.8rem; margin-bottom:12px;">Project Not Found</h2>
        <p style="color:var(--text-medium); margin-bottom:24px;">The repository "${escapeHtml(projectId)}" does not exist in the registry.</p>
        <a href="#/projects" class="btn btn-primary">Return to Repositories</a>
      </div>
    `;
    return;
  }

  // Find assignees in DEVELOPERS registry
  const maintainers = (p.assignees || []).map(h => DEVELOPERS.find(b => b.handle === h)).filter(Boolean);

  container.innerHTML = `
    <div class="container detail-view-container">
      <!-- Breadcrumb Bar -->
      <div class="detail-back-bar">
        <a href="#/" class="detail-back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
          <span>Back to Collective</span>
        </a>
        <div style="display:flex; gap:10px;">
          <a href="/p/${p.id}" class="btn btn-secondary" style="font-size:0.75rem;">
            <span>Dedicated Page ↗</span>
          </a>
          <a href="${p.githubUrl || 'https://github.com/ragetech/' + p.id}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:0.75rem;">
            <span>GitHub Repository ↗</span>
          </a>
        </div>
      </div>

      <!-- Hero Box -->
      <div class="project-detail-hero">
        <div class="project-detail-top">
          <div>
            <div class="project-detail-slug">${p.repo}</div>
            <h1 class="project-detail-title">${p.name}</h1>
            <p class="project-detail-summary">${p.summary}</p>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-end;">
            <span class="mono" style="font-size:0.75rem; color:#34d399; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); padding:3px 10px; border-radius:999px;">${p.badge}</span>
            <div class="mono" style="font-size:0.8rem; color:var(--text-low); display:flex; gap:12px;">
              <span>⭐ ${(p.stars || 1400).toLocaleString()} Stars</span>
              <span>🍴 ${p.forks || 120} Forks</span>
            </div>
          </div>
        </div>

        <!-- Quickstart Box -->
        <div class="project-quickstart-box">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="color:var(--text-low);">Quickstart:</span>
            <code>${p.cloneUrl || `git clone https://github.com/${p.repo}.git`}</code>
          </div>
          <button class="repo-clone-copy-btn" onclick="copyCloneCommand('${p.cloneUrl || `git clone https://github.com/${p.repo}.git`}', event)">
            Copy Command
          </button>
        </div>
      </div>

      <!-- Project Specification Cards Grid -->
      <div class="project-spec-cards-grid">
        ${p.specs.map(s => `
          <div class="project-spec-card">
            <div class="project-spec-card-lbl">${s.label}</div>
            <div class="project-spec-card-val">${s.val}</div>
          </div>
        `).join('')}
      </div>

      <!-- Architectural Deep Dive -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; margin-bottom:36px;">
        <div style="background:var(--bg-subtle); border:1px solid var(--border-hairline); border-radius:var(--radius-lg); padding:28px;">
          <h3 style="font-size:1.15rem; color:#fff; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
            <span style="color:var(--accent-blue);">01.</span>
            <span>Architecture Blueprint</span>
          </h3>
          <p style="font-size:0.9rem; color:var(--text-medium); line-height:1.6; margin-bottom:16px;">
            ${p.fullSpec ? p.fullSpec.arch : 'Engineered on lock-free memory ring buffers and direct kernel bypass for microsecond determinism.'}
          </p>
          <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-low); text-transform:uppercase; margin-bottom:6px;">Core Objective:</div>
          <div style="font-size:0.88rem; color:#d4d4d8;">${p.fullSpec ? p.fullSpec.goal : 'Zero-copy edge throughput without garbage collection latency.'}</div>
        </div>

        <div style="background:var(--bg-subtle); border:1px solid var(--border-hairline); border-radius:var(--radius-lg); padding:28px;">
          <h3 style="font-size:1.15rem; color:#fff; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
            <span style="color:var(--accent-emerald);">02.</span>
            <span>Current Release State</span>
          </h3>
          <p style="font-size:0.9rem; color:var(--text-medium); line-height:1.6; margin-bottom:16px;">
            ${p.fullSpec ? p.fullSpec.status : 'Benchmarked and verified across bare-metal 100GbE clusters and Firecracker microVM testbeds.'}
          </p>
          <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-low); text-transform:uppercase; margin-bottom:6px;">Runtime Target:</div>
          <div style="font-size:0.88rem; color:#d4d4d8;">Linux 6.x x86_64 & aarch64 (Bare Metal / Sovereign Edge)</div>
        </div>
      </div>

      <!-- Technical Preview Source -->
      <div style="background:#09090c; border:1px solid var(--border-subtle); border-radius:var(--radius-lg); overflow:hidden; margin-bottom:40px;">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:#101015; border-bottom:1px solid rgba(255,255,255,0.06); font-family:var(--font-mono); font-size:0.75rem; color:var(--text-low);">
          <span>${p.previewTitle}</span>
          <span>READ-ONLY PREVIEW</span>
        </div>
        <pre class="mono" style="padding:24px 20px; font-size:0.82rem; color:#e4e4e7; line-height:1.6; overflow-x:auto;"><code>${escapeHtml(p.previewContent)}</code></pre>
      </div>

      <!-- Lead Maintainers Roster -->
      <div style="margin-bottom:60px;">
        <div style="margin-bottom:20px;">
          <span class="section-kicker">Core Authors</span>
          <h3 style="font-size:1.35rem; color:#fff;">Lead Maintainers (${maintainers.length})</h3>
        </div>
        <div class="project-maintainers-grid">
          ${maintainers.map(m => {
            const initials = m.name.split(' ').map(n => n[0]).join('');
            return `
              <div class="compact-roster-card" onclick="window.location.hash = '#/developer/${m.handle}'">
                <div class="compact-header">
                  <div class="compact-avatar-name">
                    <div class="compact-avatar">${initials}</div>
                    <div class="compact-name-block">
                      <span class="compact-name">${m.name}</span>
                      <span class="compact-handle">@${m.handle}</span>
                    </div>
                  </div>
                  <span class="mono" style="font-size:0.72rem; color:var(--text-low);">#${String(m.id).padStart(2, '0')}</span>
                </div>
                <div class="compact-role">${m.role}</div>
                <div class="mono" style="font-size:0.72rem; color:var(--accent-blue); margin-top:auto;">
                  View Full Profile →
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 4. DEDICATED DEVELOPER PROFILE PAGE (#/developer/:handle)
// ============================================================================

function renderDeveloperDetailPage(handle) {
  const container = document.getElementById('view-developer-detail');
  if (!container) return;

  const b = DEVELOPERS.find(builder => builder.handle.toLowerCase() === handle.toLowerCase());
  if (!b) {
    container.innerHTML = `
      <div class="container" style="padding: 60px 24px; text-align: center;">
        <h2 style="font-size:1.8rem; margin-bottom:12px;">Developer Not Found</h2>
        <p style="color:var(--text-medium); margin-bottom:24px;">The handle "@${escapeHtml(handle)}" does not exist in the collective.</p>
        <a href="#/developers" class="btn btn-primary">Return to Roster</a>
      </div>
    `;
    return;
  }

  const initials = b.name.split(' ').map(n => n[0]).join('');
  const repo = b.featuredRepo;
  const squadLabels = {
    systems: 'Systems & Kernel Architecture',
    ai: 'AI & Inference Systems',
    security: 'Security, Cryptography & MicroVMs',
    frontend: 'Developer Ergonomics & Interfaces'
  };

  container.innerHTML = `
    <div class="container detail-view-container">
      <!-- Breadcrumb Bar -->
      <div class="detail-back-bar">
        <a href="#/developers" class="detail-back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
          <span>Back to Roster</span>
        </a>
        <div style="display:flex; gap:10px;">
          <a href="/d/${b.handle}" class="btn btn-secondary" style="font-size:0.75rem;">
            <span>Dedicated Dossier ↗</span>
          </a>
          <a href="${b.socials.github}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:0.75rem;">
            <span>GitHub Profile ↗</span>
          </a>
        </div>
      </div>

      <!-- Developer Hero Dossier -->
      <div class="dev-profile-hero">
        <div class="dev-profile-top-row">
          <div class="dev-profile-avatar-xl">
            ${initials}
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
              <h1 style="font-size:clamp(1.8rem, 3.5vw, 2.4rem); color:#fff; font-weight:600;">${b.name}</h1>
              <span class="mono" style="font-size:0.9rem; color:var(--accent-blue);">@${b.handle}</span>
              <span class="mono" style="font-size:0.7rem; color:var(--text-low); background:rgba(255,255,255,0.04); border:1px solid var(--border-hairline); padding:2px 8px; border-radius:4px;">
                MEMBER #${String(b.id).padStart(2, '0')}/29
              </span>
            </div>
            <div style="font-size:1rem; color:var(--text-medium);">${b.role} • <span style="color:#ffffff;">${squadLabels[b.squad] || b.squad}</span></div>
            <div class="mono" style="font-size:0.8rem; color:var(--text-low);">${b.location || 'Location Not Specified'}</div>
          </div>
        </div>

        <!-- Live Status Line -->
        ${b.status ? `
          <div style="background:rgba(0,0,0,0.35); border:1px solid var(--border-hairline); border-radius:8px; padding:10px 16px; margin-bottom:20px; font-family:var(--font-mono); font-size:0.82rem; color:#d4d4d8; display:flex; align-items:center; gap:8px;">
            <span class="live-dot-pulse" style="width:6px;height:6px;"></span>
            <span style="color:var(--text-low); text-transform:uppercase;">ACTIVE FOCUS:</span>
            <span>${b.status}</span>
          </div>
        ` : ''}

        <p class="dev-profile-bio-lead">${b.bio}</p>

        <!-- Primary Tech Stack Badges -->
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:16px;">
          ${b.stack.map(s => `<span class="builder-tech-badge" style="font-size:0.75rem; padding:3px 10px;">${s}</span>`).join('')}
        </div>
      </div>

      <!-- Flagship Repository Card (The Flex!) -->
      ${repo ? `
        <div style="margin-bottom:32px;">
          <div style="margin-bottom:14px;">
            <span class="section-kicker">Showcase & Flex</span>
            <h3 style="font-size:1.35rem; color:#fff;">Flagship Repository</h3>
          </div>

          <div class="dev-flagship-repo-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:12px;">
              <a href="${repo.url}" target="_blank" rel="noopener" class="repo-title-anchor" style="font-size:1.1rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
                <span>${repo.name}</span>
              </a>
              <div style="display:flex; gap:10px;">
                <span class="repo-flagship-pill" style="font-size:0.7rem;">Flagship Repository</span>
                <a href="${repo.url}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.72rem; padding:3px 10px;">
                  View on GitHub ↗
                </a>
              </div>
            </div>

            <p style="font-size:0.92rem; color:var(--text-medium); line-height:1.55; margin-bottom:18px;">${repo.tagline}</p>

            ${repo.cloneUrl ? `
              <div class="dossier-clone-box" style="margin-bottom:18px;">
                <code>${repo.cloneUrl}</code>
                <button class="repo-clone-copy-btn" onclick="copyCloneCommand('${repo.cloneUrl}', event)">Copy Clone</button>
              </div>
            ` : ''}

            <div style="display:flex; align-items:center; gap:20px; font-family:var(--font-mono); font-size:0.8rem; color:var(--text-low); flex-wrap:wrap;">
              <span style="display:inline-flex; align-items:center; gap:6px; color:#ffffff;">
                <span style="width:9px; height:9px; border-radius:50%; background:${repo.languageColor};"></span>
                ${repo.language}
              </span>
              <span>⭐ ${(repo.stars || 0).toLocaleString()} Stars</span>
              <span>🍴 ${repo.forks || 0} Forks</span>
              ${repo.topics ? repo.topics.map(t => `<span class="builder-tech-badge">#${t}</span>`).join('') : ''}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Secondary Repositories Grid -->
      ${(b.secondaryRepos && b.secondaryRepos.length > 0) ? `
        <div style="margin-bottom:36px;">
          <div style="margin-bottom:14px;">
            <span class="section-kicker">Open Source Work</span>
            <h3 style="font-size:1.35rem; color:#fff;">Secondary Repositories (${b.secondaryRepos.length})</h3>
          </div>
          <div class="dev-secondary-repos-grid">
            ${b.secondaryRepos.map(sr => `
              <div style="background:var(--bg-subtle); border:1px solid var(--border-hairline); border-radius:var(--radius-md); padding:18px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <span class="mono" style="color:#ffffff; font-weight:600; font-size:0.9rem;">${sr.name}</span>
                  <span class="mono" style="color:var(--text-low); font-size:0.75rem;">⭐ ${sr.stars}</span>
                </div>
                <div style="display:flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:0.72rem; color:var(--text-low);">
                  <span style="width:7px; height:7px; border-radius:50%; background:${sr.languageColor || '#fff'};"></span>
                  <span>${sr.language}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Collective Incubator & Security Dossier -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:60px;">
        <div style="background:var(--bg-subtle); border:1px solid var(--border-hairline); border-radius:var(--radius-md); padding:24px;">
          <div class="mono" style="font-size:0.72rem; color:var(--text-low); text-transform:uppercase; margin-bottom:6px;">Collective Contribution:</div>
          <div style="font-size:1.05rem; color:#fff; font-weight:600; margin-bottom:8px;">${b.ragetechProject ? b.ragetechProject.toUpperCase() : 'Ragetech Core'}</div>
          <p style="font-size:0.84rem; color:var(--text-medium); margin-bottom:14px;">
            Active maintainer contributing to core architectural RFCs and sovereign edge codebases.
          </p>
          ${b.ragetechProject ? `
            <a href="#/project/${b.ragetechProject}" class="btn btn-secondary" style="font-size:0.75rem;">
              View ${b.ragetechProject} Blueprint →
            </a>
          ` : ''}
        </div>

        <div style="background:var(--bg-subtle); border:1px solid var(--border-hairline); border-radius:var(--radius-md); padding:24px;">
          <div class="mono" style="font-size:0.72rem; color:var(--text-low); text-transform:uppercase; margin-bottom:6px;">Verification & PGP:</div>
          <div class="mono" style="font-size:0.86rem; color:#34d399; margin-bottom:8px;">GPG: ${b.gpgKey || '4A8B 91F0 C128 7E53'}</div>
          <p style="font-size:0.84rem; color:var(--text-medium); margin-bottom:14px;">
            Cryptographically signed commits verified across sovereign bare-metal infrastructure.
          </p>
          <div style="display:flex; gap:10px;">
            <a href="${b.socials.github}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.75rem;">GitHub</a>
            ${b.socials.x ? `<a href="${b.socials.x}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.75rem;">X</a>` : ''}
            ${b.socials.website ? `<a href="${b.socials.website}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.75rem;">Site</a>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 5. BUILDERS DIRECTORY & SHOWCASE ENGINE (LANDING PAGE)
// 6. BUILDERS DIRECTORY & SHOWCASE ENGINE (LANDING PAGE)
// ============================================================================

function filterAndSortBuilders() {
  const q = currentSearchQuery.toLowerCase().trim();

  let list = DEVELOPERS.filter(b => {
    const matchSquad = currentSquadFilter === 'all' || b.squad === currentSquadFilter;
    const matchStack = currentStackFilter === 'all' || 
      b.stack.some(s => s.toLowerCase() === currentStackFilter.toLowerCase()) ||
      (b.featuredRepo && b.featuredRepo.language.toLowerCase() === currentStackFilter.toLowerCase());

    const matchQuery = !q ||
      b.name.toLowerCase().includes(q) ||
      b.handle.toLowerCase().includes(q) ||
      b.role.toLowerCase().includes(q) ||
      b.bio.toLowerCase().includes(q) ||
      (b.status && b.status.toLowerCase().includes(q)) ||
      (b.featuredRepo && b.featuredRepo.name.toLowerCase().includes(q)) ||
      (b.featuredRepo && b.featuredRepo.tagline.toLowerCase().includes(q)) ||
      b.stack.some(s => s.toLowerCase().includes(q));

    return matchSquad && matchStack && matchQuery;
  });

  if (currentSortBy === 'stars') {
    list.sort((a, b) => ((b.featuredRepo && b.featuredRepo.stars) || 0) - ((a.featuredRepo && a.featuredRepo.stars) || 0));
  } else if (currentSortBy === 'index') {
    list.sort((a, b) => a.id - b.id);
  } else if (currentSortBy === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}

function renderBuildersDirectory() {
  const filtered = filterAndSortBuilders();
  const counterEl = document.getElementById('builders-count-badge');
  if (counterEl) {
    counterEl.textContent = `Showing ${filtered.length} of ${DEVELOPERS.length}`;
  }

  renderShowcaseView(filtered);
  renderCompactView(filtered);
  renderTerminalView(filtered);
}

function renderShowcaseView(list) {
  const container = document.getElementById('builders-showcase-view');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 48px 0; text-align: center; color: var(--text-low); font-size: 0.9rem;">
        No builders match your search criteria. Try adjusting filters or search term.
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(b => {
    const initials = b.name.split(' ').map(n => n[0]).join('');
    const repo = b.featuredRepo;
    const squadLabels = {
      systems: 'Systems & Kernel',
      ai: 'AI & Inference',
      security: 'Security & MicroVM',
      frontend: 'Interface & Tooling'
    };

    return `
      <div class="builder-showcase-card" id="builder-card-${b.id}">
        <!-- Top Identity Row -->
        <div class="showcase-card-top">
          <div class="showcase-avatar-col">
            <div class="builder-avatar-box" onclick="window.location.hash = '#/developer/${b.handle}'" style="cursor:pointer;" title="View Dedicated Profile">
              ${initials}
              <span class="builder-beacon-dot" title="Active Collective Contributor"></span>
            </div>
            <div class="builder-identity-meta">
              <div class="builder-name-row">
                <a href="#/developer/${b.handle}" class="builder-display-name">${b.name}</a>
                <a href="#/developer/${b.handle}" class="builder-handle-link">@${b.handle}</a>
                <span class="builder-squad-badge">${squadLabels[b.squad] || b.squad}</span>
              </div>
              <div class="builder-role-line">${b.role}</div>
            </div>
          </div>
          <span class="builder-index-num">#${String(b.id).padStart(2, '0')}</span>
        </div>

        <!-- Live Status Line -->
        ${b.status ? `
          <div class="builder-status-banner">
            <span>${b.status}</span>
          </div>
        ` : ''}

        <!-- Engineering Bio -->
        <p class="builder-bio-p">${b.bio}</p>

        <!-- The Featured Repo Showcase (The Flex!) -->
        ${repo ? `
          <div class="repo-inset-box">
            <div class="repo-inset-header">
              <a href="${repo.url}" target="_blank" rel="noopener" class="repo-title-anchor" onclick="event.stopPropagation();">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
                <span>${repo.name}</span>
              </a>
              <span class="repo-flagship-pill">Flagship</span>
            </div>

            <p class="repo-inset-desc">${repo.tagline}</p>

            <div class="repo-inset-footer">
              <div class="repo-stats-group">
                <span class="repo-lang-spec">
                  <span class="repo-lang-dot" style="background-color: ${repo.languageColor || '#dea584'};"></span>
                  ${repo.language}
                </span>
                <span class="repo-stat-counter" title="GitHub Stars">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ${(repo.stars || 0).toLocaleString()}
                </span>
                <span class="repo-stat-counter" title="Forks">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/></svg>
                  ${repo.forks || 0}
                </span>
              </div>

              <div class="repo-quick-actions">
                ${repo.cloneUrl ? `
                  <button class="repo-clone-copy-btn" onclick="copyCloneCommand('${repo.cloneUrl}', event)" title="Copy clone command">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    <span>Clone</span>
                  </button>
                ` : ''}
                <a href="${repo.url}" target="_blank" rel="noopener" class="repo-clone-copy-btn" onclick="event.stopPropagation();" title="Open repository">
                  <span>Repo ↗</span>
                </a>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Bottom Row: Stack Pills + Actions -->
        <div class="builder-card-bottom">
          <div class="builder-stack-pills-row">
            ${b.stack.map(s => `<span class="builder-tech-badge" onclick="setQuickStackFilter('${s}', event)">${s}</span>`).join('')}
          </div>

          <div class="builder-actions-group">
            <a href="#/developer/${b.handle}" class="btn-inspect-dossier">
              <span>View Profile</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
            <a href="${b.socials.github}" target="_blank" rel="noopener" class="builder-icon-btn" title="GitHub Profile" onclick="event.stopPropagation();">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderCompactView(list) {
  const container = document.getElementById('builders-compact-view');
  if (!container) return;

  container.innerHTML = list.map(b => {
    const initials = b.name.split(' ').map(n => n[0]).join('');
    const repo = b.featuredRepo;

    return `
      <div class="compact-roster-card" onclick="window.location.hash = '#/developer/${b.handle}'">
        <div class="compact-header">
          <div class="compact-avatar-name">
            <div class="compact-avatar">${initials}</div>
            <div class="compact-name-block">
              <span class="compact-name">${b.name}</span>
              <span class="compact-handle">@${b.handle}</span>
            </div>
          </div>
          <span class="mono" style="font-size:0.72rem; color:var(--text-low);">#${String(b.id).padStart(2, '0')}</span>
        </div>

        <div class="compact-role">${b.role}</div>

        ${repo ? `
          <div class="compact-pinned-repo">
            <span class="compact-repo-name">${repo.name}</span>
            <span class="compact-repo-stars">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ${(repo.stars || 0).toLocaleString()}
            </span>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function renderTerminalView(list) {
  const container = document.getElementById('builders-terminal-view');
  if (!container) return;

  container.innerHTML = `
    <table class="builders-matrix-table">
      <thead>
        <tr>
          <th>Index</th>
          <th>Engineer</th>
          <th>Squad</th>
          <th>Flagship Repository</th>
          <th>Stars</th>
          <th>Language</th>
          <th>Primary Stack</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${list.map(b => {
          const repo = b.featuredRepo;
          return `
            <tr>
              <td class="mono" style="color:var(--text-low);">#${String(b.id).padStart(2, '0')}</td>
              <td>
                <div style="display:flex; flex-direction:column;">
                  <span style="color:var(--text-high); font-weight:500;">${b.name}</span>
                  <a href="#/developer/${b.handle}" class="mono" style="font-size:0.72rem; color:var(--text-low);">@${b.handle}</a>
                </div>
              </td>
              <td><span class="builder-squad-badge">${b.squad}</span></td>
              <td>
                ${repo ? `
                  <a href="${repo.url}" target="_blank" rel="noopener" class="mono" style="color:#ffffff; font-weight:500;" onclick="event.stopPropagation();">
                    ${repo.name} ↗
                  </a>
                ` : '—'}
              </td>
              <td class="mono" style="color:var(--text-high);">
                ${repo ? `⭐ ${(repo.stars || 0).toLocaleString()}` : '—'}
              </td>
              <td>
                ${repo ? `
                  <span style="display:inline-flex; align-items:center; gap:5px; font-family:var(--font-mono); font-size:0.75rem;">
                    <span style="width:7px; height:7px; border-radius:50%; background:${repo.languageColor || '#fff'};"></span>
                    ${repo.language}
                  </span>
                ` : '—'}
              </td>
              <td class="mono" style="font-size:0.72rem; color:var(--text-low);">${b.stack.join(', ')}</td>
              <td>
                <a href="#/developer/${b.handle}" class="btn-inspect-dossier" style="padding:3px 8px; font-size:0.72rem;">
                  Profile →
                </a>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

// ============================================================================
// 7. INCUBATED SYSTEMS SECTION (STICKY SCROLL ON LANDING)
// ============================================================================

function renderStickySidebar() {
  const nav = document.getElementById('sticky-project-nav');
  if (!nav) return;

  nav.innerHTML = PROJECTS.map((p, idx) => `
    <button 
      class="sidebar-nav-button" 
      data-project-id="${p.id}"
      ${idx === 0 ? 'data-state="active"' : ''}
      onclick="scrollToProject('${p.id}')">
      <span>${p.name}</span>
      <span class="nav-bullet"></span>
    </button>
  `).join('');
}

function renderProjectEntries() {
  const container = document.getElementById('projects-stack');
  if (!container) return;

  container.innerHTML = PROJECTS.map((p, idx) => {
    const assigneeAvatars = (p.assignees || []).map(handle => {
      const b = DEVELOPERS.find(builder => builder.handle === handle);
      const initials = b ? b.name.split(' ').map(n => n[0]).join('') : handle.substring(0, 2).toUpperCase();
      return `<a href="#/developer/${handle}" class="builder-pill-avatar" title="${b ? `${b.name} (@${b.handle})` : handle}">${initials}</a>`;
    }).join('');

    return `
      <article 
        class="project-entry ${idx === 0 ? 'is-active' : ''}" 
        id="project-${p.id}" 
        data-project-id="${p.id}">
        
        <!-- Left Column: Specs & Purpose -->
        <div class="project-meta-col">
          <div>
            <div class="project-slug-row">
              <span class="project-slug-tag">${p.repo}</span>
              <span class="project-status-tag">${p.badge}</span>
            </div>

            <h3 class="project-h3">${p.name}</h3>
            <p class="project-summary">${p.summary}</p>

            <ul class="spec-list">
              ${p.specs.map(s => `
                <li class="spec-list-row">
                  <span class="spec-label">${s.label}</span>
                  <span class="spec-value">${s.val}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="project-actions-row">
            <div class="project-assignees-avatars" title="Assigned Maintainers">
              ${assigneeAvatars}
            </div>

            <div style="display:flex; gap:8px;">
              <a href="#/project/${p.id}" class="btn btn-primary" style="font-size:0.78rem;">
                Dedicated Page
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
              <button class="btn btn-secondary" onclick="openProjectSpecModal('${p.id}')" style="font-size:0.78rem;">
                Spec
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Technical Preview Window -->
        <div class="project-preview-window">
          <div class="preview-window-top">
            <span>${p.previewTitle}</span>
            <span style="color:#71717a;">READ-ONLY</span>
          </div>

          <pre class="preview-window-body"><code>${escapeHtml(p.previewContent)}</code></pre>

          <div class="preview-window-footer">
            <span>${p.previewMeta}</span>
            <span style="color:#10b981;">● Active</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function initStickyScrollObserver() {
  const entries = document.querySelectorAll('.project-entry');
  if (entries.length === 0) return;

  const observer = new IntersectionObserver((observedEntries) => {
    const intersecting = observedEntries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (intersecting.length > 0) {
      const activeId = intersecting[0].target.getAttribute('data-project-id');
      if (activeId) {
        highlightProject(activeId);
      }
    }
  }, {
    rootMargin: '-20% 0px -40% 0px',
    threshold: [0.15, 0.35, 0.6]
  });

  entries.forEach(e => observer.observe(e));
}

function highlightProject(id) {
  document.querySelectorAll('.sidebar-nav-button').forEach(btn => {
    if (btn.getAttribute('data-project-id') === id) {
      btn.setAttribute('data-state', 'active');
    } else {
      btn.removeAttribute('data-state');
    }
  });

  document.querySelectorAll('.project-entry').forEach(card => {
    if (card.getAttribute('data-project-id') === id) {
      card.classList.add('is-active');
    } else {
      card.classList.remove('is-active');
    }
  });
}

window.scrollToProject = function(id) {
  const target = document.getElementById(`project-${id}`);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    highlightProject(id);
  }
};

// ============================================================================
// 8. DIRECTORY CONTROLS & EVENT BINDINGS
// ============================================================================

function initDirectoryControls() {
  const squadBtns = document.querySelectorAll('.squad-filter-btn');
  squadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      squadBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSquadFilter = btn.getAttribute('data-squad') || 'all';
      renderBuildersDirectory();
    });
  });

  const stackBtns = document.querySelectorAll('.stack-tag-pill');
  stackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stackBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStackFilter = btn.getAttribute('data-stack') || 'all';
      renderBuildersDirectory();
    });
  });

  const searchInput = document.getElementById('builder-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderBuildersDirectory();
    });
  }

  const sortSelect = document.getElementById('builder-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSortBy = e.target.value;
      renderBuildersDirectory();
    });
  }

  const viewShowcaseBtn = document.getElementById('view-showcase-btn');
  const viewCompactBtn = document.getElementById('view-compact-btn');
  const viewTerminalBtn = document.getElementById('view-terminal-btn');

  const showcaseViewEl = document.getElementById('builders-showcase-view');
  const compactViewEl = document.getElementById('builders-compact-view');
  const terminalViewEl = document.getElementById('builders-terminal-view');

  function setView(view) {
    currentDirectoryView = view;
    [viewShowcaseBtn, viewCompactBtn, viewTerminalBtn].forEach(b => b && b.classList.remove('active'));
    if (showcaseViewEl) showcaseViewEl.style.display = 'none';
    if (compactViewEl) compactViewEl.style.display = 'none';
    if (terminalViewEl) terminalViewEl.style.display = 'none';

    if (view === 'showcase') {
      if (viewShowcaseBtn) viewShowcaseBtn.classList.add('active');
      if (showcaseViewEl) showcaseViewEl.style.display = 'grid';
    } else if (view === 'compact') {
      if (viewCompactBtn) viewCompactBtn.classList.add('active');
      if (compactViewEl) compactViewEl.style.display = 'grid';
    } else if (view === 'terminal') {
      if (viewTerminalBtn) viewTerminalBtn.classList.add('active');
      if (terminalViewEl) terminalViewEl.style.display = 'block';
    }
  }

  if (viewShowcaseBtn) viewShowcaseBtn.addEventListener('click', () => setView('showcase'));
  if (viewCompactBtn) viewCompactBtn.addEventListener('click', () => setView('compact'));
  if (viewTerminalBtn) viewTerminalBtn.addEventListener('click', () => setView('terminal'));

  document.querySelectorAll('.js-open-pr-guide').forEach(btn => {
    btn.addEventListener('click', openPrGuideModal);
  });
}

window.setQuickStackFilter = function(stack, e) {
  if (e) e.stopPropagation();
  currentStackFilter = stack;

  const stackBtns = document.querySelectorAll('.stack-tag-pill');
  stackBtns.forEach(btn => {
    if (btn.getAttribute('data-stack').toLowerCase() === stack.toLowerCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderBuildersDirectory();
};

window.copyCloneCommand = function(cmd, e) {
  if (e) e.stopPropagation();
  navigator.clipboard.writeText(cmd).then(() => {
    showToast(`Copied: ${cmd}`);
  }).catch(() => {
    showToast(cmd);
  });
};

// ============================================================================
// 9. MODALS & GENERAL UTILITIES
// ============================================================================

function initModals() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('active');
}

window.openProjectSpecModal = function(id) {
  const p = PROJECTS.find(item => item.id === id);
  if (!p) return;

  const content = document.getElementById('modal-dynamic-content');
  const overlay = document.getElementById('modal-overlay');

  content.innerHTML = `
    <div style="font-family:var(--font-mono); font-size:0.72rem; color:var(--text-low); margin-bottom:4px;">${p.repo}</div>
    <h3 style="font-size:1.4rem; color:var(--text-high); margin-bottom:12px;">${p.name}</h3>
    <p style="font-size:0.9rem; color:var(--text-medium); margin-bottom:20px; line-height:1.55;">${p.summary}</p>

    <div style="background:#09090b; border:1px solid var(--border-hairline); border-radius:8px; padding:16px; margin-bottom:20px;">
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-low); text-transform:uppercase; margin-bottom:8px;">Architecture Blueprint</div>
      <p style="font-size:0.86rem; color:#e4e4e7; margin-bottom:12px; line-height:1.5;">${p.fullSpec ? p.fullSpec.arch : 'Lock-free memory ring buffer mapped into shared physical memory.'}</p>
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-low); margin-bottom:4px;">Core Objective:</div>
      <div style="font-size:0.86rem; color:#a1a1aa;">${p.fullSpec ? p.fullSpec.goal : 'Zero-downtime persistence during edge partitions.'}</div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center;">
      <a href="#/project/${p.id}" class="btn btn-primary" onclick="closeModal()">
        Open Full Project Page →
      </a>
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    </div>
  `;

  overlay.classList.add('active');
};

function openPrGuideModal() {
  window.openLoginModal();
}

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const input = document.getElementById('builder-search-input');
      if (input) {
        input.focus();
        input.select();
      }
    }

    if (e.key === 'Escape') {
      closeModal();
      const input = document.getElementById('builder-search-input');
      if (input && document.activeElement === input) {
        input.blur();
      }
    }
  });
}

function initDomainCopy() {
  document.querySelectorAll('.js-copy-domain').forEach(btn => {
    btn.addEventListener('click', () => {
      const domain = 'ragetech.dev';
      navigator.clipboard.writeText(domain).then(() => {
        showToast(`Copied ${domain}`);
      }).catch(() => {
        showToast('ragetech.dev');
      });
    });
  });
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="color:#10b981;">✓</span> <span>${escapeHtml(msg)}</span>`;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 200);
  }, 2400);
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ============================================================================
// 10. SECURE D1 AUTHENTICATION & BUILDER PORTAL
// ============================================================================

async function initAuth() {
  try {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.user) {
        currentAuthUser = data.user;
      }
    }
  } catch (err) {
    // API not reachable or static dev server
  }
  updateAuthUI();
}

function updateAuthUI() {
  const widget = document.getElementById('authHeaderWidget');
  if (!widget) return;

  if (currentAuthUser) {
    const avatar = currentAuthUser.avatar_url || currentAuthUser.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentAuthUser.handle}`;
    widget.innerHTML = `
      <div class="auth-logged-in-box">
        <img src="${avatar}" alt="${escapeHtml(currentAuthUser.name || currentAuthUser.handle)}" class="auth-header-avatar">
        <a href="#/developer/${currentAuthUser.handle}" class="auth-header-handle">@${escapeHtml(currentAuthUser.handle)}</a>
        <button class="auth-logout-btn" onclick="handleLogout()" title="Log out">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    `;
  } else {
    widget.innerHTML = `
      <button id="openLoginBtn" class="btn btn-secondary nav-login-btn" onclick="openLoginModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span>Builder Login</span>
      </button>
    `;
  }
}

window.openLoginModal = function() {
  const modal = document.getElementById('loginModal');
  const alertBox = document.getElementById('loginAlertBox');
  if (alertBox) alertBox.style.display = 'none';
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      const handleInput = document.getElementById('loginHandle');
      if (handleInput) handleInput.focus();
    }, 50);
  }
};

window.closeLoginModal = function() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'none';
};

window.handleLoginSubmit = async function(e) {
  e.preventDefault();
  const handleInput = document.getElementById('loginHandle');
  const passInput = document.getElementById('loginPassword');
  const submitBtn = document.getElementById('loginSubmitBtn');
  const alertBox = document.getElementById('loginAlertBox');

  const handle = (handleInput?.value || '').trim();
  const password = passInput?.value || '';

  if (!handle || !password) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Verifying...';
  if (alertBox) alertBox.style.display = 'none';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, password })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      currentAuthUser = data.developer;
      updateAuthUI();
      window.closeLoginModal();
      showToast(`Authenticated as @${currentAuthUser.handle}`);
      
      // Clear inputs
      if (handleInput) handleInput.value = '';
      if (passInput) passInput.value = '';
    } else {
      if (alertBox) {
        alertBox.className = 'auth-alert error';
        alertBox.textContent = data.error || 'Authentication failed. Please verify credentials.';
        alertBox.style.display = 'block';
      }
    }
  } catch (err) {
    if (alertBox) {
      alertBox.className = 'auth-alert error';
      alertBox.textContent = 'Connection error. Ensure Worker & D1 are running.';
      alertBox.style.display = 'block';
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Authenticate →';
  }
};

window.handleLogout = async function() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (e) {}

  currentAuthUser = null;
  updateAuthUI();
  showToast('Logged out successfully');
};

