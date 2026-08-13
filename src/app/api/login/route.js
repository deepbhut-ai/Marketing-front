import { NextResponse } from 'next/server';

// Prefer a server-only var if you add one later (API_BASE_URL, no
// NEXT_PUBLIC_ prefix so it never ships to the browser bundle).
// Falls back to your existing NEXT_PUBLIC_API_URL so this works
// with zero .env changes today.
const API_BASE = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

const REFRESH_COOKIE = 'mk_refresh';
const SESSION_COOKIE = 'mk_session'; // presence-only flag, no token value
const ROLE_COOKIE = 'mk_role';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days — match your API's real refresh-token lifetime
const LOGIN_RATE_LIMIT = 8;
const LOGIN_RATE_WINDOW_MS = 60 * 1000;
const loginAttempts = new Map();

// Periodically evict stale rate-limit entries to prevent unbounded memory growth
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of loginAttempts) {
      if (now > entry.resetAt) loginAttempts.delete(key);
    }
  }, 5 * 60 * 1000); // cleanup every 5 minutes
}

function getClientKey(request) {
  const forwarded = request.headers.get('x-forwarded-for') || '';
  const firstIp = forwarded.split(',')[0]?.trim();
  const ip = firstIp || request.headers.get('x-real-ip') || 'unknown';
  return `login:${ip}`;
}

function isRateLimited(request) {
  const key = getClientKey(request);
  const now = Date.now();
  const current = loginAttempts.get(key);

  if (!current) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_RATE_WINDOW_MS });
    return false;
  }

  if (now > current.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_RATE_WINDOW_MS });
    return false;
  }

  if (current.count >= LOGIN_RATE_LIMIT) {
    return true;
  }

  current.count += 1;
  loginAttempts.set(key, current);
  return false;
}

export async function POST(request) {
  if (!API_BASE) {
    return NextResponse.json(
      { success: false, message: 'API_BASE_URL / NEXT_PUBLIC_API_URL is not set on the server.' },
      { status: 500 }
    );
  }

  if (isRateLimited(request)) {
    return NextResponse.json({ success: false, message: 'Too many login attempts. Please try again shortly.' }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!email || !password) {
    return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
  }

  let upstream;
  try {
    upstream = await fetch(`${API_BASE}/accounts/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, device_name: body.device_name, captcha: body.captcha }),
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Authentication service is unavailable.' }, { status: 502 });
  }

  const data = await upstream.json().catch(() => null);

  let success = false;
  let message = 'Login failed.';
  let responseData = {};
  let status = upstream.status;

  if (Array.isArray(data)) {
    const payload = data[0];
    const code = data[1];
    success = payload?.success || false;
    message = payload?.message || 'Login failed.';
    responseData = payload?.data || {};
    status = typeof code === 'number' ? code : 400;
  } else if (data) {
    success = data.success || false;
    message = data.message || 'Login failed.';
    responseData = data.data || {};
  }

  if (!success) {
    return NextResponse.json(
      { success: false, message },
      { status: status >= 400 ? status : 400 }
    );
  }

  // `type` in your API's response ("user" / "admin") drives the
  // mk_role cookie middleware.js checks for /admin route gating.
  const { access, refresh, device_id, agent_token, user_id, type } = responseData || {};

  if (!access || !refresh) {
    return NextResponse.json(
      { success: false, message: 'Login response was missing access/refresh tokens.' },
      { status: 502 }
    );
  }

  // Keep the browser response minimal. The access token is needed by
  // the client for the current session; other values are not required.
  const res = NextResponse.json({
    success: true,
    access,
    role: type || 'user',
  });

  const cookieBase = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  };

  // The actual bearer token — JS can never read this.
  res.cookies.set(REFRESH_COOKIE, refresh, { ...cookieBase, httpOnly: true });

  // A cheap "am I logged in" flag middleware.js can check without
  // ever seeing the real token. httpOnly here too — it doesn't need
  // to be read by client JS, only by middleware, so there's no
  // reason to expose it either.
  res.cookies.set(SESSION_COOKIE, '1', { ...cookieBase, httpOnly: true });

  // Role, same treatment — middleware reads it, browser JS doesn't
  // need to.
  res.cookies.set(ROLE_COOKIE, type || 'user', { ...cookieBase, httpOnly: true });

  return res;
}
