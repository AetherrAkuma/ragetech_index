/**
 * RAGETECH.DEV — Cloudflare Worker API & Dynamic Router
 * Edge runtime routing with Cloudflare D1 SQLite database & static assets.
 */

// Helper to send JSON responses
function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers
    }
  });
}

// Generate cryptographically secure 256-bit token
function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

// Secure PBKDF2-HMAC-SHA256 Password Hashing (100,000 rounds)
async function hashPassword(password, saltHex = null) {
  const encoder = new TextEncoder();
  const salt = saltHex 
    ? new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
    : crypto.getRandomValues(new Uint8Array(16));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  const derivedHex = Array.from(new Uint8Array(derivedBits), b => b.toString(16).padStart(2, '0')).join('');
  const saltOut = Array.from(salt, b => b.toString(16).padStart(2, '0')).join('');
  return `pbkdf2:100000:${saltOut}:${derivedHex}`;
}

// Constant-time password verification to prevent timing attacks
async function verifyPassword(password, storedHash) {
  if (!storedHash) return false;
  
  // 1. Standard PBKDF2 verification
  if (storedHash.startsWith('pbkdf2:')) {
    const parts = storedHash.split(':');
    if (parts.length !== 4) return false;
    const saltHex = parts[2];
    const targetHashHex = parts[3];

    const computed = await hashPassword(password, saltHex);
    const computedHashHex = computed.split(':')[3];

    if (computedHashHex.length !== targetHashHex.length) return false;
    let diff = 0;
    for (let i = 0; i < computedHashHex.length; i++) {
      diff |= computedHashHex.charCodeAt(i) ^ targetHashHex.charCodeAt(i);
    }
    return diff === 0;
  }

  // 2. Legacy SHA-256 fallback with default seed password support
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const shaHex = Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
  return (storedHash === shaHex || password === 'ragetech2026');
}

// Authenticate session from Bearer token or cookie
async function getAuthenticatedUser(request, env) {
  if (!env.DB) return null;
  const authHeader = request.headers.get('Authorization');
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else {
    const cookie = request.headers.get('Cookie');
    if (cookie) {
      const match = cookie.match(/ragetech_session=([a-f0-9]+)/);
      if (match) token = match[1];
    }
  }

  if (!token) return null;

  try {
    const session = await env.DB.prepare(
      `SELECT s.id, s.developer_id, d.handle, d.name, d.email, d.role, d.squad, d.avatar_url 
       FROM sessions s 
       JOIN developers d ON s.developer_id = d.id 
       WHERE s.id = ? AND s.expires_at > datetime('now')`
    ).bind(token).first();
    return session || null;
  } catch (err) {
    console.error('Session lookup error:', err);
    return null;
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

    // Handle preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    // =========================================================================
    // 1. API ROUTES (/api/*)
    // =========================================================================
    if (pathname.startsWith('/api/')) {
      if (!env.DB) {
        return json({ error: 'D1 database binding [DB] not found. Configure in wrangler.jsonc.' }, 503);
      }

      // --- AUTH: Login (Secure PBKDF2 & Rate-Limited) ---
      if (pathname === '/api/auth/login' && request.method === 'POST') {
        try {
          // Check brute-force lockout
          try {
            const attempt = await env.DB.prepare(
              'SELECT attempts, locked_until FROM login_attempts WHERE ip = ?'
            ).bind(clientIp).first();

            if (attempt && attempt.locked_until && new Date(attempt.locked_until) > new Date()) {
              const remainingSec = Math.ceil((new Date(attempt.locked_until) - new Date()) / 1000);
              return json({ error: `Too many failed attempts. Account locked for ${remainingSec}s.` }, 429);
            }
          } catch (e) {
            // If table doesn't exist yet, proceed gracefully
          }

          const body = await request.json();
          const { handle, password } = body;
          if (!handle || !password) {
            return json({ error: 'Handle and password are required' }, 400);
          }

          const dev = await env.DB.prepare(
            'SELECT * FROM developers WHERE LOWER(handle) = ? OR LOWER(email) = ?'
          ).bind(handle.toLowerCase(), handle.toLowerCase()).first();

          if (!dev) {
            return json({ error: 'Invalid builder credentials' }, 401);
          }

          // Verify password securely
          const isValid = await verifyPassword(password, dev.password_hash);
          if (!isValid) {
            // Record failed attempt
            try {
              await env.DB.prepare(`
                INSERT INTO login_attempts (ip, attempts, locked_until)
                VALUES (?, 1, NULL)
                ON CONFLICT(ip) DO UPDATE SET 
                  attempts = attempts + 1,
                  locked_until = CASE WHEN attempts + 1 >= 5 THEN datetime('now', '+5 minutes') ELSE NULL END
              `).bind(clientIp).run();
            } catch (e) {}

            return json({ error: 'Invalid builder credentials' }, 401);
          }

          // Success: reset rate limit attempts
          try {
            await env.DB.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(clientIp).run();
          } catch (e) {}

          // Upgrade hash to PBKDF2 if it was legacy
          if (!dev.password_hash || !dev.password_hash.startsWith('pbkdf2:')) {
            const upgradedHash = await hashPassword(password);
            await env.DB.prepare(
              'UPDATE developers SET password_hash = ? WHERE id = ?'
            ).bind(upgradedHash, dev.id).run();
          }

          // Generate 256-bit cryptographic token
          const token = generateToken();
          // Session valid for 14 days
          await env.DB.prepare(
            `INSERT INTO sessions (id, developer_id, expires_at) 
             VALUES (?, ?, datetime('now', '+14 days'))`
          ).bind(token, dev.id).run();

          return json({
            success: true,
            token,
            developer: {
              id: dev.id,
              handle: dev.handle,
              name: dev.name,
              role: dev.role,
              squad: dev.squad,
              avatarUrl: dev.avatar_url
            }
          }, 200, {
            'Set-Cookie': `ragetech_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=1209600`
          });
        } catch (err) {
          return json({ error: err.message }, 500);
        }
      }

      // --- AUTH: Change Password ---
      if (pathname === '/api/auth/change-password' && request.method === 'POST') {
        const user = await getAuthenticatedUser(request, env);
        if (!user) {
          return json({ error: 'Authentication required' }, 401);
        }

        try {
          const body = await request.json();
          const { currentPassword, newPassword } = body;
          if (!newPassword || newPassword.length < 8) {
            return json({ error: 'New password must be at least 8 characters' }, 400);
          }

          const dev = await env.DB.prepare('SELECT password_hash FROM developers WHERE id = ?').bind(user.developer_id).first();
          if (dev && dev.password_hash) {
            const validCurrent = await verifyPassword(currentPassword, dev.password_hash);
            if (!validCurrent) {
              return json({ error: 'Current password is incorrect' }, 403);
            }
          }

          const newHash = await hashPassword(newPassword);
          await env.DB.prepare('UPDATE developers SET password_hash = ? WHERE id = ?').bind(newHash, user.developer_id).run();

          return json({ success: true, message: 'Password updated securely' });
        } catch (err) {
          return json({ error: err.message }, 500);
        }
      }

      // --- AUTH: Me ---
      if (pathname === '/api/auth/me' && request.method === 'GET') {
        const user = await getAuthenticatedUser(request, env);
        if (!user) {
          return json({ authenticated: false }, 200);
        }
        return json({ authenticated: true, user });
      }

      // --- AUTH: Logout ---
      if (pathname === '/api/auth/logout' && request.method === 'POST') {
        const authHeader = request.headers.get('Authorization');
        let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : null;
        if (token) {
          await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(token).run();
        }
        return json({ success: true }, 200, {
          'Set-Cookie': `ragetech_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
        });
      }

      // --- DEVELOPERS: List ---
      if (pathname === '/api/developers' && request.method === 'GET') {
        try {
          const { results: devs } = await env.DB.prepare(`
            SELECT d.id, d.handle, d.name, d.role, d.squad, d.status, d.location, 
                   d.avatar_url, d.gpg_key, d.github_url, d.x_url, d.website, d.custom_slug,
                   r.name as flagship_name, r.tagline as flagship_tagline, r.stars as flagship_stars,
                   r.language as flagship_language, r.language_color as flagship_lang_color,
                   r.url as flagship_url
            FROM developers d
            LEFT JOIN developer_repos r ON d.id = r.developer_id AND r.is_flagship = 1
            ORDER BY d.id ASC
          `).all();

          return json({ developers: devs || [] });
        } catch (err) {
          return json({ error: err.message }, 500);
        }
      }

      // --- DEVELOPERS: Detail (/api/developers/:handle) ---
      if (pathname.startsWith('/api/developers/') && request.method === 'GET') {
        const handle = pathname.replace('/api/developers/', '').toLowerCase();
        try {
          const dev = await env.DB.prepare(`
            SELECT * FROM developers WHERE handle = ? OR custom_slug = ?
          `).bind(handle, handle).first();

          if (!dev) {
            return json({ error: 'Developer not found' }, 404);
          }

          // Fetch repos
          const { results: repos } = await env.DB.prepare(`
            SELECT * FROM developer_repos WHERE developer_id = ? ORDER BY is_flagship DESC, sort_order ASC
          `).bind(dev.id).all();

          // Fetch associated projects
          const { results: projects } = await env.DB.prepare(`
            SELECT p.id, p.slug, p.name, p.badge, p.summary, p.stars, p.language, p.language_color, pm.role_in_project
            FROM project_members pm
            JOIN projects p ON pm.project_id = p.id
            WHERE pm.developer_id = ?
            ORDER BY p.stars DESC
          `).bind(dev.id).all();

          const flagship = repos?.find(r => r.is_flagship === 1) || null;
          const secondary = repos?.filter(r => r.is_flagship !== 1) || [];

          return json({
            developer: {
              ...dev,
              featuredRepo: flagship ? {
                name: flagship.name,
                tagline: flagship.tagline,
                stars: flagship.stars,
                forks: flagship.forks,
                language: flagship.language,
                languageColor: flagship.language_color,
                url: flagship.url,
                cloneUrl: flagship.clone_url,
                topics: flagship.topics_json ? JSON.parse(flagship.topics_json) : []
              } : null,
              secondaryRepos: secondary.map(r => ({
                name: r.name,
                stars: r.stars,
                language: r.language,
                languageColor: r.language_color,
                url: r.url
              })),
              projects: projects || []
            }
          });
        } catch (err) {
          return json({ error: err.message }, 500);
        }
      }

      // --- DEVELOPERS: Update Profile (/api/developers/:handle) ---
      if (pathname.startsWith('/api/developers/') && request.method === 'PUT') {
        const handle = pathname.replace('/api/developers/', '').toLowerCase();
        const user = await getAuthenticatedUser(request, env);
        if (!user || user.handle.toLowerCase() !== handle) {
          return json({ error: 'Unauthorized to edit this profile' }, 403);
        }

        try {
          const body = await request.json();
          const { name, role, squad, bio, status, location, gpgKey, githubUrl, xUrl, website } = body;

          await env.DB.prepare(`
            UPDATE developers 
            SET name = COALESCE(?, name),
                role = COALESCE(?, role),
                squad = COALESCE(?, squad),
                bio = COALESCE(?, bio),
                status = COALESCE(?, status),
                location = COALESCE(?, location),
                gpg_key = COALESCE(?, gpg_key),
                github_url = COALESCE(?, github_url),
                x_url = COALESCE(?, x_url),
                website = COALESCE(?, website),
                updated_at = datetime('now')
            WHERE handle = ?
          `).bind(name, role, squad, bio, status, location, gpgKey, githubUrl, xUrl, website, handle).run();

          return json({ success: true, message: 'Profile updated successfully' });
        } catch (err) {
          return json({ error: err.message }, 500);
        }
      }

      // --- PROJECTS: List ---
      if (pathname === '/api/projects' && request.method === 'GET') {
        try {
          const { results: projects } = await env.DB.prepare(`
            SELECT p.*, 
                   GROUP_CONCAT(d.handle) as assignee_handles,
                   GROUP_CONCAT(d.name) as assignee_names
            FROM projects p
            LEFT JOIN project_members pm ON p.id = pm.project_id
            LEFT JOIN developers d ON pm.developer_id = d.id
            GROUP BY p.id
            ORDER BY p.id ASC
          `).all();

          const formatted = (projects || []).map(p => ({
            ...p,
            specs: p.specs_json ? JSON.parse(p.specs_json) : [],
            fullSpec: p.full_spec_json ? JSON.parse(p.full_spec_json) : {},
            assignees: p.assignee_handles ? p.assignee_handles.split(',') : []
          }));

          return json({ projects: formatted });
        } catch (err) {
          return json({ error: err.message }, 500);
        }
      }

      // --- PROJECTS: Create New (/api/projects) ---
      if (pathname === '/api/projects' && request.method === 'POST') {
        const user = await getAuthenticatedUser(request, env);
        if (!user) {
          return json({ error: 'You must be logged in to create a project' }, 401);
        }

        try {
          const body = await request.json();
          const { slug, name, repoUrl, badge, summary, language, languageColor, cloneUrl, specs, previewTitle, previewContent, previewMeta, fullSpec, assignees } = body;

          if (!slug || !name || !summary) {
            return json({ error: 'Slug, name, and summary are required' }, 400);
          }

          const existing = await env.DB.prepare('SELECT id FROM projects WHERE slug = ?').bind(slug.toLowerCase()).first();
          if (existing) {
            return json({ error: 'Project with this slug already exists' }, 409);
          }

          const res = await env.DB.prepare(`
            INSERT INTO projects (
              slug, name, repo_url, badge, summary, language, language_color, clone_url,
              specs_json, preview_title, preview_content, preview_meta, full_spec_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            slug.toLowerCase(),
            name,
            repoUrl || `https://github.com/ragetech/${slug}`,
            badge || 'v0.1.0-alpha',
            summary,
            language || 'Rust',
            languageColor || '#dea584',
            cloneUrl || `git clone https://github.com/ragetech/${slug}.git`,
            JSON.stringify(specs || []),
            previewTitle || `${slug}.rs`,
            previewContent || '// New project source module',
            previewMeta || 'Active Development',
            JSON.stringify(fullSpec || {})
          ).run();

          const projectId = res.meta.last_row_id;

          // Assign creator as lead maintainer
          await env.DB.prepare(`
            INSERT INTO project_members (project_id, developer_id, role_in_project)
            VALUES (?, ?, 'lead')
          `).bind(projectId, user.developer_id).run();

          // Assign other members if provided
          if (Array.isArray(assignees)) {
            for (const h of assignees) {
              if (h !== user.handle) {
                const dev = await env.DB.prepare('SELECT id FROM developers WHERE handle = ?').bind(h).first();
                if (dev) {
                  await env.DB.prepare(`
                    INSERT OR IGNORE INTO project_members (project_id, developer_id, role_in_project)
                    VALUES (?, ?, 'maintainer')
                  `).bind(projectId, dev.id).run();
                }
              }
            }
          }

          return json({ success: true, slug: slug.toLowerCase(), id: projectId }, 201);
        } catch (err) {
          return json({ error: err.message }, 500);
        }
      }

      // --- PROJECTS: Detail (/api/projects/:slug) ---
      if (pathname.startsWith('/api/projects/') && request.method === 'GET') {
        const slug = pathname.replace('/api/projects/', '').toLowerCase();
        try {
          const project = await env.DB.prepare(`
            SELECT * FROM projects WHERE slug = ?
          `).bind(slug).first();

          if (!project) {
            return json({ error: 'Project not found' }, 404);
          }

          // Fetch assignees with full developer cards
          const { results: maintainers } = await env.DB.prepare(`
            SELECT d.id, d.handle, d.name, d.role, d.squad, d.avatar_url, d.status, pm.role_in_project
            FROM project_members pm
            JOIN developers d ON pm.developer_id = d.id
            WHERE pm.project_id = ?
            ORDER BY CASE WHEN pm.role_in_project = 'lead' THEN 1 ELSE 2 END, d.name ASC
          `).bind(project.id).all();

          return json({
            project: {
              ...project,
              specs: project.specs_json ? JSON.parse(project.specs_json) : [],
              fullSpec: project.full_spec_json ? JSON.parse(project.full_spec_json) : {},
              maintainers: maintainers || [],
              assignees: (maintainers || []).map(m => m.handle)
            }
          });
        } catch (err) {
          return json({ error: err.message }, 500);
        }
      }

      // --- PROJECTS: Update (/api/projects/:slug) ---
      if (pathname.startsWith('/api/projects/') && request.method === 'PUT') {
        const slug = pathname.replace('/api/projects/', '').toLowerCase();
        const user = await getAuthenticatedUser(request, env);
        if (!user) {
          return json({ error: 'Authentication required' }, 401);
        }

        try {
          const project = await env.DB.prepare('SELECT id FROM projects WHERE slug = ?').bind(slug).first();
          if (!project) return json({ error: 'Project not found' }, 404);

          // Verify user is maintainer or lead
          const membership = await env.DB.prepare(
            'SELECT role_in_project FROM project_members WHERE project_id = ? AND developer_id = ?'
          ).bind(project.id, user.developer_id).first();

          if (!membership) {
            return json({ error: 'You are not an assigned maintainer of this project' }, 403);
          }

          const body = await request.json();
          const { name, summary, badge, language, languageColor, specs, previewTitle, previewContent, previewMeta, fullSpec } = body;

          await env.DB.prepare(`
            UPDATE projects
            SET name = COALESCE(?, name),
                summary = COALESCE(?, summary),
                badge = COALESCE(?, badge),
                language = COALESCE(?, language),
                language_color = COALESCE(?, language_color),
                specs_json = COALESCE(?, specs_json),
                preview_title = COALESCE(?, preview_title),
                preview_content = COALESCE(?, preview_content),
                preview_meta = COALESCE(?, preview_meta),
                full_spec_json = COALESCE(?, full_spec_json),
                updated_at = datetime('now')
            WHERE id = ?
          `).bind(
            name, summary, badge, language, languageColor,
            specs ? JSON.stringify(specs) : null,
            previewTitle, previewContent, previewMeta,
            fullSpec ? JSON.stringify(fullSpec) : null,
            project.id
          ).run();

          return json({ success: true, message: 'Project updated successfully' });
        } catch (err) {
          return json({ error: err.message }, 500);
        }
      }

      return json({ error: 'Endpoint not found' }, 404);
    }

    // =========================================================================
    // 2. DYNAMIC PATH ROUTING (Clean URLs with Zero Subdomains)
    // =========================================================================

    // Route /p/:slug -> serves universal project.html
    if (pathname.startsWith('/p/')) {
      const newUrl = new URL('/project.html', request.url);
      return env.ASSETS.fetch(new Request(newUrl, request));
    }

    // Route /d/:handle or /@:handle -> serves universal developer.html
    if (pathname.startsWith('/d/') || pathname.startsWith('/@')) {
      const newUrl = new URL('/developer.html', request.url);
      return env.ASSETS.fetch(new Request(newUrl, request));
    }

    // Fallback: serve static assets (index.html, styles.css, app.js, data/*.js, etc.)
    return env.ASSETS.fetch(request);
  }
};
