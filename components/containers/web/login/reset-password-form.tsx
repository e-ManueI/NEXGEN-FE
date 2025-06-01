"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { API, AppRoutes } from "@/lib/routes";
import { ArrowLeft, LockIcon, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import BackgroundLayout from "../background-layout";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API.auth.resetPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (res.ok) {
        toast.success("Password reset! You can now log in.");
        router.replace(AppRoutes.login);
      } else {
        const { message } = await res.json();
        toast.error(message || "Something went wrong.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <BackgroundLayout>
      <Card className="overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Back Button */}
            <Link href={AppRoutes.login}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground mb-4 h-auto p-0 font-normal"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </Link>

            {/* Heading */}
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                <LockIcon className="text-primary h-6 w-6" />
              </div>
              <h1 className="text-primary text-2xl font-bold">
                Reset your password
              </h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your new password below to complete the reset process.
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                autoFocus
                disabled={loading}
              />
              <p className="text-muted-foreground text-xs">
                Choose a strong password with at least 8 characters.
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

            {/* Footer */}
            <div className="text-muted-foreground text-center text-sm">
              Remember your password?{" "}
              <Link
                href={AppRoutes.login}
                className="text-primary hover:text-primary/80 underline underline-offset-2"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Terms */}
      <div className="text-muted-foreground mt-6 text-center text-xs text-balance">
        By continuing, you agree to our{" "}
        <Link
          href="#"
          className="hover:text-foreground underline underline-offset-2"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="hover:text-foreground underline underline-offset-2"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </BackgroundLayout>
  );
}
