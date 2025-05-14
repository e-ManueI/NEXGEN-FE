import { Prediction } from "@/app/_types/prediction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import PredictionStatusBadge from "@/components/ui/prediction-status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";

interface PredictionTableProps {
  data: Prediction[];
  onView: (id: string) => void;
  loading?: boolean;
  onRefresh?: () => void;
}

export function PredictionTable({
  data,
  onView,
  loading,
  onRefresh,
}: PredictionTableProps) {
  const columns: ColumnDef<Prediction>[] = [
    {
      accessorKey: "predictionId",
      header: "Prediction ID",
      cell: ({ row }) => {
        return (
          <div
            className="cursor-pointer font-semibold capitalize hover:underline"
            onClick={() => onView(row.original.predictionId)}
          >
            {row.getValue("predictionId")}
          </div>
        );
      },
    },
    {
      accessorKey: "companyName",
      header: "Company Name",
    },
    {
      accessorKey: "modelVersion",
      header: "Model Version",
    },
    {
      accessorKey: "predictedAt",
      header: "Submitted At",
      cell: ({ row }) => {
        return new Date(row.getValue("predictedAt")).toLocaleString();
      },
    },
    {
      accessorKey: "status",
      header: "Prediction Status",
      cell: ({ getValue }) => {
        const raw = getValue() as string;

        return <PredictionStatusBadge status={raw} />;
      },
    },
    {
      accessorKey: "isApproved",
      header: "Approval Status",
      cell: ({ row }) => {
        return row.getValue("isApproved") ? (
          <Badge variant="default">Approved</Badge>
        ) : (
          <Badge variant={"secondary"}>Pending</Badge>
        );
      },
    },
  ];

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Recent Predictions</CardTitle>
          <CardDescription>See a list of predictions</CardDescription>
        </div>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="space-x-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
