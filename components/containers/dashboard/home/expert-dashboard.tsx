import { usePredictions } from "@/app/hooks/usePredictions";
import { AppRoutes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { PredictionTable } from "../predictions/predictions-table/prediction-table";
import AlertCard from "@/components/ui/alert-card";
export default function ExpertDashboard() {
  const router = useRouter();
  const {
    predictions,
    loading: pLoading,
    refresh: refreshP,
  } = usePredictions();

  // 3) While loading—or immediately after scheduling a redirect—show loader

  // Handle empty predictions state
  const hasPredictions = predictions && predictions.length > 0;

  return (
    <div>
      {!hasPredictions && !pLoading ? (
        <AlertCard variant="info" />
      ) : (
        <PredictionTable
          data={predictions}
          onView={(id: string) => {
            router.push(`${AppRoutes.predictionDetails(id)}`);
          }}
          loading={pLoading}
          onRefresh={refreshP}
        />
      )}
    </div>
  );
}
