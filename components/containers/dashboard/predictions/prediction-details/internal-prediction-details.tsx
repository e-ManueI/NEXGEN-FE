import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Beaker } from "lucide-react";
import { PredictionResultContent } from "@/app/_types/prediction";
import RenderMarkdownRenderer from "@/components/ui/markdown-renderer";

type MarkdownTabsContentProps = {
  /** the TabsContent “value” prop */
  value: string;
  /** markdown string to render (falsy → show fallback) */
  content?: string | null;
  /** what to render if content is empty */
  fallback?: React.ReactNode;
};

const InternalPredictionDetails: React.FC<PredictionResultContent> = ({
  chloralkaliSummary,
  chloralkaliInDepth,
  chloralkaliComparison,
  electrodialysisSummary,
  electrodialysisInDepth,
}) => {
  return (
    <div>
      <Tabs defaultValue="original">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="original">Original Results</TabsTrigger>
          <TabsTrigger value="edited">Edited Results</TabsTrigger>
          <TabsTrigger value="final">Final Approved Results</TabsTrigger>
        </TabsList>
        <TabsContent value="original" className="mt-4">
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
              <Tabs defaultValue="chlr-summary">
                <TabsList className="mb-4">
                  <TabsTrigger value="chlr-summary">
                    Chlor-alkali Summary
                  </TabsTrigger>
                  <TabsTrigger value="chlr-depth">
                    Chlor-alkali In-Depth
                  </TabsTrigger>
                  <TabsTrigger value="chlr-comparison">
                    Chlor-alkali Comparison
                  </TabsTrigger>
                  <TabsTrigger value="electro-summary">
                    Electrodialysis Summary
                  </TabsTrigger>
                  <TabsTrigger value="electro-depth">
                    Electrodialysis In-Depth
                  </TabsTrigger>
                </TabsList>

                <MarkdownTabsContent
                  value="chlr-summary"
                  content={chloralkaliSummary}
                />

                <MarkdownTabsContent
                  value="chlr-depth"
                  content={chloralkaliInDepth}
                />

                <MarkdownTabsContent
                  value="chlr-comparison"
                  content={chloralkaliComparison}
                />

                <MarkdownTabsContent
                  value="electro-summary"
                  content={electrodialysisSummary}
                />

                <MarkdownTabsContent
                  value="electro-depth"
                  content={electrodialysisInDepth}
                />
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="edited" className="mt-4 rounded-md border p-4">
          <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20">
            <Beaker className="h-4 w-4 text-yellow-500" />
            <AlertTitle>No Edited Results</AlertTitle>
            <AlertDescription>
              There are currently no edited results available.
            </AlertDescription>
          </Alert>
        </TabsContent>
        <TabsContent value="final" className="mt-4 rounded-md border p-4">
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20">
            <Beaker className="h-4 w-4 text-blue-500" />
            <AlertTitle>No Approved Results</AlertTitle>
            <AlertDescription>
              There are currently no approved results available.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InternalPredictionDetails;

const MarkdownTabsContent: React.FC<MarkdownTabsContentProps> = ({
  value,
  content,
  fallback = (
    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20">
      <Beaker className="h-4 w-4 text-blue-500" />
      <AlertTitle>No Content Available</AlertTitle>
      <AlertDescription>
        There is currently no content available for this tab.
      </AlertDescription>
    </Alert>
  ),
}) => (
  <TabsContent value={value}>
    {content ? <RenderMarkdownRenderer content={content} /> : fallback}
  </TabsContent>
);
