"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { API, AppRoutes } from "@/lib/routes";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RotateCcw } from "lucide-react";
import BackgroundLayout from "../background-layout";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API.auth.forgotPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        router.push(AppRoutes.login);
        toast.success("If this email exists, a reset link has been sent.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <BackgroundLayout>
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden">
            <CardContent className="">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Back Button */}
                <Link href={AppRoutes.login}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground mx-0 mb-4 h-auto p-0 font-normal"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Button>
                </Link>

                {/* Heading */}
                <div className="flex flex-col items-center space-y-2 text-center">
                  <h1 className="text-primary text-2xl font-bold">
                    Forgot your password?
                  </h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter your email and we&apos;ll send you a link to reset
                    your password.
                  </p>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    autoFocus
                    disabled={loading}
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>

                {/* Footer */}
                <div className="text-center text-sm">
                  Remember your password?{" "}
                  <Link
                    href={AppRoutes.login}
                    className="underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Terms */}
          <div className="mt-6 text-center text-xs text-balance text-white/50 *:[a]:underline-offset-4 *:[a]:hover:text-white *:[a]:hover:underline">
            By clicking continue, you agree to our{" "}
            <Link href="#" className="text-white/70">
              Terms of Service
            </Link>{" "}
            and{" "}
            <a href="#" className="text-white/70">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
}
