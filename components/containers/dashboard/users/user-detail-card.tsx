"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EditUserDialog } from "./edit-user-dialog";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { UserInfo } from "@/app/_types/user-info";

interface Props extends UserInfo {
  onEdit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }) => void;
  isEditing: boolean;
}

export const UserDetailCard: React.FC<Props> = ({
  id,
  name,
  email,
  role,
  onEdit,
  isEditing,
}) => {
  const [open, setOpen] = useState(false);

  // split name
  // const [firstName, lastName] = name.split(" ");

  return (
    <Card className="md:col-span-1">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Avatar className="mb-4 h-24 w-24">
            <AvatarImage
              src="/placeholder.svg?height=96&width=96"
              alt={`${name}`}
            />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{`${name}`}</h2>
          <p className="text-muted-foreground text-sm">{email}</p>
          <Badge className="mb-4">{role}</Badge>

          <EditUserDialog
            open={open}
            user={{ id, name, email, role, companyName: "", isActive: true }}
            isEditing={isEditing}
            onOpenChange={setOpen}
            onSubmit={(data) => {
              onEdit(data);
              setOpen(false);
            }}
          >
            <Button
              variant="outline"
              className="mt-4 flex w-full items-center justify-center gap-2"
              disabled={isEditing}
            >
              <Edit2 className="h-4 w-4" />
              <span> {isEditing ? "Saving…" : "Edit Profile"}</span>
            </Button>
          </EditUserDialog>
        </div>
      </CardContent>
    </Card>
  );
};
