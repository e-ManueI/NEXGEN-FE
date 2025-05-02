import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  completed: number[];
}

export function StepIndicator({
  steps,
  currentStep,
  completed,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isActive = currentStep === index;
        const isCompleted = completed.includes(index);

        return (
          <div key={index} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium",
                  isActive && "bg-brand border-brand text-white",
                  isCompleted && "border-brand bg-brand text-white",
                  !isActive && !isCompleted && "border-gray-300 text-gray-500",
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "mt-1 text-xs",
                  isActive && "text-brand font-medium",
                  isCompleted && "text-brand",
                  !isActive && !isCompleted && "text-gray-500",
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  index < currentStep ? "bg-brand" : "bg-gray-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
