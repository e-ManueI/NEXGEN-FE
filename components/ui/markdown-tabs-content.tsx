import { TabsContent } from "@radix-ui/react-tabs";
import RenderMarkdownRenderer from "./markdown-renderer";
import AlertCard from "./alert-card";

type MarkdownTabsContentProps = {
  /** the TabsContent “value” prop */
  value: string;
  /** markdown string to render (falsy → show fallback) */
  content?: string | null;
  /** what to render if content is empty */
  fallback?: React.ReactNode;
};

export const MarkdownTabsContent: React.FC<MarkdownTabsContentProps> = ({
  value,
  content,
  fallback = (
    <AlertCard
      title="No Content Available"
      description="There is currently no content available for this tab."
      variant="info"
    />
  ),
}) => (
  <TabsContent value={value}>
    {content ? <RenderMarkdownRenderer content={content} /> : fallback}
  </TabsContent>
);
