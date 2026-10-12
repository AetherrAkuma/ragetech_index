(function () {
  const root = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this);
  root.RAGETECH_PROJECTS = [
  {
    id: "hyperion",
    slug: "hyperion",
    name: "Hyperion",
    repo: "ragetech/hyperion",
    badge: "v0.9.4-alpha",
    tagline: "Ultra-low-latency event streaming engine written in pure Rust. Built on lock-free memory ring buffers and Linux io_uring kernel bypass.",
    summary: "Ultra-low-latency event streaming engine written in pure Rust. Built on lock-free memory ring buffers and Linux io_uring kernel bypass.",
    description: "A high-performance streaming runtime designed to eliminate GC pauses. Built on lock-free memory ring buffers, Linux io_uring kernel bypass, and SIMD batch parsers.",
    category: "Distributed Runtimes",
    status: "active",
    action_button_label: "Spec",
    action_button_url: "https://github.com/ragetech/hyperion",
    live_url: "https://hyperion.ragetech.dev",
    github_url: "https://github.com/ragetech/hyperion",
    cover_image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    tech_stack: "Rust, Tokio, io_uring, SIMD",
    specs: [
      { label: "Throughput", val: "1.42M events/sec / core" },
      { label: "Latency (p99)", val: "0.24ms" },
      { label: "Memory Overhead", val: "< 16 MB RSS baseline" },
      { label: "Runtime Stack", val: "Rust / Tokio / io_uring" }
    ],
    previewTitle: "telemetry_sink.rs",
    previewType: "code",
    previewContent: `// Socket ring buffer initialization
let ring = IoUring::builder()
    .setup_sqpoll(1000)
    .build(4096)?;

let stream = HyperionStream::bind("0.0.0.0:8443")
    .with_zero_copy()
    .with_simd_parser::<BatchSize<64>>()
    .spawn_workers(16);

println!("Hyperion worker pool online: 16 rings active");`,
    previewMeta: "Cargo.lock: tokio v1.42, io-uring v0.7.4",
    assignees: ["reymartchua", "sora", "mateo", "yuki"],
    markdown_content: `## 1. Abstract & Motivation

Modern streaming distributed brokers suffer from Java Virtual Machine garbage-collection pauses, multi-megabyte buffer footprints, and kernel-space context switching overhead. **Hyperion** re-engineers event streaming from the silicon up, pairing Linux \`io_uring\` ring buffers with cache-coherent lock-free memory rings in pure, memory-safe Rust.

> "By bypassing standard BSD socket syscalls and processing messages in SIMD batches, Hyperion delivers predictable sub-millisecond tail latencies under multi-gigabit workloads."

## 2. Lock-Free Memory Rings & io_uring

Hyperion maps consumer ring buffers directly into shared physical pages:

\`\`\`rust
// Zero-copy socket ring buffer initialization
let ring = IoUring::builder()
    .setup_sqpoll(1000)
    .build(4096)?;

let stream = HyperionStream::bind("0.0.0.0:8443")
    .with_zero_copy()
    .with_simd_parser::<BatchSize<64>>()
    .spawn_workers(16);

println!("Hyperion worker pool online: 16 rings active");
\`\`\`

## 3. Production Benchmarks

Under 100GbE bare-metal load tests, Hyperion achieved sustained throughput of **1,420,000 events/sec per core** with a p99 latency of **0.24ms** while consuming under 16MB resident memory.
`
  },
  {
    id: "pulseos",
    slug: "pulseos",
    name: "PulseOS KV",
    repo: "ragetech/pulseos",
    badge: "v0.8.1-dev",
    tagline: "Distributed key-value store engineered for sovereign edge clusters. Combines Raft consensus with eBPF network acceleration.",
    summary: "Distributed key-value store engineered for sovereign edge clusters. Combines Raft consensus with eBPF network acceleration.",
    description: "Distributed key-value store engineered for sovereign edge clusters. Combines Raft consensus with eBPF network acceleration and RocksDB persistent storage.",
    category: "Distributed Runtimes",
    status: "active",
    action_button_label: "Spec",
    action_button_url: "https://github.com/ragetech/pulseos",
    live_url: "https://pulseos.ragetech.dev",
    github_url: "https://github.com/ragetech/pulseos",
    cover_image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    tech_stack: "Go, Raft, eBPF, RocksDB",
    specs: [
      { label: "Consensus", val: "Multi-Raft v2 with Learner nodes" },
      { label: "Cold Boot", val: "12ms on Firecracker microVM" },
      { label: "Replication", val: "Synchronous edge quorum (3 of 5)" },
      { label: "Runtime Stack", val: "Go / Raft / eBPF / RocksDB" }
    ],
    previewTitle: "cluster_state.json",
    previewType: "json",
    previewContent: `{
  "cluster_id": "pulse-edge-us-east",
  "raft_term": 8942,
  "leader_node": "node-01.ragetech.internal",
  "quorum_status": "5/5 synchronized",
  "replication_lag": "< 0.12ms",
  "ebpf_filter": "ACTIVE (zero-copy socket pass)"
}`,
    previewMeta: "Cluster: 5 nodes across 3 availability zones",
    assignees: ["marcus", "devon", "tariq", "clara"],
    markdown_content: `## 1. Edge Storage Consensus

PulseOS KV is built for sovereign edge clusters where nodes experience intermittent network partitions. By combining a hardened Multi-Raft protocol with in-kernel eBPF socket filters, read commands bypass user space entirely when state is provably stable.

\`\`\`json
{
  "cluster_id": "pulse-edge-us-east",
  "raft_term": 8942,
  "leader_node": "node-01.ragetech.internal",
  "quorum_status": "5/5 synchronized",
  "replication_lag": "< 0.12ms",
  "ebpf_filter": "ACTIVE (zero-copy socket pass)"
}
\`\`\`

## 2. Fast Failover and Zero Partition Drift

State persistence is backed by custom RocksDB block tables tuned for solid-state flash memory wear leveling.
`
  },
  {
    id: "chimera",
    slug: "chimera",
    name: "Chimera Runtime",
    repo: "ragetech/chimera",
    badge: "v0.4.0-preview",
    tagline: "Deterministic multi-agent execution kernel. Coordinates asynchronous cognitive workflows with verified memory checkpoints.",
    summary: "Deterministic multi-agent execution kernel. Coordinates asynchronous cognitive workflows with verified memory checkpoints.",
    description: "Deterministic multi-agent execution kernel. Coordinates asynchronous cognitive workflows with verified memory checkpoints and vector cache.",
    category: "Compilers",
    status: "active",
    action_button_label: "Spec",
    action_button_url: "https://github.com/ragetech/chimera",
    live_url: "https://chimera.ragetech.dev",
    github_url: "https://github.com/ragetech/chimera",
    cover_image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    tech_stack: "Python, PyTorch, CUDA, gRPC",
    specs: [
      { label: "Execution Model", val: "Asynchronous DAG with state rewind" },
      { label: "Context Engine", val: "Memory-mapped vector cache (2M tokens)" },
      { label: "Inference Target", val: "Distributed vLLM / TensorRT-LLM" },
      { label: "Runtime Stack", val: "Python / PyTorch / CUDA / gRPC" }
    ],
    previewTitle: "dag_trace.log",
    previewType: "log",
    previewContent: `[00:00:00.012] SPAN: root_dispatch -> worker_pool [16 agents]
[00:00:00.045] STEP: retrieval_pass (vector_index: 4,096 docs) -> 1.4ms
[00:00:00.118] STEP: model_inference (batch_size=8) -> 64.2ms
[00:00:00.134] STEP: verification_gate (schema_assert=PASS)
[00:00:00.141] RESULT: DAG complete (total: 129ms, memory: 48MB)`,
    previewMeta: "GPU: CUDA 12.6 / TensorRT 10.4",
    assignees: ["elena", "ananya", "astrid", "selene"],
    markdown_content: `## 1. Deterministic Multi-Agent Coordination

Asynchronous cognitive workflows frequently collapse when downstream LLM agents hallucinate or fail structural schema assertions. **Chimera Runtime** introduces a formal directed acyclic graph (DAG) scheduler with reversible state checkpoints.

\`\`\`log
[00:00:00.012] SPAN: root_dispatch -> worker_pool [16 agents]
[00:00:00.045] STEP: retrieval_pass (vector_index: 4,096 docs) -> 1.4ms
[00:00:00.118] STEP: model_inference (batch_size=8) -> 64.2ms
[00:00:00.134] STEP: verification_gate (schema_assert=PASS)
[00:00:00.141] RESULT: DAG complete (total: 129ms, memory: 48MB)
\`\`\`

## 2. Memory-Mapped Vector Cache

A 2-million token shared memory arena allows multiple worker processes to inspect the same inference context without duplication or serialization overhead.
`
  },
  {
    id: "eclipse",
    slug: "eclipse",
    name: "Eclipse UI",
    repo: "ragetech/eclipse-ui",
    badge: "v1.1.0-rc3",
    tagline: "High-density design token system and zero-runtime component foundation engineered for complex developer tools and monitoring suites.",
    summary: "High-density design token system and zero-runtime component foundation engineered for complex developer tools and monitoring suites.",
    description: "High-density design token system and zero-runtime component foundation engineered for complex developer tools and monitoring suites.",
    category: "Kernel & Systems",
    status: "active",
    action_button_label: "Spec",
    action_button_url: "https://github.com/ragetech/eclipse-ui",
    live_url: "https://eclipse.ragetech.dev",
    github_url: "https://github.com/ragetech/eclipse-ui",
    cover_image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    tech_stack: "Vanilla CSS, PostCSS, TypeScript",
    specs: [
      { label: "Bundle Size", val: "0 KB runtime overhead" },
      { label: "Token Scale", val: "OKLCH color system with APCA contrast" },
      { label: "Primitives", val: "48 accessible, headless components" },
      { label: "Runtime Stack", val: "Vanilla CSS / PostCSS / TypeScript" }
    ],
    previewTitle: "design_tokens.css",
    previewType: "code",
    previewContent: `:root {
  /* Hairline precision border scales */
  --hairline: rgba(255, 255, 255, 0.07);
  --border-focus: #f4f4f5;
  
  /* OKLCH surface scales */
  --surface-base: oklch(14.5% 0.005 285);
  --surface-elevated: oklch(17.8% 0.008 285);
  --accent-cyan: oklch(78.2% 0.142 210);
}`,
    previewMeta: "Conforms to WCAG 2.2 AAA contrast standards",
    assignees: ["chloe", "liam", "maya", "julian"],
    markdown_content: `## 1. Zero-Runtime Design Architecture

Heavy frontend component frameworks introduce megabytes of JavaScript dependencies that slow down systems consoles. **Eclipse UI** relies entirely on CSS custom properties, modern pseudo-classes, and accessible headless web primitives.

\`\`\`css
:root {
  /* Hairline precision border scales */
  --hairline: rgba(255, 255, 255, 0.07);
  --border-focus: #f4f4f5;
  
  /* OKLCH surface scales */
  --surface-base: oklch(14.5% 0.005 285);
  --surface-elevated: oklch(17.8% 0.008 285);
  --accent-cyan: oklch(78.2% 0.142 210);
}
\`\`\`

## 2. High-Density Observability

Designed specifically for systems engineers who require maximum information density, monospace data alignment, and microsecond responsiveness.
`
  },
  {
    id: "vortex",
    slug: "vortex",
    name: "Vortex Scheduler",
    repo: "ragetech/vortex",
    badge: "v0.6.2-beta",
    tagline: "Sub-millisecond job scheduling daemon for heterogeneous compute workloads. Replaces heavy distributed cron engines.",
    summary: "Sub-millisecond job scheduling daemon for heterogeneous compute workloads. Replaces heavy distributed cron engines.",
    description: "Sub-millisecond job scheduling daemon for heterogeneous compute workloads. Replaces heavy distributed cron engines.",
    category: "Kernel & Systems",
    status: "active",
    action_button_label: "Spec",
    action_button_url: "https://github.com/ragetech/vortex",
    live_url: "https://vortex.ragetech.dev",
    github_url: "https://github.com/ragetech/vortex",
    cover_image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    tech_stack: "Rust, Tokio, WASM, RocksDB",
    specs: [
      { label: "Dispatch Tick", val: "10 microseconds" },
      { label: "Capacity", val: "10,000,000 concurrent timers" },
      { label: "Failover", val: "Raft consensus failover < 50ms" },
      { label: "Runtime Stack", val: "Rust / Tokio / WASM / RocksDB" }
    ],
    previewTitle: "schedule_manifest.yaml",
    previewType: "code",
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
    previewMeta: "Queue status: 0 backlog, 128 workers healthy",
    assignees: ["kai", "darius", "rachel", "arjun"],
    markdown_content: `## 1. Precision Event Dispatch

Standard distributed cron solutions query database tables every minute, creating thundering herd spikes and latency jitter. **Vortex Scheduler** utilizes hierarchical timing wheels with 10-microsecond dispatch resolution.

\`\`\`yaml
schedule:
  id: "telemetry-flush-01"
  cron: "*/5 * * * * *"
  precision: "sub-millisecond"
  dispatch:
    target: "wasm://runtime/metrics-sink"
    timeout: "250ms"
    jitter_budget: "50us"
    retry:
      max_attempts: 3
      backoff: exponential
\`\`\`

## 2. High-Capacity Timer Arenas

Supports up to 10 million active timers per instance with Raft-synchronized failover under 50 milliseconds.
`
  },
  {
    id: "aether",
    slug: "aether",
    name: "Aether P2P",
    repo: "ragetech/aether",
    badge: "v0.3.5-alpha",
    tagline: "P2P collaborative CRDT sync mesh for browser and native applications. Converges distributed states without central servers.",
    summary: "P2P collaborative CRDT sync mesh for browser and native applications. Converges distributed states without central servers.",
    description: "P2P collaborative CRDT sync mesh for browser and native applications. Converges distributed states without central servers.",
    category: "Distributed Runtimes",
    status: "active",
    action_button_label: "Spec",
    action_button_url: "https://github.com/ragetech/aether",
    live_url: "https://aether.ragetech.dev",
    github_url: "https://github.com/ragetech/aether",
    cover_image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    tech_stack: "Rust, WASM, WebRTC, CRDT",
    specs: [
      { label: "Peer Latency", val: "< 8ms over encrypted WebRTC" },
      { label: "Conflict Rate", val: "0.00% (Automerge CRDT)" },
      { label: "Discovery", val: "Encrypted DHT via libp2p" },
      { label: "Runtime Stack", val: "Rust / WASM / WebRTC / CRDT" }
    ],
    previewTitle: "webrtc_mesh.log",
    previewType: "log",
    previewContent: `[18:24:02.102] PEER_DISCOVERY: ICE candidate gathered -> 192.88.99.1:51820
[18:24:02.110] HANDSHAKE: authenticated with Curve25519 key
[18:24:02.114] CRDT_SYNC: Vector clock synchronized (delta=0)
[18:24:02.116] STATUS: P2P mesh converged (4 active nodes)`,
    previewMeta: "Mesh topology: 4 peers connected directly",
    assignees: ["zara", "lucas", "nikolai", "kofi"],
    markdown_content: `## 1. Serverless Peer-to-Peer Convergence

Aether P2P enables local-first collaborative software where client nodes synchronize document state across encrypted WebRTC data channels with zero server intermediaries.

\`\`\`log
[18:24:02.102] PEER_DISCOVERY: ICE candidate gathered -> 192.88.99.1:51820
[18:24:02.110] HANDSHAKE: authenticated with Curve25519 key
[18:24:02.114] CRDT_SYNC: Vector clock synchronized (delta=0)
[18:24:02.116] STATUS: P2P mesh converged (4 active nodes)
\`\`\`

## 2. Automerge CRDT & Libp2p Discovery

State mutations are recorded in compact vector clocks that guarantee mathematical convergence across concurrent offline edits.
`
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RAGETECH_PROJECTS: root.RAGETECH_PROJECTS };
}
})();
