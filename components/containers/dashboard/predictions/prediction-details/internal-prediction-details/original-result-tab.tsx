import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useCallback, useMemo } from "react";
import { Beaker, CheckCircle2Icon, Edit2 } from "lucide-react";
import { PredictionResultContent } from "@/app/_types/prediction";
import { MarkdownTabsContent } from "@/components/ui/markdown-tabs-content";
import { AppConstants } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useCreateNewVersion } from "@/app/hooks/internal/useReviewedVersions";
import { toast } from "sonner";

type InternalOriginalResultTabProps = {
  originalPredResults: PredictionResultContent;
  predictionId: string;
  onEditSuccess: () => void;
  onApproveSuccess: () => void;
};

const InternalOriginalResultTab = ({
  originalPredResults: content,
  predictionId,
  onEditSuccess,
  onApproveSuccess,
}: InternalOriginalResultTabProps) => {
  const {
    createNewVersion,
    isCreating,
    error: createError,
  } = useCreateNewVersion(predictionId);

  // ────────
  // 1) TS‐safe mapping from nullable strings → required payload
  // ────────
  const payloadContent = useMemo(
    () => ({
      chloralkaliInDepth: content?.chloralkaliInDepth ?? "",
      chloralkaliSummary: content?.chloralkaliSummary ?? "",
      chloralkaliComparison: content?.chloralkaliComparison ?? "",
      electrodialysisInDepth: content?.electrodialysisInDepth ?? "",
      electrodialysisSummary: content?.electrodialysisSummary ?? "",
    }),
    [content],
  );

  // Handles
  const handleEdit = useCallback(async () => {
    try {
      await createNewVersion({
        content: payloadContent,
        modelVersion: AppConstants.modelVersion,
        approve: false,
      });
      toast.success("Edit saved successfully");
      onEditSuccess();
    } catch {
      console.error("Error creating new version:", createError);
      toast.error("Failed to create edit this version", {
        description: createError?.message,
      });
    }
  }, [createNewVersion, payloadContent, onEditSuccess, createError]);

  const handleEditAndApprove = useCallback(async () => {
    try {
      await createNewVersion({
        content: payloadContent,
        modelVersion: AppConstants.modelVersion,
        approve: true,
      });
      toast.success("Approval saved successfully");
      onApproveSuccess();
    } catch {
      console.error("Error creating new version:", createError);
      toast.error("Failed to approve version", {
        description: createError?.message,
      });
    }
  }, [createNewVersion, payloadContent, onApproveSuccess, createError]);

  return (
    <Card className="col-span-full flex flex-col md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-green-500" />
            Lithium Extraction Feasibility Model Results
          </CardTitle>
          <CardDescription>
            Analysis and predictions based on the input parameters
          </CardDescription>
        </div>
        <div className="flex gap-2 md:gap-4">
          {content &&
            Object.values(content).some((value) => value !== null) && (
              <>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleEdit}
                  disabled={isCreating}
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit Results</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleEditAndApprove}
                  disabled={isCreating}
                >
                  <CheckCircle2Icon className="h-4 w-4" />
                  <span>Approve</span>
                </Button>
              </>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chlr-comparison">
          <TabsList className="mb-4 w-full overflow-x-auto md:w-fit">
            {AppConstants.predictionSections.map((section) => (
              <TabsTrigger key={section.value} value={section.value}>
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {AppConstants.predictionSections.map((section) => (
            <MarkdownTabsContent
              key={section.value}
              value={section.value}
              content={content[section.key as keyof typeof content]}
            />
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InternalOriginalResultTab;
