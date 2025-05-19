"use client";

import type React from "react";
import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { signupAction } from "@/app/_actions/auth/signup-action";
import { SignupFormData, SignupState } from "@/lib/zod/types/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AppRoutes } from "@/lib/routes";
import { RotateCcw } from "lucide-react";

const initialState: SignupState = {
  success: false,
  errors: {},
  message: undefined,
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState,
  );
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    retypePassword: "",
    companyName: "",
  });

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);

        // Redirect/replace to dashboard
        router.replace(AppRoutes.mnda);

        // Clear the form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          retypePassword: "",
          companyName: "",
        });
      } else {
        toast.error(state.message, {
          id: `signup-error-${Date.now()}`,
        });
      }
    }
  }, [router, state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={formAction} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-primary text-2xl font-bold">
                  Create an account
                </h1>
                <p className="text-muted-foreground text-balance">
                  Sign up for your NextGen AI account
                </p>
              </div>

              {[
                {
                  id: "firstName",
                  label: "First Name",
                  placeholder: "John",
                },
                {
                  id: "lastName",
                  label: "Last Name",
                  placeholder: "Doe",
                },
                {
                  id: "email",
                  label: "Business Email",
                  placeholder: "john@business.com",
                  type: "email",
                },
                {
                  id: "companyName",
                  label: "Company Name",
                  placeholder: "Acme Inc.",
                },
                {
                  id: "password",
                  label: "Password",
                  type: "password",
                },
                {
                  id: "retypePassword",
                  label: "Retype Password",
                  type: "password",
                },
              ].map(({ id, label, placeholder, type = "text" }) => (
                <div className="grid gap-2" key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    name={id}
                    type={type}
                    value={formData[id as keyof SignupFormData] ?? ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                  />
                  {state.errors?.[id as keyof SignupFormData] && (
                    <p className="text-destructive text-sm">
                      {state.errors[id as keyof SignupFormData]?.[0]}
                    </p>
                  )}
                </div>
              ))}

              <Button type="submit" className="w-full">
                {isPending ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                    Signin you up…
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            {/* Optional image */}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-balance text-white/50 *:[a]:underline-offset-4 *:[a]:hover:text-white *:[a]:hover:underline">
        By clicking Sign Up, you agree to our{" "}
        <a href="#" className="text-white/70">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-white/70">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
