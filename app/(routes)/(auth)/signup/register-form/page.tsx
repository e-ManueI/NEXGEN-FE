"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Mnda } from "./_components/one-mnda";
import { CompanyInfo } from "./_components/two-company-info";
import BrineLocationData from "./_components/three-brine-location/three_brine-uploader";
import { Stepper } from "@/components/shared/stepper/stepper";

export default function RegisterStepperForm() {
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Pure function to check if a step is valid without updating state
  const isStepValid = useCallback(
    (stepIndex: number) => {
      if (stepIndex === 0) {
        return isTermsChecked;
      }
      return true; // Other steps are valid by default
    },
    [isTermsChecked],
  );

  // Validation function for event handlers (updates state)
  const validateStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex === 0) {
        if (!isTermsChecked) {
          if (isMounted.current) {
            setErrorMessage("You must agree to the terms to proceed");
          }
          return false;
        }
        if (isMounted.current) {
          setErrorMessage("");
        }
        return true;
      }
      return true;
    },
    [isTermsChecked],
  );
  const steps = [
    {
      title: "Mutual Non Disclosure Agreement",
      content: (
        <Mnda
          isTermsChecked={isTermsChecked}
          setIsTermsChecked={setIsTermsChecked}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      ),
    },
    {
      title: "Tell us a bit about your company",
      content: <CompanyInfo />,
    },
    {
      title: "Your brine locations and data",
      content: <BrineLocationData />,
    },
  ];

  return (
    <Stepper
      steps={steps}
      validateStep={validateStep}
      isStepValid={isStepValid}
      onComplete={() => console.log("Form completed!")}
    />
  );
}
