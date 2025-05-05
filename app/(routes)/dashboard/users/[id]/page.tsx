"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppRoutes } from "@/lib/routes";
import { ArrowLeft, Edit2 } from "lucide-react";
import Link from "next/link";
import React from "react";

const UserDetailsHome = ({ params }: { params: { id: string } }) => {
  const userId = params.id;

  const user = {
    id: userId,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@brinemasters.com",
    company: "BrineMasters Inc.",
    role: "client",
    status: "active",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, San Francisco, CA 94105",
    joinDate: "March 15, 2023",
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
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="mb-4 h-24 w-24">
                <AvatarImage
                  src="/placeholder.svg?height=96&width=96"
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback>{`${user.firstName[0]}${user.lastName[0]}`}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-muted-foreground mb-2 text-sm">{user.email}</p>
              <Badge className="mb-4">{user.role}</Badge>
              <Button
                variant="outline"
                className="mt-2 flex w-full items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-sm font-medium">
                  Company
                </dt>
                <dd className="text-base">{user.company}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm font-medium">
                  Status
                </dt>
                <dd className="text-base">
                  <Badge
                    className={
                      user.status === "active" ? "bg-green-500" : "bg-gray-500"
                    }
                  >
                    {user.status === "active" ? "Active" : "Deactivated"}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm font-medium">
                  Phone
                </dt>
                <dd className="text-base">{user.phone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm font-medium">
                  Address
                </dt>
                <dd className="text-base">{user.address}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm font-medium">
                  Join Date
                </dt>
                <dd className="text-base">{user.joinDate}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-sm font-medium">
                  User ID
                </dt>
                <dd className="text-base">{user.id}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>User Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmissionsTable />
        </CardContent>
      </Card> */}
    </div>
  );
};

export default UserDetailsHome;
