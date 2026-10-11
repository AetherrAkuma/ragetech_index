/**
 * RAGETECH.DEV — Interactive Engine
 * Handles project showcase, 29 builder profiles, dynamic filtering,
 * interactive telemetry terminal, modal drawers, and toast alerts.
 */

// ============================================================================
// 1. DATA REPOSITORIES: PROJECTS & 29 DEVELOPERS
// ============================================================================

const PROJECTS_DATA = [
  {
    id: 'hyperion',
    title: 'Project Hyperion',
    codename: 'HYPERION-CORE',
    category: 'systems',
    status: 'beta',
    statusLabel: 'v0.9.4 Beta',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    desc: 'Ultra-low-latency event streaming engine written in pure Rust. Capable of sub-millisecond p99 fanout across distributed nodes.',
    metrics: [
      { label: 'Throughput', val: '1.4M msg/s' },
      { label: 'Latency (p99)', val: '0.28ms' }
    ],
    tags: ['Rust', 'Tokio', 'SIMD', 'Zero-Copy', 'io_uring'],
    assignees: [1, 11, 19, 28],
    spec: {
      architecture: 'Distributed lock-free ring buffer topology with kernel-bypass sockets.',
      objective: 'Replace heavy message brokers with a memory-safe, ultra-compact native binary.',
      statusText: 'Undergoing high-throughput stress tests on multi-region clusters.'
    }
  },
  {
    id: 'chimera',
    title: 'Project Chimera',
    codename: 'CHIMERA-AGENT',
    category: 'ai',
    status: 'dev',
    statusLabel: 'Active Dev',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>`,
    desc: 'Autonomous agent runtime & multi-modal coordination mesh. Enables deterministic orchestration of specialized cognitive workflows.',
    metrics: [
      { label: 'Model Context', val: '2M tokens' },
      { label: 'Inference Mesh', val: 'Distributed' }
    ],
    tags: ['Python', 'PyTorch', 'Rust Bindings', 'gRPC', 'Vector Engine'],
    assignees: [3, 13, 18, 27],
    spec: {
      architecture: 'Asynchronous DAG executor with memory-mapped vector search index.',
      objective: 'Deterministic multi-agent execution with zero orchestration overhead.',
      statusText: 'Core runtime stable; building telemetry adapters.'
    }
  },
  {
    id: 'pulseos',
    title: 'Project PulseOS',
    codename: 'PULSE-KV',
    category: 'edge',
    status: 'dev',
    statusLabel: 'Active Dev',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>`,
    desc: 'Next-gen distributed Raft-consensus key-value store engineered for edge clusters and sovereign infrastructure deployments.',
    metrics: [
      { label: 'Consensus', val: 'Raft v2' },
      { label: 'Cold Boot', val: '14ms' }
    ],
    tags: ['Go', 'Raft', 'eBPF', 'RocksDB', 'Edge-Native'],
    assignees: [2, 5, 12, 21],
    spec: {
      architecture: 'Log-structured merge-tree with zero-copy eBPF network acceleration.',
      objective: 'Unbreakable consistency across erratic edge-node connections.',
      statusText: 'Consensus protocol verified with formal Jepsen testing.'
    }
  },
  {
    id: 'eclipse',
    title: 'Project Eclipse UI',
    codename: 'ECLIPSE-DS',
    category: 'systems',
    status: 'live',
    statusLabel: 'Live Alpha',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 10 10 0 0 0 0-20"/></svg>`,
    desc: 'Sovereign design system and GPU-accelerated interface primitives designed specifically for dark-mode developer environments.',
    metrics: [
      { label: 'Components', val: '64 Primitives' },
      { label: 'Bundle Size', val: '<14kb gzip' }
    ],
    tags: ['TypeScript', 'WebGL', 'CSS Architecture', 'A11y AAA'],
    assignees: [4, 10, 20, 26],
    spec: {
      architecture: 'Headless, framework-agnostic web component architecture with hardware shaders.',
      objective: 'Provide unmatched visual tactility and instantaneous render speed.',
      statusText: 'Integrated into internal ragetech portals.'
    }
  },
  {
    id: 'vortex',
    title: 'Project Vortex',
    codename: 'VORTEX-CRON',
    category: 'devops',
    status: 'beta',
    statusLabel: 'v0.6.1 Beta',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    desc: 'High-throughput asynchronous distributed task scheduler. Handles over 50M jobs per day with microsecond dispatch accuracy.',
    metrics: [
      { label: 'Throughput', val: '50M+ jobs/day' },
      { label: 'Jitter', val: '<12μs' }
    ],
    tags: ['Rust', 'Kafka', 'Redis Cluster', 'Tokio'],
    assignees: [7, 15, 23],
    spec: {
      architecture: 'Distributed priority-wheel timer with raft-backed heartbeat monitor.',
      objective: 'Sub-millisecond job scheduling without redis lock contention.',
      statusText: 'Production preview running across 6 cluster zones.'
    }
  },
  {
    id: 'aether',
    title: 'Project Aether',
    codename: 'AETHER-SYNC',
    category: 'edge',
    status: 'dev',
    statusLabel: 'Active Dev',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
    desc: 'P2P state synchronization mesh for collaborative developer tools using Conflict-Free Replicated Data Types (CRDTs).',
    metrics: [
      { label: 'Peer Sync', val: '<8ms' },
      { label: 'Conflict Rate', val: '0.00%' }
    ],
    tags: ['CRDT', 'WebRTC', 'WASM', 'libp2p'],
    assignees: [8, 16, 24],
    spec: {
      architecture: 'Automerge-powered graph state sync running over encrypted WebRTC data channels.',
      objective: 'True peer-to-peer real-time multiplayer editing without centralized servers.',
      statusText: 'Local-first synchronization protocol finalized.'
    }
  },
  {
    id: 'aegis',
    title: 'Project Aegis',
    codename: 'AEGIS-SHIELD',
    category: 'devops',
    status: 'rfc',
    statusLabel: 'Private RFC',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    desc: 'Automated runtime vulnerability detection and supply-chain dependency validator with compile-time taint analysis.',
    metrics: [
      { label: 'Precision', val: '99.4%' },
      { label: 'Analysis Speed', val: '120k LOC/s' }
    ],
    tags: ['Rust', 'LLVM', 'Static Analysis', 'Security'],
    assignees: [6, 14, 22],
    spec: {
      architecture: 'Abstract syntax tree analysis combined with eBPF syscall sandboxing.',
      objective: 'Proactive malware and credential leakage prevention before artifact compilation.',
      statusText: 'RFC document published internally.'
    }
  },
  {
    id: 'forge',
    title: 'Project Forge',
    codename: 'FORGE-RUN',
    category: 'devops',
    status: 'dev',
    statusLabel: 'Active Dev',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    desc: 'Zero-config microVM developer sandbox orchestrator. Boots disposable, isolated Linux kernel instances in under 180ms.',
    metrics: [
      { label: 'Boot Time', val: '180ms' },
      { label: 'Isolation', val: 'Hardware KVM' }
    ],
    tags: ['Go', 'Firecracker', 'KVM', 'OCI Containers'],
    assignees: [9, 17, 25, 29],
    spec: {
      architecture: 'Firecracker MicroVM daemon with sparse rootfs memory snapshots.',
      objective: 'Instantaneous local and cloud development environments with zero overhead.',
      statusText: 'CLI client in active dogfooding.'
    }
  }
];

// ============================================================================
// 2. THE 29 DEVELOPERS DATASET (PLACEHOLDERS 1 TO 29)
// ============================================================================

const DEVELOPERS_DATA = [
  {
    id: 1,
    name: 'Dev #01 — Alex Vance',
    handle: '@alexv.rs',
    role: 'Lead Systems Architect',
    squad: 'systems',
    skills: ['Rust', 'Tokio', 'eBPF', 'Kernel Bypass'],
    activeProject: 'Project Hyperion',
    color: 'linear-gradient(135deg, #6366f1, #38bdf8)',
    status: '🟢 Building Hyperion',
    bio: 'Pioneering low-latency distributed primitives and lock-free concurrency engines. 12+ years in systems programming.'
  },
  {
    id: 2,
    name: 'Dev #02 — Elena Rostova',
    handle: '@elena.go',
    role: 'Principal Distributed Systems Lead',
    squad: 'systems',
    skills: ['Go', 'Raft Consensus', 'Kubernetes', 'gRPC'],
    activeProject: 'Project PulseOS',
    color: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    status: '🟢 Tuning Raft Consensus',
    bio: 'Specialist in consensus protocols and multi-region fault-tolerant storage topologies.'
  },
  {
    id: 3,
    name: 'Dev #03 — Marcus Chen',
    handle: '@mchen.ai',
    role: 'Head of AI & Inference Systems',
    squad: 'ai',
    skills: ['Python', 'PyTorch', 'TensorRT', 'CUDA'],
    activeProject: 'Project Chimera',
    color: 'linear-gradient(135deg, #a855f7, #ec4899)',
    status: '🟢 Profiling Token Pipeline',
    bio: 'Engineering high-throughput inference serving pipelines and autonomous agent coordination graphs.'
  },
  {
    id: 4,
    name: 'Dev #04 — Sofia Lindqvist',
    handle: '@sofia.ui',
    role: 'Principal Frontend Architect',
    squad: 'frontend',
    skills: ['TypeScript', 'WebGL', 'CSS Architecture', 'WASM'],
    activeProject: 'Project Eclipse UI',
    color: 'linear-gradient(135deg, #38bdf8, #818cf8)',
    status: '🟢 Polishing Eclipse Shaders',
    bio: 'Passionate about sub-millisecond UI render frames, accessibility craft, and bespoke design systems.'
  },
  {
    id: 5,
    name: 'Dev #05 — Tariq Al-Mansoor',
    handle: '@tariqm.db',
    role: 'Storage Engine Specialist',
    squad: 'systems',
    skills: ['C++', 'Rust', 'RocksDB', 'LSM-Trees'],
    activeProject: 'Project PulseOS',
    color: 'linear-gradient(135deg, #10b981, #06b6d4)',
    status: '🟢 Optimizing MemTables',
    bio: 'Deep dive architect focusing on write-amplification reduction and disk persistence engines.'
  },
  {
    id: 6,
    name: 'Dev #06 — Freja Hansen',
    handle: '@fhansen.sec',
    role: 'Security & Cryptographic Engineer',
    squad: 'security',
    skills: ['Rust', 'Zero-Knowledge', 'TLS 1.3', 'Fuzzing'],
    activeProject: 'Project Aegis',
    color: 'linear-gradient(135deg, #f43f5e, #fb7185)',
    status: '🟢 Sandboxing Syscalls',
    bio: 'Auditor and cryptographer ensuring cryptographic guarantees across all Ragetech protocols.'
  },
  {
    id: 7,
    name: 'Dev #07 — Liam O\'Connor',
    handle: '@liamo.rs',
    role: 'High-Throughput Pipeline Lead',
    squad: 'systems',
    skills: ['Rust', 'Kafka', 'SIMD', 'Lock-Free Queues'],
    activeProject: 'Project Vortex',
    color: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    status: '🟢 Benchmarking Dispatcher',
    bio: 'Optimizing async executors for microsecond jitter in distributed cron executions.'
  },
  {
    id: 8,
    name: 'Dev #08 — Maya Patel',
    handle: '@mpatel.net',
    role: 'Network Protocol Specialist',
    squad: 'systems',
    skills: ['Go', 'QUIC', 'WebRTC', 'libp2p'],
    activeProject: 'Project Aether',
    color: 'linear-gradient(135deg, #6366f1, #a855f7)',
    status: '🟢 Testing Mesh P2P Handshake',
    bio: 'Building low-overhead UDP routing protocols for realtime edge communication.'
  },
  {
    id: 9,
    name: 'Dev #09 — Hiroshi Tanaka',
    handle: '@htanaka.dev',
    role: 'Kernel & Container Runtime Dev',
    squad: 'security',
    skills: ['C', 'Linux Kernel', 'Firecracker', 'KVM'],
    activeProject: 'Project Forge',
    color: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    status: '🟢 Tuning MicroVM Boot',
    bio: 'Kernel hacker shaving milliseconds off virtualization spin-up and seccomp filters.'
  },
  {
    id: 10,
    name: 'Dev #10 — Chloe Dubois',
    handle: '@cdubois.art',
    role: 'Creative Technologist & UI/UX',
    squad: 'frontend',
    skills: ['Three.js', 'Shader Toy', 'Design Systems', 'Figma'],
    activeProject: 'Project Eclipse UI',
    color: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    status: '🟢 Designing Neon Component Suite',
    bio: 'Bridging high-end cyber aesthetics with seamless human-machine interaction.'
  },
  {
    id: 11,
    name: 'Dev #11 — David Kovacs',
    handle: '@dkovacs.sys',
    role: 'IPC & Memory Architecture Dev',
    squad: 'systems',
    skills: ['C++', 'IPC', 'Shared Memory', 'Ring Buffers'],
    activeProject: 'Project Hyperion',
    color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    status: '🟢 Zero-Copy Buffers',
    bio: 'Obsessed with cache line alignment, CPU branch prediction, and memory layout optimization.'
  },
  {
    id: 12,
    name: 'Dev #12 — Nadia Nour',
    handle: '@nnour.tla',
    role: 'Consensus Verification Researcher',
    squad: 'systems',
    skills: ['TLA+', 'Rust', 'Paxos', 'Formal Methods'],
    activeProject: 'Project PulseOS',
    color: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
    status: '🟡 Verifying Edge Partition Model',
    bio: 'Formally validating edge consensus states under Byzantine and network partition faults.'
  },
  {
    id: 13,
    name: 'Dev #13 — Lucas Silva',
    handle: '@lsilva.ai',
    role: 'Agent Workflow Engineer',
    squad: 'ai',
    skills: ['Python', 'AsyncIO', 'Vector DB', 'Prompt Graph'],
    activeProject: 'Project Chimera',
    color: 'linear-gradient(135deg, #10b981, #3b82f6)',
    status: '🟢 Implementing DAG Executor',
    bio: 'Creating deterministic multi-agent graphs with autonomous fallback mechanisms.'
  },
  {
    id: 14,
    name: 'Dev #14 — Anya Ivanova',
    handle: '@aivanova.comp',
    role: 'Compiler & Static Analysis Dev',
    squad: 'security',
    skills: ['Rust', 'LLVM', 'AST Parsing', 'Type Systems'],
    activeProject: 'Project Aegis',
    color: 'linear-gradient(135deg, #f43f5e, #fb923c)',
    status: '🟢 Analyzing Taint AST Flows',
    bio: 'Building compile-time safety guards and automated dependency flaw detection.'
  },
  {
    id: 15,
    name: 'Dev #15 — Samuel Kim',
    handle: '@skim.wasm',
    role: 'Edge & WASM Specialist',
    squad: 'systems',
    skills: ['WebAssembly', 'WASI', 'Rust', 'Cloudflare Workers'],
    activeProject: 'Project Vortex',
    color: 'linear-gradient(135deg, #06b6d4, #10b981)',
    status: '🟢 Compiling WASI Dispatcher',
    bio: 'Deploying serverless WASM runtimes that execute user jobs with zero startup penalty.'
  },
  {
    id: 16,
    name: 'Dev #16 — Zara Morales',
    handle: '@zmorales.sync',
    role: 'CRDT & Realtime Sync Dev',
    squad: 'frontend',
    skills: ['TypeScript', 'Automerge', 'WebSockets', 'IndexedDB'],
    activeProject: 'Project Aether',
    color: 'linear-gradient(135deg, #a855f7, #38bdf8)',
    status: '🟢 Local-first Offline Sync',
    bio: 'Building offline-first CRDT synchronization layers for high-speed collaborative tooling.'
  },
  {
    id: 17,
    name: 'Dev #17 — Julian Becker',
    handle: '@jbecker.ops',
    role: 'DevOps & NixOS Infrastructure',
    squad: 'security',
    skills: ['NixOS', 'Terraform', 'Bare-Metal', 'WireGuard'],
    activeProject: 'Project Forge',
    color: 'linear-gradient(135deg, #64748b, #475569)',
    status: '🟢 Automated Nix Deployments',
    bio: 'Maintaining hermetic, reproducible build pipelines across distributed bare-metal hosts.'
  },
  {
    id: 18,
    name: 'Dev #18 — Priya Sharma',
    handle: '@psharma.cuda',
    role: 'GPU Acceleration & CUDA Dev',
    squad: 'ai',
    skills: ['CUDA', 'C++', 'ONNX Runtime', 'FlashAttention'],
    activeProject: 'Project Chimera',
    color: 'linear-gradient(135deg, #f59e0b, #10b981)',
    status: '🟢 Kernel Tensor Optimization',
    bio: 'Custom CUDA kernel writer optimizing transformer attention latency on consumer and server GPUs.'
  },
  {
    id: 19,
    name: 'Dev #19 — Oliver Wright',
    handle: '@owright.tele',
    role: 'Systems Observability Engineer',
    squad: 'systems',
    skills: ['OpenTelemetry', 'eBPF Profiling', 'Prometheus', 'Rust'],
    activeProject: 'Project Hyperion',
    color: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
    status: '🟢 Zero-Overhead Tracing',
    bio: 'Crafting non-intrusive eBPF telemetry hooks to monitor million-event-per-second systems.'
  },
  {
    id: 20,
    name: 'Dev #20 — Mia Takahashi',
    handle: '@mtakahashi.dx',
    role: 'Design Systems & A11y Lead',
    squad: 'frontend',
    skills: ['CSS Custom Props', 'WCAG AAA', 'Micro-Interactions'],
    activeProject: 'Project Eclipse UI',
    color: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    status: '🟢 Keyboard Nav Audits',
    bio: 'Obsessed with high tactile feedback, focus state perfection, and WCAG accessibility compliance.'
  },
  {
    id: 21,
    name: 'Dev #21 — Gabriel Santos',
    handle: '@gsantos.mem',
    role: 'Memory Internals & Allocators',
    squad: 'systems',
    skills: ['Go Runtime', 'C', 'jemalloc', 'Garbage Collection'],
    activeProject: 'Project PulseOS',
    color: 'linear-gradient(135deg, #10b981, #84cc16)',
    status: '🟢 Eliminating Heap Allocations',
    bio: 'Tuning Go and Rust memory allocators for persistent zero-allocation steady states.'
  },
  {
    id: 22,
    name: 'Dev #22 — Leila Haddad',
    handle: '@lhaddad.pen',
    role: 'Offensive Security & Pen Tester',
    squad: 'security',
    skills: ['Sandboxing', 'AFL++ Fuzzing', 'Reverse Engineering'],
    activeProject: 'Project Aegis',
    color: 'linear-gradient(135deg, #ef4444, #991b1b)',
    status: '🟢 Threat Model Auditing',
    bio: 'Simulating state-actor intrusion and fuzzing protocol edge cases to harden ragetech codebases.'
  },
  {
    id: 23,
    name: 'Dev #23 — Viktor Novak',
    handle: '@vnovak.async',
    role: 'Async Runtime Specialist',
    squad: 'systems',
    skills: ['Rust', 'Tokio Internals', 'Priority Heaps', 'C++'],
    activeProject: 'Project Vortex',
    color: 'linear-gradient(135deg, #818cf8, #4f46e5)',
    status: '🟢 Task Stealing Runtime',
    bio: 'Designing work-stealing schedulers for deterministic parallel computation.'
  },
  {
    id: 24,
    name: 'Dev #24 — Emily Watson',
    handle: '@ewatson.mesh',
    role: 'P2P Mesh Network Engineer',
    squad: 'systems',
    skills: ['libp2p', 'GossipSub', 'Kademlia DHT', 'Go'],
    activeProject: 'Project Aether',
    color: 'linear-gradient(135deg, #06b6d4, #2563eb)',
    status: '🟢 NAT Traversal Testing',
    bio: 'Ensuring seamless hole-punching and distributed hash table discovery across symmetric NATs.'
  },
  {
    id: 25,
    name: 'Dev #25 — Kenji Sato',
    handle: '@ksato.virt',
    role: 'Virtualization & MicroVM Dev',
    squad: 'security',
    skills: ['Rust', 'KVM API', 'virtio', 'containerd'],
    activeProject: 'Project Forge',
    color: 'linear-gradient(135deg, #6366f1, #06b6d4)',
    status: '🟢 Virtio-vsock Drivers',
    bio: 'Developing high-speed guest-host communication channels via virtual sockets.'
  },
  {
    id: 26,
    name: 'Dev #26 — Camilla Rossi',
    handle: '@crossi.web',
    role: 'Full-Stack Platform Engineer',
    squad: 'frontend',
    skills: ['TypeScript', 'Next.js', 'tRPC', 'Tailwind/CSS'],
    activeProject: 'Project Eclipse UI',
    color: 'linear-gradient(135deg, #c084fc, #6366f1)',
    status: '🟢 Building ragetech.dev Hub',
    bio: 'Crafting responsive, high-fps web interfaces with deep developer ergonomics.'
  },
  {
    id: 27,
    name: 'Dev #27 — Nathan Brooks',
    handle: '@nbrooks.gpu',
    role: 'WebGPU & Compute Shader Dev',
    squad: 'ai',
    skills: ['WebGPU', 'WGSL', 'Rust', 'Vulkan'],
    activeProject: 'Project Chimera',
    color: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    status: '🟢 Browser LLM Ingestion',
    bio: 'Running quantized tensor models directly inside browser shaders via WebGPU.'
  },
  {
    id: 28,
    name: 'Dev #28 — Farah Zaid',
    handle: '@fzaid.perf',
    role: 'Performance Profiling Specialist',
    squad: 'systems',
    skills: ['Flamegraphs', 'Perf', 'Valgrind', 'Cachegrind'],
    activeProject: 'Project Hyperion',
    color: 'linear-gradient(135deg, #10b981, #047857)',
    status: '🟢 Generating Flamegraphs',
    bio: 'Tracking down CPU instruction overhead and hunting down latency tail spikes.'
  },
  {
    id: 29,
    name: 'Dev #29 — Oscar Berg',
    handle: '@oberg.cli',
    role: 'Developer Experience & TUI Lead',
    squad: 'frontend',
    skills: ['Go', 'Rust Ratatui', 'Bubbletea', 'Terminal UX'],
    activeProject: 'Project Forge',
    color: 'linear-gradient(135deg, #e11d48, #be123c)',
    status: '🟢 Polishing Ragetech TUI',
    bio: 'Creating delightful terminal user interfaces and command-line ergonomics for engineers.'
  }
];

// ============================================================================
// 3. UI RENDERING & COMPONENT INJECTION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTerminalTabs();
  renderProjects('all');
  renderDevelopers('all', '');
  initProjectTabs();
  initDevTabs();
  initDevSearch();
  initFaqAccordion();
  initDomainCopy();
  initModals();
  initHeaderScroll();
  initStatsCounter();
});

// Terminal Tabs Handler
function initTerminalTabs() {
  const tabs = document.querySelectorAll('.terminal-tab-btn');
  const codeContainer = document.getElementById('terminal-content');

  const contentMap = {
    'status.sh': `
<div class="terminal-code-line"><span class="terminal-prompt">$</span> <span>ragetech cluster --health --telemetry</span></div>
<div class="terminal-code-line"><span class="terminal-val-dim">:: Connecting to edge control plane (ragetech.dev)...</span></div>
<div class="terminal-code-line"><span class="terminal-val-success">✓</span> <span>Network status: </span> <span class="terminal-val-success">100% OPERATIONAL</span></div>
<div class="terminal-code-line"><span class="terminal-val-success">✓</span> <span>Active builders: </span> <span class="terminal-val-cyan">29 of 29 nodes verified</span></div>
<div class="terminal-code-line"><span class="terminal-val-success">✓</span> <span>Active projects: </span> <span class="terminal-val-cyan">8 engineering repositories</span></div>
<div class="terminal-code-line"><span class="terminal-val-success">✓</span> <span>Latency to gateway: </span> <span class="terminal-val-success">0.24ms</span> (Global edge mesh)</div>
<div class="terminal-code-line"><span class="terminal-prompt">$</span> <span class="terminal-val-dim">_ awaiting developer dispatch</span></div>`,

    'stack.json': `
<div class="terminal-code-line"><span class="terminal-prompt">$</span> <span>cat core-manifest.json</span></div>
<div class="terminal-code-line">{</div>
<div class="terminal-code-line">&nbsp;&nbsp;<span class="terminal-val-cyan">"collective"</span>: <span class="terminal-val-success">"Ragetech Development Guild"</span>,</div>
<div class="terminal-code-line">&nbsp;&nbsp;<span class="terminal-val-cyan">"domain"</span>: <span class="terminal-val-success">"ragetech.dev"</span>,</div>
<div class="terminal-code-line">&nbsp;&nbsp;<span class="terminal-val-cyan">"buildersCount"</span>: 29,</div>
<div class="terminal-code-line">&nbsp;&nbsp;<span class="terminal-val-cyan">"primaryLanguages"</span>: [<span class="terminal-val-cyan">"Rust"</span>, <span class="terminal-val-cyan">"Go"</span>, <span class="terminal-val-cyan">"TypeScript"</span>, <span class="terminal-val-cyan">"Python"</span>],</div>
<div class="terminal-code-line">&nbsp;&nbsp;<span class="terminal-val-cyan">"architecture"</span>: <span class="terminal-val-success">"Zero-overhead native distributed systems"</span></div>
<div class="terminal-code-line">}</div>`,

    'manifest.txt': `
<div class="terminal-code-line"><span class="terminal-prompt">$</span> <span>cat PHILOSOPHY.md</span></div>
<div class="terminal-code-line"><span class="terminal-val-cyan"># The Ragetech Creed</span></div>
<div class="terminal-code-line">1. Velocity through architectural clarity, not technical debt.</div>
<div class="terminal-code-line">2. 29 autonomous builders, zero layers of middle management.</div>
<div class="terminal-code-line">3. Performance is not a feature; it is the default posture.</div>
<div class="terminal-code-line">4. ragetech.dev is the incubator for foundational developer tools.</div>`
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-target');
      if (contentMap[target]) {
        codeContainer.innerHTML = contentMap[target];
      }
    });
  });
}

// Render Projects Cards
function renderProjects(category) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const filtered = category === 'all' 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.category === category);

  grid.innerHTML = filtered.map(p => {
    let chipClass = 'status-chip-dev';
    if (p.status === 'live') chipClass = 'status-chip-live';
    if (p.status === 'beta') chipClass = 'status-chip-beta';
    if (p.status === 'rfc') chipClass = 'status-chip-rfc';

    // Assignee mini avatars
    const assigneeAvatars = p.assignees.slice(0, 4).map(devId => {
      const dev = DEVELOPERS_DATA.find(d => d.id === devId);
      const initials = dev ? dev.name.split(' ').pop().substring(0, 2).toUpperCase() : `#${devId}`;
      const bg = dev ? dev.color : '#334155';
      return `<div class="assignee-avatar-mini" style="background:${bg}" title="${dev ? dev.name : ''}">${initials}</div>`;
    }).join('');

    return `
      <article class="project-card" data-project-id="${p.id}">
        <div class="project-header">
          <div class="project-icon-box">
            ${p.icon}
          </div>
          <span class="project-status-chip ${chipClass}">
            <span class="status-dot"></span>
            ${p.statusLabel}
          </span>
        </div>

        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.desc}</p>

        <div class="project-metrics">
          <div class="metric-cell">
            <div class="metric-cell-label">${p.metrics[0].label}</div>
            <div class="metric-cell-val">${p.metrics[0].val}</div>
          </div>
          <div class="metric-cell">
            <div class="metric-cell-label">${p.metrics[1].label}</div>
            <div class="metric-cell-val">${p.metrics[1].val}</div>
          </div>
        </div>

        <div class="project-tags">
          ${p.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
        </div>

        <div class="project-footer">
          <div class="project-assignees" title="Assigned Engineers">
            ${assigneeAvatars}
          </div>
          <button class="project-inspect-btn" onclick="openProjectModal('${p.id}')">
            Inspect Spec 
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </article>
    `;
  }).join('');
}

// Project Category Tabs
function initProjectTabs() {
  const tabs = document.querySelectorAll('#project-tabs .tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.getAttribute('data-category');
      renderProjects(category);
    });
  });
}

// Render Developers Grid (All 29 placeholders)
function renderDevelopers(squad = 'all', searchQuery = '') {
  const grid = document.getElementById('builders-grid');
  const countBadge = document.getElementById('builders-counter');
  if (!grid) return;

  const q = searchQuery.toLowerCase().trim();

  const filtered = DEVELOPERS_DATA.filter(dev => {
    const matchesSquad = squad === 'all' || dev.squad === squad;
    const matchesSearch = !q || 
      dev.name.toLowerCase().includes(q) || 
      dev.handle.toLowerCase().includes(q) || 
      dev.role.toLowerCase().includes(q) || 
      dev.activeProject.toLowerCase().includes(q) ||
      dev.skills.some(s => s.toLowerCase().includes(q));
    return matchesSquad && matchesSearch;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} of 29 Active Builders`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 8px;">No builders match query "${searchQuery}"</p>
        <p style="font-size: 0.85rem;">Try searching for "Rust", "Consensus", "UI", or clear the filter.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(dev => {
    // Generate two letter monogram
    const initials = dev.name.split('—')[1] 
      ? dev.name.split('—')[1].trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : `D${dev.id}`;

    return `
      <div class="dev-card" onclick="openDevModal(${dev.id})" data-dev-id="${dev.id}">
        <span class="dev-card-number">#${String(dev.id).padStart(2, '0')}</span>
        
        <div class="dev-card-header">
          <div class="dev-avatar" style="background: ${dev.color}">
            ${initials}
            <span class="dev-avatar-pulse" title="Active"></span>
          </div>
          <div class="dev-meta">
            <h4 class="dev-name">${dev.name}</h4>
            <div class="dev-handle">${dev.handle}</div>
          </div>
        </div>

        <div class="dev-role">${dev.role}</div>

        <div class="dev-project-assigned">
          <span>Assigned:</span>
          <strong>${dev.activeProject}</strong>
        </div>

        <div class="dev-skills">
          ${dev.skills.slice(0, 3).map(skill => `<span class="dev-skill-pill">${skill}</span>`).join('')}
          ${dev.skills.length > 3 ? `<span class="dev-skill-pill">+${dev.skills.length - 3}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Dev Squad Tabs
function initDevTabs() {
  const tabs = document.querySelectorAll('#dev-tabs .tab-btn');
  const searchInput = document.getElementById('dev-search-input');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const squad = tab.getAttribute('data-squad');
      renderDevelopers(squad, searchInput ? searchInput.value : '');
    });
  });
}

// Dev Search Input
function initDevSearch() {
  const searchInput = document.getElementById('dev-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const activeTab = document.querySelector('#dev-tabs .tab-btn.active');
    const squad = activeTab ? activeTab.getAttribute('data-squad') : 'all';
    renderDevelopers(squad, e.target.value);
  });
}

// ============================================================================
// 4. FAQ ACCORDION HANDLER
// ============================================================================

function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

// ============================================================================
// 5. TOAST & DOMAIN COPY UTILITY
// ============================================================================

function showToast(message, icon = '✓') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color:#38bdf8; font-weight:bold;">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function initDomainCopy() {
  const copyBtns = document.querySelectorAll('.js-copy-domain');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const domain = 'ragetech.dev';
      navigator.clipboard.writeText(domain).then(() => {
        showToast(`Domain copied: ${domain}`);
      }).catch(() => {
        showToast(`ragetech.dev - Ready for deployment`);
      });
    });
  });
}

// ============================================================================
// 6. MODAL SYSTEM (PROJECT SPECS & DEV BIO)
// ============================================================================

function initModals() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('active');
}

window.openProjectModal = function(projectId) {
  const project = PROJECTS_DATA.find(p => p.id === projectId);
  if (!project) return;

  const contentBox = document.getElementById('modal-dynamic-content');
  const overlay = document.getElementById('modal-overlay');

  const assigneeNames = project.assignees.map(devId => {
    const dev = DEVELOPERS_DATA.find(d => d.id === devId);
    return dev ? `<div style="display:inline-flex; align-items:center; gap:6px; margin-right:12px; margin-bottom:6px; background:rgba(255,255,255,0.05); padding:4px 10px; border-radius:6px; font-size:0.8rem;">
      <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${dev.color};"></span>
      <strong>${dev.name.split('—')[1] || dev.name}</strong> (${dev.role.split(' ')[0]})
    </div>` : '';
  }).join('');

  contentBox.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
      <div class="project-icon-box" style="width:42px; height:42px;">${project.icon}</div>
      <div>
        <h2 style="font-size:1.5rem; margin-bottom:2px;">${project.title}</h2>
        <span class="mono" style="font-size:0.75rem; color:#818cf8;">${project.codename}</span>
      </div>
    </div>

    <p style="color:var(--text-secondary); margin-bottom:20px; line-height:1.6;">${project.desc}</p>

    <div style="background:rgba(11,14,22,0.8); border:1px solid var(--border-subtle); border-radius:10px; padding:16px; margin-bottom:20px;">
      <h4 style="font-size:0.85rem; color:#38bdf8; text-transform:uppercase; font-family:var(--font-mono); margin-bottom:8px;">Architecture Specification</h4>
      <p style="font-size:0.88rem; color:#cbd5e1; margin-bottom:12px;">${project.spec.architecture}</p>
      <div style="display:flex; justify-content:space-between; font-size:0.8rem; border-top:1px solid rgba(255,255,255,0.06); padding-top:10px;">
        <span style="color:var(--text-muted);">Objective:</span>
        <span style="color:#e2e8f0; font-weight:500;">${project.spec.objective}</span>
      </div>
    </div>

    <div style="margin-bottom:20px;">
      <div style="font-size:0.8rem; font-family:var(--font-mono); color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">Assigned Engineers from The 29</div>
      <div>${assigneeNames}</div>
    </div>

    <div style="display:flex; gap:10px; justify-content:flex-end;">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="showToast('Requested access to ${project.codename} spec')">Request RFC Access</button>
    </div>
  `;

  overlay.classList.add('active');
};

window.openDevModal = function(devId) {
  const dev = DEVELOPERS_DATA.find(d => d.id === devId);
  if (!dev) return;

  const contentBox = document.getElementById('modal-dynamic-content');
  const overlay = document.getElementById('modal-overlay');

  const initials = dev.name.split('—')[1] 
    ? dev.name.split('—')[1].trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : `D${dev.id}`;

  contentBox.innerHTML = `
    <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px;">
      <div class="dev-avatar" style="width:60px; height:60px; font-size:1.25rem; background:${dev.color}">
        ${initials}
      </div>
      <div>
        <h2 style="font-size:1.4rem; margin-bottom:4px;">${dev.name}</h2>
        <div style="display:flex; gap:10px; align-items:center;">
          <span class="dev-handle">${dev.handle}</span>
          <span style="font-size:0.75rem; color:#34d399; font-family:var(--font-mono);">${dev.status}</span>
        </div>
      </div>
    </div>

    <div style="margin-bottom:16px;">
      <div style="font-size:0.78rem; font-family:var(--font-mono); color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Specialization</div>
      <div style="font-size:1.05rem; font-weight:600; color:#f8fafc;">${dev.role}</div>
    </div>

    <p style="color:var(--text-secondary); margin-bottom:20px; font-size:0.92rem; line-height:1.6;">${dev.bio}</p>

    <div style="background:rgba(11,14,22,0.8); border:1px solid var(--border-subtle); border-radius:10px; padding:16px; margin-bottom:20px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="font-size:0.78rem; font-family:var(--font-mono); color:var(--text-muted);">ACTIVE FOCUS</span>
        <span style="font-size:0.85rem; color:#818cf8; font-weight:600;">${dev.activeProject}</span>
      </div>
      <div style="font-size:0.78rem; font-family:var(--font-mono); color:var(--text-muted); margin-bottom:6px;">PRIMARY EXPERTISE</div>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">
        ${dev.skills.map(s => `<span class="dev-skill-pill" style="font-size:0.75rem; padding:3px 8px;">${s}</span>`).join('')}
      </div>
    </div>

    <div style="display:flex; gap:10px; justify-content:space-between; align-items:center;">
      <span class="mono" style="font-size:0.75rem; color:var(--text-dim);">BUILDER NODE #00${dev.id}.RAGETECH</span>
      <button class="btn btn-secondary" onclick="closeModal()">Dismiss</button>
    </div>
  `;

  overlay.classList.add('active');
};

// ============================================================================
// 7. HEADER SCROLL & STATS ANIMATION
// ============================================================================

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initStatsCounter() {
  // Can add incremental counter if desired
}
