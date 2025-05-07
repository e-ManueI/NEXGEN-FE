import FeaturesSection from "@/components/containers/web/features-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <FeaturesSection />

      <div className="flex items-center justify-center gap-8">
        <Button asChild size={"lg"}>
          <Link href="/signup">Register</Link>
        </Button>
        <Button variant={"outline"} size={"lg"}>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
