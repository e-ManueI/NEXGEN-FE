"use client";
import {
  AnalyticsCardData,
  AnalyticsCards,
} from "@/components/ui/analytics-cards";
import UserTable from "@/components/containers/dashboard/users/user-table";
import { useEditUser, useUserAnalytics, useUsers } from "@/app/hooks/useUsers";
import WebLoader from "@/components/ui/web-loader";
import { UserInfo } from "@/app/_types/user-info";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/routes";
import { handleUserMgtAction } from "@/app/_actions/manage-user-action";
import { handleUserEdit } from "@/app/_actions/edit-user-action";

export default function UserHome() {
  const {
    analytics,
    loading: loadingA,
    refresh: refreshAnalytics,
  } = useUserAnalytics();
  const { users, loading: loadingU, error, refresh: refreshUsers } = useUsers();
  const { editUser, isEditing, editError } = useEditUser();
  const router = useRouter();

  const refreshAll = () => {
    refreshUsers();
    refreshAnalytics();
  };

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
            <UserTable
              data={tableData}
              onDelete={(id) => handleUserMgtAction("delete", id, refreshAll)}
              onActivate={(id) =>
                handleUserMgtAction("activate", id, refreshAll)
              }
              onView={(id) => router.push(` ${AppRoutes.users}/${id}`)}
              onEdit={(updated) =>
                handleUserEdit(updated, editUser, refreshAll, editError)
              }
              isEditing={isEditing}
            />
          </div>
        </div>
      </div>
    </>
  );
}
