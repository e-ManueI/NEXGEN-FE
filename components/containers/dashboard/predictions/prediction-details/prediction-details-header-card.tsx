import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2 } from "lucide-react";
import { formatTimestamp } from "@/lib/date-utils";
import PredictionStatusBadge from "@/components/ui/prediction-status-badge";
import { PredictionResultResponse } from "@/app/_types/prediction";

function PredictionDetailsHeaderCard({
  data,
  showEditButton,
}: {
  data: PredictionResultResponse;
  showEditButton: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Prediction ID: {data.prediction.id}</CardTitle>
          {showEditButton && (
            <Button variant="outline" className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              <span>Edit Results</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Submission Details
            </h3>
            <dl className="grid grid-cols-2 gap-2">
              <dt className="text-sm font-medium">Company:</dt>
              <dd className="text-sm">{data.prediction.companyName}</dd>
              <dt className="text-sm font-medium">Submission Date:</dt>
              <dd className="text-sm">
                {formatTimestamp(data.prediction.submissionDate).formatted +
                  " " +
                  formatTimestamp(data.prediction.submissionDate).fromNow}
              </dd>
            </dl>
          </div>
          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              Processing Status
            </h3>
            <dl className="grid grid-cols-2 gap-2">
              <dt className="text-sm font-medium">Processed By:</dt>
              <dd className="text-sm">{data.prediction.processedBy}</dd>
              <dt className="text-sm font-medium">Prediction Status:</dt>
              <dd className="text-sm">
                <PredictionStatusBadge
                  status={data?.prediction.predictionStatus}
                />
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PredictionDetailsHeaderCard;
