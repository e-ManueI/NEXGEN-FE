import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    companyId: string;
  }
  interface Session {
    user: {
      id: string;
      role: string;
      companyId: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    /** Persisted on sign-in */
    id: string;
    role: string;
    companyId: string;
  }
}
