"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/ui/data-column-header";
import { DataTable } from "@/components/ui/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddUserDialog } from "./add-user-dialog";
import Link from "next/link";
import { AppRoutes } from "@/lib/routes";
import { EditUserDialog } from "./edit-user-dialog";
import { UserInfo } from "@/app/_types/user-info";

interface UserTableProps {
  data: UserInfo[];
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  onView: (id: string) => void;
  onEdit: (updated: { // TODO: Use interface pick/omit
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }) => void;
  isEditing: boolean;
}

export default function UserTable({
  data,
  onDelete,
  onActivate,
  onView,
  onEdit,
  isEditing,
}: UserTableProps) {
  const [editingUser, setEditingUser] = useState<UserInfo | null>(null);

  // when dialog “Save” is clicked, this callback fires:
  const handleDialogSubmit = (formData: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }) => {
    if (!editingUser) return;
    onEdit({ id: editingUser.id, ...formData });
    setEditingUser(null);
  };

  const columns: ColumnDef<UserInfo>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div
            className="cursor-pointer font-semibold capitalize hover:underline"
            onClick={() => onView(row.original.id)}
          >
            {row.getValue("name")}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: "companyName", // match your UserInfo type
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company" />
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="sr-only">Actions</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`${AppRoutes.users}/${user.id}`}>View User</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditingUser(row.original);
                }}
              >
                Edit User
              </DropdownMenuItem>
              {row.original.isActive ? (
                <DropdownMenuItem onClick={() => onDelete(row.original.id)}>
                  Block User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onActivate(row.original.id)}>
                  Activate User
                </DropdownMenuItem>
              )}

              {/* <DropdownMenuItem>Deactivate User</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </div>
          <AddUserDialog />
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>

      {/* render one EditUserDialog, controlled by state */}
      <EditUserDialog
        open={editingUser !== null}
        user={editingUser}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
        onSubmit={handleDialogSubmit}
        isEditing={isEditing}
      />
    </>
  );
}
