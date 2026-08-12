import { NextResponse } from 'next/server';

/**
 * Route gating for the whole app.
 * --------------------------------------------------------------
 * File MUST be named `proxy.js` at `src/proxy.js`.
 * This file serves as the Next.js middleware (proxy.js in Next.js 16+).
 *
 * Paths below match the actual folder structure:
 *   (auth)/forgotpassword  -> /forgotpassword   (no hyphen!)
 *   (auth)/login           -> /login
 *   (auth)/register        -> /register
 *   (auth)/verify-otp      -> /verify-otp
 *   (admin)/admin/*        -> /admin/*
 *   (user)/*               -> /dashboard, /brands, /analytics, etc.
 *     (route groups in parentheses never appear in the URL)
 *
 * Trust model: this checks for the PRESENCE of `mk_session` (a
 * lightweight flag, not the real token) to decide whether to
 * redirect. It's a UX routing guard, not the security boundary —
 * your API must independently validate the access token on every
 * request regardless of what this proxy decides.
 * --------------------------------------------------------------
 */

const AUTH_PATHS = ['/login', '/register', '/forgotpassword', '/verify-otp'];

function isUnderPath(pathname, base) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export default async function proxy(request) {
  const { pathname } = request.nextUrl;

  const hasSession = request.cookies.get('mk_session')?.value;
  const role = request.cookies.get('mk_role')?.value; // 'admin' | 'user' | undefined

  const isAuthPage = AUTH_PATHS.some((p) => isUnderPath(pathname, p));
  const isAdminArea = isUnderPath(pathname, '/admin');

  // Case 1 — auth pages: already logged in → bounce to the right
  // dashboard instead of showing the login/register form again.
  if (isAuthPage) {
    if (hasSession) {
      const dest = role === 'admin' ? '/admin/dashboard' : '/dashboard';
      return NextResponse.redirect(new URL(dest, request.url));
    }
    return NextResponse.next();
  }

  // Landing page (root "/") is always public — logged-out visitors
  // see the marketing landing; logged-in ones still get redirected to
  // their dashboard below via Case 4.
  const isLanding = pathname === '/';

  // Case 2 — everything else (user area + admin area): no session →
  // send to login, remembering where they were headed. The landing
  // page is exempt so visitors can see the marketing site.
  if (!hasSession && !isLanding) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 2b — already logged in and hitting the landing page →
  // bounce to the dashboard instead of showing the marketing page.
  if (hasSession && isLanding) {
    const dest = role === 'admin' ? '/admin/dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Case 3 — logged in, but a non-admin hitting an admin route.
  if (isAdminArea && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Everything EXCEPT: Next internals, favicon, files with an
  // extension (images/fonts/etc.), and /api/* (must stay reachable —
  // /api/login is how you log in at all).
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)'],
};
