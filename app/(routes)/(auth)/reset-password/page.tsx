import ResetPasswordForm from "@/components/containers/web/login/reset-password-form";
import { RotateCcw } from "lucide-react";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 flex-col items-center justify-center">
          <RotateCcw className="text-primary h-6 w-6 animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
