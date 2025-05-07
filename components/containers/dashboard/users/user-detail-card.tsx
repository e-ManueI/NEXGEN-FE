"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EditUserDialog } from "./edit-user-dialog";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { User } from "./user-table";

export interface UserDetailCardProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const UserDetailCard: React.FC<UserDetailCardProps> = ({
  id,
  firstName,
  lastName,
  email,
  role,
}) => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // 2) Build the full User shape for the dialog
  const user: User = {
    id,
    name: `${firstName} ${lastName}`,
    email,
    companyName: "", // fill in or extend props if you have it
    role,
    isActive: "active", // ditto
  };
  return (
    <Card className="md:col-span-1">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Avatar className="mb-4 h-24 w-24">
            <AvatarImage
              src="/placeholder.svg?height=96&width=96"
              alt={`${firstName} ${lastName}`}
            />
            <AvatarFallback>
              {firstName[0]}
              {lastName[0]}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{`${firstName} ${lastName}`}</h2>
          <p className="text-muted-foreground text-sm">{email}</p>
          <Badge className="mb-4">{role}</Badge>

          <EditUserDialog
            open={editingUser !== null}
            onOpenChange={(open) => {
              setEditingUser(open ? user : null);
            }}
          >
            <Button
              variant="outline"
              className="mt-4 flex w-full items-center justify-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          </EditUserDialog>
        </div>
      </CardContent>
    </Card>
  );
};
