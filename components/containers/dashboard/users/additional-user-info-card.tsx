import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDetailResponse } from "@/app/_types/user-info";
import { formatTimestamp } from "@/lib/date-utils";
import ActiveStatusBadge from "@/components/ui/active-status-badge";

const AdditionalUserInfoCard: React.FC<UserDetailResponse> = ({
  id,
  joinDate,
  companyName,
  isActive,
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
              <dd className="text-base font-medium">
                {" "}
                {formatTimestamp(joinDate).formatted +
                  " " +
                  formatTimestamp(joinDate).fromNow}
              </dd>
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
                <ActiveStatusBadge isActive={isActive} />
              </dd>
            </div>

            <div>
              <dt className="text-muted-foreground mb-1 text-sm font-medium">
                Last Login
              </dt>
              <dd className="text-base font-medium">
                {" "}
                {formatTimestamp(lastLogin).formatted +
                  " " +
                  formatTimestamp(lastLogin).fromNow}
              </dd>
            </div>

            <div>
              <dt className="text-muted-foreground mb-1 text-sm font-medium">
                Last Updated
              </dt>
              <dd className="text-base font-medium">
                {formatTimestamp(lastUpdated).formatted +
                  " " +
                  formatTimestamp(lastUpdated).fromNow}
              </dd>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalUserInfoCard;
