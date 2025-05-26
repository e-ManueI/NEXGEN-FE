import { UserType } from "@/app/_db/enum";
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
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";

interface PredictionTableProps {
  title?: string;
  description?: string;
  data: Prediction[];
  onView: (id: string) => void;
  loading?: boolean;
  userRole?: string | undefined;
  onRefresh?: () => void;

  /**
   * Optional hook to disable the “view” click for certain rows.
   * Return `true` to allow the link, or `false` to render as plain text.
   */
  canViewRow?: (item: Prediction) => boolean;
  omitColumns?: Array<keyof Prediction>;
  /**
   * Optional map to override default column headers.
   * Keys are column IDs, values are custom header names.
   */
  customColumnNames?: Partial<Record<keyof Prediction, string>>;
}

export function PredictionTable({
  title = "Recent Predictions",
  description = "See a list of predictions",
  data,
  onView,
  loading,
  userRole,
  onRefresh,
  canViewRow,
  omitColumns = [],
  customColumnNames = {}, // Default to empty object
}: PredictionTableProps) {
  // Define columns
  const allColumns: ColumnDef<Prediction>[] = [
    {
      id: "predictionId",
      accessorKey: "predictionId",
      header: customColumnNames.predictionId || "Prediction ID",
      cell: ({ row }) => {
        const { predictionId } = row.original;
        const enabled = canViewRow ? canViewRow(row.original) : true;

        const className = cn(
          enabled
            ? "cursor-pointer font-semibold capitalize hover:underline "
            : "capitalize font-normal",
        );

        return enabled ? (
          <div className={className} onClick={() => onView(predictionId)}>
            {predictionId}
          </div>
        ) : (
          <div className={className}>{predictionId}</div>
        );
      },
    },
    {
      id: "companyName",
      accessorKey: "companyName",
      header: customColumnNames.companyName || "Company Name",
    },
    {
      id: "modelVersion",
      accessorKey: "modelVersion",
      header: customColumnNames.modelVersion || "Model Version",
    },
    {
      id: "predictedAt",
      accessorKey: "predictedAt",
      header: customColumnNames.predictedAt || "Submitted At",
      cell: ({ row }) => {
        return new Date(row.getValue("predictedAt")).toLocaleString();
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: customColumnNames.status || "Prediction Status",
      cell: ({ getValue }) => {
        const raw = getValue() as string;

        return <PredictionStatusBadge status={raw} />;
      },
    },
    {
      id: "isApproved",
      accessorKey: "isApproved",
      header: customColumnNames.isApproved || "Approval Status",
      cell: ({ row }) => {
        const approved = row.getValue("isApproved");
        if (!approved) return <Badge variant="secondary">Pending</Badge>;

        switch (userRole) {
          case UserType.CLIENT:
            return <Badge>Done</Badge>;
          case UserType.ADMIN:
          case UserType.EXPERT:
            return <Badge>Approved</Badge>;
          default:
            return <Badge>Approved</Badge>;
        }
      },
    },
  ];

  // 2) Filter out any columns the parent wants omitted
  const columns = allColumns.filter(
    (col) => !omitColumns.includes(col.id as keyof Prediction),
  );

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
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
        <DataTable columns={columns} data={data} loading={loading} />
      </CardContent>
    </Card>
  );
}
