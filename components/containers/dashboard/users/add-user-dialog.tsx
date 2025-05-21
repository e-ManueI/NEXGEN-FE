"use client";

import React, { useState, useTransition } from "react";
import { Eye, EyeOff, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createUserAction } from "@/app/_actions/user-management/create-user-action";
import { useRouter } from "next/navigation";

export function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [genericError, setGenericError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const router = useRouter();

  // React 18 Transition for non-blocking state
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    setFieldErrors({});
    setGenericError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createUserAction(formData);

      if (result.success) {
        // Server action returned { success: true, user: {..}  }
        toast.success("User created", {
          description: result.user.name,
        });
        setOpen(false);
        form.reset();
        router.refresh();
      } else {
        console.error("Create user error:", result);
        // Handle validation errors
        if (result.errors) setFieldErrors(result.errors);
        // Handle top-level message (conflict, unauthorized, server failure)
        else if (result.message) setGenericError(result.message);
        else setGenericError("Failed to create user.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-dashed">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account by filling out the form below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input name="firstName" id="firstName" />
                {fieldErrors.firstName && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.firstName.join(" ")}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input name="lastName" id="lastName" required />
                {fieldErrors.lastName && (
                  <p className="text-sm text-red-500">
                    {fieldErrors.lastName.join(" ")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input name="companyName" id="companyName" required />
              {fieldErrors.companyName && (
                <p className="text-sm text-red-500">
                  {fieldErrors.companyName.join(" ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" id="email" type="email" required />
              {fieldErrors.email && (
                <p className="text-sm text-red-500">
                  {fieldErrors.email.join(" ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {fieldErrors.password && (
                <p className="text-sm text-red-500">
                  {fieldErrors.password.join(" ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Retype Password</Label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  id="confirmPassword"
                  type={showRetypePassword ? "text" : "password"}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-full px-3 py-2"
                  onClick={() => setShowRetypePassword((v) => !v)}
                >
                  {showRetypePassword ? <EyeOff /> : <Eye />}
                  <span className="sr-only">
                    {showRetypePassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {fieldErrors.confirmPassword.join(" ")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                defaultValue="" // start blank
                required
                className="focus:border-secondary focus:ring-secondary block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none"
              >
                <option value="" disabled>
                  Select a role
                </option>
                <option value="admin">Admin</option>
                <option value="client">Client</option>
                <option value="expert">Expert</option>
              </select>
              {fieldErrors.role && (
                <p className="text-sm text-red-500">
                  {fieldErrors.role.join(" ")}
                </p>
              )}
            </div>
          </div>

          {genericError && <p className="mb-4 text-red-500">{genericError}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
