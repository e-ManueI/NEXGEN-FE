"use client";
import {
  AnalyticsCardData,
  AnalyticsCards,
} from "@/components/ui/analytics-cards";
import UserTable, {
  User,
} from "@/components/containers/dashboard/users/user-table";

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
    // …more users
  ];

  const userCards: AnalyticsCardData[] = [
    {
      description: "Total Users",
      value: 1,
    },
    {
      description: "New Users",
      value: 1,
    },
    {
      description: "Active Users",
      value: 1,
    },
    {
      description: "Deactivated Users",
      value: 0,
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
