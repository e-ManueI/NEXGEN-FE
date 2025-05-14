"use client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { UserType } from "@/app/_db/enum";
import PermissionDeniedCard from "@/components/ui/permission-denied-card";
import WebLoader from "@/components/ui/web-loader";
import { AppRoutes } from "@/lib/routes";
import InternalPredictionDetails from "@/components/containers/dashboard/predictions/prediction-details/internal-prediction-details";
import { usePredictionDetails } from "@/app/hooks/internal/usePredictionDetails";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PredictionStatusBadge from "@/components/ui/prediction-status-badge";
import { formatTimestamp } from "@/lib/date-formatter";

export default function PredictionDetails() {
  const { id: predictionId } = useParams();
  const { data: session, status } = useSession();
  const { data, isLoading, isError } = usePredictionDetails(
    predictionId?.toString() || "",
  );
  const router = useRouter();

  if (status === "loading" || isLoading) {
    return <WebLoader />;
  }

  // 2. If there is no session *or* no user on the session
  if (!session?.user) {
    return (
      <PermissionDeniedCard message="You do not have access to this page. Please contact support if you believe this is a mistake." />
    );
  }
  const user = session?.user;
  if (isError) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {isError || "An unexpected error occurred."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            // if there’s a history entry, go back;
            // otherwise fall-back to dashboard (optional)
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
        <PredictionStatusBadge
          status={data?.prediction.predictionStatus ?? ""}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prediction ID: {predictionId}</CardTitle>
            {(user.role === UserType.ADMIN ||
              user.role === UserType.EXPERT) && (
              <Button variant="outline" className="flex items-center gap-2">
                <Edit2 className="h-4 w-4" />
                <span>Edit Results</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                Submission Details
              </h3>
              <dl className="grid grid-cols-2 gap-2">
                {/* <dt className="text-sm font-medium">User:</dt>
                <dd className="text-sm">BrineMasters Inc.</dd> */}

                <dt className="text-sm font-medium">Company:</dt>
                <dd className="text-sm">{data?.prediction.companyName}</dd>

                <dt className="text-sm font-medium">Submission Date:</dt>
                <dd className="text-sm">
                  {formatTimestamp(data?.prediction.submissionDate ?? "")
                    .formatted +
                    " " +
                    formatTimestamp(data?.prediction.submissionDate ?? "")
                      .fromNow}
                </dd>

                {/* <dt className="text-sm font-medium">Samples:</dt>
                <dd className="text-sm">3</dd> */}
              </dl>
            </div>

            <div>
              <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                Processing Status
              </h3>
              <dl className="grid grid-cols-2 gap-2">
                {/* <dt className="text-sm font-medium">Prediction Status:</dt>
                <dd className="text-sm">
                  <Badge variant="outline">Pending</Badge>
                </dd> */}

                <dt className="text-sm font-medium">Processed By:</dt>
                <dd className="text-sm">{data?.prediction.processedBy}</dd>

                <dt className="text-sm font-medium">Review Status:</dt>
                <dd className="text-sm"></dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {(user.role === UserType.ADMIN || user.role === UserType.EXPERT) && (
        <InternalPredictionDetails
          chloralkaliSummary={data?.chloralkaliSummary ?? null}
          chloralkaliInDepth={data?.chloralkaliInDepth ?? null}
          chloralkaliComparison={data?.chloralkaliComparison ?? null}
          electrodialysisSummary={data?.electrodialysisSummary ?? null}
          electrodialysisInDepth={data?.electrodialysisInDepth ?? null}
        />
      )}
    </div>
  );
}
