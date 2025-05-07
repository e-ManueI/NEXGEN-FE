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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddUserDialog } from "./add-user-dialog";
import Link from "next/link";
import { AppRoutes } from "@/lib/routes";
import { EditUserDialog } from "./edit-user-dialog";

export type User = {
  id: string;
  name: string;
  email: string;
  companyName: string;
  role: string;
  isActive: string;
};

interface UserTableProps {
  data: User[];
}

export default function UserTable({ data }: UserTableProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const user = row.original;

        return (
          <Link
            href={`
        ${AppRoutes.users}/${user.id}`}
          >
            <div className="font-semibold capitalize hover:underline">
              {row.getValue("name")}
            </div>
          </Link>
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
      accessorKey: "companyName", // match your User type
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditingUser(user)}>
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem>Delete User</DropdownMenuItem>
              <DropdownMenuItem>Deactivate User</DropdownMenuItem>
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
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
      />
    </>
  );
}
