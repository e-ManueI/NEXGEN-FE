"use client";
import LithiumDashboard from "@/components/dashboard/make-predictions/lithium-predictor-dashboard";
import React from "react";

const MakePredictions = () => {
  return (
    <div className="">
      <h1 className="mb-6 text-2xl font-bold">
        Lithium Extraction Feasibility Analysis
      </h1>
      <LithiumDashboard />
    </div>
  );
};

export default MakePredictions;
