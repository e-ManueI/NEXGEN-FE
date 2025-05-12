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
import { PredictionTable } from "@/components/containers/dashboard/predictions-table/prediction-table";
import { Badge } from "@/components/ui/badge";
import UserTable from "../users/user-table";
import { Prediction } from "@/app/_types/prediction";
import { UserInfo } from "@/app/_types/user-info";
import {
  handleUserEdit,
  handleUserMgtAction,
} from "@/app/(routes)/dashboard/users/page";
import { useRouter } from "next/navigation";
import { useEditUser } from "@/app/hooks/useUsers";
import { AppRoutes } from "@/lib/routes";

export function DataTabs({
  predictions,
  users,
  onRefreshAll,
}: {
  predictions: Prediction[];
  users: UserInfo[];
  onRefreshAll: () => void;
}) {
  const router = useRouter();
  const { editUser, isEditing, editError } = useEditUser();

  return (
    <Tabs
      defaultValue="predictions"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="predictions">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="predictions">Predicted Results</SelectItem>
            <SelectItem value="users">Users</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="predictions">
            Predicted Results
            <Badge variant="secondary">{predictions.length}</Badge>
          </TabsTrigger>

          <TabsTrigger value="users">
            Users <Badge variant="secondary">{users.length}</Badge>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="predictions" className="flex flex-col">
        <PredictionTable data={predictions} onRefresh={onRefreshAll} />
      </TabsContent>
      <TabsContent value="users" className="flex flex-col">
        <UserTable
          data={users}
          onDelete={(id) => handleUserMgtAction("delete", id, onRefreshAll)}
          onActivate={(id) => handleUserMgtAction("activate", id, onRefreshAll)}
          onView={(id) => router.push(` ${AppRoutes.users}/${id}`)}
          onEdit={(updated) =>
            handleUserEdit(updated, editUser, onRefreshAll, editError)
          }
          isEditing={isEditing}
        />
      </TabsContent>
    </Tabs>
  );
}
