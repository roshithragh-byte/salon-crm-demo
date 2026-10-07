import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getEffectiveBackendUrl } from "./lib/api/client";
import { CANONICAL_JWT_ISSUER, CANONICAL_JWT_AUDIENCE, CANONICAL_JWT_ALGORITHM } from "./lib/auth";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
    const isLoginPath = req.nextUrl.pathname === "/admin/login";

    const isAccountPath = req.nextUrl.pathname.startsWith("/account");

    if (req.nextUrl.pathname.startsWith("/api/v1")) {
      const apiUrl = getEffectiveBackendUrl();
      const backendUrl = apiUrl.replace(/\/api\/v1\/?$/, "");
      const targetUrl = new URL(req.nextUrl.pathname, backendUrl);
      targetUrl.search = req.nextUrl.search;

      const requestHeaders = new Headers(req.headers);
      const cookieName = process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
      const tokenString = req.cookies.get(cookieName)?.value;
      if (tokenString && !requestHeaders.has('Authorization')) {
        requestHeaders.set('Authorization', `Bearer ${tokenString}`);
      }

      return NextResponse.rewrite(targetUrl, {
        request: {
          headers: requestHeaders,
        }
      });
    }

    if (isLoginPath) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return null;
    }

    if ((isAdminPath || isAccountPath) && !isAuth) {
      const from = req.nextUrl.pathname;
      return NextResponse.redirect(new URL(`/admin/login?from=${encodeURIComponent(from)}`, req.url));
    }

    const role = token?.role?.toString().toUpperCase();
    if (isAdminPath) {
      if (role === "STAFF") {
        const allowedForStaff = req.nextUrl.pathname.startsWith("/admin/dashboard") || 
                                req.nextUrl.pathname.startsWith("/admin/bookings");
        if (!allowedForStaff) {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
      } else if (role !== "ADMIN" && role !== "OWNER") {
        return NextResponse.redirect(new URL("/account", req.url));
      }
    }

    return null;
  },
  {
    jwt: {
      async decode({ secret, token }) {
        if (!token) return null;
        try {
          const { jwtVerify } = await import("jose");
          const secretKey = new TextEncoder().encode(secret as string);
          const { payload } = await jwtVerify(token, secretKey, {
            issuer: CANONICAL_JWT_ISSUER,
            audience: CANONICAL_JWT_AUDIENCE,
            algorithms: [CANONICAL_JWT_ALGORITHM],
          });
          return payload as any;
        } catch (e) {
          return null;
        }
      }
    },
    callbacks: {
      authorized: () => true,
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/api/v1/:path*"],
};
