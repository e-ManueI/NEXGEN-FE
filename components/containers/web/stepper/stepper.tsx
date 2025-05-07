"use client";

import type React from "react";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepperProps {
  steps: {
    title: string;
    content: React.ReactNode;
  }[];
  validateStep?: (stepIndex: number) => boolean;
  isStepValid?: (stepIndex: number) => boolean;
  onComplete?: () => void;
  logo?: React.ReactNode;
}

export function Stepper({
  steps,
  validateStep,
  isStepValid = () => true, // Default to true if not provided
  onComplete,
  logo,
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const hasValidator = !!validateStep;

  const handleNext = () => {
    // Perform validation on user click
    if (hasValidator && !validateStep(currentStep)) {
      return;
    }
    if (isLastStep) {
      setCompleted([...completed, currentStep]);
      onComplete?.();
      return;
    }
    setCompleted([...completed, currentStep]);
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (isFirstStep) return;
    setCurrentStep((prev) => prev - 1);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br bg-[url('/pattern-bg.svg')] from-blue-50/50 to-white bg-cover bg-no-repeat">
      {/* //TODO: ADD BACKGROUND */}
      {/* Header with logo */}
      <header className="container mx-auto px-4 py-6">
        <div className="text-brand-dark font-lato text-2xl font-bold">
          {logo || "NEXGEN"}
        </div>
      </header>

      <main className="container mx-auto flex flex-1 flex-col px-4 py-6">
        {/* Navigation and title */}
        <div className="mb-12 flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="border-brand/20 h-10 w-10 rounded-full border"
            onClick={handlePrevious}
            disabled={isFirstStep}
          >
            <ArrowLeft className="text-brand-dark h-4 w-4" />
            <span className="sr-only">Previous step</span>
          </Button>
          <h1 className="text-brand-dark font-lato text-2xl font-normal lg:text-3xl">
            {steps[currentStep].title}
          </h1>
          <div className="ml-auto">
            <Button
              variant="outline"
              size="icon"
              className={`h-10 w-10 rounded-full border ${
                !isStepValid(currentStep)
                  ? "border-brand/20"
                  : "border-brand/20"
              }`}
              onClick={handleNext}
              // Use isStepValid for disabling during render
              disabled={isLastStep && !isStepValid(currentStep)}
            >
              <ArrowRight
                className={`h-4 w-4 ${
                  !isStepValid(currentStep)
                    ? "text-brand/40"
                    : "text-brand-dark"
                }`}
              />
              <span className="sr-only">Next step</span>
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-blue-100">
          <div
            className="bg-brand h-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step content */}
        <div className="flex-1">{steps[currentStep].content}</div>

        {/* Footer with confirm/continue button */}
        {isLastStep ? (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleNext}
              className="bg-brand hover:bg-brand-dark"
              // Use isStepValid for disabling during render
              disabled={!isStepValid(currentStep)}
            >
              Confirm
            </Button>
          </div>
        ) : (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleNext}
              className="bg-brand hover:bg-brand-dark"
              // Use isStepValid for disabling during render
              disabled={!isStepValid(currentStep)}
            >
              Continue
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
