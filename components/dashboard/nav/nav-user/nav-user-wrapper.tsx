"use client";

import { useSession } from "next-auth/react";
import { NavUser } from "./nav-user";

export default function NavUserWrapper() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!session?.user) {
    // Not signed in: we could show a "Sign In" button instead or nothing
    return null;
  }

  // Map NextAuth's session.user to your NavUser props
  const user = {
    name: session.user.name || "",
    email: session.user.email || "",
    avatar: session.user.image || "",
  };

  return <NavUser user={user} />;
}
