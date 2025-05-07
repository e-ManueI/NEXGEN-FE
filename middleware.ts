// middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname, origin } = req.nextUrl;
  const session = req.auth; // truthy when user is signed in

  // 1. If a signed-in user tries to access the login page, redirect to dashboard
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  // 2. If a non-signed-in user tries to access any dashboard route, redirect to login
  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  // 3) Extra rule: /user/** only for admins
  if (pathname.startsWith("/dashboard/user")) {
    const role = session?.user?.role;
    if (role !== "admin") {
      // You can point to a custom 403 page, or just back to dashboard
      return NextResponse.redirect(new URL("/dashboard", origin));
    }
  }

  // Otherwise, continue to the requested route
  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/dashboard/user/:path*"],
};
