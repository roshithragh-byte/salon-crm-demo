import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
    const isLoginPath = req.nextUrl.pathname === "/admin/login";

    const isAccountPath = req.nextUrl.pathname.startsWith("/account");

    if (req.nextUrl.pathname.startsWith("/api/v1")) {
      // Force production URL directly!
      let finalRaw = process.env.NODE_ENV === 'production' 
        ? 'https://salon-crm-demo-production.up.railway.app/api/v1' 
        : (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || `http://127.0.0.1:${process.env.API_PORT || 3001}/api/v1`);
        
      finalRaw = finalRaw.replace(/^["'\s]+|["'\s]+$/g, "");
      let backendUrl = finalRaw.replace(/\/api\/v1\/?$/, "");
      if (!backendUrl.startsWith("http://") && !backendUrl.startsWith("https://")) {
        backendUrl = "https://" + backendUrl;
      }
      const targetUrl = new URL(req.nextUrl.pathname, backendUrl);
      targetUrl.search = req.nextUrl.search;
      return NextResponse.rewrite(targetUrl);
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
    if (isAdminPath && role !== "ADMIN" && role !== "OWNER") {
      return NextResponse.redirect(new URL("/account", req.url));
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
          const { payload } = await jwtVerify(token, secretKey);
          return payload as any;
        } catch (e) {
          console.error("JWT VERIFY ERROR", e);
          return null;
        }
      }
    },
    callbacks: {
      authorized: () => true,
    },
    secret: process.env.NEXTAUTH_SECRET || "salondebea-auth-secret-change-in-production"
  }
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/api/v1/:path*"],
};
