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
import { ColumnDef } from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";

const columns: ColumnDef<Prediction>[] = [
  {
    accessorKey: "predictionId",
    header: "Prediction ID",
    cell: ({ row }) => {
      return row.getValue("predictionId");
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
    header: "Predicted At",
    cell: ({ row }) => {
      return new Date(row.getValue("predictedAt")).toDateString();
    },
  },
  {
    accessorKey: "status",
    header: "Prediction Status",
    cell: ({ getValue }) => {
      const raw = getValue() as string;

      return raw === "done" ? (
        <Badge variant="default">{raw}</Badge>
      ) : (
        <Badge variant={"secondary"}>{raw}</Badge>
      );
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

interface PredictionTableProps {
  data: Prediction[];
  onRefresh?: () => void;
}

export function PredictionTable({ data, onRefresh }: PredictionTableProps) {
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
            <span>Refresh</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
