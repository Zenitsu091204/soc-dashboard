const http = require('http');

function request(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost', port: 5000,
      path: '/api' + path, method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function run() {
  const loginRes = await request('POST', '/auth/login', null, { email: 'admin@soc.com', password: 'password123' });
  if (!loginRes.data.token) { console.log('❌ LOGIN FAILED:', loginRes.data); return; }
  const token = loginRes.data.token;
  console.log('✅ LOGIN OK\n');

  const checks = [
    ['GET', '/alerts'], ['GET', '/alerts/stats'],
    ['GET', '/intel/iocs'], ['GET', '/intel/threat-actors'],
    ['GET', '/intel/opencti-matches'], ['GET', '/intel/sync/status'],
    ['GET', '/rules'], ['GET', '/rules/stats'],
    ['GET', '/incidents'], ['GET', '/campaigns'],
    ['GET', '/settings/workspace'], ['GET', '/settings/integrations'],
    ['GET', '/auth/profile'], ['GET', '/auth/users'],
    ['GET', '/system/health'],
  ];

  let pass = 0, fail = 0;
  for (const [method, path] of checks) {
    try {
      const res = await request(method, path, token);
      if (res.status >= 200 && res.status < 300) {
        const count = Array.isArray(res.data) ? `${res.data.length} records` : 'object';
        console.log(`✅ ${method} ${path} (${res.status}) → ${count}`);
        pass++;
      } else {
        console.log(`❌ ${method} ${path} (${res.status}) → ${res.data?.message}`);
        fail++;
      }
    } catch(e) {
      console.log(`❌ ${method} ${path} → ${e.message}`);
      fail++;
    }
  }
  console.log(`\n${pass}/${pass + fail} endpoints passing`);
}
run().catch(e => console.error('Fatal:', e.message));
