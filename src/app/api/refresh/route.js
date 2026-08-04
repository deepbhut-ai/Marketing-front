import { NextResponse } from 'next/server';

const API_BASE = (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

const REFRESH_COOKIE = 'mk_refresh';
const SESSION_COOKIE = 'mk_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

// ADJUST: confirm this matches your API's actual refresh endpoint
// and request/response shape (assumed: POST { refresh } -> { access, refresh }).
const REFRESH_PATH = '/accounts/refresh/';

export async function POST(request) {
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!refresh) {
    return NextResponse.json({ success: false, message: 'No refresh token.' }, { status: 401 });
  }

  if (!API_BASE) {
    return NextResponse.json({ success: false, message: 'API base URL not configured.' }, { status: 500 });
  }

  const upstream = await fetch(`${API_BASE}${REFRESH_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  const data = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    // Refresh token is dead (expired/revoked) — clear session cookies
    // so middleware stops treating this browser as logged in.
    const res = NextResponse.json({ success: false, message: 'Refresh failed.' }, { status: 401 });
    res.cookies.delete(REFRESH_COOKIE);
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  const newAccess = data?.access ?? data?.data?.access;
  const newRefresh = data?.refresh ?? data?.data?.refresh;

  if (!newAccess) {
    return NextResponse.json({ success: false, message: 'Refresh response missing access token.' }, { status: 502 });
  }

  const res = NextResponse.json({ success: true, access: newAccess });

  const cookieBase = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
  };

  // Some APIs rotate the refresh token on every use — if yours does,
  // this keeps the cookie in sync. If yours doesn't, this is a no-op.
  if (newRefresh) {
    res.cookies.set(REFRESH_COOKIE, newRefresh, cookieBase);
  }

  // Keep the session flag's expiry rolling too.
  res.cookies.set(SESSION_COOKIE, '1', cookieBase);

  return res;
}