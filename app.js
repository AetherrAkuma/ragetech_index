/**
 * RAGETECH.DEV — Application Logic
 * High-craft engineering collective directory, sticky scroll project inspector,
 * modular repository showcase, and developer dossier modals.
 */

// Load modular registries from window (defined in data/projects.js and data/developers.js)
const PROJECTS = window.PROJECTS || [];
const DEVELOPERS = window.DEVELOPERS || [];

// State management for developer directory
let currentSquadFilter = 'all';
let currentStackFilter = 'all';
let currentSearchQuery = '';
let currentSortBy = 'featured';
let currentDirectoryView = 'showcase'; // 'showcase' | 'compact' | 'terminal'

// ============================================================================
// 1. INITIALIZATION & EVENT BINDINGS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  renderStickySidebar();
  renderProjectEntries();
  initStickyScrollObserver();

  renderBuildersDirectory();
  initDirectoryControls();
  initKeyboardShortcuts();
  initDomainCopy();
  initModals();
  initHeaderScroll();
});

// ============================================================================
// 2. INCUBATED PROJECTS (STICKY SCROLL HIGHLIGHT)
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
    // Generate avatar monograms for assignees
    const assigneeAvatars = (p.assignees || []).map(handle => {
      const b = DEVELOPERS.find(builder => builder.handle === handle);
      const initials = b ? b.name.split(' ').map(n => n[0]).join('') : handle.substring(0, 2).toUpperCase();
      return `<div class="builder-pill-avatar" title="${b ? `${b.name} (@${b.handle})` : handle}" onclick="openBuilderModalByHandle('${handle}')">${initials}</div>`;
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
            <div class="project-assignees-avatars" title="Assigned Contributors (Click to inspect)">
              ${assigneeAvatars}
            </div>

            <button class="btn btn-secondary" onclick="openProjectSpecModal('${p.id}')">
              Inspect Spec
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
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
// 3. THE 29 BUILDERS REPOSITORY SHOWCASE ENGINE
// ============================================================================

function filterAndSortBuilders() {
  const q = currentSearchQuery.toLowerCase().trim();

  let list = DEVELOPERS.filter(b => {
    // Squad filter
    const matchSquad = currentSquadFilter === 'all' || b.squad === currentSquadFilter;

    // Stack filter
    const matchStack = currentStackFilter === 'all' || 
      b.stack.some(s => s.toLowerCase() === currentStackFilter.toLowerCase()) ||
      (b.featuredRepo && b.featuredRepo.language.toLowerCase() === currentStackFilter.toLowerCase());

    // Search query
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

  // Sorting
  if (currentSortBy === 'stars') {
    list.sort((a, b) => ((b.featuredRepo && b.featuredRepo.stars) || 0) - ((a.featuredRepo && a.featuredRepo.stars) || 0));
  } else if (currentSortBy === 'index') {
    list.sort((a, b) => a.id - b.id);
  } else if (currentSortBy === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } // 'featured' keeps curated roster order

  return list;
}

function renderBuildersDirectory() {
  const filtered = filterAndSortBuilders();
  const counterEl = document.getElementById('builders-count-badge');
  if (counterEl) {
    counterEl.textContent = `Showing ${filtered.length} of ${DEVELOPERS.length}`;
  }

  // 1. Render View 1: Flagship Showcase Grid
  renderShowcaseView(filtered);

  // 2. Render View 2: High-Density Compact Grid
  renderCompactView(filtered);

  // 3. Render View 3: Terminal Matrix Table
  renderTerminalView(filtered);
}

// VIEW 1: Showcase Cards with Featured Repos
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
            <div class="builder-avatar-box">
              ${initials}
              <span class="builder-beacon-dot" title="Active Collective Contributor"></span>
            </div>
            <div class="builder-identity-meta">
              <div class="builder-name-row">
                <span class="builder-display-name">${b.name}</span>
                <a href="${b.socials.github}" target="_blank" rel="noopener" class="builder-handle-link" onclick="event.stopPropagation();">@${b.handle}</a>
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
                  <span class="repo-lang-dot" style="background-color: ${repo.languageColor};"></span>
                  ${repo.language}
                </span>
                <span class="repo-stat-counter" title="GitHub Stars">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ${repo.stars.toLocaleString()}
                </span>
                <span class="repo-stat-counter" title="Forks">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/></svg>
                  ${repo.forks}
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
                  <span>Repo</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
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
            <button class="btn-inspect-dossier" onclick="openBuilderModal(${b.id})">
              <span>Inspect Dossier</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
            <a href="${b.socials.github}" target="_blank" rel="noopener" class="builder-icon-btn" title="GitHub Profile" onclick="event.stopPropagation();">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            ${b.socials.website ? `
              <a href="${b.socials.website}" target="_blank" rel="noopener" class="builder-icon-btn" title="Personal Website" onclick="event.stopPropagation();">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// VIEW 2: Compact Roster Grid
function renderCompactView(list) {
  const container = document.getElementById('builders-compact-view');
  if (!container) return;

  container.innerHTML = list.map(b => {
    const initials = b.name.split(' ').map(n => n[0]).join('');
    const repo = b.featuredRepo;

    return `
      <div class="compact-roster-card" onclick="openBuilderModal(${b.id})">
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
              ${repo.stars.toLocaleString()}
            </span>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

// VIEW 3: Terminal Matrix Table
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
                  <a href="${b.socials.github}" target="_blank" rel="noopener" class="mono" style="font-size:0.72rem; color:var(--text-low);" onclick="event.stopPropagation();">@${b.handle}</a>
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
                ${repo ? `⭐ ${repo.stars.toLocaleString()}` : '—'}
              </td>
              <td>
                ${repo ? `
                  <span style="display:inline-flex; align-items:center; gap:5px; font-family:var(--font-mono); font-size:0.75rem;">
                    <span style="width:7px; height:7px; border-radius:50%; background:${repo.languageColor};"></span>
                    ${repo.language}
                  </span>
                ` : '—'}
              </td>
              <td class="mono" style="font-size:0.72rem; color:var(--text-low);">${b.stack.join(', ')}</td>
              <td>
                <button class="btn-inspect-dossier" style="padding:3px 8px; font-size:0.72rem;" onclick="openBuilderModal(${b.id})">
                  Dossier
                </button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

// ============================================================================
// 4. DIRECTORY INTERACTION CONTROLS
// ============================================================================

function initDirectoryControls() {
  // Squad Filters
  const squadBtns = document.querySelectorAll('.squad-filter-btn');
  squadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      squadBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSquadFilter = btn.getAttribute('data-squad') || 'all';
      renderBuildersDirectory();
    });
  });

  // Stack Quick Filters
  const stackBtns = document.querySelectorAll('.stack-tag-pill');
  stackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stackBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStackFilter = btn.getAttribute('data-stack') || 'all';
      renderBuildersDirectory();
    });
  });

  // Search Input
  const searchInput = document.getElementById('builder-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderBuildersDirectory();
    });
  }

  // Sort Select Dropdown
  const sortSelect = document.getElementById('builder-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSortBy = e.target.value;
      renderBuildersDirectory();
    });
  }

  // View Switchers (Showcase vs Compact vs Terminal)
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

  // PR Guide Button
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

  // Scroll to directory if clicking from card
  const dirSection = document.getElementById('directory');
  if (dirSection) {
    dirSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
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
// 5. MODAL SYSTEM (BUILDER DOSSIER & PR GUIDE)
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

window.openBuilderModal = function(id) {
  const b = DEVELOPERS.find(builder => builder.id === id);
  if (!b) return;

  const content = document.getElementById('modal-dynamic-content');
  const overlay = document.getElementById('modal-overlay');
  const initials = b.name.split(' ').map(n => n[0]).join('');
  const repo = b.featuredRepo;

  content.innerHTML = `
    <div class="dossier-modal-box">
      <!-- Header Bar -->
      <div class="dossier-header-bar">
        <div class="dossier-avatar-large">${initials}</div>
        <div style="display:flex; flex-direction:column; gap:3px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <h3 style="font-size:1.35rem; color:#fff; font-weight:600;">${b.name}</h3>
            <span class="mono" style="font-size:0.75rem; color:var(--accent-blue);">@${b.handle}</span>
          </div>
          <div style="font-size:0.85rem; color:var(--text-medium);">${b.role}</div>
          <div class="mono" style="font-size:0.72rem; color:var(--text-low);">${b.location}</div>
        </div>
      </div>

      <!-- Live Focus Status -->
      ${b.status ? `
        <div style="background:rgba(0,0,0,0.3); border:1px solid var(--border-hairline); border-radius:6px; padding:8px 12px; font-family:var(--font-mono); font-size:0.76rem; color:#d4d4d8;">
          <span style="color:var(--text-low); text-transform:uppercase; margin-right:6px;">Focus:</span>
          <span>${b.status}</span>
        </div>
      ` : ''}

      <!-- Bio -->
      <p style="font-size:0.88rem; color:var(--text-medium); line-height:1.55;">${b.bio}</p>

      <!-- Featured Flex Repository -->
      ${repo ? `
        <div style="background:#09090c; border:1px solid var(--border-subtle); border-radius:8px; padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="display:inline-flex; align-items:center; gap:8px; font-family:var(--font-mono); font-size:0.95rem; font-weight:600; color:#ffffff;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
              <span>${repo.name}</span>
            </div>
            <a href="${repo.url}" target="_blank" rel="noopener" class="btn btn-secondary" style="padding:3px 9px; font-size:0.72rem;">
              GitHub ↗
            </a>
          </div>

          <p style="font-size:0.82rem; color:var(--text-medium); line-height:1.45; margin-bottom:12px;">${repo.tagline}</p>

          ${repo.cloneUrl ? `
            <div class="dossier-clone-box">
              <code>${repo.cloneUrl}</code>
              <button class="repo-clone-copy-btn" onclick="copyCloneCommand('${repo.cloneUrl}', event)">Copy</button>
            </div>
          ` : ''}

          <div style="display:flex; align-items:center; gap:16px; margin-top:12px; font-family:var(--font-mono); font-size:0.75rem; color:var(--text-low);">
            <span style="display:inline-flex; align-items:center; gap:5px; color:#fff;">
              <span style="width:8px; height:8px; border-radius:50%; background:${repo.languageColor};"></span>
              ${repo.language}
            </span>
            <span>⭐ ${repo.stars.toLocaleString()} Stars</span>
            <span>🍴 ${repo.forks} Forks</span>
          </div>
        </div>
      ` : ''}

      <!-- Secondary Repositories (if any) -->
      ${(b.secondaryRepos && b.secondaryRepos.length > 0) ? `
        <div>
          <div class="mono" style="font-size:0.72rem; color:var(--text-low); text-transform:uppercase; margin-bottom:8px;">Secondary Repositories</div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${b.secondaryRepos.map(sr => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); border:1px solid var(--border-hairline); border-radius:6px; padding:8px 12px; font-family:var(--font-mono); font-size:0.76rem;">
                <span style="color:#ffffff;">${sr.name}</span>
                <span style="color:var(--text-low);">⭐ ${sr.stars} • ${sr.language}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Identity & Security Fingerprint -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding-top:12px; border-top:1px solid var(--border-hairline); flex-wrap:wrap; gap:10px;">
        ${b.gpgKey ? `
          <div class="dossier-gpg-pill" title="Cryptographic GPG Fingerprint">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>GPG: ${b.gpgKey}</span>
          </div>
        ` : '<div></div>'}

        <div style="display:flex; gap:10px;">
          <a href="${b.socials.github}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.75rem; padding:5px 12px;">GitHub</a>
          ${b.socials.x ? `<a href="${b.socials.x}" target="_blank" rel="noopener" class="btn btn-secondary" style="font-size:0.75rem; padding:5px 12px;">X / Twitter</a>` : ''}
          <button class="btn btn-primary" onclick="closeModal()" style="font-size:0.75rem; padding:5px 14px;">Done</button>
        </div>
      </div>
    </div>
  `;

  overlay.classList.add('active');
};

window.openBuilderModalByHandle = function(handle) {
  const b = DEVELOPERS.find(builder => builder.handle === handle);
  if (b) {
    openBuilderModal(b.id);
  }
};

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
      <p style="font-size:0.86rem; color:#e4e4e7; margin-bottom:12px; line-height:1.5;">${p.fullSpec.arch}</p>
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-low); margin-bottom:4px;">Core Objective:</div>
      <div style="font-size:0.86rem; color:#a1a1aa;">${p.fullSpec.goal}</div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span class="mono" style="font-size:0.72rem; color:#71717a;">${p.badge}</span>
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    </div>
  `;

  overlay.classList.add('active');
};

function openPrGuideModal() {
  const content = document.getElementById('modal-dynamic-content');
  const overlay = document.getElementById('modal-overlay');

  const templateCode = `{
  id: 30,
  handle: "your_github_handle",
  name: "Your Full Name",
  squad: "systems", // "systems" | "ai" | "security" | "frontend"
  role: "Systems Engineer",
  status: "⚡ Building fast zero-copy pipelines",
  location: "City, Country (UTC+X)",
  bio: "Architecting low-latency edge tools and consensus protocols.",
  stack: ["Rust", "eBPF", "Linux"],
  featuredRepo: {
    name: "your_handle/your-repo",
    tagline: "Lock-free event streaming engine with zero cache contention.",
    stars: 1250,
    forks: 98,
    language: "Rust",
    languageColor: "#dea584",
    url: "https://github.com/your_handle/your-repo",
    cloneUrl: "git clone https://github.com/your_handle/your-repo.git",
    topics: ["rust", "systems", "perf"]
  },
  socials: {
    github: "https://github.com/your_handle",
    x: "https://x.com/your_handle"
  }
}`;

  content.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:16px;">
      <div>
        <div class="mono" style="font-size:0.72rem; color:var(--accent-blue); margin-bottom:4px;">MODULAR CONTRIBUTOR GUIDE</div>
        <h3 style="font-size:1.3rem; color:#fff; font-weight:600;">How to flex your repo in ragetech.dev</h3>
        <p style="font-size:0.85rem; color:var(--text-medium); line-height:1.5; margin-top:4px;">
          Anyone contributing to Ragetech can add or update their profile. Copy the schema below and add it to <code class="mono" style="color:#fff;">data/developers.js</code> via a Pull Request.
        </p>
      </div>

      <div style="background:#09090b; border:1px solid var(--border-hairline); border-radius:8px; padding:12px; position:relative;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span class="mono" style="font-size:0.72rem; color:var(--text-low);">data/developers.js schema template</span>
          <button class="repo-clone-copy-btn" id="js-copy-pr-template">Copy Template</button>
        </div>
        <pre class="mono" style="font-size:0.75rem; color:#d4d4d8; line-height:1.45; overflow-x:auto; max-height:260px;"><code>${escapeHtml(templateCode)}</code></pre>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px solid var(--border-hairline);">
        <a href="https://github.com/AetherrAkuma/ragetech_index" target="_blank" rel="noopener" class="btn btn-secondary">
          Open GitHub Repository ↗
        </a>
        <button class="btn btn-primary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;

  overlay.classList.add('active');

  const copyBtn = document.getElementById('js-copy-pr-template');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(templateCode).then(() => {
        showToast('Copied developer template!');
      });
    });
  }
}

// ============================================================================
// 6. UTILITIES
// ============================================================================

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
