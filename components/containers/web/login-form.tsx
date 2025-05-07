"use client";

import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/app/_actions/auth/login-action";
import { LoginFormData, LoginState } from "@/lib/zod/types/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/routes";

const initialState: LoginState = {
  success: false,
  errors: {},
  message: undefined,
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  //  Destructure and ignore the prevState, then call loginAction with the form payload
  const [state, formAction] = useActionState(
    (_prevState: unknown, formData: FormData) => loginAction(formData),
    initialState,
  );
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Whenever the action returns a message, show it as a toast
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);

        // Clear the form
        setFormData({
          email: "",
          password: "",
        });

        // Redirect to dashboard
        router.push(AppRoutes.dashboard);
      } else {
        toast.error(state.message, {
          id: `login-error-${Date.now()}`,
        });
      }
    }
  }, [router, state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: LoginFormData) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={formAction} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* Heading */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-primary text-2xl font-bold">
                  Welcome back
                </h1>
                <p className="text-muted-foreground text-balance">
                  Login to your NextGen AI account
                </p>
              </div>

              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email">Business Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@business.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-invalid={!!state.errors?.email}
                />
                {state.errors?.email && (
                  <p className="text-destructive text-sm">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  aria-invalid={!!state.errors?.password}
                />
                {state.errors?.password && (
                  <p className="text-destructive text-sm">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full">
                Login
              </Button>

              {/* Footer */}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>

          {/* Image Placeholder (optional) */}
          <div className="bg-muted relative hidden md:block"></div>
        </CardContent>
      </Card>

      {/* Terms */}
      <div className="text-center text-xs text-balance text-white/50 *:[a]:underline-offset-4 *:[a]:hover:text-white *:[a]:hover:underline">
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
  );
}
