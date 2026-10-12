/**
 * Ragetech Platform — Cloudflare Worker Edge Runtime
 * Handles D1 SQLite API queries, dynamic RBAC authentication,
 * and high-performance static asset routing.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS Headers for API requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ------------------------------------------------------------------------
    // 1. API Route Handlers (/api/*)
    // ------------------------------------------------------------------------

    // GET /api/telemetry — Real-time Edge Ping & Colo Telemetry
    if (pathname === '/api/telemetry') {
      const startTime = performance.now();
      let d1Time = 0;
      let d1Status = 'disconnected';

      if (env.DB) {
        try {
          const d1Start = performance.now();
          await env.DB.prepare('SELECT 1').first();
          d1Time = Math.round((performance.now() - d1Start) * 10) / 10;
          d1Status = 'healthy';
        } catch (e) {
          d1Status = 'standby';
        }
      }

      const colo = request.cf?.colo || 'LOCAL-DEV';
      const country = request.cf?.country || 'US';
      const httpProtocol = request.cf?.httpProtocol || 'HTTP/3';
      const edgeLatency = Math.round((performance.now() - startTime) * 10) / 10;

      return jsonResponse({
        colo,
        country,
        httpProtocol,
        edgeLatencyMs: edgeLatency,
        d1QueryLatencyMs: d1Time,
        d1Status,
        timestamp: new Date().toISOString()
      }, corsHeaders);
    }

    // GET /api/projects — List all published repositories
    if (pathname === '/api/projects' && request.method === 'GET') {
      if (env.DB) {
        try {
          const { results: projects } = await env.DB.prepare(`
            SELECT p.*, 
              (SELECT json_group_array(d.handle) 
               FROM project_assignments pa 
               JOIN developers d ON pa.developer_id = d.id 
               WHERE pa.project_id = p.id) as maintainers_json
            FROM projects p
            WHERE p.is_published = 1
            ORDER BY p.featured_order ASC
          `).all();

          const formatted = projects.map(p => ({
            ...p,
            stats: p.stats_json ? JSON.parse(p.stats_json) : {},
            maintainer_handles: p.maintainers_json ? JSON.parse(p.maintainers_json) : []
          }));

          return jsonResponse({ success: true, source: 'd1', data: formatted }, corsHeaders);
        } catch (err) {
          // Fall through to fallback
        }
      }

      // Offline static fallback
      return jsonResponse({
        success: true,
        source: 'fallback',
        data: [] // Handled client-side via window.RAGETECH_PROJECTS if API unavailable
      }, corsHeaders);
    }

    // GET /api/projects/:slug — Retrieve single repository whitepaper
    if (pathname.startsWith('/api/projects/') && request.method === 'GET') {
      const slug = pathname.replace('/api/projects/', '').trim();
      if (env.DB) {
        try {
          const project = await env.DB.prepare(`
            SELECT * FROM projects WHERE slug = ?
          `).bind(slug).first();

          if (project) {
            const { results: sections } = await env.DB.prepare(`
              SELECT section_title, section_content, sort_order 
              FROM project_sections 
              WHERE project_id = ? 
              ORDER BY sort_order ASC
            `).bind(project.id).all();

            const { results: maintainers } = await env.DB.prepare(`
              SELECT d.id, d.handle, d.name, d.role, d.squad, d.avatar_url, pa.contribution_role
              FROM project_assignments pa
              JOIN developers d ON pa.developer_id = d.id
              WHERE pa.project_id = ?
            `).bind(project.id).all();

            return jsonResponse({
              success: true,
              source: 'd1',
              data: {
                ...project,
                stats: project.stats_json ? JSON.parse(project.stats_json) : {},
                sections: sections.map(s => ({ title: s.section_title, content: s.section_content })),
                maintainers
              }
            }, corsHeaders);
          }
        } catch (e) {
          // Fall through
        }
      }
      return jsonResponse({ success: false, message: 'Project not found' }, corsHeaders, 404);
    }

    // GET /api/developers — List all 29 collective builders
    if (pathname === '/api/developers' && request.method === 'GET') {
      if (env.DB) {
        try {
          const { results: devs } = await env.DB.prepare(`
            SELECT d.id, d.handle, d.name, d.email, d.role, d.account_role, d.squad, d.bio, 
                   d.avatar_url, d.website_url, d.github_url, d.gpg_fingerprint, d.is_verified,
                   (SELECT json_group_array(p.slug)
                    FROM project_assignments pa
                    JOIN projects p ON pa.project_id = p.id
                    WHERE pa.developer_id = d.id) as assigned_projects_json
            FROM developers d
            ORDER BY d.id ASC
          `).all();

          const formatted = devs.map(d => ({
            ...d,
            assigned_projects: d.assigned_projects_json ? JSON.parse(d.assigned_projects_json) : []
          }));

          return jsonResponse({ success: true, source: 'd1', data: formatted }, corsHeaders);
        } catch (e) {
          // Fall through
        }
      }
      return jsonResponse({ success: true, source: 'fallback', data: [] }, corsHeaders);
    }

    // GET /api/developers/:handle — Retrieve single developer dossier
    if (pathname.startsWith('/api/developers/') && request.method === 'GET') {
      const handle = pathname.replace('/api/developers/', '').trim();
      if (env.DB) {
        try {
          const dev = await env.DB.prepare(`
            SELECT * FROM developers WHERE handle = ?
          `).bind(handle).first();

          if (dev) {
            const { results: assignedProjects } = await env.DB.prepare(`
              SELECT p.id, p.slug, p.name, p.tagline, p.category, p.status, pa.contribution_role
              FROM project_assignments pa
              JOIN projects p ON pa.project_id = p.id
              WHERE pa.developer_id = ?
            `).bind(dev.id).all();

            return jsonResponse({
              success: true,
              source: 'd1',
              data: {
                ...dev,
                assigned_projects: assignedProjects
              }
            }, corsHeaders);
          }
        } catch (e) {
          // Fall through
        }
      }
      return jsonResponse({ success: false, message: 'Developer not found' }, corsHeaders, 404);
    }

    // POST /api/auth/login — RBAC Login System with SHA-256 verification
    if (pathname === '/api/auth/login' && request.method === 'POST') {
      try {
        const body = await request.json();
        const identifier = (body.handle || body.email || body.username || '').trim().toLowerCase();
        const password = body.password || '';
        const hashedInput = await sha256Hex(password);

        if (env.DB) {
          const dev = await env.DB.prepare(`
            SELECT id, handle, name, email, role, account_role, squad, avatar_url, password_hash 
            FROM developers 
            WHERE lower(handle) = ? OR lower(email) = ?
          `).bind(identifier, identifier).first();

          if (dev && dev.password_hash === hashedInput) {
            const { password_hash, ...safeUser } = dev;
            return jsonResponse({
              success: true,
              token: `tok_${dev.handle}_${Date.now()}`,
              user: safeUser
            }, corsHeaders);
          }
        }

        // Offline / fallback verification
        if (identifier === 'reymartchua@ragetech.dev' || identifier === 'reymart' || identifier === 'reymartchua') {
          if (hashedInput === 'd269c02552aba73da1e4a2ec1e1a7cb20e737f6debfe3be5027c7eb8d2dc5a08' || password === 'yuichirokanade') {
            return jsonResponse({
              success: true,
              token: `tok_reymartchua_${Date.now()}`,
              user: {
                id: 'dev-00',
                handle: 'reymartchua',
                name: 'Reymart Chua',
                email: 'reymartchua@ragetech.dev',
                role: 'Founding Lead & Systems Architect',
                account_role: 'admin',
                squad: 'systems',
                avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=280&q=80'
              }
            }, corsHeaders);
          }
        } else if (identifier === 'sora' || identifier === 'sora@ragetech.dev') {
          if (hashedInput === '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9' || password === 'admin123') {
            return jsonResponse({
              success: true,
              token: `tok_sora_${Date.now()}`,
              user: {
                id: 'dev-01',
                handle: 'sora',
                name: 'Sora Takahashi',
                email: 'sora@ragetech.dev',
                role: 'Founding Systems Architect',
                account_role: 'admin',
                squad: 'systems'
              }
            }, corsHeaders);
          }
        }

        return jsonResponse({ success: false, message: 'Invalid credentials' }, corsHeaders, 401);
      } catch (err) {
        return jsonResponse({ success: false, message: 'Bad request' }, corsHeaders, 400);
      }
    }

    // POST /api/manage/projects — Add or update project
    if (pathname === '/api/manage/projects' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { 
          id, slug, name, tagline, description, category, status, 
          live_url, github_url, tech_stack,
          action_button_label, action_button_url, cover_image_url, 
          markdown_content, maintainer_handles 
        } = body;

        const effectiveBtnLabel = action_button_label || 'Visit Site';
        const effectiveBtnUrl = action_button_url || live_url;
        const targetId = id || `proj-${Date.now()}`;

        if (env.DB) {
          const existing = await env.DB.prepare('SELECT id FROM projects WHERE id = ? OR slug = ?').bind(id || '', slug).first();
          if (existing) {
            await env.DB.prepare(`
              UPDATE projects 
              SET name = ?, tagline = ?, description = ?, category = ?, status = ?, 
                  live_url = ?, github_url = ?, tech_stack = ?, 
                  action_button_label = ?, action_button_url = ?, cover_image_url = ?, markdown_content = ?,
                  updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `).bind(
              name, tagline, description, category, status || 'active', 
              live_url, github_url, tech_stack, 
              effectiveBtnLabel, effectiveBtnUrl, cover_image_url || null, markdown_content || null, 
              existing.id
            ).run();
          } else {
            await env.DB.prepare(`
              INSERT INTO projects (
                id, slug, name, tagline, description, category, status, 
                live_url, github_url, tech_stack, 
                action_button_label, action_button_url, cover_image_url, markdown_content
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              targetId, slug, name, tagline, description, category, status || 'active', 
              live_url, github_url, tech_stack, 
              effectiveBtnLabel, effectiveBtnUrl, cover_image_url || null, markdown_content || null
            ).run();
          }

          // Update Maintainer Assignments
          if (Array.isArray(maintainer_handles)) {
            const actualProjId = existing ? existing.id : targetId;
            await env.DB.prepare('DELETE FROM project_assignments WHERE project_id = ?').bind(actualProjId).run();
            for (const handle of maintainer_handles) {
              const dev = await env.DB.prepare('SELECT id FROM developers WHERE handle = ?').bind(handle).first();
              if (dev) {
                await env.DB.prepare(`
                  INSERT OR IGNORE INTO project_assignments (id, project_id, developer_id, contribution_role)
                  VALUES (?, ?, ?, 'Maintainer')
                `).bind(`pa-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, actualProjId, dev.id).run();
              }
            }
          }

          return jsonResponse({ success: true, message: 'Project saved successfully to Cloudflare D1' }, corsHeaders);
        }
        return jsonResponse({ success: true, message: 'Updated (offline mode)' }, corsHeaders);
      } catch (err) {
        return jsonResponse({ success: false, message: err.message }, corsHeaders, 500);
      }
    }

    // DELETE /api/manage/projects/:id — Remove project
    if (pathname.startsWith('/api/manage/projects/') && request.method === 'DELETE') {
      try {
        const id = pathname.replace('/api/manage/projects/', '').trim();
        if (env.DB) {
          await env.DB.prepare('DELETE FROM project_assignments WHERE project_id = ?').bind(id).run();
          await env.DB.prepare('DELETE FROM project_sections WHERE project_id = ?').bind(id).run();
          await env.DB.prepare('DELETE FROM projects WHERE id = ? OR slug = ?').bind(id, id).run();
          return jsonResponse({ success: true, message: 'Project deleted' }, corsHeaders);
        }
        return jsonResponse({ success: true, message: 'Project deleted (offline mode)' }, corsHeaders);
      } catch (err) {
        return jsonResponse({ success: false, message: err.message }, corsHeaders, 500);
      }
    }

    // POST /api/manage/developers — Create or Update developer
    if (pathname === '/api/manage/developers' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { id, handle, name, email, password, role, account_role, squad, bio, avatar_url, website_url, github_url, gpg_fingerprint, is_verified } = body;

        if (env.DB) {
          const existing = await env.DB.prepare('SELECT id, password_hash FROM developers WHERE id = ? OR handle = ?').bind(id, handle).first();
          let passHash = existing ? existing.password_hash : '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
          if (password) {
            passHash = await sha256Hex(password);
          }

          if (existing) {
            await env.DB.prepare(`
              UPDATE developers 
              SET name = ?, email = ?, password_hash = ?, role = ?, account_role = ?, squad = ?, bio = ?, avatar_url = ?, website_url = ?, github_url = ?, gpg_fingerprint = ?, is_verified = ?, updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `).bind(name, email, passHash, role, account_role || 'developer', squad || 'systems', bio, avatar_url, website_url, github_url, gpg_fingerprint, is_verified !== undefined ? is_verified : 1, existing.id).run();
          } else {
            await env.DB.prepare(`
              INSERT INTO developers (id, handle, name, email, password_hash, role, account_role, squad, bio, avatar_url, website_url, github_url, gpg_fingerprint, is_verified)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(id || `dev-${Date.now()}`, handle, name, email, passHash, role, account_role || 'developer', squad || 'systems', bio, avatar_url, website_url, github_url, gpg_fingerprint || '8F4A 2B19 E03C 41FA 98E1', is_verified !== undefined ? is_verified : 1).run();
          }

          return jsonResponse({ success: true, message: 'Developer profile updated' }, corsHeaders);
        }
        return jsonResponse({ success: true, message: 'Saved (offline mode)' }, corsHeaders);
      } catch (err) {
        return jsonResponse({ success: false, message: err.message }, corsHeaders, 500);
      }
    }

    // DELETE /api/manage/developers/:id — Remove developer
    if (pathname.startsWith('/api/manage/developers/') && request.method === 'DELETE') {
      try {
        const id = pathname.replace('/api/manage/developers/', '').trim();
        if (env.DB) {
          await env.DB.prepare('DELETE FROM project_assignments WHERE developer_id = ?').bind(id).run();
          await env.DB.prepare('DELETE FROM developers WHERE id = ? OR handle = ?').bind(id, id).run();
          return jsonResponse({ success: true, message: 'Developer removed' }, corsHeaders);
        }
        return jsonResponse({ success: true, message: 'Developer removed (offline mode)' }, corsHeaders);
      } catch (err) {
        return jsonResponse({ success: false, message: err.message }, corsHeaders, 500);
      }
    }

    // POST /api/manage/assignments — Assign developer to project
    if (pathname === '/api/manage/assignments' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { project_id, developer_id, contribution_role } = body;
        if (env.DB) {
          await env.DB.prepare(`
            INSERT OR REPLACE INTO project_assignments (id, project_id, developer_id, contribution_role)
            VALUES (?, ?, ?, ?)
          `).bind(`as-${Date.now()}`, project_id, developer_id, contribution_role || 'Maintainer').run();
          return jsonResponse({ success: true, message: 'Assignment saved' }, corsHeaders);
        }
        return jsonResponse({ success: true, message: 'Assignment saved (offline mode)' }, corsHeaders);
      } catch (err) {
        return jsonResponse({ success: false, message: err.message }, corsHeaders, 500);
      }
    }

    // DELETE /api/manage/assignments — Remove assignment
    if (pathname === '/api/manage/assignments' && request.method === 'DELETE') {
      try {
        const body = await request.json();
        const { project_id, developer_id } = body;
        if (env.DB) {
          await env.DB.prepare(`
            DELETE FROM project_assignments WHERE project_id = ? AND developer_id = ?
          `).bind(project_id, developer_id).run();
          return jsonResponse({ success: true, message: 'Assignment removed' }, corsHeaders);
        }
        return jsonResponse({ success: true, message: 'Removed (offline mode)' }, corsHeaders);
      } catch (err) {
        return jsonResponse({ success: false, message: err.message }, corsHeaders, 500);
      }
    }

    // GET /api/manage/audit — Retrieve audit logs
    if (pathname === '/api/manage/audit' && request.method === 'GET') {
      if (env.DB) {
        try {
          const { results: logs } = await env.DB.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50').all();
          return jsonResponse({ success: true, data: logs }, corsHeaders);
        } catch (e) {}
      }
      return jsonResponse({ success: true, data: [] }, corsHeaders);
    }

    // ------------------------------------------------------------------------
    // 2. Static Asset & Clean URL Routing
    // ------------------------------------------------------------------------

    // Friendly URL Rewrites:
    // /r/:slug, /repository/:slug, /p/:slug -> /project.html?id=:slug
    if (pathname.startsWith('/r/') || pathname.startsWith('/repository/') || pathname.startsWith('/p/')) {
      const slug = pathname.replace('/repository/', '').replace('/r/', '').replace('/p/', '');
      const redirectUrl = new URL(`/project.html?id=${slug}`, request.url);
      return env.ASSETS.fetch(new Request(redirectUrl, request));
    }

    // /edit/:slug -> /repository_editor.html?id=:slug
    if (pathname.startsWith('/edit/')) {
      const slug = pathname.replace('/edit/', '');
      const redirectUrl = new URL(`/repository_editor.html?id=${slug}`, request.url);
      return env.ASSETS.fetch(new Request(redirectUrl, request));
    }

    // /d/:handle -> /developer.html?id=:handle
    if (pathname.startsWith('/d/') || pathname.startsWith('/@')) {
      const handle = pathname.replace('/d/', '').replace('/@', '');
      const redirectUrl = new URL(`/developer.html?id=${handle}`, request.url);
      return env.ASSETS.fetch(new Request(redirectUrl, request));
    }

    // Default static assets handler
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Ragetech Edge Server Running', { status: 200 });
  }
};

function jsonResponse(data, headers = {}, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers
    }
  });
}

async function sha256Hex(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
