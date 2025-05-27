import useSWR from "swr";
import type { ApiResponse } from "@/app/_types/api-response";
import type { PredictionStatsDataResponse } from "@/app/_types/prediction";
import { API } from "@/lib/routes";

export function usePredictionStats(timeRange: string) {
  const { data, error, isLoading } = useSWR<
    ApiResponse<{ chartData: PredictionStatsDataResponse[]; timeRange: string }>
  >(API.analytics.predictionStats(timeRange), (url: string) =>
    fetch(url).then((res) => res.json()),
  );

  return {
    data: data?.data.chartData || [],
    timeRange: data?.data.timeRange ?? timeRange,
    isLoading,
    isError: error,
  };
}
