import { clerkMiddleware } from "@clerk/nextjs/server";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkEnabled = publishableKey && publishableKey !== "pk_test_placeholder" && publishableKey.startsWith("pk_");

const handler = isClerkEnabled ? clerkMiddleware() : null;

import { NextResponse } from "next/server";

export default function proxy(req: any, event: any) {
  // Hacker Prevention: Query Sanitization against SQL Injection & XSS attacks
  try {
    const url = new URL(req.url);
    const searchParamsStr = decodeURIComponent(url.search).toLowerCase();

    const maliciousPatterns = [
      "union select",
      "insert into",
      "drop table",
      "select * from",
      "sysdatabases",
      "xp_cmdshell",
      "<script",
      "javascript:",
      "onclick=",
      "onerror="
    ];

    const isMalicious = maliciousPatterns.some((pattern) => searchParamsStr.includes(pattern));
    if (isMalicious) {
      return new NextResponse("Security block: Malicious payload detected.", {
        status: 400,
      });
    }
  } catch (e) {
    // Fail-safe: continue if URL parsing fails
  }

  // ──────────────────────────────────────────────────────────────
  // Route Protection & Role Based Authentication Pipeline
  // ──────────────────────────────────────────────────────────────
  try {
    const url = new URL(req.url);
    const { pathname } = url;

    const protectedPaths = ["/projects", "/training", "/admin"];
    const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));

    if (isProtected) {
      const supabaseToken = req.cookies.get("healix_supabase_token")?.value;
      const isAuthenticated = !!supabaseToken;

      if (!isAuthenticated) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Redirect authenticated users away from the login page
    if (pathname === "/login") {
      const supabaseToken = req.cookies.get("healix_supabase_token")?.value;
      const isAuthenticated = !!supabaseToken;

      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/projects", req.url));
      }
    }
  } catch (e) {
    console.error("Auth proxy check failed:", e);
  }

  if (handler) {
    return handler(req, event);
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.[\\w]+$|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
