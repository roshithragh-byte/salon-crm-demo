import { SignJWT, jwtVerify } from "jose";
import { AuthApi } from './api/services';
import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const CANONICAL_JWT_ISSUER = "pilotwave-salon-auth";
export const CANONICAL_JWT_AUDIENCE = "pilotwave-salon-api";
export const CANONICAL_JWT_ALGORITHM = "HS256";

/* Extend JWT types */
declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    salonId: string;
    salonSlug?: string;
    id: string;
  }
}

/* Extend Session types */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      salonId: string;
      salonSlug?: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@salondebea.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const { user } = await AuthApi.verifyCredentials(credentials as { email: string; password: string });
        return { ...user };
      }
    })
  ],
  callbacks: {
    async jwt(params: { token: any; user?: any }) {
      const { token, user } = params;
      if (user) {
        token.role = user.role;
        token.salonId = user.salonId;
        token.salonSlug = user.salonSlug;
        token.id = user.id;
      }
      return token;
    },
    async session(params: { session: any; token: any }) {
      const { session, token } = params;
      if (token) {
        session.user.role = token.role;
        session.user.salonId = token.salonId;
        session.user.salonSlug = token.salonSlug;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
  },
  jwt: {
    async encode({ secret, token, maxAge }) {
      if (!token) return "";
      const secretKey = new TextEncoder().encode(secret as string);
      return new SignJWT({ ...token })
        .setProtectedHeader({ alg: CANONICAL_JWT_ALGORITHM })
        .setIssuer(CANONICAL_JWT_ISSUER)
        .setAudience(CANONICAL_JWT_AUDIENCE)
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + (maxAge || 24 * 60 * 60))
        .sign(secretKey);
    },
    async decode({ secret, token }) {
      if (!token) return null;
      const secretKey = new TextEncoder().encode(secret as string);
      try {
        const { payload } = await jwtVerify(token, secretKey, {
          issuer: CANONICAL_JWT_ISSUER,
          audience: CANONICAL_JWT_AUDIENCE,
          algorithms: [CANONICAL_JWT_ALGORITHM],
        });
        return payload as any;
      } catch (err) {
        return null;
      }
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60,   // 1 hour
  },
  events: {
    async signIn() {},
    async signOut() {}
  },
  secret: process.env.NEXTAUTH_SECRET,
};
