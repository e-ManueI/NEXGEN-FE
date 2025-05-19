"use client";
import WebLoader from "@/components/ui/web-loader";
import PredictionDetailsHeaderCard from "@/components/containers/dashboard/predictions/prediction-details/prediction-details-header-card";
import { useReviewedPredictionDetails } from "@/app/hooks/client/useReviewedPredictionDetails";
import AlertCard from "@/components/ui/alert-card";
import ClientPredictionDetailsContent from "@/components/containers/dashboard/predictions/prediction-details/client-prediction-details-content";

function ClientPredictionDetailsPage({
  predictionId,
}: {
  predictionId: string;
}) {
  const { data, isLoading, isError } =
    useReviewedPredictionDetails(predictionId);

  if (isLoading) {
    return <WebLoader />;
  }

  if (isError) {
    return (
      <AlertCard
        title="Info"
        description="Prediction not found or still in progress."
        variant="info"
      />
    );
  }

  return (
    <>
      {data && (
        <PredictionDetailsHeaderCard data={data} showEditButton={false} />
      )}
      <ClientPredictionDetailsContent
        chloralkaliComparison={data?.chloralkaliComparison ?? null}
        chloralkaliSummary={data?.chloralkaliSummary ?? null}
        electrodialysisSummary={data?.electrodialysisSummary ?? null}
      />
    </>
  );
}

export default ClientPredictionDetailsPage;
