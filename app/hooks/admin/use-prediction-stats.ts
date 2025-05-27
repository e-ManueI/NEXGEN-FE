import useSWR from "swr";
import type { ApiResponse } from "@/app/_types/api-response";
import type { PredictionStatsDataResponse } from "@/app/_types/prediction";

export function usePredictionStats(timeRange: string) {
  const { data, error, isLoading } = useSWR<
    ApiResponse<{ chartData: PredictionStatsDataResponse[]; timeRange: string }>
  >(
    `/api/admin/analytics/prediction-stats?timeRange=${timeRange}`,
    (url: string) => fetch(url).then((res) => res.json()),
  );

  return {
    data: data?.data.chartData || [],
    timeRange: data?.data.timeRange ?? timeRange,
    isLoading,
    isError: error,
  };
}
