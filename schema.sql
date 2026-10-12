-- ========================================================================
-- Ragetech Platform — Cloudflare D1 Relational Schema
-- ========================================================================

-- 1. Collective Builders / Developers
CREATE TABLE IF NOT EXISTS developers (
  id TEXT PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL,
  account_role TEXT NOT NULL DEFAULT 'developer', -- 'admin', 'lead', 'developer'
  squad TEXT NOT NULL DEFAULT 'systems',          -- 'systems', 'edge', 'compilers', 'security'
  bio TEXT,
  avatar_url TEXT,
  website_url TEXT,
  github_url TEXT,
  gpg_key TEXT,
  gpg_fingerprint TEXT,
  is_verified INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Collective Projects / Repositories
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,                         -- 'Kernel & Systems', 'Distributed Runtimes', 'Compilers', 'Cryptography'
  status TEXT NOT NULL DEFAULT 'active',          -- 'active', 'beta', 'archived'
  live_url TEXT,
  github_url TEXT,
  tech_stack TEXT,                                -- Comma-separated or JSON list
  stats_json TEXT,                                -- e.g. {"latency": "1.2ms", "stars": 1420, "throughput": "2.4M ops/s"}
  is_published INTEGER NOT NULL DEFAULT 1,
  featured_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Project Article / Whitepaper Sections (Tailark Quartz Blog Article Format)
CREATE TABLE IF NOT EXISTS project_sections (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  section_title TEXT NOT NULL,
  section_content TEXT NOT NULL,                  -- Markdown or structured text
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Project Maintainer Assignments
CREATE TABLE IF NOT EXISTS project_assignments (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  developer_id TEXT NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  contribution_role TEXT NOT NULL DEFAULT 'Maintainer', -- 'Lead Maintainer', 'Core Contributor', 'Architect'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, developer_id)
);

-- 5. Audit Log (RBAC Operations)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_handle TEXT NOT NULL,
  action TEXT NOT NULL,                           -- 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH'
  target_type TEXT NOT NULL,                      -- 'project', 'developer', 'assignment', 'section'
  target_id TEXT NOT NULL,
  details TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_devs_handle ON developers(handle);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published, featured_order);
CREATE INDEX IF NOT EXISTS idx_sections_project ON project_sections(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_assign_project ON project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_assign_developer ON project_assignments(developer_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);
