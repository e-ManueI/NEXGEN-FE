import {
  AnalyticsCardData,
  AnalyticsCards,
} from "@/components/ui/analytics-cards";
import { ChartAreaInteractive } from "./chart-area-interactive";
import { DataTabs } from "./data-tabs";

const cards: AnalyticsCardData[] = [
  {
    description: "Total Predictions",
    value: 1,
  },
  {
    description: "Total Users",
    value: 2,
  },
  {
    description: "Active Users",
    value: 2,
  },
  {
    description: "Pending Prediction Reviews",
    value: 0,
  },
];

export function AdminDashboard() {
  return (
    <>
      {/* your existing admin cards, charts, tabs… */}
      <AnalyticsCards data={cards} />
      <ChartAreaInteractive />
      <DataTabs />
    </>
  );
}
