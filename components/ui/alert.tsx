import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid " +
    "has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] " +
    "has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 " +
    "[&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default:
          "bg-card text-card-foreground border-gray-200 dark:border-gray-700",
        destructive:
          "bg-card bg-red-50 dark:bg-red-900/20 text-destructive border-red-200 dark:border-red-900 [&>svg]:text-destructive",
        warning:
          "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900 dark:text-yellow-300 [&>svg]:text-yellow-500",
        info: "bg-blue-50 text-blue-500 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900 dark:text-blue-300 [&>svg]:text-blue-500",
        success:
          "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:border-green-900 dark:text-green-300 [&>svg]:text-green-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}
