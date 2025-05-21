export type ReviewedPredictionVersionsResponse = {
  versions: {
    id: string;
    name: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
};

export type ReviewedVersionContentResponse = {
  isApproved: boolean;
  content: {
    chloralkaliInDepth: string;
    chloralkaliSummary: string;
    chloralkaliComparison: string;
    electrodialysisInDepth: string;
    electrodialysisSummary: string;
  };
};

export type CreateNewVersionPayload = {
  content: {
    chloralkaliInDepth: string;
    chloralkaliSummary: string;
    chloralkaliComparison: string;
    electrodialysisInDepth: string;
    electrodialysisSummary: string;
  };
  modelVersion: string;
  approve: boolean;
};

export type CreateNewVersionResponse = {
  id: string;
  name: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApproveReviewedVersionPayload = {
  approve: boolean;
  reviewedPredictionId: string;
};

export type ApproveReviewedVersionResponse = {
  id: string;
  modelVersion: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
};
