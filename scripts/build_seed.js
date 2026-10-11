const fs = require('fs');
const path = require('path');

// Mock window
global.window = {};
require('../data/developers.js');
require('../data/projects.js');

const devs = global.window.DEVELOPERS || [];
const projects = global.window.PROJECTS || [];

function sqlEscape(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  return "'" + String(val).replace(/'/g, "''") + "'";
}

let sql = `DELETE FROM sessions;
DELETE FROM developer_repos;
DELETE FROM project_members;
DELETE FROM projects;
DELETE FROM developers;

`;

for (const dev of devs) {
  const handle = dev.handle;
  const name = dev.name;
  const role = dev.role || 'Collective Engineer';
  const squad = dev.squad || 'systems';
  const bio = dev.bio || '';
  const avatarUrl = dev.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${handle}`;
  const location = dev.location || '';
  const status = dev.status || '';
  const gpgKey = dev.gpgKey || '';
  const githubUrl = dev.socials?.github || `https://github.com/${handle}`;
  const xUrl = dev.socials?.x || '';
  const website = dev.socials?.website || '';
  const customSlug = handle;
  // Default password hash for initial accounts (SHA-256 for 'ragetech2026')
  const defaultHash = 'b9c1d09e51c86518175f0a07106093510eefaa918e7d23d8c1c5ceec2f9d5be3';

  sql += `INSERT INTO developers (id, handle, name, email, password_hash, role, squad, bio, avatar_url, location, status, gpg_key, github_url, x_url, website, custom_slug, is_verified) VALUES (${dev.id}, ${sqlEscape(handle)}, ${sqlEscape(name)}, ${sqlEscape(handle + '@ragetech.dev')}, ${sqlEscape(defaultHash)}, ${sqlEscape(role)}, ${sqlEscape(squad)}, ${sqlEscape(bio)}, ${sqlEscape(avatarUrl)}, ${sqlEscape(location)}, ${sqlEscape(status)}, ${sqlEscape(gpgKey)}, ${sqlEscape(githubUrl)}, ${sqlEscape(xUrl)}, ${sqlEscape(website)}, ${sqlEscape(customSlug)}, 1);\n`;
}

// Insert Developer Repos
sql += `\n-- 2. Insert Developer Secondary & Flagship Repositories\n`;
let repoId = 1;
for (const dev of devs) {
  if (dev.featuredRepo) {
    const f = dev.featuredRepo;
    const topics = JSON.stringify(f.topics || []);
    sql += `INSERT INTO developer_repos (id, developer_id, name, tagline, url, clone_url, language, language_color, stars, forks, topics_json, is_flagship, sort_order) VALUES (${repoId++}, ${dev.id}, ${sqlEscape(f.name)}, ${sqlEscape(f.tagline)}, ${sqlEscape(f.url)}, ${sqlEscape(f.cloneUrl)}, ${sqlEscape(f.language)}, ${sqlEscape(f.languageColor)}, ${f.stars || 0}, ${f.forks || 0}, ${sqlEscape(topics)}, 1, 0);\n`;
  }
  if (Array.isArray(dev.secondaryRepos)) {
    let order = 1;
    for (const r of dev.secondaryRepos) {
      sql += `INSERT INTO developer_repos (id, developer_id, name, tagline, url, clone_url, language, language_color, stars, forks, topics_json, is_flagship, sort_order) VALUES (${repoId++}, ${dev.id}, ${sqlEscape(r.name)}, NULL, ${sqlEscape(r.url)}, NULL, ${sqlEscape(r.language)}, ${sqlEscape(r.languageColor)}, ${r.stars || 0}, 0, '[]', 0, ${order++});\n`;
    }
  }
}

let projId = 1;
const projectSlugToId = {};
for (const p of projects) {
  projectSlugToId[p.id] = projId;
  const slug = p.id;
  const name = p.name;
  const repoUrl = p.githubUrl || `https://github.com/${p.repo}`;
  const badge = p.badge || 'v0.1.0-alpha';
  const summary = p.summary || '';
  const stars = p.stars || 0;
  const forks = p.forks || 0;
  const language = p.language || 'Rust';
  const languageColor = p.languageColor || '#dea584';
  const cloneUrl = p.cloneUrl || `git clone ${repoUrl}.git`;
  const specsJson = JSON.stringify(p.specs || []);
  const previewTitle = p.previewTitle || '';
  const previewContent = p.previewContent || '';
  const previewMeta = p.previewMeta || '';
  const fullSpecJson = JSON.stringify(p.fullSpec || {});

  sql += `INSERT INTO projects (id, slug, name, repo_url, badge, summary, stars, forks, language, language_color, clone_url, specs_json, preview_title, preview_content, preview_meta, full_spec_json, is_featured) VALUES (${projId}, ${sqlEscape(slug)}, ${sqlEscape(name)}, ${sqlEscape(repoUrl)}, ${sqlEscape(badge)}, ${sqlEscape(summary)}, ${stars}, ${forks}, ${sqlEscape(language)}, ${sqlEscape(languageColor)}, ${sqlEscape(cloneUrl)}, ${sqlEscape(specsJson)}, ${sqlEscape(previewTitle)}, ${sqlEscape(previewContent)}, ${sqlEscape(previewMeta)}, ${sqlEscape(fullSpecJson)}, 1);\n`;
  projId++;
}

const devHandleToId = {};
for (const dev of devs) {
  devHandleToId[dev.handle] = dev.id;
}

for (const p of projects) {
  const pId = projectSlugToId[p.id];
  if (Array.isArray(p.assignees)) {
    p.assignees.forEach((handle, idx) => {
      const dId = devHandleToId[handle];
      if (dId) {
        const role = idx === 0 ? 'lead' : 'maintainer';
        sql += `INSERT OR IGNORE INTO project_members (project_id, developer_id, role_in_project) VALUES (${pId}, ${dId}, ${sqlEscape(role)});\n`;
      }
    });
  }
}

// Write to seed.sql
const outputPath = path.join(__dirname, '../seed.sql');
fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Successfully generated seed.sql with ${devs.length} developers, ${projects.length} projects, and ${repoId - 1} repos.`);
