"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Prediction,
  PredictionTable,
} from "@/components/containers/dashboard/predictions-table/prediction-table";
import { Badge } from "@/components/ui/badge";
import {
  Submission,
  SubmissionTable,
} from "../submissions-table/submission-table";
import UserTable, { User } from "../users/user-table";

const samplePredictionData: Prediction[] = [
  {
    predictionId: "1",
    modelVersion: "v1.0",
    companyName: "TechCorp",
    status: "Approved",
    approvedBy: "Alice",
    approvedAt: "2025-05-06",
  },
  {
    predictionId: "2",
    modelVersion: "v2.1",
    companyName: "FinanceHub",
    status: "Pending",
    approvedBy: "Bob",
    approvedAt: "2025-05-05",
  },
];

const sampleSubmissionData: Submission[] = [
  {
    predictionId: "1",
    companyName: "Acme Corp",
    sampleCount: 10,
    status: "Approved",
    modelVersion: "v1.0",
    approvedBy: "John Doe",
    approvedAt: "2023-03-15T10:00:00Z",
  },
  {
    predictionId: "2",
    companyName: "Acme Corp",
    sampleCount: 10,
    status: "Approved",
    modelVersion: "v1.0",
    approvedBy: "John Doe",
    approvedAt: "2023-03-15T10:00:00Z",
  },
];

const sampleUsersData: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    companyName: "Acme Corp",
    role: "Admin",
    isActive: "Yes",
  },
  // …more users
];

export function DataTabs() {
  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">Predicted Results</SelectItem>
            <SelectItem value="past-performance">Submissions</SelectItem>
            <SelectItem value="key-personnel">Users</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">
            Predicted Results<Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="past-performance">
            Submissions <Badge variant="secondary">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel">
            Users <Badge variant="secondary">1</Badge>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="outline" className="flex flex-col">
        <PredictionTable data={samplePredictionData} />
      </TabsContent>
      <TabsContent value="past-performance">
        <SubmissionTable data={sampleSubmissionData} />
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col">
        <UserTable data={sampleUsersData} />
      </TabsContent>
    </Tabs>
  );
}
