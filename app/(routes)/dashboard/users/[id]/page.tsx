"use client";

import AdditionalUserInfoCard from "@/components/containers/dashboard/users/additional-user-info-card";
import { UserDetailCard } from "@/components/containers/dashboard/users/user-detail-card";
import { Button } from "@/components/ui/button";
import WebLoader from "@/components/ui/web-loader";
import { useEditUser, useUserDetail } from "@/app/hooks/useUsers";
import { AppRoutes } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { usePredictions } from "@/app/hooks/usePredictions";
import { PredictionTable } from "@/components/containers/dashboard/predictions-table/prediction-table";
import { handleUserEdit } from "@/app/_actions/edit-user-action";

const UserDetailsHome = () => {
  const params = useParams();
  const userId = params.id as string;
  const {
    user,
    loading: uLoading,
    error: uError,
    refresh: refreshUser,
  } = useUserDetail(userId);
  const {
    predictions,
    loading: pLoading,
    error: pError,
  } = usePredictions(userId);
  const { editUser, isEditing, editError } = useEditUser();

  if (uLoading || pLoading) return <WebLoader />;
  if (uError || pError) return <div>{uError?.message ?? pError?.message}</div>;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={AppRoutes.users}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {user && (
          <UserDetailCard
            {...user}
            onEdit={(updated) =>
              handleUserEdit(updated, editUser, refreshUser, editError)
            }
            isEditing={isEditing}
          />
        )}
        {user && <AdditionalUserInfoCard {...user} />}
      </div>

      <PredictionTable data={predictions} />
    </div>
  );
};

export default UserDetailsHome;
