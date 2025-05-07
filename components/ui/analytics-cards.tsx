import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type AnalyticsCardData = {
  /** A short label, e.g. “Total Predictions” */
  description: string;
  /** The main numeric/stat value to display */
  value: string | number;
  /** direction of the trend badge */
  trend?: {
    /** "up" shows a green up arrow, "down" shows a red down arrow */
    direction: "up" | "down";
    /** e.g. "+12.5%", "-20%", or just "+24" */
    amount: string;
  };
  /** Footer text, e.g. “Trending up this month” */
  footerText?: string;
};

interface AnalyticsCardProps {
  data: AnalyticsCardData;
}

export function AnalyticsCard({ data }: AnalyticsCardProps) {
  const { description, value, trend, footerText } = data;
  const TrendIcon =
    trend?.direction === "up" ? IconTrendingUp : IconTrendingDown;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        {trend && (
          <CardAction>
            <Badge variant="outline">
              <TrendIcon />
              {trend.amount}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      {footerText && (
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {footerText} {trend && <TrendIcon className="size-4" />}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

interface AnalyticsCardsProps {
  /** Array of cards to render */
  data: AnalyticsCardData[];
}

/**
 * Renders a responsive grid of analytics cards.
 * Pass in as many or as few cards as you like via the `data` prop.
 */
export function AnalyticsCards({ data }: AnalyticsCardsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {data.map((card, idx) => (
        <AnalyticsCard key={idx} data={card} />
      ))}
    </div>
  );
}
