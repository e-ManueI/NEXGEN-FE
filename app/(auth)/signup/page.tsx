// components
import { SignupForm } from "@/components/web/signup-form";
import LogoLink from "@/components/shared/logo-link/logo-link";
import BackgroundLayout from "@/components/web/background-layout";

export default function SignupPage() {
  return (
    <BackgroundLayout>
      <LogoLink />
      <SignupForm />
    </BackgroundLayout>
  );
}
