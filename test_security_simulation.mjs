// Security Simulation & Penetration Test Suite for Ragetech Platform
import worker from './worker.js';

// Setup Mock Environment and D1 Database
const developersTable = [
  {
    id: 'dev-00',
    handle: 'reymartchua',
    name: 'Reymart Chua',
    email: 'contact@ragetech.dev',
    role: 'Founder & Principal Systems Architect',
    account_role: 'admin',
    squad: 'Core Platform',
    bio: 'Platform founder',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    website_url: 'https://ragetech.dev',
    github_url: 'https://github.com/reymartchua',
    gpg_fingerprint: '4A8F B291 0D33',
    is_verified: 1,
    sort_order: 0,
    password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8' // 'password' in sha256
  },
  {
    id: 'dev-01',
    handle: 'leaddev',
    name: 'Lead Developer',
    email: 'lead@ragetech.dev',
    role: 'Lead Architect',
    account_role: 'lead',
    squad: 'Core Platform',
    bio: 'Lead member',
    avatar_url: '',
    website_url: '',
    github_url: '',
    gpg_fingerprint: '',
    is_verified: 1,
    sort_order: 1,
    password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
  },
  {
    id: 'dev-02',
    handle: 'johndoe',
    name: 'John Doe',
    email: 'john@ragetech.dev',
    role: 'Junior Engineer',
    account_role: 'developer',
    squad: 'Frontend',
    bio: 'Dev member',
    avatar_url: '',
    website_url: '',
    github_url: '',
    gpg_fingerprint: '',
    is_verified: 1,
    sort_order: 2,
    password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
  },
  {
    id: 'dev-03',
    handle: 'unverified_user',
    name: 'Unverified Hacker',
    email: 'hacker@ragetech.dev',
    role: 'Applicant',
    account_role: 'developer',
    squad: 'External',
    bio: '',
    avatar_url: '',
    website_url: '',
    github_url: '',
    gpg_fingerprint: '',
    is_verified: 0, // Unverified applicant
    sort_order: 99,
    password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
  }
];

const projectsTable = [
  {
    id: 'proj-01',
    slug: 'neuro-shield',
    title: 'NeuroShield',
    category: 'Computer Vision',
    summary: 'Neural edge protection system',
    featured_order: 1,
    is_published: 1
  }
];

const mockD1 = {
  prepare(query) {
    let bound = [];
    return {
      bind(...args) {
        bound = args;
        return this;
      },
      async first() {
        const q = query.toLowerCase();
        if (q.includes('select 1')) return { 1: 1 };
        if (q.includes('from developers')) {
          const val = bound[0];
          const val2 = bound[1] || val;
          return developersTable.find(d => 
            d.id === val || 
            d.handle.toLowerCase() === String(val).toLowerCase() ||
            d.handle.toLowerCase() === String(val2).toLowerCase()
          ) || null;
        }
        if (q.includes('from projects')) {
          const val = bound[0];
          return projectsTable.find(p => p.slug === val || p.id === val) || null;
        }
        return null;
      },
      async all() {
        const q = query.toLowerCase();
        if (q.includes('from developers')) {
          return { results: developersTable };
        }
        if (q.includes('from projects')) {
          return { results: projectsTable };
        }
        if (q.includes('from project_sections')) {
          return { results: [] };
        }
        if (q.includes('from project_assignments')) {
          return { results: [] };
        }
        return { results: [] };
      },
      async run() {
        return { success: true };
      }
    };
  }
};

const mockEnv = {
  DB: mockD1,
  AUTH_SECRET: 'simulated_production_secret_key_987654321',
  ASSETS: {
    fetch: async () => new Response('<!DOCTYPE html><html><body>Dashboard Content</body></html>', { status: 200 })
  }
};

// Simulation Test Runner
const results = [];
function recordResult(name, passed, details) {
  results.push({ name, passed, details });
  const statusMark = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${statusMark}: ${name}\n  -> ${details}\n`);
}

async function runSimulations() {
  console.log('===============================================================');
  console.log('   RAGETECH DEFENSIVE SECURITY & ATTACK SIMULATION SUITE');
  console.log('===============================================================\n');

  // --- ATTACK 1: Unauthenticated Database Mutation ---
  {
    const req = new Request('https://ragetech.dev/api/manage/projects/proj-01', {
      method: 'DELETE'
    });
    const res = await worker.fetch(req, mockEnv);
    const body = await res.json();
    const passed = res.status === 401 && body.success === false;
    recordResult(
      'Sim 1: Unauthenticated Database Mutation Blocked',
      passed,
      `HTTP status ${res.status} (Expected 401). Message: "${body.message}"`
    );
  }

  // --- ATTACK 2: Forged JWT & Signature Tampering ---
  {
    // Attacker crafts arbitrary payload claiming to be admin with a fake signature
    const forgedPayload = Buffer.from(JSON.stringify({ sub: 'reymartchua', role: 'admin', exp: Date.now() + 10000 })).toString('base64url');
    const fakeSignature = 'fake_signature_hash_12345';
    const tamperedToken = `${forgedPayload}.${fakeSignature}`;

    const req = new Request('https://ragetech.dev/api/manage/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tamperedToken}`
      },
      body: JSON.stringify({ slug: 'hacked-project', title: 'Hacked' })
    });
    const res = await worker.fetch(req, mockEnv);
    const body = await res.json();
    const passed = res.status === 401 && body.success === false;
    recordResult(
      'Sim 2: Tampered & Forged HMAC Signature Rejection',
      passed,
      `HTTP status ${res.status} (Expected 401). Message: "${body.message}"`
    );
  }

  // --- ATTACK 3: Unverified Account Access Attempt ---
  {
    // Try authenticating unverified applicant
    const loginReq = new Request('https://ragetech.dev/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: 'unverified_user', password: 'password' })
    });
    const loginRes = await worker.fetch(loginReq, mockEnv);
    const loginBody = await loginRes.json();
    const passed = loginRes.status === 403 && loginBody.success === false;
    recordResult(
      'Sim 3: Unverified Applicant Access Blocked',
      passed,
      `HTTP status ${loginRes.status} (Expected 403). Message: "${loginBody.message}"`
    );
  }

  // --- ATTACK 4: Privilege Escalation (Developer attempting Admin actions) ---
  {
    // 1. Legitimate developer logs in
    const devLoginReq = new Request('https://ragetech.dev/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: 'johndoe', password: 'password' })
    });
    const devLoginRes = await worker.fetch(devLoginReq, mockEnv);
    const devLoginBody = await devLoginRes.json();
    const devToken = devLoginBody.token;

    // 2. Developer attempts to delete audit logs
    const auditReq = new Request('https://ragetech.dev/api/manage/audit', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${devToken}` }
    });
    const auditRes = await worker.fetch(auditReq, mockEnv);
    const auditBody = await auditRes.json();

    // 3. Developer attempts to create a project
    const projReq = new Request('https://ragetech.dev/api/manage/projects', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${devToken}` 
      },
      body: JSON.stringify({ slug: 'rogue-project' })
    });
    const projRes = await worker.fetch(projReq, mockEnv);
    const projBody = await projRes.json();

    const passed = auditRes.status === 403 && projRes.status === 403;
    recordResult(
      'Sim 4: Privilege Escalation Blocked (Developer Role Forbidden on Admin/Lead Endpoints)',
      passed,
      `Audit status: ${auditRes.status} (Expected 403), Project status: ${projRes.status} (Expected 403)`
    );
  }

  // --- ATTACK 5: Public Credential Harvesting ---
  {
    const req = new Request('https://ragetech.dev/api/developers/reymartchua');
    const res = await worker.fetch(req, mockEnv);
    const body = await res.json();
    const hasPasswordHash = body.data && 'password_hash' in body.data;
    const passed = res.status === 200 && !hasPasswordHash;
    recordResult(
      'Sim 5: Credential Harvesting Prevention (Password Hash Stripped from Public API)',
      passed,
      `password_hash exposed: ${hasPasswordHash} (Expected false)`
    );
  }

  // --- ATTACK 6: Direct Dashboard Edge Gating Bypass ---
  {
    // Visitor directly fetches /admin.html without credentials
    const req = new Request('https://ragetech.dev/admin.html');
    const res = await worker.fetch(req, mockEnv);
    const location = res.headers.get('Location') || '';
    const passed = res.status === 302 && location.includes('index.html?auth=unauthorized');
    recordResult(
      'Sim 6: Direct Gated HTML Dashboard Access Intercepted at Edge',
      passed,
      `HTTP status: ${res.status} (Expected 302 Redirect). Location: "${location}"`
    );
  }

  // --- ATTACK 7: Brute Force Password Guessing / Spraying ---
  {
    // Send 6 rapid invalid login requests from same IP
    let rateLimited = false;
    let lastStatus = 0;
    const clientIp = '198.51.100.42'; // Attacker IP

    for (let i = 1; i <= 6; i++) {
      const sprayReq = new Request('https://ragetech.dev/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CF-Connecting-IP': clientIp
        },
        body: JSON.stringify({ handle: 'reymartchua', password: `wrong_pass_${i}` })
      });
      const sprayRes = await worker.fetch(sprayReq, mockEnv);
      lastStatus = sprayRes.status;
      if (sprayRes.status === 429) {
        rateLimited = true;
        break;
      }
    }

    recordResult(
      'Sim 7: Anti-Brute-Force Rate Limiting Triggered',
      rateLimited,
      `Final status code on 6th attempt: ${lastStatus} (Expected 429 Too Many Requests)`
    );
  }

  // --- ATTACK 8: Root Admin Account Sabotage ---
  {
    // Admin logs in
    const adminLoginReq = new Request('https://ragetech.dev/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: 'reymartchua', password: 'password' })
    });
    const adminLoginRes = await worker.fetch(adminLoginReq, mockEnv);
    const adminLoginBody = await adminLoginRes.json();
    const adminToken = adminLoginBody.token;

    // Admin attempts to delete primary root admin
    const delRootReq = new Request('https://ragetech.dev/api/manage/developers/dev-00', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const delRootRes = await worker.fetch(delRootReq, mockEnv);
    const delRootBody = await delRootRes.json();
    const passed = delRootRes.status === 403 && delRootBody.success === false;

    recordResult(
      'Sim 8: Primary Administrator Root Protection',
      passed,
      `HTTP status: ${delRootRes.status} (Expected 403). Message: "${delRootBody.message}"`
    );
  }

  console.log('===============================================================');
  const allPassed = results.every(r => r.passed);
  console.log(`SUMMARY: ${results.filter(r => r.passed).length}/${results.length} Simulations Passed.`);
  console.log(`CONCLUSION: ${allPassed ? 'SYSTEM HARDENING VERIFIED AND SECURE' : 'VULNERABILITIES REMAIN'}`);
  console.log('===============================================================');

  if (!allPassed) process.exit(1);
}

runSimulations().catch(err => {
  console.error('Simulation error:', err);
  process.exit(1);
});
