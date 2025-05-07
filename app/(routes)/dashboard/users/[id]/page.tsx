"use client";

import {
  Submission,
  SubmissionTable,
} from "@/components/dashboard/submissions/submission-table";
import AdditionalUserInfoCard from "@/components/dashboard/users/additional-user-info-card";
import { UserDetailCard } from "@/components/dashboard/users/user-detail-card";
import { Button } from "@/components/ui/button";
import { AppRoutes } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const UserDetailsHome = () => {
  const params = useParams();
  const userId = params.id as string;

  const sampleData: Submission[] = [
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

  const detailUser = {
    id: userId,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@brinemasters.com",
    company: "BrineMasters Inc.",
    role: "client",
    status: "active" as "active" | "deactivated",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, San Francisco, CA 94105",
    joinDate: "March 15, 2023",
  };

  const infoUser = {
    id: "u-123",
    joinDate: "2024-09-12",
    companyName: "Oceanic Industries",
    status: "active" as const,
    lastLogin: "2025-05-05 16:45",
    lastUpdated: "2025-05-06 08:30",
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={AppRoutes.users}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <UserDetailCard {...detailUser} />
        <AdditionalUserInfoCard {...infoUser} />
      </div>

      <SubmissionTable data={sampleData} />
    </div>
  );
};

export default UserDetailsHome;
