"use client";

import { useSession } from "next-auth/react";
import WebLoader from "@/components/ui/web-loader";
import PermissionDeniedCard from "@/components/ui/permission-denied-card";
import ClientPredictionPlayground from "@/components/containers/dashboard/prediction-playground/client-prediction-playground";
import InternalPredictionPlayground from "@/components/containers/dashboard/prediction-playground/internal-prediction-playground";

export default function MakePredictions() {
  const { data: session, status } = useSession();

  // 1) still loading?
  if (status === "loading") {
    return <WebLoader />;
  }

  // 2) not signed in?
  if (!session) {
    return (
      <PermissionDeniedCard message="You must be signed in to access this page." />
    );
  }

  const role = session.user.role; // 'admin' | 'expert' | 'client' | etc.

  // 3) route by role
  if (role === "admin" || role === "expert") {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <h1 className="text-2xl font-bold">
              Lithium Extraction Feasibility Analysis
            </h1>
            <InternalPredictionPlayground />
          </div>
        </div>
      </div>
    );
  } else if (role === "client") {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <h1 className="text-2xl font-bold">Your Prediction Portal</h1>
            <ClientPredictionPlayground />
          </div>
        </div>
      </div>
    );
  }

  // 4) any other role
  return (
    <PermissionDeniedCard message="You don't have permission to access the prediction tools." />
  );
}
