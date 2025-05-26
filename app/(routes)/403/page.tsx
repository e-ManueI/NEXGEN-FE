"use client"; // This page needs to be a client component for useRouter

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Assuming you have Card components
import { LockIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { AppRoutes } from "@/lib/routes";

const ForbiddenPage = () => {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push(AppRoutes.dashboard); // Navigate to the dashboard
  };

  const handleGoToLogin = async () => {
    await signOut({ callbackUrl: AppRoutes.login }); // Sign out and redirect to login
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md rounded-lg text-center shadow-lg">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <LockIcon className="h-8 w-8 text-red-800 dark:text-red-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            403 Forbidden
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            You do not have permission to access this page.
            <br />
            Please ensure you are logged in with the correct role.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoToDashboard}
            aria-label="Go to dashboard"
            className="w-full"
          >
            Go to Dashboard
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Or if you believe this is an error, please
            <Button
              variant={"ghost"}
              aria-label="Sign out and go to login"
              onClick={handleGoToLogin}
              className="text-primary hover:underline"
            >
              Sign in again
            </Button>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForbiddenPage;
