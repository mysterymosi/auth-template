import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase";
import { COOKIE_KEYS } from "@/lib/cookies";
import { ROUTES, PUBLIC_ROUTES } from "@/lib/constants";

export async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get(COOKIE_KEYS.SESSION)?.value;

  // Public routes that don't require authentication
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If accessing a public route and already authenticated, redirect to dashboard
  if (isPublicRoute && sessionToken) {
    try {
      await adminAuth.verifyIdToken(sessionToken);
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    } catch (error) {
      console.error(error);
    }
  }

  // Protected routes require authentication
  if (!isPublicRoute) {
    if (!sessionToken) {
      // No session token, redirect to login
      const loginUrl = new URL(ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify the session token
      await adminAuth.verifyIdToken(sessionToken);
      // Token is valid, allow access
      return NextResponse.next();
    } catch {
      // Invalid or expired token, redirect to login
      const loginUrl = new URL(ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clear invalid cookie
      response.cookies.delete(COOKIE_KEYS.SESSION);
      return response;
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
