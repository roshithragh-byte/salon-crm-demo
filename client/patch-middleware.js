const fs = require('fs');
let code = fs.readFileSync('src/middleware.ts', 'utf8');

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

code = code.replace(/\{\s*jwt:[\s\S]*\}\s*\}\s*,\s*callbacks:[\s\S]*\}\s*,\s*secret:[\s\S]*\}\s*$/, replacement);
fs.writeFileSync('src/middleware.ts', code);
console.log("Patched middleware!");
