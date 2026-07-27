import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("accessToken")?.value;
  const isAdmin = request.cookies.get("isAdmin")?.value;
  const { pathname } = request.nextUrl;

  // Protect user routes
  // if (pathname.startsWith("/dashboard") && !token) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // Protect admin routes
  // if (pathname.startsWith("/admin") && !isAdmin) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};