/**
 * In-memory access token store.
 * --------------------------------------------------------------
 * Deliberately NOT localStorage/sessionStorage — this is a plain JS
 * module-level variable, so it's invisible to any injected script
 * that goes looking through browser storage (the XSS scenario we
 * were guarding against).
 *
 * Tradeoff: it's lost on a hard page reload. That's expected —
 * apiClient.js calls /api/refresh (which reads the httpOnly cookie
 * the browser sends automatically) to get a new access token
 * whenever it finds none in memory. The user never notices; there's
 * just a silent refresh call on first load after a reload.
 * --------------------------------------------------------------
 */

let accessToken = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token || null;
}

export function clearAccessToken() {
  accessToken = null;
}