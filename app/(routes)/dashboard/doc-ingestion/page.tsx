import DocumentUpload from "@/components/containers/dashboard/agent-data/upload-card";
import IngestedTable from "@/components/containers/dashboard/agent-data/ingested-table";
import React from "react";

const DocIngestionPage = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <DocumentUpload />
          <IngestedTable />
        </div>
      </div>
    </div>
  );
};

export default DocIngestionPage;
