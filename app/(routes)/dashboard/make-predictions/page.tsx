"use client";
import LithiumDashboard from "@/components/dashboard/lithium-predictor/lithium-predictor-dashboard";
import React from "react";

const MakePredictions = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <h1 className="text-2xl font-bold">
            Lithium Extraction Feasibility Analysis
          </h1>
          <LithiumDashboard />
        </div>
      </div>
    </div>
  );
};

export default MakePredictions;
