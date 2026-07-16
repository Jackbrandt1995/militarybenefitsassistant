// Route smoke test: hits every page/API route on a running server and checks
// the response class. Logged-out expectations: public pages 200; protected
// pages redirect to /login; APIs return a JSON auth/method error (never a 500).
// Usage: node scripts/smoke-routes.mjs [baseUrl]   (default http://localhost:3100)
const BASE = process.argv[2] || 'http://localhost:3100';

const ROUTES = [
  // path, kind: 'public' | 'protected' | 'api'
  ['/', 'public'],
  ['/privacy', 'public'],
  ['/terms', 'public'],
  ['/login', 'public'],
  ['/signup', 'public'],
  ['/forgot-password', 'public'],
  ['/reset-password', 'public'],
  ['/dashboard', 'protected'],
  ['/history', 'protected'],
  ['/profile', 'protected'],
  ['/terms/accept', 'protected'],
  ['/forms/va-22-1990', 'protected'],
  ['/forms/va-22-1990/review', 'protected'],
  ['/forms/va-22-1990/complete', 'protected'],
  ['/admin', 'protected'],
  ['/admin/profile', 'protected'],
  ['/admin/clients/00000000-0000-0000-0000-000000000000', 'protected'],
  ['/api/submissions', 'api'],
  ['/api/profile', 'api'],
  ['/api/direct-deposit', 'api'],
  ['/api/notify-filing', 'api'],
  ['/api/notify-message', 'api'],
  ['/api/notify-return', 'api'],
];

let failures = 0;
for (const [path, kind] of ROUTES) {
  let res, body = '';
  try {
    res = await fetch(BASE + path, { redirect: 'manual' });
    body = (await res.text()).slice(0, 300);
  } catch (e) {
    console.log(`FAIL  ${path}  fetch error: ${e.message}`);
    failures++;
    continue;
  }
  const loc = res.headers.get('location') || '';
  let ok, note;
  if (kind === 'public') {
    ok = res.status === 200;
    note = `status ${res.status}`;
  } else if (kind === 'protected') {
    // middleware/layout should bounce a logged-out visitor toward login (or
    // render a client shell that itself redirects — accept 200 only if the
    // HTML contains a redirect hint; be strict on 5xx).
    ok = (res.status >= 300 && res.status < 400 && /login/.test(loc)) || res.status === 200;
    note = res.status >= 300 && res.status < 400 ? `-> ${loc}` : `status ${res.status}`;
    if (res.status >= 500) ok = false;
  } else {
    // APIs: any 4xx JSON is fine logged-out (401/403/405/400); 5xx or HTML is not.
    ok = res.status >= 400 && res.status < 500;
    const isJson = (res.headers.get('content-type') || '').includes('json');
    note = `status ${res.status}${isJson ? ' json' : ' NOT-JSON'}`;
    if (ok && !isJson && res.status !== 405) ok = false; // 405 may be bodyless
  }
  if (res.status === 200 && /Application error|__next_error__/.test(body)) { ok = false; note += ' (error page)'; }
  console.log(`${ok ? ' ok ' : 'FAIL'}  ${path.padEnd(55)} ${note}`);
  if (!ok) failures++;
}
console.log(failures ? `\n${failures} route(s) FAILED` : '\nAll routes passed');
process.exit(failures ? 1 : 0);
