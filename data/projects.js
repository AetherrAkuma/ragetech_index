/**
 * RAGETECH.DEV — Incubated Projects Registry
 * Modular specifications for collective repositories.
 * 
 * To add a new project:
 * 1. Add your project configuration to the PROJECTS array below.
 * 2. Submit a Pull Request to ragetech_index.
 */

window.PROJECTS = [
  {
    id: 'hyperion',
    name: 'Hyperion',
    repo: 'ragetech/hyperion',
    badge: 'v0.9.4-alpha',
    summary: 'Ultra-low-latency event streaming engine written in pure Rust. Built on lock-free memory ring buffers and Linux io_uring kernel bypass.',
    stars: 1840,
    forks: 142,
    language: 'Rust',
    languageColor: '#dea584',
    githubUrl: 'https://github.com/ragetech/hyperion',
    cloneUrl: 'git clone https://github.com/ragetech/hyperion.git',
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
    stars: 2190,
    forks: 188,
    language: 'Go',
    languageColor: '#00ADD8',
    githubUrl: 'https://github.com/ragetech/pulseos',
    cloneUrl: 'git clone https://github.com/ragetech/pulseos.git',
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
    stars: 3410,
    forks: 312,
    language: 'Python',
    languageColor: '#3572A5',
    githubUrl: 'https://github.com/ragetech/chimera',
    cloneUrl: 'git clone https://github.com/ragetech/chimera.git',
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
    badge: 'v1.1.0-rc3',
    summary: 'High-density design token system and zero-runtime component foundation engineered for complex developer tools and monitoring suites.',
    stars: 1280,
    forks: 94,
    language: 'TypeScript',
    languageColor: '#3178c6',
    githubUrl: 'https://github.com/ragetech/eclipse-ui',
    cloneUrl: 'git clone https://github.com/ragetech/eclipse-ui.git',
    specs: [
      { label: 'Bundle Size', val: '0 KB runtime overhead' },
      { label: 'Token Scale', val: 'OKLCH color system with APCA contrast' },
      { label: 'Primitives', val: '48 accessible, headless components' },
      { label: 'Runtime Stack', val: 'Vanilla CSS / PostCSS / TypeScript' }
    ],
    previewTitle: 'design_tokens.css',
    previewType: 'code',
    previewContent: `:root {
  /* Hairline precision border scales */
  --hairline: rgba(255, 255, 255, 0.07);
  --border-focus: #f4f4f5;
  
  /* OKLCH surface scales */
  --surface-base: oklch(14.5% 0.005 285);
  --surface-elevated: oklch(17.8% 0.008 285);
  --accent-cyan: oklch(78.2% 0.142 210);
}`,
    previewMeta: 'Conforms to WCAG 2.2 AAA contrast standards',
    assignees: ['slindqvist', 'cdubois', 'mtakahashi', 'crossi'],
    fullSpec: {
      arch: 'Pure CSS variable tokens paired with lightweight, zero-dependency custom elements.',
      goal: 'Eliminate heavyweight JavaScript UI component libraries.',
      status: 'Powers ragetech.dev and internal telemetry consoles.'
    }
  },
  {
    id: 'vortex',
    name: 'Vortex Scheduler',
    repo: 'ragetech/vortex',
    badge: 'v0.6.2-beta',
    summary: 'Sub-millisecond job scheduling daemon for heterogeneous compute workloads. Replaces heavy distributed cron engines.',
    stars: 1560,
    forks: 130,
    language: 'Rust',
    languageColor: '#dea584',
    githubUrl: 'https://github.com/ragetech/vortex',
    cloneUrl: 'git clone https://github.com/ragetech/vortex.git',
    specs: [
      { label: 'Dispatch Tick', val: '10 microseconds' },
      { label: 'Capacity', val: '10,000,000 concurrent timers' },
      { label: 'Failover', val: 'Raft consensus failover < 50ms' },
      { label: 'Runtime Stack', val: 'Rust / Tokio / WASM / RocksDB' }
    ],
    previewTitle: 'schedule_manifest.yaml',
    previewType: 'code',
    previewContent: `schedule:
  id: "telemetry-flush-01"
  cron: "*/5 * * * * *"
  precision: "sub-millisecond"
  dispatch:
    target: "wasm://runtime/metrics-sink"
    timeout: "250ms"
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
    stars: 2040,
    forks: 165,
    language: 'Rust',
    languageColor: '#dea584',
    githubUrl: 'https://github.com/ragetech/aether',
    cloneUrl: 'git clone https://github.com/ragetech/aether.git',
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROJECTS: window.PROJECTS };
}

