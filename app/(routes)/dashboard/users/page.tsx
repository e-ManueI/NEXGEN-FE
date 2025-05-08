"use client";
import {
  AnalyticsCardData,
  AnalyticsCards,
} from "@/components/ui/analytics-cards";
import UserTable from "@/components/containers/dashboard/users/user-table";
import { useUserAnalytics, useUsers } from "@/hooks/useUsers";
import WebLoader from "@/components/ui/web-loader";
import { UserInfo } from "@/app/_types/user-info";

export default function UserHome() {
  const { analytics, loading: loadingA } = useUserAnalytics();
  const { users, loading: loadingU, error } = useUsers();

  console.log("Users are:", users);

  if (loadingA || loadingU) {
    return <WebLoader />;
  }

  if (error)
    return (
      <div className="alert-error">Failed to load users: {error.message}</div>
    );

  const userCards: AnalyticsCardData[] = [
    {
      description: "Total Users",
      value: analytics?.totalUsers || 0,
    },
    {
      description: "New Users",
      value: analytics?.newUsers || 0,
    },
    {
      description: "Active Users",
      value: analytics?.activeUsers || 0,
    },
    {
      description: "Deactivated Users",
      value: analytics?.inactiveUsers || 0,
    },
  ];

  const tableData: UserInfo[] = users.map((u) => ({
    id: u.id,
    name: u.name ?? "Unknown",
    email: u.email ?? "No email",
    companyName: u.companyName ?? "No company",
    role: u.role,
    isActive: u.isActive,
  }));

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <AnalyticsCards data={userCards} />
            <UserTable data={tableData} />
          </div>
        </div>
      </div>
    </>
  );
}
