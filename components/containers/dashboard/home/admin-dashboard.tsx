import { AnalyticsCards } from "@/components/ui/analytics-cards";
import { ChartAreaInteractive } from "./chart-area-interactive";
import { DataTabs } from "./data-tabs";
import { usePredictions } from "@/app/hooks/usePredictions";
import { useUsers } from "@/app/hooks/useUsers";
import WebLoader from "@/components/ui/web-loader";

export function AdminDashboard() {
  const {
    predictions,
    loading: pLoading,
    refresh: refreshP,
  } = usePredictions();
  const { users, loading: uLoading, refresh: refreshU } = useUsers();

  const refreshAll = () => {
    refreshP();
    refreshU();
  };

  if (pLoading && uLoading) return <WebLoader />;

  const cards = [
    { description: "Total Predictions", value: predictions.length },
    {
      description: "Pending Reviews",
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
      <ChartAreaInteractive />
      <DataTabs
        predictions={predictions}
        users={users}
        onRefreshAll={refreshAll}
      />
    </>
  );
}
