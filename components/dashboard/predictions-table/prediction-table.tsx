import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

export type Prediction = {
  predictionId: string;
  modelVersion: string;
  companyName: string;
  status: string;
  approvedBy: string;
  approvedAt: string;
};

const columns: ColumnDef<Prediction>[] = [
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
    header: "Status",
  },
  {
    accessorKey: "approvedBy",
    header: "Approved By",
  },
  {
    accessorKey: "approvedAt",
    header: "Created At",
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
