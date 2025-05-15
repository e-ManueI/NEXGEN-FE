// components/ActiveStatusBadge.tsx
import React from "react";
import clsx from "clsx";
import { Badge } from "./badge";

interface ActiveStatusBadgeProps {
  /** whether this status is active */
  isActive?: boolean;
  /** append extra classNames if needed */
  className?: string;
}

/**
 * A badge that renders "Active" or "Deactivated" with the correct color.
 */
const ActiveStatusBadge: React.FC<ActiveStatusBadgeProps> = ({
  isActive = false,
  className,
}) => {
  const bgClasses = isActive ? "bg-primary" : "bg-gray-500 hover:bg-gray-600";

  return (
    <Badge className={clsx(bgClasses, className)}>
      {isActive ? "Active" : "Deactivated"}
    </Badge>
  );
};

export default ActiveStatusBadge;
