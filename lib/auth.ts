import { db } from "@/app/_db";
import { user } from "@/app/_db/schema";
import { eq } from "drizzle-orm";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      authorize: async ({ email, password }) => {
        const credentials = {
          email: email as string,
          password: password as string,
        };

        if (!credentials) {
          console.warn("Missing credentials");
          return null;
        }

        try {
          // 1. fetch the user by email
          const [u] = await db
            .select()
            .from(user)
            .where(eq(user.email, credentials.email))
            .limit(1);

          if (!u) return null;

          // 2. Check if user is active
          if (!u.isActive) {
            console.warn("User is not active");
            return null;
          }

          // 3. Compare hashed password
          const isValid = u.password
            ? await compare(credentials.password, u.password)
            : false;
          if (!isValid) {
            console.warn("Invalid password");
            return null;
          }

          console.log("User signed in:", u);

          // 4. Return a valid User object
          return {
            id: u.id,
            email: u.email!,
            name: u.name,
            role: u.role,
            companyId: u.companyId,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // only allow through if there _is_ an auth.user
    async authorized({ auth }) {
      return Boolean(auth?.user);
    },
    // add `id` into the JWT on sign in
    async jwt({ token, user }) {
      if (user) {
        if (!user.id) {
          throw new Error("User ID is undefined");
        }
        token.id = user.id;
        token.role = user.role;
        token.companyId = user.companyId;
      }
      return token;
    },
    // expose `id` and `role` on the session client-side
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.companyId = token.companyId as string;
      }
      return session;
    },
    // Update lastLogin timestamp on successful sign-in
    async signIn({ user: signedInUser }) {
      if (signedInUser) {
        await db
          .update(user)
          .set({ lastLogin: new Date() })
          .where(eq(user.id, signedInUser.id!));
      }
      return true;
    },
  },
});
