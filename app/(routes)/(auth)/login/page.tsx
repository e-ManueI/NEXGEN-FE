import { LoginForm } from "@/components/containers/web/login-form";

// components
import BackgroundLayout from "@/components/containers/web/background-layout";
import LogoLink from "@/components/containers/web/logo-link/logo-link";

export default function LoginPage() {
  return (
    <BackgroundLayout>
      <LogoLink />
      <LoginForm />
    </BackgroundLayout>
  );
}
