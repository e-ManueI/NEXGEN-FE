// components/PredictionStatusBadge.tsx

import React from "react";
import clsx from "clsx";
import { PredictionStatus } from "@/app/_db/enum";
import { Badge } from "./badge";

type StatusConfig = {
  label: string;
  className: string;
};

// map the exact values coming from your DB → UI config
const STATUS_MAP: Record<string, StatusConfig> = {
  [PredictionStatus.IN_PROGRESS]: {
    label: "In Progress",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200",
  },
  [PredictionStatus.DONE]: {
    label: "Done",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200",
  },
  // add more keys if you extend your DB enum...
};

type Props = {
  status?: string | null;
  className?: string;
};

const PredictionStatusBadge: React.FC<Props> = ({ status, className }) => {
  // pick config based on the raw string, fallback to “Unknown”
  const { label, className: statusClass } = STATUS_MAP[status ?? ""] ?? {
    label: "Unknown",
    className:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200",
  };

  return (
    <Badge className={clsx("ml-2", statusClass, className)}>{label}</Badge>
  );
};

export default PredictionStatusBadge;
