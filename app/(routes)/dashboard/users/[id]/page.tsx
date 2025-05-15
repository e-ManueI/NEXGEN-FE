"use client";

import AdditionalUserInfoCard from "@/components/containers/dashboard/users/additional-user-info-card";
import { UserDetailCard } from "@/components/containers/dashboard/users/user-detail-card";
import { Button } from "@/components/ui/button";
import WebLoader from "@/components/ui/web-loader";
import { useEditUser, useUserDetail } from "@/app/hooks/admin/useUsers";
import { AppRoutes } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { usePredictions } from "@/app/hooks/usePredictions";
import { PredictionTable } from "@/components/containers/dashboard/predictions/predictions-table/prediction-table";
import { handleUserEdit } from "@/app/_actions/user-management/edit-user-action";

const UserDetailsHome = () => {
  const params = useParams();
  const router = useRouter();
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

  if (pLoading || uLoading) return <WebLoader />;
  if (uError || pError) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            // if there’s a history entry, go back;
            // otherwise fall-back to dashboard (optional)
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push(AppRoutes.dashboard);
            }
          }}
        >
          <ArrowLeft className="h-4 w-4" />
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

      <PredictionTable
        data={predictions}
        onRefresh={refreshUser}
        loading={pLoading}
        onView={(id) => router.push(AppRoutes.predictionDetails(id))}
      />
    </div>
  );
};

export default UserDetailsHome;
