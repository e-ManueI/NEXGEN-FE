import { fetchPredictions } from "@/app/services/predictions";
import { useEffect, useState } from "react";
import { Prediction } from "../_types/prediction";

export function usePredictions(userId?: string) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPredictions(userId)
      .then(setPredictions)
      .catch((err) => {
        console.error(err);
        setError(err);
        setPredictions([]); // ← explicitly set empty on error
      })
      .finally(() => setLoading(false));
  }, [userId]);
  return { predictions, loading, error };
}
