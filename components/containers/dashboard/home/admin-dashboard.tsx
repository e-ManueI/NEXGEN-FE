import { AnalyticsCards } from "@/components/ui/analytics-cards";
import { ChartAreaInteractive } from "./chart-area-interactive";
import { DataTabs } from "./data-tabs";
import { usePredictions } from "@/app/hooks/usePredictions";
import { useUsers } from "@/app/hooks/admin/useUsers";
import WebLoader from "@/components/ui/web-loader";
import { usePredictionStats } from "@/app/hooks/admin/use-prediction-stats";
import { ChartTimeRangeEnum } from "@/app/_db/enum";
import React from "react";

export function AdminDashboard() {
  const {
    predictions,
    loading: pLoading,
    refresh: refreshP,
  } = usePredictions();
  const { users, loading: uLoading, refresh: refreshU } = useUsers();

  // Add timeRange state for chart
  const [timeRange, setTimeRange] = React.useState(
    ChartTimeRangeEnum.LAST_3MONTHS,
  );
  const { data: predictionStats, isLoading: statsLoading } =
    usePredictionStats(timeRange);

  const refreshAll = () => {
    refreshP();
    refreshU();
  };

  if (pLoading && uLoading) return <WebLoader />;

  const cards = [
    { description: "Total Predictions", value: predictions.length },
    {
      description: "Pending Predictions",
      value: predictions.filter((p) => p.status !== "done").length,
    },
    { description: "Total Users", value: users.length },
    {
      description: "Total Deactivated Users",
      value: users.filter((user) => !user.isActive).length,
    },
  ];
  return (
    <>
      <AnalyticsCards data={cards} />
      <ChartAreaInteractive
        data={predictionStats}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        isLoading={statsLoading}
      />
      <DataTabs
        predictions={predictions}
        users={users}
        loading={pLoading || uLoading}
        onRefreshAll={refreshAll}
      />
    </>
  );
}
