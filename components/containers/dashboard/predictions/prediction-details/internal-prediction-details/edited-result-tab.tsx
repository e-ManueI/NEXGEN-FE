import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import TipTapEditor from "@/components/ui/tip-tap-editor";
import { AppConstants } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserType } from "@/app/_db/enum";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Beaker, CheckCircle2Icon, CircleCheck, Loader2 } from "lucide-react";
import {
  useApproveVersion,
  useCreateNewVersion,
  useReviewedVersionContent,
  useReviewedVersions,
} from "@/app/hooks/internal/useReviewedVersions";
import AlertCard from "@/components/ui/alert-card";
import { toast } from "sonner";

const EMPTY_CONTENT = {
  chloralkaliSummary: "",
  chloralkaliInDepth: "",
  chloralkaliComparison: "",
  electrodialysisSummary: "",
  electrodialysisInDepth: "",
};

type ContentType = typeof EMPTY_CONTENT;

interface EditedResultTabProps {
  userRole: UserType | undefined;
  predictionId: string;
}

const EditedResultTab = forwardRef(
  (
    { userRole, predictionId }: EditedResultTabProps,
    ref: React.Ref<{ isContentModified: boolean }>,
  ) => {
    const isAdminOrExpert =
      userRole === UserType.ADMIN || userRole === UserType.EXPERT;

    // 1. Track which version is selected
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
      null,
    );

    const [originalVersionContent, setOriginalVersionContent] =
      useState<ContentType>(EMPTY_CONTENT);
    const [editedContent, setEditedContent] =
      useState<ContentType>(EMPTY_CONTENT);
    const [isContentModified, setIsContentModified] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("chlr-comparison");

    // Initialize the useCreateNewVersion hook
    const {
      createNewVersion,
      isCreating,
      error: createVersionError,
    } = useCreateNewVersion(predictionId);

    // 2. Load list of versions
    // We only re-compute if the array itself changes
    const {
      data: versionsData,
      isLoading: loadingVersions,
      mutate: mutateVersions,
    } = useReviewedVersions(predictionId);

    // Initialize the approveReviewedVersion hook
    const {
      approveVersion,
      error: approveVersionError,
      isApproving,
    } = useApproveVersion();

    const versionsList = useMemo(
      () => versionsData?.versions ?? [],
      [versionsData?.versions],
    );

    // Expose isContentModified to the parent via the ref
    useImperativeHandle(
      ref,
      () => ({
        isContentModified,
      }),
      [isContentModified],
    );

    //3. Once we know what version exists, automatically select the first version
    useEffect(() => {
      if (versionsList.length > 0) {
        setSelectedVersionId(versionsList[0].id);
      }
    }, [versionsList]);

    // 4. Build dropdown options, appending a 5-chr ID snippet
    const versionOptions = versionsList.map((v, i) => ({
      value: v.id,
      label: `Version ${versionsList.length - i} (${v.id.slice(0, 5)})`,
      isApproved: v.isApproved,
    }));

    // 4.a) detect if any version is already approved
    const anyApprovedVersionExists = versionOptions.some((v) => v.isApproved);

    // 5. Load content for selected version
    const {
      data: versionContentData,
      isLoading: loadingContent,
      isError,
    } = useReviewedVersionContent(predictionId, selectedVersionId ?? "");

    // 6. Update original and edited content when version changes
    useEffect(() => {
      if (versionContentData) {
        const newContent = versionContentData?.content ?? EMPTY_CONTENT;
        setOriginalVersionContent(newContent);
        setEditedContent(newContent);
        setIsContentModified(false);
      }
    }, [versionContentData]);

    // 7. if there's ever an error fetching a selected version, revert the selection
    useEffect(() => {
      if (isError) {
        setSelectedVersionId(null);
        setOriginalVersionContent(EMPTY_CONTENT);
        setEditedContent(EMPTY_CONTENT);
        setIsContentModified(false);
        toast.error("Failed to fetch version content. Please try again.");
      }
    }, [isError]);

    // Handle content changes for any tab
    const handleContentChange = (
      sectionKey: keyof ContentType,
      newContent: string,
    ) => {
      setEditedContent((prev) => {
        const updated = {
          ...prev,
          [sectionKey]: newContent,
        };
        const isModified =
          JSON.stringify(updated) !== JSON.stringify(originalVersionContent);
        setIsContentModified(isModified);
        return updated;
      });
    };

    // Handle tab change
    const handleTabChange = (value: string) => {
      setActiveTab(value);
      const sectionKey = getSectionKeyFromTabValue(value);
      console.log(`Switched to section: ${sectionKey}`);
    };

    // Find the section key from the tab value
    const getSectionKeyFromTabValue = (tabValue: string): keyof ContentType => {
      const section = AppConstants.predictionSections.find(
        (s) => s.value === tabValue,
      );
      return section
        ? (section.key as keyof ContentType)
        : "chloralkaliComparison";
    };

    const handleSaveAll = async () => {
      try {
        const newVersion = await createNewVersion({
          content: editedContent,
          modelVersion: AppConstants.modelVersion,
          approve: false,
        });
        console.log("Saving draft:", editedContent);
        setOriginalVersionContent(editedContent);
        setIsContentModified(false);
        toast.success("All changes saved successfully");
        setSelectedVersionId(newVersion.id);
        mutateVersions();
      } catch (error) {
        console.error("Error saving and approving:", error);
        toast.error("Failed to save and approve", {
          description: createVersionError?.message,
        });
      }
    };

    const handleSaveAndApprove = async () => {
      console.log("Saving and approving:", editedContent);

      try {
        const newVersion = await createNewVersion({
          content: editedContent,
          modelVersion: AppConstants.modelVersion,
          approve: true,
        });
        setOriginalVersionContent(editedContent);
        setIsContentModified(false);
        toast.success("Changes saved and approved successfully");
        setSelectedVersionId(newVersion.id);
        mutateVersions();
      } catch (error) {
        console.error("Error saving and approving:", error);
        toast.error("Failed to save and approve", {
          description: createVersionError?.message,
        });
      }
    };

    const handleApproveVersion = async () => {
      console.log("Approving version:", editedContent);
      if (!selectedVersionId) {
        return;
      }

      console.log("Approving version with ID:", selectedVersionId);
      try {
        await approveVersion({
          approve: true,
          reviewedPredictionId: selectedVersionId,
        });
        toast.success("Version approved successfully");
        mutateVersions();
      } catch (error) {
        console.error("Error approving version:", error);
        toast.error("Failed to approve version", {
          description: approveVersionError?.message,
        });
      }
    };

    // Prompt user if they try to change versions with unsaved changes
    const handleVersionChange = (newVersionId: string) => {
      if (isContentModified) {
        const confirmChange = window.confirm(
          "You have unsaved changes that will be lost if you switch versions. Continue?",
        );

        if (!confirmChange) {
          return;
        }
      }
      setSelectedVersionId(newVersionId);
    };

    return (
      <>
        {versionsList.length > 0 ? (
          <Card className="col-span-full flex flex-col md:col-span-2 lg:col-span-3">
            <CardHeader className="mb-2 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Beaker className="h-5 w-5 text-green-500" />
                Lithium Extraction Feasibility Editor{" "}
                {isContentModified && (
                  <span className="text-sm text-amber-500">*</span>
                )}
              </CardTitle>
              <CardDescription>
                <div className="flex gap-2">
                  {isAdminOrExpert && (
                    <>
                      <Button
                        variant={"secondary"}
                        onClick={handleSaveAll}
                        size={"sm"}
                        disabled={!isContentModified || isCreating}
                      >
                        {isCreating ? "Saving..." : "Save Draft"}
                      </Button>
                      {!anyApprovedVersionExists && (
                        <Button
                          variant={"default"}
                          onClick={handleSaveAndApprove}
                          size={"sm"}
                          disabled={!isContentModified}
                        >
                          {isCreating ? "Saving..." : "Save and Approve"}
                        </Button>
                      )}
                      {!anyApprovedVersionExists && (
                        <Button
                          variant={"default"}
                          onClick={handleApproveVersion}
                          size={"sm"}
                          disabled={isApproving}
                        >
                          {isApproving ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Approving…</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2Icon className="h-4 w-4" />
                              <span>Approve</span>
                            </>
                          )}
                        </Button>
                      )}
                    </>
                  )}
                  <Select
                    value={selectedVersionId ?? ""}
                    onValueChange={handleVersionChange}
                  >
                    <SelectTrigger size={"sm"} className="w-fit">
                      <SelectValue placeholder="Select version" />
                    </SelectTrigger>
                    <SelectContent>
                      {versionOptions.map((version) => (
                        <SelectItem key={version?.value} value={version?.value}>
                          {version.label || `Version ${version.label}`}
                          <span>
                            {version.isApproved ? (
                              <CircleCheck className="h-4 w-4 text-green-500" />
                            ) : null}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="chlr-comparison"
                value={activeTab}
                onValueChange={handleTabChange}
              >
                <TabsList className="mb-4 w-full overflow-x-auto md:w-fit">
                  {AppConstants.predictionSections.map((section) => (
                    <TabsTrigger key={section.value} value={section.value}>
                      {section.label}
                      {editedContent[section.key as keyof ContentType] !==
                        originalVersionContent[
                          section.key as keyof ContentType
                        ] && <span className="ml-1 text-amber-500">*</span>}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {AppConstants.predictionSections.map((section) => (
                  <TabsContent
                    key={section.value}
                    value={section.value}
                    className="relative min-h-[200px] py-4"
                  >
                    {loadingContent || loadingVersions ? (
                      <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : editedContent ? (
                      <TipTapEditor
                        content={
                          editedContent[
                            section.key as keyof typeof editedContent
                          ]!
                        }
                        editable={
                          isAdminOrExpert ||
                          !loadingContent ||
                          !loadingVersions ||
                          !isError
                        }
                        onChange={(newContent) =>
                          handleContentChange(
                            section.key as keyof ContentType,
                            newContent,
                          )
                        }
                      />
                    ) : (
                      <AlertCard
                        variant="info"
                        title="No Draft Available"
                        description="There are currently no draft available."
                      />
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <>
            {loadingContent || loadingVersions ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <AlertCard
                variant="info"
                title="No Draft Available"
                description="There are currently no draft available."
              />
            )}
          </>
        )}
      </>
    );
  },
);

EditedResultTab.displayName = "EditedResultTab";
export default EditedResultTab;
