// middleware.ts
import { auth, signOut } from "@/lib/auth";
import { NextResponse } from "next/server";
import { UserType } from "./app/_db/enum";

export default auth(async (req) => {
  const { pathname, origin, search } = req.nextUrl;
  const session = req.auth; // The session object from next-auth

  // --- Helper Functions for Redirection ---
  const redirectToForbidden = () => {
    // Redirect to a dedicated 403 page for role-based access denial
    return NextResponse.redirect(new URL("/403", origin));
  };

  const redirectToLogin = (redirectPath?: string) => {
    // Redirect to login, optionally preserving the original path
    const loginUrl = new URL("/login", origin);
    if (redirectPath) {
      loginUrl.searchParams.set("redirect", encodeURIComponent(redirectPath));
    }
    return NextResponse.redirect(loginUrl);
  };

  const redirectToSessionInvalid = (message?: string) => {
    const invalidUrl = new URL("/login", origin);
    if (message) {
      invalidUrl.searchParams.set("message", encodeURIComponent(message));
    }
    signOut(); // Sign out the user to clear the session
    console.warn(
      `Middleware: Invalid session detected for user trying to access ${pathname}. Redirecting to login.`,
    );
    // Redirect to a session invalid page
    return NextResponse.redirect(invalidUrl);
  };
  // --- End Helper Functions ---

  // Rule 1: If a signed-in user tries to access the login page, redirect to dashboard
  if (pathname === "/login" && session) {
    if (session.user && session.user.role) {
      return NextResponse.redirect(new URL("/dashboard", origin));
    }
    // If no valid session, allow access to the /login page.
    // This prevents a loop where a user who is genuinely not logged in is redirected.
    return NextResponse.next();
  }

  // --- Centralized Session and Role Validation for Dashboard Routes ---
  // This block ensures that any access to '/dashboard' routes (except /login itself)
  // requires a fully valid and well-formed session with an identifiable role.
  if (pathname.startsWith("/dashboard")) {
    // Case A: No session at all (unauthenticated)
    if (!session) {
      const fullPath = pathname + search;
      return redirectToLogin(fullPath);
    }

    // Case B: Session exists, but is malformed (e.g., session.user or session.user.role is missing/null)
    // This explicitly addresses the "malformed session object" concern.
    const user = session.user;
    const userRole = user?.role; // Use optional chaining here, will be undefined if user or role is missing

    if (!user || !userRole) {
      // If the session object is truthy but user or role is undefined/null,
      // treat it as an invalid/compromised session and force a re-login.
      // You might also want to log this event for security monitoring.
      console.warn(
        `Middleware: Malformed session detected for user trying to access ${pathname}. Session data: ${JSON.stringify(session)}`,
      );
      return redirectToSessionInvalid(); // Redirect to login
    }

    // At this point, we are guaranteed that 'session', 'session.user', and 'session.user.role' exist.
    // We can confidently use 'userRole' for subsequent checks.
    const currentUserRole: UserType = userRole as UserType; // Cast after validation

    // Rule 2: /dashboard/user/** only for admins
    if (pathname.startsWith("/dashboard/user")) {
      if (currentUserRole !== UserType.ADMIN) {
        return redirectToForbidden();
      }
    }

    // Rule 3: /dashboard/doc-ingestion only for admins/experts
    if (pathname === "/dashboard/doc-ingestion") {
      const allowedDocIngestionRoles = [UserType.ADMIN, UserType.EXPERT];
      if (!allowedDocIngestionRoles.includes(currentUserRole)) {
        return redirectToForbidden();
      }
    }
  }

  // Otherwise, allow the request to continue to the requested route
  return NextResponse.next();
});

export const config = {
  // The matcher covers all paths that middleware needs to check.
  // "/dashboard/:path*" covers all dashboard sub-routes.
  matcher: ["/login", "/dashboard/:path*"],
};
