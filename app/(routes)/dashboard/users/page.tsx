"use client";
import {
  AnalyticsCardData,
  AnalyticsCards,
} from "@/components/ui/analytics-cards";
import UserTable, { User } from "@/components/dashboard/users/user-table";

export default function UserHome() {
  const sampleData: User[] = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      companyName: "Acme Corp",
      role: "Admin",
      isActive: "Yes",
    },
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      companyName: "Acme Corp",
      role: "Admin",
      isActive: "Yes",
    },
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      companyName: "Acme Corp",
      role: "Admin",
      isActive: "Yes",
    },
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      companyName: "Acme Corp",
      role: "Admin",
      isActive: "Yes",
    },
    // …more users
  ];

  const userCards: AnalyticsCardData[] = [
    {
      description: "Total Users",
      value: "1,250.00",
      trend: { direction: "up", amount: "+12.5%" },
      footerText: "Trending up this month",
    },
    {
      description: "New Users",
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
      description: "Deactivated Users",
      value: 24,
      trend: { direction: "up", amount: "+24" },
      footerText: "Pending activations",
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <AnalyticsCards data={userCards} />
            <UserTable data={sampleData} />
          </div>
        </div>
      </div>
    </>
  );
}
