"use client";
import { ChartAreaInteractive } from "@/components/dashboard/home/chart-area-interactive";
import {
  AnalyticsCardData,
  AnalyticsCards,
} from "@/components/ui/analytics-cards";

import { DataTabs } from "@/components/dashboard/home/data-tabs";

const cards: AnalyticsCardData[] = [
  {
    description: "Total Predictions",
    value: "1.00",
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

export default function DashboardHome() {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <AnalyticsCards data={cards} />
            <ChartAreaInteractive />
            <DataTabs />
          </div>
        </div>
      </div>
    </>
  );
}
