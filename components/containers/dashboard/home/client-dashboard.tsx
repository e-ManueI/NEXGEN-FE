import { useMndaCheck } from "@/app/hooks/client/useMnda";
import { usePredictions } from "@/app/hooks/usePredictions";
import WebLoader from "@/components/ui/web-loader";
import { signOut } from "@/lib/auth";
import { AppRoutes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { PredictionTable } from "../predictions/predictions-table/prediction-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrainCircuit, Lightbulb, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PredictionStatus } from "@/app/_db/enum";
import { useSession } from "next-auth/react";
export default function ClientDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const { hasAgreed, isLoading, isError } = useMndaCheck();
  const {
    predictions,
    loading: pLoading,
    refresh: refreshP,
  } = usePredictions();

  // 1) Redirect on error
  useEffect(() => {
    if (!isLoading && isError) {
      signOut({ redirectTo: AppRoutes.login });
      toast.error("Failed to load client dashboard");
    }
  }, [isLoading, isError, router]);

  // 2) Redirect if MNDA not agreed
  useEffect(() => {
    if (!isLoading && !isError && !hasAgreed) {
      toast.info("MNDA agreement required", {
        description:
          "Please agree to the MNDA before accessing the client dashboard.",
      });
      router.replace(AppRoutes.mnda);
    }
  }, [isLoading, isError, hasAgreed, router]);

  // 3) While loading—or immediately after scheduling a redirect—show loader
  if (isLoading || isError || !hasAgreed) {
    return <WebLoader />;
  }

  // Handle empty predictions state
  const hasPredictions = predictions && predictions.length > 0;

  return (
    <div>
      {!hasPredictions && !pLoading ? (
        ClientNoPredictions(router)
      ) : (
        <PredictionTable
          data={predictions}
          onView={(id: string) => {
            router.push(`${AppRoutes.predictionDetails(id)}`);
          }}
          loading={pLoading}
          userRole={session?.user.role}
          onRefresh={refreshP}
          canViewRow={(row) =>
            row.status === PredictionStatus.DONE && row.isApproved
          }
          omitColumns={["status"]}
          customColumnNames={{
            isApproved: "Prediction Status",
          }}
        />
      )}
    </div>
  );
}

function ClientNoPredictions(router: AppRouterInstance) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="relative w-full max-w-3xl overflow-hidden border-none">
        <Card className="border-none">
          <CardHeader className="pb-4 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#287AB8] to-[#1F5C8B] p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-black">
                <BrainCircuit className="h-10 w-10 animate-pulse text-[#287AB8] dark:text-[#287AB8]" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Welcome to NexGen AI
            </CardTitle>
            <CardDescription className="text-lg">
              Unlock the power of AI-driven predictions for your business
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8">
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center rounded-[var(--radius)] bg-white/50 p-4 text-center shadow-sm dark:bg-white/5">
                <div className="mb-2 rounded-full bg-[#287AB8]/10 p-2 dark:bg-[#287AB8]/20">
                  <Zap className="h-5 w-5 text-[#287AB8]" />
                </div>
                <h3 className="text-sm font-medium">Instant Insights</h3>
              </div>

              <div className="flex flex-col items-center rounded-[var(--radius)] bg-white/50 p-4 text-center shadow-sm dark:bg-white/5">
                <div className="mb-2 rounded-full bg-[#287AB8]/10 p-2 dark:bg-[#287AB8]/20">
                  <Lightbulb className="h-5 w-5 text-[#287AB8]" />
                </div>
                <h3 className="text-sm font-medium">Smart Predictions</h3>
              </div>

              <div className="flex flex-col items-center rounded-[var(--radius)] bg-white/50 p-4 text-center shadow-sm dark:bg-white/5">
                <div className="mb-2 rounded-full bg-[#287AB8]/10 p-2 dark:bg-[#287AB8]/20">
                  <svg
                    className="h-5 w-5 text-[#287AB8]"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 16V21M12 16L9 13M12 16L15 13M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-medium">Cloud Processing</h3>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-6 text-center text-sm">
                Ready to harness the power of AI for your basic brine
                feasibility analysis? Create your first prediction now.
              </p>
              <Button
                size="lg"
                onClick={() => router.push(AppRoutes.makePredictions)}
                className="relative overflow-hidden bg-[#287AB8] px-8 text-white transition-all hover:bg-[#1F5C8B]"
                style={{ borderRadius: "var(--radius)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Create Your First Prediction
                </span>
                <span className="absolute inset-0 -translate-y-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
