/**
 * Centralized API client.
 * --------------------------------------------------------------
 * Every authenticated request should go through `apiFetch`, not a
 * raw `fetch` call. It:
 *   1. Attaches `Authorization: Bearer <access token>` from the
 *      in-memory token store (see lib/tokenStore.js).
 *   2. On a 401 — including "no token in memory yet" (e.g. right
 *      after a hard reload) — calls this app's own /api/refresh
 *      route, which reads the httpOnly cookie and returns a fresh
 *      access token, then retries the original request once.
 *   3. If refresh fails (cookie missing/expired), clears the
 *      in-memory token and sends the user to /login.
 *
 * Multiple simultaneous 401s trigger only one refresh call — the
 * rest await the same in-flight promise.
 * --------------------------------------------------------------
 */

import { getAccessToken, setAccessToken, clearAccessToken } from './tokenStore';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

let refreshPromise = null;

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    // Same-origin call — the httpOnly refresh cookie is sent
    // automatically by the browser, no need to read or pass it here.
    const res = await fetch('/api/refresh', { method: 'POST' });
    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.access) {
      throw new Error('Refresh failed');
    }

    setAccessToken(data.access);
    return data.access;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

function goToLogin() {
  clearAccessToken();
  if (typeof window !== 'undefined') window.location.href = '/login';
}

/**
 * apiFetch('/brands/', { method: 'GET' })
 * apiFetch('/posts/', { method: 'POST', body: JSON.stringify({...}) })
 *
 * Calls your external API directly (via NEXT_PUBLIC_API_URL) with
 * the access token attached — only the login/refresh calls are
 * proxied through this app's own /api routes.
 */
export async function apiFetch(path, options = {}) {
  const doRequest = (token) =>
    fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

  let token = getAccessToken();
  let res = await doRequest(token);

  if (res.status === 401) {
    try {
      token = await refreshAccessToken();
    } catch {
      goToLogin();
      throw new Error('Session expired. Redirecting to login.');
    }
    res = await doRequest(token); // retry once with the fresh token
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body — fine for some endpoints (e.g. 204 No Content)
  }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/**
 * Call this on app load (e.g. in a top-level layout effect) if you
 * want the access token ready before the first apiFetch call rather
 * than relying on the automatic 401-triggered refresh. Optional —
 * apiFetch works fine without it, just with one extra round trip on
 * the very first request after a reload.
 */
export async function hydrateSession() {
  if (getAccessToken()) return true;
  try {
    await refreshAccessToken();
    return true;
  } catch {
    return false;
  }
}

export async function logout() {
  clearAccessToken();
  try {
    await fetch('/api/logout', { method: 'POST' });
  } finally {
    if (typeof window !== 'undefined') window.location.href = '/login';
  }
}