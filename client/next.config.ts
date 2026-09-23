import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com;
    font-src 'self';
    connect-src 'self' ws: wss:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
`;

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          }
        ],
      },
    ];
  },
  async rewrites() {
    const raw = (
      process.env.API_BASE_URL || 
      process.env.NEXT_PUBLIC_API_URL || 
      "http://127.0.0.1:3001"
    ).replace(/^["'\s]+|["'\s]+$/g, "");
    let backendUrl = raw.replace(/\/api\/v1\/?$/, "");
    if (!backendUrl.startsWith("http://") && !backendUrl.startsWith("https://")) {
      backendUrl = "https://" + backendUrl;
    }
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
