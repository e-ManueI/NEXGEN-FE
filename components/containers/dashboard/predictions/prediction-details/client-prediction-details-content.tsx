import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Beaker } from "lucide-react";
import { ClientPredictionResultContent } from "@/app/_types/prediction";
import RenderMarkdownRenderer from "@/components/ui/markdown-renderer";
import AlertCard from "@/components/ui/alert-card";

type MarkdownTabsContentProps = {
  /** the TabsContent “value” prop */
  value: string;
  /** markdown string to render (falsy → show fallback) */
  content?: string | null;
  /** what to render if content is empty */
  fallback?: React.ReactNode;
};

const ClientPredictionDetailsContent: React.FC<
  ClientPredictionResultContent
> = ({ chloralkaliComparison, chloralkaliSummary, electrodialysisSummary }) => {
  return (
    <div>
      <Card className="col-span-full flex flex-col md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-green-500" />
            Lithium Extraction Feasibility Results
          </CardTitle>
          <CardDescription>
            Analysis and predictions based on the input parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chlr-comparison">
            <TabsList className="mb-4">
              <TabsTrigger value="chlr-comparison">
                Chlor-alkali Comparison
              </TabsTrigger>
              <TabsTrigger value="chlr-summary">
                Chlor-alkali Summary
              </TabsTrigger>
              <TabsTrigger value="electro-summary">
                Electrodialysis Summary
              </TabsTrigger>
            </TabsList>

            <MarkdownTabsContent
              value="chlr-comparison"
              content={chloralkaliComparison}
            />

            <MarkdownTabsContent
              value="chlr-summary"
              content={chloralkaliSummary}
            />

            <MarkdownTabsContent
              value="electro-summary"
              content={electrodialysisSummary}
            />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPredictionDetailsContent;

const MarkdownTabsContent: React.FC<MarkdownTabsContentProps> = ({
  value,
  content,
  fallback = (
    <AlertCard
      title="No Content Available"
      description="There is currently no content available for this tab."
    />
  ),
}) => (
  <TabsContent value={value}>
    {content ? <RenderMarkdownRenderer content={content} /> : fallback}
  </TabsContent>
);
