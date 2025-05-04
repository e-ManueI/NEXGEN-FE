import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
  }
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    /** Persisted on sign-in */
    id: string;
    role: string;
  }
}
