import { LoginForm } from "@/components/containers/web/login/login-form";

// components
import BackgroundLayout from "@/components/containers/web/background-layout";
import LogoLink from "@/components/containers/web/logo-link/logo-link";
import { Suspense } from "react";
import { RotateCcw } from "lucide-react";

export default function LoginPage() {
  return (
    <BackgroundLayout>
      <LogoLink />
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </BackgroundLayout>
  );
}

function LoginFallback() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 flex-col items-center justify-center">
          <RotateCcw className="text-primary h-6 w-6 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
