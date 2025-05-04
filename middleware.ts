// middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname, origin } = req.nextUrl;
  const session = req.auth; // truthy when user is signed in

  // If a signed-in user tries to access the login page, redirect to dashboard
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  // If a non-signed-in user tries to access any dashboard route, redirect to login
  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  // Otherwise, continue to the requested route
  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
