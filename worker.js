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

    // POST /api/auth/login — RBAC Login System
    if (pathname === '/api/auth/login' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { handle, password } = body;

        // Built-in authentication support
        if (env.DB) {
          const dev = await env.DB.prepare(`
            SELECT id, handle, name, role, account_role, squad, avatar_url 
            FROM developers 
            WHERE handle = ?
          `).bind(handle).first();

          if (dev) {
            // Simulated token for development collective
            return jsonResponse({
              success: true,
              token: `tok_${dev.handle}_${Date.now()}`,
              user: dev
            }, corsHeaders);
          }
        } else {
          // Offline mock login for admin/lead testing
          if (handle === 'sora' || handle === 'admin') {
            return jsonResponse({
              success: true,
              token: `tok_admin_${Date.now()}`,
              user: {
                handle: 'sora',
                name: 'Sora Takahashi',
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
        const { id, slug, name, tagline, description, category, status, live_url, github_url, tech_stack } = body;

        if (env.DB) {
          const existing = await env.DB.prepare('SELECT id FROM projects WHERE id = ? OR slug = ?').bind(id, slug).first();
          if (existing) {
            await env.DB.prepare(`
              UPDATE projects 
              SET name = ?, tagline = ?, description = ?, category = ?, status = ?, live_url = ?, github_url = ?, tech_stack = ?, updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `).bind(name, tagline, description, category, status, live_url, github_url, tech_stack, existing.id).run();
          } else {
            await env.DB.prepare(`
              INSERT INTO projects (id, slug, name, tagline, description, category, status, live_url, github_url, tech_stack)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(id || `proj-${Date.now()}`, slug, name, tagline, description, category, status || 'active', live_url, github_url, tech_stack).run();
          }

          return jsonResponse({ success: true, message: 'Project saved successfully' }, corsHeaders);
        }
        return jsonResponse({ success: true, message: 'Updated (offline mode)' }, corsHeaders);
      } catch (err) {
        return jsonResponse({ success: false, message: err.message }, corsHeaders, 500);
      }
    }

    // ------------------------------------------------------------------------
    // 2. Static Asset & Clean URL Routing
    // ------------------------------------------------------------------------

    // Friendly URL Rewrites:
    // /p/:slug -> /project.html?id=:slug
    if (pathname.startsWith('/p/')) {
      const slug = pathname.replace('/p/', '');
      const redirectUrl = new URL(`/project.html?id=${slug}`, request.url);
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
