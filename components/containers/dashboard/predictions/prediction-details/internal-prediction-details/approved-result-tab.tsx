import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { Beaker, CircleCheckBigIcon, Loader2 } from "lucide-react";
import { PredictionResultContent } from "@/app/_types/prediction";
import { MarkdownTabsContent } from "@/components/ui/markdown-tabs-content";
import { AppConstants } from "@/lib/constants";

const ApprovedResultTab = ({
  isLoading = false,
  approvedPredResults: content,
}: {
  approvedPredResults: PredictionResultContent;
  isLoading?: boolean;
}) => {
  return (
    <Card className="col-span-full flex flex-col md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Beaker className="h-5 w-5 text-green-500" />
          Lithium Extraction Feasibility Model Results{" "}
          <CircleCheckBigIcon className="h-5 w-5 text-green-500" />
        </CardTitle>
        <CardDescription>
          Analysis and predictions based on the reviewed and approved results
        </CardDescription>
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

          {isLoading ? (
            <div className="mt-4 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            AppConstants.predictionSections.map((section) => (
              <MarkdownTabsContent
                key={section.value}
                value={section.value}
                content={content[section.key as keyof typeof content]}
              />
            ))
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApprovedResultTab;
