// ========================================================================
// Ragetech Collective — Offline Projects & Whitepaper Sections Dataset
// ========================================================================

const rootScope = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this);
rootScope.RAGETECH_PROJECTS = [
  {
    id: "proj-01",
    slug: "aether-runtime",
    name: "Aether Runtime",
    tagline: "Deterministic zero-overhead WebAssembly execution sandbox at the edge",
    description: "A lightweight WebAssembly micro-runtime designed for multi-tenant edge isolation. Executes untrusted binaries with zero-copy I/O, nanosecond cold starts, and linear memory safety.",
    category: "Distributed Runtimes",
    status: "active",
    action_button_label: "Visit Site",
    action_button_url: "https://aether.ragetech.dev",
    live_url: "https://aether.ragetech.dev",
    github_url: "https://github.com/ragetech/aether-runtime",
    cover_image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    tech_stack: "Rust, WebAssembly, Cranelift, io_uring",
    stats: {
      cold_start: "0.18ms",
      memory_overhead: "28KB",
      stars: 3410,
      license: "Apache-2.0"
    },
    markdown_content: `## 1. Abstract & Motivation

Modern serverless runtimes suffer from heavyweight container virtualization, multi-megabyte memory footprints, and multi-millisecond cold starts. **Aether Runtime** reimagines the edge execution layer by stripping away guest operating systems, running native WebAssembly bytecode inside sandboxed memory arenas managed directly by the host kernel. 

> "By eliminating filesystem overhead and implementing deterministic memory bounds, Aether executes thousands of concurrent tenant tasks within a single operating system process."

## 2. Memory Isolation & Cranelift JIT

Each tenant task is allocated an isolated 4GB 32-bit linear memory space with guard pages that cause immediate segmentation fault traps on out-of-bounds access. The Cranelift optimizing compiler compiles WASM modules directly into machine code in single-digit milliseconds. 

\`\`\`rust
// Zero-copy linear memory sandbox initialization
pub struct WasmSandboxArena {
    linear_memory: MmapMemoryPool,
    epoch_timer: Arc<AtomicU64>,
    trap_handler: HostTrapTable,
}

impl WasmSandboxArena {
    pub fn instantiate_tenant(&self, module_bytes: &[u8]) -> Result<TenantInstance, Trap> {
        let compiled = CraneliftJIT::compile_fast(module_bytes)?;
        let memory = self.linear_memory.allocate_guarded_arena(64 * 1024)?;
        Ok(TenantInstance::bind(compiled, memory))
    }
}
\`\`\`

Linear memory pages are lazily mapped using kernel copy-on-write (COW) semantics, ensuring tenant instances initialize with an effective RSS footprint of less than **28 Kilobytes**.

## 3. Zero-Copy Asynchronous I/O via io_uring

Traditional network proxies incur significant CPU cycles copying bytes between kernel socket buffers and user-space runtime buffers. Aether interfaces directly with Linux \`io_uring\` ring buffers to establish zero-copy memory transfers:

- **Kernel Submission Queue (SQ):** Async socket read descriptors are enqueued without syscall context switches.
- **Completion Queue (CQ):** In-kernel hardware network packets populate tenant arenas directly.
- **Hardware NIC Descriptors:** Zero serialization or intermediate string allocations.

## 4. Production Benchmarks & Edge Verification

Under synthetic benchmark load testing across 10 global Cloudflare edge POPs, Aether achieved median cold-start latencies of **180 microseconds**, handling **2,400,000 requests per second** per node.

| Metric | Docker Container | Firecracker MicroVM | Aether Runtime |
| :--- | :--- | :--- | :--- |
| **Cold Start** | 450ms | 120ms | **0.18ms** |
| **Memory Base** | 42MB | 5MB | **28KB** |
| **P99 Latency** | 18.2ms | 4.8ms | **1.4ms** |
| **Syscall Trap** | ~2,100 | ~480 | **0 (Sandboxed)** |
`,
    sections: [
      {
        title: "1. Abstract & Motivation",
        content: "Modern serverless runtimes suffer from heavyweight container virtualization, multi-megabyte memory footprints, and multi-millisecond cold starts. Aether Runtime reimagines the edge execution layer by stripping away guest operating systems, running native WebAssembly bytecode inside sandboxed memory arenas managed directly by the host kernel."
      },
      {
        title: "2. Memory Isolation & Cranelift JIT",
        content: "Each tenant task is allocated an isolated 4GB 32-bit linear memory space with guard pages that cause immediate segmentation fault traps on out-of-bounds access. The Cranelift optimizing compiler compiles WASM modules directly into machine code in single-digit milliseconds."
      },
      {
        title: "3. Zero-Copy Asynchronous I/O",
        content: "Traditional network proxies incur significant CPU cycles copying bytes between kernel socket buffers and user-space runtime buffers. Aether interfaces directly with Linux io_uring ring buffers to establish zero-copy memory transfers."
      },
      {
        title: "4. Production Benchmarks & Edge Verification",
        content: "Under synthetic benchmark load testing across 10 global Cloudflare edge POPs, Aether achieved median cold-start latencies of 180 microseconds, handling 2,400,000 requests per second per node with a 99.9th percentile response time of 1.4 milliseconds."
      }
    ],
    maintainer_handles: ["sora", "ananya", "mateo", "inga", "yuki"]
  },
  {
    id: "proj-02",
    slug: "vortex-db",
    name: "Vortex DB",
    tagline: "Decentralized transactional SQLite replication engine across global edge nodes",
    description: "Global SQLite state replication engine with causal consistency, multi-region snapshot isolation, and delta CRDT sync over stream websockets. Zero config, sub-millisecond local reads.",
    category: "Distributed Runtimes",
    status: "active",
    action_button_label: "Visit Site",
    action_button_url: "https://vortex.ragetech.dev",
    live_url: "https://vortex.ragetech.dev",
    github_url: "https://github.com/ragetech/vortex-db",
    cover_image_url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    tech_stack: "C++23, SQLite3, Raft, QUIC",
    stats: {
      read_latency: "0.4ms",
      sync_window: "12ms",
      stars: 2890,
      license: "MIT"
    },
    markdown_content: `## 1. The Edge State Dilemma

Centralized relational databases force geographically distributed users to incur hundreds of milliseconds of transatlantic round-trip network delays. **Vortex DB** solves this by embedding an asynchronous SQLite transaction coordinator into every edge point of presence, decoupling read transactions from write coordinator consensus.

> "Reads are served from local in-memory SQLite snapshots with zero network hops, delivering sub-millisecond query execution anywhere on the planet."

## 2. Multi-Region Replication Architecture

Vortex DB employs an optimized Raft log pipeline with adaptive batch pipelining:
- Write operations are committed to the local NVMe write-ahead log (WAL).
- Log deltas are propagated to consensus quorums over multiplexed QUIC streams.
- Local edge caches remain non-blocking for read bursts.

\`\`\`cpp
// C++23 High-throughput Raft Delta Appender
template <typename TransportStream>
auto replicate_wal_delta(const WalFrameBatch& batch, TransportStream& quic_channel) -> co_await Task<SyncStatus> {
    auto frame_digest = blake3_hash(batch.payload_span());
    auto ack = co_await quic_channel.async_send_stream(frame_digest, batch.payload_span());
    if (ack.quorum_reached()) {
        co_return SyncStatus::Committed;
    }
    co_return SyncStatus::BufferedRetry;
}
\`\`\`

## 3. Conflict Resolution via State CRDTs

For collaborative write scenarios across edge partitions, Vortex implements delta state-based conflict-free replicated data types (CRDTs). Schema alterations and row-level operations merge deterministically using vector clocks, guaranteeing convergence across network nets without split-brain anomalies.
`,
    sections: [
      {
        title: "1. The Edge State Dilemma",
        content: "Centralized relational databases force geographically distributed users to incur hundreds of milliseconds of transatlantic round-trip network delays. Vortex DB solves this by embedding an asynchronous SQLite transaction coordinator into every edge point of presence, decoupling read transactions from write coordinator consensus."
      },
      {
        title: "2. Multi-Region Replication Architecture",
        content: "Vortex DB employs an optimized Raft log pipeline with adaptive batch pipelining. Write operations are committed to the local NVMe write-ahead log (WAL) and propagated to consensus quorums over multiplexed QUIC streams. Reads are served from local in-memory SQLite snapshots with zero network hops."
      },
      {
        title: "3. Conflict Resolution via State CRDTs",
        content: "For collaborative write scenarios across edge partitions, Vortex implements delta state-based conflict-free replicated data types (CRDTs). Schema alterations and row-level operations merge deterministically using vector clocks, guaranteeing convergence across network nets without split-brain anomalies."
      }
    ],
    maintainer_handles: ["marcus", "devon", "tariq", "clara", "arjun"]
  },
  {
    id: "proj-03",
    slug: "prism-compiler",
    name: "Prism Compiler",
    tagline: "Zero-allocation optimizing IR compiler for edge micro-kernels",
    description: "An optimizing intermediate representation (IR) compiler transforming high-level domain languages into bare-metal micro-kernels. Features vectorization, dead-code elimination, and register allocation.",
    category: "Compilers",
    status: "active",
    action_button_label: "Visit Site",
    action_button_url: "https://prism.ragetech.dev",
    live_url: "https://prism.ragetech.dev",
    github_url: "https://github.com/ragetech/prism-compiler",
    cover_image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    tech_stack: "Zig, LLVM 18, SIMD, x86-64/arm64",
    stats: {
      binary_size: "<400KB",
      compile_rate: "85k lines/s",
      stars: 2150,
      license: "MIT"
    },
    markdown_content: `## 1. High-Performance Static Analysis

Prism was engineered from the ground up in Zig to provide sub-second compilation cycles for systems micro-kernels. Unlike massive compilation frameworks that require gigabytes of RAM, Prism processes abstract syntax trees in a single pass with cache-friendly flat arena allocators.

## 2. Polyhedral Loop Optimization & SIMD

The Prism optimization pipeline analyzes nested loops to identify data parallelism, automatically emitting AVX-512 and ARM Neon vector instructions. Memory allocations within the inner execution loops are statically proven and promoted into CPU registers.

\`\`\`zig
// Zig Arena IR lowering pass
pub fn lower_loop_vector(allocator: std.mem.Allocator, ir_block: *IrBlock) !SimdVectorNode {
    var vector_arena = std.heap.ArenaAllocator.init(allocator);
    defer vector_arena.deinit();

    const unrolled = try ir_block.polyhedral_unroll(8);
    return unrolled.emit_avx512_instructions();
}
\`\`\`
`,
    sections: [
      {
        title: "1. High-Performance Static Analysis",
        content: "Prism was engineered from the ground up in Zig to provide sub-second compilation cycles for systems micro-kernels. Unlike massive compilation frameworks that require gigabytes of RAM, Prism processes abstract syntax trees in a single pass with cache-friendly flat arena allocators."
      },
      {
        title: "2. Polyhedral Loop Optimization & SIMD",
        content: "The Prism optimization pipeline analyzes nested loops to identify data parallelism, automatically emitting AVX-512 and ARM Neon vector instructions. Memory allocations within the inner execution loops are statically proven and promoted into CPU registers."
      }
    ],
    maintainer_handles: ["elena", "freja", "astrid", "oscar", "selene"]
  },
  {
    id: "proj-04",
    slug: "hyperion-mesh",
    name: "Hyperion Mesh",
    tagline: "Peer-to-peer authenticated BGP and WireGuard overlay network",
    description: "Decentralized overlay mesh establishing zero-trust WireGuard tunnels between server nodes and edge pops. Automatic NAT hole-punching, dynamic path selection, and end-to-end packet encryption.",
    category: "Kernel & Systems",
    status: "active",
    action_button_label: "Visit Site",
    action_button_url: "https://hyperion.ragetech.dev",
    live_url: "https://hyperion.ragetech.dev",
    github_url: "https://github.com/ragetech/hyperion-mesh",
    cover_image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    tech_stack: "Go, WireGuard, eBPF, Linux XDP",
    stats: {
      throughput: "94.2 Gbps",
      reconnect_time: "<80ms",
      stars: 1940,
      license: "BSD-3"
    },
    markdown_content: `## 1. Autonomous Overlay Routing

Hyperion establishes an intelligent mesh overlay across edge infrastructure. Using continuous eBPF telemetry, nodes dynamically measure jitter, packet loss, and latency along every available internet path, dynamically steering packets over the fastest available WireGuard peer.

## 2. Kernel Bypass via eBPF XDP

Encrypted tunnel headers are parsed directly at the network card driver level using eBPF eXpress Data Path (XDP). Packets that do not belong to established cryptographic sessions are dropped in hardware with zero CPU consumption.
`,
    sections: [
      {
        title: "1. Autonomous Overlay Routing",
        content: "Hyperion establishes an intelligent mesh overlay across edge infrastructure. Using continuous eBPF telemetry, nodes dynamically measure jitter, packet loss, and latency along every available internet path, dynamically steering packets over the fastest available WireGuard peer."
      },
      {
        title: "2. Kernel Bypass via eBPF XDP",
        content: "Encrypted tunnel headers are parsed directly at the network card driver level using eBPF eXpress Data Path (XDP). Packets that do not belong to established cryptographic sessions are dropped in hardware with zero CPU consumption."
      }
    ],
    maintainer_handles: ["lucas", "nikolai", "liam", "kofi"]
  },
  {
    id: "proj-05",
    slug: "cipher-vault",
    name: "Cipher Vault",
    tagline: "Post-quantum cryptographic state coordinator and verifiable key authority",
    description: "State-of-the-art cryptographic coordinator providing Kyber-1024 and Dilithium-5 authenticated identity tokens for microservices. Constant-time execution resistant to cache timing attacks.",
    category: "Cryptography",
    status: "active",
    action_button_label: "Visit Site",
    action_button_url: "https://cipher.ragetech.dev",
    live_url: "https://cipher.ragetech.dev",
    github_url: "https://github.com/ragetech/cipher-vault",
    cover_image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    tech_stack: "Rust, Kyber, Dilithium, Constant-Time",
    stats: {
      security_level: "NIST Cat 5",
      verify_latency: "1.1ms",
      stars: 1680,
      license: "Apache-2.0"
    },
    markdown_content: `## 1. Post-Quantum Cryptographic Posture

Anticipating quantum computing decryption capabilities against traditional RSA and Elliptic Curve algorithms, **Cipher Vault** deploys NIST-approved Crystals-Kyber for key encapsulation and Crystals-Dilithium for digital signatures.

## 2. Side-Channel Immunity

All cryptographic primitives in Cipher Vault are audited and formally verified for constant-time execution. Arithmetic operations avoid branch instructions conditioned on secret key bits, neutralizing timing attack vectors.
`,
    sections: [
      {
        title: "1. Post-Quantum Cryptographic Posture",
        content: "Anticipating quantum computing decryption capabilities against traditional RSA and Elliptic Curve algorithms, Cipher Vault deploys NIST-approved Crystals-Kyber for key encapsulation and Crystals-Dilithium for digital signatures."
      },
      {
        title: "2. Side-Channel Immunity",
        content: "All cryptographic primitives in Cipher Vault are audited and formally verified for constant-time execution. Arithmetic operations avoid branch instructions conditioned on secret key bits, neutralizing timing attack vectors."
      }
    ],
    maintainer_handles: ["kai", "maya", "julian", "darius", "rachel"]
  },
  {
    id: "proj-06",
    slug: "nexus-protocol",
    name: "Nexus Protocol",
    tagline: "High-throughput binary RPC over QUIC with stream multiplexing",
    description: "Compact binary communication layer designed as an ultra-fast alternative to gRPC. Zero serialization overhead via FlatBuffers layouts and bidirectional UDP streaming.",
    category: "Kernel & Systems",
    status: "active",
    action_button_label: "Visit Site",
    action_button_url: "https://nexus.ragetech.dev",
    live_url: "https://nexus.ragetech.dev",
    github_url: "https://github.com/ragetech/nexus-protocol",
    cover_image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    tech_stack: "Rust, QUIC, FlatBuffers, Tokio",
    stats: {
      latency_p99: "0.8ms",
      rps: "1.8M req/s",
      stars: 2420,
      license: "MIT"
    },
    markdown_content: `## 1. Next-Generation Binary Streaming

Nexus eliminates the header bloat and framing penalties of HTTP/2 and Protobuf. By utilizing FlatBuffers binary layouts, serialized structs can be accessed in-place directly from network socket memory buffers without decompression or pointer swizzling.

## 2. Bidirectional QUIC Multiplexing

Operating over native UDP with modern loss recovery mechanisms, Nexus streams maintain independent packet sequence numbers, completely eliminating head-of-line blocking during packet loss bursts.
`,
    sections: [
      {
        title: "1. Next-Generation Binary Streaming",
        content: "Nexus eliminates the header bloat and framing penalties of HTTP/2 and Protobuf. By utilizing FlatBuffers binary layouts, serialized structs can be accessed in-place directly from network socket memory buffers without decompression or pointer swizzling."
      },
      {
        title: "2. Bidirectional QUIC Multiplexing",
        content: "Operating over native UDP with modern loss recovery mechanisms, Nexus streams maintain independent packet sequence numbers, completely eliminating head-of-line blocking during packet loss bursts."
      }
    ],
    maintainer_handles: ["zara", "chloe", "hana", "samir", "nadia"]
  }
];
