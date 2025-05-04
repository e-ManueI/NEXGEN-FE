// TODO:
export function can(user: { roles: string[] } | null, action: string) {
  if (!user) return false;
  const rolePermissions: Record<string, string[]> = {
    superuser: ["manage-users", "view-reports" /*…*/],
    admin: ["view-reports"],
    viewer: ["view-reports-only"],
    // etc
  };
  return user.roles.some((r) => rolePermissions[r]?.includes(action));
}

export function requireRole(user: { roles: string[] } | null, action: string) {
  if (!can(user, action)) {
    class ForbiddenError extends Error {
      status: number;
      constructor(message: string) {
        super(message);
        this.name = "ForbiddenError";
        this.status = 403;
      }
    }

    const err = new ForbiddenError("Forbidden");
    throw err;
  }
}
