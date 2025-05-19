"use client";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserType } from "@/app/_db/enum";
import PermissionDeniedCard from "@/components/ui/permission-denied-card";
import WebLoader from "@/components/ui/web-loader";
import { AppRoutes } from "@/lib/routes";
import InternalPredictionDetailsPage from "./internal-prediction-details-page";
import ClientPredictionDetailsPage from "./client-predictions-details-page";

export default function PredictionDetails() {
  const { id: predictionId } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <WebLoader />;
  }

  if (!session?.user) {
    return (
      <PermissionDeniedCard message="You do not have access to this page. Please contact support if you believe this is a mistake." />
    );
  }

  const user = session.user;

  // Define role-specific components
  const roleComponents: Record<string, React.FC<{ predictionId: string }>> = {
    [UserType.CLIENT]: ClientPredictionDetailsPage,
    [UserType.ADMIN]: InternalPredictionDetailsPage,
    [UserType.EXPERT]: InternalPredictionDetailsPage,
  };

  const RoleComponent = roleComponents[user.role];

  if (!RoleComponent) {
    return (
      <PermissionDeniedCard message="Your role does not have access to this page." />
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push(AppRoutes.dashboard);
            }
          }}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Prediction Details
        </h1>
      </div>
      <RoleComponent predictionId={predictionId?.toString() || ""} />
    </div>
  );
}
