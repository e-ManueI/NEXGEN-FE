"use client";
import { usePredictionDetails } from "@/app/hooks/internal/usePredictionDetails";
import WebLoader from "@/components/ui/web-loader";
import PredictionDetailsHeaderCard from "@/components/containers/dashboard/predictions/prediction-details/prediction-details-header-card";
import InternalPredictionDetailsContent from "@/components/containers/dashboard/predictions/prediction-details/internal-prediction-details/internal-prediction-details-content";
import AlertCard from "@/components/ui/alert-card";
import { useSession } from "next-auth/react";
import { UserType } from "@/app/_db/enum";
import PermissionDeniedCard from "@/components/ui/permission-denied-card";
import { useApprovedPredictionDetails } from "@/app/hooks/useApprovedPredictionDetails";

// TODO: SHIFT INTO USING ZUSTAND FOR STATE MANAGEMENT ESPECIALLY IN THIS WIDGET
function InternalPredictionDetailsPage({
  predictionId,
}: {
  predictionId: string;
}) {
  const {
    data: originalData,
    isLoading,
    isError: isOriginalPredError,
  } = usePredictionDetails(predictionId);
  const {
    data: approvedData,
    isLoading: isLoadingApproved,
    isError: isApprovedPredError,
  } = useApprovedPredictionDetails(predictionId);
  const { data: session, status } = useSession();

  let userRole;

  if (isLoading || status === "loading") {
    return <WebLoader />;
  }

  if (status === "authenticated") {
    userRole =
      session?.user?.role === UserType.ADMIN
        ? UserType.ADMIN
        : session?.user?.role === UserType.EXPERT
          ? UserType.EXPERT
          : undefined;

    if (userRole === UserType.CLIENT) {
      return <PermissionDeniedCard />;
    }
  }

  if (
    (isOriginalPredError || isApprovedPredError) &&
    (!isLoadingApproved || !isLoading)
  ) {
    return (
      <AlertCard title="Error" description="An unexpected error occurred." />
    );
  }

  return (
    <>
      {originalData?.prediction && (
        <PredictionDetailsHeaderCard data={originalData} />
      )}
      <InternalPredictionDetailsContent
        originalPredResults={{
          chloralkaliSummary: originalData?.chloralkaliSummary ?? null,
          chloralkaliInDepth: originalData?.chloralkaliInDepth ?? null,
          chloralkaliComparison: originalData?.chloralkaliComparison ?? null,
          electrodialysisSummary: originalData?.electrodialysisSummary ?? null,
          electrodialysisInDepth: originalData?.electrodialysisInDepth ?? null,
        }}
        approvedPredResults={{
          chloralkaliSummary: approvedData?.chloralkaliSummary ?? null,
          chloralkaliInDepth: approvedData?.chloralkaliInDepth ?? null,
          chloralkaliComparison: approvedData?.chloralkaliComparison ?? null,
          electrodialysisSummary: approvedData?.electrodialysisSummary ?? null,
          electrodialysisInDepth: approvedData?.electrodialysisInDepth ?? null,
        }}
        userRole={userRole}
        predictionId={predictionId}
      />
    </>
  );
}

export default InternalPredictionDetailsPage;
