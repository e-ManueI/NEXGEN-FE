import { Prediction } from "@/app/_types/prediction";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { formatTimestamp } from "@/lib/date-formatter";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Prediction>[] = [
  {
    accessorKey: "predictedAt",
    header: "Submission Time",
    cell: ({ getValue }) => {
      const raw = getValue() as string;
      const { formatted } = formatTimestamp(raw);

      return <div>{formatted}</div>;
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
  },
];

interface PredictionTableProps {
  data: Prediction[];
}

export function PredictionTable({ data }: PredictionTableProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Recent Predictions</CardTitle>
          <CardDescription>See a list of predictions</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
