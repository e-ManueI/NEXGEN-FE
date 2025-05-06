import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

export type Submission = {
  predictionId: string;
  companyName: string;
  sampleCount: number;
  status: string;
  modelVersion: string;
  approvedBy: string;
  createdAt: string;
};

const columns: ColumnDef<Submission>[] = [
  {
    accessorKey: "companyName",
    header: "Company Name",
  },
  {
    accessorKey: "sampleCount",
    header: "Sample Count",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "modelVersion",
    header: "Model Version",
  },
  {
    accessorKey: "approvedBy",
    header: "Approved By",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];

interface SubmissionTableProps {
  data: Submission[];
}

export function SubmissionTable({ data }: SubmissionTableProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>
            Manage user submissions and predictions
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
