"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

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
import { UserInfo } from "@/app/_types/user-info";
import { UserType } from "@/app/_db/enum";

interface EditUserDialogProps {
  children?: React.ReactNode;
  open: boolean;
  user: UserInfo | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }) => void;
  isEditing: boolean;
}

export function EditUserDialog({
  children,
  user,
  open,
  onOpenChange,
  onSubmit,
  isEditing,
}: EditUserDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserType>(UserType.CLIENT);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  // 2) When the dialog opens or the user prop changes, populate the fields
  useEffect(() => {
    if (user) {
      const parts = user.name.split(" ");
      setFirstName(parts.shift() || "");
      setLastName(parts.join(" ") || "");
      setEmail(user.email);
      setRole(user.role as UserType);
      // reset passwords
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [user, open]);
  // Keep match flag up to date
  useEffect(() => {
    setPasswordMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ firstName, lastName, email, role });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Edit a user account by updating out the form below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.currentTarget.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.currentTarget.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>

            {/* Passwords */}
            {/* <PasswordField
              id="newPassword"
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              error={!passwordMatch}
              errorMessage="Passwords do not match"
            />
            <PasswordField
              id="confirmPassword"
              label="Retype Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={!passwordMatch}
              errorMessage="Passwords do not match"
            /> */}

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserType)}
                className="focus:border-secondary focus:ring-secondary block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none"
              >
                <option value="" disabled>
                  Select a role
                </option>
                <option value={UserType.ADMIN}>Admin</option>
                <option value={UserType.CLIENT}>Client</option>
                <option value={UserType.EXPERT}>Expert</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!passwordMatch}>
              {isEditing ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * PasswordField stays the same as you had it—
 * it just toggles between text/password and shows an error if needed.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  errorMessage,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={error ? "border-red-500" : ""}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0 h-full px-3 py-2"
          onClick={() => setShow((v) => !v)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="sr-only">
            {show ? "Hide" : "Show"} {label.toLowerCase()}
          </span>
        </Button>
      </div>
      {error && errorMessage && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
