-- ============================================================================
-- RAGETECH.DEV — Cloudflare D1 Database Schema
-- Serverless edge SQLite schema for dynamic projects, developer profiles,
-- and session authentication.
-- ============================================================================

-- 1. Developers Table
CREATE TABLE IF NOT EXISTS developers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  handle TEXT UNIQUE NOT NULL,             -- e.g. 'alexv'
  name TEXT NOT NULL,                      -- e.g. 'Alex Vance'
  email TEXT UNIQUE,
  password_hash TEXT,                      -- PBKDF2 or SHA-256 salted hash
  role TEXT NOT NULL,                      -- e.g. 'Lead Systems Architect'
  squad TEXT NOT NULL DEFAULT 'systems',   -- 'systems' | 'ai' | 'security' | 'frontend'
  bio TEXT,
  avatar_url TEXT,
  location TEXT,                           -- e.g. 'Stockholm, SE (UTC+1)'
  status TEXT,                             -- e.g. '⚡ SIMD ring buffers in Hyperion'
  gpg_key TEXT,                            -- e.g. '4A8B 91F0 C128 7E53'
  github_url TEXT,
  x_url TEXT,
  website TEXT,
  custom_slug TEXT UNIQUE,                 -- Custom route path (e.g. 'alex')
  is_verified INTEGER DEFAULT 1,           -- 1 = Verified collective builder
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,               -- e.g. 'hyperion'
  name TEXT NOT NULL,                      -- e.g. 'Hyperion'
  repo_url TEXT NOT NULL,                  -- e.g. 'https://github.com/ragetech/hyperion'
  badge TEXT DEFAULT 'v0.1.0-alpha',       -- e.g. 'v0.9.4-alpha'
  summary TEXT NOT NULL,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  language TEXT NOT NULL,                  -- e.g. 'Rust'
  language_color TEXT DEFAULT '#dea584',
  clone_url TEXT,
  specs_json TEXT,                         -- JSON array [{label, val}]
  preview_title TEXT,                      -- e.g. 'telemetry_sink.rs'
  preview_content TEXT,                    -- Raw code snippet or manifest
  preview_meta TEXT,                       -- Meta text (e.g. 'tokio v1.42')
  full_spec_json TEXT,                     -- JSON {arch, goal, status}
  is_featured INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Project Assignees (Many-to-Many Junction Table)
CREATE TABLE IF NOT EXISTS project_members (
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  developer_id INTEGER NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  role_in_project TEXT DEFAULT 'maintainer', -- 'lead' | 'maintainer' | 'contributor'
  PRIMARY KEY (project_id, developer_id)
);

-- 4. Developer Secondary Repositories
CREATE TABLE IF NOT EXISTS developer_repos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  developer_id INTEGER NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                      -- e.g. 'alexv/fast-ringbuf'
  tagline TEXT,
  url TEXT NOT NULL,
  clone_url TEXT,
  language TEXT NOT NULL,
  language_color TEXT DEFAULT '#dea584',
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  topics_json TEXT,                        -- JSON array of strings
  is_flagship INTEGER DEFAULT 0,           -- 1 = Pinned showcase repo
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Sessions Table (Edge Auth Tokens)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,                     -- Random cryptographically secure token
  developer_id INTEGER NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL
);

-- Indexes for ultra-fast query execution
CREATE INDEX IF NOT EXISTS idx_devs_handle ON developers(handle);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_proj_members_proj ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_proj_members_dev ON project_members(developer_id);
CREATE INDEX IF NOT EXISTS idx_dev_repos_dev ON developer_repos(developer_id);
CREATE INDEX IF NOT EXISTS idx_sessions_dev ON sessions(developer_id);
