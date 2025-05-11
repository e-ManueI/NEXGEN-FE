"use client";
import {
  AnalyticsCardData,
  AnalyticsCards,
} from "@/components/ui/analytics-cards";
import UserTable from "@/components/containers/dashboard/users/user-table";
import { useEditUser, useUserAnalytics, useUsers } from "@/app/hooks/useUsers";
import WebLoader from "@/components/ui/web-loader";
import { UserInfo } from "@/app/_types/user-info";
import { manageUserAction } from "@/app/_actions/auth/delete-user-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/routes";

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
  const handleEdit = async (updated: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    newPassword?: string;
    role: string;
  }) => {
    try {
      await editUser(updated);
      toast.success("User updated successfully");
      refreshAll();
    } catch (err) {
      console.error(err);
      toast.error(editError ?? "Failed to update user");
    }
  };

  // handler for delete/activate lifted completely into the parent
  const handleUserAction = async (
    operation: "delete" | "activate",
    userId: string,
  ) => {
    const confirmMsg =
      operation === "delete"
        ? "Are you sure you want to delete this user?"
        : "Are you sure you want to activate this user?";

    if (!confirm(confirmMsg)) return;

    try {
      const result = await manageUserAction({ userId, operation });
      if (result.success) {
        toast.success(
          operation === "delete" ? "User deleted" : "User activated",
        );
        refreshAll();
      } else {
        toast.error(result.message ?? `Failed to ${operation} user`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${operation} user`);
    }
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
              onDelete={(id) => handleUserAction("delete", id)}
              onActivate={(id) => handleUserAction("activate", id)}
              onView={(id) => router.push(` ${AppRoutes.users}/${id}`)}
              onEdit={handleEdit}
              isEditing={isEditing}
            />
          </div>
        </div>
      </div>
    </>
  );
}
