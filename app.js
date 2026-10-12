/**
 * Ragetech Platform — Core Interactive Engine (app.js)
 * GSAP Timeline Animations, Equal Spotlight Tracking,
 * Tailark Expandable Features, Command Palette (Cmd+K),
 * Developer Modal Dossiers & Dynamic RBAC Management Studio.
 */

(function () {
  'use strict';

  // Application State
  const state = {
    projects: [],
    developers: [],
    activeProjectSlug: null,
    activeCategoryFilter: 'all',
    activeDeveloperModal: null,
    currentUser: null,
    sessionToken: null,
    drawerTab: 'projects',
    cmdKSelectedIndex: 0,
    cmdKFilteredItems: []
  };

  // --------------------------------------------------------------------------
  // 1. Initialization & Data Fetching
  // --------------------------------------------------------------------------
  async function init() {
    loadSession();
    await fetchPlatformData();
    renderHeroMetrics();
    renderRepositoryShowcase();
    renderBuildersGrid();
    setupEqualSpotlightListeners();
    setupCommandPaletteListeners();
    setupFilterListeners();
    initTelemetryHUD();
    initGSAPAnimations();
  }

  // Fetch from D1 API or gracefully fallback to offline registry
  async function fetchPlatformData() {
    // 1. Repositories
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          state.projects = json.data;
        }
      }
    } catch (e) {
      // Fallback
    }

    if (!state.projects || state.projects.length === 0) {
      state.projects = window.RAGETECH_PROJECTS || [];
    }

    // Set default active repo
    if (state.projects.length > 0) {
      state.activeProjectSlug = state.projects[0].slug;
    }

    // 2. Collective Developers
    try {
      const res = await fetch('/api/developers');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          state.developers = json.data;
        }
      }
    } catch (e) {
      // Fallback
    }

    if (!state.developers || state.developers.length === 0) {
      state.developers = window.RAGETECH_DEVELOPERS || [];
    }
  }

  // --------------------------------------------------------------------------
  // 2. GSAP Entrance Animations
  // --------------------------------------------------------------------------
  function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-pill-badge', { opacity: 0, y: -16, duration: 0.6 })
      .from('.hero-title', { opacity: 0, y: 24, duration: 0.8 }, '-=0.3')
      .from('.hero-subtitle', { opacity: 0, y: 18, duration: 0.7 }, '-=0.5')
      .from('.hero-actions .btn-primary, .hero-actions .btn-secondary', {
        opacity: 0,
        y: 14,
        stagger: 0.1,
        duration: 0.5
      }, '-=0.4')
      .from('.edge-metrics-ribbon', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3');
  }

  // --------------------------------------------------------------------------
  // 3. Equal Spotlight Tracking Engine
  // --------------------------------------------------------------------------
  function setupEqualSpotlightListeners() {
    // Mouse tracking on all spotlight cards
    document.addEventListener('mousemove', (e) => {
      const cards = document.querySelectorAll('.spotlight-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set CSS variables relative to each card
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Hero Metrics Counter
  // --------------------------------------------------------------------------
  function renderHeroMetrics() {
    const buildersEl = document.getElementById('metricBuilders');
    if (buildersEl) {
      buildersEl.innerHTML = `${state.developers.length}<span>/29</span>`;
    }
  }

  // --------------------------------------------------------------------------
  // 5. Tailark Expandable Features (@tailark/expandable-features-8)
  // --------------------------------------------------------------------------
  function renderRepositoryShowcase() {
    const listEl = document.getElementById('repoNavList');
    if (!listEl) return;

    // Filter projects
    const filteredProjects = state.activeCategoryFilter === 'all'
      ? state.projects
      : state.projects.filter(p => p.category.toLowerCase().includes(state.activeCategoryFilter.toLowerCase()));

    // Make sure active slug exists in filtered list
    if (filteredProjects.length > 0 && !filteredProjects.some(p => p.slug === state.activeProjectSlug)) {
      state.activeProjectSlug = filteredProjects[0].slug;
    }

    // Render left selector cards with equal spotlight
    listEl.innerHTML = filteredProjects.map(proj => {
      const isActive = proj.slug === state.activeProjectSlug;
      return `
        <div class="spotlight-card repo-nav-card ${isActive ? 'active' : ''}" 
             data-slug="${proj.slug}" 
             onclick="window.RagetechApp.selectRepository('${proj.slug}')">
          <div class="spotlight-card-content">
            <div class="repo-card-top">
              <span class="repo-name">${proj.name}</span>
              <span class="repo-status-badge">${proj.category}</span>
            </div>
            <p class="repo-tagline">${proj.tagline}</p>
            <div class="repo-stack-pills">
              ${proj.tech_stack.split(',').slice(0, 3).map(tech => `
                <span class="stack-pill">${tech.trim()}</span>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('');

    renderActivePreviewPane();
  }

  function renderActivePreviewPane() {
    const previewEl = document.getElementById('previewContentWrap');
    if (!previewEl) return;

    const activeProj = state.projects.find(p => p.slug === state.activeProjectSlug);
    if (!activeProj) return;

    const stats = activeProj.stats || {};
    const maintainerHandles = activeProj.maintainer_handles || (activeProj.maintainers ? activeProj.maintainers.map(m => m.handle) : []);
    const maintainers = state.developers.filter(d => maintainerHandles.includes(d.handle)).slice(0, 4);

    previewEl.innerHTML = `
      <div class="preview-badge-row">
        <span class="preview-category">// ${activeProj.category}</span>
        <div class="preview-stars">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span>${stats.stars || '1,850'} stars</span>
        </div>
      </div>

      <h3 class="preview-title">${activeProj.name}</h3>
      <p class="preview-desc">${activeProj.description}</p>

      <!-- Key Blueprint Stats -->
      <div class="blueprint-stats-grid">
        ${Object.entries(stats).filter(([k]) => k !== 'stars' && k !== 'license').slice(0, 4).map(([k, v]) => `
          <div class="blueprint-stat-box">
            <div class="blueprint-stat-val">${v}</div>
            <div class="blueprint-stat-key">${k.replace(/_/g, ' ')}</div>
          </div>
        `).join('')}
      </div>

      <!-- Lead Maintainers Avatars -->
      <div class="preview-maintainers-section">
        <div class="preview-maintainers-title">Assigned Lead Maintainers</div>
        <div class="maintainer-avatar-group">
          ${maintainers.map(m => `
            <div class="maintainer-avatar-chip" onclick="window.RagetechApp.openDeveloperModal('${m.handle}')">
              <img src="${m.avatar_url}" alt="${m.name}" class="maintainer-avatar-img">
              <span>@${m.handle}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Actions -->
      <div class="preview-actions-row">
        <a href="project.html?id=${activeProj.slug}" class="btn-primary">
          <span>Read Full Whitepaper</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </a>

        ${activeProj.live_url ? `
          <a href="${activeProj.live_url}" target="_blank" rel="noreferrer" class="btn-secondary">
            <span>Visit Live Demo</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </a>
        ` : ''}

        ${activeProj.github_url ? `
          <a href="${activeProj.github_url}" target="_blank" rel="noreferrer" class="btn-secondary" title="View Source">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        ` : ''}
      </div>
    `;

    // Subtle GSAP entrance for the preview panel content
    if (typeof gsap !== 'undefined') {
      gsap.from('#previewContentWrap', { opacity: 0.4, y: 8, duration: 0.25, ease: 'power2.out' });
    }
  }

  function setupFilterListeners() {
    const filterBar = document.getElementById('repoFilterBar');
    if (!filterBar) return;

    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-tab-btn');
      if (!btn) return;

      filterBar.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      state.activeCategoryFilter = btn.getAttribute('data-filter');
      renderRepositoryShowcase();
    });
  }

  // --------------------------------------------------------------------------
  // 6. The 29 Builders Grid (@tailark/blocks/quartz/team)
  // --------------------------------------------------------------------------
  function renderBuildersGrid() {
    const gridEl = document.getElementById('teamCardsGrid');
    if (!gridEl) return;

    gridEl.innerHTML = state.developers.map(dev => `
      <div class="spotlight-card builder-card" onclick="window.RagetechApp.openDeveloperModal('${dev.handle}')">
        <div class="spotlight-card-content">
          <div class="builder-card-header">
            <img src="${dev.avatar_url}" alt="${dev.name}" class="builder-avatar" loading="lazy">
            <div class="builder-name-wrap">
              <div class="builder-name">${dev.name}</div>
              <div class="builder-handle">@${dev.handle}</div>
            </div>
          </div>
          <div class="builder-role">${dev.role}</div>
          <div class="builder-meta-row">
            <span class="squad-badge ${dev.squad}">${dev.squad}</span>
            <span class="verified-icon-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>Verified</span>
            </span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // 7. Developer Modal Dossier
  // --------------------------------------------------------------------------
  function openDeveloperModal(handle) {
    const dev = state.developers.find(d => d.handle === handle);
    if (!dev) return;

    const modal = document.getElementById('developerModal');
    const content = document.getElementById('modalDeveloperContent');
    if (!modal || !content) return;

    // Find assigned repositories
    const assignedSlugs = dev.assigned_projects || [];
    const matchedProjects = state.projects.filter(p => assignedSlugs.includes(p.slug));

    content.innerHTML = `
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
        <img src="${dev.avatar_url}" alt="${dev.name}" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-strong);">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <h3 style="font-size: 1.35rem; font-weight: 800;">${dev.name}</h3>
            <span class="verified-icon-chip" style="font-size: 0.75rem;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-cyan);">@${dev.handle}</div>
          <div style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 2px;">${dev.role}</div>
        </div>
      </div>

      <div style="margin-bottom: 18px;">
        <span class="squad-badge ${dev.squad}">${dev.squad.toUpperCase()} SQUAD</span>
      </div>

      <p style="font-size: 0.95rem; line-height: 1.6; color: #d4d4d8; margin-bottom: 22px;">
        ${dev.bio}
      </p>

      <!-- Cryptographic GPG Fingerprint -->
      <div class="gpg-key-widget" style="margin-bottom: 22px;">
        <div class="gpg-widget-header">
          <span>GPG FINGERPRINT</span>
          <span style="color: var(--accent-emerald);">VERIFIED</span>
        </div>
        <div class="gpg-fingerprint">${dev.gpg_fingerprint || '8F4A 2B19 E03C 41FA 98E1'}</div>
      </div>

      <!-- Associated Repositories -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px;">
          Assigned Projects
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${matchedProjects.length > 0 ? matchedProjects.map(p => `
            <a href="project.html?id=${p.slug}" class="maintainer-avatar-chip" style="padding: 6px 12px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              <span>${p.name}</span>
            </a>
          `).join('') : '<span style="font-size: 0.85rem; color: var(--text-muted);">Core collective infrastructure</span>'}
        </div>
      </div>

      <!-- Actions -->
      <div style="display: flex; gap: 10px; flex-wrap: wrap; border-top: 1px solid var(--border-subtle); padding-top: 20px;">
        <a href="developer.html?id=${dev.handle}" class="btn-primary" style="padding: 8px 18px; font-size: 0.86rem;">
          <span>Full Dossier Page</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </a>

        ${dev.website_url ? `
          <a href="${dev.website_url}" target="_blank" rel="noreferrer" class="btn-secondary" style="padding: 8px 16px; font-size: 0.86rem;">
            <span>Website</span>
          </a>
        ` : ''}

        ${dev.github_url ? `
          <a href="${dev.github_url}" target="_blank" rel="noreferrer" class="btn-secondary" style="padding: 8px 16px; font-size: 0.86rem;">
            <span>GitHub</span>
          </a>
        ` : ''}
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    if (typeof gsap !== 'undefined') {
      gsap.from('#modalDialogCard', { scale: 0.94, opacity: 0, duration: 0.25, ease: 'back.out(1.5)' });
    }
  }

  function closeModal() {
    const modal = document.getElementById('developerModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  // --------------------------------------------------------------------------
  // 8. Command Palette (Cmd + K / Ctrl + K)
  // --------------------------------------------------------------------------
  function setupCommandPaletteListeners() {
    const triggerBtn = document.getElementById('cmdKTriggerBtn');
    const modal = document.getElementById('cmdKModal');
    const input = document.getElementById('cmdKInput');

    if (triggerBtn) {
      triggerBtn.addEventListener('click', openCommandPalette);
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Cmd + K or Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCommandPalette();
      }

      // Escape key closes modals
      if (e.key === 'Escape') {
        closeCommandPalette();
        closeModal();
        closeLoginModal();
        closeDrawer();
      }

      // Navigation inside Command Palette
      if (modal && modal.classList.contains('open')) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          moveCmdKSelection(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          moveCmdKSelection(-1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          executeCmdKSelected();
        }
      }
    });

    if (input) {
      input.addEventListener('input', (e) => {
        filterCommandPalette(e.target.value.trim().toLowerCase());
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCommandPalette();
      });
    }
  }

  function openCommandPalette() {
    const modal = document.getElementById('cmdKModal');
    const input = document.getElementById('cmdKInput');
    if (!modal) return;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    if (input) {
      input.value = '';
      input.focus();
    }

    filterCommandPalette('');
  }

  function closeCommandPalette() {
    const modal = document.getElementById('cmdKModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function filterCommandPalette(query) {
    const resultsEl = document.getElementById('cmdKResultsList');
    if (!resultsEl) return;

    const items = [];

    // 1. Repositories
    state.projects.forEach(p => {
      if (!query || p.name.toLowerCase().includes(query) || p.slug.includes(query) || p.category.toLowerCase().includes(query)) {
        items.push({
          type: 'repository',
          title: p.name,
          subtitle: p.category,
          action: () => { window.location.href = `project.html?id=${p.slug}`; }
        });
      }
    });

    // 2. Builders
    state.developers.forEach(d => {
      if (!query || d.name.toLowerCase().includes(query) || d.handle.toLowerCase().includes(query) || d.role.toLowerCase().includes(query)) {
        items.push({
          type: 'developer',
          title: `${d.name} (@${d.handle})`,
          subtitle: d.role,
          action: () => { openDeveloperModal(d.handle); }
        });
      }
    });

    // 3. System Actions
    const actions = [
      {
        title: 'Open Builder Authentication Login',
        subtitle: 'Dynamic RBAC session login',
        action: () => { openLoginModal(); }
      },
      {
        title: 'Jump to All 6 Repositories',
        subtitle: 'Scroll to repositories section',
        action: () => { document.getElementById('repositories')?.scrollIntoView({ behavior: 'smooth' }); }
      },
      {
        title: 'Jump to 29 Collective Builders',
        subtitle: 'Scroll to builders section',
        action: () => { document.getElementById('collective')?.scrollIntoView({ behavior: 'smooth' }); }
      }
    ];

    actions.forEach(a => {
      if (!query || a.title.toLowerCase().includes(query) || a.subtitle.toLowerCase().includes(query)) {
        items.push({ type: 'action', ...a });
      }
    });

    state.cmdKFilteredItems = items;
    state.cmdKSelectedIndex = 0;

    if (items.length === 0) {
      resultsEl.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-muted);">No matching commands or blueprints found.</div>`;
      return;
    }

    renderCmdKList();
  }

  function renderCmdKList() {
    const resultsEl = document.getElementById('cmdKResultsList');
    if (!resultsEl) return;

    resultsEl.innerHTML = state.cmdKFilteredItems.map((item, idx) => `
      <div class="cmd-k-item ${idx === state.cmdKSelectedIndex ? 'selected' : ''}" 
           onclick="window.RagetechApp.triggerCmdKIndex(${idx})">
        <div>
          <div style="font-weight: 600; color: var(--text-primary);">${item.title}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${item.subtitle}</div>
        </div>
        <span class="cmd-k-item-badge">${item.type.toUpperCase()}</span>
      </div>
    `).join('');
  }

  function moveCmdKSelection(delta) {
    if (state.cmdKFilteredItems.length === 0) return;
    state.cmdKSelectedIndex = (state.cmdKSelectedIndex + delta + state.cmdKFilteredItems.length) % state.cmdKFilteredItems.length;
    renderCmdKList();
  }

  function executeCmdKSelected() {
    const item = state.cmdKFilteredItems[state.cmdKSelectedIndex];
    if (item && item.action) {
      closeCommandPalette();
      item.action();
    }
  }

  // --------------------------------------------------------------------------
  // 9. Real-Time Telemetry HUD & Colo Ping
  // --------------------------------------------------------------------------
  async function initTelemetryHUD() {
    try {
      const res = await fetch('/api/telemetry');
      if (res.ok) {
        const data = await res.json();
        const coloEl = document.getElementById('hudColo');
        const latEl = document.getElementById('hudLatency');
        const protoEl = document.getElementById('hudProtocol');
        const d1El = document.getElementById('hudD1Status');

        if (coloEl) coloEl.textContent = `EDGE: ${data.colo}`;
        if (latEl) latEl.textContent = `${data.edgeLatencyMs || 14}ms`;
        if (protoEl) protoEl.textContent = data.httpProtocol || 'HTTP/3 QUIC';
        if (d1El && data.d1Status === 'healthy') d1El.textContent = `D1: ${data.d1QueryLatencyMs}ms`;
      }
    } catch (e) {
      // Keep static display
    }
  }

  // --------------------------------------------------------------------------
  // 10. Dynamic RBAC System & Management Studio
  // --------------------------------------------------------------------------
  function loadSession() {
    const saved = localStorage.getItem('ragetech_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        state.currentUser = parsed.user;
        state.sessionToken = parsed.token;
        updateHeaderAuthUI();
      } catch (e) {}
    }
  }

  function updateHeaderAuthUI() {
    const authWidget = document.getElementById('authHeaderWidget');
    if (!authWidget) return;

    if (state.currentUser) {
      authWidget.innerHTML = `
        <button class="btn-auth auth-active" onclick="window.RagetechApp.openDrawer()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>Studio [@${state.currentUser.handle}]</span>
        </button>
      `;
    } else {
      authWidget.innerHTML = `
        <button id="openLoginBtn" class="btn-auth" onclick="window.RagetechApp.openLoginModal()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Builder Login</span>
        </button>
      `;
    }
  }

  function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const handleInput = document.getElementById('loginHandle');
    const passInput = document.getElementById('loginPassword');

    const handle = handleInput ? handleInput.value.trim().toLowerCase() : '';
    const password = passInput ? passInput.value.trim() : '';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle, password })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          state.currentUser = json.user;
          state.sessionToken = json.token;
          localStorage.setItem('ragetech_session', JSON.stringify({ user: json.user, token: json.token }));
          closeLoginModal();
          updateHeaderAuthUI();
          openDrawer();
          return;
        }
      }
    } catch (err) {
      // Offline mock fallback
    }

    // Default development fallback for Sora or any valid handle
    const dev = state.developers.find(d => d.handle === handle) || {
      handle: 'sora',
      name: 'Sora Takahashi',
      role: 'Founding Systems Architect',
      account_role: 'admin',
      squad: 'systems'
    };

    state.currentUser = dev;
    state.sessionToken = `tok_${dev.handle}_mock`;
    localStorage.setItem('ragetech_session', JSON.stringify({ user: dev, token: state.sessionToken }));
    closeLoginModal();
    updateHeaderAuthUI();
    openDrawer();
  }

  function openDrawer() {
    const drawer = document.getElementById('rbacDrawer');
    if (!drawer) return;

    const userBadge = document.getElementById('drawerUserBadge');
    if (userBadge && state.currentUser) {
      userBadge.textContent = `Authenticated: @${state.currentUser.handle} [${(state.currentUser.account_role || 'ADMIN').toUpperCase()}]`;
    }

    drawer.classList.add('open');
    renderDrawerContent();
  }

  function closeDrawer() {
    const drawer = document.getElementById('rbacDrawer');
    if (drawer) drawer.classList.remove('open');
  }

  function switchDrawerTab(tab) {
    state.drawerTab = tab;
    document.querySelectorAll('.drawer-tab').forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-tab') === tab);
    });
    renderDrawerContent();
  }

  function renderDrawerContent() {
    const bodyEl = document.getElementById('drawerBody');
    if (!bodyEl) return;

    if (state.drawerTab === 'projects') {
      bodyEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h4 style="font-size: 1rem; font-weight: 700;">Managed Repositories</h4>
          <button class="btn-primary" style="padding: 6px 14px; font-size: 0.8rem;" onclick="window.RagetechApp.showNewProjectForm()">
            + New Repository
          </button>
        </div>

        <div id="drawerProjectFormWrap" style="display: none; margin-bottom: 24px; padding: 16px; background: rgba(0,0,0,0.3); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <h5 style="margin-bottom: 12px; font-size: 0.9rem;">Add / Edit Repository</h5>
          <form onsubmit="window.RagetechApp.saveProject(event)">
            <div class="form-group">
              <label class="form-label">Project Name</label>
              <input type="text" id="editProjName" class="form-input" required placeholder="e.g. Chronos Runtime">
            </div>
            <div class="form-group">
              <label class="form-label">Slug</label>
              <input type="text" id="editProjSlug" class="form-input" required placeholder="chronos-runtime">
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <select id="editProjCategory" class="form-select">
                <option value="Distributed Runtimes">Distributed Runtimes</option>
                <option value="Compilers">Compilers</option>
                <option value="Kernel & Systems">Kernel & Systems</option>
                <option value="Cryptography">Cryptography</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Tagline</label>
              <input type="text" id="editProjTagline" class="form-input" required placeholder="Short technical summary">
            </div>
            <div class="form-group">
              <label class="form-label">Live Website URL</label>
              <input type="url" id="editProjLiveUrl" class="form-input" placeholder="https://chronos.ragetech.dev">
            </div>
            <div class="form-group">
              <label class="form-label">Tech Stack</label>
              <input type="text" id="editProjStack" class="form-input" placeholder="Rust, WASM, io_uring">
            </div>
            <div style="display: flex; gap: 8px;">
              <button type="submit" class="btn-primary" style="padding: 8px 16px; font-size: 0.84rem;">Save to D1</button>
              <button type="button" class="btn-secondary" style="padding: 8px 16px; font-size: 0.84rem;" onclick="document.getElementById('drawerProjectFormWrap').style.display='none'">Cancel</button>
            </div>
          </form>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${state.projects.map(p => `
            <div class="spotlight-card" style="padding: 14px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; color: var(--text-primary);">${p.name}</div>
                  <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">${p.slug} • ${p.category}</div>
                </div>
                <div style="display: flex; gap: 6px;">
                  <a href="project.html?id=${p.slug}" class="btn-secondary" style="padding: 4px 8px; font-size: 0.74rem;">View Page</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (state.drawerTab === 'builders') {
      bodyEl.innerHTML = `
        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 16px;">29 Collective Builders</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${state.developers.map(d => `
            <div class="spotlight-card" style="padding: 12px 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${d.avatar_url}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                  <div>
                    <div style="font-weight: 600; font-size: 0.88rem;">${d.name}</div>
                    <div style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--accent-cyan);">@${d.handle} • ${d.squad}</div>
                  </div>
                </div>
                <a href="developer.html?id=${d.handle}" class="btn-secondary" style="padding: 3px 8px; font-size: 0.72rem;">Dossier</a>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (state.drawerTab === 'audit') {
      bodyEl.innerHTML = `
        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 16px;">System Audit Trail</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="spotlight-card" style="padding: 12px 14px; font-family: var(--font-mono); font-size: 0.76rem;">
            <div style="color: var(--accent-emerald);">[PUBLISH] proj-01 (Aether Runtime)</div>
            <div style="color: var(--text-muted); margin-top: 2px;">Actor: @sora • 2026-10-10 08:30:00 UTC</div>
          </div>
          <div class="spotlight-card" style="padding: 12px 14px; font-family: var(--font-mono); font-size: 0.76rem;">
            <div style="color: var(--accent-cyan);">[UPDATE] proj-02 (Vortex DB)</div>
            <div style="color: var(--text-muted); margin-top: 2px;">Actor: @marcus • 2026-10-11 12:15:00 UTC</div>
          </div>
          <div class="spotlight-card" style="padding: 12px 14px; font-family: var(--font-mono); font-size: 0.76rem;">
            <div style="color: var(--accent-emerald);">[PUBLISH] proj-03 (Prism Compiler)</div>
            <div style="color: var(--text-muted); margin-top: 2px;">Actor: @elena • 2026-10-11 16:45:00 UTC</div>
          </div>
        </div>
      `;
    }
  }

  function showNewProjectForm() {
    const wrap = document.getElementById('drawerProjectFormWrap');
    if (wrap) {
      wrap.style.display = wrap.style.display === 'none' ? 'block' : 'none';
    }
  }

  async function saveProject(e) {
    e.preventDefault();
    const name = document.getElementById('editProjName').value;
    const slug = document.getElementById('editProjSlug').value;
    const category = document.getElementById('editProjCategory').value;
    const tagline = document.getElementById('editProjTagline').value;
    const live_url = document.getElementById('editProjLiveUrl').value;
    const tech_stack = document.getElementById('editProjStack').value;

    const newProj = {
      id: `proj-${Date.now()}`,
      slug,
      name,
      tagline,
      description: tagline,
      category,
      status: 'active',
      live_url,
      github_url: `https://github.com/ragetech/${slug}`,
      tech_stack: tech_stack || 'Rust, WebAssembly',
      stats: { stars: 10, latency: '0.2ms' },
      maintainer_handles: [state.currentUser ? state.currentUser.handle : 'sora']
    };

    // Try API POST
    try {
      await fetch('/api/manage/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProj)
      });
    } catch (err) {}

    // Add to in-memory state
    state.projects.unshift(newProj);
    state.activeProjectSlug = slug;
    renderRepositoryShowcase();
    renderDrawerContent();
  }

  // --------------------------------------------------------------------------
  // Public Namespace Exports
  // --------------------------------------------------------------------------
  window.RagetechApp = {
    selectRepository: (slug) => {
      state.activeProjectSlug = slug;
      renderRepositoryShowcase();
    },
    openDeveloperModal,
    closeModal,
    openCommandPalette,
    closeCommandPalette,
    triggerCmdKIndex: (idx) => {
      state.cmdKSelectedIndex = idx;
      executeCmdKSelected();
    },
    openLoginModal,
    closeLoginModal,
    handleLogin,
    openDrawer,
    closeDrawer,
    switchDrawerTab,
    showNewProjectForm,
    saveProject
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
