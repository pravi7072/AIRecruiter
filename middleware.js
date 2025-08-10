import { NextResponse } from "next/server";

const LOGIN_PATH = "/auth/signin";

function isProtectedPath(pathname) {
  // Allow /interview/:interview_id (e.g. /interview/abc123)
  if (/^\/interview\/[^\/]+\/?$/.test(pathname)) return false;

  // Allow public and system paths
  if (
    pathname.startsWith("/auth/signin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname === "/"
  ) {
    return false;
  }

  // All other routes are protected
  return true;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (isProtectedPath(pathname)) {
    // Check if user is logged in (example for next-auth cookies)
    const hasSession =
      request.cookies.get("next-auth.session-token") ||
      request.cookies.get("__Secure-next-auth.session-token");

    if (!hasSession) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Matcher to run middleware for appropriate routes, excluding auth, api, next internals, and interview/:id
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/signin|api|interview/[^/]+).*)",
  ],
};
