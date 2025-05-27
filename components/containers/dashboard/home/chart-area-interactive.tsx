"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/components/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartTimeRangeEnum } from "@/app/_db/enum";

export const description = "An interactive area chart";

const chartConfig = {
  visitors: {
    label: "Predictions",
  },
  predictions: {
    label: "Predictions",
    color: "var(--chart-1)",
  },
  reviewedPredictions: {
    label: "Reviewed Predictions",
    color: "var(--chart-2)",
  },
  approvedReviewedPredictions: {
    label: "Approved Reviewed",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({
  data,
  timeRange,
  setTimeRange,
  isLoading,
}: {
  data: {
    date: string;
    predictions: number;
    reviewedPredictions: number;
    approvedReviewedPredictions: number;
  }[];
  timeRange: string;
  setTimeRange: (val: string) => void;
  isLoading?: boolean;
}) {
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange(ChartTimeRangeEnum.LAST_7DAYS);
    }
  }, [isMobile, setTimeRange]);

  // Use the passed-in data directly
  const chartData = data.map((item) => ({
    date: item.date,
    predictions: item.predictions,
    reviewedPredictions: item.reviewedPredictions,
    approvedReviewedPredictions: item.approvedReviewedPredictions,
  }));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Predictions</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Get quick insights into the total number of predictions made
          </span>
          <span className="@[540px]/card:hidden">
            Get quick insights into the total number of predictions made
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem
              value={ChartTimeRangeEnum.LAST_3MONTHS}
              disabled={isLoading}
            >
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem
              value={ChartTimeRangeEnum.LAST_30DAYS}
              disabled={isLoading}
            >
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem
              value={ChartTimeRangeEnum.LAST_7DAYS}
              disabled={isLoading}
            >
              Last 7 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem
                value={ChartTimeRangeEnum.LAST_3MONTHS}
                className="rounded-lg"
                disabled={isLoading}
              >
                Last 3 months
              </SelectItem>
              <SelectItem
                value={ChartTimeRangeEnum.LAST_30DAYS}
                className="rounded-lg"
                disabled={isLoading}
              >
                Last 30 days
              </SelectItem>
              <SelectItem
                value={ChartTimeRangeEnum.LAST_7DAYS}
                className="rounded-lg"
                disabled={isLoading}
              >
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillPredictions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillReviewedPredictions"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillApprovedReviewedPredictions"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--chart-4)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-4)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="predictions"
              type="natural"
              fill="url(#fillPredictions)"
              stroke="var(--chart-1)"
              stackId="a"
            />
            <Area
              dataKey="reviewedPredictions"
              type="natural"
              fill="url(#fillReviewedPredictions)"
              stroke="var(--chart-2)"
              stackId="b"
            />
            <Area
              dataKey="approvedReviewedPredictions"
              type="natural"
              fill="url(#fillApprovedReviewedPredictions)"
              stroke="var(--chart-4)"
              stackId="c"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
