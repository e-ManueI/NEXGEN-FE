// components/UserRoleBadge.tsx
import React from "react";
import clsx from "clsx";
import { UserType } from "@/app/_db/enum";
import { Badge } from "./badge";

type RoleConfig = {
  label: string;
  className: string;
};

const ROLE_MAP: Record<UserType, RoleConfig> = {
  [UserType.ADMIN]: {
    label: "Administrator",
    className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200",
  },
  [UserType.EXPERT]: {
    label: "Expert",
    className:
      "bg-primary/10 text-primary dark:bg-blue-900/20 dark:text-blue-200",
  },
  [UserType.CLIENT]: {
    label: "Client",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200",
  },
};

interface UserRoleBadgeProps {
  role?: UserType | string | null;
  className?: string;
}

/**
 * Renders a colored badge for a given user role.
 * Falls back to "Unknown" if the role isn't recognized.
 */
const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role, className }) => {
  const config =
    typeof role === "string" && ROLE_MAP[role as UserType]
      ? ROLE_MAP[role as UserType]
      : {
          label: "Unknown",
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200",
        };

  return (
    <Badge className={clsx(config.className, className)}>{config.label}</Badge>
  );
};

export default UserRoleBadge;
