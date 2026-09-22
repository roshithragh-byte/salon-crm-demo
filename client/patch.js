const fs = require('fs');
let code = fs.readFileSync('src/lib/auth.ts', 'utf8');

const importJose = `import { SignJWT, jwtVerify } from "jose";\n`;

const jwtOverrides = `
  jwt: {
    async encode({ secret, token, maxAge }) {
      if (!token) return "";
      const secretKey = new TextEncoder().encode(secret as string);
      return new SignJWT(token as any)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + (maxAge || 30 * 24 * 60 * 60))
        .sign(secretKey);
    },
    async decode({ secret, token }) {
      if (!token) return null;
      const secretKey = new TextEncoder().encode(secret as string);
      try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload as any;
      } catch (err) {
        return null;
      }
    }
  },`;

if (!code.includes('import { SignJWT')) {
  code = importJose + code;
}

if (!code.includes('jwt: {')) {
  code = code.replace(/session: {/, jwtOverrides + '\n  session: {');
  fs.writeFileSync('src/lib/auth.ts', code);
  console.log("Patched auth.ts!");
} else {
  console.log("Already patched.");
}
