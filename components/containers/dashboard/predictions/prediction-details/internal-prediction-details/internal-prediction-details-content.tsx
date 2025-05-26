import React, { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PredictionResultContent } from "@/app/_types/prediction";
import { UserType } from "@/app/_db/enum";

import OriginalResultTab from "./original-result-tab";
import EditedResultTab from "./edited-result-tab";
import ApprovedResultTab from "./approved-result-tab";
import { useApprovedPredictionDetails } from "@/app/hooks/useApprovedPredictionDetails";
import { Loader2 } from "lucide-react";

interface InternalContentProps {
  originalPredResults: PredictionResultContent;
  approvedPredResults: PredictionResultContent;
  userRole: UserType | undefined;
  predictionId: string;
}

interface EditedTabRef {
  isContentModified: boolean;
}

const InternalPredictionDetailsContent: React.FC<InternalContentProps> = ({
  originalPredResults,
  approvedPredResults: initialApproved,
  userRole,
  predictionId,
}) => {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState("original");
  const editedTabRef = useRef<EditedTabRef>(null);
  const [loadApprovedContent, setLoadApproved] = useState(false);

  const {
    data: freshApproved,
    isLoading: isLoadingApproved,
    isError: isErrorApproved,
  } = useApprovedPredictionDetails(loadApprovedContent ? predictionId : "");

  const approvedToShow = freshApproved
    ? {
        chloralkaliSummary: freshApproved.chloralkaliSummary || null,
        chloralkaliInDepth: freshApproved.chloralkaliInDepth || null,
        chloralkaliComparison: freshApproved.chloralkaliComparison || null,
        electrodialysisSummary: freshApproved.electrodialysisSummary || null,
        electrodialysisInDepth: freshApproved.electrodialysisInDepth || null,
      }
    : initialApproved;

  // intercept _before_ Radix tries to switch tabs
  const handleTriggerMouseDown = (
    e: React.MouseEvent<HTMLButtonElement>,
    newTab: string,
  ) => {
    if (
      activeTab === "edited" &&
      newTab !== "edited" &&
      editedTabRef.current?.isContentModified
    ) {
      const ok = window.confirm(
        "You have unsaved changes. Are you sure you want to switch tabs?",
      );
      if (!ok) {
        // prevent Radix from firing onValueChange at all
        e.preventDefault();
      }
    }
  };

  // now this will only ever fire once, after you've let the mousedown through
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 overflow-x-auto">
          <TabsTrigger
            value="original"
            onMouseDown={(e) => handleTriggerMouseDown(e, "original")}
          >
            Original Results
          </TabsTrigger>
          <TabsTrigger
            value="edited"
            onMouseDown={(e) => handleTriggerMouseDown(e, "edited")}
          >
            Edited Results
          </TabsTrigger>
          <TabsTrigger
            value="final"
            onMouseDown={(e) => handleTriggerMouseDown(e, "final")}
          >
            Final Approved Results
          </TabsTrigger>
        </TabsList>
        <TabsContent value="original" className="mt-4">
          <OriginalResultTab
            originalPredResults={originalPredResults}
            predictionId={predictionId}
            onEditSuccess={() => setActiveTab("edited")}
            onApproveSuccess={() => {
              setLoadApproved(true);
              setActiveTab("final");
            }}
          />
        </TabsContent>
        <TabsContent value="edited" className="mt-4">
          <EditedResultTab
            userRole={userRole}
            predictionId={predictionId}
            ref={editedTabRef}
          />
        </TabsContent>
        <TabsContent value="final" className="mt-4">
          {isLoadingApproved && !isErrorApproved ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ApprovedResultTab
              approvedPredResults={approvedToShow}
              isLoading={isLoadingApproved}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InternalPredictionDetailsContent;
