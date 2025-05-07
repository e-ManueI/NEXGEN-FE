import BackgroundLayout from "@/components/containers/web/background-layout";
import LogoLink from "@/components/containers/web/logo-link/logo-link";
import { SignupForm } from "@/components/containers/web/signup/signup-form";

export default function SignupPage() {
  return (
    <BackgroundLayout>
      <LogoLink />
      <SignupForm />
    </BackgroundLayout>
  );
}
