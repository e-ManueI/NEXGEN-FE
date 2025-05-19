import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // adjust path
import { Beaker } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NoContentProps {
  /** Main title displayed in the alert */
  title?: string;
  /** Supporting description text */
  description?: string;
  /** Icon to display alongside the text */
  icon?: React.ReactNode;
  /** Additional classes to apply to the Alert wrapper */
  alertClassName?: string;
  /** Optional wrapper div classes */
  className?: string;
  variant?: "default" | "destructive" | "warning" | "info" | "success";
}

export const AlertCard: React.FC<NoContentProps> = ({
  title = "No Content Available",
  description = "There is currently no content available for this section.",
  icon = <Beaker className="h-4 w-4" />,
  alertClassName = "",
  variant = "destructive",
  className,
}) => {
  return (
    <div className={cn("", className)}>
      <Alert
        variant={variant}
        className={cn(alertClassName, "flex items-start space-x-2 p-4")}
      >
        {icon}
        <div>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </div>
      </Alert>
    </div>
  );
};

export default AlertCard;
