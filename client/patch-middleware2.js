const fs = require('fs');
let code = fs.readFileSync('src/middleware.ts', 'utf8');

const prefix = code.substring(0, code.indexOf('{', code.indexOf('async function middleware')));
const middlewareFunc = code.substring(code.indexOf('async function middleware'), code.indexOf('},', code.indexOf('return null;')) + 2);

const replacement = `
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
          return null;
        }
      }
    },
    callbacks: {
      authorized: () => true,
    },
    secret: process.env.NEXTAUTH_SECRET || "salondebea-auth-secret-change-in-production"
  }
`;

const suffix = `
);

export const config = {
  matcher: ["/admin/:path*"],
};
`;

fs.writeFileSync('src/middleware.ts', prefix + middlewareFunc + replacement + suffix);
console.log("Patched middleware correctly!");
