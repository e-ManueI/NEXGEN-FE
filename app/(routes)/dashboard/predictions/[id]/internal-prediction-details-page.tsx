"use client";
import { usePredictionDetails } from "@/app/hooks/internal/usePredictionDetails";
import WebLoader from "@/components/ui/web-loader";
import PredictionDetailsHeaderCard from "@/components/containers/dashboard/predictions/prediction-details/prediction-details-header-card";
import InternalPredictionDetailsContent from "@/components/containers/dashboard/predictions/prediction-details/internal-prediction-details-content";
import AlertCard from "@/components/ui/alert-card";

function InternalPredictionDetailsPage({
  predictionId,
}: {
  predictionId: string;
}) {
  const { data, isLoading, isError } = usePredictionDetails(predictionId);

  if (isLoading) {
    return <WebLoader />;
  }

  if (isError) {
    return (
      <AlertCard title="Error" description="An unexpected error occurred." />
    );
  }

  return (
    <>
      {data && (
        <PredictionDetailsHeaderCard data={data} showEditButton={true} />
      )}
      <InternalPredictionDetailsContent
        chloralkaliSummary={data?.chloralkaliSummary ?? null}
        chloralkaliInDepth={data?.chloralkaliInDepth ?? null}
        chloralkaliComparison={data?.chloralkaliComparison ?? null}
        electrodialysisSummary={data?.electrodialysisSummary ?? null}
        electrodialysisInDepth={data?.electrodialysisInDepth ?? null}
      />
    </>
  );
}

export default InternalPredictionDetailsPage;
