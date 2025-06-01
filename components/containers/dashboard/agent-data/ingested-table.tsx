"use client";

import * as React from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  FileText,
  MoreVertical,
  AlertCircle,
  RefreshCcw,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ColumnDef } from "@tanstack/react-table";
import { useDocs } from "@/app/hooks/internal/doc-ingestion/use-docs-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function IngestedTable() {
  const {
    docs,
    loading: docsLoading,
    refreshing: docsRefreshing,
    error: docsError,
    deleteDoc,
    fetchDocs,
    mutate,
  } = useDocs();

  // Track previous refreshing state to detect when refresh completes
  const prevRefreshing = React.useRef(false);
  React.useEffect(() => {
    if (prevRefreshing.current && !docsRefreshing && docsError) {
      toast.error("Refresh failed", {
        description: "Could not refresh document status.",
      });
    }
    prevRefreshing.current = docsRefreshing;
  }, [docsRefreshing, docsError]);

  const handleDelete = React.useCallback(
    async (filename: string) => {
      if (!window.confirm(`Delete ${filename}? This cannot be undone.`)) return;
      try {
        await deleteDoc(filename);
        toast.success("Document deleted", {
          description: `${filename} was deleted successfully.`,
        });
      } catch {
        toast.error("Delete failed", {
          description: `Failed to delete ${filename}.`,
        });
      }
    },
    [deleteDoc],
  );

  const handleRefresh = async () => {
    try {
      await fetchDocs();
      await mutate();
      // toast will be handled by useEffect
    } catch {
      // toast will be handled by useEffect
    }
  };

  // Only two columns: filename and actions
  const columns = React.useMemo<ColumnDef<string>[]>(
    () => [
      {
        id: "filename",
        header: "Filename",
        cell: (info) => {
          const filename = info.row.original;
          const display =
            filename.length > 24
              ? `${filename.slice(0, 50)}...${filename.slice(-30)}`
              : filename;
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="block max-w-xs cursor-pointer truncate font-mono text-xs whitespace-nowrap underline decoration-dotted"
                  style={{ maxWidth: 400, display: "block" }}
                >
                  {display}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <span className="font-mono text-xs break-all">{filename}</span>
              </TooltipContent>
            </Tooltip>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const filename = info.row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
              {/* <DropdownMenuItem
                onClick={() => handleCheckStatus(row.original.filename)}
              >
                Check Status
              </DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={() => handleDelete(filename)}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [handleDelete],
  );

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>
            <div className="inline-flex items-center justify-baseline gap-x-1">
              <FileText className="h-5 w-5" />
              <span className="text-lg font-semibold">
                Document Status & Actions
              </span>
            </div>
          </CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="space-x-1"
          disabled={docsRefreshing}
        >
          {docsRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <RefreshCcw className="h-4 w-4" />
              <span>Refresh</span>
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {docsError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{docsError}</AlertDescription>
          </Alert>
        )}
        {/* docs is string[] */}
        <DataTable columns={columns} data={docs} loading={docsLoading} />
      </CardContent>
    </Card>
  );
}
