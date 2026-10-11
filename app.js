/**
 * RAGETECH.DEV — Application Logic
 * High-craft engineering collective directory, sticky scroll project inspector,
 * and keyboard-accessible UI interactions.
 */

// ============================================================================
// 1. INCUBATED REPOSITORIES (PROJECT SPECIFICATIONS)
// ============================================================================

const PROJECTS = [
  {
    id: 'hyperion',
    name: 'Hyperion',
    repo: 'ragetech/hyperion',
    badge: 'v0.9.4-alpha',
    summary: 'Ultra-low-latency event streaming engine written in pure Rust. Built on lock-free memory ring buffers and Linux io_uring kernel bypass.',
    specs: [
      { label: 'Throughput', val: '1.42M events/sec / core' },
      { label: 'Latency (p99)', val: '0.24ms' },
      { label: 'Memory Overhead', val: '< 16 MB RSS baseline' },
      { label: 'Runtime Stack', val: 'Rust / Tokio / io_uring' }
    ],
    previewTitle: 'telemetry_sink.rs',
    previewType: 'code',
    previewContent: `// Socket ring buffer initialization
let ring = IoUring::builder()
    .setup_sqpoll(1000)
    .build(4096)?;

let stream = HyperionStream::bind("0.0.0.0:8443")
    .with_zero_copy()
    .with_simd_parser::<BatchSize<64>>()
    .spawn_workers(16);

println!("Hyperion worker pool online: 16 rings active");`,
    previewMeta: 'Cargo.lock: tokio v1.42, io-uring v0.7.4',
    assignees: ['alexv', 'dkovacs', 'owright', 'fzaid'],
    fullSpec: {
      arch: 'Lock-free single-producer multi-consumer ring buffer mapped into shared physical memory.',
      goal: 'Eliminate JVM garbage-collection pauses in distributed event pipelines.',
      status: 'Benchmarking on 100GbE bare-metal testbed.'
    }
  },
  {
    id: 'pulseos',
    name: 'PulseOS KV',
    repo: 'ragetech/pulseos',
    badge: 'v0.8.1-dev',
    summary: 'Distributed key-value store engineered for sovereign edge clusters. Combines Raft consensus with eBPF network acceleration.',
    specs: [
      { label: 'Consensus', val: 'Multi-Raft v2 with Learner nodes' },
      { label: 'Cold Boot', val: '12ms on Firecracker microVM' },
      { label: 'Replication', val: 'Synchronous edge quorum (3 of 5)' },
      { label: 'Runtime Stack', val: 'Go / Raft / eBPF / RocksDB' }
    ],
    previewTitle: 'cluster_state.json',
    previewType: 'json',
    previewContent: `{
  "cluster_id": "pulse-edge-us-east",
  "raft_term": 8942,
  "leader_node": "node-01.ragetech.internal",
  "quorum_status": "5/5 synchronized",
  "replication_lag": "< 0.12ms",
  "ebpf_filter": "ACTIVE (zero-copy socket pass)"
}`,
    previewMeta: 'Cluster: 5 nodes across 3 availability zones',
    assignees: ['elena', 'tariqm', 'nnour', 'gsantos'],
    fullSpec: {
      arch: 'Log-structured merge tree engine optimized for NVMe write cycles with eBPF network acceleration.',
      goal: 'Zero-downtime persistence during sporadic edge partitions.',
      status: 'Formal verification with Jepsen test suite.'
    }
  },
  {
    id: 'chimera',
    name: 'Chimera Runtime',
    repo: 'ragetech/chimera',
    badge: 'v0.4.0-preview',
    summary: 'Deterministic multi-agent execution kernel. Coordinates asynchronous cognitive workflows with verified memory checkpoints.',
    specs: [
      { label: 'Execution Model', val: 'Asynchronous DAG with state rewind' },
      { label: 'Context Engine', val: 'Memory-mapped vector cache (2M tokens)' },
      { label: 'Inference Target', val: 'Distributed vLLM / TensorRT-LLM' },
      { label: 'Runtime Stack', val: 'Python / PyTorch / CUDA / gRPC' }
    ],
    previewTitle: 'dag_trace.log',
    previewType: 'log',
    previewContent: `[00:00:00.012] SPAN: root_dispatch -> worker_pool [16 agents]
[00:00:00.045] STEP: retrieval_pass (vector_index: 4,096 docs) -> 1.4ms
[00:00:00.118] STEP: model_inference (batch_size=8) -> 64.2ms
[00:00:00.134] STEP: verification_gate (schema_assert=PASS)
[00:00:00.141] RESULT: DAG complete (total: 129ms, memory: 48MB)`,
    previewMeta: 'GPU: CUDA 12.6 / TensorRT 10.4',
    assignees: ['mchen', 'lsilva', 'psharma', 'nbrooks'],
    fullSpec: {
      arch: 'Deterministic directed acyclic graph executor with checkpoint-rollback safety.',
      goal: 'Eliminate non-deterministic failure states in multi-agent pipelines.',
      status: 'Testing with internal code analysis agents.'
    }
  },
  {
    id: 'eclipse',
    name: 'Eclipse UI',
    repo: 'ragetech/eclipse-ui',
    badge: 'v1.0.0-rc2',
    summary: 'Sovereign design system and headless interface primitives designed specifically for dark-mode developer environments.',
    specs: [
      { label: 'Primitives', val: '64 accessible headless components' },
      { label: 'Payload', val: '12.4 KB gzip (zero dependencies)' },
      { label: 'Accessibility', val: '100% WCAG 2.2 AAA compliant' },
      { label: 'Runtime Stack', val: 'TypeScript / WebGL / CSS Tokens' }
    ],
    previewTitle: 'tokens.css',
    previewType: 'css',
    previewContent: `:root {
  --canvas: #09090b;
  --surface: #141418;
  --hairline: rgba(255, 255, 255, 0.08);
  --text-high: #f4f4f5;
  --text-faint: #52525b;
  --contrast-ratio: 18.4; /* WCAG AAA verified */
}`,
    previewMeta: 'Validated across Safari, Firefox, Chromium',
    assignees: ['slindqvist', 'cdubois', 'mtakahashi', 'crossi'],
    fullSpec: {
      arch: 'Framework-agnostic headless primitives paired with GPU-accelerated CSS shaders.',
      goal: 'Sub-millisecond interaction frames for high-density developer tools.',
      status: 'Shipped as the design foundation for ragetech.dev.'
    }
  },
  {
    id: 'vortex',
    name: 'Vortex Scheduler',
    repo: 'ragetech/vortex',
    badge: 'v0.7.2-beta',
    summary: 'High-throughput asynchronous distributed task scheduler. Handles over 50M scheduled jobs daily with microsecond jitter.',
    specs: [
      { label: 'Schedule Volume', val: '50M+ jobs / 24 hours' },
      { label: 'Timer Jitter', val: '< 12 microseconds' },
      { label: 'Fault Recovery', val: 'Sub-second leader failover' },
      { label: 'Runtime Stack', val: 'Rust / Tokio / Kafka / Redis' }
    ],
    previewTitle: 'schedule_manifest.yaml',
    previewType: 'yaml',
    previewContent: `jobs:
  - id: cluster-telemetry-flush
    cron: "*/5 * * * *"
    timeout: "15s"
    jitter_budget: "50us"
    retry:
      max_attempts: 3
      backoff: exponential`,
    previewMeta: 'Queue status: 0 backlog, 128 workers healthy',
    assignees: ['liamo', 'skim', 'vnovak'],
    fullSpec: {
      arch: 'Hierarchical timing wheels with Raft-synchronized heartbeat leases.',
      goal: 'Replace heavyweight database lock-polling schedulers.',
      status: 'Running in multi-region production clusters.'
    }
  },
  {
    id: 'aether',
    name: 'Aether P2P',
    repo: 'ragetech/aether',
    badge: 'v0.3.5-alpha',
    summary: 'P2P collaborative CRDT sync mesh for browser and native applications. Converges distributed states without central servers.',
    specs: [
      { label: 'Peer Latency', val: '< 8ms over encrypted WebRTC' },
      { label: 'Conflict Rate', val: '0.00% (Automerge CRDT)' },
      { label: 'Discovery', val: 'Encrypted DHT via libp2p' },
      { label: 'Runtime Stack', val: 'Rust / WASM / WebRTC / CRDT' }
    ],
    previewTitle: 'webrtc_mesh.log',
    previewType: 'log',
    previewContent: `[18:24:02.102] PEER_DISCOVERY: ICE candidate gathered -> 192.88.99.1:51820
[18:24:02.110] HANDSHAKE: authenticated with Curve25519 key
[18:24:02.114] CRDT_SYNC: Vector clock synchronized (delta=0)
[18:24:02.116] STATUS: P2P mesh converged (4 active nodes)`,
    previewMeta: 'Mesh topology: 4 peers connected directly',
    assignees: ['mpatel', 'zmorales', 'ewatson'],
    fullSpec: {
      arch: 'Conflict-Free Replicated Data Types combined with direct peer-to-peer data channels.',
      goal: 'Local-first collaborative editing with zero cloud dependency.',
      status: 'Compiling to WebAssembly for browser clients.'
    }
  }
];

// ============================================================================
// 2. THE 29 BUILDERS DIRECTORY (PRECISE, AUTHENTIC ROSTER)
// ============================================================================

const BUILDERS = [
  { id: 1, handle: 'alexv', name: 'Alex Vance', squad: 'systems', role: 'Lead Systems Architect', focus: 'Hyperion', stack: ['Rust', 'io_uring', 'SIMD'], bio: 'Lock-free systems and kernel bypass architect. 12+ years building low-latency trading and telemetry runtimes.' },
  { id: 2, handle: 'elena', name: 'Elena Rostova', squad: 'systems', role: 'Distributed Systems Lead', focus: 'PulseOS KV', stack: ['Go', 'Raft', 'eBPF'], bio: 'Consensus protocols researcher and distributed storage author.' },
  { id: 3, handle: 'mchen', name: 'Marcus Chen', squad: 'ai', role: 'AI Systems Architect', focus: 'Chimera Runtime', stack: ['Python', 'CUDA', 'PyTorch'], bio: 'High-throughput inference batching and agent runtime developer.' },
  { id: 4, handle: 'slindqvist', name: 'Sofia Lindqvist', squad: 'frontend', role: 'Principal Interface Engineer', focus: 'Eclipse UI', stack: ['TypeScript', 'WebGL', 'CSS'], bio: 'Developer ergonomics, accessibility craft, and sub-millisecond interaction design.' },
  { id: 5, handle: 'tariqm', name: 'Tariq Al-Mansoor', squad: 'systems', role: 'Storage Engine Engineer', focus: 'PulseOS KV', stack: ['C++', 'Rust', 'RocksDB'], bio: 'NVMe write optimization, LSM tree compactions, and memory-mapped persistence.' },
  { id: 6, handle: 'fhansen', name: 'Freja Hansen', squad: 'security', role: 'Security & Cryptography Lead', focus: 'Protocol Security', stack: ['Rust', 'TLS', 'Formal Verification'], bio: 'Cryptographic guarantees and protocol fuzzing across core runtimes.' },
  { id: 7, handle: 'liamo', name: 'Liam O\'Connor', squad: 'systems', role: 'Pipeline Engineer', focus: 'Vortex Scheduler', stack: ['Rust', 'Kafka', 'Tokio'], bio: 'Microsecond dispatchers and lock-free timer queues.' },
  { id: 8, handle: 'mpatel', name: 'Maya Patel', squad: 'systems', role: 'Network Protocols Specialist', focus: 'Aether P2P', stack: ['Go', 'QUIC', 'libp2p'], bio: 'Peer-to-peer routing, hole punching, and distributed hash tables.' },
  { id: 9, handle: 'htanaka', name: 'Hiroshi Tanaka', squad: 'security', role: 'Kernel & MicroVM Engineer', focus: 'Cloud Sandboxes', stack: ['C', 'Linux Kernel', 'KVM'], bio: 'Firecracker virtualization and secure seccomp containment.' },
  { id: 10, handle: 'cdubois', name: 'Chloe Dubois', squad: 'frontend', role: 'Creative Technologist', focus: 'Eclipse UI', stack: ['Three.js', 'GLSL', 'Design Systems'], bio: 'Bespoke dark-mode shaders and hardware-accelerated interface primitives.' },
  { id: 11, handle: 'dkovacs', name: 'David Kovacs', squad: 'systems', role: 'Low-Latency IPC Engineer', focus: 'Hyperion', stack: ['C++', 'Shared Memory', 'IPC'], bio: 'CPU cache line alignment and zero-copy memory transport.' },
  { id: 12, handle: 'nnour', name: 'Nadia Nour', squad: 'systems', role: 'Consensus Verification Specialist', focus: 'PulseOS KV', stack: ['TLA+', 'Rust', 'Paxos'], bio: 'Formal validation of edge consensus states under network partitions.' },
  { id: 13, handle: 'lsilva', name: 'Lucas Silva', squad: 'ai', role: 'Agent Runtime Developer', focus: 'Chimera Runtime', stack: ['Python', 'AsyncIO', 'Vector DB'], bio: 'Deterministic execution graphs and autonomous workflow routing.' },
  { id: 14, handle: 'aivanova', name: 'Anya Ivanova', squad: 'security', role: 'Compiler & Static Analysis Dev', focus: 'Compiler Tooling', stack: ['Rust', 'LLVM', 'AST Parsing'], bio: 'Taint analysis algorithms and compile-time dependency validation.' },
  { id: 15, handle: 'skim', name: 'Samuel Kim', squad: 'systems', role: 'WebAssembly Specialist', focus: 'Vortex Scheduler', stack: ['WASM', 'WASI', 'Rust'], bio: 'Compiling edge tasks to isolated WebAssembly sandbox instances.' },
  { id: 16, handle: 'zmorales', name: 'Zara Morales', squad: 'frontend', role: 'CRDT & Sync Engineer', focus: 'Aether P2P', stack: ['TypeScript', 'Automerge', 'WebSockets'], bio: 'Local-first synchronization algorithms and offline conflict resolution.' },
  { id: 17, handle: 'jbecker', name: 'Julian Becker', squad: 'security', role: 'Infrastructure Automation Dev', focus: 'NixOS Clusters', stack: ['NixOS', 'Terraform', 'Bare-Metal'], bio: 'Reproducible hermetic deployments across bare-metal server fleets.' },
  { id: 18, handle: 'psharma', name: 'Priya Sharma', squad: 'ai', role: 'GPU Acceleration Engineer', focus: 'Chimera Runtime', stack: ['CUDA', 'C++', 'TensorRT'], bio: 'Writing custom CUDA kernels to minimize transformer attention latency.' },
  { id: 19, handle: 'owright', name: 'Oliver Wright', squad: 'systems', role: 'Observability Specialist', focus: 'Hyperion', stack: ['eBPF', 'OpenTelemetry', 'Rust'], bio: 'Low-overhead profiling hooks and real-time distributed tracing.' },
  { id: 20, handle: 'mtakahashi', name: 'Mia Takahashi', squad: 'frontend', role: 'Design Systems Architect', focus: 'Eclipse UI', stack: ['Figma', 'CSS Architecture', 'A11y'], bio: 'Micro-interactions, focus state optics, and WCAG AAA compliance.' },
  { id: 21, handle: 'gsantos', name: 'Gabriel Santos', squad: 'systems', role: 'Memory Internals Specialist', focus: 'PulseOS KV', stack: ['Go Runtime', 'jemalloc', 'C'], bio: 'Eliminating GC allocation pauses in persistent edge processes.' },
  { id: 22, handle: 'lhaddad', name: 'Leila Haddad', squad: 'security', role: 'Offensive Security Researcher', focus: 'Protocol Audits', stack: ['AFL++', 'Fuzzing', 'Reverse Eng'], bio: 'Simulating adversarial edge attacks to harden ragetech codebases.' },
  { id: 23, handle: 'vnovak', name: 'Viktor Novak', squad: 'systems', role: 'Async Runtimes Developer', focus: 'Vortex Scheduler', stack: ['Rust', 'Tokio Internals', 'Priority Queues'], bio: 'Work-stealing schedulers and timer wheel precision optimization.' },
  { id: 24, handle: 'ewatson', name: 'Emily Watson', squad: 'systems', role: 'Mesh Network Engineer', focus: 'Aether P2P', stack: ['libp2p', 'GossipSub', 'Go'], bio: 'Symmetric NAT traversal and distributed topology clustering.' },
  { id: 25, handle: 'ksato', name: 'Kenji Sato', squad: 'security', role: 'Virtualization Developer', focus: 'MicroVM Daemon', stack: ['Rust', 'KVM', 'containerd'], bio: 'Guest-host communication channels via virtual sockets (vsock).' },
  { id: 26, handle: 'crossi', name: 'Camilla Rossi', squad: 'frontend', role: 'Platform UI Engineer', focus: 'ragetech.dev', stack: ['TypeScript', 'Next.js', 'CSS'], bio: 'Clean typography, fast page delivery, and developer documentation.' },
  { id: 27, handle: 'nbrooks', name: 'Nathan Brooks', squad: 'ai', role: 'WebGPU & Compute Dev', focus: 'Chimera Runtime', stack: ['WebGPU', 'WGSL', 'Rust'], bio: 'Executing quantized neural weights directly inside browser GPU shaders.' },
  { id: 28, handle: 'fzaid', name: 'Farah Zaid', squad: 'systems', role: 'Performance Profiling Dev', focus: 'Hyperion', stack: ['Flamegraphs', 'Linux Perf', 'SIMD'], bio: 'Instruction-level CPU optimization and branch prediction tuning.' },
  { id: 29, handle: 'oberg', name: 'Oscar Berg', squad: 'frontend', role: 'Developer Experience Lead', focus: 'CLI & TUI Tools', stack: ['Go', 'Terminal UX', 'Rust'], bio: 'Keyboard-driven ergonomics and terminal user interfaces.' }
];

// Current active view state: 'grid' or 'table'
let currentDirectoryView = 'grid';

// ============================================================================
// 3. INITIALIZATION & EVENT BINDINGS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  renderStickySidebar();
  renderProjectEntries();
  initStickyScrollObserver();

  renderBuildersDirectory('all', '');
  initDirectoryControls();
  initKeyboardShortcuts();
  initDomainCopy();
  initModals();
  initHeaderScroll();
});

// Render Projects Sticky Sidebar Navigation
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

// Render Project Entries in Main Column
function renderProjectEntries() {
  const container = document.getElementById('projects-stack');
  if (!container) return;

  container.innerHTML = PROJECTS.map((p, idx) => {
    // Generate avatar monograms for assignees
    const assigneeAvatars = p.assignees.map(handle => {
      const b = BUILDERS.find(builder => builder.handle === handle);
      const initials = b ? b.name.split(' ').map(n => n[0]).join('') : handle.substring(0, 2).toUpperCase();
      return `<div class="builder-pill-avatar" title="${b ? `${b.name} (@${b.handle})` : handle}">${initials}</div>`;
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
            <div class="project-assignees-avatars" title="Assigned Contributors">
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

// Tailark Dusk Scroll-Highlight Observer
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
  // Update sidebar state
  document.querySelectorAll('.sidebar-nav-button').forEach(btn => {
    if (btn.getAttribute('data-project-id') === id) {
      btn.setAttribute('data-state', 'active');
    } else {
      btn.removeAttribute('data-state');
    }
  });

  // Update card border highlight state
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
// 4. THE 29 BUILDERS DIRECTORY LOGIC
// ============================================================================

function renderBuildersDirectory(squad = 'all', query = '') {
  const gridContainer = document.getElementById('builders-grid');
  const tableContainer = document.getElementById('builders-table-wrap');
  const counterEl = document.getElementById('builders-count-badge');

  const q = query.toLowerCase().trim();

  const filtered = BUILDERS.filter(b => {
    const matchSquad = squad === 'all' || b.squad === squad;
    const matchQuery = !q || 
      b.name.toLowerCase().includes(q) ||
      b.handle.toLowerCase().includes(q) ||
      b.role.toLowerCase().includes(q) ||
      b.focus.toLowerCase().includes(q) ||
      b.stack.some(s => s.toLowerCase().includes(q));
    return matchSquad && matchQuery;
  });

  if (counterEl) {
    counterEl.textContent = `${filtered.length} of 29 Builders`;
  }

  // 1. Render Grid View
  if (gridContainer) {
    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 0; text-align: center; color: var(--text-low); font-size: 0.88rem;">
          No builders found matching "${escapeHtml(query)}"
        </div>
      `;
    } else {
      gridContainer.innerHTML = filtered.map(b => `
        <div class="builder-card-clean" onclick="openBuilderModal(${b.id})">
          <div class="builder-card-header">
            <span class="builder-handle-tag">@${b.handle}</span>
            <span class="builder-id-badge">${String(b.id).padStart(2, '0')}/29</span>
          </div>
          <div style="font-size:0.86rem; color:var(--text-high); font-weight:500; margin-bottom:2px;">${b.name}</div>
          <div class="builder-role-label">${b.role}</div>
          <div style="font-size:0.75rem; color:var(--text-low); margin-bottom:12px; font-family:var(--font-mono);">
            Focus: <span style="color:var(--text-medium);">${b.focus}</span>
          </div>
          <div class="builder-tag-row">
            ${b.stack.map(s => `<span class="builder-tech-chip">${s}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }
  }

  // 2. Render Table Directory View
  if (tableContainer) {
    tableContainer.innerHTML = `
      <table class="builders-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Handle & Name</th>
            <th>Role</th>
            <th>Primary Stack</th>
            <th>Focus</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(b => `
            <tr onclick="openBuilderModal(${b.id})">
              <td class="mono" style="color:var(--text-low);">${String(b.id).padStart(2, '0')}</td>
              <td>
                <span style="color:var(--text-high); font-weight:500;">@${b.handle}</span>
                <span style="color:var(--text-low); margin-left:8px;">(${b.name})</span>
              </td>
              <td>${b.role}</td>
              <td class="mono" style="color:var(--text-low); font-size:0.76rem;">${b.stack.join(', ')}</td>
              <td class="mono" style="color:var(--text-high);">${b.focus}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}

// Directory Controls: Filter Tabs, Search & Grid/Table Switcher
function initDirectoryControls() {
  const tabs = document.querySelectorAll('.squad-filter-btn');
  const searchInput = document.getElementById('builder-search-input');
  const gridViewBtn = document.getElementById('view-grid-btn');
  const tableViewBtn = document.getElementById('view-table-btn');

  // Squad Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const squad = tab.getAttribute('data-squad');
      renderBuildersDirectory(squad, searchInput ? searchInput.value : '');
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeTab = document.querySelector('.squad-filter-btn.active');
      const squad = activeTab ? activeTab.getAttribute('data-squad') : 'all';
      renderBuildersDirectory(squad, e.target.value);
    });
  }

  // View Switcher (Grid vs Table)
  if (gridViewBtn && tableViewBtn) {
    gridViewBtn.addEventListener('click', () => {
      currentDirectoryView = 'grid';
      gridViewBtn.classList.add('active');
      tableViewBtn.classList.remove('active');
      document.getElementById('builders-grid').style.display = 'grid';
      document.getElementById('builders-table-wrap').style.display = 'none';
    });

    tableViewBtn.addEventListener('click', () => {
      currentDirectoryView = 'table';
      tableViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
      document.getElementById('builders-grid').style.display = 'none';
      document.getElementById('builders-table-wrap').style.display = 'block';
    });
  }
}

// Keyboard shortcuts (e.g. '/' to focus search)
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // If not in an input, pressing '/' focuses the builder search
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

// ============================================================================
// 5. MODAL SYSTEM & TOAST NOTIFICATIONS
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

window.openBuilderModal = function(id) {
  const b = BUILDERS.find(builder => builder.id === id);
  if (!b) return;

  const content = document.getElementById('modal-dynamic-content');
  const overlay = document.getElementById('modal-overlay');

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
      <span class="mono" style="font-size:0.8rem; color:#fff; font-weight:600;">@${b.handle}</span>
      <span class="mono" style="font-size:0.72rem; color:var(--text-low);">${String(b.id).padStart(2, '0')}/29 BUILDER</span>
    </div>

    <h3 style="font-size:1.35rem; color:var(--text-high); margin-bottom:4px;">${b.name}</h3>
    <div style="font-size:0.85rem; color:var(--text-medium); margin-bottom:16px;">${b.role}</div>

    <p style="font-size:0.9rem; color:var(--text-medium); line-height:1.6; margin-bottom:20px;">${b.bio}</p>

    <div style="background:#09090b; border:1px solid var(--border-hairline); border-radius:8px; padding:14px; margin-bottom:20px;">
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:8px;">
        <span style="color:var(--text-low); font-family:var(--font-mono);">Current Focus:</span>
        <span style="color:#ffffff; font-family:var(--font-mono);">${b.focus}</span>
      </div>
      <div style="font-size:0.75rem; color:var(--text-low); font-family:var(--font-mono); margin-bottom:6px;">Primary Tech Stack:</div>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">
        ${b.stack.map(s => `<span class="builder-tech-chip" style="font-size:0.72rem; padding:2px 8px;">${s}</span>`).join('')}
      </div>
    </div>

    <div style="display:flex; justify-content:flex-end;">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    </div>
  `;

  overlay.classList.add('active');
};

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
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
