"use client";
import { ChartAreaInteractive } from "@/components/dashboard/home/chart-area-interactive";
import {
  AnalyticsCardData,
  AnalyticsCards,
} from "@/components/ui/analytics-cards";

import data from "./data.json";
import { DataTabs } from "@/components/shared/data-table/data-tabs";

const cards: AnalyticsCardData[] = [
  {
    description: "Total Predictions",
    value: "1,250.00",
    trend: { direction: "up", amount: "+12.5%" },
    footerText: "Trending up this month",
  },
  {
    description: "Total Users",
    value: 1234,
    trend: { direction: "down", amount: "-20%" },
    footerText: "Down 20% this period",
  },
  {
    description: "Active Users",
    value: 458,
    trend: { direction: "up", amount: "+12.5%" },
    footerText: "Strong user retention",
  },
  {
    description: "Pending Approvals",
    value: 24,
    trend: { direction: "up", amount: "+24" },
    footerText: "Pending approvals",
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
            <DataTabs data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
