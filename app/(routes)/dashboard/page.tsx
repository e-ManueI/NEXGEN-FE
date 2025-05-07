"use client";
import { useSession } from "next-auth/react";
import PermissionDeniedCard from "@/components/ui/permission-denied-card";
import { AdminDashboard } from "@/components/containers/dashboard/home/admin-dashboard";
import { ExpertDashboard } from "@/components/containers/dashboard/home/expert-dashboard";
import ClientDashboard from "@/components/containers/dashboard/home/client-dashboard";
import WebLoader from "@/components/ui/web-loader";

export default function DashboardHome() {
  const { data: session, status } = useSession();

  if (status === "loading") <WebLoader />;

  const role = session?.user.role;

  if (status === "unauthenticated") {
    return (
      <PermissionDeniedCard
        message="You do not have access to this page. If you believe this is a
          mistake, please contact support."
      />
    );
  }

  // Map role → component
  const roleComponents: Record<string, React.FC> = {
    admin: AdminDashboard,
    expert: ExpertDashboard,
    client: ClientDashboard,
  };

  const RoleComponent = role ? roleComponents[role] : undefined;

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            {RoleComponent ? <RoleComponent /> : null}
          </div>
        </div>
      </div>
    </>
  );
}
