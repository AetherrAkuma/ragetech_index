CREATE TABLE IF NOT EXISTS developers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  handle TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL,
  squad TEXT NOT NULL DEFAULT 'systems',
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  status TEXT,
  gpg_key TEXT,
  github_url TEXT,
  x_url TEXT,
  website TEXT,
  custom_slug TEXT UNIQUE,
  is_verified INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  badge TEXT DEFAULT 'v0.1.0-alpha',
  summary TEXT NOT NULL,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  language TEXT NOT NULL,
  language_color TEXT DEFAULT '#dea584',
  clone_url TEXT,
  specs_json TEXT,
  preview_title TEXT,
  preview_content TEXT,
  preview_meta TEXT,
  full_spec_json TEXT,
  is_featured INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_members (
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  developer_id INTEGER NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  role_in_project TEXT DEFAULT 'maintainer',
  PRIMARY KEY (project_id, developer_id)
);

CREATE TABLE IF NOT EXISTS developer_repos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  developer_id INTEGER NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tagline TEXT,
  url TEXT NOT NULL,
  clone_url TEXT,
  language TEXT NOT NULL,
  language_color TEXT DEFAULT '#dea584',
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  topics_json TEXT,
  is_flagship INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  developer_id INTEGER NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS login_attempts (
  ip TEXT PRIMARY KEY,
  attempts INTEGER DEFAULT 1,
  locked_until DATETIME
);

CREATE INDEX IF NOT EXISTS idx_devs_handle ON developers(handle);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_proj_members_proj ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_proj_members_dev ON project_members(developer_id);
CREATE INDEX IF NOT EXISTS idx_dev_repos_dev ON developer_repos(developer_id);
CREATE INDEX IF NOT EXISTS idx_sessions_dev ON sessions(developer_id);
