"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// import { Download, FileText } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/routes";
import { useAcceptPolicy, useMnda } from "@/app/hooks/client/useMnda";
import WebLoader from "@/components/ui/web-loader";
import RenderMarkdownRenderer from "@/components/ui/markdown-renderer";
import AlertCard from "@/components/ui/alert-card";

const MndaPage = () => {
  const [isTermsChecked, setIsTermsChecked] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: policy, isLoading: isFetching } = useMnda();

  const {
    accept,
    isLoading: isAccepting,
    error: acceptError,
  } = useAcceptPolicy();

  const handleSubmit = async () => {
    if (!isTermsChecked) {
      toast.error("Please agree to the terms before proceeding");
      return;
    }

    if (!policy?.id) {
      toast.error("Policy not loaded yet.");
      return;
    }

    try {
      const res = await accept(policy?.id);

      if (res.code == 200 && res.data) {
        toast("Agreement Accepted", {
          description: res.message,
        });
        router.replace(AppRoutes.dashboard);
      } else {
        toast.error("Something went wrong", { description: res.message });
      }
    } catch (error) {
      console.error("Error accepting policy:", error);
      toast.error("Something went wrong", {
        description: error ? (error as Error).message : acceptError?.message,
      });
      return;
    }
  };

  // TODO: Add download button if required
  //   const handleDownload = () => {
  //     toast("Document Downloaded", {
  //       description: "NDA document has been downloaded successfully.",
  //     });
  //   };

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  };

  if (isFetching) {
    return <WebLoader />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-12">
      <Card className="w-full max-w-4xl shadow-sm">
        <CardHeader className="space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary text-xl font-bold sm:text-2xl md:text-3xl">
              {policy?.name}
            </CardTitle>
            {/* TODO: Add download button if required  */}
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              aria-label="Download agreement"
              className="hidden sm:flex"
            >
              <Download className="h-5 w-5" />
            </Button> */}
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {policy?.description}
          </p>
        </CardHeader>

        <CardContent>
          <div
            ref={contentRef}
            className="prose prose-sm h-[40vh] max-w-none overflow-y-auto rounded-xl bg-white sm:h-[45vh] md:h-[50vh]"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Confidentiality Agreement
              </h2>
              <span className="text-muted-foreground text-xs">
                Effective Date: {policy?.effectiveDate}
              </span>
            </div>

            {policy ? (
              <RenderMarkdownRenderer content={policy?.content} />
            ) : (
              <AlertCard
                title="No Active MNDA found"
                description="Failed to load agreement. Please try again later."
              />
            )}
            <div className="mt-6 text-center">
              <p className="text-sm font-medium">--- End of Agreement ---</p>
            </div>
          </div>

          <Button
            variant="link"
            onClick={scrollToBottom}
            className="text-muted-foreground mt-2 h-auto items-end p-0 text-xs"
          >
            Scroll to bottom
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          <div className="flex items-start space-x-2 sm:items-center sm:space-x-4">
            <Checkbox
              id="terms"
              checked={isTermsChecked}
              onCheckedChange={(checked) => {
                setIsTermsChecked(checked as boolean);
              }}
              className="mt-1 sm:mt-0"
            />
            <div className="space-y-1">
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I have read and agree to the terms of this Non-Disclosure
                Agreement
              </Label>
            </div>
          </div>

          <div className="flex w-full space-x-2 sm:w-auto">
            <Button
              onClick={handleSubmit}
              className="flex-1 sm:flex-initial"
              disabled={!isTermsChecked || isAccepting}
            >
              {isAccepting ? "Accepting..." : " Accept Agreement"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MndaPage;
