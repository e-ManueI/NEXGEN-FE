import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AdditionalUserInfoCardProps {
  id: string;
  joinDate: string;
  companyName: string;
  status: string;
  lastLogin: string;
  lastUpdated: string;
}

const AdditionalUserInfoCard: React.FC<AdditionalUserInfoCardProps> = ({
  id,
  joinDate,
  companyName,
  status,
  lastLogin,
  lastUpdated,
}) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Additional User Information</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="grid h-full grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <div>
              <dt className="text-muted-foreground mb-1 text-sm font-medium">
                User ID
              </dt>
              <dd className="text-base font-medium">{id}</dd>
            </div>

            <div>
              <dt className="text-muted-foreground mb-1 text-sm font-medium">
                Joined Date
              </dt>
              <dd className="text-base font-medium">{joinDate}</dd>
            </div>

            <div>
              <dt className="text-muted-foreground mb-1 text-sm font-medium">
                Company Name
              </dt>
              <dd className="text-base font-medium">{companyName}</dd>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <dt className="text-muted-foreground mb-1 text-sm font-medium">
                Status
              </dt>
              <dd className="text-base">
                <Badge
                  className={
                    status === "active"
                      ? "bg-primary"
                      : "bg-gray-500 hover:bg-gray-600"
                  }
                >
                  {status === "active" ? "Active" : "Deactivated"}
                </Badge>
              </dd>
            </div>

            <div>
              <dt className="text-muted-foreground mb-1 text-sm font-medium">
                Last Login
              </dt>
              <dd className="text-base font-medium">{lastLogin}</dd>
            </div>

            <div>
              <dt className="text-muted-foreground mb-1 text-sm font-medium">
                Last Updated
              </dt>
              <dd className="text-base font-medium">{lastUpdated}</dd>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalUserInfoCard;
