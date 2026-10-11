/**
 * RAGETECH.DEV — The 29 Builders Registry
 * Modular developer directory and repository showcase.
 * 
 * HOW TO ADD OR EDIT YOUR PROFILE:
 * 1. Clone the repo: git clone https://github.com/AetherrAkuma/ragetech_index.git
 * 2. Edit or add your object in the DEVELOPERS array below.
 * 3. Add your featured repo and flex stats (stars, language, topics, cloneUrl).
 * 4. Submit a Pull Request. Your profile will deploy automatically!
 */

window.DEVELOPERS = [
  {
    id: 1,
    handle: 'alexv',
    name: 'Alex Vance',
    squad: 'systems',
    role: 'Lead Systems Architect',
    status: '⚡ SIMD ring buffers in Hyperion',
    location: 'Stockholm, SE (UTC+1)',
    bio: 'Lock-free systems author. Specializing in Linux io_uring, AVX-512 SIMD pipelines, and microsecond telemetry runtimes.',
    stack: ['Rust', 'io_uring', 'SIMD', 'Linux'],
    ragetechProject: 'hyperion',
    featuredRepo: {
      name: 'alexv/fast-ringbuf',
      tagline: 'Lock-free SPMC memory ring buffer with cache-line padded atomics and zero allocations.',
      stars: 1840,
      forks: 142,
      language: 'Rust',
      languageColor: '#dea584',
      url: 'https://github.com/ragetech/hyperion',
      cloneUrl: 'git clone https://github.com/ragetech/hyperion.git',
      topics: ['rust', 'ringbuffer', 'concurrency', 'simd']
    },
    secondaryRepos: [
      { name: 'alexv/iouring-bench', stars: 420, language: 'Rust', languageColor: '#dea584', url: 'https://github.com/ragetech/hyperion' },
      { name: 'alexv/cacheline-pad', stars: 215, language: 'C++', languageColor: '#f34b7d', url: 'https://github.com/ragetech/hyperion' }
    ],
    socials: {
      github: 'https://github.com/alexv',
      x: 'https://x.com/alexv_dev',
      website: 'https://alexvance.dev'
    },
    gpgKey: '4A8B 91F0 C128 7E53'
  },
  {
    id: 2,
    handle: 'elena',
    name: 'Elena Rostova',
    squad: 'systems',
    role: 'Distributed Systems Lead',
    status: '🟢 Multi-Raft v2 edge quorum',
    location: 'Helsinki, FI (UTC+2)',
    bio: 'Distributed storage author and consensus protocol researcher. Former maintainer of edge persistence engines.',
    stack: ['Go', 'Raft', 'eBPF', 'RocksDB'],
    ragetechProject: 'pulseos',
    featuredRepo: {
      name: 'elena/raft-ebpf',
      tagline: 'Zero-copy socket pass-through for Raft heartbeat packets using Linux eBPF filters.',
      stars: 2190,
      forks: 188,
      language: 'Go',
      languageColor: '#00ADD8',
      url: 'https://github.com/ragetech/pulseos',
      cloneUrl: 'git clone https://github.com/ragetech/pulseos.git',
      topics: ['go', 'raft', 'ebpf', 'consensus']
    },
    secondaryRepos: [
      { name: 'elena/jepsen-edge-runner', stars: 512, language: 'Clojure', languageColor: '#db5855', url: 'https://github.com/ragetech/pulseos' },
      { name: 'elena/lsm-wal-compact', stars: 340, language: 'Go', languageColor: '#00ADD8', url: 'https://github.com/ragetech/pulseos' }
    ],
    socials: {
      github: 'https://github.com/elena-rostova',
      x: 'https://x.com/elena_systems',
      website: 'https://rostova.tech'
    },
    gpgKey: '9F1C 33A2 8B40 E511'
  },
  {
    id: 3,
    handle: 'mchen',
    name: 'Marcus Chen',
    squad: 'ai',
    role: 'AI Systems Architect',
    status: '🔥 vLLM batching kernels',
    location: 'San Francisco, US (UTC-7)',
    bio: 'High-throughput inference batching and cognitive agent runtime architect. Optimizing tensor memory layouts.',
    stack: ['Python', 'CUDA', 'PyTorch', 'C++'],
    ragetechProject: 'chimera',
    featuredRepo: {
      name: 'mchen/chimera-vllm',
      tagline: 'Deterministic DAG executor for distributed multi-agent workflows with memory checkpoint rollback.',
      stars: 3410,
      forks: 312,
      language: 'Python',
      languageColor: '#3572A5',
      url: 'https://github.com/ragetech/chimera',
      cloneUrl: 'git clone https://github.com/ragetech/chimera.git',
      topics: ['python', 'llm', 'agents', 'cuda']
    },
    secondaryRepos: [
      { name: 'mchen/flash-atten-fp8', stars: 890, language: 'C++', languageColor: '#f34b7d', url: 'https://github.com/ragetech/chimera' },
      { name: 'mchen/quant-weight-streamer', stars: 440, language: 'Python', languageColor: '#3572A5', url: 'https://github.com/ragetech/chimera' }
    ],
    socials: {
      github: 'https://github.com/mchen-ai',
      x: 'https://x.com/marcuschen_ai',
      website: 'https://mchen.io'
    },
    gpgKey: '18D3 74B2 99CE 45A1'
  },
  {
    id: 4,
    handle: 'slindqvist',
    name: 'Sofia Lindqvist',
    squad: 'frontend',
    role: 'Principal Interface Engineer',
    status: '💎 Zero-runtime tokens & APCA',
    location: 'Stockholm, SE (UTC+1)',
    bio: 'Developer ergonomics, accessibility craft, and sub-millisecond interaction design for engineering tools.',
    stack: ['TypeScript', 'WebGL', 'CSS Architecture'],
    ragetechProject: 'eclipse',
    featuredRepo: {
      name: 'slindqvist/eclipse-tokens',
      tagline: 'High-density design token architecture and headless primitives for developer-facing telemetry consoles.',
      stars: 1280,
      forks: 94,
      language: 'TypeScript',
      languageColor: '#3178c6',
      url: 'https://github.com/ragetech/eclipse-ui',
      cloneUrl: 'git clone https://github.com/ragetech/eclipse-ui.git',
      topics: ['typescript', 'design-tokens', 'a11y', 'ui']
    },
    secondaryRepos: [
      { name: 'slindqvist/apca-contrast-calc', stars: 620, language: 'TypeScript', languageColor: '#3178c6', url: 'https://github.com/ragetech/eclipse-ui' },
      { name: 'slindqvist/canvas-sparkline-60fps', stars: 395, language: 'JavaScript', languageColor: '#f1e05a', url: 'https://github.com/ragetech/eclipse-ui' }
    ],
    socials: {
      github: 'https://github.com/slindqvist',
      x: 'https://x.com/sofialindqvist',
      website: 'https://lindqvist.design'
    },
    gpgKey: '82C4 51E0 3B99 71DF'
  },
  {
    id: 5,
    handle: 'tariqm',
    name: 'Tariq Al-Mansoor',
    squad: 'systems',
    role: 'Storage Engine Engineer',
    status: '⚡ NVMe direct-I/O compactor',
    location: 'Dubai, AE (UTC+4)',
    bio: 'NVMe write optimization, LSM tree compactions, and memory-mapped persistence at the storage tier.',
    stack: ['C++', 'Rust', 'RocksDB', 'NVMe'],
    ragetechProject: 'pulseos',
    featuredRepo: {
      name: 'tariqm/lsm-nvme-flush',
      tagline: 'High-throughput append-only log engine tuned for sub-millisecond NVMe SSD flushes.',
      stars: 1140,
      forks: 82,
      language: 'C++',
      languageColor: '#f34b7d',
      url: 'https://github.com/ragetech/pulseos',
      cloneUrl: 'git clone https://github.com/ragetech/pulseos.git',
      topics: ['cpp', 'lsm-tree', 'nvme', 'storage']
    },
    secondaryRepos: [
      { name: 'tariqm/direct-io-rust', stars: 280, language: 'Rust', languageColor: '#dea584', url: 'https://github.com/ragetech/pulseos' }
    ],
    socials: {
      github: 'https://github.com/tariq-mansoor',
      x: 'https://x.com/tariq_systems',
      website: 'https://almansoor.dev'
    },
    gpgKey: '67F1 2309 BA88 12C3'
  },
  {
    id: 6,
    handle: 'fhansen',
    name: 'Freja Hansen',
    squad: 'security',
    role: 'Security & Cryptography Lead',
    status: '🛡️ Curve25519 formal verification',
    location: 'Copenhagen, DK (UTC+1)',
    bio: 'Cryptographic guarantees, zero-knowledge proofs, and automated protocol fuzzing across core runtimes.',
    stack: ['Rust', 'TLS', 'Formal Verification', 'WASM'],
    ragetechProject: 'aether',
    featuredRepo: {
      name: 'fhansen/curve25519-wasm',
      tagline: 'Formally verified Curve25519 ECDH implementation compiled to WebAssembly with constant-time guarantees.',
      stars: 1620,
      forks: 135,
      language: 'Rust',
      languageColor: '#dea584',
      url: 'https://github.com/ragetech/aether',
      cloneUrl: 'git clone https://github.com/ragetech/aether.git',
      topics: ['rust', 'cryptography', 'wasm', 'security']
    },
    secondaryRepos: [
      { name: 'fhansen/fuzz-protocol-harness', stars: 410, language: 'Rust', languageColor: '#dea584', url: 'https://github.com/ragetech/aether' }
    ],
    socials: {
      github: 'https://github.com/freja-hansen',
      x: 'https://x.com/freja_sec',
      website: 'https://frejahansen.io'
    },
    gpgKey: 'B489 01C2 FE78 923A'
  },
  {
    id: 7,
    handle: 'liamo',
    name: "Liam O'Connor",
    squad: 'systems',
    role: 'Pipeline Engineer',
    status: '⏱️ 10us timer wheel tick',
    location: 'Dublin, IE (UTC+0)',
    bio: 'Microsecond dispatchers, lock-free timer queues, and streaming pipelines with zero memory bloat.',
    stack: ['Rust', 'Kafka', 'Tokio', 'WASM'],
    ragetechProject: 'vortex',
    featuredRepo: {
      name: 'liamo/vortex-wheel',
      tagline: 'Hierarchical timing wheels handling 10M concurrent timers with sub-millisecond precision.',
      stars: 1560,
      forks: 130,
      language: 'Rust',
      languageColor: '#dea584',
      url: 'https://github.com/ragetech/vortex',
      cloneUrl: 'git clone https://github.com/ragetech/vortex.git',
      topics: ['rust', 'timer-wheel', 'scheduler', 'tokio']
    },
    secondaryRepos: [
      { name: 'liamo/tokio-priority-ring', stars: 380, language: 'Rust', languageColor: '#dea584', url: 'https://github.com/ragetech/vortex' }
    ],
    socials: {
      github: 'https://github.com/liam-oconnor',
      x: 'https://x.com/liam_pipeline',
      website: 'https://oconnor.systems'
    },
    gpgKey: '298C D011 4452 BE98'
  },
  {
    id: 8,
    handle: 'mpatel',
    name: 'Maya Patel',
    squad: 'systems',
    role: 'Network Protocols Specialist',
    status: '🌐 WebRTC hole punching mesh',
    location: 'London, UK (UTC+0)',
    bio: 'Peer-to-peer routing, hole punching, distributed hash tables, and symmetric NAT traversal.',
    stack: ['Go', 'QUIC', 'libp2p', 'Rust'],
    ragetechProject: 'aether',
    featuredRepo: {
      name: 'mpatel/quic-holepunch',
      tagline: 'Universal STUN/TURN bypass daemon achieving 94% direct peer connection rates over restrictive NATs.',
      stars: 2040,
      forks: 165,
      language: 'Go',
      languageColor: '#00ADD8',
      url: 'https://github.com/ragetech/aether',
      cloneUrl: 'git clone https://github.com/ragetech/aether.git',
      topics: ['go', 'p2p', 'quic', 'nat-traversal']
    },
    secondaryRepos: [
      { name: 'mpatel/dht-kademlia-sim', stars: 490, language: 'Go', languageColor: '#00ADD8', url: 'https://github.com/ragetech/aether' }
    ],
    socials: {
      github: 'https://github.com/maya-patel',
      x: 'https://x.com/mayapatel_net',
      website: 'https://mayapatel.dev'
    },
    gpgKey: '7D02 5591 E34C 9081'
  },
  {
    id: 9,
    handle: 'htanaka',
    name: 'Hiroshi Tanaka',
    squad: 'security',
    role: 'Kernel & MicroVM Engineer',
    status: '⚡ 12ms Firecracker boot',
    location: 'Tokyo, JP (UTC+9)',
    bio: 'Firecracker virtualization, KVM isolation, and secure seccomp containment for untrusted workloads.',
    stack: ['C', 'Linux Kernel', 'KVM', 'Rust'],
    ragetechProject: 'pulseos',
    featuredRepo: {
      name: 'htanaka/microvm-jail',
      tagline: 'Lightweight microVM sandbox runner with 12ms cold boot times and locked down seccomp-BPF filters.',
      stars: 1720,
      forks: 140,
      language: 'C',
      languageColor: '#555555',
      url: 'https://github.com/ragetech/pulseos',
      cloneUrl: 'git clone https://github.com/ragetech/pulseos.git',
      topics: ['c', 'kvm', 'firecracker', 'kernel']
    },
    secondaryRepos: [
      { name: 'htanaka/vsock-bridge', stars: 360, language: 'Rust', languageColor: '#dea584', url: 'https://github.com/ragetech/pulseos' }
    ],
    socials: {
      github: 'https://github.com/htanaka-kernel',
      x: 'https://x.com/tanaka_kernel',
      website: 'https://htanaka.jp'
    },
    gpgKey: '55E9 4481 0A77 3D21'
  },
  {
    id: 10,
    handle: 'cdubois',
    name: 'Chloe Dubois',
    squad: 'frontend',
    role: 'Creative Technologist',
    status: '🎨 GLSL compute & mesh shaders',
    location: 'Paris, FR (UTC+1)',
    bio: 'Bespoke dark-mode shaders, GPU-accelerated interface primitives, and high-frequency telemetry visualizers.',
    stack: ['Three.js', 'GLSL', 'WebGPU', 'TypeScript'],
    ragetechProject: 'eclipse',
    featuredRepo: {
      name: 'cdubois/glsl-telemetry-grid',
      tagline: 'Zero-overhead WebGPU shader graph rendering 1,000,000 telemetry points at 120 FPS in browser.',
      stars: 1390,
      forks: 112,
      language: 'TypeScript',
      languageColor: '#3178c6',
      url: 'https://github.com/ragetech/eclipse-ui',
      cloneUrl: 'git clone https://github.com/ragetech/eclipse-ui.git',
      topics: ['webgpu', 'glsl', 'telemetry', 'dataviz']
    },
    secondaryRepos: [
      { name: 'cdubois/dusk-shader-materials', stars: 540, language: 'GLSL', languageColor: '#5686a5', url: 'https://github.com/ragetech/eclipse-ui' }
    ],
    socials: {
      github: 'https://github.com/chloe-dubois',
      x: 'https://x.com/chloedubois_fx',
      website: 'https://dubois.art'
    },
    gpgKey: 'C104 99F2 331E 7B02'
  },
  {
    id: 11,
    handle: 'dkovacs',
    name: 'David Kovacs',
    squad: 'systems',
    role: 'Low-Latency IPC Engineer',
    status: '⚡ Zero-copy IPC bus',
    location: 'Budapest, HU (UTC+1)',
    bio: 'CPU cache line alignment, shared memory rings, and ultra-fast inter-process communication.',
    stack: ['C++', 'Shared Memory', 'IPC', 'Linux'],
    ragetechProject: 'hyperion',
    featuredRepo: {
      name: 'dkovacs/shm-bus-x86',
      tagline: 'Sub-40-nanosecond inter-process message bus via shared POSIX memory and atomic futexes.',
      stars: 1290,
      forks: 98,
      language: 'C++',
      languageColor: '#f34b7d',
      url: 'https://github.com/ragetech/hyperion',
      cloneUrl: 'git clone https://github.com/ragetech/hyperion.git',
      topics: ['cpp', 'ipc', 'shared-memory', 'perf']
    },
    secondaryRepos: [
      { name: 'dkovacs/cache-bench-linux', stars: 310, language: 'C', languageColor: '#555555', url: 'https://github.com/ragetech/hyperion' }
    ],
    socials: {
      github: 'https://github.com/david-kovacs',
      x: 'https://x.com/kovacs_ipc',
      website: 'https://kovacs.tech'
    },
    gpgKey: '7721 A098 C43E 15B9'
  },
  {
    id: 12,
    handle: 'nnour',
    name: 'Nadia Nour',
    squad: 'systems',
    role: 'Consensus Verification Specialist',
    status: '🔍 TLA+ formal spec verified',
    location: 'Cairo, EG (UTC+2)',
    bio: 'Formal validation of edge consensus states under Byzantine network partitions and sporadic disconnects.',
    stack: ['TLA+', 'Rust', 'Paxos', 'Raft'],
    ragetechProject: 'pulseos',
    featuredRepo: {
      name: 'nnour/tla-edge-consensus',
      tagline: 'Formal mathematical verification models for edge-partitioned state machines using TLA+ and TLC.',
      stars: 980,
      forks: 67,
      language: 'Rust',
      languageColor: '#dea584',
      url: 'https://github.com/ragetech/pulseos',
      cloneUrl: 'git clone https://github.com/ragetech/pulseos.git',
      topics: ['tla-plus', 'formal-verification', 'consensus', 'rust']
    },
    secondaryRepos: [
      { name: 'nnour/paxos-edge-runner', stars: 270, language: 'Rust', languageColor: '#dea584', url: 'https://github.com/ragetech/pulseos' }
    ],
    socials: {
      github: 'https://github.com/nadia-nour',
      x: 'https://x.com/nadianour_cs',
      website: 'https://nadianour.com'
    },
    gpgKey: '603A E891 22FB 883D'
  },
  {
    id: 13,
    handle: 'lsilva',
    name: 'Lucas Silva',
    squad: 'ai',
    role: 'Agent Runtime Developer',
    status: '🤖 Asynchronous DAG scheduler',
    location: 'São Paulo, BR (UTC-3)',
    bio: 'Deterministic execution graphs, cognitive state checkpoints, and autonomous workflow routing.',
    stack: ['Python', 'AsyncIO', 'Vector DB', 'gRPC'],
    ragetechProject: 'chimera',
    featuredRepo: {
      name: 'lsilva/dag-flow-async',
      tagline: 'Lightweight asynchronous execution graph kernel designed for stateful multi-agent workflows.',
      stars: 1870,
      forks: 154,
      language: 'Python',
      languageColor: '#3572A5',
      url: 'https://github.com/ragetech/chimera',
      cloneUrl: 'git clone https://github.com/ragetech/chimera.git',
      topics: ['python', 'asyncio', 'dag', 'agents']
    },
    secondaryRepos: [
      { name: 'lsilva/memory-embed-cache', stars: 520, language: 'Python', languageColor: '#3572A5', url: 'https://github.com/ragetech/chimera' }
    ],
    socials: {
      github: 'https://github.com/lucas-silva',
      x: 'https://x.com/lucassilvadev',
      website: 'https://silva.codes'
    },
    gpgKey: '109B 44E2 C771 90A2'
  },
  {
    id: 14,
    handle: 'aivanova',
    name: 'Anya Ivanova',
    squad: 'security',
    role: 'Compiler & Static Analysis Dev',
    status: '🛡️ LLVM taint analysis passes',
    location: 'Prague, CZ (UTC+1)',
    bio: 'Taint analysis algorithms, custom LLVM compiler passes, and compile-time supply chain validation.',
    stack: ['Rust', 'LLVM', 'AST Parsing', 'C++'],
    ragetechProject: 'hyperion',
    featuredRepo: {
      name: 'aivanova/llvm-taint-flow',
      tagline: 'Automated compile-time information flow control and buffer-overflow static analysis pass for LLVM.',
      stars: 1450,
      forks: 110,
      language: 'Rust',
      languageColor: '#dea584',
      url: 'https://github.com/ragetech/hyperion',
      cloneUrl: 'git clone https://github.com/ragetech/hyperion.git',
      topics: ['llvm', 'compiler', 'static-analysis', 'rust']
    },
    secondaryRepos: [
      { name: 'aivanova/cargo-audit-deep', stars: 430, language: 'Rust', languageColor: '#dea584', url: 'https://github.com/ragetech/hyperion' }
    ],
    socials: {
      github: 'https://github.com/anya-ivanova',
      x: 'https://x.com/anya_compiler',
      website: 'https://ivanova.io'
    },
    gpgKey: '8910 F722 00BC 3341'
  },
  {
    id: 15,
    handle: 'skim',
    name: 'Samuel Kim',
    squad: 'systems',
    role: 'WebAssembly Specialist',
    status: '⚡ WASI sandbox micro-tasks',
    location: 'Seoul, KR (UTC+9)',
    bio: 'Compiling edge tasks to isolated WebAssembly instances. Zero cold start, deterministic memory execution.',
    stack: ['WASM', 'WASI', 'Rust', 'Wasmtime'],
    ragetechProject: 'vortex',
    featuredRepo: {
      name: 'skim/wasm-cron-runtime',
      tagline: 'Sub-millisecond Wasmtime execution runner hosting 1,000 isolated guest tasks per worker node.',
      stars: 1670,
      forks: 138,
      language: 'Rust',
      languageColor: '#dea584',
      url: 'https://github.com/ragetech/vortex',
      cloneUrl: 'git clone https://github.com/ragetech/vortex.git',
      topics: ['wasm', 'wasi', 'rust', 'wasmtime']
    },
    secondaryRepos: [
      { name: 'skim/wasi-socket-shim', stars: 390, language: 'Rust', languageColor: '#dea584', url: 'https://github.com/ragetech/vortex' }
    ],
    socials: {
      github: 'https://github.com/samuel-kim',
      x: 'https://x.com/samuelkim_dev',
      website: 'https://skim.kr'
    },
    gpgKey: '445A 90FE 23B8 6612'
  },
  {
    id: 16,
    handle: 'zmorales',
    name: 'Zara Morales',
    squad: 'frontend',
    role: 'CRDT & Sync Engineer',
    status: '🔄 Automerge state convergence',
    location: 'Barcelona, ES (UTC+1)',
    bio: 'Local-first synchronization algorithms, offline CRDT conflict resolution, and real-time state trees.',
    stack: ['TypeScript', 'Automerge', 'WebSockets', 'Rust'],
    ragetechProject: 'aether',
    featuredRepo: {
      name: 'zmorales/automerge-webrtc',
      tagline: 'Zero-cloud collaborative state engine combining Automerge CRDTs with peer-to-peer data channels.',
      stars: 2110,
      forks: 172,
      language: 'TypeScript',
      languageColor: '#3178c6',
      url: 'https://github.com/ragetech/aether',
      cloneUrl: 'git clone https://github.com/ragetech/aether.git',
      topics: ['crdt', 'automerge', 'local-first', 'webrtc']
    },
    secondaryRepos: [
      { name: 'zmorales/crdt-visualizer', stars: 610, language: 'TypeScript', languageColor: '#3178c6', url: 'https://github.com/ragetech/aether' }
    ],
    socials: {
      github: 'https://github.com/zara-morales',
      x: 'https://x.com/zaramorales_dev',
      website: 'https://morales.tech'
    },
    gpgKey: 'D018 732B AA54 1109'
  },
  {
    id: 17,
    handle: 'jbecker',
    name: 'Julian Becker',
    squad: 'security',
    role: 'Infrastructure Automation Dev',
    status: '📦 NixOS hermetic edge nodes',
    location: 'Berlin, DE (UTC+1)',
    bio: 'Reproducible hermetic deployments across bare-metal server fleets using NixOS and Terraform.',
    stack: ['NixOS', 'Terraform', 'Bare-Metal', 'Rust'],
    ragetechProject: 'pulseos',
    featuredRepo: {
      name: 'jbecker/nix-edge-fleet',
      tagline: 'Hermetic, cryptographically verified NixOS declarative configurations for edge server clusters.',
      stars: 1320,
      forks: 104,
      language: 'Nix',
      languageColor: '#7e7eff',
      url: 'https://github.com/ragetech/pulseos',
      cloneUrl: 'git clone https://github.com/ragetech/pulseos.git',
      topics: ['nix', 'nixos', 'devops', 'bare-metal']
    },
    secondaryRepos: [
      { name: 'jbecker/wireguard-mesh-gen', stars: 450, language: 'Go', languageColor: '#00ADD8', url: 'https://github.com/ragetech/pulseos' }
    ],
    socials: {
      github: 'https://github.com/julian-becker',
      x: 'https://x.com/becker_infra',
      website: 'https://jbecker.de'
    },
    gpgKey: '992C 114F BC80 54A0'
  },
  {
    id: 18,
    handle: 'psharma',
    name: 'Priya Sharma',
    squad: 'ai',
    role: 'GPU Acceleration Engineer',
    status: '⚡ Custom FP8 TensorRT kernels',
    location: 'Bangalore, IN (UTC+5:30)',
    bio: 'Writing custom CUDA kernels to minimize transformer attention latency on edge NVIDIA GPUs.',
    stack: ['CUDA', 'C++', 'TensorRT', 'PyTorch'],
    ragetechProject: 'chimera',
    featuredRepo: {
      name: 'psharma/cuda-flash-fp8',
      tagline: 'Hand-optimized CUDA kernels for quantized transformer attention operating on Tensor Core architectures.',
      stars: 2890,
      forks: 245,
      language: 'CUDA',
      languageColor: '#3B9C9C',
      url: 'https://github.com/ragetech/chimera',
      cloneUrl: 'git clone https://github.com/ragetech/chimera.git',
      topics: ['cuda', 'gpu', 'deep-learning', 'tensorrt']
    },
    secondaryRepos: [
      { name: 'psharma/warp-shuffle-primitives', stars: 740, language: 'C++', languageColor: '#f34b7d', url: 'https://github.com/ragetech/chimera' }
    ],
    socials: {
      github: 'https://github.com/priya-sharma',
      x: 'https://x.com/priya_cuda',
      website: 'https://sharma.ai'
    },
    gpgKey: '66F3 44A1 89DE 0122'
  },
  {
    id: 19,
    handle: 'owright',
    name: 'Oliver Wright',
    squad: 'systems',
    role: 'Observability Specialist',
    status: '📊 eBPF probe zero overhead',
    location: 'Toronto, CA (UTC-4)',
    bio: 'Low-overhead profiling hooks, kernel tracepoints, and real-time distributed tracing without bytecode rewrites.',
    stack: ['eBPF', 'OpenTelemetry', 'Rust', 'Linux'],
    ragetechProject: 'hyperion',
    featuredRepo: {
      name: 'owright/ebpf-trace-zero',
      tagline: 'Kernel probe telemetry daemon sampling microsecond process transitions with under 0.1% CPU tax.',
      stars: 1540,
      forks: 118,
      language: 'Rust',
      languageColor: '#dea584',
      url: 'https://github.com/ragetech/hyperion',
      cloneUrl: 'git clone https://github.com/ragetech/hyperion.git',
      topics: ['ebpf', 'tracing', 'observability', 'rust']
    },
    secondaryRepos: [
      { name: 'owright/otel-fast-exporter', stars: 390, language: 'Go', languageColor: '#00ADD8', url: 'https://github.com/ragetech/hyperion' }
    ],
    socials: {
      github: 'https://github.com/oliver-wright',
      x: 'https://x.com/oliver_ebpf',
      website: 'https://owright.ca'
    },
    gpgKey: '5177 33D0 F189 CC45'
  },
  {
    id: 20,
    handle: 'mtakahashi',
    name: 'Mia Takahashi',
    squad: 'frontend',
    role: 'Design Systems Architect',
    status: '📐 Focus optics & WCAG AAA',
    location: 'Kyoto, JP (UTC+9)',
    bio: 'Micro-interactions, focus state optics, high-contrast dark modes, and developer tool ergonomics.',
    stack: ['CSS Architecture', 'Figma', 'TypeScript', 'A11y'],
    ragetechProject: 'eclipse',
    featuredRepo: {
      name: 'mtakahashi/focus-ring-optics',
      tagline: 'Mathematical model and CSS engine for concentric, optically balanced focus states across nested surfaces.',
      stars: 1120,
      forks: 85,
      language: 'TypeScript',
      languageColor: '#3178c6',
      url: 'https://github.com/ragetech/eclipse-ui',
      cloneUrl: 'git clone https://github.com/ragetech/eclipse-ui.git',
      topics: ['css', 'a11y', 'design-system', 'ui']
    },
    secondaryRepos: [
      { name: 'mtakahashi/terminal-palette-gen', stars: 490, language: 'TypeScript', languageColor: '#3178c6', url: 'https://github.com/ragetech/eclipse-ui' }
    ],
    socials: {
      github: 'https://github.com/mia-takahashi',
      x: 'https://x.com/miatakahashi_ui',
      website: 'https://takahashi.design'
    },
    gpgKey: '33A0 99DF 1150 48B1'
  },
  {
    id: 21,
    handle: 'gsantos',
    name: 'Gabriel Santos',
    squad: 'systems',
    role: 'Memory Internals Specialist',
    status: '🧹 Eliminating GC pauses in Go',
    location: 'Lisbon, PT (UTC+0)',
    bio: 'Custom jemalloc allocators, zero-allocation Go routines, and eliminating garbage collection latency.',
    stack: ['Go Runtime', 'jemalloc', 'C', 'Linux'],
    ragetechProject: 'pulseos',
    featuredRepo: {
      name: 'gsantos/go-zero-alloc',
      tagline: 'Static analysis and memory pool patterns to eliminate heap escapes in latency-critical Go services.',
      stars: 1480,
      forks: 122,
      language: 'Go',
      languageColor: '#00ADD8',
      url: 'https://github.com/ragetech/pulseos',
      cloneUrl: 'git clone https://github.com/ragetech/pulseos.git',
      topics: ['go', 'memory', 'performance', 'allocator']
    },
    secondaryRepos: [
      { name: 'gsantos/jemalloc-go-shim', stars: 320, language: 'C', languageColor: '#555555', url: 'https://github.com/ragetech/pulseos' }
    ],
    socials: {
      github: 'https://github.com/gabriel-santos',
      x: 'https://x.com/gsantos_systems',
      website: 'https://santos.pt'
    },
    gpgKey: 'AA29 4410 E888 7721'
  },
  {
    id: 22,
    handle: 'lhaddad',
    name: 'Leila Haddad',
    squad: 'security',
    role: 'Offensive Security Researcher',
    status: '🛡️ AFL++ protocol fuzzing harness',
    location: 'Tunis, TN (UTC+1)',
    bio: 'Simulating adversarial edge attacks, memory corruption exploits, and hardened sandboxing.',
    stack: ['AFL++', 'Fuzzing', 'Reverse Eng', 'Rust'],
    ragetechProject: 'aether',
    featuredRepo: {
      name: 'lhaddad/afl-network-fuzz',
      tagline: 'Automated differential fuzzing harness for network daemons with state machine state exploration.',
      stars: 1390,
      forks: 114,
      language: 'Rust',
      languageColor: '#dea584',
      url: 'https://github.com/ragetech/aether',
      cloneUrl: 'git clone https://github.com/ragetech/aether.git',
      topics: ['fuzzing', 'security', 'rust', 'afl']
    },
    secondaryRepos: [
      { name: 'lhaddad/webrtc-fuzz-suite', stars: 410, language: 'C++', languageColor: '#f34b7d', url: 'https://github.com/ragetech/aether' }
    ],
    socials: {
      github: 'https://github.com/leila-haddad',
      x: 'https://x.com/leilahaddad_sec',
      website: 'https://haddad.security'
    },
    gpgKey: '90EE 7714 5530 AB99'
  },
  {
    id: 23,
    handle: 'vnovak',
    name: 'Viktor Novak',
    squad: 'systems',
    role: 'Async Runtimes Developer',
    status: '⚡ Work-stealing queue optimization',
    location: 'Vienna, AT (UTC+1)',
    bio: 'Work-stealing schedulers, cross-thread synchronization, and timer wheel precision optimization.',
    stack: ['Rust', 'Tokio Internals', 'Priority Queues'],
    ragetechProject: 'vortex',
    featuredRepo: {
      name: 'vnovak/work-steal-ring',
      tagline: 'High-throughput lock-free work-stealing deque with Chase-Lev algorithm optimizations for multi-core CPUs.',
      stars: 1240,
      forks: 91,
      language: 'Rust',
      languageColor: '#dea584',
      url: 'https://github.com/ragetech/vortex',
      cloneUrl: 'git clone https://github.com/ragetech/vortex.git',
      topics: ['rust', 'concurrency', 'work-stealing', 'scheduler']
    },
    secondaryRepos: [
      { name: 'vnovak/tokio-flamegraph', stars: 360, language: 'Rust', languageColor: '#dea584', url: 'https://github.com/ragetech/vortex' }
    ],
    socials: {
      github: 'https://github.com/viktor-novak',
      x: 'https://x.com/viktornovak_at',
      website: 'https://novak.at'
    },
    gpgKey: '7412 CC09 EE55 198B'
  },
  {
    id: 24,
    handle: 'ewatson',
    name: 'Emily Watson',
    squad: 'systems',
    role: 'Mesh Network Engineer',
    status: '🕸️ GossipSub mesh topology',
    location: 'Melbourne, AU (UTC+10)',
    bio: 'Decentralized gossip protocols, peer discovery topologies, and dynamic network routing algorithms.',
    stack: ['libp2p', 'GossipSub', 'Go', 'Rust'],
    ragetechProject: 'aether',
    featuredRepo: {
      name: 'ewatson/gossip-mesh-sim',
      tagline: 'High-fidelity network simulator modeling 10,000 P2P nodes broadcasting under sporadic packet drops.',
      stars: 1610,
      forks: 128,
      language: 'Go',
      languageColor: '#00ADD8',
      url: 'https://github.com/ragetech/aether',
      cloneUrl: 'git clone https://github.com/ragetech/aether.git',
      topics: ['p2p', 'gossipsub', 'libp2p', 'go']
    },
    secondaryRepos: [
      { name: 'ewatson/kad-routing-table', stars: 430, language: 'Rust', languageColor: '#dea584', url: 'https://github.com/ragetech/aether' }
    ],
    socials: {
      github: 'https://github.com/emily-watson',
      x: 'https://x.com/emily_mesh',
      website: 'https://ewatson.dev'
    },
    gpgKey: '883C 119A 44DE 5501'
  },
  {
    id: 25,
    handle: 'ksato',
    name: 'Kenji Sato',
    squad: 'security',
    role: 'Virtualization Developer',
    status: '⚡ vsock zero-latency channel',
    location: 'Osaka, JP (UTC+9)',
    bio: 'Guest-host communication channels via virtual sockets (vsock), isolated memory segments, and hypervisors.',
    stack: ['Rust', 'KVM', 'containerd', 'Linux'],
    ragetechProject: 'pulseos',
    featuredRepo: {
      name: 'ksato/vsock-stream-rs',
      tagline: 'Fast asynchronous streaming transport over Linux virtio-vsock for sub-millisecond host-guest IPC.',
      stars: 1180,
      forks: 89,
      language: 'Rust',
      languageColor: '#dea584',
      url: 'https://github.com/ragetech/pulseos',
      cloneUrl: 'git clone https://github.com/ragetech/pulseos.git',
      topics: ['rust', 'vsock', 'virtualization', 'kvm']
    },
    secondaryRepos: [
      { name: 'ksato/kvm-toy-vmm', stars: 580, language: 'Rust', languageColor: '#dea584', url: 'https://github.com/ragetech/pulseos' }
    ],
    socials: {
      github: 'https://github.com/kenji-sato',
      x: 'https://x.com/kenjisato_dev',
      website: 'https://sato.osaka'
    },
    gpgKey: '3310 F099 77BC 2244'
  },
  {
    id: 26,
    handle: 'crossi',
    name: 'Camilla Rossi',
    squad: 'frontend',
    role: 'Platform UI Engineer',
    status: '🚀 Fast static delivery & docs',
    location: 'Milan, IT (UTC+1)',
    bio: 'Clean typography, fast zero-dependency page delivery, developer documentation, and static performance.',
    stack: ['TypeScript', 'Modern Web', 'CSS', 'Wasm'],
    ragetechProject: 'eclipse',
    featuredRepo: {
      name: 'crossi/static-docs-engine',
      tagline: 'Ultra-fast Markdown documentation generator with zero JavaScript runtime and instant search index.',
      stars: 1430,
      forks: 115,
      language: 'TypeScript',
      languageColor: '#3178c6',
      url: 'https://github.com/ragetech/eclipse-ui',
      cloneUrl: 'git clone https://github.com/ragetech/eclipse-ui.git',
      topics: ['typescript', 'docs', 'static-site', 'perf']
    },
    secondaryRepos: [
      { name: 'crossi/minimal-prism-theme', stars: 390, language: 'CSS', languageColor: '#563d7c', url: 'https://github.com/ragetech/eclipse-ui' }
    ],
    socials: {
      github: 'https://github.com/camilla-rossi',
      x: 'https://x.com/rossi_camilla',
      website: 'https://camillarossi.dev'
    },
    gpgKey: '998A CC01 3345 BE11'
  },
  {
    id: 27,
    handle: 'nbrooks',
    name: 'Nathan Brooks',
    squad: 'ai',
    role: 'WebGPU & Compute Dev',
    status: '⚡ WGSL neural weights shader',
    location: 'Austin, US (UTC-5)',
    bio: 'Executing quantized neural weights directly inside browser GPU shaders using WebGPU and WGSL.',
    stack: ['WebGPU', 'WGSL', 'Rust', 'CUDA'],
    ragetechProject: 'chimera',
    featuredRepo: {
      name: 'nbrooks/wgsl-matmul-fast',
      tagline: 'Tiled matrix multiplication WGSL shaders delivering 2.4 TFLOPS on modern browser WebGPU devices.',
      stars: 2310,
      forks: 184,
      language: 'Rust',
      languageColor: '#dea584',
      url: 'https://github.com/ragetech/chimera',
      cloneUrl: 'git clone https://github.com/ragetech/chimera.git',
      topics: ['webgpu', 'wgsl', 'compute', 'neural-nets']
    },
    secondaryRepos: [
      { name: 'nbrooks/browser-gguf-runner', stars: 820, language: 'TypeScript', languageColor: '#3178c6', url: 'https://github.com/ragetech/chimera' }
    ],
    socials: {
      github: 'https://github.com/nathan-brooks',
      x: 'https://x.com/nbrooks_gpu',
      website: 'https://brooks.compute'
    },
    gpgKey: '44DF 0019 883E 6721'
  },
  {
    id: 28,
    handle: 'fzaid',
    name: 'Farah Zaid',
    squad: 'systems',
    role: 'Performance Profiling Dev',
    status: '⚡ Linux perf & branch prediction',
    location: 'Amman, JO (UTC+3)',
    bio: 'Instruction-level CPU optimization, flamegraphs, branch prediction tuning, and SIMD vectorization.',
    stack: ['Flamegraphs', 'Linux Perf', 'SIMD', 'C++'],
    ragetechProject: 'hyperion',
    featuredRepo: {
      name: 'fzaid/flamegraph-stream',
      tagline: 'Real-time Linux perf profiling tool outputting interactive SVG flamegraphs on live production services.',
      stars: 1780,
      forks: 139,
      language: 'C++',
      languageColor: '#f34b7d',
      url: 'https://github.com/ragetech/hyperion',
      cloneUrl: 'git clone https://github.com/ragetech/hyperion.git',
      topics: ['perf', 'flamegraphs', 'profiling', 'cpp']
    },
    secondaryRepos: [
      { name: 'fzaid/simd-string-find', stars: 450, language: 'C++', languageColor: '#f34b7d', url: 'https://github.com/ragetech/hyperion' }
    ],
    socials: {
      github: 'https://github.com/farah-zaid',
      x: 'https://x.com/farah_perf',
      website: 'https://zaid.engineer'
    },
    gpgKey: '6610 EE98 44A2 001B'
  },
  {
    id: 29,
    handle: 'oberg',
    name: 'Oscar Berg',
    squad: 'frontend',
    role: 'Developer Experience Lead',
    status: '⌨️ High-performance TUI engine',
    location: 'Oslo, NO (UTC+1)',
    bio: 'Keyboard-driven ergonomics, terminal user interfaces, and command-line developer tools.',
    stack: ['Go', 'Terminal UX', 'Rust', 'BubbleTea'],
    ragetechProject: 'eclipse',
    featuredRepo: {
      name: 'oberg/tui-forge',
      tagline: 'Composable high-performance terminal user interface framework for monitoring edge servers.',
      stars: 2490,
      forks: 195,
      language: 'Go',
      languageColor: '#00ADD8',
      url: 'https://github.com/ragetech/eclipse-ui',
      cloneUrl: 'git clone https://github.com/ragetech/eclipse-ui.git',
      topics: ['tui', 'go', 'terminal', 'cli']
    },
    secondaryRepos: [
      { name: 'oberg/keybind-parser-rs', stars: 520, language: 'Rust', languageColor: '#dea584', url: 'https://github.com/ragetech/eclipse-ui' }
    ],
    socials: {
      github: 'https://github.com/oscar-berg',
      x: 'https://x.com/oscarberg_cli',
      website: 'https://berg.run'
    },
    gpgKey: '119A 4488 C012 FE99'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DEVELOPERS: window.DEVELOPERS };
}

