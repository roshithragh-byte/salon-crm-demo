import { SignJWT, jwtVerify } from "jose";
import { AuthApi } from './api/services';
import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/* Extend JWT types */
declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    salonId: string;
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
    async jwt(params: any) {
      const { token, user } = params;
      if (user) {
        token.role = user.role;
        token.salonId = user.salonId;
        token.id = user.id;
      }
      return token;
    },
    async session(params: any) {
      const { session, token } = params;
      if (token) {
        session.user.role = token.role;
        session.user.salonId = token.salonId;
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
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,   // 24 hours
  },
  events: {
    async signIn() {},
    async signOut() {}
  },
  secret: process.env.NEXTAUTH_SECRET || "salondebea-auth-secret-change-in-production",
};
