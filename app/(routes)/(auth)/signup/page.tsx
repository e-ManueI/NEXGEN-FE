import LogoLink from "@/components/shared/logo-link/logo-link";
import BackgroundLayout from "@/components/web/background-layout";
import { SignupForm } from "@/components/web/signup/signup-form";

export default function SignupPage() {
  return (
    <BackgroundLayout>
      <LogoLink />
      <SignupForm />
    </BackgroundLayout>
  );
}
