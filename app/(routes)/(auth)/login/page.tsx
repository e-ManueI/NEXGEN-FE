import { LoginForm } from "@/components/web/login-form";

// components
import LogoLink from "@/components/shared/logo-link/logo-link";
import BackgroundLayout from "@/components/web/background-layout";

export default function LoginPage() {
  return (
    <BackgroundLayout>
      <LogoLink />
      <LoginForm />
    </BackgroundLayout>
  );
}
